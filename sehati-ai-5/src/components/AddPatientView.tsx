import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PatientRegistrationForm, PatientFormValues } from './PatientRegistrationForm';
import { useAuth } from '../contexts/AuthContext';

export function AddPatientView({ onBack }: { onBack: () => void }) {
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeClinicId } = useAuth();

  const onSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200));
    
    // Save to local storage
    const existingStr = localStorage.getItem('medcore_patients');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    const newPatient = {
      id: `PT-${1000 + existing.length + 1}`,
      clinicId: activeClinicId,
      nationalId: data.nationalId,
      name: `${data.firstName} ${data.lastName}`,
      gender: data.gender,
      dob: data.dateOfBirth,
      phone: data.phoneNumber,
      email: data.email,
      address: data.address,
      bloodType: data.bloodType,
      allergies: data.allergies,
      chronicConditions: data.chronicConditions,
      status: 'New Patient',
      lastVisit: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('medcore_patients', JSON.stringify([newPatient, ...existing]));

    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex-1 flex items-center justify-center h-[calc(100vh-8rem)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl shadow-emerald-500/10 border border-emerald-100 flex flex-col items-center text-center max-w-sm w-full"
        >
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-full mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">Patient Registered</h2>
          <p className="text-slate-500 text-sm font-medium mb-6">The patient profile has been successfully created and added to the secure database.</p>
          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="bg-emerald-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 border border-slate-200 bg-white rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register New Patient</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Create a comprehensive electronic medical record profile.</p>
          </div>
        </div>
      </div>

      <PatientRegistrationForm onSubmit={onSubmit} onCancel={onBack} isSubmitting={isSubmitting} />
    </div>
  );
}
