import express from "express";
import cors from "cors";
import doctorRoutes from "./routes/doctors.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    service: "Doctor Booking API"
  });
});

// API routes
app.use("/", doctorRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Endpoint not found",
    path: req.path 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
});