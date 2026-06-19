export interface Clinic {
  _id: string;
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  clinicId?: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  timeSlot: string;
  reason?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface DiagnosticResult {
  symptomInterpretation: string;
  differentialDiagnosis: string[];
  possibleConditions: string[];
  riskAssessment: string;
  recommendedTests: string[];
  suggestedTreatments: string[];
  confidenceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  medicalSummary: string;
  suggestedNextActions: string[];
}

export interface HistoryItem {
  id: string;
  date: string;
  input: {
    symptoms: string;
    age: string;
    gender: string;
    vitalSigns: string;
    medicalHistory: string;
    labResults: string;
  };
  result: DiagnosticResult;
}
