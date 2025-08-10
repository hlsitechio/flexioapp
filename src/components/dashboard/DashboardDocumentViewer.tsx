import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentViewer } from '@/components/shared/DocumentViewer';
import { FileText, Upload } from 'lucide-react';

export function DashboardDocumentViewer() {
  const [selectedFile, setSelectedFile] = useState<string>('');
  
  // Sample documents - in a real app, these would come from your file storage
  const sampleDocs = [
    {
      id: 'sample-pdf',
      name: 'Project Report.pdf',
      url: '/lovable-uploads/sample-document.pdf',
      type: 'pdf'
    },
    {
      id: 'sample-doc',
      name: 'Meeting Notes.docx',
      url: '/lovable-uploads/sample-document.docx',
      type: 'docx'
    },
    {
      id: 'sample-sheet',
      name: 'Budget Analysis.xlsx',
      url: '/lovable-uploads/sample-spreadsheet.xlsx',
      type: 'xlsx'
    }
  ];

  const selectedDocument = sampleDocs.find(doc => doc.id === selectedFile);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Viewer
        </CardTitle>
        
        <div className="flex gap-2">
          <Select value={selectedFile} onValueChange={setSelectedFile}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a document to preview" />
            </SelectTrigger>
            <SelectContent>
              {sampleDocs.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button size="sm" variant="outline">
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        {selectedDocument ? (
          <DocumentViewer
            fileUrl={selectedDocument.url}
            fileName={selectedDocument.name}
            fileType={selectedDocument.type}
            showHeader={false}
            height={320}
            className="border-0"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Select a document to preview</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}