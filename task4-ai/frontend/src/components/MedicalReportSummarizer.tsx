import React, { useState } from 'react';
import ReportForm from './ReportForm';
import SummaryDisplay from './SummaryDisplay';
import { summarizeReport, fetchSampleReport, SummaryData } from '../services/api';

const MedicalReportSummarizer: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const handleSubmit = async () => {
    setError('');
    setSummary(null);

    if (!reportText.trim()) {
      setError('Please paste a medical report');
      return;
    }

    setLoading(true);
    try {
      const result = await summarizeReport(reportText);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = async () => {
    try {
      const sample = await fetchSampleReport();
      setReportText(sample);
    } catch (err) {
      console.warn('could not load sample', err);
      setError('Failed to fetch sample report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Report Summarizer
          </h1>
          <p className="text-gray-600">
            Powered by Claude AI — Get instant clinical insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ReportForm
              reportText={reportText}
              onChange={setReportText}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
              onLoadSample={loadSample}
            />
          </div>

          <div className="space-y-6">
          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Processing with Claude AI...</p>
                <p className="text-gray-500 text-sm mt-2">This usually takes 5-15 seconds</p>
              </div>
            </div>
          )}

          {!summary && !loading && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No summary yet
              </h3>
              <p className="text-gray-600">
                Submit a medical report to see the AI-generated summary
              </p>
            </div>
          )}

          {summary && <SummaryDisplay summary={summary} onReset={() => {
              setReportText('');
              setSummary(null);
              setError('');
            }} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReportSummarizer;
