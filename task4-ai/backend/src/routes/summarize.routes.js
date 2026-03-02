import express from "express";
import { summarizeMedicalReport } from "../services/claude.service.js";

const router = express.Router();

/**
 * POST /api/summarise
 * Accepts a medical report text and returns AI-generated summary
 */
router.post("/summarise", async (req, res) => {
  try {
    const { reportText } = req.body;

    if (!reportText) {
      return res.status(400).json({
        error: "reportText is required",
      });
    }

    const summary = await summarizeMedicalReport(reportText);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Error in /summarise endpoint:", error);

    // Handle specific error types
    if (error.message.includes("API key")) {
      return res.status(500).json({
        error: "Claude API key not configured. Please add CLAUDE_API_KEY to .env",
      });
    }

    if (error.message.includes("overloaded")) {
      return res.status(503).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: error.message || "Failed to summarize report",
    });
  }
});

export default router;
