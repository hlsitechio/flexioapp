import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, File, Image, FileText, Database } from 'lucide-react';
import { vercelBlob, BlobFile } from '@/lib/vercel/blob';
import { vercelAnalytics } from '@/lib/vercel/analytics';
import { toast } from 'sonner';

export function VercelBlobManager() {
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
    vercelAnalytics.trackFeatureUsage('vercel_blob_manager');
  }, []);

  const loadFiles = async () => {
    try {
      const fileList = await vercelBlob.listFiles();
      setFiles(fileList);
    } catch (error) {
      toast.error('Failed to load files');
      vercelAnalytics.trackError(error as Error, { action: 'load_files' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadedFile = await vercelBlob.uploadFromFormData(formData);
      setFiles(prev => [uploadedFile, ...prev]);
      
      toast.success('File uploaded successfully');
      vercelAnalytics.trackUserAction('upload', 'blob_manager', file.type);
    } catch (error) {
      toast.error('Failed to upload file');
      vercelAnalytics.trackError(error as Error, { action: 'upload_file' });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = async (file: BlobFile) => {
    try {
      await vercelBlob.deleteFile(file.url);
      setFiles(prev => prev.filter(f => f.url !== file.url));
      
      toast.success('File deleted successfully');
      vercelAnalytics.trackUserAction('delete', 'blob_manager', file.contentType);
    } catch (error) {
      toast.error('Failed to delete file');
      vercelAnalytics.trackError(error as Error, { action: 'delete_file' });
    }
  };

  const handleDownload = (file: BlobFile) => {
    vercelAnalytics.trackUserAction('download', 'blob_manager', file.contentType);
    window.open(file.url, '_blank');
  };

  const getFileIcon = (contentType?: string) => {
    if (!contentType) return <File className="h-5 w-5" />;
    
    if (contentType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (contentType.includes('text') || contentType.includes('json')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const totalFiles = files.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vercel Blob Storage</h2>
          <p className="text-muted-foreground">Manage your application files and assets</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {totalFiles} files • {formatFileSize(totalSize)}
          </div>
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload File'}
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* Storage Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Files</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFiles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {files.filter(f => f.contentType?.startsWith('image/')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading files...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No files uploaded yet. Upload your first file to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file, index) => (
                <motion.div
                  key={file.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.contentType)}
                    <div>
                      <div className="font-medium">
                        {file.pathname.split('/').pop()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </div>
                    </div>
                    {file.contentType && (
                      <Badge variant="secondary" className="text-xs">
                        {file.contentType.split('/')[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}