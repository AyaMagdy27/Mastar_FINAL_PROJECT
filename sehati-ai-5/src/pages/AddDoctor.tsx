import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Stethoscope } from 'lucide-react';
import { DoctorRegistrationForm, DoctorFormData } from '../components/DoctorRegistrationForm';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function AddDoctor() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeClinicId } = useAuth();

  const handleSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const existingStr = localStorage.getItem('medcore_doctors');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    const newDoctor = {
      id: `DR-${2000 + existing.length + 1}`,
      clinicId: activeClinicId,
      name: data.name,
      specialization: data.specialization,
      department: data.department,
      qualifications: data.qualifications,
      experience: data.experience,
      availability: data.availability,
      phone: data.phone,
      email: data.email,
      consultationFee: data.consultationFee,
      status: 'Available'
    };
    
    localStorage.setItem('medcore_doctors', JSON.stringify([newDoctor, ...existing]));
    
    setIsSubmitting(false);
    navigate('/dashboard/doctors');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full space-y-6"
    >
      <div className="flex items-center space-x-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/doctors')}
          className="p-2 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
            <Stethoscope className="w-6 h-6 mr-3 text-primary" />
            Add New Doctor
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Create a new doctor profile in the system</p>
        </div>
      </div>

      <DoctorRegistrationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

    </motion.div>
  );
}
