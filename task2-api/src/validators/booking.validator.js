import { z } from "zod";

export const bookingSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  slotDatetime: z.string().datetime("Invalid datetime format. Use ISO 8601 format"),
  patientName: z.string().min(2, "Patient name must be at least 2 characters"),
  patientPhone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 
      "Invalid phone number format"),
});