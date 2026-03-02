import { summarizeMedicalReport } from "../services/claude.service.js";
import { sampleReport } from "../data/sample_reports.js";

export async function handleSummarize(req, res) {
  try {
    const { reportText } = req.body;

    if (!reportText) {
      return res.status(400).json({ error: "reportText is required" });
    }

    const summary = await summarizeMedicalReport(reportText);

    res.json({ success: true, summary });
  } catch (error) {
    console.error("Error in summarize controller:", error);

    // detect our explicit env-check error
    if (error instanceof Error && error.message === "CLAUDE_API_KEY environment variable is not set") {
      return res.status(500).json({
        error: "Claude API key not configured. Please add CLAUDE_API_KEY to .env",
      });
    }

    if (error instanceof Error && error.message.includes("overloaded")) {
      return res.status(503).json({ error: error.message });
    }

    // otherwise return whatever message we got
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to summarize report" });
  }
}

export function handleSample(req, res) {
  res.json({ success: true, report: sampleReport });
}
