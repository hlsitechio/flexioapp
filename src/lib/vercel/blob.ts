// Browser-safe stub for Vercel Blob to prevent server-only SDK usage in the client

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

  async uploadFile(
    pathname: string,
    body: Buffer | Uint8Array | string,
    options?: BlobUploadOptions
  ): Promise<BlobFile> {
    throw new Error('Vercel Blob is not available in the browser environment');
  }

  async uploadFromFormData(formData: FormData, fieldName: string = 'file'): Promise<BlobFile> {
    throw new Error('Vercel Blob is not available in the browser environment');
  }

  async deleteFile(url: string): Promise<void> {
    throw new Error('Vercel Blob is not available in the browser environment');
  }

  async listFiles(prefix?: string, limit?: number): Promise<BlobFile[]> {
    // Indicate unavailability so callers can feature-detect
    throw new Error('Vercel Blob is not available in the browser environment');
  }

  async getFileMetadata(url: string): Promise<BlobFile | null> {
    return null;
  }

  async generateExport(data: any, filename: string, format: 'json' | 'csv' = 'json'): Promise<BlobFile> {
    throw new Error('Vercel Blob is not available in the browser environment');
  }
}

export const vercelBlob = VercelBlobService.getInstance();
