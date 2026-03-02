import React from 'react';

interface ReportFormProps {
  reportText: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  onLoadSample?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  reportText,
  onChange,
  onSubmit,
  loading,
  error,
  onLoadSample,
}) => (
  <div className="bg-white rounded-lg shadow p-6 sticky top-4">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Paste Medical Report
    </h2>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="report"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Medical Report Text
        </label>
        <textarea
          id="report"
          value={reportText}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste discharge summary, lab report, or medical notes here..."
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
        />
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
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
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
      {onLoadSample && (
        <button
          type="button"
          className="w-full mt-2 text-sm text-blue-600 underline"
          onClick={onLoadSample}
        >
          Load sample report
        </button>
      )}
    </form>
  </div>
);

export default ReportForm;
