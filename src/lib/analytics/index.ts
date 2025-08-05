import { integrationsConfig } from '../../../config/integrations';

// Analytics event interface
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

// Base analytics provider interface
export interface AnalyticsProvider {
  initialize(): void;
  track(event: AnalyticsEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

// Vercel Analytics Provider
class VercelAnalyticsProvider implements AnalyticsProvider {
  private initialized = false;

  initialize() {
    if (this.initialized || !integrationsConfig.analytics.vercel.enabled) return;
    
    // Vercel Analytics is automatically initialized
    this.initialized = true;
    console.log('Vercel Analytics initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.initialized) return;
    
    // Vercel Analytics doesn't have custom event tracking in the free tier
    // This would be implemented with their Pro features
    console.log('Vercel Analytics event:', event);
  }

  identify(userId: string, traits?: Record<string, any>) {
    // Vercel Analytics doesn't support user identification
    console.log('Vercel Analytics identify:', { userId, traits });
  }

  page(name: string, properties?: Record<string, any>) {
    // Page views are automatically tracked by Vercel Analytics
    console.log('Vercel Analytics page view:', { name, properties });
  }
}

// Google Analytics Provider
class GoogleAnalyticsProvider implements AnalyticsProvider {
  private initialized = false;

  initialize() {
    if (this.initialized || !integrationsConfig.analytics.googleAnalytics.enabled) return;
    
    const { measurementId, config } = integrationsConfig.analytics.googleAnalytics;
    
    if (!measurementId) {
      console.warn('Google Analytics measurement ID not configured');
      return;
    }

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, config);

    this.initialized = true;
    console.log('Google Analytics initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.initialized || typeof (window as any).gtag !== 'function') return;

    (window as any).gtag('event', event.name, {
      ...event.properties,
      user_id: event.userId,
    });
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.initialized || typeof (window as any).gtag !== 'function') return;

    (window as any).gtag('config', integrationsConfig.analytics.googleAnalytics.measurementId, {
      user_id: userId,
      custom_map: traits,
    });
  }

  page(name: string, properties?: Record<string, any>) {
    if (!this.initialized || typeof (window as any).gtag !== 'function') return;

    (window as any).gtag('config', integrationsConfig.analytics.googleAnalytics.measurementId, {
      page_title: name,
      page_location: window.location.href,
      ...properties,
    });
  }
}

// Analytics Manager
export class AnalyticsManager {
  private static instance: AnalyticsManager;
  private providers: AnalyticsProvider[] = [];
  private queue: AnalyticsEvent[] = [];
  private initialized = false;

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  initialize() {
    if (this.initialized) return;

    // Initialize providers
    this.providers = [
      new VercelAnalyticsProvider(),
      new GoogleAnalyticsProvider(),
    ];

    this.providers.forEach(provider => provider.initialize());

    // Process queued events
    this.queue.forEach(event => this.track(event));
    this.queue = [];

    this.initialized = true;
    console.log('Analytics Manager initialized');
  }

  track(event: AnalyticsEvent) {
    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.providers.forEach(provider => provider.track(event));
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (!this.initialized) return;

    this.providers.forEach(provider => provider.identify(userId, traits));
  }

  page(name: string, properties?: Record<string, any>) {
    if (!this.initialized) return;

    this.providers.forEach(provider => provider.page(name, properties));
  }

  // Convenience methods for common events
  trackPageView(pageName: string) {
    this.page(pageName, {
      path: window.location.pathname,
      url: window.location.href,
      referrer: document.referrer,
    });
  }

  trackUserAction(action: string, category: string, label?: string, value?: number) {
    this.track({
      name: action,
      properties: {
        category,
        label,
        value,
      },
    });
  }

  trackConversion(type: string, value?: number, currency?: string) {
    this.track({
      name: 'conversion',
      properties: {
        type,
        value,
        currency: currency || 'USD',
      },
    });
  }
}

// Export singleton instance
export const analytics = AnalyticsManager.getInstance();