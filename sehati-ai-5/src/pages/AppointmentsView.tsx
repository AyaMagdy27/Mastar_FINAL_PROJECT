import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Clock, User, FileText, CheckCircle, XCircle, LayoutList, CalendarDays, Edit, Search } from 'lucide-react';
import { Appointment } from '../types';
import { AddAppointmentForm } from '../components/AddAppointmentForm';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar } from '../../components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function AppointmentsView() {
  const { role, activeClinicId } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let saved = localStorage.getItem('medcore_appointments');
    let parsed: Appointment[] = saved ? JSON.parse(saved) : [];
    
    if (!saved) {
      const initial: Appointment[] = [
        {
          id: '1',
          clinicId: 'clinic_1',
          patientName: 'Emma Thompson',
          doctor: 'Dr. Sarah Chen',
          department: 'Cardiology',
          date: new Date().toISOString().split('T')[0],
          timeSlot: '10:00 AM',
          reason: 'Routine checkup',
          status: 'pending'
        }
      ];
      parsed = initial;
      localStorage.setItem('medcore_appointments', JSON.stringify(initial));
    }
    
    if (activeClinicId) {
      parsed = parsed.filter(a => a.clinicId === activeClinicId || !a.clinicId);
    } else if (role !== 'SUPER_ADMIN') {
      parsed = [];
    }
    
    setAppointments(parsed);
  }, [activeClinicId, role]);

  const handleSave = (data: Omit<Appointment, 'id' | 'status'>) => {
    // We update localstorage considering all data, so we need to fetch fresh list, update, and save
    const savedStr = localStorage.getItem('medcore_appointments');
    let allAppointments: Appointment[] = savedStr ? JSON.parse(savedStr) : [];
    
    if (editingAppointment) {
      allAppointments = allAppointments.map(app => 
        app.id === editingAppointment.id ? { ...app, ...data } : app
      );
      toast.success('Appointment Rescheduled', { description: `Successfully rescheduled for ${data.patientName}`});
    } else {
      const newAppointment: Appointment = {
        ...data,
        id: Date.now().toString(),
        clinicId: activeClinicId || 'clinic_1',
        status: 'pending'
      };
      allAppointments = [newAppointment, ...allAppointments];
      toast.success('Appointment Booked', { description: `Successfully booked for ${data.patientName}`});
    }
    
    // Sort by date/time
    allAppointments.sort((a, b) => new Date(`${a.date} ${a.timeSlot}`).getTime() - new Date(`${b.date} ${b.timeSlot}`).getTime());
    
    localStorage.setItem('medcore_appointments', JSON.stringify(allAppointments));
    
    // Update local state filtered
    let filtered = allAppointments;
    if (activeClinicId) {
      filtered = filtered.filter(a => a.clinicId === activeClinicId || !a.clinicId);
    } else if (role !== 'SUPER_ADMIN') {
      filtered = [];
    }
    setAppointments(filtered);
    
    setIsAdding(false);
    setEditingAppointment(null);
  };

  const updateStatus = (id: string, newStatus: Appointment['status']) => {
    const savedStr = localStorage.getItem('medcore_appointments');
    let allAppointments: Appointment[] = savedStr ? JSON.parse(savedStr) : [];
    
    allAppointments = allAppointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    localStorage.setItem('medcore_appointments', JSON.stringify(allAppointments));
    
    let filtered = allAppointments;
    if (activeClinicId) {
      filtered = filtered.filter(a => a.clinicId === activeClinicId || !a.clinicId);
    } else if (role !== 'SUPER_ADMIN') {
      filtered = [];
    }
    setAppointments(filtered);
    
    if (newStatus === 'confirmed') toast.success('Appointment Confirmed');
    if (newStatus === 'completed') toast.success('Appointment Completed');
    if (newStatus === 'cancelled') toast.error('Appointment Cancelled');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100/50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100/50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-100/50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-100/50 text-red-700 border-red-200';
      default: return 'bg-slate-100/50 text-slate-700 border-slate-200';
    }
  };

  const renderAppointmentItem = (app: Appointment) => (
    <div key={app.id} className="p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
      <div className="flex items-start space-x-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] uppercase font-bold text-primary mb-0.5">{new Date(app.date).toLocaleDateString('en-US', { month: 'short' })}</span>
          <span className="text-lg font-black text-foreground leading-none">{new Date(app.date).getDate()}</span>
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-3">
            {app.patientName}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(app.status)}`}>
              {app.status}
            </span>
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {app.timeSlot}</span>
            <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {app.doctor} • {app.department}</span>
          </div>
          {app.reason && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted hover:bg-muted/80 transition-colors px-3 py-2 rounded-lg flex items-start max-w-lg">
              <FileText className="w-3.5 h-3.5 mr-2 shrink-0 mt-0.5 text-muted-foreground/60" />
              {app.reason}
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-2 shrink-0 self-end sm:self-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {app.status === 'pending' && (
          <button onClick={() => updateStatus(app.id, 'confirmed')} className="px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all active:scale-95">Confirm</button>
        )}
        {(app.status === 'pending' || app.status === 'confirmed') && (
          <>
            <button onClick={() => updateStatus(app.id, 'completed')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all active:scale-95" title="Mark Completed">
              <CheckCircle className="w-4 h-4" />
            </button>
            <button onClick={() => { setEditingAppointment(app); setIsAdding(true); }} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all active:scale-95" title="Reschedule">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => {
              if (confirm('Are you sure you want to cancel this appointment?')) {
                updateStatus(app.id, 'cancelled');
              }
            }} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all active:scale-95" title="Cancel Appointment">
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  let filteredAppointments = appointments.filter(app => 
    app.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.doctor.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  if (role === 'DOCTOR') {
    filteredAppointments = filteredAppointments.sort((a, b) => {
      if (a.department === b.department) {
        return a.doctor.localeCompare(b.doctor);
      }
      return (a.department || '').localeCompare(b.department || '');
    });
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
            <CalendarIcon className="w-6 h-6 mr-3 text-primary" />
            Appointments
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Manage and schedule patient visits</p>
        </div>
        {!isAdding && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search patients or doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm font-medium bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-[180px] hidden sm:block">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list" className="text-xs font-bold uppercase tracking-wider"><LayoutList className="w-3.5 h-3.5 mr-1.5" /> List</TabsTrigger>
                <TabsTrigger value="calendar" className="text-xs font-bold uppercase tracking-wider"><CalendarDays className="w-3.5 h-3.5 mr-1.5" /> Cal</TabsTrigger>
              </TabsList>
            </Tabs>
            <button 
              onClick={() => setIsAdding(true)} 
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center shadow-lg whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Book
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <AddAppointmentForm 
              existingAppointments={appointments}
              initialData={editingAppointment || undefined}
              onSubmit={handleSave}
              onCancel={() => { setIsAdding(false); setEditingAppointment(null); }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            {viewMode === 'list' && (
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
                  <h2 className="text-[10px] font-bold text-foreground uppercase tracking-widest">Upcoming Schedule</h2>
                </div>
                {filteredAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                    <p className="font-medium text-foreground mb-2">No appointments scheduled</p>
                    <p className="text-sm">Click 'New Book' to add one.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredAppointments.map(renderAppointmentItem)}
                  </div>
                )}
              </div>
            )}

            {viewMode === 'calendar' && (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-auto bg-card rounded-2xl border border-border shadow-sm p-4 h-[fit-content]">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0"
                    showOutsideDays={false}
                  />
                  <div className="mt-4 pt-4 border-t border-border sm:hidden flex justify-center">
                     <button onClick={() => setViewMode('list')} className="text-xs font-bold uppercase tracking-wider text-primary">Switch to List View</button>
                  </div>
                </div>
                <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-border bg-muted/20 flex justify-between items-center">
                    <h2 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                      Schedule for {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h2>
                  </div>
                  {filteredAppointments.filter(app => app.date === selectedDate?.toISOString().split('T')[0]).length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                      <p className="font-medium text-foreground mb-2">No appointments for this date</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredAppointments
                        .filter(app => app.date === selectedDate?.toISOString().split('T')[0])
                        .map(renderAppointmentItem)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
