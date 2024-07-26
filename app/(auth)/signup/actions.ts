'use server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { userNameRegex } from '@/lib/constants';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { hash } from '@node-rs/argon2';
import { generateIdFromEntropySize } from 'lucia';

export async function SignUpAction({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  const signUpInfo = { email, username, password };
  const signUpSchema = z.object({
    email: z.string().email(),
    username: z.string().regex(userNameRegex),
    password: z.string().min(6).max(64),
  });

  const signUpInfoIsValid = signUpSchema.safeParse(signUpInfo);

  if (!signUpInfoIsValid.success)
    return {
      ok: false,
      messsage: 'Invalid Credentials',
    };

  try {
    const isExisting = await db
      .select()
      .from(users)
      .where(eq(users.email, signUpInfo.email));

    if (isExisting.length > 0)
      return {
        ok: false,
        messsage: 'User with this email already exists',
      };

    const userID = generateIdFromEntropySize(10);
    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const defaultRole: 'user' | 'admin' = 'user';

    await db.insert(users).values({
      id: userID,
      email,
      username,
      passwordHash: hashedPassword,
      role: defaultRole,
    });
    return {
      ok: true,
      messsage: 'Signup Succesful!',
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Something went wrong',
    };
  }
}
