import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  HeartPulse, LayoutDashboard, Users, Calendar, Stethoscope, 
  Settings, Search, Bell, LogOut, X, Pill, FlaskConical, DollarSign, Activity, BarChart3, Menu, BrainCircuit, Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { GlobalSearch } from '../components/GlobalSearch';
import { Clinic } from '../types';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, role, loginAs, activeClinicId, setActiveClinicId } = useAuth();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  
  useEffect(() => {
    const savedClinics = localStorage.getItem('medcore_clinics');
    if (savedClinics) {
      setClinics(JSON.parse(savedClinics));
    }
  }, []);

  const activeClinic = clinics.find(c => c._id === activeClinicId);

  const handleLogout = () => {
    localStorage.removeItem('medcore_auth');
    navigate('/login');
  };

  const allNavItems = [
    { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'] },
    { id: 'analytics', path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, roles: ['SUPER_ADMIN'] },
    { id: 'clinics', path: '/dashboard/clinics', label: 'Clinics Management', icon: Building2, roles: ['SUPER_ADMIN'] },
    { id: 'patients', path: '/dashboard/patients', label: 'Patients', icon: Users, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR'] },
    { id: 'doctors', path: '/dashboard/doctors', label: 'Doctors', icon: Stethoscope, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
    { id: 'appointments', path: '/dashboard/appointments', label: 'Appointments', icon: Calendar, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT'] },
    { id: 'prescriptions', path: '/dashboard/prescriptions', label: 'Prescriptions', icon: Pill, roles: ['DOCTOR', 'PATIENT'] },
    { id: 'labs', path: '/dashboard/labs', label: 'Labs', icon: FlaskConical, roles: ['DOCTOR', 'PATIENT'] },
    { id: 'predictive-health', path: '/dashboard/predictive-health', label: 'AI Health Models', icon: BrainCircuit, roles: ['SUPER_ADMIN', 'DOCTOR', 'PATIENT'] },
    { id: 'billing', path: '/dashboard/billing', label: 'Billing', icon: DollarSign, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN', 'RECEPTIONIST'] },
    { id: 'ai-diagnostic', path: '/dashboard/ai-diagnostic', label: 'Diagnostic Assistant', icon: Activity, roles: ['DOCTOR'] },
    { id: 'settings', path: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['SUPER_ADMIN', 'CLINIC_ADMIN'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden font-sans">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 bg-card border-r border-border w-64 flex flex-col transform transition-transform duration-200 ease-in-out z-30 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
        <div className="h-16 px-6 border-b border-border flex flex-col justify-center shrink-0">
          <div className="flex items-center space-x-3 cursor-pointer justify-between w-full" onClick={() => navigate('/')}>
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                 <HeartPulse className="w-5 h-5" />
               </div>
               <span className="font-bold text-foreground tracking-tight">Sehati AI</span>
            </div>
            <button className="md:hidden p-1 text-muted-foreground hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
               <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto w-full">
           {role === 'SUPER_ADMIN' && clinics.length > 0 && (
             <div className="px-3 mb-4">
                <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Active Clinic View</label>
                <select 
                   value={activeClinicId || ''} 
                   onChange={(e) => setActiveClinicId(e.target.value || null)}
                   className="w-full bg-accent/50 text-foreground border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary"
                >
                   <option value="">Global (All Clinics)</option>
                   {clinics.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                   ))}
                </select>
             </div>
           )}
           {role !== 'SUPER_ADMIN' && activeClinic && (
             <div className="px-3 mb-4">
                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Your Clinic</div>
                <div className="text-sm font-medium text-foreground bg-accent/30 border border-border px-3 py-2 rounded-xl flex items-center space-x-2">
                   <Building2 className="w-4 h-4 text-primary" />
                   <span className="truncate">{activeClinic.name}</span>
                </div>
             </div>
           )}

           {role !== 'PATIENT' && (
             <div className="px-3 mb-2">
               <GlobalSearch />
             </div>
           )}

          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-muted-foreground px-3 mb-2 tracking-widest">Main</div>
            {navItems.filter(i => ['dashboard', 'appointments'].includes(i.id)).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-medium'
                  }`}
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Clinical Navigation */}
          {navItems.filter(i => ['patients', 'doctors', 'prescriptions', 'labs'].includes(i.id)).length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-muted-foreground px-3 mb-2 tracking-widest">Clinical</div>
              {navItems.filter(i => ['patients', 'doctors', 'prescriptions', 'labs'].includes(i.id)).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-medium'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm tracking-wide">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* AI / Intelligence Navigation */}
          {navItems.filter(i => ['predictive-health', 'ai-diagnostic'].includes(i.id)).length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-purple-500 px-3 mb-2 font-mono tracking-widest">Intelligence</div>
              {navItems.filter(i => ['predictive-health', 'ai-diagnostic'].includes(i.id)).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-purple-500/10 text-purple-600 font-bold shadow-sm' 
                        : 'text-muted-foreground hover:bg-purple-500/5 hover:text-foreground font-medium'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-600' : 'text-muted-foreground'}`} />
                        <span className="text-sm tracking-wide">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}

          {/* Management / Admin Navigation */}
          {navItems.filter(i => ['analytics', 'billing', 'settings'].includes(i.id)).length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-bold text-muted-foreground px-3 mb-2 tracking-widest">System</div>
              {navItems.filter(i => ['analytics', 'billing', 'settings'].includes(i.id)).map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-bold shadow-sm' 
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-medium'
                    }`}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm tracking-wide">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-border shrink-0 space-y-4">
          <div className="flex items-center space-x-3 p-2 bg-card rounded-xl border border-border hover:bg-accent/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 uppercase border border-primary/20">
              {user?.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary truncate">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" title="Log out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden bg-background">
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-8 z-10 shrink-0 shadow-sm">
          <div className="flex items-center space-x-4 flex-1 max-w-xl">
            <button 
              className="md:hidden mr-2 text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-accent transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex space-x-2">
              <div className="px-3 py-1.5 bg-success/10 border border-success/20 text-success text-[10px] font-bold rounded-full tracking-wider uppercase flex items-center">
                 <span className="w-1.5 h-1.5 rounded-full bg-success mr-2 animate-pulse"></span>
                 System Online
              </div>
            </div>
            <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all ml-2">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-2 block h-2 w-2 rounded-full bg-destructive ring-2 ring-background"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
