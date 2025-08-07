import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { ErrorTracker } from '@/lib/monitoring';
import { securityLog } from '@/lib/security/index';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackRender?: (error: Error, reset: () => void) => ReactNode;
  resetKeys?: unknown[];
  name?: string;
  quiet?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  onResetKeysChange?: (prevResetKeys?: unknown[], nextResetKeys?: unknown[]) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  private lastErrorSig?: string;
  private lastErrorAt = 0;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // De-duplicate identical errors occurring within 5s (helps with StrictMode double-invoke)
    const signature = `${error.message}|${errorInfo.componentStack?.slice(0, 200) || ''}`;
    const now = Date.now();
    if (this.lastErrorSig === signature && now - this.lastErrorAt < 5000) {
      return; // Skip duplicate logging/tracking
    }
    this.lastErrorSig = signature;
    this.lastErrorAt = now;

    // Only log in development or when debugging is enabled, and when not in quiet mode
    if (!this.props.quiet && (import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true')) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Track via monitoring and security logger
    try {
      // Always track in production; in dev respect quiet mode
      if (import.meta.env.PROD || !this.props.quiet) {
        ErrorTracker.getInstance().trackError(error, this.props.name || 'ErrorBoundary');
      }
      // Only send security logs in production unless explicitly debugging and not quiet
      if (import.meta.env.PROD || (!this.props.quiet && import.meta.env.VITE_DEBUG === 'true')) {
        securityLog.error(
          'monitoring',
          `ErrorBoundary (${this.props.name || 'global'}) caught: ${error.message}`,
          { componentStack: errorInfo.componentStack, stack: (error as any).stack }
        );
      }
    } catch {}

    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.props.resetKeys && prevProps.resetKeys && !this.areArraysEqual(prevProps.resetKeys, this.props.resetKeys)) {
      this.props.onResetKeysChange?.(prevProps.resetKeys, this.props.resetKeys);
      this.handleReset();
    }
  }

  private areArraysEqual(a?: unknown[], b?: unknown[]) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-[200px] p-4">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>An unexpected error occurred. Please try refreshing the page.</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.handleReset}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try again
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reload page
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}