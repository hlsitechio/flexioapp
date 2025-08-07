import React, { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bug, RefreshCw } from 'lucide-react';

interface FriendlyErrorFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

export function FriendlyErrorFallback({ error, onRetry }: FriendlyErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <Alert className="max-w-md">
        <Bug className="h-4 w-4" />
        <AlertTitle>We hit a snag</AlertTitle>
        <AlertDescription className="space-y-3">
          <p className="text-muted-foreground">This section failed to load. You can try again or reload.</p>
          <div className="flex flex-wrap gap-2">
            {onRetry && (
              <Button variant="outline" size="sm" onClick={onRetry} className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Try again
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Reload
            </Button>
            {error && (
              <Button variant="ghost" size="sm" onClick={() => setShowDetails((s) => !s)}>
                {showDetails ? 'Hide details' : 'Show details'}
              </Button>
            )}
          </div>
          {showDetails && error && (
            <pre className="text-xs whitespace-pre-wrap bg-muted/40 p-2 rounded-md max-h-40 overflow-auto">
              {error.message}
            </pre>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
