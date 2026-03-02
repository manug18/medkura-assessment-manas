import type { PatientCase } from "../types/patient";
import ProgressStepper from "./ProgressStepper";
import StatusBadge from "./StatusBadge";

interface Props {
  data: PatientCase;
  onToggleUrgency: () => void;
}

export default function PatientCaseCard({
  data,
  onToggleUrgency,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {data.patientName}
          </h2>
          <p className="text-sm text-gray-500">
            Case ID: {data.id} • {data.condition}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge urgency={data.urgency} />

          <button
            onClick={onToggleUrgency}
            className="text-xs px-3 py-1.5 rounded-lg border bg-gray-50 hover:bg-gray-100 transition"
          >
            Toggle Urgency
          </button>
        </div>
      </div>

      {/* Representative */}
      <div className="bg-slate-50 rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-500">Care Representative</p>
        <p className="text-sm font-medium text-gray-800">
          {data.representative.name} • {data.representative.phone}
        </p>
      </div>

      {/* Progress */}
      <ProgressStepper currentStage={data.currentStage} />

      {/* Next Action */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs text-blue-700 font-semibold mb-1">
          Next Action
        </p>
        <p className="text-sm text-blue-900">{data.nextAction}</p>
      </div>
    </div>
  );
}