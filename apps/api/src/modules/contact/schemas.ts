import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(5).max(150),
  message: z.string().trim().min(10).max(5000),
  contactToken: z.string().trim().min(32).max(1024),
  honeypot: z.string().max(0).optional().default(""),
  timestamp: z.number().int().positive(),
});
