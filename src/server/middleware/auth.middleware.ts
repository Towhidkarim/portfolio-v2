import { createMiddleware } from '@tanstack/react-start';
import type { Permissions } from '@/lib/permissions';
import { requirePermission } from '../session.server';

// Attach to every admin server function:
//   createServerFn().middleware([requires({ project: ['update'] })])
export const requires = (permissions: Permissions) =>
  createMiddleware({ type: 'function' }).server(async ({ next }) => {
    const session = await requirePermission(permissions);
    return next({ context: { session } });
  });

export const adminOnly = requires({ admin: ['access'] });
