'use client';

import { useEffect } from 'react';

/**
 * FontOptimizer component to handle font loading optimization
 * Reduces FOUT (Flash of Unstyled Text) and improves perceived performance
 */
export default function FontOptimizer() {
  useEffect(() => {
    // Check if fonts are already loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Add class when fonts are fully loaded
        document.documentElement.classList.add('fonts-loaded');
        
        // Remove font loading class
        document.documentElement.classList.remove('fonts-loading');
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('fontsloaded'));
      });
    }

    // Preload critical font subsets
    const preloadCriticalFonts = () => {
      // Get Geist Sans font files from CSS
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      
      // This would be the actual font URL from Google Fonts for Geist Sans
      // In practice, Next.js handles this automatically, but we can optimize further
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]');
            stylesheets.forEach((stylesheet) => {
              if (stylesheet instanceof HTMLLinkElement) {
                // Add preload for the stylesheet
                stylesheet.setAttribute('rel', 'preload');
                stylesheet.setAttribute('as', 'style');
                stylesheet.setAttribute('onload', "this.onload=null;this.rel='stylesheet'");
              }
            });
          }
        });
      });

      observer.observe(document.head, { childList: true });
      
      // Cleanup observer after 5 seconds
      setTimeout(() => observer.disconnect(), 5000);
    };

    // Start preloading
    preloadCriticalFonts();

    // Optimize font metrics for Japanese text
    const optimizeJapaneseText = () => {
      const japaneseElements = document.querySelectorAll('[lang="ja"], .text-ja');
      japaneseElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          // Apply Japanese-specific optimizations
          element.style.fontFeatureSettings = '"palt" 1, "pkna" 1';
          // Note: text-spacing is CSS4 and may not be supported in all browsers
          (element.style as any).textSpacing = 'trim-start';
        }
      });
    };

    // Apply optimizations after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeJapaneseText);
    } else {
      optimizeJapaneseText();
    }

    // Set initial font loading state
    document.documentElement.classList.add('fonts-loading');

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizeJapaneseText);
    };
  }, []);

  return null; // This component doesn't render anything
}