import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  landingPageLoadTime?: number; // Custom metric for landing page
  [key: string]: number | undefined; // Allow custom metrics
}

interface PerformanceEntry extends globalThis.PerformanceEntry {
  loadTime?: number;
  renderTime?: number;
  size?: number;
  element?: Element;
  hadRecentInput?: boolean;
  value?: number;
  delta?: number;
  processingStart?: number;
  requestStart?: number;
  responseStart?: number;
  responseEnd?: number;
  transferSize?: number;
}

export function usePerformanceMonitor() {
  // Only enable detailed monitoring in development or when explicitly enabled
  const isEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
  
  const trackMetric = useCallback((metric: PerformanceMetrics) => {
    if (!isEnabled) return;
    
    // Don't log performance metrics in production public pages
    const isPublicPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/landing');
    if (isPublicPage && import.meta.env.PROD) return;
    
    // Only log in development to avoid console noise in production
    if (import.meta.env.DEV) {
      console.log('Performance Metric:', metric);
    }
    
    // Store in localStorage for development debugging only
    if (import.meta.env.DEV) {
      const stored = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
      stored.push({ ...metric, timestamp: Date.now() });
      localStorage.setItem('performance-metrics', JSON.stringify(stored.slice(-50))); // Keep last 50
    }
  }, [isEnabled]);

  const measureCoreWebVitals = useCallback(() => {
    if (!isEnabled) return () => {}; // Return empty cleanup function
    
    // Measure FCP (First Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const perfEntry = entry as PerformanceEntry;
        
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              trackMetric({ fcp: entry.startTime });
            }
            break;
            
          case 'largest-contentful-paint':
            trackMetric({ lcp: perfEntry.startTime });
            break;
            
          case 'first-input':
            trackMetric({ fid: perfEntry.processingStart - perfEntry.startTime });
            break;
            
          case 'layout-shift':
            if (!perfEntry.hadRecentInput) {
              trackMetric({ cls: perfEntry.value });
            }
            break;
            
          case 'navigation':
            const navEntry = perfEntry as PerformanceNavigationTiming;
            trackMetric({ ttfb: navEntry.responseStart - navEntry.requestStart });
            break;
        }
      }
    });

    // Observe all performance entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Performance Observer not fully supported:', e);
      }
    }

    return () => observer.disconnect();
  }, [trackMetric, isEnabled]);

  const measureResourceLoading = useCallback(() => {
    if (!isEnabled) return () => {}; // Return empty cleanup function
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Don't track slow resources on production public pages to reduce console noise
        const isPublicPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/landing');
        const loadTime = resource.responseEnd - resource.requestStart;
        
        if (loadTime > 1000 && import.meta.env.DEV && !(isPublicPage && import.meta.env.PROD)) {
          console.warn('Slow resource:', {
            name: resource.name,
            loadTime,
            size: resource.transferSize
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      if (import.meta.env.DEV) {
        console.warn('Resource timing not supported:', e);
      }
    }

    return () => observer.disconnect();
  }, [isEnabled]);

  useEffect(() => {
    const cleanupVitals = measureCoreWebVitals();
    const cleanupResources = measureResourceLoading();

    return () => {
      cleanupVitals();
      cleanupResources();
    };
  }, [measureCoreWebVitals, measureResourceLoading]);

  return {
    trackMetric,
    getMetrics: () => {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('performance-metrics') || '[]');
      }
      return [];
    }
  };
}

// Utility to mark performance points
export function markPerformance(name: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(name);
  }
}

// Utility to measure between marks
export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
    } catch (e) {
      console.warn('Performance measurement failed:', e);
    }
  }
}