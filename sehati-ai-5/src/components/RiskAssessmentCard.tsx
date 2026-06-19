import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export interface SHAPFactor {
  feature: string;
  impact: 'Positive' | 'Negative' | string;
  importanceValue?: number; // 0 to 100 for visual length of the bar
  description?: string;
}

export interface RiskAssessmentProps {
  score: number;
  category: 'Low' | 'Moderate' | 'High' | 'Critical';
  factors: SHAPFactor[];
  title?: string;
}

export function RiskAssessmentCard({ score, category, factors, title = 'Diagnostic Risk Score' }: RiskAssessmentProps) {
  const riskColors = {
    Low: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Moderate: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    High: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    Critical: 'text-red-600 bg-red-600/10 border-red-600/20',
  };

  const riskBg = {
    Low: 'bg-emerald-500',
    Moderate: 'bg-amber-500',
    High: 'bg-rose-500',
    Critical: 'bg-red-600',
  };

  // Sort factors by absolute importance value if available, assuming higher is more important
  const sortedFactors = [...factors].sort((a, b) => (b.importanceValue || 0) - (a.importanceValue || 0));

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
      <div className={`p-8 border-b border-border flex flex-col items-center justify-center relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${riskBg[category]}`}></div>
        <p className="text-[11px] uppercase tracking-widest font-black text-muted-foreground mb-4">{title}</p>
        <div className="flex items-baseline space-x-1 mb-2">
          <h2 className={`text-6xl font-black tracking-tighter ${riskColors[category].split(' ')[0]}`}>{score}</h2>
          <span className="text-2xl font-bold text-muted-foreground">%</span>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${riskColors[category]}`}>
          {category} RISK
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-primary" />
            Feature Importance (SHAP)
          </h3>
          <div className="space-y-5">
            {sortedFactors.map((f, i) => {
              const isPositive = f.impact.toLowerCase() === 'positive';
              // Default to 50% if importanceValue is not provided, for visual fallback
              const width = f.importanceValue !== undefined ? `${Math.min(100, Math.max(0, f.importanceValue))}%` : '50%';
              
              return (
                <div key={i} className="flex flex-col space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-foreground">{f.feature}</p>
                    {f.description && (
                      <span className="text-xs text-muted-foreground max-w-[60%] text-right truncate" title={f.description}>
                        {f.description}
                      </span>
                    )}
                  </div>
                  
                  {/* SHAP Bar Chart representation */}
                  <div className="w-full h-2.5 bg-muted/50 rounded-full overflow-hidden flex items-center">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${isPositive ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">
                      {isPositive ? 'Increases Risk (+)' : 'Decreases Risk (-)'}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isPositive ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                      {f.impact}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
