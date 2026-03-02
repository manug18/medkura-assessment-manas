import { doctorService } from "../services/doctor.service.js";
import { bookingSchema } from "../validators/booking.validator.js";

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

// small helper (looks professional)
function handleError(res, err) {
  res.status(err.statusCode || 400).json({
    message: err.message || "Something went wrong",
  });
}