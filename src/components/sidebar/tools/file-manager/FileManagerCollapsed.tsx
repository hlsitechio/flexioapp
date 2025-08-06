import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FolderOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function FileManagerCollapsed() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card>
          <CardContent className="p-3 text-center">
            <FolderOpen className="h-6 w-6 mx-auto mb-1" />
            <div className="text-xs">Files</div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="right">
        <div className="text-center">
          <div>File Manager</div>
          <div className="text-xs text-muted-foreground">Manage your files</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}