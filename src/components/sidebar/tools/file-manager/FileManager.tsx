import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Upload, FileText, Image } from 'lucide-react';

export function FileManager() {
  const [files] = useState([
    { name: 'document.pdf', type: 'pdf', size: '2.4 MB' },
    { name: 'images/', type: 'folder', size: '12 files' },
    { name: 'notes.txt', type: 'text', size: '1.2 KB' }
  ]);

  const storageUsed = 68;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderOpen className="h-3 w-3 text-blue-500" />;
      case 'pdf': return <FileText className="h-3 w-3 text-red-500" />;
      case 'image': return <Image className="h-3 w-3 text-green-500" />;
      default: return <FileText className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          File Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Storage</span>
            <span>{storageUsed}%</span>
          </div>
          <Progress value={storageUsed} className="h-1" />
        </div>
        
        <div className="space-y-1">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-1 rounded hover:bg-muted/50 text-xs">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.size}</div>
              </div>
            </div>
          ))}
        </div>
        
        <Button size="sm" variant="outline" className="w-full text-xs">
          <Upload className="h-3 w-3 mr-1" />
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}