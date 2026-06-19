import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Activity, HeartPulse, Droplet, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HeartDiseaseForm, DiabetesForm, HypertensionForm } from '../components/PredictiveForms';

type PredictionType = 'diabetes' | 'heart-disease' | 'hypertension';

export default function PredictiveHealth() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<PredictionType>('diabetes');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center tracking-tight">
            <BrainCircuit className="w-8 h-8 mr-4 text-purple-500" />
            Predictive Health AI
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-2 max-w-2xl">
            {role === 'PATIENT' ? 
              'Assess your risk for common conditions before they develop using advanced machine learning models.' : 
              'Clinical decision support engine. Forecast patient risks using historical health data and real-time metrics.'
            }
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3">
         <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
         <div>
            <p className="text-sm font-bold text-amber-600">Clinical Disclaimer</p>
            <p className="text-xs font-medium text-amber-600/80 mt-1 max-w-4xl">
               Predictions are intended for clinical decision support only and must not replace professional medical judgment. 
               The AI models analyze statistical risk based on demographics and vital signs, but a qualified healthcare provider must make all final diagnoses.
            </p>
         </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTab('diabetes')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'diabetes' 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-card border border-border text-foreground hover:bg-accent'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>Diabetes Risk</span>
        </button>
        <button
          onClick={() => setActiveTab('heart-disease')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'heart-disease' 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-card border border-border text-foreground hover:bg-accent'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Heart Disease</span>
        </button>
        <button
          onClick={() => setActiveTab('hypertension')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'hypertension' 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'bg-card border border-border text-foreground hover:bg-accent'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Hypertension</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
               {activeTab === 'diabetes' && (
                  <motion.div key="diabetes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <DiabetesForm />
                  </motion.div>
               )}
               {activeTab === 'heart-disease' && (
                  <motion.div key="heart-disease" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <HeartDiseaseForm />
                  </motion.div>
               )}
               {activeTab === 'hypertension' && (
                  <motion.div key="hypertension" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <HypertensionForm />
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-border bg-muted/20">
                <h3 className="text-sm font-bold text-foreground flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                  High-Risk Patients Alert
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Top 3 flagged by predictive models</p>
              </div>
              <div className="p-0 divide-y divide-border">
                {[
                  { name: "James Wilson", id: "PT-804", risk: "92%", condition: "Heart Disease", trend: "up" },
                  { name: "Sylvia Plath", id: "PT-912", risk: "88%", condition: "Diabetes Type II", trend: "up" },
                  { name: "Michael Chen", id: "PT-802", risk: "76%", condition: "Hypertension", trend: "stable" }
                ].map((patient, idx) => (
                  <div key={idx} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-foreground">{patient.name}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-muted px-2 py-0.5 rounded-full mr-2">{patient.id}</span>
                        <span className="text-xs font-medium text-foreground">{patient.condition}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-lg font-bold text-rose-500">{patient.risk}</span>
                      </div>
                      <span className="text-[10px] font-bold text-rose-500/70 uppercase tracking-widest">Risk Level</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border bg-muted/10">
                <button className="w-full text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 py-2.5 rounded-xl transition-colors">
                  View Comprehensive Risk Report
                </button>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
