'use server';
import { z } from 'zod';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TActionResponse } from '@/types';
import { verify } from '@node-rs/argon2';
import { lucia } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function SignInAction({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<TActionResponse> {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(64),
  });
  const loginInfo = { email, password };
  const userIsValid = loginSchema.safeParse(loginInfo);
  if (!userIsValid.success)
    return {
      ok: false,
      message: 'Invalid Credentials',
    };
  try {
    const matchingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, loginInfo.email));

    if (matchingUser.length === 0 || matchingUser[0].passwordHash == null)
      return {
        ok: false,
        message: 'User with such credentials does not exist',
      };

    const passwordIsMatch = await verify(
      matchingUser[0].passwordHash,
      loginInfo.password,
      {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      },
    );
    if (!passwordIsMatch) return { ok: false, message: 'Incorrect password' };

    const session = await lucia.createSession(matchingUser[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { ok: true, message: 'Login Succesful' };
  } catch (error) {
    return {
      ok: false,
      message: 'Something Went Wrong',
    };
  }
}
