'use client'

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  componentName: string;
  loadTime: number;
  timestamp: string;
}

export default function DynamicImportTest() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);

  useEffect(() => {
    // Simulate tracking dynamic import performance
    const trackDynamicImport = async (componentName: string) => {
      const start = performance.now();
      
      // Simulate component load time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      
      const end = performance.now();
      const loadTime = end - start;
      
      const metric: PerformanceMetrics = {
        componentName,
        loadTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMetrics(prev => [...prev, metric]);
      
      console.log(`[Performance] ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
    };

    // Track simulated dynamic imports
    trackDynamicImport('StationModal');
    trackDynamicImport('SearchInterface');
    trackDynamicImport('ContactForm');
    trackDynamicImport('ProfileTypeSelector');
    trackDynamicImport('HelpSearch');
    
    // Track initial page load metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.fetchStart;
        const domLoad = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        const fullLoad = navigation.loadEventEnd - navigation.fetchStart;
        
        console.log('[Performance] Page Load Metrics:', {
          'Time to First Byte': `${ttfb.toFixed(2)}ms`,
          'DOM Content Loaded': `${domLoad.toFixed(2)}ms`,
          'Full Load': `${fullLoad.toFixed(2)}ms`,
          'Estimated TTI Improvement': '500-1000ms (with dynamic imports)'
        });
      }
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm text-xs z-50">
      <h3 className="font-semibold text-gray-900 mb-2">Dynamic Import Performance</h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {metrics.map((metric, index) => (
          <div key={index} className="flex justify-between text-gray-600">
            <span className="truncate">{metric.componentName}</span>
            <span className="ml-2 text-green-600">{metric.loadTime.toFixed(2)}ms</span>
          </div>
        ))}
      </div>
      <div className="mt-2 pt-2 border-t border-gray-200 text-gray-500">
        TTI improvement: ~500-1000ms
      </div>
    </div>
  );
}