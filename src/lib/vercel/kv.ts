import { kv } from '@vercel/kv';

export interface CacheOptions {
  ex?: number; // Expiration in seconds
  px?: number; // Expiration in milliseconds
  nx?: boolean; // Only set if key doesn't exist
  xx?: boolean; // Only set if key exists
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

  // Basic cache operations
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      if (options?.ex) {
        await kv.setex(key, options.ex, JSON.stringify(value));
      } else if (options?.px) {
        await kv.psetex(key, options.px, JSON.stringify(value));
      } else {
        await kv.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('KV set error:', error);
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await kv.get(key);
      return value ? JSON.parse(value as string) : null;
    } catch (error) {
      console.error('KV get error:', error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await kv.del(key);
    } catch (error) {
      console.error('KV delete error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await kv.exists(key);
      return result === 1;
    } catch (error) {
      console.error('KV exists error:', error);
      return false;
    }
  }

  // Session management
  async setSession(sessionId: string, data: SessionData, expirationSeconds = 86400): Promise<void> {
    const key = `session:${sessionId}`;
    await this.set(key, data, { ex: expirationSeconds });
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const key = `session:${sessionId}`;
    return this.get<SessionData>(key);
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = `session:${sessionId}`;
    await this.del(key);
  }

  async extendSession(sessionId: string, expirationSeconds = 86400): Promise<void> {
    const key = `session:${sessionId}`;
    try {
      await kv.expire(key, expirationSeconds);
    } catch (error) {
      console.error('KV expire error:', error);
    }
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = `rate_limit:${identifier}`;
    const now = Date.now();
    const windowStart = now - (windowSeconds * 1000);

    try {
      // Get current count
      const current = await kv.get(key) || '0';
      const count = parseInt(current as string, 10);

      if (count >= limit) {
        const ttl = await kv.ttl(key);
        return {
          allowed: false,
          remaining: 0,
          resetTime: now + (ttl * 1000),
        };
      }

      // Increment counter
      const newCount = count + 1;
      await kv.setex(key, windowSeconds, newCount.toString());

      return {
        allowed: true,
        remaining: limit - newCount,
        resetTime: now + (windowSeconds * 1000),
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      // On error, allow the request
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + (windowSeconds * 1000),
      };
    }
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern: string): Promise<void> {
    try {
      // Note: This requires scanning keys, which can be expensive
      // Use with caution in production
      const keys = await kv.keys(pattern);
      if (keys.length > 0) {
        await kv.del(...keys);
      }
    } catch (error) {
      console.error('Pattern invalidation error:', error);
    }
  }

  // Real-time updates tracking
  async trackUpdate(resource: string, updateData: any): Promise<void> {
    const key = `updates:${resource}`;
    const timestamp = Date.now();
    
    await this.set(key, {
      data: updateData,
      timestamp,
    }, { ex: 300 }); // 5 minutes
  }

  async getLatestUpdate(resource: string): Promise<{ data: any; timestamp: number } | null> {
    const key = `updates:${resource}`;
    return this.get(key);
  }

  // Performance metrics caching
  async cacheMetrics(metricsId: string, metrics: any, cacheDurationSeconds = 300): Promise<void> {
    const key = `metrics:${metricsId}`;
    await this.set(key, metrics, { ex: cacheDurationSeconds });
  }

  async getCachedMetrics(metricsId: string): Promise<any | null> {
    const key = `metrics:${metricsId}`;
    return this.get(key);
  }
}

export const vercelKV = VercelKVService.getInstance();