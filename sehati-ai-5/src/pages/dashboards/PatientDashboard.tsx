import React, { useState, useEffect } from 'react';
import { Calendar, Pill, FlaskConical, FileText, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AddAppointmentForm } from '../../components/AddAppointmentForm';
import { Appointment } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';

export function PatientDashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const { user, activeClinicId, role } = useAuth();

  useEffect(() => {
    let saved = localStorage.getItem('medcore_appointments');
    if (saved) {
      let parsed = JSON.parse(saved) as Appointment[];
      // Filter by clinic
      if (activeClinicId) {
        parsed = parsed.filter(a => a.clinicId === activeClinicId || !a.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
        parsed = [];
      }
      
      // Filter by patient
      if (user?.name) {
        parsed = parsed.filter(a => a.patientName === user.name);
      }
      
      setAppointments(parsed);
    }
  }, [activeClinicId, role, user]);

  const handleBook = (data: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
      clinicId: activeClinicId || 'clinic_1',
      status: 'pending'
    };
    
    const savedStr = localStorage.getItem('medcore_appointments');
    let allAppointments: Appointment[] = savedStr ? JSON.parse(savedStr) : [];
    
    const updatedAll = [newAppointment, ...allAppointments];
    updatedAll.sort((a, b) => new Date(`${a.date} ${a.timeSlot}`).getTime() - new Date(`${b.date} ${b.timeSlot}`).getTime());
    localStorage.setItem('medcore_appointments', JSON.stringify(updatedAll));
    
    const updatedMy = [newAppointment, ...appointments];
    updatedMy.sort((a, b) => new Date(`${a.date} ${a.timeSlot}`).getTime() - new Date(`${b.date} ${b.timeSlot}`).getTime());
    
    setAppointments(updatedMy);
    setIsBooking(false);
    toast.success('Appointment Booked', { description: `Successfully booked for ${data.patientName}`});
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">AI Health Assistant</h2>
            <p className="text-sm text-foreground/80 mt-2 max-w-xl">
              Take our AI-powered predictive disease assessment to understand your risks for Diabetes, Heart Disease, and Hypertension before they develop.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/predictive-health')}
            className="whitespace-nowrap px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            Start Assessment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div onClick={() => navigate('/dashboard/appointments')} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center flex flex-col items-center hover:bg-muted/30 transition-colors cursor-pointer active:scale-95">
           <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full mb-3"><Calendar className="w-6 h-6" /></div>
           <h3 className="font-bold text-foreground">Appointments</h3>
           <p className="text-xs text-muted-foreground mt-1">1 Upcoming</p>
        </div>
        <div onClick={() => navigate('/dashboard/prescriptions')} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center flex flex-col items-center hover:bg-muted/30 transition-colors cursor-pointer active:scale-95">
           <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-full mb-3"><Pill className="w-6 h-6" /></div>
           <h3 className="font-bold text-foreground">Prescriptions</h3>
           <p className="text-xs text-muted-foreground mt-1">2 Active</p>
        </div>
        <div onClick={() => navigate('/dashboard/labs')} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center flex flex-col items-center hover:bg-muted/30 transition-colors cursor-pointer active:scale-95">
           <div className="p-3 bg-violet-500/10 text-violet-500 rounded-full mb-3"><FlaskConical className="w-6 h-6" /></div>
           <h3 className="font-bold text-foreground">Lab Results</h3>
           <p className="text-xs text-muted-foreground mt-1">View Recent</p>
        </div>
        <div onClick={() => navigate('/dashboard')} className="bg-card rounded-2xl border border-border p-5 shadow-sm text-center flex flex-col items-center hover:bg-muted/30 transition-colors cursor-pointer active:scale-95">
           <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full mb-3"><FileText className="w-6 h-6" /></div>
           <h3 className="font-bold text-foreground">Medical Records</h3>
           <p className="text-xs text-muted-foreground mt-1">Download History</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-foreground">Upcoming Appointments</h3>
              <button 
                onClick={() => setIsBooking(true)}
                className="text-xs px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 font-bold rounded-lg transition-all active:scale-95"
               >
                + Make Appointment
              </button>
            </div>
            
            <AnimatePresence mode="wait">
              {isBooking ? (
                <motion.div
                  key="booking_form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <AddAppointmentForm 
                    existingAppointments={appointments}
                    onSubmit={handleBook}
                    onCancel={() => setIsBooking(false)}
                  />
                </motion.div>
              ) : (
                <motion.div key="appointments_list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').slice(0, 3).length > 0 ? (
                    appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').slice(0, 3).map((app) => (
                      <div key={app.id} className="p-4 border border-border rounded-xl flex justify-between items-center bg-muted/20">
                         <div>
                            <p className="text-sm font-bold text-foreground">{app.doctor}</p>
                            <p className="text-xs text-muted-foreground mt-1">{app.department} - {app.reason || 'Checkup'}</p>
                            <p className="text-xs font-mono font-medium text-primary mt-2">{new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {app.timeSlot}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${app.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                               {app.status}
                            </span>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border border-border rounded-xl flex justify-between items-center bg-muted/20">
                       <div>
                          <p className="text-sm font-bold text-foreground">No upcoming appointments</p>
                          <p className="text-xs text-muted-foreground mt-1">You have no upcoming appointments scheduled.</p>
                       </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
