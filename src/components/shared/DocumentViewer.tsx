import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentViewerProps {
  fileUrl: string;
  fileName: string;
  fileType?: string;
  className?: string;
  showHeader?: boolean;
  height?: number;
}

export function DocumentViewer({ 
  fileUrl, 
  fileName, 
  fileType, 
  className,
  showHeader = true,
  height = 500
}: DocumentViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLoadError = (err: any) => {
    setIsLoading(false);
    setError('Failed to load document. Please try again or download the file.');
    console.error('Document viewer error:', err);
  };

  const getFileExtension = () => {
    return fileType || fileName.split('.').pop()?.toLowerCase();
  };

  const renderContent = () => {
    const extension = getFileExtension();
    
    if (extension === 'pdf') {
      return (
        <div className="w-full" style={{ height: `${height}px` }}>
          <iframe 
            src={fileUrl} 
            className="w-full h-full border rounded"
            title={fileName}
            onLoad={() => setIsLoading(false)}
            onError={() => handleLoadError('PDF load failed')}
          />
        </div>
      );
    }
    
    // Handle images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return (
        <div className="flex justify-center items-center" style={{ height: `${height}px` }}>
          <img 
            src={fileUrl} 
            alt={fileName}
            className="max-w-full max-h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => handleLoadError('Image load failed')}
          />
        </div>
      );
    }
    
    // Handle text files
    if (['txt', 'md', 'json', 'csv'].includes(extension || '')) {
      return (
        <div className="p-4" style={{ height: `${height}px`, overflow: 'auto' }}>
          <iframe 
            src={fileUrl} 
            className="w-full h-full border-0"
            title={fileName}
            onLoad={() => setIsLoading(false)}
            onError={() => handleLoadError('Text file load failed')}
          />
        </div>
      );
    }
    
    // Unsupported file type
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Preview not available for this file type. You can download the file to view it.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {fileName}
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={fileUrl} download={fileName}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Open
              </a>
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className="flex-1 relative">
        {isLoading && (
          <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
            <div className="space-y-3 w-full">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        )}
        
        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isLoading && !error && renderContent()}
      </CardContent>
    </Card>
  );
}