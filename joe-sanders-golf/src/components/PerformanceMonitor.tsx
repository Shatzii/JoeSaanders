'use client'

import { useEffect } from 'react'
import Image from 'next/image'

// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Page load performance tracking
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'page_load_performance', {
            page_load_time: pageLoadTime,
            dom_content_loaded: domContentLoaded,
            page_location: window.location.href
          })
        }

        console.log('Page load performance:', {
          loadTime: pageLoadTime,
          domContentLoaded: domContentLoaded
        })
      }
    }

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      trackPageLoad()
    } else {
      window.addEventListener('load', trackPageLoad)
    }

    // Simple Core Web Vitals tracking using native APIs
    const trackWebVitals = () => {
      // Track LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(lastEntry.startTime)
            })
          }
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP tracking not supported')
      }

      // Track CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(clsValue * 1000)
            })
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS tracking not supported')
      }
    }

    trackWebVitals()

    return () => {
      window.removeEventListener('load', trackPageLoad)
    }
  }, [])
}

// Bundle analyzer component (development only)
export function BundleAnalyzer() {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle analyzer ready for development')
    }
  }, [])

  return null
}

// Optimized Image component using Next.js Image
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  ...props
}: {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
  [key: string]: any
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      priority={priority}
      className={className}
      {...props}
    />
  )
}

// Performance monitoring component
export default function PerformanceMonitor() {
  usePerformanceMonitoring()

  return null
}
