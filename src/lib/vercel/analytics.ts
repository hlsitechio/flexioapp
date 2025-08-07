import { track } from '@vercel/analytics';
import { SpeedInsights } from '@vercel/speed-insights/react';

export interface VercelAnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export class VercelAnalyticsService {
  private static instance: VercelAnalyticsService;

  static getInstance(): VercelAnalyticsService {
    if (!VercelAnalyticsService.instance) {
      VercelAnalyticsService.instance = new VercelAnalyticsService();
    }
    return VercelAnalyticsService.instance;
  }

  // Track custom events
  trackEvent(event: VercelAnalyticsEvent): void {
    if (typeof window !== 'undefined') {
      track(event.name, event.properties);
    }
  }

  // Track user actions
  trackUserAction(action: string, category: string, label?: string): void {
    this.trackEvent({
      name: 'user_action',
      properties: {
        action,
        category,
        label,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track feature usage
  trackFeatureUsage(feature: string, context?: Record<string, any>): void {
    this.trackEvent({
      name: 'feature_usage',
      properties: {
        feature,
        ...context,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track conversion events
  trackConversion(type: string, value?: number, currency?: string): void {
    this.trackEvent({
      name: 'conversion',
      properties: {
        type,
        value,
        currency,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, unit: string): void {
    this.trackEvent({
      name: 'performance_metric',
      properties: {
        metric,
        value,
        unit,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>): void {
    this.trackEvent({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const vercelAnalytics = VercelAnalyticsService.getInstance();