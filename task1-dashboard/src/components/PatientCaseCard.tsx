import type { PatientCase } from "../types/patient";
import ProgressStepper from "./ProgressStepper";
import StatusBadge from "./StatusBadge";

interface Props {
  data: PatientCase;
  onToggleUrgency: () => void;
  isDark: boolean;
}

export default function PatientCaseCard({
  data,
  onToggleUrgency,
  isDark,
}: Props) {
  return (
    <div
      className={`rounded-2xl shadow-sm border p-6 ${
        isDark
          ? 'bg-gray-800 border-gray-700 text-gray-100'
          : 'bg-gray-100 border-gray-200 text-gray-900'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">
            {data.patientName}
          </h2>
          <p className="text-sm" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
            Case ID: {data.id} • {data.condition}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge urgency={data.urgency} isDark={isDark} />

          <button
            onClick={onToggleUrgency}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              isDark
                ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
            }`}
          >
            Toggle Urgency
          </button>
        </div>
      </div>

      {/* Representative */}
      <div
        className={`rounded-xl p-4 mb-6 ${
          isDark ? 'bg-gray-700' : 'bg-slate-50'
        }`}
      >
        <p className="text-xs" style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}>
          Care Representative
        </p>
        <p className="text-sm font-medium" style={{ color: isDark ? '#F3F4F6' : '#1F2937' }}>
          {data.representative.name} • {data.representative.phone}
        </p>
      </div>

      {/* Progress */}
      <ProgressStepper currentStage={data.currentStage} isDark={isDark} />

      {/* Next Action */}
      <div
        className={`mt-6 rounded-xl p-4 border ${
          isDark
            ? 'bg-blue-900 border-blue-800'
            : 'bg-blue-50 border-blue-100'
        }`}
      >
        <p
          className={`text-xs font-semibold mb-1 ${
            isDark ? 'text-blue-300' : 'text-blue-700'
          }`}
        >
          Next Action
        </p>
        <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-900'}`}> {data.nextAction}</p>
      </div>
    </div>
  );
}