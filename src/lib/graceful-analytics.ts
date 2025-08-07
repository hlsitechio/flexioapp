// Analytics error handling and graceful degradation
// This helps handle blocked tracking scripts (ad blockers, privacy settings)

interface AnalyticsConfig {
  googleAnalytics?: {
    enabled: boolean;
    measurementId?: string;
  };
  facebookPixel?: {
    enabled: boolean;
    pixelId?: string;
  };
  linkedInInsight?: {
    enabled: boolean;
    partnerId?: string;
  };
}

class GracefulAnalytics {
  private config: AnalyticsConfig;
  private blockedServices: Set<string> = new Set();
  private eventQueue: Array<{ eventName: string; properties: Record<string, any> }> = [];
  private processingQueue = false;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.setupErrorHandlers();
    this.startQueueProcessor();
  }

  private setupErrorHandlers() {
    // Catch script loading errors
    window.addEventListener('error', (event) => {
      const target = event.target as HTMLScriptElement;
      if (target?.tagName === 'SCRIPT') {
        const src = target.src;
        
        // Check for known analytics domains
        if (src.includes('googletagmanager.com') || src.includes('google-analytics.com')) {
          this.handleBlockedService('Google Analytics', src);
        } else if (src.includes('connect.facebook.net')) {
          this.handleBlockedService('Facebook Pixel', src);
        } else if (src.includes('snap.licdn.com') || src.includes('px.ads.linkedin.com')) {
          this.handleBlockedService('LinkedIn Insight', src);
        }
      }
    }, true);

    // Catch network request errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        return await originalFetch(...args);
      } catch (error) {
        const url = args[0]?.toString() || '';
        
        if (url.includes('google-analytics.com') || url.includes('googletagmanager.com')) {
          this.handleBlockedService('Google Analytics API', url);
        } else if (url.includes('facebook.com/tr')) {
          this.handleBlockedService('Facebook Pixel API', url);
        } else if (url.includes('px.ads.linkedin.com')) {
          this.handleBlockedService('LinkedIn Insight API', url);
        }
        
        throw error;
      }
    };
  }

  private handleBlockedService(serviceName: string, url: string) {
    if (!this.blockedServices.has(serviceName)) {
      this.blockedServices.add(serviceName);
      
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.info(`📊 ${serviceName} is blocked by privacy settings or ad blocker. This is normal and doesn't affect app functionality.`);
      }
      
      // Track internally for analytics (without external services)
      this.trackBlockedService(serviceName);
    }
  }

  private trackBlockedService(serviceName: string) {
    // Store blocked services for internal analytics
    const blocked = JSON.parse(localStorage.getItem('blocked_analytics') || '[]');
    if (!blocked.includes(serviceName)) {
      blocked.push(serviceName);
      localStorage.setItem('blocked_analytics', JSON.stringify(blocked));
    }
  }

  // Queue processor to batch analytics calls
  private startQueueProcessor() {
    setInterval(() => {
      if (!this.processingQueue && this.eventQueue.length > 0) {
        this.processEventQueue();
      }
    }, 1000); // Process queue every second
  }

  private async processEventQueue() {
    if (this.processingQueue || this.eventQueue.length === 0) return;
    
    this.processingQueue = true;
    const eventsToProcess = this.eventQueue.splice(0, 5); // Process max 5 events at once
    
    for (const { eventName, properties } of eventsToProcess) {
      await this.sendEvent(eventName, properties);
    }
    
    this.processingQueue = false;
  }

  // Safe analytics methods that handle blocking gracefully
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    // Add to queue instead of immediate processing
    this.eventQueue.push({ eventName, properties });
    
    // Always store events locally as backup
    this.storeEventLocally(eventName, properties);
  }

  private async sendEvent(eventName: string, properties: Record<string, any>) {
    // Try Google Analytics
    if (this.config.googleAnalytics?.enabled && !this.blockedServices.has('Google Analytics')) {
      try {
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', eventName, properties);
        }
      } catch (error) {
        this.handleBlockedService('Google Analytics', 'gtag function');
      }
    }

    // Try Facebook Pixel with throttling
    if (this.config.facebookPixel?.enabled && !this.blockedServices.has('Facebook Pixel')) {
      try {
        if (typeof (window as any).fbq === 'function') {
          // Add small delay to prevent performance issues
          setTimeout(() => {
            (window as any).fbq('track', eventName, properties);
          }, 10);
        }
      } catch (error) {
        this.handleBlockedService('Facebook Pixel', 'fbq function');
      }
    }
  }

  private storeEventLocally(eventName: string, properties: Record<string, any>) {
    const events = JSON.parse(localStorage.getItem('local_analytics') || '[]');
    events.push({
      event: eventName,
      properties,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('local_analytics', JSON.stringify(events));
  }

  // Get analytics summary
  getAnalyticsSummary() {
    return {
      blockedServices: Array.from(this.blockedServices),
      localEvents: JSON.parse(localStorage.getItem('local_analytics') || '[]').length,
      blockedAnalytics: JSON.parse(localStorage.getItem('blocked_analytics') || '[]')
    };
  }
}

// Initialize graceful analytics - optimized for public pages
export const gracefulAnalytics = new GracefulAnalytics({
  googleAnalytics: { enabled: false }, // Disabled on public pages for performance
  facebookPixel: { enabled: false },   // Disabled to avoid preload warnings
  linkedInInsight: { enabled: false }  // Disabled on public pages for performance
});

// Export for use in components
export default gracefulAnalytics;
