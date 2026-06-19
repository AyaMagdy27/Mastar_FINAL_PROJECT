import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import AppointmentsView from '../src/pages/AppointmentsView';
import { AuthProvider } from '../src/contexts/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('AppointmentsView Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    const seedAppts = [
      { id: '1', patientName: 'Appt One', clinicId: 'clinic_1', status: 'pending', department: 'Cardiology', date: '2023-10-10', timeSlot: '10:00 AM' },
      { id: '2', patientName: 'Appt Two', clinicId: 'clinic_2', status: 'pending', department: 'Pediatrics', date: '2023-10-10', timeSlot: '11:00 AM' },
    ];
    localStorage.setItem('medcore_appointments', JSON.stringify(seedAppts));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('super admin should see all appointments', async () => {
    localStorage.setItem('mockSystemUser', JSON.stringify({ id: 'admin', role: 'SUPER_ADMIN', name: 'Admin', clinicId: null }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <AppointmentsView />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Appt One')).toBeInTheDocument();
      expect(screen.queryByText('Appt Two')).toBeInTheDocument();
    });
  });

  it('clinic 1 user should only see clinic 1 appointments', async () => {
    localStorage.setItem('mockSystemUser', JSON.stringify({ id: 'doc1', role: 'DOCTOR', name: 'Doc 1', clinicId: 'clinic_1' }));

    render(
      <MemoryRouter>
        <AuthProvider>
          <AppointmentsView />
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Appt One')).toBeInTheDocument();
      expect(screen.queryByText('Appt Two')).not.toBeInTheDocument();
    });
  });
});
