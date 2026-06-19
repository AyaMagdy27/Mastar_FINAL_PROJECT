import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, User, HeartPulse, ShieldAlert, Phone, MapPin, Activity, CreditCard, RefreshCw } from 'lucide-react';

export const patientSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  nationalId: z.string().min(5, "National ID is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(['male', 'female', 'other']),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Valid email required").or(z.literal('').transform(() => undefined)).optional(),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']),
  address: z.string().optional(),
  emergencyContactName: z.string().min(2, "Emergency contact name required"),
  emergencyContactPhone: z.string().min(10, "Emergency contact phone required"),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const InputLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
    {children}
  </label>
);

const ErrorMsg = ({ msg }: { msg?: string }) => {
  if (!msg) return null;
  return <p className="text-xs text-red-600 font-semibold mt-1.5">{msg}</p>;
};

const DRAFT_KEY = 'medcore_add_patient_draft';

export function PatientRegistrationForm({ onSubmit, onCancel, isSubmitting }: PatientRegistrationFormProps) {
  const [hasDraft, setHasDraft] = useState(() => {
    return !!localStorage.getItem(DRAFT_KEY);
  });

  const getSavedDraft = (): Partial<PatientFormValues> => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse saved draft', err);
    }
    return { gender: 'male', bloodType: 'Unknown' };
  };

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: getSavedDraft()
  });

  const formValues = watch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Object.keys(formValues).length > 0) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
        setHasDraft(true);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formValues]);

  const handleFormSubmit = async (data: PatientFormValues) => {
    await onSubmit(data);
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    reset({ gender: 'male', bloodType: 'Unknown' });
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setHasDraft(false);
    reset({ gender: 'male', bloodType: 'Unknown', firstName: '', lastName: '', nationalId: '', dateOfBirth: '', phoneNumber: '', email: '', address: '', emergencyContactName: '', emergencyContactPhone: '', allergies: '', chronicConditions: '' });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {hasDraft && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center text-indigo-800 text-sm font-medium">
            <RefreshCw className="w-4 h-4 mr-2" />
            A saved draft has been recovered.
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-xs font-bold text-indigo-600 uppercase hover:text-indigo-800"
          >
            Clear Draft
          </button>
        </div>
      )}
      {/* Personal Details */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <User className="w-4 h-4 mr-2 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Personal Details</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>First Name <span className="text-red-500">*</span></InputLabel>
            <input 
              {...register('firstName')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.firstName ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="John"
            />
            <ErrorMsg msg={errors.firstName?.message} />
          </div>
          <div>
            <InputLabel>Last Name <span className="text-red-500">*</span></InputLabel>
            <input 
              {...register('lastName')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.lastName ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="Doe"
            />
            <ErrorMsg msg={errors.lastName?.message} />
          </div>
          <div>
            <InputLabel>National ID <span className="text-red-500">*</span></InputLabel>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                {...register('nationalId')} 
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.nationalId ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
                placeholder="123456789"
              />
            </div>
            <ErrorMsg msg={errors.nationalId?.message} />
          </div>
          <div>
            <InputLabel>Date of Birth <span className="text-red-500">*</span></InputLabel>
            <input 
              type="date"
              {...register('dateOfBirth')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.dateOfBirth ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
            />
            <ErrorMsg msg={errors.dateOfBirth?.message} />
          </div>
          <div>
            <InputLabel>Gender <span className="text-red-500">*</span></InputLabel>
            <select 
              {...register('gender')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <Phone className="w-4 h-4 mr-2 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Contact Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Phone Number <span className="text-red-500">*</span></InputLabel>
            <input 
              {...register('phoneNumber')} 
              type="tel"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.phoneNumber ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="+1 (555) 000-0000"
            />
            <ErrorMsg msg={errors.phoneNumber?.message} />
          </div>
          <div>
            <InputLabel>Email Address</InputLabel>
            <input 
              {...register('email')} 
              type="email"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.email ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="patient@example.com"
            />
            <ErrorMsg msg={errors.email?.message as string} />
          </div>
          <div className="md:col-span-2">
            <InputLabel>Physical Address</InputLabel>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input 
                {...register('address')} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Street address, City, State, ZIP"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Profile */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <HeartPulse className="w-4 h-4 mr-2 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Medical Profile</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Blood Type</InputLabel>
            <select 
              {...register('bloodType')}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="Unknown">Unknown</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <InputLabel>Known Allergies (comma separated)</InputLabel>
            <div className="relative">
              <ShieldAlert className="w-4 h-4 absolute left-3 top-3 text-amber-500" />
              <input 
                {...register('allergies')} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Penicillin, Peanuts, Latex"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <InputLabel>Chronic Conditions</InputLabel>
            <div className="relative">
              <Activity className="w-4 h-4 absolute left-3 top-3 text-indigo-400" />
              <input 
                {...register('chronicConditions')} 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium transition-colors focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Type 2 Diabetes, Hypertension"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center">
          <Phone className="w-4 h-4 mr-2 text-rose-600" />
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Emergency Contact</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InputLabel>Full Name <span className="text-red-500">*</span></InputLabel>
            <input 
              {...register('emergencyContactName')} 
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.emergencyContactName ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="Jane Doe"
            />
            <ErrorMsg msg={errors.emergencyContactName?.message} />
          </div>
          <div>
            <InputLabel>Phone Number <span className="text-red-500">*</span></InputLabel>
            <input 
              {...register('emergencyContactPhone')} 
              type="tel"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors focus:outline-none ${errors.emergencyContactPhone ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}`}
              placeholder="+1 (555) 000-0000"
            />
            <ErrorMsg msg={errors.emergencyContactPhone?.message} />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors bg-white shadow-sm"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Patient Profile
            </>
          )}
        </button>
      </div>
    </form>
  );
}
