import { config } from '../../../config';

// Performance monitoring
class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load performance
  trackPageLoad(pageName: string) {
    if (!config.features.enablePerformanceMetrics) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      this.metrics.set(`pageLoad_${pageName}`, loadTime);
      
      // Silent performance tracking
    }
  }

  // Track custom timing
  trackTiming(name: string, startTime: number) {
    if (!config.features.enablePerformanceMetrics) return;

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.metrics.set(name, duration);
    
    console.log(`${name}: ${duration}ms`);
  }

  // Track API response times
  trackApiCall(endpoint: string, duration: number, status: number) {
    if (!config.features.enablePerformanceMetrics) return;

    this.metrics.set(`api_${endpoint}`, duration);
    
    if (config.logging.level === 'debug') {
      console.log(`API Call ${endpoint}: ${duration}ms (Status: ${status})`);
    }
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

// Error tracking
class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Array<{ message: string; stack?: string; timestamp: Date }> = [];

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  // Track JavaScript errors
  trackError(error: Error, context?: string) {
    if (!config.monitoring.enableErrorReporting) return;

    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
      context,
    };

    this.errors.push(errorData);

    // Log to console in development
    if (config.logging.enableConsole) {
      console.error('Error tracked:', errorData);
    }

    // In production, this would send to error monitoring service
    if (config.monitoring.enableSentry) {
      this.sendToSentry(errorData);
    }
  }

  // Track API errors
  trackApiError(endpoint: string, status: number, message: string) {
    const error = new Error(`API Error: ${status} - ${message}`);
    this.trackError(error, `API: ${endpoint}`);
  }

  // Send to Sentry (placeholder)
  private sendToSentry(errorData: any) {
    // Implementation would use @sentry/nextjs
    console.log('Would send to Sentry:', errorData);
  }

  // Get error history
  getErrors(): Array<{ message: string; stack?: string; timestamp: Date }> {
    return this.errors;
  }
}

// Initialize global error tracking
export const initializeMonitoring = () => {
  const errorTracker = ErrorTracker.getInstance();
  const performanceMonitor = PerformanceMonitor.getInstance();

  // Global error handler
  window.addEventListener('error', (event) => {
    errorTracker.trackError(new Error(event.message), 'Global Error Handler');
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(new Error(event.reason), 'Unhandled Promise Rejection');
  });

  // Track initial page load
  if (document.readyState === 'complete') {
    performanceMonitor.trackPageLoad('initial');
  } else {
    window.addEventListener('load', () => {
      performanceMonitor.trackPageLoad('initial');
    });
  }

  return { errorTracker, performanceMonitor };
};

export { PerformanceMonitor, ErrorTracker };