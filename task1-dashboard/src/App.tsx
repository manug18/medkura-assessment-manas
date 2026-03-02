import { useState } from "react";
import PatientCaseCard from "./components/PatientCaseCard";
import NotificationPanel from "./components/NotificationPanel";
import type { PatientCase } from "./types/patient";

const mockData: PatientCase = {
  id: "MK-2026-001",
  patientName: "Ravi Sharma",
  age: 58,
  condition: "Knee Replacement",
  currentStage: 4,
  urgency: "attention",
  representative: {
    name: "Anjali Mehta",
    phone: "+91 98765 43210",
  },
  nextAction: "Upload latest blood test report",
  events: [
    {
      timestamp: "2 hours ago",
      description: "Dr. Mehta confirmed availability for Jan 3",
      type: "info",
    },
    {
      timestamp: "Yesterday",
      description: "Lab report uploaded",
      type: "success",
    },
    {
      timestamp: "2 days ago",
      description: "Insurance pre-auth submitted",
      type: "info",
    },
    {
      timestamp: "3 days ago",
      description: "Patient requested earlier slot",
      type: "alert",
    },
  ],
};

function App() {
  const [urgency, setUrgency] =
    useState<PatientCase["urgency"]>("attention");

  const toggleUrgency = () => {
    setUrgency((prev) =>
      prev === "normal"
        ? "attention"
        : prev === "attention"
        ? "urgent"
        : "normal"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientCaseCard
            data={{ ...mockData, urgency }}
            onToggleUrgency={toggleUrgency}
          />
        </div>

        <div>
          <NotificationPanel events={mockData.events} />
        </div>
      </div>
    </div>
  );
}

export default App;