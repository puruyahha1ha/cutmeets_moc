'use client'

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Track bundle size and loading metrics for dynamic imports
    const trackComponentLoad = (componentName: string) => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        console.log(`[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
        
        // In production, you would send this to your analytics service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'component_load_time', {
            custom_map: { metric1: 'load_time' },
            metric1: loadTime,
            component_name: componentName
          });
        }
      };
    };

    // Track initial page load metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        const fullLoad = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log('[Performance] Metrics:', {
          'Time to First Byte': `${ttfb.toFixed(2)}ms`,
          'DOM Content Loaded': `${domLoad.toFixed(2)}ms`,
          'Full Load': `${fullLoad.toFixed(2)}ms`
        });
      }

      // Track Core Web Vitals if available
      if ('web-vitals' in window) {
        // This would require installing web-vitals package
        // For now, we'll log when dynamic imports complete
        console.log('[Performance] Dynamic imports are optimized for better TTI');
      }
    }

    // Global performance tracker for dynamic imports
    window.trackComponentLoad = trackComponentLoad;

    return () => {
      delete window.trackComponentLoad;
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    trackComponentLoad?: (componentName: string) => () => void;
    gtag?: (...args: any[]) => void;
  }
}