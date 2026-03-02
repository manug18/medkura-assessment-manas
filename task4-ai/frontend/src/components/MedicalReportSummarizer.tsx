import { useState } from 'react';

interface SummaryData {
  keyFindings: string | null;
  currentMedications: string[] | null;
  redFlags: string[] | null;
  patientQuery: string | null;
  suggestedSpecialist: string | null;
}

interface ApiResponse {
  success: boolean;
  summary: SummaryData;
}

const MedicalReportSummarizer = () => {
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSummary(null);

    if (!reportText.trim()) {
      setError('Please paste a medical report');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/summarise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to summarize report');
      }

      const data: ApiResponse = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setReportText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Medical Report Summarizer
        </h1>
        <p className="text-gray-600 text-lg">
          Powered by Claude AI — Get instant clinical insights in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Paste Medical Report
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="report" className="block text-sm font-medium text-gray-700 mb-2">
                Medical Report Text
              </label>
              <textarea
                id="report"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste discharge summary, lab report, or medical notes here..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="relative">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="block text-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
              >
                <span className="text-gray-600">Or upload a file (TXT, PDF, DOC)</span>
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                'Summarize Report'
              )}
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
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

          {loading && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Processing with Claude AI...</p>
                <p className="text-gray-500 text-sm mt-2">This usually takes 5-15 seconds</p>
              </div>
            </div>
          )}

          {summary && (
            <div className="space-y-4">
              {/* Key Findings */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📊</span> Key Findings
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {summary.keyFindings || 'Not specified'}
                </p>
              </div>

              {/* Current Medications */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-green-600">💊</span> Current Medications
                </h3>
                {summary.currentMedications && summary.currentMedications.length > 0 ? (
                  <ul className="space-y-2">
                    {summary.currentMedications.map((med, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-600 font-bold mt-0.5">•</span>
                        <span className="text-gray-700">{med}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No medications listed</p>
                )}
              </div>

              {/* Red Flags */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-600">⚠️</span> Red Flags
                </h3>
                {summary.redFlags && summary.redFlags.length > 0 ? (
                  <ul className="space-y-2">
                    {summary.redFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-red-600 font-bold mt-0.5">!</span>
                        <span className="text-gray-700">{flag}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No red flags identified</p>
                )}
              </div>

              {/* Patient Query */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-purple-600">❓</span> What Patient is Asking For
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {summary.patientQuery || 'Not specified'}
                </p>
              </div>

              {/* Suggested Specialist */}
              <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-orange-600">👨‍⚕️</span> Suggested Specialist
                </h3>
                <p className="text-gray-700 font-semibold text-lg">
                  {summary.suggestedSpecialist || 'Not specified'}
                </p>
              </div>

              <button
                onClick={() => {
                  setReportText('');
                  setSummary(null);
                  setError('');
                }}
                className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
              >
                Analyze Another Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalReportSummarizer;
