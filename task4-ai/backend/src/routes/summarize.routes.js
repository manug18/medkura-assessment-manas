import express from "express";
import { handleSummarize, handleSample } from "../controllers/summary.controller.js";

const router = express.Router();

/**
 * POST /api/summarise
 * Delegates to controller which calls the Claude service
 */
router.post("/summarise", handleSummarize);

/**
 * GET /api/sample
 * Returns a static sample report for frontend demos or tests
 */
router.get("/sample", handleSample);

export default router;
