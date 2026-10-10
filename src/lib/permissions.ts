import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

// Resources the admin panel manages. Shared by the server config and the client.
export const statement = {
  ...defaultStatements, // user, session (Better Auth admin plugin endpoints)
  admin: ['access'], // may enter the admin area at all
  project: ['create', 'update', 'delete', 'reorder'],
  mail: ['read', 'update', 'delete'],
  media: ['upload', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  // Full control of the site's content and of the admin plugin's user endpoints.
  admin: ac.newRole({
    ...adminAc.statements,
    admin: ['access'],
    project: ['create', 'update', 'delete', 'reorder'],
    mail: ['read', 'update', 'delete'],
    media: ['upload', 'delete'],
  }),
  // Anyone else who somehow has an account: no permissions.
  user: ac.newRole({ admin: [], project: [], mail: [], media: [] }),
};

export type Permissions = {
  [K in keyof typeof statement]?: Array<(typeof statement)[K][number]>;
};
