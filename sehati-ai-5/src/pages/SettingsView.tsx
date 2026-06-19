import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500">
      <Settings className="w-12 h-12 mb-4 text-slate-300" />
      <p className="font-medium text-slate-700">Settings module building out.</p>
    </div>
  );
}
