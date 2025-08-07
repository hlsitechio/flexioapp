import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ReactNode } from 'react';
import { isPublicPath } from '@/lib/routes/publicPaths';
import { FriendlyErrorFallback } from '@/components/ui/FriendlyErrorFallback';

interface ProductionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Lightweight error boundary for production that only shows minimal fallback
 * and doesn't log errors to console unless in development
 */
export function ProductionErrorBoundary({ children, fallback }: ProductionErrorBoundaryProps) {
  // In production, use minimal error handling for public pages
  if (import.meta.env.PROD) {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    const isPublic = isPublicPath(pathname);
    const minimalFallback = fallback || (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Something went wrong. Please refresh the page.</p>
        </div>
      </div>
    );
    const enhancedFallback = <FriendlyErrorFallback />;

    return (
      <ErrorBoundary 
        fallback={isPublic ? minimalFallback : enhancedFallback}
        onError={() => {
          // Quiet in production; tracking handled centrally
        }}
      >
        {children}
      </ErrorBoundary>
    );
  }

  // In development, use full error boundary with detailed logging
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}