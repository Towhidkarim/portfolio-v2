import { z } from 'zod';

// Public contact form. Plain zod so the public bundle does not pull in drizzle.
export const ContactSchema = z.object({
  senderName: z.string().trim().min(2).max(80),
  senderEmail: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
});

export type TContact = z.infer<typeof ContactSchema>;
