import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, User, Stethoscope, Mail, Phone, Clock, FileText, Building } from 'lucide-react';

export const doctorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialization: z.string().min(2, "Specialization is required"),
  department: z.string().min(2, "Department is required"),
  experience: z.string().min(1, "Experience is required"),
  qualifications: z.string().min(2, "Qualifications are required"),
  availability: z.string().min(2, "Availability is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  consultationFee: z.number().min(0, "Fee must be positive"),
});

export type DoctorFormData = z.infer<typeof doctorSchema>;

const InputLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{children}</label>
);

const ErrorMsg = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1 font-medium">{msg}</p>;
};

interface Props {
  initialData?: Partial<DoctorFormData>;
  onSubmit: (data: DoctorFormData) => void;
  isSubmitting?: boolean;
}

export function DoctorRegistrationForm({ initialData, onSubmit, isSubmitting }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      ...initialData,
      consultationFee: initialData?.consultationFee || 0,
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
      
      {/* Basic Info */}
      <div className="space-y-6">
        <div className="flex items-center pb-4 border-b border-border">
          <User className="w-5 h-5 text-primary mr-3" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Full Name <span className="text-destructive">*</span></InputLabel>
            <input 
              {...register('name')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.name ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
              placeholder="Dr. Sarah Chen"
            />
            <ErrorMsg msg={errors.name?.message} />
          </div>
          <div>
            <InputLabel>Email <span className="text-destructive">*</span></InputLabel>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input 
                {...register('email')} 
                type="email"
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.email ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
                placeholder="doctor@example.com"
              />
            </div>
            <ErrorMsg msg={errors.email?.message} />
          </div>
          <div>
            <InputLabel>Phone Number <span className="text-destructive">*</span></InputLabel>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input 
                {...register('phone')} 
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.phone ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <ErrorMsg msg={errors.phone?.message} />
          </div>
        </div>
      </div>

      {/* Professional Info */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center pb-4 border-b border-border">
          <Stethoscope className="w-5 h-5 text-primary mr-3" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Professional Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Specialization <span className="text-destructive">*</span></InputLabel>
            <input 
              {...register('specialization')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.specialization ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
              placeholder="e.g. Cardiology"
            />
            <ErrorMsg msg={errors.specialization?.message} />
          </div>
          <div>
            <InputLabel>Department <span className="text-destructive">*</span></InputLabel>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input 
                {...register('department')} 
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.department ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
                placeholder="e.g. Surgery"
              />
            </div>
            <ErrorMsg msg={errors.department?.message} />
          </div>
          <div>
            <InputLabel>Qualifications <span className="text-destructive">*</span></InputLabel>
            <div className="relative">
              <FileText className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input 
                {...register('qualifications')} 
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.qualifications ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
                placeholder="e.g. MBBS, MD"
              />
            </div>
            <ErrorMsg msg={errors.qualifications?.message} />
          </div>
          <div>
            <InputLabel>Experience (Years) <span className="text-destructive">*</span></InputLabel>
            <input 
              {...register('experience')} 
              type="number"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.experience ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
              placeholder="e.g. 10"
            />
            <ErrorMsg msg={errors.experience?.message} />
          </div>
        </div>
      </div>

      {/* Schedule & Fees */}
      <div className="space-y-6 pt-2">
        <div className="flex items-center pb-4 border-b border-border">
          <Clock className="w-5 h-5 text-primary mr-3" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Schedule & Fees</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Availability <span className="text-destructive">*</span></InputLabel>
            <input 
              {...register('availability')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.availability ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
              placeholder="e.g. Mon-Fri, 9AM-5PM"
            />
            <ErrorMsg msg={errors.availability?.message} />
          </div>
          <div>
            <InputLabel>Consultation Fee ($) <span className="text-destructive">*</span></InputLabel>
            <input 
              {...register('consultationFee', { valueAsNumber: true })} 
              type="number"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.consultationFee ? 'border-destructive bg-destructive/10 focus:ring-1 focus:ring-destructive' : 'border-border bg-muted/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary'}`}
              placeholder="e.g. 150"
            />
            <ErrorMsg msg={errors.consultationFee?.message} />
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Doctor Profile'}
        </button>
      </div>

    </form>
  );
}
