import { lazy, Suspense, ComponentType } from 'react';
import { LoadingSkeleton, DashboardSkeleton, NavigationSkeleton } from '@/components/ui/loading-skeleton';

// Utility for creating lazy-loaded components with custom fallbacks
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  return function WrappedComponent(props: React.ComponentProps<T>) {
    const FallbackComponent = fallback || (() => <LoadingSkeleton variant="card" />);
    
    return (
      <Suspense fallback={<FallbackComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Pre-configured lazy components for common patterns
export const LazyDashboard = createLazyComponent(
  () => import('@/components/Dashboard').then(module => ({ default: module.Dashboard })),
  DashboardSkeleton
);

export const LazyAnalyticsPage = createLazyComponent(
  () => import('@/pages/analytics/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })),
  DashboardSkeleton
);

export const LazySettingsPage = createLazyComponent(
  () => import('@/pages/settings/Settings').then(module => ({ default: module.Settings })),
  () => (
    <div className="space-y-6 p-6">
      <LoadingSkeleton variant="text" className="w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoadingSkeleton variant="card" />
        <LoadingSkeleton variant="card" />
      </div>
    </div>
  )
);

export const LazyWorkspacePage = createLazyComponent(
  () => import('@/pages/workspace/WorkspaceSelectionPage').then(module => ({ default: module.WorkspaceSelectionPage })),
  () => (
    <div className="space-y-4 p-6">
      <LoadingSkeleton variant="text" className="w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" className="h-24" />
        ))}
      </div>
    </div>
  )
);

export const LazyAuthPage = createLazyComponent(
  () => import('@/pages/auth/AuthPage').then(module => ({ default: module.AuthPage })),
  () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-4">
        <LoadingSkeleton variant="text" className="w-1/2 mx-auto" />
        <LoadingSkeleton variant="card" className="h-64" />
      </div>
    </div>
  )
);

// Admin components (heavy, load on demand)
export const LazyAdminDashboard = createLazyComponent(
  () => import('@/pages/admin/AdminDashboard')
);

// Large components that can be split
export const LazyCodeSnippetsPage = createLazyComponent(
  () => import('@/pages/code-snippets/CodeSnippetsPage').then(module => ({ default: module.CodeSnippetsPage }))
);

export const LazyPromptsGalleryPage = createLazyComponent(
  () => import('@/pages/prompts-gallery/PromptsGalleryPage').then(module => ({ default: module.PromptsGalleryPage }))
);

// Utility for preloading components
export function preloadComponent(importFn: () => Promise<any>) {
  return importFn();
}

// Preload critical routes after initial load
export function preloadCriticalRoutes() {
  if (typeof window !== 'undefined') {
    // Preload after a short delay to not impact initial page load
    setTimeout(() => {
      preloadComponent(() => import('@/components/Dashboard'));
      preloadComponent(() => import('@/pages/workspace/WorkspaceSelectionPage'));
    }, 2000);
  }
}