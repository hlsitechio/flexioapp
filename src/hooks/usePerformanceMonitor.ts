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
  const trackMetric = useCallback((metric: PerformanceMetrics) => {
    // Send to analytics service (implement based on your needs)
    console.log('Performance Metric:', metric);
    
    // Store in localStorage for development debugging
    if (process.env.NODE_ENV === 'development') {
      const stored = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
      stored.push({ ...metric, timestamp: Date.now() });
      localStorage.setItem('performance-metrics', JSON.stringify(stored.slice(-50))); // Keep last 50
    }
  }, []);

  const measureCoreWebVitals = useCallback(() => {
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
      console.warn('Performance Observer not fully supported:', e);
    }

    return () => observer.disconnect();
  }, [trackMetric]);

  const measureResourceLoading = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resource = entry as PerformanceResourceTiming;
        
        // Track slow resources
        const loadTime = resource.responseEnd - resource.requestStart;
        if (loadTime > 1000) { // Resources taking more than 1s
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
      console.warn('Resource timing not supported:', e);
    }

    return () => observer.disconnect();
  }, []);

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