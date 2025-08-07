import { useEffect, useState } from 'react';
import { vercelAnalytics } from '@/lib/vercel/analytics';
import { vercelKV } from '@/lib/vercel/kv';
import { vercelBlob } from '@/lib/vercel/blob';

export interface VercelIntegrationStatus {
  analytics: boolean;
  kv: boolean;
  blob: boolean;
}

export interface VercelMetrics {
  analytics: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
  };
  performance: {
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  storage: {
    totalFiles: number;
    totalSize: number;
  };
}

export function useVercelIntegrations() {
  const [status, setStatus] = useState<VercelIntegrationStatus>({
    analytics: true, // Vercel Analytics is enabled by default
    kv: false,
    blob: false,
  });

  const [metrics, setMetrics] = useState<VercelMetrics>({
    analytics: {
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
    },
    performance: {
      responseTime: 0,
      errorRate: 0,
      throughput: 0,
    },
    storage: {
      totalFiles: 0,
      totalSize: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeIntegrations();
  }, []);

  const initializeIntegrations = async () => {
    try {
      // Test KV connection
      try {
        await vercelKV.set('health_check', { timestamp: Date.now() }, { ex: 10 });
        setStatus(prev => ({ ...prev, kv: true }));
      } catch (error) {
        console.log('KV not available:', error);
      }

      // Test Blob connection
      try {
        await vercelBlob.listFiles('', 1);
        setStatus(prev => ({ ...prev, blob: true }));
      } catch (error) {
        console.log('Blob not available:', error);
      }

      // Load cached metrics
      await loadMetrics();
    } catch (error) {
      console.error('Failed to initialize Vercel integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      // Try to load from cache first
      if (status.kv) {
        const cachedMetrics = await vercelKV.getCachedMetrics('vercel_overview');
        if (cachedMetrics) {
          setMetrics(cachedMetrics);
          return;
        }
      }

      // Load storage metrics
      if (status.blob) {
        const files = await vercelBlob.listFiles();
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);
        
        setMetrics(prev => ({
          ...prev,
          storage: {
            totalFiles: files.length,
            totalSize,
          },
        }));
      }

      // Simulate analytics data (in real app, this would come from Vercel Analytics API)
      setMetrics(prev => ({
        ...prev,
        analytics: {
          pageViews: 12543,
          uniqueVisitors: 8921,
          bounceRate: 32.4,
        },
        performance: {
          responseTime: 180,
          errorRate: 0.3,
          throughput: 1250,
        },
      }));

      // Cache the metrics
      if (status.kv) {
        await vercelKV.cacheMetrics('vercel_overview', metrics, 300);
      }
    } catch (error) {
      console.error('Failed to load metrics:', error);
    }
  };

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    vercelAnalytics.trackEvent({ name: eventName, properties });
  };

  const trackFeature = (feature: string, context?: Record<string, any>) => {
    vercelAnalytics.trackFeatureUsage(feature, context);
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    vercelAnalytics.trackError(error, context);
  };

  const cacheData = async (key: string, data: any, expirationSeconds = 300) => {
    if (status.kv) {
      await vercelKV.set(key, data, { ex: expirationSeconds });
    }
  };

  const getCachedData = async (key: string) => {
    if (status.kv) {
      return await vercelKV.get(key);
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    if (!status.blob) {
      throw new Error('Blob storage not available');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    return await vercelBlob.uploadFromFormData(formData);
  };

  const refreshMetrics = async () => {
    setLoading(true);
    await loadMetrics();
    setLoading(false);
  };

  return {
    status,
    metrics,
    loading,
    trackEvent,
    trackFeature,
    trackError,
    cacheData,
    getCachedData,
    uploadFile,
    refreshMetrics,
  };
}