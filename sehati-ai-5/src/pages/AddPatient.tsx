import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AddPatientView as AddPatientComponent } from '../components/AddPatientView';

export default function AddPatient() {
  const navigate = useNavigate();
  return <AddPatientComponent onBack={() => navigate('/dashboard/patients')} />;
}
