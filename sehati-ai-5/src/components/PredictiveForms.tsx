import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, AlertCircle, ArrowRight, ShieldCheck, FileText, ChevronRight, Activity } from 'lucide-react';
import { RiskAssessmentCard } from './RiskAssessmentCard';

interface PredictionResponse {
  riskPercentage: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  contributingFactors: { feature: string; impact: string; description: string; importanceValue?: number }[];
  lifestyleRecommendations: string[];
  suggestedTestsOrReferrals: string[];
  monitoringSchedule: string;
}

const ResultCard = ({ result, loading, error }: { result: PredictionResponse | null, loading: boolean, error: string | null }) => {
   if (loading) {
      return (
         <div className="bg-card border border-border p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px]">
             <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <BrainCircuit className="w-6 h-6 text-primary animate-pulse" />
             </div>
             <p className="mt-4 text-sm font-bold uppercase tracking-widest text-primary animate-pulse">Running ML Pipeline...</p>
             <p className="mt-2 text-xs text-muted-foreground text-center max-w-xs">Connecting to prediction microservice and evaluating SHAP interactions...</p>
         </div>
      );
   }

   if (error) {
      return (
         <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[400px] text-center">
             <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
             <h3 className="text-lg font-bold text-red-600 mb-2">Analysis Failed</h3>
             <p className="text-sm text-red-600/80 max-w-sm">{error}</p>
         </div>
      );
   }

   if (!result) return null;

   // Generate some visual variance for SHAP bars if importanceValue is missing
   const factorsWithImportance = result.contributingFactors.map((f, i) => ({
      ...f,
      importanceValue: f.importanceValue ?? Math.max(20, 100 - (i * 15)) // Descending importance visually
   }));

   return (
      <div className="space-y-6">
         <RiskAssessmentCard 
           score={result.riskPercentage}
           category={result.riskLevel}
           factors={factorsWithImportance}
           title="Diagnostic Risk Score"
         />
         
         {/* Additional Recommendations Section that was part of the original ResultCard */}
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                  Recommendations
               </h3>
               <div className="space-y-2">
                  {result.lifestyleRecommendations.map((r, i) => (
                     <div key={i} className="flex items-start space-x-2 text-sm text-foreground">
                        <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{r}</span>
                     </div>
                  ))}
               </div>
            </div>

            {result.suggestedTestsOrReferrals && result.suggestedTestsOrReferrals.length > 0 && (
               <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-3 flex items-center">
                     <FileText className="w-4 h-4 mr-2 text-primary" />
                     Suggested Tests
                  </h3>
                  <div className="space-y-2">
                     {result.suggestedTestsOrReferrals.map((r, i) => (
                        <div key={i} className="flex items-start space-x-2 text-sm text-foreground">
                           <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                           <span>{r}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            <div className="pt-4 border-t border-border flex justify-between items-center bg-muted/20 p-4 rounded-xl">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monitoring Plan</p>
                  <p className="text-sm font-medium text-foreground mt-1">{result.monitoringSchedule}</p>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export const DiabetesForm = () => {
   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState<PredictionResponse | null>(null);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      setError(null);

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
         const res = await fetch('/api/predict/diabetes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         });
         const json = await res.json();
         if (res.ok) {
            setResult(json);
         } else {
            setError(json.error || 'Failed to analyze data.');
         }
      } catch (err) {
         setError('Failed to connect to the prediction engine.');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Diabetes Risk Assessment</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Age</label>
                  <input name="age" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Gender</label>
                  <select name="gender" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none">
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">BMI</label>
                  <input name="bmi" type="number" step="0.1" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Fasting Glucose (mg/dL)</label>
                  <input name="glucose" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">HbA1c (%)</label>
                  <input name="hba1c" type="number" step="0.1" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Family History</label>
                  <select name="familyHistory" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="No">No</option>
                     <option value="Yes - Parent">Yes - Parent</option>
                     <option value="Yes - Sibling">Yes - Sibling</option>
                  </select>
               </div>
               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Physical Activity</label>
                  <select name="activityLevel" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="Sedentary">Sedentary (Little/no exercise)</option>
                     <option value="Moderate">Moderate (Exercise 1-3 days/week)</option>
                     <option value="Active">Active (Exercise 3-5 days/week)</option>
                  </select>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all flex justify-center items-center mt-4">
               {loading ? 'Evaluating Model...' : 'Calculate Risk Score'} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
         </form>

         <div>
            <ResultCard result={result} loading={loading} error={error} />
         </div>
      </div>
   );
};

export const HeartDiseaseForm = () => {
   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState<PredictionResponse | null>(null);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      setError(null);

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
         const res = await fetch('/api/predict/heart-disease', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         });
         const json = await res.json();
         if (res.ok) {
            setResult(json);
         } else {
            setError(json.error || 'Failed to analyze data.');
         }
      } catch (err) {
         setError('Failed to connect to the prediction engine.');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Heart Disease Risk</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Age</label>
                  <input name="age" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Chest Pain Type</label>
                  <select name="chestPainType" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="Typical Angina">Typical Angina</option>
                     <option value="Atypical Angina">Atypical Angina</option>
                     <option value="Non-anginal">Non-anginal Pain</option>
                     <option value="Asymptomatic">Asymptomatic</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Resting BP (mmHg)</label>
                  <input name="restingBP" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Cholesterol (mg/dL)</label>
                  <input name="cholesterol" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Max Heart Rate</label>
                  <input name="maxHR" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">ECG Results</label>
                  <select name="ecg" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="Normal">Normal</option>
                     <option value="ST-T Wave Abnormality">ST-T Wave Abnormality</option>
                     <option value="Left Ventricular Hypertrophy">Left Ventricular Hypertrophy</option>
                  </select>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all flex justify-center items-center mt-4">
               {loading ? 'Evaluating Model...' : 'Calculate Risk Score'} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
         </form>

         <div>
            <ResultCard result={result} loading={loading} error={error} />
         </div>
      </div>
   );
};

export const HypertensionForm = () => {
   const [loading, setLoading] = useState(false);
   const [result, setResult] = useState<PredictionResponse | null>(null);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      setError(null);

      const formData = new FormData(e.target as HTMLFormElement);
      const data = Object.fromEntries(formData.entries());
      
      try {
         const res = await fetch('/api/predict/hypertension', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
         });
         const json = await res.json();
         if (res.ok) {
            setResult(json);
         } else {
            setError(json.error || 'Failed to analyze data.');
         }
      } catch (err) {
         setError('Failed to connect to the prediction engine.');
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <form onSubmit={handleSubmit} className="bg-card border border-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Hypertension Risk</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Systolic BP</label>
                  <input name="systolicBP" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Diastolic BP</label>
                  <input name="diastolicBP" type="number" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">BMI</label>
                  <input name="bmi" type="number" step="0.1" required className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none" />
               </div>
               <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sodium Intake</label>
                  <select name="sodium" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="Low">Low</option>
                     <option value="Moderate">Moderate</option>
                     <option value="High">High</option>
                  </select>
               </div>
               <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Stress Level</label>
                  <select name="stress" className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none">
                     <option value="Low">Low (Rarely stressed)</option>
                     <option value="Moderate">Moderate</option>
                     <option value="High">High (Constantly stressed)</option>
                  </select>
               </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all flex justify-center items-center mt-4">
               {loading ? 'Evaluating Model...' : 'Calculate Risk Score'} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
         </form>

         <div>
            <ResultCard result={result} loading={loading} error={error} />
         </div>
      </div>
   );
};
