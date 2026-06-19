import React, { useState } from 'react';
import { Pill, Plus, Trash2, Printer, Download, FileText, AlertCircle, Clock, Bell, History } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../contexts/AuthContext';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

function PrescriptionHistory() {
  const history = [
    { id: '1', medName: 'Ibuprofen', dosage: '400mg', date: 'Oct 12, 2026', doctor: 'Dr. Smith', status: 'Active' },
    { id: '2', medName: 'Azithromycin', dosage: '250mg', date: 'Aug 05, 2026', doctor: 'Dr. Jones', status: 'Pending' },
    { id: '3', medName: 'Metformin', dosage: '500mg', date: 'Jan 20, 2025', doctor: 'Dr. Emily', status: 'Expired' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Pending': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'Expired': return 'bg-rose-100 text-rose-700 border border-rose-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-foreground">
        <History className="w-5 h-5 text-indigo-500" />
        <h3 className="text-base font-bold">Past Prescriptions</h3>
      </div>
      <div className="space-y-3">
        {history.map(item => (
          <div key={item.id} className="p-4 border border-border rounded-xl flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-foreground">{item.medName} <span className="text-xs text-muted-foreground font-normal ml-1">{item.dosage}</span></h4>
              <p className="text-xs text-muted-foreground mt-1">Prescribed by {item.doctor} on {item.date}</p>
            </div>
            <div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingRefills() {
  const alerts = [
    { id: '1', medName: 'Amoxicillin', dosage: '500mg', dueDate: 'Tomorrow', status: 'urgent' },
    { id: '2', medName: 'Lisinopril', dosage: '10mg', dueDate: 'In 5 days', status: 'warning' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-amber-500" />
        <h3 className="text-base font-bold text-foreground">Upcoming Refill Alerts</h3>
      </div>
      <div className="space-y-3">
        {alerts.map(alert => (
          <div key={alert.id} className="flex items-center justify-between p-3 border border-border rounded-xl bg-accent/20">
            <div>
              <h4 className="font-bold text-sm text-foreground">{alert.medName} <span className="text-xs text-muted-foreground font-normal ml-1">{alert.dosage}</span></h4>
              <p className="text-xs font-medium text-amber-600 mt-0.5 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Refill Due: {alert.dueDate}
              </p>
            </div>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold rounded-lg transition-colors">
              Request Refill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrescriptionsView() {
  const { user, role } = useAuth();
  const [patientName, setPatientName] = useState('');
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  
  const [medications, setMedications] = useState<Medication[]>([]);
  
  const [currentMed, setCurrentMed] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: ''
  });

  const handleAddMedication = () => {
    if (!currentMed.name || !currentMed.dosage || !currentMed.frequency) return;
    
    setMedications([
      ...medications,
      { ...currentMed, id: Date.now().toString() } as Medication
    ]);
    
    setCurrentMed({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const generatePDF = (action: 'download' | 'print') => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Primary blue
    doc.text('Sehati AI Hospital', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('123 Healthcare Ave, Medical District, NY 10001', 14, 28);
    doc.text('Phone: (555) 123-4567 | Web: www.sehatiai.com', 14, 33);
    
    doc.setDrawColor(220);
    doc.line(14, 38, 196, 38);
    
    // Prescription Details
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('PRESCRIPTION (E-Rx)', 14, 48);
    
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 48);
    
    doc.text(`Doctor: ${user?.name || 'Assigned Physician'}`, 14, 58);
    doc.text(`Patient Name: ${patientName || '__________________'}`, 14, 66);
    doc.text(`Patient ID: ${patientId || '__________________'}`, 120, 66);
    doc.text(`Diagnosis: ${diagnosis || '__________________'}`, 14, 74);
    
    // Rx Symbol
    doc.setFontSize(24);
    doc.text('Rx', 14, 90);
    
    // Medications Table
    const tableData = medications.map(med => [
      med.name,
      med.dosage,
      med.frequency,
      med.duration,
      med.instructions
    ]);
    
    autoTable(doc, {
      startY: 96,
      head: [['Medicine', 'Dosage', 'Frequency', 'Duration', 'Instructions']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 10 }
    });
    
    // Footer / Signature
    const finalY = (doc as any).lastAutoTable.finalY || 120;
    doc.setFontSize(11);
    doc.text("Doctor's Signature: _______________________", 14, finalY + 30);
    doc.text(`License No: MC-${Date.now().toString().slice(-6)}`, 14, finalY + 38);
    
    if (action === 'download') {
      doc.save(`Prescription_${patientName.replace(/\\s+/g, '_')}_${Date.now()}.pdf`);
    } else {
      doc.autoPrint();
      window.open(doc.output('bloburl'), '_blank');
    }
  };

  if (role === 'PATIENT') {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground flex items-center tracking-tight">
              <Pill className="w-8 h-8 mr-4 text-emerald-500" />
              My Prescriptions
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-2">
              View and download your active and past prescriptions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card border border-border p-8 rounded-2xl text-center mb-6">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground">No Current Prescriptions</h3>
              <p className="text-muted-foreground text-sm mt-1">You do not have any active medications at this time.</p>
            </div>
            
            <PrescriptionHistory />
          </div>
          <div className="lg:col-span-1">
            <UpcomingRefills />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground flex items-center tracking-tight">
            <Pill className="w-8 h-8 mr-4 text-primary" />
            Prescriptions & E-Rx
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-2 max-w-2xl">
            Create, manage, and digitally sign electronic prescriptions for your patients.
          </p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => generatePDF('download')}
             disabled={medications.length === 0}
             className="px-4 py-2 bg-card border border-border hover:bg-accent text-foreground text-sm font-bold rounded-xl flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <Download className="w-4 h-4 mr-2" /> Download PDF
           </button>
           <button 
             onClick={() => generatePDF('print')}
             disabled={medications.length === 0}
             className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold rounded-xl flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
           >
             <Printer className="w-4 h-4 mr-2" /> Print Rx
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Details Panel */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Patient Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Patient Name</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Patient ID (Optional)</label>
                <input 
                  type="text" 
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  placeholder="e.g. PT-10294"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Primary Diagnosis</label>
                <input 
                  type="text" 
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Essential Hypertension"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Prescription Builder */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Add Medication</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Medicine Name</label>
                <input 
                  type="text" 
                  value={currentMed.name}
                  onChange={e => setCurrentMed({...currentMed, name: e.target.value})}
                  placeholder="e.g. Amoxicillin, Lisinopril"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Dosage</label>
                <input 
                  type="text" 
                  value={currentMed.dosage}
                  onChange={e => setCurrentMed({...currentMed, dosage: e.target.value})}
                  placeholder="e.g. 500mg, 10ml"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Frequency</label>
                <select 
                  value={currentMed.frequency}
                  onChange={e => setCurrentMed({...currentMed, frequency: e.target.value})}
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="">Select frequency</option>
                  <option value="Once a day (OD)">Once a day (OD)</option>
                  <option value="Twice a day (BID)">Twice a day (BID)</option>
                  <option value="Three times a day (TID)">Three times a day (TID)</option>
                  <option value="Four times a day (QID)">Four times a day (QID)</option>
                  <option value="Every 4 hours">Every 4 hours</option>
                  <option value="Every 6 hours">Every 6 hours</option>
                  <option value="As needed (PRN)">As needed (PRN)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Duration</label>
                <input 
                  type="text" 
                  value={currentMed.duration}
                  onChange={e => setCurrentMed({...currentMed, duration: e.target.value})}
                  placeholder="e.g. 5 days, 1 month, Ongoing"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Special Instructions</label>
                <input 
                  type="text" 
                  value={currentMed.instructions}
                  onChange={e => setCurrentMed({...currentMed, instructions: e.target.value})}
                  placeholder="e.g. Take after meals"
                  className="w-full bg-accent/50 border border-border text-foreground text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
                />
              </div>
            </div>
            
            <button 
              onClick={handleAddMedication}
              disabled={!currentMed.name || !currentMed.dosage || !currentMed.frequency}
              className="w-full py-2.5 bg-primary/10 text-primary font-bold text-sm rounded-xl hover:bg-primary/20 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 mr-2" /> Add to Prescription
            </button>
          </div>

          {/* Current Prescription List */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-4">Prescribed Medications ({medications.length})</h3>
            
            {medications.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">No medications added yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medications.map(med => (
                  <div key={med.id} className="p-4 border border-border bg-accent/20 rounded-xl flex justify-between items-start group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-foreground">{med.name}</h4>
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary">{med.dosage}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{med.frequency} • <span className="text-muted-foreground">{med.duration}</span></p>
                      {med.instructions && (
                        <p className="text-xs text-muted-foreground mt-2 italic flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" /> {med.instructions}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemoveMedication(med.id)}
                      className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
