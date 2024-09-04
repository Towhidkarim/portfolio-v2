import { Lucia, Session, User } from 'lucia';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '@/db/index';
import { cookies } from 'next/headers';
import { sessions, users } from '@/db/schema';
import { cache } from 'react';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => ({
    id: attributes.id,
    username: attributes.username,
    email: attributes.email,
    role: attributes.role,
  }),
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionID = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionID)
      return {
        user: null,
        session: null,
      };

    const result = await lucia.validateSession(sessionID);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: Number;
      username: string;
      email: string;
      role: 'user' | 'admin';
    };

    // UserId: number;
  }
}
