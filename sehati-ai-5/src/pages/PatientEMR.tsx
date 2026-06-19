import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, Activity, HeartPulse, ShieldAlert, FileText, 
  Download, Plus, Search, Calendar, Stethoscope, Pill, 
  FlaskConical, Image as ImageIcon, CheckCircle, Clock, TrendingUp, X, Mic, Square
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { PatientTimeline, TimelineEvent } from '../components/PatientTimeline';

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2023-11-01',
    type: 'visit',
    title: 'Follow-up Consultation',
    description: 'Routine check-up for hypertension management. Blood pressure is stable.',
    doctor: 'Dr. Sarah Chen',
  },
  {
    id: '2',
    date: '2023-10-24',
    type: 'prescription',
    title: 'Lisinopril Prescribed',
    description: 'Initiated Lisinopril 10mg once daily for hypertension.',
    doctor: 'Dr. Sarah Chen',
    details: {
      Dosage: '10mg',
      Frequency: 'Once daily'
    }
  },
  {
    id: '3',
    date: '2023-10-20',
    type: 'diagnosis',
    title: 'Hypertension Diagnosed',
    description: 'Essential (primary) hypertension confirmed after multiple elevated readings.',
    doctor: 'Dr. Sarah Chen',
  },
  {
    id: '4',
    date: '2023-10-15',
    type: 'lab_result',
    title: 'Comprehensive Metabolic Panel',
    description: 'Routine lab work. All results within normal limits except slightly elevated LDL.',
    details: {
      'LDL Cholesterol': '135 mg/dL',
      'Fasting Glucose': '95 mg/dL'
    }
  }
];

type ModalType = 'diagnosis' | 'prescription' | 'lab' | 'radiology' | 'note' | 'document' | 'voiceNote' | null;

export default function PatientEMR() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // States for lists
  const [diagnoses, setDiagnoses] = useState([
    { date: 'Oct 24, 2023', code: 'I10', desc: 'Essential (primary) hypertension', status: 'Active', doctor: 'Dr. Sarah Chen' },
    { date: 'Jun 12, 2021', code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications', status: 'Active', doctor: 'Dr. Sarah Chen' }
  ]);

  const [prescriptions, setPrescriptions] = useState([
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '90 days', refills: 2, status: 'Active' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals', duration: '90 days', refills: 3, status: 'Active' }
  ]);

  const [labs, setLabs] = useState([
    { name: 'Comprehensive Metabolic Panel', date: 'Oct 15, 2023', status: 'Final', abnormal: false },
    { name: 'Lipid Panel', date: 'Oct 15, 2023', status: 'Final', abnormal: true },
    { name: 'Hemoglobin A1C', date: 'Oct 15, 2023', status: 'Final', abnormal: false }
  ]);
  
  const [radiology, setRadiology] = useState<{name: string, date: string, type: string}[]>([]);

  const [notes, setNotes] = useState<{date: string, author: string, title: string, content: string, audioUrl?: string}[]>([
    { date: 'Oct 24, 2023', author: 'Dr. Sarah Chen', title: 'Routine Follow-up', content: 'Patient reports feeling well. Blood pressure has stabilized nicely on current Lisinopril dosage. Denies chest pain, shortness of breath, or dizziness. Weight is stable. Advised to continue current medication and diet plan. Follow up in 6 months.' },
    { date: 'Jul 10, 2023', author: 'Dr. Sarah Chen', title: 'Medication Adjustment', content: 'Patient returned for BP check. BP was elevated at last visit. Patient admits to skipping some doses when traveling. Emphasized importance of adherence. Rechecked BP today: 135/85. Will maintain current dose and monitor.' }
  ]);

  const [documents, setDocuments] = useState([
    { name: 'Patient Intake Form (Signed).pdf', type: 'PDF', size: '1.2 MB', date: 'Jan 15, 2022' },
    { name: 'Outside Records - Mercy Hospital.pdf', type: 'PDF', size: '4.5 MB', date: 'Feb 10, 2022' },
    { name: 'Insurance Card Copy.png', type: 'Image', size: '450 KB', date: 'Jan 15, 2022' }
  ]);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalInput1, setModalInput1] = useState('');
  const [modalInput2, setModalInput2] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      setAudioChunks([]);
      setRecordedAudioUrl(null);
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleSaveVoiceNote = () => {
     if (recordedAudioUrl) {
       const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
       // Prepend the new voice note to the notes list
       setNotes([{ 
         date: today, 
         author: 'Current Doctor', 
         title: modalInput1 || 'Voice Note', 
         content: 'Audio recorded. Awaiting AI transcription...', 
         audioUrl: recordedAudioUrl 
       }, ...notes]);
       setActiveModal(null);
       setModalInput1('');
       setRecordedAudioUrl(null);
     }
  };

  const handleSaveModal = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    if (activeModal === 'diagnosis') {
      if (!modalInput1) return;
      setDiagnoses([{ date: today, code: 'NEW', desc: modalInput1, status: 'Active', doctor: 'Current Doctor' }, ...diagnoses]);
    } else if (activeModal === 'prescription') {
      if (!modalInput1) return;
      setPrescriptions([{ name: modalInput1, dosage: modalInput2 || 'Standard', frequency: 'As directed', duration: '30 days', refills: 0, status: 'Active' }, ...prescriptions]);
    } else if (activeModal === 'lab') {
      if (!modalInput1) return;
      setLabs([{ name: modalInput1, date: today, status: 'Processing', abnormal: false }, ...labs]);
    } else if (activeModal === 'radiology') {
       if (!modalInput1) return;
       setRadiology([{ name: modalInput1, date: today, type: 'Scan' }, ...radiology]);
    } else if (activeModal === 'note') {
      if (!modalInput1) return;
      setNotes([{ date: today, author: 'Current Doctor', title: modalInput1, content: modalInput2 || 'No additional details provided.' }, ...notes]);
    } else if (activeModal === 'document') {
      if (!modalInput1) return;
      setDocuments([{ name: modalInput1, type: 'File', size: 'Unknown', date: today }, ...documents]);
    }
    setActiveModal(null);
    setModalInput1('');
    setModalInput2('');
  };

  useEffect(() => {
    const saved = localStorage.getItem('medcore_patients');
    if (saved) {
      const parsed = JSON.parse(saved);
      const found = parsed.find((p: any) => p.id === id);
      if (found) setPatient(found);
    }
  }, [id]);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
        <p>Patient not found or loading...</p>
        <button onClick={() => navigate('/dashboard/patients')} className="mt-4 text-primary hover:underline">Return to Directory</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/dashboard/patients')}
            className="mr-4 p-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
              Electronic Medical Record
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">Patient ID: {patient.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="bg-card border border-border text-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-accent transition-all active:scale-95 flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button 
            onClick={() => navigate('/dashboard/ai-diagnostic')}
            className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center shadow-sm"
          >
            <Activity className="w-4 h-4 mr-2" />
            AI Diagnostic
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar (Profile) */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl border border-border shadow-sm print:border-none print:shadow-none">
            <div className="w-24 h-24 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-3xl mb-4 print:bg-gray-100 print:text-black">
              {patient.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
            </div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight print:text-black">{patient.name}</h1>
            <div className="text-sm font-mono text-muted-foreground mt-1">{patient.id}</div>
            <div className="mt-3 print:hidden">
              <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex ${
                patient.status === 'Recovered' ? 'bg-emerald-500/10 text-emerald-600' :
                patient.status === 'New Patient' ? 'bg-primary/10 text-primary' :
                'bg-amber-500/10 text-amber-600'
              }`}>
                {patient.status}
              </span>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden text-sm print:border-gray-200">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/20 px-4 py-3 border-b border-border flex items-center print:bg-white print:text-black">
                <HeartPulse className="w-4 h-4 mr-2" /> Vitals & Demographics
             </h3>
             <div className="p-4 space-y-3">
               <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground print:text-gray-600">National ID</span><span className="font-mono text-foreground print:text-black">{patient.nationalId || 'N/A'}</span></div>
               <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground print:text-gray-600">Gender</span><span className="font-medium text-foreground capitalize print:text-black">{patient.gender}</span></div>
               <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground print:text-gray-600">DOB</span><span className="font-medium text-foreground print:text-black">{patient.dob}</span></div>
               <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground print:text-gray-600">Blood Type</span><span className="font-bold text-foreground uppercase print:text-black">{patient.bloodType || 'Unknown'}</span></div>
               <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground print:text-gray-600">Phone</span><span className="font-medium text-foreground print:text-black">{patient.phone}</span></div>
               <div className="flex justify-between pb-1"><span className="text-muted-foreground print:text-gray-600">Address</span><span className="font-medium text-foreground truncate max-w-[150px] print:text-black" title={patient.address}>{patient.address || 'N/A'}</span></div>
             </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl shadow-sm overflow-hidden text-sm print:border-gray-200">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100/50 px-4 py-3 border-b border-amber-200 flex items-center print:bg-white print:text-black">
                <ShieldAlert className="w-4 h-4 mr-2" /> Alerts
             </h3>
             <div className="p-4 space-y-4">
               <div>
                 <span className="text-amber-800 font-bold block mb-1 text-xs uppercase tracking-wider print:text-gray-800">Known Allergies</span>
                 <p className="text-amber-900 font-medium print:text-black">{patient.allergies || 'No known allergies recorded.'}</p>
               </div>
               <div>
                 <span className="text-indigo-800 font-bold block mb-1 text-xs uppercase tracking-wider flex items-center print:text-gray-800"><Activity className="w-3 h-3 mr-1" /> Chronic Conditions</span>
                 <p className="text-indigo-900 font-medium print:text-black">{patient.chronicConditions || 'No chronic conditions recorded.'}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Section (Tabs) */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="overview" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 print:hidden">
              <TabsList className="bg-card border border-border h-auto p-1 flex-wrap overflow-x-auto w-full sm:w-auto">
                <TabsTrigger value="overview" className="text-xs font-bold">Overview</TabsTrigger>
                <TabsTrigger value="diagnoses" className="text-xs font-bold"><Stethoscope className="w-3 h-3 mr-1.5 hidden sm:inline" />Diagnoses</TabsTrigger>
                <TabsTrigger value="prescriptions" className="text-xs font-bold"><Pill className="w-3 h-3 mr-1.5 hidden sm:inline" />Prescriptions</TabsTrigger>
                <TabsTrigger value="labs" className="text-xs font-bold"><FlaskConical className="w-3 h-3 mr-1.5 hidden sm:inline" />Lab Results</TabsTrigger>
                <TabsTrigger value="radiology" className="text-xs font-bold"><ImageIcon className="w-3 h-3 mr-1.5 hidden sm:inline" />Radiology</TabsTrigger>
                <TabsTrigger value="trends" className="text-xs font-bold"><TrendingUp className="w-3 h-3 mr-1.5 hidden sm:inline" />Trends</TabsTrigger>
                <TabsTrigger value="notes" className="text-xs font-bold"><FileText className="w-3 h-3 mr-1.5 hidden sm:inline" />Notes</TabsTrigger>
                <TabsTrigger value="documents" className="text-xs font-bold"><FileText className="w-3 h-3 mr-1.5 hidden sm:inline" />Attachments</TabsTrigger>
                <TabsTrigger value="audit" className="text-xs font-bold"><Clock className="w-3 h-3 mr-1.5 hidden sm:inline" />Audit Log</TabsTrigger>
              </TabsList>
              
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 pl-9 pr-4 py-2 border border-border rounded-xl text-xs font-medium bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 min-h-[500px] print:border-none print:shadow-none print:p-0">
              <TabsContent value="overview" className="mt-0 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">Patient Timeline</h2>
                  <PatientTimeline events={mockTimelineEvents} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="p-4 border border-border rounded-xl bg-muted/20">
                     <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Primary Physician</h4>
                     <p className="font-medium text-foreground">Dr. Sarah Chen</p>
                     <p className="text-xs text-muted-foreground mt-1">Cardiology Dept</p>
                   </div>
                   <div className="p-4 border border-border rounded-xl bg-muted/20">
                     <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Next Appointment</h4>
                     <p className="font-medium text-foreground">Nov 15, 2023 - 10:00 AM</p>
                     <p className="text-xs text-muted-foreground mt-1">Follow-up structural check</p>
                   </div>
                   <div className="md:col-span-2 p-4 border border-border rounded-xl bg-muted/20">
                     <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Medical History SUMMARY</h4>
                     <p className="text-sm font-medium text-foreground">
                        Patient has a long-standing history of essential hypertension (diagnosed 2018) and Type 2 diabetes mellitus (diagnosed 2021). No previous surgical interventions. Non-smoker. Family history significant for premature coronary artery disease (father). Regular monitoring of lipid profiles and kidney function advised.
                     </p>
                   </div>
                </div>
              </TabsContent>

              <TabsContent value="diagnoses" className="mt-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Diagnoses & Conditions</h2>
                  <button onClick={() => setActiveModal('diagnosis')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3 h-3 mr-1" /> Add Entry
                  </button>
                </div>
                
                <div className="space-y-4">
                  {diagnoses.map((diag, i) => (
                    <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-mono bg-muted text-muted-foreground px-2 py-0.5 rounded">{diag.code}</span>
                           <h4 className="font-bold text-foreground text-sm">{diag.desc}</h4>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">{diag.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {diag.date}</span>
                        <span className="flex items-center"><Stethoscope className="w-3.5 h-3.5 mr-1" /> {diag.doctor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="prescriptions" className="mt-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Active Prescriptions</h2>
                  <button onClick={() => setActiveModal('prescription')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3 h-3 mr-1" /> New E-Rx
                  </button>
                </div>

                <div className="space-y-4">
                  {prescriptions.map((rx, i) => (
                    <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-foreground text-sm flex items-center">
                          <Pill className="w-4 h-4 mr-2 text-primary" />
                          {rx.name} <span className="ml-2 text-muted-foreground font-normal">{rx.dosage}</span>
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{rx.frequency} • {rx.duration}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded mb-1 inline-block">{rx.status}</span>
                        <p className="text-xs text-muted-foreground">Refills left: {rx.refills}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="labs" className="mt-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Laboratory Results</h2>
                  <button onClick={() => setActiveModal('lab')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3 h-3 mr-1" /> Upload Results
                  </button>
                </div>

                <div className="space-y-4">
                  {labs.map((lab, i) => (
                     <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${lab.abnormal ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                            <FlaskConical className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm">{lab.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Collected: {lab.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {lab.abnormal && <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded">Abnormal</span>}
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors print:hidden">
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                     </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="radiology" className="mt-0">
                 <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Radiology Reports</h2>
                  <button onClick={() => setActiveModal('radiology')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3 h-3 mr-1" /> Order Scan
                  </button>
                </div>
                {radiology.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <ImageIcon className="w-12 h-12 mb-4 text-muted-foreground/30" />
                    <p className="font-medium text-foreground mb-2">No radiology records found</p>
                    <p className="text-sm">Order a scan to see records appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {radiology.map((rad, i) => (
                      <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-sm">{rad.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">Ordered: {rad.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trends" className="mt-0">
                <div className="mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Historical Vitals Trends</h2>
                  <p className="text-sm text-muted-foreground mt-1">Heart rate and blood pressure tracking over time</p>
                </div>
                
                <div className="space-y-8">
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold mb-4">Heart Rate (bpm)</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { date: 'Jan', heartRate: 72 },
                            { date: 'Feb', heartRate: 75 },
                            { date: 'Mar', heartRate: 70 },
                            { date: 'Apr', heartRate: 74 },
                            { date: 'May', heartRate: 71 },
                            { date: 'Jun', heartRate: 78 },
                            { date: 'Jul', heartRate: 82 },
                            { date: 'Aug', heartRate: 76 },
                            { date: 'Sep', heartRate: 74 },
                            { date: 'Oct', heartRate: 72 }
                          ]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="heartRate" name="Heart Rate" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-bold mb-4">Blood Pressure (mmHg)</h3>
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                            { date: 'Jan', systolic: 120, diastolic: 80 },
                            { date: 'Feb', systolic: 122, diastolic: 82 },
                            { date: 'Mar', systolic: 118, diastolic: 78 },
                            { date: 'Apr', systolic: 124, diastolic: 80 },
                            { date: 'May', systolic: 120, diastolic: 80 },
                            { date: 'Jun', systolic: 130, diastolic: 85 },
                            { date: 'Jul', systolic: 135, diastolic: 88 },
                            { date: 'Aug', systolic: 128, diastolic: 84 },
                            { date: 'Sep', systolic: 124, diastolic: 82 },
                            { date: 'Oct', systolic: 120, diastolic: 80 }
                          ]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend wrapperStyle={{ paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Progress Notes</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setActiveModal('voiceNote')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                      <Mic className="w-3 h-3 mr-1" /> Record Voice Note
                    </button>
                    <button onClick={() => setActiveModal('note')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                      <Plus className="w-3 h-3 mr-1" /> Add Note
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {notes.map((note, i) => (
                    <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-foreground text-sm">{note.title}</h4>
                        <span className="text-xs text-muted-foreground flex items-center"><Calendar className="w-3 h-3 mr-1" /> {note.date}</span>
                      </div>
                      <p className="text-sm text-foreground my-2">{note.content}</p>
                      {note.audioUrl && (
                        <div className="mb-3 mt-1">
                          <audio controls src={note.audioUrl} className="h-8 max-w-full" />
                        </div>
                      )}
                      <p className="text-xs text-primary font-medium flex items-center"><Stethoscope className="w-3 h-3 mr-1" /> {note.author}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h2 className="text-lg font-bold text-foreground">Attachments & Documents</h2>
                  <button onClick={() => setActiveModal('document')} className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg flex items-center hover:bg-primary/20 transition-all active:scale-95">
                    <Plus className="w-3 h-3 mr-1" /> Upload File
                  </button>
                </div>

                <div className="space-y-4">
                  {documents.map((doc, i) => (
                    <div key={i} className="p-4 border border-border rounded-xl hover:bg-muted/30 transition-colors flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {doc.type === 'PDF' ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground text-sm">{doc.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{doc.type} • {doc.size} • Uploaded {doc.date}</p>
                        </div>
                      </div>
                      <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors print:hidden">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="audit" className="mt-0">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Audit Log</h2>
                  <p className="text-sm text-muted-foreground">Track changes and access to this patient record.</p>
                </div>
                
                <div className="relative border-l-2 border-muted pl-4 ml-2 space-y-6">
                  {[
                    { action: 'Record viewed', user: 'Dr. Sarah Chen', time: 'Today, 10:45 AM' },
                    { action: 'Prescription renewed (Lisinopril)', user: 'Dr. Sarah Chen', time: 'Oct 24, 2023, 11:30 AM' },
                    { action: 'Lab results (CMP) uploaded', user: 'System', time: 'Oct 16, 2023, 08:15 AM' },
                    { action: 'Record created', user: 'Admin', time: 'Jan 15, 2022, 09:00 AM' }
                  ].map((log, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 bg-muted border-2 border-background rounded-full"></div>
                      <p className="text-sm font-medium text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{log.user} • {log.time}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg text-foreground">
                {activeModal === 'voiceNote' ? 'Record Voice Note' : `Add ${activeModal.charAt(0).toUpperCase() + activeModal.slice(1)}`}
              </h3>
              <button 
                onClick={() => { stopRecording(); setActiveModal(null); setModalInput1(''); setModalInput2(''); setRecordedAudioUrl(null); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {activeModal === 'voiceNote' ? (
                <div className="flex flex-col items-center justify-center space-y-4 py-8">
                  {recordedAudioUrl ? (
                    <div className="w-full flex justify-center flex-col items-center gap-4">
                      <audio controls src={recordedAudioUrl} className="w-full" />
                      <button onClick={() => setRecordedAudioUrl(null)} className="text-xs text-muted-foreground underline">Record Again</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                       {isRecording ? (
                         <>
                           <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-pulse">
                             <Mic className="w-8 h-8" />
                           </div>
                           <p className="text-sm font-medium animate-pulse text-destructive">Recording in progress...</p>
                           <button onClick={stopRecording} className="mt-4 bg-destructive text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-destructive/90 transition-colors font-bold">
                              <Square className="w-4 h-4 fill-current" /> Stop Recording
                           </button>
                         </>
                       ) : (
                         <>
                           <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                             <Mic className="w-8 h-8" />
                           </div>
                           <p className="text-sm font-medium text-muted-foreground">Click below to start recording your clinical note.</p>
                           <button onClick={startRecording} className="mt-4 bg-primary text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors font-bold">
                              <Mic className="w-4 h-4" /> Start Recording
                           </button>
                         </>
                       )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                      {activeModal === 'diagnosis' ? 'Diagnosis Description' :
                       activeModal === 'prescription' ? 'Medication Name' :
                       activeModal === 'lab' ? 'Lab Test Name' :
                       activeModal === 'radiology' ? 'Scan Type' :
                       activeModal === 'note' ? 'Note Title' :
                       'Document Name'}
                    </label>
                    <input 
                      type="text" 
                      value={modalInput1}
                      onChange={(e) => setModalInput1(e.target.value)}
                      className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter details..."
                    />
                  </div>
                  {(activeModal === 'prescription' || activeModal === 'note') && (
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">
                        {activeModal === 'prescription' ? 'Dosage & Instructions' : 'Note Content'}
                      </label>
                      <textarea 
                        value={modalInput2}
                        onChange={(e) => setModalInput2(e.target.value)}
                        className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
                        placeholder="Enter details..."
                      />
                    </div>
                  )}
                </>
              )}
              <button 
                onClick={activeModal === 'voiceNote' ? handleSaveVoiceNote : handleSaveModal}
                disabled={activeModal === 'voiceNote' && !recordedAudioUrl}
                className={`w-full font-bold py-3 rounded-xl transition-all cursor-pointer mt-4 ${activeModal === 'voiceNote' && !recordedAudioUrl ? 'bg-muted text-muted-foreground cursor-not-allowed hidden' : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'}`}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
