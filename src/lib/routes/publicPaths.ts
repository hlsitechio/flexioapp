export const PUBLIC_PATHS = [
  '/',
  '/landing',
  '/contact',
  '/demo',
  '/about',
  '/careers',
  '/blog',
  '/features',
  '/pricing',
  '/integrations',
  '/documentation',
  '/help-center',
  '/privacy-policy',
  '/terms-of-service'
] as const;

export function isPublicPath(pathname: string): boolean {
  if (!pathname) return false;
  if (pathname === '/') return true;
  return PUBLIC_PATHS.some((p) => p !== '/' && pathname.startsWith(p));
}
