export interface SummaryData {
  keyFindings: string | null;
  currentMedications: string[] | null;
  redFlags: string[] | null;
  patientQuery: string | null;
  suggestedSpecialist: string | null;
}

export async function summarizeReport(reportText: string): Promise<SummaryData> {
  const res = await fetch('/api/summarise', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reportText }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to summarize report');
  }
  const data = await res.json();
  return data.summary;
}

export async function fetchSampleReport(): Promise<string> {
  const res = await fetch('/api/sample');
  if (!res.ok) {
    throw new Error('Failed to fetch sample report');
  }
  const data = await res.json();
  return data.report;
}
