import { put, del, list, head } from '@vercel/blob';

export interface BlobUploadOptions {
  token?: string;
  addRandomSuffix?: boolean;
  cacheControlMaxAge?: number;
  contentType?: string;
}

export interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
  contentType?: string;
}

export class VercelBlobService {
  private static instance: VercelBlobService;

  static getInstance(): VercelBlobService {
    if (!VercelBlobService.instance) {
      VercelBlobService.instance = new VercelBlobService();
    }
    return VercelBlobService.instance;
  }

  // Upload file to Vercel Blob
  async uploadFile(
    pathname: string,
    body: Buffer | Uint8Array | string,
    options?: BlobUploadOptions
  ): Promise<BlobFile> {
    try {
      const blob = await put(pathname, body, {
        access: 'public',
        ...options,
      });

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: 0, // Size not available in put result
        uploadedAt: new Date(),
        contentType: options?.contentType,
      };
    } catch (error) {
      console.error('Failed to upload file to Vercel Blob:', error);
      throw new Error('File upload failed');
    }
  }

  // Upload from FormData
  async uploadFromFormData(formData: FormData, fieldName: string = 'file'): Promise<BlobFile> {
    const file = formData.get(fieldName) as File;
    if (!file) {
      throw new Error('No file found in form data');
    }

    const buffer = await file.arrayBuffer();
    const pathname = `uploads/${Date.now()}-${file.name}`;

    return this.uploadFile(pathname, new Uint8Array(buffer), {
      contentType: file.type,
      addRandomSuffix: true,
    });
  }

  // Delete file from Vercel Blob
  async deleteFile(url: string): Promise<void> {
    try {
      await del(url);
    } catch (error) {
      console.error('Failed to delete file from Vercel Blob:', error);
      throw new Error('File deletion failed');
    }
  }

  // List files in Vercel Blob
  async listFiles(prefix?: string, limit?: number): Promise<BlobFile[]> {
    try {
      const { blobs } = await list({
        prefix,
        limit,
      });

      return blobs.map(blob => ({
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size || 0,
        uploadedAt: new Date(blob.uploadedAt || Date.now()),
        contentType: undefined, // Not available in list result
      }));
    } catch (error) {
      console.error('Failed to list files from Vercel Blob:', error);
      throw new Error('File listing failed');
    }
  }

  // Get file metadata
  async getFileMetadata(url: string): Promise<BlobFile | null> {
    try {
      const blob = await head(url);
      if (!blob) return null;

      return {
        url: blob.url,
        pathname: blob.pathname,
        size: blob.size,
        uploadedAt: new Date(blob.uploadedAt),
        contentType: blob.contentType,
      };
    } catch (error) {
      console.error('Failed to get file metadata:', error);
      return null;
    }
  }

  // Generate export file
  async generateExport(data: any, filename: string, format: 'json' | 'csv' = 'json'): Promise<BlobFile> {
    let content: string;
    let contentType: string;

    switch (format) {
      case 'csv':
        content = this.convertToCSV(data);
        contentType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        contentType = 'application/json';
        break;
    }

    const pathname = `exports/${Date.now()}-${filename}.${format}`;
    return this.uploadFile(pathname, content, { contentType });
  }

  private convertToCSV(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) {
      return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  }
}

export const vercelBlob = VercelBlobService.getInstance();