import React, { createContext, useContext, useState, useEffect } from 'react';
import { Clinic } from '../types';

export type UserRole = 'SUPER_ADMIN' | 'CLINIC_ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId?: string | null;
  avatarUrl?: string;
  department?: string; // For doctors
  patientId?: string; // For patients
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  activeClinicId: string | null;
  setActiveClinicId: (id: string | null) => void;
  setRole: (role: UserRole) => void;
  loginAs: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultClinicId = 'clinic_1';
const healthcareClinicId = 'clinic_2';

export const SYSTEM_USERS: User[] = [
  { id: 'demo1', name: 'Demo User', email: 'demo@hospital.com', phone: '000000', role: 'DOCTOR', department: 'General Practice', clinicId: defaultClinicId },
  { id: 'admin1', name: 'Aya', email: 'aya@hospital.com', phone: '111111', role: 'SUPER_ADMIN', clinicId: null },
  { id: 'ca1', name: 'Dr. Admin', email: 'admin@clinic1.com', phone: '121212', role: 'CLINIC_ADMIN', clinicId: defaultClinicId },
  { id: 'doc1', name: 'Dr. Ahmed Mohammed', email: 'ahmed@hospital.com', phone: '222222', role: 'DOCTOR', department: 'Cardiology', clinicId: defaultClinicId },
  { id: 'doc2', name: 'Dr. Misk', email: 'misk@hospital.com', phone: '333333', role: 'DOCTOR', department: 'Pediatrics', clinicId: defaultClinicId },
  { id: 'doc3', name: 'Dr. Malk', email: 'malk@hospital.com', phone: '444444', role: 'DOCTOR', department: 'Neurology', clinicId: defaultClinicId },
  { id: 'rec1', name: 'Salwa', email: 'salwa@hospital.com', phone: '555555', role: 'RECEPTIONIST', clinicId: defaultClinicId },
  { id: 'pat1', name: 'Sally', email: 'sally@hospital.com', phone: '666666', role: 'PATIENT', patientId: 'PT-1001', clinicId: defaultClinicId },
  
  // Healthcare Clinic Users
  { id: 'ca2', name: 'Dr. Healthcare Admin', email: 'admin@healthcare.com', phone: '777777', role: 'CLINIC_ADMIN', clinicId: healthcareClinicId },
  { id: 'doc4', name: 'Dr. Sarah Healthcare', email: 'sarah@healthcare.com', phone: '888888', role: 'DOCTOR', department: 'General Practice', clinicId: healthcareClinicId },
  { id: 'rec2', name: 'Omar', email: 'omar@healthcare.com', phone: '999999', role: 'RECEPTIONIST', clinicId: healthcareClinicId },
  { id: 'pat2', name: 'John Doe', email: 'john@healthcare.com', phone: '000000', role: 'PATIENT', patientId: 'PT-2001', clinicId: healthcareClinicId },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Migrate initial clinic
    const savedClinics = localStorage.getItem('medcore_clinics');
    if (!savedClinics) {
      const initialClinics: Clinic[] = [
        {
          _id: defaultClinicId,
          name: 'Sehati Main Clinic',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: healthcareClinicId,
          name: 'Healthcare Clinic',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('medcore_clinics', JSON.stringify(initialClinics));
    } else {
       // Append Healthcare Clinic if missing
       let clinics = JSON.parse(savedClinics);
       if (!clinics.find((c: Clinic) => c._id === healthcareClinicId)) {
          clinics.push({
             _id: healthcareClinicId,
             name: 'Healthcare Clinic',
             status: 'active',
             createdAt: new Date().toISOString(),
             updatedAt: new Date().toISOString()
          });
          localStorage.setItem('medcore_clinics', JSON.stringify(clinics));
       }
    }
  }, []);

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('mockSystemUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRoleState] = useState<UserRole>(user?.role || 'SUPER_ADMIN');
  const [activeClinicId, setActiveClinicIdState] = useState<string | null>(() => {
    if (user?.role !== 'SUPER_ADMIN') return user?.clinicId || null;
    return localStorage.getItem('medcore_active_clinic') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mockSystemUser', JSON.stringify(user));
      setRoleState(user.role);
      if (user.role !== 'SUPER_ADMIN') {
         setActiveClinicIdState(user.clinicId || null);
      }
    } else {
      localStorage.removeItem('mockSystemUser');
      setActiveClinicIdState(null);
    }
  }, [user]);

  const setActiveClinicId = (id: string | null) => {
    setActiveClinicIdState(id);
    if (id) {
       localStorage.setItem('medcore_active_clinic', id);
    } else {
       localStorage.removeItem('medcore_active_clinic');
    }
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
  };

  const loginAs = (loggedInUser: User) => {
    setUser(loggedInUser);
    setRoleState(loggedInUser.role);
    if (loggedInUser.role !== 'SUPER_ADMIN') {
        setActiveClinicIdState(loggedInUser.clinicId || null);
    }
  };

  const logout = () => {
    setUser(null);
    setActiveClinicIdState(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, activeClinicId, setActiveClinicId, setRole, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

