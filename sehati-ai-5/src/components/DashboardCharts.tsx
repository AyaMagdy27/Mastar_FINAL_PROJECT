import React from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Skeleton } from '../../components/ui/skeleton';

const monthlyAppointmentsData = [
  { name: 'Jan', appointments: 1200 },
  { name: 'Feb', appointments: 1500 },
  { name: 'Mar', appointments: 1800 },
  { name: 'Apr', appointments: 2200 },
  { name: 'May', appointments: 1900 },
  { name: 'Jun', appointments: 2500 },
  { name: 'Jul', appointments: 2800 },
  { name: 'Aug', appointments: 3100 },
  { name: 'Sep', appointments: 2900 },
  { name: 'Oct', appointments: 3300 },
  { name: 'Nov', appointments: 3500 },
  { name: 'Dec', appointments: 3800 },
];

const revenueTrendsData = [
  { name: 'Q1', revenue: 150000 },
  { name: 'Q2', revenue: 210000 },
  { name: 'Q3', revenue: 180000 },
  { name: 'Q4', revenue: 280000 },
];

const diseaseAnalyticsData = [
  { name: 'Cardiovascular', value: 35 },
  { name: 'Respiratory', value: 25 },
  { name: 'Neurological', value: 20 },
  { name: 'Orthopedic', value: 15 },
  { name: 'Other', value: 5 },
];

const departmentActivityData = [
  { name: 'Cardio', patients: 1400 },
  { name: 'Neuro', patients: 850 },
  { name: 'Peds', patients: 2200 },
  { name: 'Ortho', patients: 1600 },
  { name: 'Derm', patients: 1100 },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

export function DashboardCharts({ isLoading }: { isLoading?: boolean }) {
  const chartHeight = 250;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Monthly Appointments</h2>
        </div>
        <div className="flex-1 w-full relative p-6 pt-8">
          {isLoading ? (
            <Skeleton className="w-full h-[250px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={monthlyAppointmentsData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="appointments" name="Appointments" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAppointments)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
         <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Revenue Trends</h2>
        </div>
        <div className="flex-1 w-full relative p-6 pt-8">
          {isLoading ? (
            <Skeleton className="w-full h-[250px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <LineChart data={revenueTrendsData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                  cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
         <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Disease Analytics</h2>
        </div>
        <div className="flex-1 w-full relative p-6 flex items-center justify-center">
          {isLoading ? (
            <div className="flex w-full items-center justify-center space-x-8">
               <Skeleton className="w-40 h-40 rounded-full" />
               <div className="space-y-4">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="w-24 h-4" />)}
               </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <PieChart>
                <Pie
                  data={diseaseAnalyticsData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {diseaseAnalyticsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
         <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Department Statistics</h2>
        </div>
        <div className="flex-1 w-full relative p-6 pt-8">
          {isLoading ? (
            <Skeleton className="w-full h-[250px] rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={departmentActivityData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                  contentStyle={{ borderRadius: '12px', borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="patients" name="Patients" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
