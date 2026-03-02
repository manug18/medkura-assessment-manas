import React from 'react';
import { SummaryData } from '../services/api';

interface SummaryDisplayProps {
  summary: SummaryData;
  onReset: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, onReset }) => (
  <div>
    {/* Key Findings */}
    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <span>📊</span> Key Findings
      </h3>
      <p className="text-gray-700 leading-relaxed text-sm">
        {summary.keyFindings || 'Not specified'}
      </p>
    </div>

    {/* Current Medications */}
    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <span>💊</span> Current Medications
      </h3>
      {summary.currentMedications && summary.currentMedications.length > 0 ? (
        <ul className="space-y-1">
          {summary.currentMedications.map((med, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5 text-sm">•</span>
              <span className="text-gray-700 text-sm">{med}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm">No medications listed</p>
      )}
    </div>

    {/* Red Flags */}
    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-500 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <span>⚠️</span> Red Flags
      </h3>
      {summary.redFlags && summary.redFlags.length > 0 ? (
        <ul className="space-y-1">
          {summary.redFlags.map((flag, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-red-600 font-bold mt-0.5 text-sm">!</span>
              <span className="text-gray-700 text-sm">{flag}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-sm">No red flags identified</p>
      )}
    </div>

    {/* Patient Query */}
    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <span>❓</span> What Patient is Asking For
      </h3>
      <p className="text-gray-700 leading-relaxed text-sm">
        {summary.patientQuery || 'Not specified'}
      </p>
    </div>

    {/* Suggested Specialist */}
    <div className="bg-white rounded-lg shadow p-5 border-l-4 border-orange-500 mb-4">
      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <span>👨‍⚕️</span> Suggested Specialist
      </h3>
      <p className="text-gray-700 font-semibold text-base">
        {summary.suggestedSpecialist || 'Not specified'}
      </p>
    </div>

    <button
      onClick={onReset}
      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors text-sm"
    >
      Analyze Another Report
    </button>
  </div>
);

export default SummaryDisplay;
