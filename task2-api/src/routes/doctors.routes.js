import express from "express";
import {
  getDoctors,
  getDoctorSlots,
  createBooking,
} from "../controllers/doctors.controller.js";

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/doctors/:id/slots", getDoctorSlots);
router.post("/bookings", createBooking);

export default router;