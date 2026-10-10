// Only same-site relative paths are allowed as a post-login target.
export function safeRedirect(target: string | undefined, fallback = '/admin') {
  if (!target) return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  if (target.includes('\\')) return fallback;
  return target;
}
