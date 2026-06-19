import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, X, Activity, HeartPulse, ShieldAlert, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PatientsTable } from '../components/PatientsTable';
import { useAuth } from '../contexts/AuthContext';

export default function PatientsDirectory() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<any[]>([]);
  const { activeClinicId, role } = useAuth();

  useEffect(() => {
    let saved = localStorage.getItem('medcore_patients');
    let parsed = saved ? JSON.parse(saved) : [];
    
    if (!saved) {
      // Mock initial patients
      parsed = [
        { id: 'PT-802', clinicId: 'clinic_1', nationalId: '123456789', name: 'Michael Chen', gender: 'male', dob: '1985-04-12', phone: '(555) 123-4567', email: 'mchen@example.com', address: '123 Main St, Anytown USA', bloodType: 'A+', allergies: 'Penicillin', chronicConditions: 'Hypertension', status: 'In Treatment', lastVisit: '2023-10-24' },
        { id: 'PT-803', clinicId: 'clinic_1', nationalId: '987654321', name: 'Emma Thompson', gender: 'female', dob: '1990-08-22', phone: '(555) 987-6543', email: 'emma.t@example.com', address: '456 Oak Ave, Somesville', bloodType: 'O-', allergies: 'None', chronicConditions: 'None', status: 'Recovered', lastVisit: '2023-10-24' },
        { id: 'PT-804', clinicId: 'clinic_1', nationalId: '543216789', name: 'James Wilson', gender: 'male', dob: '1972-11-05', phone: '(555) 456-7890', email: 'jwilson@example.com', address: '789 Pine Rd, Othertown', bloodType: 'B+', allergies: 'Latex', chronicConditions: 'Type 2 Diabetes', status: 'New Patient', lastVisit: '2023-10-23' },
        { id: 'PT-805', clinicId: 'clinic_1', nationalId: '112233445', name: 'Sophia Rodriguez', gender: 'female', dob: '1988-02-15', phone: '(555) 234-5678', email: 'srodriguez@example.com', address: '321 Elm St, Villageton', bloodType: 'O+', allergies: 'Peanuts', chronicConditions: 'Asthma', status: 'In Treatment', lastVisit: '2023-10-21' },
      ];
      localStorage.setItem('medcore_patients', JSON.stringify(parsed));
    }
    
    // Apply clinic-based data filtering
    if (activeClinicId) {
       parsed = parsed.filter((p: any) => p.clinicId === activeClinicId || !p.clinicId); // fallback for unmigrated data
    } else if (role !== 'SUPER_ADMIN') {
       // if not super admin and no active clinic (edge case), show nothing
       parsed = [];
    }

    setPatients(parsed);
  }, [activeClinicId, role]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      const savedStr = localStorage.getItem('medcore_patients');
      let allPatients: any[] = savedStr ? JSON.parse(savedStr) : [];
      
      allPatients = allPatients.filter((p: any) => p.id !== id);
      localStorage.setItem('medcore_patients', JSON.stringify(allPatients));
      
      let filtered = allPatients;
      if (activeClinicId) {
        filtered = filtered.filter((p: any) => p.clinicId === activeClinicId || !p.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
        filtered = [];
      }
      setPatients(filtered);
    }
  };

  const handleEdit = (p: any) => {
    // In a real app we'd open an edit form. For now, navigate to new or a simulated edit.
    // For prototype simplicity, we will just alert since the edit form is identical to the add form.
    alert('Edit mode allows changing patient details (Functionality disabled in prototype layout).');
  };

  const handleRowClick = (p: any) => {
    navigate(`/dashboard/patients/${p.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
            <Users className="w-6 h-6 mr-3 text-primary" />
            Patient Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Manage electronic medical records</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/patients/new')} 
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Register Patient
        </button>
      </div>

      <PatientsTable data={patients} onRowClick={handleRowClick} onDeletePatient={handleDelete} onEditPatient={handleEdit} />
    </div>
  );
}
