import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview';
import PatientsDirectory from './pages/PatientsDirectory';
import AddPatient from './pages/AddPatient';
import PatientEMR from './pages/PatientEMR';
import AIDiagnosticView from './pages/AIDiagnosticView';
import AppointmentsView from './pages/AppointmentsView';
import TelemedicineView from './pages/TelemedicineView';
import BillingView from './pages/BillingView';
import SettingsView from './pages/SettingsView';
import DoctorsDirectory from './pages/DoctorsDirectory';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PrescriptionsView from './pages/PrescriptionsView';
import PredictiveHealth from './pages/PredictiveHealth';
import LoginView from './pages/LoginView';
import { Toaster } from '../components/ui/sonner';

const PlaceholderView = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
    <p className="text-muted-foreground mt-2">This module is currently under development.</p>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginView />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="patients" element={<PatientsDirectory />} />
            <Route path="patients/new" element={<AddPatient />} />
            <Route path="patients/:id" element={<PatientEMR />} />
            <Route path="doctors" element={<DoctorsDirectory />} />
            <Route path="doctors/new" element={<AddDoctor />} />
            <Route path="doctors/:id/edit" element={<EditDoctor />} />
            <Route path="prescriptions" element={<PrescriptionsView />} />
            <Route path="labs" element={<PlaceholderView title="Laboratory Results" />} />
            <Route path="ai-diagnostic" element={<AIDiagnosticView />} />
            <Route path="predictive-health" element={<PredictiveHealth />} />
            <Route path="appointments" element={<AppointmentsView />} />
            <Route path="telemedicine" element={<TelemedicineView />} />
            <Route path="billing" element={<BillingView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('medcore_auth') !== null;
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
