import { doctorService } from "../services/doctor.service.js";
import { bookingSchema } from "../validators/booking.validator.js";
import { ZodError } from "zod";

export const getDoctors = (req, res) => {
  try {
    const data = doctorService.getDoctors(req.query);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

export const getDoctorSlots = (req, res) => {
  try {
    const data = doctorService.getDoctorSlots(req.params.id);
    res.json(data);
  } catch (err) {
    handleError(res, err);
  }
};

export const createBooking = (req, res) => {
  try {
    const validated = bookingSchema.parse(req.body);
    const result = doctorService.createBooking(validated);
    res.status(201).json(result);
  } catch (err) {
    handleError(res, err);
  }
};

// Enhanced error handler with Zod validation support
function handleError(res, err) {
  // Handle Zod validation errors
  if (err.name === 'ZodError' || err.constructor.name === 'ZodError') {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }
  
  // Handle custom errors with statusCode
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
}