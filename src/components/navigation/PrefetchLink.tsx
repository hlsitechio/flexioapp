import { Link, LinkProps } from 'react-router-dom';
import React from 'react';

// Map routes to dynamic imports for prefetching heavy chunks
const routePrefetchMap: Record<string, () => Promise<any>> = {
  '/workspace-selection': () => import('@/pages/workspace/WorkspaceSelectionPage'),
  '/auth': () => import('@/pages/auth/AuthPage'),
};

export function PrefetchLink({ to, onMouseEnter, ...props }: LinkProps) {
  const handleMouseEnter: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (typeof to === 'string') {
      const prefetch = routePrefetchMap[to];
      if (prefetch) {
        prefetch().catch(() => {});
      }
    }
    onMouseEnter?.(e);
  };

  return <Link to={to} onMouseEnter={handleMouseEnter} {...props} />;
}
