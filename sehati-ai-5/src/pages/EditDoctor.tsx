import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Activity, FileText, Search, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { DoctorRegistrationForm, DoctorFormData } from '../components/DoctorRegistrationForm';

export default function EditDoctor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile');
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5;
  const [logs, setLogs] = useState<any[]>([]);
  const [liveUpdate, setLiveUpdate] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('medcore_doctors');
    if (saved) {
      const doctors = JSON.parse(saved);
      const found = doctors.find((d: any) => d.id === id);
      if (found) {
        setDoctor(found);
        setLogs([
          { 
            id: 1, 
            action: 'Updated consultation fee', 
            date: 'Oct 24, 2023, 14:30', 
            user: 'System Admin',
            metadata: { timestamp: '2023-10-24T14:30:00Z', ip: '192.168.1.105', session: 'ses_x8a92b' }
          },
          { 
            id: 2, 
            action: 'Changed availability schedule', 
            date: 'Oct 22, 2023, 09:15', 
            user: found.name,
            metadata: { timestamp: '2023-10-22T09:15:22Z', ip: '10.0.0.42', session: 'ses_b3f11a' }
          },
          {
            id: 3,
            action: 'Updated contact email',
            date: 'Oct 15, 2023, 11:20',
            user: found.name,
            metadata: { timestamp: '2023-10-15T11:20:00Z', ip: '10.0.0.42', session: 'ses_m9c43d' }
          },
          {
            id: 4,
            action: 'Added new qualification',
            date: 'Sep 30, 2023, 16:45',
            user: 'System Admin',
            metadata: { timestamp: '2023-09-30T16:45:10Z', ip: '192.168.1.105', session: 'ses_x8a92b' }
          },
          {
            id: 5,
            action: 'Updated phone number',
            date: 'Aug 14, 2023, 08:30',
            user: found.name,
            metadata: { timestamp: '2023-08-14T08:30:45Z', ip: '10.0.0.12', session: 'ses_a1b2c3' }
          },
          {
            id: 6,
            action: 'Modified department',
            date: 'Jan 05, 2023, 13:00',
            user: 'System Admin',
            metadata: { timestamp: '2023-01-05T13:00:00Z', ip: '192.168.1.105', session: 'ses_k2j3h4' }
          },
          {
            id: 7,
            action: 'Updated profile picture',
            date: 'Dec 10, 2022, 09:15',
            user: found.name,
            metadata: { timestamp: '2022-12-10T09:15:22Z', ip: '10.0.0.42', session: 'ses_b3f11a' }
          },
          { 
            id: 8, 
            action: 'Profile created', 
            date: 'Jun 12, 2021, 10:00', 
            user: 'System Admin',
            metadata: { timestamp: '2021-06-12T10:00:00Z', ip: '127.0.0.1', session: 'ses_init01' }
          }
        ]);
      } else {
        toast.error('Doctor not found');
        navigate('/dashboard/doctors');
      }
    } else {
      toast.error('Doctor not found');
      navigate('/dashboard/doctors');
    }
  }, [id, navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (liveUpdate) {
      interval = setInterval(() => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ', ' + 
                        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        const newLog = {
          id: Date.now(),
          action: 'Automated status check',
          date: dateStr,
          user: 'System Process',
          metadata: { timestamp: now.toISOString(), ip: '127.0.0.1', session: 'ses_auto01' }
        };
        setLogs(prev => [newLog, ...prev]);
        toast('New activity logged', { description: 'Activity stream updated via Live Update.', duration: 3000 });
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveUpdate]);

  const handleSubmit = async (data: DoctorFormData) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const existingStr = localStorage.getItem('medcore_doctors');
    if (existingStr) {
      const doctors = JSON.parse(existingStr);
      const updatedDoctors = doctors.map((d: any) => 
        d.id === id ? { ...d, ...data } : d
      );
      localStorage.setItem('medcore_doctors', JSON.stringify(updatedDoctors));
      toast.success('Doctor profile updated successfully');
    }
    
    setIsSubmitting(false);
    navigate('/dashboard/doctors');
  };

  if (!doctor) return null;

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(activitySearchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(activitySearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage);

  return (
    <div className="flex-1 overflow-y-auto bg-muted/30">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/dashboard/doctors')}
            className="flex items-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </button>
          
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            Edit Doctor Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Update existing doctor information</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'profile' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Profile Details
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2.5 text-sm font-bold uppercase tracking-widest border-b-2 transition-colors ${
              activeTab === 'activity' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Activity Log
          </button>
        </div>

        {/* Content */}
        {activeTab === 'profile' ? (
          <DoctorRegistrationForm initialData={doctor} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
                  <button
                    onClick={() => setLiveUpdate(!liveUpdate)}
                    className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      liveUpdate 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${liveUpdate ? 'animate-spin' : ''}`} />
                    <span>Live Updates: {liveUpdate ? 'ON' : 'OFF'}</span>
                  </button>
                </div>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search logs by keyword or user..."
                    value={activitySearchQuery}
                    onChange={(e) => {
                      setActivitySearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl bg-accent/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all focus:bg-background"
                  />
                </div>
              </div>
              <div className="space-y-6">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => {
                    const isLastInstance = (currentPage - 1) * logsPerPage + index === filteredLogs.length - 1;
                    return (
                    <div key={log.id} className="flex relative group">
                      {!isLastInstance && (
                        <div className="absolute top-8 bottom-[-24px] left-5 w-px bg-border" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 border-[3px] border-card relative z-10 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                        {isLastInstance ? <FileText className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{log.action}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">by {log.user}</p>
                          </div>
                          <div className="relative flex flex-col items-end">
                            <span className="text-xs font-mono text-muted-foreground bg-accent px-2 py-1 rounded-md cursor-help">{log.date}</span>
                            
                            {/* Hover Tooltip */}
                            <div className="absolute top-8 right-0 w-56 bg-foreground text-background text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none transform translate-y-1 group-hover:translate-y-0">
                              <div className="font-bold border-b border-background/20 pb-1.5 mb-1.5 flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5" /> Log Details
                              </div>
                              <div className="flex justify-between mt-1"><span className="opacity-70 font-medium">Original Time:</span> <span className="font-mono">{log.metadata.timestamp}</span></div>
                              <div className="flex justify-between mt-1"><span className="opacity-70 font-medium">Source IP:</span> <span className="font-mono">{log.metadata.ip}</span></div>
                              <div className="flex justify-between mt-1"><span className="opacity-70 font-medium">Auth Session:</span> <span className="font-mono">{log.metadata.session}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No matching activity logs found.
                  </div>
                )}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-bold text-foreground">{(currentPage - 1) * logsPerPage + 1}</span> to <span className="font-bold text-foreground">{Math.min(currentPage * logsPerPage, filteredLogs.length)}</span> of <span className="font-bold text-foreground">{filteredLogs.length}</span> results
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-foreground" />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                          currentPage === i + 1
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
