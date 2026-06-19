import React from 'react';
import { Users, Calendar, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ReceptionistDashboard() {
  const navigate = useNavigate();
  
  const stats = [
    { label: "Today's Appointments", value: '42', icon: Calendar, change: '12 completed' },
    { label: 'Waiting Patients', value: '8', icon: Users, change: 'Avg wait: 14 mins' },
    { label: 'Pending Payments', value: '15', icon: DollarSign, change: 'Action required' },
    { label: 'Avg Queue Time', value: '18m', icon: Clock, change: '-2m from yesterday' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-foreground mb-1">{stat.value}</h3>
                <p className="text-[11px] uppercase font-bold text-muted-foreground">{stat.label}</p>
                <p className="text-[10px] mt-3 font-semibold text-muted-foreground">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-base font-bold text-foreground">Live Queue Management</h3>
             <button 
               onClick={() => navigate('/dashboard/patients/new')}
               className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-all active:scale-95"
             >
               + Register Patient
             </button>
          </div>
          <div className="space-y-3">
             <div className="p-3 border border-border rounded-xl flex justify-between items-center">
                <div className="flex gap-4">
                   <div className="text-center bg-muted/30 px-3 py-1 rounded-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Token</p>
                      <p className="font-mono font-bold">A-12</p>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-foreground">Robert Johnson</p>
                      <p className="text-xs text-muted-foreground">Dr. Sarah Chen (Cardiology)</p>
                   </div>
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">In Consultation</span>
             </div>
             <div className="p-3 border border-border rounded-xl flex justify-between items-center bg-muted/10">
                <div className="flex gap-4">
                   <div className="text-center bg-muted/30 px-3 py-1 rounded-sm">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Token</p>
                      <p className="font-mono font-bold">A-13</p>
                   </div>
                   <div>
                      <p className="text-sm font-bold text-foreground">Jane Smith</p>
                      <p className="text-xs text-muted-foreground">Dr. Sarah Chen (Cardiology)</p>
                   </div>
                </div>
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">Waiting (15m)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
