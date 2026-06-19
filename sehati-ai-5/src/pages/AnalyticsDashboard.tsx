import React, { useState } from 'react';
import {
  TrendingUp, Activity, Users, FileText, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart4, AlertCircle, BrainCircuit, HeartPulse, Building2, Calendar
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'motion/react';

const COMMON_DISEASES_DATA = [
  { name: 'Hypertension', value: 340, color: '#3b82f6' }, // blue-500
  { name: 'Diabetes Type 2', value: 280, color: '#10b981' }, // emerald-500
  { name: 'Asthma', value: 150, color: '#f59e0b' }, // amber-500
  { name: 'Osteoarthritis', value: 110, color: '#8b5cf6' }, // violet-500
  { name: 'Heart Disease', value: 90, color: '#ef4444' }, // red-500
];

const PATIENT_TRENDS_DATA = [
  { name: 'Jan', new: 400, returning: 240 },
  { name: 'Feb', new: 300, returning: 139 },
  { name: 'Mar', new: 200, returning: 400 },
  { name: 'Apr', new: 278, returning: 490 },
  { name: 'May', new: 189, returning: 380 },
  { name: 'Jun', new: 239, returning: 380 },
  { name: 'Jul', new: 349, returning: 430 },
];

const APPOINTMENT_TRENDS_DATA = [
  { name: 'Mon', completed: 120, missed: 15 },
  { name: 'Tue', completed: 132, missed: 12 },
  { name: 'Wed', completed: 101, missed: 20 },
  { name: 'Thu', completed: 142, missed: 8 },
  { name: 'Fri', completed: 150, missed: 25 },
  { name: 'Sat', completed: 80, missed: 5 },
  { name: 'Sun', completed: 50, missed: 2 },
];

const DEPARTMENTS = [
  { id: 'cardiology', name: 'Cardiology', utilization: 85, trend: '+5%', status: 'High' },
  { id: 'neurology', name: 'Neurology', utilization: 62, trend: '-2%', status: 'Normal' },
  { id: 'pediatrics', name: 'Pediatrics', utilization: 78, trend: '+12%', status: 'High' },
  { id: 'orthopedics', name: 'Orthopedics', utilization: 45, trend: '-8%', status: 'Low' },
  { id: 'oncology', name: 'Oncology', utilization: 92, trend: '+15%', status: 'Critical' },
];

const HEATMAP_DATA = [
  { day: 'Mon', h08: 20, h10: 45, h12: 30, h14: 55, h16: 40 },
  { day: 'Tue', h08: 25, h10: 50, h12: 35, h14: 60, h16: 45 },
  { day: 'Wed', h08: 30, h10: 40, h12: 25, h14: 50, h16: 35 },
  { day: 'Thu', h08: 22, h10: 48, h12: 32, h14: 65, h16: 42 },
  { day: 'Fri', h08: 35, h10: 55, h12: 40, h14: 70, h16: 50 },
];

const HEATMAP_COLORS = ['#eff6ff', '#bfdbfe', '#60a5fa', '#3b82f6', '#1d4ed8'];
const getHeatmapColor = (value: number) => {
  if (value < 25) return HEATMAP_COLORS[0];
  if (value < 35) return HEATMAP_COLORS[1];
  if (value < 45) return HEATMAP_COLORS[2];
  if (value < 55) return HEATMAP_COLORS[3];
  return HEATMAP_COLORS[4];
};

export default function AnalyticsDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const generateAIInsights = () => {
    setIsGenerating(true);
    // Simulate AI generation delay
    setTimeout(() => {
      setAiInsights([
        "Patient volume in Cardiology is projected to exceed capacity by 15% next week based on historical season trends.",
        "Readmission risk for Heart Disease patients has increased by 4.2% this month. Adjusting post-discharge follow-up to 48 hours is recommended.",
        "Missing appointment rates peak on Fridays at 2:00 PM. Implementing automated SMS reminders 2 hours prior may reduce no-shows.",
        "Orthopedics utilization is currently low (45%). Consider reallocating flex-staff to Oncology which is at critical capacity (92%)."
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center tracking-tight">
            <BarChart4 className="w-8 h-8 mr-4 text-primary" />
            Analytics & Intelligence
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-2 max-w-2xl">
            Enterprise-grade healthcare analytics, patient trends, readmission risks, and AI-driven insights.
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-card border border-border text-foreground hover:bg-accent rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI Cards */}
        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Total Patients</p>
              <h3 className="text-3xl font-black text-foreground">12,480</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +8.2% from last month
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Avg Readmission Risk</p>
              <h3 className="text-3xl font-black text-foreground">14.2%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-amber-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +1.5% from last month
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Treatment Efficacy</p>
              <h3 className="text-3xl font-black text-foreground">92%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-emerald-600">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            +3.1% from last month
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Avg Daily Visits</p>
              <h3 className="text-3xl font-black text-foreground">428</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs font-bold text-red-600">
            <ArrowDownRight className="w-4 h-4 mr-1" />
            -4.2% from last month
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Patient Acquisition Trends
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PATIENT_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReturning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ fontSize: '13px', fontWeight: '500' }}
                />
                <Area type="monotone" dataKey="new" name="New Patients" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorNew)" />
                <Area type="monotone" dataKey="returning" name="Returning" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorReturning)" />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center">
            <HeartPulse className="w-5 h-5 mr-2 text-rose-500" />
            Common Diseases
          </h3>
          <div className="flex-1 min-h-[250px] relative w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COMMON_DISEASES_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {COMMON_DISEASES_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border)),', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }} 
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-2xl font-black text-foreground">Top 5</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Diagnoses</span>
                </div>
             </div>
          </div>
          <div className="mt-4 space-y-2">
            {COMMON_DISEASES_DATA.map((disease, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-medium">
                <div className="flex items-center">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: disease.color }}></span>
                  <span className="text-foreground">{disease.name}</span>
                </div>
                <span className="text-muted-foreground font-mono">{disease.value} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Appointment Heatmap & Trends */}
         <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Appointment Volume Heatmap
            </h3>
            
            <div className="space-y-4">
              <div className="flex text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-2 px-8">
                 <div className="flex-1 text-center">08:00</div>
                 <div className="flex-1 text-center">10:00</div>
                 <div className="flex-1 text-center">12:00</div>
                 <div className="flex-1 text-center">14:00</div>
                 <div className="flex-1 text-center">16:00</div>
              </div>
              {HEATMAP_DATA.map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 text-[11px] font-bold text-muted-foreground uppercase">{row.day}</div>
                  <div className="flex-1 grid grid-cols-5 gap-1.5 h-8">
                     <div className="rounded-md transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-transparent hover:text-white text-[10px] font-mono leading-none" style={{ backgroundColor: getHeatmapColor(row.h08) }} title={`${row.h08} appts`}>{row.h08}</div>
                     <div className="rounded-md transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-transparent hover:text-white text-[10px] font-mono leading-none" style={{ backgroundColor: getHeatmapColor(row.h10) }} title={`${row.h10} appts`}>{row.h10}</div>
                     <div className="rounded-md transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-transparent hover:text-white text-[10px] font-mono leading-none" style={{ backgroundColor: getHeatmapColor(row.h12) }} title={`${row.h12} appts`}>{row.h12}</div>
                     <div className="rounded-md transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-transparent hover:text-white text-[10px] font-mono leading-none" style={{ backgroundColor: getHeatmapColor(row.h14) }} title={`${row.h14} appts`}>{row.h14}</div>
                     <div className="rounded-md transition-all hover:opacity-80 cursor-pointer flex items-center justify-center text-transparent hover:text-white text-[10px] font-mono leading-none" style={{ backgroundColor: getHeatmapColor(row.h16) }} title={`${row.h16} appts`}>{row.h16}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-sm font-bold text-foreground mb-4">Completed vs Missed</h4>
              <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={APPOINTMENT_TRENDS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} dy={5} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                       <RechartsTooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                       <Bar dataKey="completed" name="Completed" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                       <Bar dataKey="missed" name="Missed" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
         </div>

         {/* AI Insights & Dept Performance */}
         <div className="space-y-6 flex flex-col h-full">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm flex-1 flex flex-col relative overflow-hidden">
               <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
               <div className="flex justify-between items-center mb-6 relative z-10">
                 <h3 className="text-base font-bold text-foreground flex items-center">
                   <BrainCircuit className="w-5 h-5 mr-2 text-primary" />
                   AI Intelligence & Recommendations
                 </h3>
                 {aiInsights.length === 0 && (
                   <button 
                     onClick={generateAIInsights}
                     disabled={isGenerating}
                     className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all active:scale-95 flex items-center disabled:opacity-75 disabled:cursor-wait"
                   >
                     {isGenerating ? 'Analyzing...' : 'Generate Insights'}
                   </button>
                 )}
               </div>

               <div className="flex-1 relative z-10">
                 {aiInsights.length === 0 && !isGenerating ? (
                   <div className="h-full min-h-[150px] flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-primary/20 rounded-xl">
                      <BrainCircuit className="w-10 h-10 text-primary/30 mb-3" />
                      <p className="text-sm font-medium text-foreground mb-1">AI Insights Engine Idle</p>
                      <p className="text-xs text-muted-foreground">Click Generate to run deep analysis model on current hospital data streams.</p>
                   </div>
                 ) : isGenerating ? (
                   <div className="h-full min-h-[150px] flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-primary animate-pulse">Analyzing Patterns...</p>
                   </div>
                 ) : (
                   <div className="space-y-3">
                     {aiInsights.map((insight, index) => (
                       <motion.div 
                         initial={{ opacity: 0, x: -10 }} 
                         animate={{ opacity: 1, x: 0 }} 
                         transition={{ delay: index * 0.15 }}
                         key={index} 
                         className="flex items-start bg-background/60 p-4 border border-primary/10 rounded-xl"
                       >
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 mr-3">
                           <div className="w-2 h-2 bg-primary rounded-full" />
                         </div>
                         <p className="text-sm text-foreground font-medium leading-relaxed">{insight}</p>
                       </motion.div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
               <h3 className="text-base font-bold text-foreground mb-4 flex items-center">
                 <Building2 className="w-5 h-5 mr-2 text-indigo-500" />
                 Department Utilization
               </h3>
               <div className="space-y-4">
                 {DEPARTMENTS.map((dept) => (
                   <div key={dept.id}>
                     <div className="flex justify-between items-center mb-1.5">
                       <span className="text-sm font-bold text-foreground">{dept.name}</span>
                       <div className="flex items-center space-x-3">
                         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                           dept.status === 'Critical' ? 'bg-red-500/10 text-red-600' :
                           dept.status === 'High' ? 'bg-amber-500/10 text-amber-600' :
                           dept.status === 'Low' ? 'bg-violet-500/10 text-violet-600' :
                           'bg-emerald-500/10 text-emerald-600'
                         }`}>{dept.status}</span>
                         <span className="text-sm font-mono font-medium text-muted-foreground">{dept.utilization}%</span>
                       </div>
                     </div>
                     <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${
                           dept.status === 'Critical' ? 'bg-red-500' :
                           dept.status === 'High' ? 'bg-amber-500' :
                           dept.status === 'Low' ? 'bg-violet-500' :
                           'bg-emerald-500'
                         }`} 
                         style={{ width: `${dept.utilization}%` }}
                       />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
