import type { PatientCase } from '../types/patient';

export const mockCase: PatientCase = {
  id: 'CASE-001',
  patientName: 'Ravi Sharma',
  age: 58,
  condition: 'Knee Replacement',
  currentStage: 3,
  urgency: 'attention',
  representative: {
    name: 'Anita Verma',
    phone: '+91 9876543210',
  },
  nextAction: 'Upload latest lab reports',
  events: [
    {
      timestamp: '2 hrs ago',
      description: 'Lab report uploaded',
      type: 'success',
    },
    {
      timestamp: 'Yesterday',
      description: 'Insurance pre-auth submitted',
      type: 'info',
    },
    {
      timestamp: '2 days ago',
      description: 'Dr. Mehta confirmed availability',
      type: 'alert',
    },
  ],
};