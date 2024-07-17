import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  role: z.union([z.literal('user'), z.literal('admin')]),
  username: z.string().min(3).max(16),
  password: z.string().min(1),
});

export type TUser = z.infer<typeof UserSchema>;
