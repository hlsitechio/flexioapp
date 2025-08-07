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

  // Basic cache operations with browser-safe no-ops
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    // No-op in browser
    return;
  }

  async get<T = any>(key: string): Promise<T | null> {
    return null;
  }

  async del(key: string): Promise<void> {
    // No-op in browser
  }

  async exists(key: string): Promise<boolean> {
    return false;
  }

  // Session management
  async setSession(sessionId: string, data: SessionData, expirationSeconds = 86400): Promise<void> { return; }
  async getSession(sessionId: string): Promise<SessionData | null> { return null; }
  async deleteSession(sessionId: string): Promise<void> { return; }
  async extendSession(sessionId: string, expirationSeconds = 86400): Promise<void> { return; }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    return { allowed: true, remaining: limit, resetTime: Date.now() + windowSeconds * 1000 };
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern: string): Promise<void> { return; }

  // Real-time updates tracking
  async trackUpdate(resource: string, updateData: any): Promise<void> { return; }
  async getLatestUpdate(resource: string): Promise<{ data: any; timestamp: number } | null> { return null; }

  // Performance metrics caching
  async cacheMetrics(metricsId: string, metrics: any, cacheDurationSeconds = 300): Promise<void> { return; }
  async getCachedMetrics(metricsId: string): Promise<any | null> { return null; }
}

export const vercelKV = VercelKVService.getInstance();
