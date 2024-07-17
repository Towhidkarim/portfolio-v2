'use server';
import { z } from 'zod';
import { db } from '@/db';
import { TUser } from '@/types/user';

export async function SignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const logintype = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(64),
  });
  const user = { email, password };
  const userIsValid = logintype.safeParse(user);
  if (!userIsValid.success)
    return {
      ok: false,
      error: 'Invalid Credentials',
    };
}
