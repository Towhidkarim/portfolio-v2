import { createServerFn } from '@tanstack/react-start';
import { getSession, hasPermission } from '../session.server';

// For route guards (UX). Data endpoints enforce auth with the middleware.
export const fetchAdminSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const session = await getSession();
    if (!session) return null;
    if (!(await hasPermission(session.user.role, { admin: ['access'] }))) {
      return null;
    }
    const { id, name, email, role } = session.user;
    return { user: { id, name, email, role } };
  },
);
