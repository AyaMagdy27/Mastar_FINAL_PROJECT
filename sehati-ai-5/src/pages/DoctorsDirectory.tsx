import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Plus, X, Calendar, Activity, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorsTable } from '../components/DoctorsTable';
import { useAuth } from '../contexts/AuthContext';

export default function DoctorsDirectory() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const { activeClinicId, role } = useAuth();

  useEffect(() => {
    // Mock initial doctors
    const initial = [
      { id: 'DR-1001', clinicId: 'clinic_1', name: 'Dr. Ahmed Mohammed', specialization: 'Cardiology', department: 'Cardiology', qualifications: 'MD, FACC', experience: '10', availability: 'Mon, Wed (9:00 AM - 4:00 PM)', phone: '222222', email: 'ahmed@hospital.com', consultationFee: 200, status: 'Available' },
      { id: 'DR-1002', clinicId: 'clinic_1', name: 'Dr. Misk', specialization: 'Pediatrics', department: 'Pediatrics', qualifications: 'MD, FAAP', experience: '8', availability: 'Tue, Thu (10:00 AM - 6:00 PM)', phone: '333333', email: 'misk@hospital.com', consultationFee: 150, status: 'Busy' },
      { id: 'DR-1003', clinicId: 'clinic_1', name: 'Dr. Malk', specialization: 'Neurology', department: 'Neurology', qualifications: 'MD, PhD', experience: '12', availability: 'Mon-Fri (8:00 AM - 2:00 PM)', phone: '444444', email: 'malk@hospital.com', consultationFee: 250, status: 'Offline' },
      { id: 'DR-2001', clinicId: 'clinic_1', name: 'Dr. Sarah Chen', specialization: 'Cardiology', department: 'Cardiology', qualifications: 'MD, FACC', experience: '15', availability: 'Mon, Wed, Fri (9:00 AM - 4:00 PM)', phone: '(555) 111-2222', email: 'schen@example.com', consultationFee: 200, status: 'Available' },
      { id: 'DR-2002', clinicId: 'clinic_1', name: 'Dr. James Wilson', specialization: 'Neurology', department: 'Neurology', qualifications: 'MD, PhD', experience: '12', availability: 'Tue, Thu (10:00 AM - 6:00 PM)', phone: '(555) 333-4444', email: 'jwilson@example.com', consultationFee: 250, status: 'Busy' },
      { id: 'DR-2003', clinicId: 'clinic_1', name: 'Dr. Emily Rodriguez', specialization: 'Pediatrics', department: 'Pediatrics', qualifications: 'MD, FAAP', experience: '8', availability: 'Mon-Fri (8:00 AM - 2:00 PM)', phone: '(555) 555-6666', email: 'erodriguez@example.com', consultationFee: 150, status: 'Offline' },
      { id: 'DR-2004', clinicId: 'clinic_1', name: 'Dr. Michael Thompson', specialization: 'Orthopedics', department: 'Orthopedics', qualifications: 'MD, FAAOS', experience: '20', availability: 'Wed, Fri (8:00 AM - 5:00 PM)', phone: '(555) 777-8888', email: 'mthompson@example.com', consultationFee: 300, status: 'Available' },
    ];

    const saved = localStorage.getItem('medcore_doctors');
    let parsedDoctors = saved ? JSON.parse(saved) : [];
    
    if (saved) {
      // Backfill status if missing
      let changed = false;
      parsedDoctors = parsedDoctors.map((d: any, index: number) => {
        if (!d.status) {
          changed = true;
          return { ...d, status: ['Available', 'Busy', 'Offline'][index % 3] };
        }
        return d;
      });
      
      // Ensure the new doctors are in the list
      const newDocsIds = ['DR-1001', 'DR-1002', 'DR-1003'];
      for (const id of newDocsIds) {
        if (!parsedDoctors.find((d: any) => d.id === id)) {
           parsedDoctors.push(initial.find((d) => d.id === id));
           changed = true;
        }
      }

      if (changed) {
        localStorage.setItem('medcore_doctors', JSON.stringify(parsedDoctors));
      }
    } else {
      parsedDoctors = initial;
      localStorage.setItem('medcore_doctors', JSON.stringify(initial));
    }

    if (activeClinicId) {
      parsedDoctors = parsedDoctors.filter((d: any) => d.clinicId === activeClinicId || !d.clinicId);
    } else if (role !== 'SUPER_ADMIN') {
      parsedDoctors = [];
    }
    
    setDoctors(parsedDoctors);
  }, [activeClinicId, role]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      const savedStr = localStorage.getItem('medcore_doctors');
      let allDoctors: any[] = savedStr ? JSON.parse(savedStr) : [];
      
      allDoctors = allDoctors.filter((d: any) => d.id !== id);
      localStorage.setItem('medcore_doctors', JSON.stringify(allDoctors));
      
      let filtered = allDoctors;
      if (activeClinicId) {
        filtered = filtered.filter((d: any) => d.clinicId === activeClinicId || !d.clinicId);
      } else if (role !== 'SUPER_ADMIN') {
        filtered = [];
      }
      setDoctors(filtered);
    }
  };

  const handleEdit = (d: any) => {
    navigate(`/dashboard/doctors/${d.id}/edit`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
            <Stethoscope className="w-6 h-6 mr-3 text-primary" />
            Doctors Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Manage hospital doctors and their schedules</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/doctors/new')} 
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </button>
      </div>

      <DoctorsTable data={doctors} onRowClick={setSelectedDoctor} onDeleteDoctor={handleDelete} onEditDoctor={handleEdit} />

      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="bg-background rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
                <h2 className="text-lg font-bold text-foreground">Doctor Profile</h2>
                <button onClick={() => setSelectedDoctor(null)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
                {/* Left Column: Info */}
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border shadow-sm">
                    <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-3xl mb-4">
                      {selectedDoctor.name.replace('Dr. ', '').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                    </div>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight">{selectedDoctor.name}</h1>
                    <div className="text-sm font-mono text-muted-foreground mt-1 flex items-center justify-center space-x-2">
                       <span>{selectedDoctor.id}</span>
                       <div className="flex items-center space-x-1.5 ml-2 border-l border-border pl-2">
                          <span className="relative flex h-2 w-2">
                            {selectedDoctor.status === 'Available' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${selectedDoctor.status === 'Available' ? 'bg-emerald-500' : selectedDoctor.status === 'Busy' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedDoctor.status === 'Available' ? 'text-emerald-600' : selectedDoctor.status === 'Busy' ? 'text-amber-600' : 'text-slate-500'}`}>{selectedDoctor.status || 'Offline'}</span>
                       </div>
                    </div>
                    <div className="mt-3">
                      <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex bg-primary/10 text-primary">
                        {selectedDoctor.department}
                      </span>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden text-sm">
                     <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/20 px-4 py-3 border-b border-border flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" /> Professional Details
                     </h3>
                     <div className="p-4 space-y-3">
                       <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Specialization</span><span className="font-medium text-foreground">{selectedDoctor.specialization}</span></div>
                       <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Qualifications</span><span className="font-bold text-foreground">{selectedDoctor.qualifications}</span></div>
                       <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Experience</span><span className="font-medium text-foreground">{selectedDoctor.experience} years</span></div>
                       <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">{selectedDoctor.phone}</span></div>
                       <div className="flex justify-between pb-1"><span className="text-muted-foreground">Contact Email</span><span className="font-medium text-foreground truncate max-w-[150px]" title={selectedDoctor.email}>{selectedDoctor.email}</span></div>
                     </div>
                  </div>

                </div>

                {/* Right Column: Historical Tabs & Schedule */}
                <div className="w-full md:w-2/3 flex flex-col gap-6">
                   
                    <div className="bg-card border border-border rounded-xl shadow-sm p-5 w-full mb-6">
                       <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Availability & Fees</h3>
                       <div className="bg-muted/30 border border-border rounded-lg p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                             <div className="flex items-center text-sm font-medium text-foreground">
                                <Calendar className="w-4 h-4 mr-2 text-muted-foreground" /> Schedule
                             </div>
                             <div className="text-sm font-medium text-muted-foreground">{selectedDoctor.availability}</div>
                          </div>
                          <div className="border-t border-border w-full"></div>
                          <div className="flex justify-between items-center">
                             <div className="flex items-center text-sm font-medium text-foreground">
                                <FileText className="w-4 h-4 mr-2 text-muted-foreground" /> Consultation Fee
                             </div>
                             <div className="text-sm font-bold text-primary">${selectedDoctor.consultationFee}</div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5 w-full flex flex-col items-center justify-center text-center">
                             <h4 className="text-3xl font-black text-foreground">{Math.floor(Math.random() * 50) + 10}</h4>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Total Patients</p>
                        </div>
                        <div className="bg-card border border-border rounded-xl shadow-sm p-5 w-full flex flex-col items-center justify-center text-center">
                             <h4 className="text-3xl font-black text-foreground">{Math.floor(Math.random() * 20) + 5}</h4>
                             <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mt-1">Pending Appointments</p>
                        </div>
                    </div>
                </div>

              </div>
              <div className="p-4 border-t border-border flex justify-end gap-3 bg-muted/20">
                <button 
                  onClick={() => {
                    navigate(`/dashboard/doctors/${selectedDoctor.id}/edit`);
                    setSelectedDoctor(null);
                  }} 
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95"
                >
                  Edit Profile
                </button>
                <button onClick={() => setSelectedDoctor(null)} className="px-5 py-2.5 bg-background border border-border text-foreground font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-accent transition-all active:scale-95">Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
