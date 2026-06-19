import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { ReceptionistDashboard } from './dashboards/ReceptionistDashboard';
import { PatientDashboard } from './dashboards/PatientDashboard';
import { Appointment } from '../types';
import { Calendar, Clock, ChevronRight, Activity, HeartPulse, Droplets, Download, Search, Zap, FileText, Video } from 'lucide-react';

export default function DashboardOverview() {
  const { role, user, activeClinicId } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [recentPatient, setRecentPatient] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allPatients, setAllPatients] = useState<any[]>([]);

  useEffect(() => {
    // 1. Load and filter appointments
    const savedAppts = localStorage.getItem('medcore_appointments');
    if (savedAppts) {
      let allAppts: Appointment[] = JSON.parse(savedAppts);
      
      // Filter by clinic
      if (activeClinicId) {
        allAppts = allAppts.filter(a => a.clinicId === activeClinicId || !a.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
        allAppts = [];
      }
      
      // Filter by patient if role is patient
      if (role === 'PATIENT' && user?.name) {
        allAppts = allAppts.filter(a => a.patientName === user.name);
      }
      
      // Filter pending/confirmed and take top 3
      let filtered = allAppts.filter(a => a.status === 'pending' || a.status === 'confirmed');
      // Sort by date inside top 3
      filtered.sort((a, b) => new Date(`${a.date} ${a.timeSlot}`).getTime() - new Date(`${b.date} ${b.timeSlot}`).getTime());
      
      setUpcomingAppointments(filtered.slice(0, 3));
    }

    // 2. Load and filter patients (Only for non-patients)
    if (role !== 'PATIENT') {
      const savedPatients = localStorage.getItem('medcore_patients');
      let parsedPatients = savedPatients ? JSON.parse(savedPatients) : [];
      
      if (!savedPatients) {
          // Mock initial patients to make search work if empty
          parsedPatients = [
            { id: 'PT-802', clinicId: 'clinic_1', nationalId: '123456789', name: 'Michael Chen', gender: 'male', dob: '1985-04-12', phone: '(555) 123-4567', email: 'mchen@example.com', address: '123 Main St, Anytown USA', bloodType: 'A+', allergies: 'Penicillin', chronicConditions: 'Hypertension', status: 'In Treatment', lastVisit: '2023-10-24' },
            { id: 'PT-803', clinicId: 'clinic_1', nationalId: '987654321', name: 'Emma Thompson', gender: 'female', dob: '1990-08-22', phone: '(555) 987-6543', email: 'emma.t@example.com', address: '456 Oak Ave, Somesville', bloodType: 'O-', allergies: 'None', chronicConditions: 'None', status: 'Recovered', lastVisit: '2023-10-24' },
            { id: 'PT-804', clinicId: 'clinic_1', nationalId: '543216789', name: 'James Wilson', gender: 'male', dob: '1972-11-05', phone: '(555) 456-7890', email: 'jwilson@example.com', address: '789 Pine Rd, Othertown', bloodType: 'B+', allergies: 'Latex', chronicConditions: 'Type 2 Diabetes', status: 'New Patient', lastVisit: '2023-10-23' },
            { id: 'PT-805', clinicId: 'clinic_1', nationalId: '112233445', name: 'Sophia Rodriguez', gender: 'female', dob: '1988-02-15', phone: '(555) 234-5678', email: 'srodriguez@example.com', address: '321 Elm St, Villageton', bloodType: 'O+', allergies: 'Peanuts', chronicConditions: 'Asthma', status: 'In Treatment', lastVisit: '2023-10-21' },
          ];
          localStorage.setItem('medcore_patients', JSON.stringify(parsedPatients));
      }
      
      // Filter patients by clinic
      if (activeClinicId) {
         parsedPatients = parsedPatients.filter((p: any) => p.clinicId === activeClinicId || !p.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
         parsedPatients = [];
      }
      
      setAllPatients(parsedPatients);
      
      if (parsedPatients && parsedPatients.length > 0) {
        // Find most recently updated
        const sorted = [...parsedPatients].sort((a: any, b: any) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime());
        setRecentPatient(sorted[0]);
      } else {
        setRecentPatient(null);
      }
    }
  }, [activeClinicId, role, user]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const lowerQuery = query.toLowerCase();
      const results = allPatients.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.id.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleDownloadReport = () => {
    if (!recentPatient) return;
    const element = document.createElement("a");
    const file = new Blob([`Mock Health Metrics Report for ${recentPatient.name}\n\nHeart Rate: 72 bpm\nBlood Pressure: 120/80 mmHg\nOxygen Saturation: 98%`], {type: 'application/pdf'});
    element.href = URL.createObjectURL(file);
    element.download = `${recentPatient.name.replace(/\s+/g, '_')}_Health_Metrics.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === 'SUPER_ADMIN' ? 'Enterprise overview of hospital operations & revenue' :
             role === 'DOCTOR' ? `Doctor Dashboard • ${user?.department || 'Medical Staff'}` :
             role === 'RECEPTIONIST' ? 'Front Desk & Queue Management' :
             'Your Personal Health Dashboard'}
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-4 sm:w-auto">
          {role !== 'PATIENT' && (
            <div className="relative w-full sm:w-72 z-40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patients by name or ID..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
              
              {/* Dropdown Results */}
              {searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-2 z-50">
                  {searchResults.length > 0 ? (
                    searchResults.map(p => (
                      <button
                        key={p.id}
                        onClick={() => navigate(`/dashboard/patients/${p.id}`)}
                        className="w-full text-left px-4 py-3 hover:bg-accent/50 flex items-center justify-between transition-colors border-b border-border/50 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-bold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.id} • {p.dob}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-center text-sm text-muted-foreground">
                      No patients found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <button 
            onClick={() => navigate('/dashboard/appointments')}
            className="w-full sm:w-auto px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            {role === 'PATIENT' ? 'Book Appointment' : 'New Appointment'}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${role !== 'PATIENT' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {role !== 'PATIENT' && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-600">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
              </div>
            </div>
            <div className="space-y-3">
               <button 
                  onClick={() => navigate('/dashboard/patients')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between transition-all group active:scale-[0.98]"
               >
                  <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          <Activity className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-foreground">Log New Vital</p>
                          <p className="text-xs text-muted-foreground">Record patient metrics</p>
                      </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
               </button>
               <button 
                  onClick={() => navigate('/dashboard/prescriptions')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between transition-all group active:scale-[0.98]"
               >
                  <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-foreground">Add Prescription</p>
                          <p className="text-xs text-muted-foreground">Issue new medication</p>
                      </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
               </button>
               <button 
                  onClick={() => navigate('/dashboard/telemedicine')}
                  className="w-full text-left px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 flex items-center justify-between transition-all group active:scale-[0.98]"
               >
                  <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                          <Video className="w-4 h-4" />
                      </div>
                      <div>
                          <p className="text-sm font-bold text-foreground">Start Telemedicine Call</p>
                          <p className="text-xs text-muted-foreground">Join virtual consultation</p>
                      </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
               </button>
            </div>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Upcoming Appointments</h2>
            </div>
            <button 
              onClick={() => navigate('/dashboard/appointments')}
              className="text-xs font-bold text-primary flex items-center hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all active:scale-95"
            >
              View Schedule <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appt, i) => (
                <div key={appt.id || i} className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/30 bg-accent/30 hover:bg-accent/50 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                      {appt.patientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{appt.patientName}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{appt.department} • {appt.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex items-center text-sm font-bold text-foreground mb-1">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                      {appt.timeSlot}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                      {new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 text-center border border-dashed border-border rounded-xl bg-accent/20">
                <p className="text-sm font-medium text-muted-foreground">
                  No upcoming appointments.
                </p>
              </div>
            )}
          </div>
        </div>

        {role !== 'PATIENT' && recentPatient && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Recent Vital Signs</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleDownloadReport}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center hover:bg-accent/50 px-3 py-1.5 rounded-lg transition-all active:scale-95 border border-border bg-card"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download Report
                </button>
                <button 
                  onClick={() => navigate(`/dashboard/patients/${recentPatient.id}`)}
                  className="text-xs font-bold text-primary flex items-center hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all active:scale-95"
                >
                  View Patient <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
               <p className="text-sm font-medium text-foreground">Patient: {recentPatient.name}</p>
               <p className="text-xs text-muted-foreground mt-0.5">Last updated: {new Date(recentPatient.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 h-[180px]">
              <div className="p-4 rounded-xl border border-border bg-rose-50/50 flex flex-col justify-center items-center text-center">
                <HeartPulse className="w-6 h-6 text-rose-500 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Heart Rate</span>
                <span className="text-2xl font-black tracking-tight text-foreground mt-1">72 <span className="text-sm font-medium text-muted-foreground ml-1">bpm</span></span>
              </div>
              <div className="p-4 rounded-xl border border-border bg-blue-50/50 flex flex-col justify-center items-center text-center">
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Blood Pressure</span>
                <span className="text-2xl font-black tracking-tight text-foreground mt-1">120/80 <span className="text-sm font-medium text-muted-foreground ml-1">mmHg</span></span>
              </div>
              <div className="col-span-2 p-4 rounded-xl border border-border bg-sky-50/50 flex justify-between items-center px-6">
                <div className="flex items-center space-x-3">
                  <Droplets className="w-6 h-6 text-sky-500" />
                  <span className="text-sm font-medium text-muted-foreground">Oxygen Saturation</span>
                </div>
                <span className="text-2xl font-black tracking-tight text-foreground">98<span className="text-sm font-medium text-muted-foreground ml-1">%</span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {role === 'SUPER_ADMIN' && <AdminDashboard />}
      {role === 'DOCTOR' && <DoctorDashboard />}
      {role === 'RECEPTIONIST' && <ReceptionistDashboard />}
      {role === 'PATIENT' && <PatientDashboard />}
    </div>
  );
}
