export interface TimelineEvent {
  timestamp: string;
  description: string;
  type: 'info' | 'alert' | 'success';
}

export interface PatientCase {
  id: string;
  patientName: string;
  age: number;
  condition: string;
  currentStage: number;
  urgency: 'normal' | 'attention' | 'urgent';
  representative: {
    name: string;
    phone: string;
  };
  nextAction: string;
  events: TimelineEvent[];
}