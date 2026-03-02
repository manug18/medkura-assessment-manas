import { z } from "zod";

export const bookingSchema = z.object({
  doctorId: z.string().min(1),
  slotDatetime: z.string().min(1),
  patientName: z.string().min(1),
  patientPhone: z.string().min(10),
});