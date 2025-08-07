import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ReactNode } from 'react';

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
    const minimalFallback = fallback || (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Something went wrong. Please refresh the page.</p>
        </div>
      </div>
    );

    return (
      <ErrorBoundary 
        fallback={minimalFallback}
        onError={(error, errorInfo) => {
          // In production, only track critical errors silently
          // Don't flood console with errors
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