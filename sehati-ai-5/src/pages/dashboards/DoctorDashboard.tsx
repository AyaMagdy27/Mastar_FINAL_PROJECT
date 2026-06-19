import React, { useState, useEffect } from 'react';
import { Users, Calendar, FlaskConical, Activity, BrainCircuit } from 'lucide-react';
import { Appointment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { activeClinicId, role } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('medcore_appointments');
    if (saved) {
      let parsed = JSON.parse(saved) as Appointment[];
      // Filter by clinic
      if (activeClinicId) {
        parsed = parsed.filter(a => a.clinicId === activeClinicId || !a.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
        parsed = [];
      }

      // Sort appioment according to department and name
      parsed = parsed.sort((a, b) => {
        if (a.department === b.department) {
          return a.patientName.localeCompare(b.patientName);
        }
        return (a.department || '').localeCompare(b.department || '');
      });
      setAppointments(parsed);
    }
  }, [activeClinicId, role]);

  const stats = [
    { label: "Total Appointments", value: appointments.length.toString(), icon: Calendar, change: 'Updated' },
    { label: 'Pending Lab Results', value: '12', icon: FlaskConical, change: '4 critical' },
    { label: 'Recent Patients', value: '45', icon: Users, change: 'This week' },
    { label: 'Disease Prediction Alerts', value: '3', icon: Activity, change: 'High risk detected' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-1">{stat.value}</h3>
                <p className="text-[11px] uppercase font-bold text-muted-foreground">{stat.label}</p>
                <p className="text-[10px] mt-3 font-semibold text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4">Appointments (Sorted by Dept & Name)</h3>
          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.slice(0, 5).map((app, idx) => (
               <div key={idx} className="p-3 border border-border rounded-xl flex justify-between items-center bg-muted/20">
                  <div>
                     <p className="text-sm font-bold text-foreground">{app.timeSlot} - {app.patientName}</p>
                     <p className="text-xs text-muted-foreground">{app.department} • {app.reason || 'General'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${app.status === 'completed' ? 'text-emerald-500 bg-emerald-500/10' : app.status === 'cancelled' ? 'text-red-500 bg-red-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
               </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No appointments found.</p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center">
            <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
            AI Insights & Predictions
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
               <p className="text-sm font-bold text-foreground">High Risk: Diabetes Progression</p>
               <p className="text-xs text-muted-foreground mt-1">Patient PT-182 (Jane Smith) has a 85% risk of developing Type 2 Diabetes based on recent metabolic panel.</p>
            </div>
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
               <p className="text-sm font-bold text-foreground">Medication Adherence</p>
               <p className="text-xs text-muted-foreground mt-1">Patient PT-928 has not refilled Lisinopril in 45 days. Consider follow-up.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
