// Single place that decides how passwords are hashed. The auth config and the
// admin CLI both import from here, so a hash made by the CLI always verifies at
// sign-in. Better Auth's package resolves to native node:crypto scrypt under
// the `workerd` export condition (N=16384, r=16, p=1, 64-byte key,
// "salt:key" hex), which keeps the work off the JS CPU budget on Workers.
export { hashPassword, verifyPassword } from 'better-auth/crypto';

export const MIN_PASSWORD_LENGTH = 10;
