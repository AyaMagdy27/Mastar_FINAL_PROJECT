import React from 'react';
import { Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagnosticResult {
  assessment: string;
  diagnosticSuggestions: string[];
  recommendedTests: string[];
}

interface HistoryItem {
  id: string;
  date: string;
  input: string;
  result: DiagnosticResult;
}

interface RecentAnalysesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoad: (input: string, result: DiagnosticResult) => void;
}

export function RecentAnalysesDrawer({
  isOpen,
  onClose,
  history,
  onLoad
}: RecentAnalysesDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center">
                <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                Recent Analyses
              </h2>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {history.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="text-base font-bold text-slate-700">No recent analyses</p>
                  <p className="text-sm mt-2 font-medium">Your last 5 queries will securely cache here.</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white border text-left border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group relative cursor-default"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">{item.date}</span>
                      <button 
                        onClick={() => onLoad(item.input, item.result)}
                        className="opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[11px] uppercase tracking-widest font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-md"
                      >
                        Load
                      </button>
                    </div>
                    <p className="text-sm text-slate-800 line-clamp-3 mb-4 font-medium leading-relaxed">{item.input}</p>
                    
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-indigo-900 line-clamp-2 leading-relaxed">{item.result.assessment}</p>
                      <div className="mt-3 flex gap-2">
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded uppercase tracking-wider shadow-sm">
                          {item.result.diagnosticSuggestions.length} Conditions
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded uppercase tracking-wider shadow-sm">
                          {item.result.recommendedTests.length} Tests
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
