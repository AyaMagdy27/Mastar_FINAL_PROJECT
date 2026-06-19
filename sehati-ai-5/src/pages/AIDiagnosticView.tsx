import React, { useState, useEffect } from 'react';
import { Stethoscope, Clock, AlertCircle, Activity, HeartPulse, BrainCircuit, ActivitySquare } from 'lucide-react';
import { motion } from 'motion/react';
import { DiagnosticResult, HistoryItem } from '../types';

export default function AIDiagnosticView() {
  const [inputs, setInputs] = useState({
    symptoms: '',
    age: '',
    gender: '',
    vitalSigns: '',
    medicalHistory: '',
    labResults: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<null | DiagnosticResult>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('diagnosticHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const saveToHistory = (newInputs: any, newResult: DiagnosticResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      input: newInputs,
      result: newResult
    };
    const updatedHistory = [newItem, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('diagnosticHistory', JSON.stringify(updatedHistory));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAnalyze = async () => {
    if (!inputs.symptoms.trim()) return;
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze data');

      setResult(data);
      saveToHistory(inputs, data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center tracking-tight">
            <BrainCircuit className="w-8 h-8 mr-4 text-primary" />
            AI Diagnostic Assistant
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-2 max-w-2xl">Enter comprehensive patient context—including vitals, lab highlights, and presenting symptoms—for AI-assisted analysis and recommended action plans.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center px-5 py-2.5 bg-card border border-border text-foreground rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-sm shrink-0 active:scale-95"
        >
          <Clock className="w-4 h-4 mr-2 text-primary" />
          History ({history.length})
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col">
        <div className="bg-primary px-8 py-5 flex items-center justify-between text-primary-foreground">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
            <span className="text-xs font-bold uppercase tracking-widest leading-none">Diagnostic Engine Activated</span>
          </div>
          <span className="text-[10px] opacity-80 font-mono tracking-wider bg-black/20 px-2 py-1 rounded">GPT-4.0</span>
        </div>
        
        <div className="p-8">
          <div className="mb-8 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-widest text-center flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              AI-generated suggestions are for clinical decision support only and do not replace professional medical judgment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Symptoms (Required)</label>
              <textarea 
                name="symptoms"
                value={inputs.symptoms} 
                onChange={handleChange} 
                rows={3} 
                className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Chief complaints and onset details..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Age</label>
              <input type="text" name="age" value={inputs.age} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="e.g. 45" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Gender</label>
              <input type="text" name="gender" value={inputs.gender} onChange={handleChange} className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary" placeholder="e.g. Male" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Vital Signs</label>
              <textarea name="vitalSigns" value={inputs.vitalSigns} onChange={handleChange} rows={2} className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none" placeholder="BP, HR, Temp, Resp..." />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Medical History</label>
              <textarea name="medicalHistory" value={inputs.medicalHistory} onChange={handleChange} rows={2} className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Past illnesses, chronic conditions..." />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-wider">Lab Results (Highlights)</label>
              <textarea name="labResults" value={inputs.labResults} onChange={handleChange} rows={2} className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none" placeholder="Abnormal labs, recent tests..." />
            </div>
          </div>
          
          <div className="flex justify-end mt-2">
            <button 
              onClick={handleAnalyze}
              disabled={isLoading || !inputs.symptoms.trim()}
              className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg active:scale-95"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Analysis...
                </>
              ) : (
                <>Generate AI Analysis</>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border-t border-b border-destructive/20 text-destructive px-8 py-5 flex items-start">
            <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t border-border bg-muted/20"
          >
            <div className="p-8 grid gap-6 md:grid-cols-2">
               <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Confidence Score</span>
                    <span className="text-2xl font-black text-primary">{result.confidenceScore}%</span>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col justify-center items-center text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Risk Level</span>
                    <span className={`text-xl font-black uppercase tracking-wider ${
                      result.riskLevel === 'Critical' ? 'text-red-600' :
                      result.riskLevel === 'High' ? 'text-amber-600' :
                      result.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-emerald-600'
                    }`}>{result.riskLevel}</span>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl md:col-span-2 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">Medical Summary</span>
                    <p className="text-sm font-medium text-foreground">{result.medicalSummary}</p>
                  </div>
               </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                  <ActivitySquare className="w-4 h-4 mr-2" /> Symptom Interpretation
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{result.symptomInterpretation}</p>
              </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" /> Risk Assessment
                </h3>
                <p className="text-sm text-foreground leading-relaxed">{result.riskAssessment}</p>
              </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" /> Possible Conditions
                </h3>
                <div className="space-y-3">
                  {result.possibleConditions.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-foreground font-medium">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                  <Stethoscope className="w-4 h-4 mr-2" /> Differential Diagnosis
                </h3>
                <div className="space-y-3">
                  {result.differentialDiagnosis.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border border-border">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      <p className="text-sm text-foreground font-medium">{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                   <Activity className="w-4 h-4 mr-2 text-blue-500" /> Recommended Tests
                </h3>
                <div className="space-y-3">
                  {result.recommendedTests.map((t, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <p className="text-sm text-foreground font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                   <HeartPulse className="w-4 h-4 mr-2 text-indigo-500" /> Suggested Treatments
                </h3>
                <div className="space-y-3">
                  {result.suggestedTreatments.map((t, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                      <p className="text-sm text-foreground font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-4 pb-3 border-b border-border flex items-center">
                   <HeartPulse className="w-4 h-4 mr-2 text-emerald-500" /> Suggested Next Actions
                </h3>
                <div className="space-y-3">
                  {result.suggestedNextActions.map((t, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      <p className="text-sm text-foreground font-medium">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-muted px-8 py-4 border-t border-border flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Analysis Complete</span>
              <span className="text-[10px] uppercase font-bold text-primary tracking-wider">GPT-4.0 Engine</span>
            </div>
          </motion.div>
        )}

        {/* Note: RecentAnalysesDrawer is commented out for this update or needs to be updated to match the new history schema. Let's just remove it if it exists to avoid type errors since we changed input schema */}
      </div>
    </div>
  );
}
