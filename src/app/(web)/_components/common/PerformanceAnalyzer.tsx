'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  fid: number;
  ttfb: number;
  fontLoadTime: number;
}

/**
 * PerformanceAnalyzer component to measure Core Web Vitals and font loading performance
 * Provides real-time performance monitoring for optimization validation
 */
export default function PerformanceAnalyzer() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show performance metrics in development mode only
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    let lcpObserver: PerformanceObserver;
    let clsObserver: PerformanceObserver;
    let fidObserver: PerformanceObserver;

    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const ttfb = navigation.responseStart - navigation.requestStart;

      // Measure font loading time
      let fontLoadTime = 0;
      if (document.fonts) {
        const fontLoadStart = performance.now();
        document.fonts.ready.then(() => {
          fontLoadTime = performance.now() - fontLoadStart;
          updateMetrics({ fcp, ttfb, fontLoadTime });
        });
      } else {
        updateMetrics({ fcp, ttfb, fontLoadTime });
      }
    };

    const updateMetrics = (baseMetrics: Partial<PerformanceMetrics>) => {
      setMetrics(prev => ({
        fcp: baseMetrics.fcp || prev?.fcp || 0,
        lcp: prev?.lcp || 0,
        cls: prev?.cls || 0,
        fid: prev?.fid || 0,
        ttfb: baseMetrics.ttfb || prev?.ttfb || 0,
        fontLoadTime: baseMetrics.fontLoadTime || prev?.fontLoadTime || 0,
      }));
    };

    // Observe LCP
    if (typeof PerformanceObserver !== 'undefined') {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        updateMetrics({ lcp: lastEntry.startTime });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe CLS
      clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        updateMetrics({ cls: clsValue });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Observe FID
      fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          updateMetrics({ fid: (entry as any).processingStart - entry.startTime });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // Initial measurement
    measurePerformance();

    return () => {
      lcpObserver?.disconnect();
      clsObserver?.disconnect();
      fidObserver?.disconnect();
    };
  }, []);

  if (!isVisible || !metrics) return null;

  const getStatusColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.poor) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 text-xs font-mono z-50 max-w-sm">
      <h3 className="font-bold mb-2 text-gray-800">Performance Metrics</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getStatusColor(metrics.fcp, { good: 1800, poor: 3000 })}>
            {metrics.fcp.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getStatusColor(metrics.lcp, { good: 2500, poor: 4000 })}>
            {metrics.lcp.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getStatusColor(metrics.cls, { good: 0.1, poor: 0.25 })}>
            {metrics.cls.toFixed(3)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span className={getStatusColor(metrics.fid, { good: 100, poor: 300 })}>
            {metrics.fid.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getStatusColor(metrics.ttfb, { good: 800, poor: 1800 })}>
            {metrics.ttfb.toFixed(0)}ms
          </span>
        </div>
        <div className="flex justify-between">
          <span>Font Load:</span>
          <span className={getStatusColor(metrics.fontLoadTime, { good: 100, poor: 500 })}>
            {metrics.fontLoadTime.toFixed(0)}ms
          </span>
        </div>
      </div>
      <div className="mt-2 text-gray-500">
        <div className="text-green-600">• Good</div>
        <div className="text-yellow-600">• Needs Improvement</div>
        <div className="text-red-600">• Poor</div>
      </div>
    </div>
  );
}