import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentViewer } from '@/components/shared/DocumentViewer';
import { Sidebar } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar/Sidebar';
import { TopNavigation } from '@/components/top-navigation/TopNavigation';
import { Upload, FolderOpen, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SEOHead } from '@/components/seo/SEOHead';

const sampleDocuments = [
  {
    id: '1',
    name: 'Business Plan 2024.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'pdf',
    category: 'Business',
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Marketing Strategy.docx',
    url: 'https://file-examples.com/storage/fe68c8fafcdb49e6e8c94ad/2017/10/file_example_DOCX_100kB.docx',
    type: 'docx',
    category: 'Marketing',
    uploadDate: '2024-01-12'
  },
  {
    id: '3',
    name: 'Financial Report Q1.xlsx',
    url: 'https://file-examples.com/storage/fe68c8fafcdb49e6e8c94ad/2017/10/file_example_XLSX_10.xlsx',
    type: 'xlsx',
    category: 'Finance',
    uploadDate: '2024-01-10'
  },
  {
    id: '4',
    name: 'Product Presentation.pptx',
    url: 'https://file-examples.com/storage/fe68c8fafcdb49e6e8c94ad/2017/10/file_example_PPT_1MB.ppt',
    type: 'pptx',
    category: 'Product',
    uploadDate: '2024-01-08'
  },
  {
    id: '5',
    name: 'Technical Documentation.pdf',
    url: 'https://www.africau.edu/images/default/sample.pdf',
    type: 'pdf',
    category: 'Technical',
    uploadDate: '2024-01-05'
  }
];

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedDoc = sampleDocuments.find(doc => doc.id === selectedDocument);
  
  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(sampleDocuments.map(doc => doc.category)));

  return (
    <>
      <SEOHead
        title="Documents Viewer | FlexIO Dashboard"
        description="View and manage your documents with our advanced document viewer"
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/documents-viewer'}
      />
      
      <div className="flex h-screen bg-background">
        <Sidebar>
          <DashboardSidebar />
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Documents Viewer</h1>
                  <p className="text-muted-foreground mt-1">View and manage your documents</p>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Document List Sidebar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Document Library
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>

                    {/* Category Filter */}
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Document List */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredDocuments.map(doc => (
                        <div
                          key={doc.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
                            selectedDocument === doc.id ? 'bg-accent border-primary' : 'border-border'
                          }`}
                          onClick={() => setSelectedDocument(doc.id)}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.category}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Document Viewer */}
                <div className="lg:col-span-2">
                  {selectedDoc ? (
                    <DocumentViewer
                      fileUrl={selectedDoc.url}
                      fileName={selectedDoc.name}
                      fileType={selectedDoc.type}
                      height={600}
                      className="h-full"
                    />
                  ) : (
                    <Card className="h-full">
                      <CardContent className="flex items-center justify-center h-full min-h-[600px]">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            Select a Document
                          </h3>
                          <p className="text-muted-foreground">
                            Choose a document from the library to view it here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}