import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PatientsDirectory from '../src/pages/PatientsDirectory';
import { AuthProvider } from '../src/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Data Isolation and Logical Errors in PatientsDirectory', () => {
  beforeEach(() => {
    localStorage.clear();
    
    // Seed localStorage with multiple patients from different clinics
    const seedPatients = [
      { id: '1', name: 'Patient One', clinicId: 'clinic_1', status: 'Active' },
      { id: '2', name: 'Patient Two', clinicId: 'clinic_1', status: 'Active' },
      { id: '3', name: 'Patient Three', clinicId: 'clinic_2', status: 'Active' },
      { id: '4', name: 'Global Patient', clinicId: null, status: 'Active' }, // Unmigrated legacy
    ];
    localStorage.setItem('medcore_patients', JSON.stringify(seedPatients));
    localStorage.setItem('medcore_clinics', JSON.stringify([
      { _id: 'clinic_1', name: 'Clinic 1' },
      { _id: 'clinic_2', name: 'Clinic 2' }
    ]));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('super admin should see all patients', async () => {
    localStorage.setItem('mockSystemUser', JSON.stringify({ id: 'admin', role: 'SUPER_ADMIN', name: 'Admin', clinicId: null }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <PatientsDirectory />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Clinic 1, 2, and global patients should be visible natively if we wait for them to render
      // Testing-library text match might not be exact if it splits elements, but testing the patient names
      expect(screen.queryByText('Patient One')).toBeInTheDocument();
      expect(screen.queryByText('Patient Three')).toBeInTheDocument();
      expect(screen.queryByText('Global Patient')).toBeInTheDocument();
    });
  });

  it('clinic 1 user should only see their own clinic and generic unassigned patients', async () => {
    localStorage.setItem('mockSystemUser', JSON.stringify({ id: 'doc1', role: 'DOCTOR', name: 'Doctor 1', clinicId: 'clinic_2' }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <PatientsDirectory />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Should not see Clinic 1 patient
      expect(screen.queryByText('Patient One')).not.toBeInTheDocument();
      // Should see Clinic 2 patient
      expect(screen.queryByText('Patient Three')).toBeInTheDocument();
      // Should see global patient (clinicId is null/undefined)
      expect(screen.queryByText('Global Patient')).toBeInTheDocument();
    });
  });

  it('deletion inside a clinic scope must not delete patients from other clinics', async () => {
    // Seed an auth context to be clinic 1
    localStorage.setItem('mockSystemUser', JSON.stringify({ id: 'doc1', role: 'DOCTOR', name: 'Doctor 1', clinicId: 'clinic_1' }));

    // Mock confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <MemoryRouter>
        <AuthProvider>
          <PatientsDirectory />
        </AuthProvider>
      </MemoryRouter>
    );

    // Patients table renders 'Patient One', 'Patient Two'. 
    // Clinic 2 'Patient Three' is NOT in the UI.

    // Let's trigger a delete action by calling the table's simulated delete prop.
    // However, it's easier to simulate it if we mock the delete row click, but since we have a direct button,
    // let's just trigger the delete function from the UI if possible, or we just write a unit test fixing the code.
    // Let's wait for Patient One
    await waitFor(() => {
      expect(screen.queryByText('Patient One')).toBeInTheDocument();
    });

    // Actually, we can click the text "Delete" directly.
    const deleteButtons = screen.queryAllByText('Delete', { selector: 'button' });
    if (deleteButtons.length > 0) {
      // Let's click the first one (deletes "Patient One")
      (deleteButtons[0] as HTMLButtonElement).click();
      
      // Let's check localStorage medcore_patients AFTER delete
      const saved = JSON.parse(localStorage.getItem('medcore_patients') || '[]');
      
      // Patient Three MUST still exist in localStorage even though they are hidden from UI
      const patientThreeExists = saved.some((p: any) => p.name === 'Patient Three');
      expect(patientThreeExists).toBe(true);
    } // else fail
    else {
      throw new Error('Delete button not found');
    }
  });
});
