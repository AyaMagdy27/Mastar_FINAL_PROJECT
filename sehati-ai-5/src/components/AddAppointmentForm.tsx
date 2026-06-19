import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Calendar, Clock, FileText, AlertCircle, Save, X, Building } from 'lucide-react';
import { Appointment } from '../types';

interface AddAppointmentFormProps {
  existingAppointments: Appointment[];
  initialData?: Appointment;
  onSubmit: (data: Omit<Appointment, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const DOCTORS = [
  'Dr. Sarah Chen',
  'Dr. Marcus Johnson',
  'Dr. Emily Rodriguez',
  'Dr. James Wilson'
];

const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'General Practice',
  'Orthopedics'
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

export function AddAppointmentForm({ existingAppointments, initialData, onSubmit, onCancel }: AddAppointmentFormProps) {
  
  const appointmentSchema = z.object({
    patientName: z.string().min(2, "Patient name must be at least 2 characters"),
    doctor: z.string().min(1, "Please select a doctor"),
    department: z.string().min(1, "Please select a department"),
    date: z.string().min(1, "Date is required"),
    timeSlot: z.string().min(1, "Time slot is required"),
    reason: z.string().optional()
  }).superRefine((data, ctx) => {
    const isDoubleBooked = existingAppointments.some(
      app => app.status !== 'cancelled' && 
             app.id !== initialData?.id &&
             app.doctor === data.doctor && 
             app.date === data.date && 
             app.timeSlot === data.timeSlot
    );

    if (isDoubleBooked) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "This doctor is already booked for this time slot.",
        path: ["timeSlot"]
      });
    }
  });

  type AppointmentFormData = z.infer<typeof appointmentSchema>;

  const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: initialData?.patientName || '',
      doctor: initialData?.doctor || '',
      department: initialData?.department || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      timeSlot: initialData?.timeSlot || '',
      reason: initialData?.reason || ''
    }
  });

  return (
    <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 py-5 border-b border-border bg-muted/20 flex justify-between items-center">
        <h2 className="text-lg font-bold text-foreground tracking-tight">{initialData ? 'Reschedule Appointment' : 'Book New Appointment'}</h2>
        <button 
          onClick={onCancel}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5" /> Patient Name
            </label>
            <input 
              {...register('patientName')}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                errors.patientName ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
              placeholder="e.g. John Doe"
            />
            {errors.patientName && (
              <p className="text-xs font-semibold text-destructive mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.patientName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <Building className="w-3.5 h-3.5 mr-1.5" /> Department
            </label>
            <select 
              {...register('department')}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                errors.department ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
            >
              <option value="">Select Department...</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="text-xs font-semibold text-destructive mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.department.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <User className="w-3.5 h-3.5 mr-1.5" /> Doctor
            </label>
            <select 
              {...register('doctor')}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                errors.doctor ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
            >
              <option value="">Select Doctor...</option>
              {DOCTORS.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            {errors.doctor && (
              <p className="text-xs font-semibold text-destructive mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.doctor.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Date
            </label>
            <input 
              type="date"
              {...register('date')}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                errors.date ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
            />
            {errors.date && (
              <p className="text-xs font-semibold text-destructive mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5" /> Time Slot
            </label>
            <select 
              {...register('timeSlot')}
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium focus:outline-none transition-colors ${
                errors.timeSlot ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'
              }`}
            >
              <option value="">Select a Time...</option>
              {TIME_SLOTS.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errors.timeSlot && (
              <p className="text-xs font-semibold text-destructive mt-1 flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1" /> {errors.timeSlot.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs uppercase font-bold text-muted-foreground tracking-wider flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Reason for Visit (Optional)
            </label>
            <textarea 
              {...register('reason')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted/50 focus:bg-background text-sm font-medium focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Briefly describe the reason for the appointment..."
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-border text-foreground text-xs font-bold hover:bg-accent transition-colors uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-sm flex items-center uppercase tracking-widest"
          >
            <Save className="w-4 h-4 mr-2" />
            {initialData ? 'Save Changes' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
