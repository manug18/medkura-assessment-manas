import { useState, useEffect } from "react";
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

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // persist selection
  useEffect(() => {
    console.log('theme effect:', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);


  const toggleUrgency = () => {
    setUrgency((prev) =>
      prev === "normal"
        ? "attention"
        : prev === "attention"
        ? "urgent"
        : "normal"
    );
  };

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      console.log('toggling theme ->', next);
      return next;
    });
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen p-4 md:p-8 ${
      isDark
        ? 'bg-gray-900'
        : 'bg-gradient-to-br from-slate-200 to-blue-200'
    }`}>
      {/* controls */}
      <div className="max-w-6xl mx-auto flex justify-end mb-4">
        <button
          onClick={toggleTheme}
          className={`text-sm px-3 py-1 rounded-lg border transition ${
            isDark
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
          }`}
        >
          {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PatientCaseCard
            data={{ ...mockData, urgency }}
            onToggleUrgency={toggleUrgency}
            isDark={isDark}
          />
        </div>

        <div>
          <NotificationPanel events={mockData.events} isDark={isDark} />
        </div>
      </div>
      </div>
  );
}

export default App;