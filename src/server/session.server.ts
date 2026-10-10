import { redirect } from '@tanstack/react-router';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { Permissions } from '@/lib/permissions';
import { getAuth } from './auth.server';

export async function getSession() {
  return getAuth().api.getSession({ headers: getRequestHeaders() });
}

// Role -> permission lookup uses the access-control config passed to Better
// Auth's admin plugin (src/lib/permissions.ts), not a hard-coded role check.
export async function hasPermission(
  role: string | null | undefined,
  permissions: Permissions,
) {
  const { success } = await getAuth().api.userHasPermission({
    // any role the config does not know has no permissions
    body: { role: role === 'admin' ? 'admin' : 'user', permissions },
  });
  return success;
}

// Throws a redirect to /login without a session, and a plain error when the
// signed-in user lacks the permission. Call from every admin server function
// (through the middleware below); route guards are UX only.
export async function requirePermission(permissions: Permissions) {
  const session = await getSession();
  if (!session) throw redirect({ to: '/login' });
  if (!(await hasPermission(session.user.role, permissions))) {
    throw new Error('Forbidden');
  }
  return session;
}

export const requireAdmin = () => requirePermission({ admin: ['access'] });
