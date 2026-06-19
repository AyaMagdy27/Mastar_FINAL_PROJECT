import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Users, Calendar, Stethoscope, DollarSign, Activity } from 'lucide-react';
import { DashboardCharts } from '../../components/DashboardCharts';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Patients', value: '14,248', icon: Users, change: '+12% from last month', changeType: 'positive' },
    { label: 'Total Doctors', value: '124', icon: Stethoscope, change: '+4 new this month', changeType: 'positive' },
    { label: 'Total Appointments', value: '1,842', icon: Calendar, change: '-2% from last month', changeType: 'negative' },
    { label: 'Revenue', value: '$842,500', icon: DollarSign, change: '+18% from last month', changeType: 'positive' },
    { label: 'AI Reports Generated', value: '8,421', icon: Activity, change: '+42% from last month', changeType: 'positive' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <p className={`text-[10px] mt-3 font-semibold ${stat.changeType === 'positive' ? 'text-emerald-500' : 'text-destructive'}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <DashboardCharts isLoading={false} />
    </div>
  );
}
