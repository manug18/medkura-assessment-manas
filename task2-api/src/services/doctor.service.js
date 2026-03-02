import { doctors, slots, bookings } from "../data/seed.js";
import { v4 as uuidv4 } from "uuid";

export const doctorService = {
  getDoctors(filters) {
    const { specialty, city } = filters;

    let result = doctors;

    if (specialty) {
      result = result.filter(
        (d) => d.specialty.toLowerCase() === specialty.toLowerCase()
      );
    }

    if (city) {
      result = result.filter(
        (d) => d.city.toLowerCase() === city.toLowerCase()
      );
    }

    return result;
  },

  getDoctorSlots(doctorId) {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      slots: slots[doctorId] || [],
    };
  },

  createBooking(data) {
    const { doctorId, slotDatetime, patientName, patientPhone } = data;

    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 404;
      throw error;
    }

    const doctorSlots = slots[doctorId] || [];
    const slot = doctorSlots.find((s) => s.datetime === slotDatetime);

    if (!slot) {
      const error = new Error("Slot not found");
      error.statusCode = 404;
      throw error;
    }

    if (slot.isBooked) {
      const error = new Error("Slot already booked");
      error.statusCode = 409;
      throw error;
    }

    // mark booked
    slot.isBooked = true;

    const bookingRef = `BK-${uuidv4().slice(0, 8)}`;

    const booking = {
      bookingRef,
      doctorId,
      slotDatetime,
      patientName,
      patientPhone,
    };

    bookings.push(booking);

    return {
      message: "Booking confirmed",
      bookingRef,
    };
  },
};