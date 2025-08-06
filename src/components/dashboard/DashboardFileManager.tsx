import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, Upload, Download, FileText, Image, Video } from 'lucide-react';

export function DashboardFileManager() {
  const [files] = useState([
    { name: 'project-docs.pdf', type: 'pdf', size: '2.4 MB', modified: '2h ago' },
    { name: 'presentation.pptx', type: 'presentation', size: '15.8 MB', modified: '1d ago' },
    { name: 'design-assets/', type: 'folder', size: '156 files', modified: '3d ago' },
    { name: 'backup.zip', type: 'archive', size: '89.2 MB', modified: '1w ago' }
  ]);

  const storageUsed = 68;

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderOpen className="h-4 w-4 text-blue-500" />;
      case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
      case 'image': return <Image className="h-4 w-4 text-green-500" />;
      case 'video': return <Video className="h-4 w-4 text-purple-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          File Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Storage Used</span>
            <span>{storageUsed}% of 100 GB</span>
          </div>
          <Progress value={storageUsed} className="h-2" />
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 text-sm">
              {getFileIcon(file.type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.size} • {file.modified}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}