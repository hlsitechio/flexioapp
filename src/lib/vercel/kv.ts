// Browser-safe stub for Vercel KV to prevent server-only SDK usage in the client

export interface CacheOptions {
  ex?: number;
  px?: number;
  nx?: boolean;
  xx?: boolean;
}

export interface SessionData {
  userId: string;
  email: string;
  workspace?: string;
  preferences?: Record<string, any>;
  lastActivity: string;
}

export class VercelKVService {
  private static instance: VercelKVService;

  static getInstance(): VercelKVService {
    if (!VercelKVService.instance) {
      VercelKVService.instance = new VercelKVService();
    }
    return VercelKVService.instance;
  }

  async set(): Promise<void> {
    // No-op in browser
  }

  async get<T = any>(): Promise<T | null> {
    return null;
  }

  async del(): Promise<void> {
    // No-op in browser
  }

  async exists(): Promise<boolean> {
    return false;
  }

  async setSession(): Promise<void> {}
  async getSession(): Promise<SessionData | null> { return null; }
  async deleteSession(): Promise<void> {}
  async extendSession(): Promise<void> {}

  async checkRateLimit(): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    return { allowed: true, remaining: 1, resetTime: Date.now() + 60000 };
  }

  async invalidatePattern(): Promise<void> {}

  async trackUpdate(): Promise<void> {}
  async getLatestUpdate(): Promise<{ data: any; timestamp: number } | null> { return null; }

  async cacheMetrics(): Promise<void> {}
  async getCachedMetrics(): Promise<any | null> { return null; }
}

export const vercelKV = VercelKVService.getInstance();
