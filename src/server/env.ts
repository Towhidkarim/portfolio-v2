import { env } from 'cloudflare:workers';

// Bindings exist only inside a request: call this from handlers, never at module scope.
export const getEnv = () => env;
