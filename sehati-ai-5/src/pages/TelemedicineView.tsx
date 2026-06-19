import React from 'react';
import { Video } from 'lucide-react';

export default function TelemedicineView() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm h-[calc(100vh-8rem)]">
      <Video className="w-16 h-16 mb-4 text-indigo-300" />
      <h2 className="text-xl font-bold text-slate-800 mb-2">Telemedicine Portal</h2>
      <p className="font-medium text-slate-500 text-center max-w-md">The video consultation and remote monitoring module will be deployed in Phase 5.</p>
    </div>
  );
}
