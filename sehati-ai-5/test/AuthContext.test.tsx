import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import React from 'react';

// Wrapper to provide auth context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext and Clinic Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with SUPER_ADMIN default if no user stored', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.role).toBe('SUPER_ADMIN');
    expect(result.current.user).toBeNull();
  });

  it('should initialize clinics on load', () => {
    renderHook(() => useAuth(), { wrapper });
    const storedClinics = localStorage.getItem('medcore_clinics');
    expect(storedClinics).not.toBeNull();
    const clinics = JSON.parse(storedClinics!);
    expect(clinics.length).toBeGreaterThanOrEqual(2); // Sehati Main Clinic & Healthcare Clinic
    expect(clinics.find((c: any) => c.name === 'Healthcare Clinic')).toBeDefined();
  });

  it('should allow loginAs and set activeClinicId mapped from user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAs({
        id: 'ca2',
        name: 'Dr. Healthcare Admin',
        email: 'admin@healthcare.com',
        role: 'CLINIC_ADMIN',
        clinicId: 'clinic_2'
      });
    });

    expect(result.current.user?.name).toBe('Dr. Healthcare Admin');
    expect(result.current.role).toBe('CLINIC_ADMIN');
    expect(result.current.activeClinicId).toBe('clinic_2');
  });

  it('should allow logout to clear activeClinicId', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.loginAs({
        id: 'doc1',
        name: 'Dr. Ahmed',
        email: 'ahmed@hospital.com',
        role: 'DOCTOR',
        clinicId: 'clinic_1'
      });
    });

    expect(result.current.activeClinicId).toBe('clinic_1');

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.activeClinicId).toBeNull();
  });
});
