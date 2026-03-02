import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
const MedicalReportSummarizer = () => {
    const [reportText, setReportText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [summary, setSummary] = useState(null);
    const handleSubmit = async (e) => {
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
            const data = await response.json();
            setSummary(data.summary);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result;
                setReportText(text);
            };
            reader.readAsText(file);
        }
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-4 md:p-8", children: [_jsxs("div", { className: "mb-12", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Medical Report Summarizer" }), _jsx("p", { className: "text-gray-600 text-lg", children: "Powered by Claude AI \u2014 Get instant clinical insights in seconds" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsx("h2", { className: "text-2xl font-semibold text-gray-900 mb-6", children: "Paste Medical Report" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "report", className: "block text-sm font-medium text-gray-700 mb-2", children: "Medical Report Text" }), _jsx("textarea", { id: "report", value: reportText, onChange: (e) => setReportText(e.target.value), placeholder: "Paste discharge summary, lab report, or medical notes here...", className: "w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "file", accept: ".txt,.pdf,.doc,.docx", onChange: handleFileUpload, className: "hidden", id: "file-upload" }), _jsx("label", { htmlFor: "file-upload", className: "block text-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors", children: _jsx("span", { className: "text-gray-600", children: "Or upload a file (TXT, PDF, DOC)" }) })] }), error && (_jsxs("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg", children: [_jsx("p", { className: "text-red-800 font-medium", children: "Error" }), _jsx("p", { className: "text-red-700 text-sm mt-1", children: error })] })), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Analyzing Report..."] })) : ('Summarize Report') })] })] }), _jsxs("div", { className: "space-y-6", children: [!summary && !loading && (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 text-center", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No summary yet" }), _jsx("p", { className: "text-gray-600", children: "Submit a medical report to see the AI-generated summary" })] })), loading && (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-8", children: _jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" }), _jsx("p", { className: "text-gray-600 font-medium", children: "Processing with Claude AI..." }), _jsx("p", { className: "text-gray-500 text-sm mt-2", children: "This usually takes 5-15 seconds" })] }) })), summary && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-blue-600", children: "\uD83D\uDCCA" }), " Key Findings"] }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: summary.keyFindings || 'Not specified' })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-green-600", children: "\uD83D\uDC8A" }), " Current Medications"] }), summary.currentMedications && summary.currentMedications.length > 0 ? (_jsx("ul", { className: "space-y-2", children: summary.currentMedications.map((med, idx) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-green-600 font-bold mt-0.5", children: "\u2022" }), _jsx("span", { className: "text-gray-700", children: med })] }, idx))) })) : (_jsx("p", { className: "text-gray-600", children: "No medications listed" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-red-600", children: "\u26A0\uFE0F" }), " Red Flags"] }), summary.redFlags && summary.redFlags.length > 0 ? (_jsx("ul", { className: "space-y-2", children: summary.redFlags.map((flag, idx) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-red-600 font-bold mt-0.5", children: "!" }), _jsx("span", { className: "text-gray-700", children: flag })] }, idx))) })) : (_jsx("p", { className: "text-gray-600", children: "No red flags identified" }))] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-purple-600", children: "\u2753" }), " What Patient is Asking For"] }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: summary.patientQuery || 'Not specified' })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("span", { className: "text-orange-600", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), " Suggested Specialist"] }), _jsx("p", { className: "text-gray-700 font-semibold text-lg", children: summary.suggestedSpecialist || 'Not specified' })] }), _jsx("button", { onClick: () => {
                                            setReportText('');
                                            setSummary(null);
                                            setError('');
                                        }, className: "w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors", children: "Analyze Another Report" })] }))] })] })] }));
};
export default MedicalReportSummarizer;
