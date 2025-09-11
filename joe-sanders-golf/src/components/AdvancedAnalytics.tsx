'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Users, Eye, Clock, MousePointer } from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{ path: string; views: number }>
  trafficSources: Array<{ source: string; percentage: number }>
  realTimeUsers: number
}

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Google Analytics if not already loaded
    if (typeof window !== 'undefined' && !window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'GA_MEASUREMENT_ID'}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function() {
        window.dataLayer!.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_features: false
      })
    }

    // Load analytics data (in a real app, this would come from your analytics API)
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      // Simulate loading analytics data
      // In a real implementation, you would fetch from Google Analytics API or your own analytics service
      const mockData: AnalyticsData = {
        pageViews: 15420,
        uniqueVisitors: 8934,
        averageSessionDuration: 185, // seconds
        bounceRate: 0.34,
        realTimeUsers: 12,
        topPages: [
          { path: '/', views: 5420 },
          { path: '/journey', views: 3210 },
          { path: '/shop', views: 2890 },
          { path: '/fan-club', views: 2150 },
          { path: '/contact', views: 1750 }
        ],
        trafficSources: [
          { source: 'Direct', percentage: 45 },
          { source: 'Organic Search', percentage: 32 },
          { source: 'Social Media', percentage: 15 },
          { source: 'Referral', percentage: 8 }
        ]
      }

      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      })
    }
  }

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle
      })
    }
  }

  const trackConversion = (conversionType: string, value?: number) => {
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_type: conversionType,
        value: value,
        currency: 'USD'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-joe-stone/20 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-joe-stone/20 rounded w-full"></div>
            <div className="h-3 bg-joe-stone/20 rounded w-3/4"></div>
            <div className="h-3 bg-joe-stone/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <p className="text-joe-stone">Analytics data not available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Real-time Users</p>
              <p className="text-2xl font-bold text-joe-gold">{analyticsData.realTimeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Page Views</p>
              <p className="text-2xl font-bold text-joe-gold">{analyticsData.pageViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-joe-gold">{Math.round(analyticsData.averageSessionDuration / 60)}m</p>
            </div>
            <Clock className="h-8 w-8 text-joe-gold" />
          </div>
        </div>

        <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-joe-stone text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold text-joe-gold">{Math.round(analyticsData.bounceRate * 100)}%</p>
            </div>
            <MousePointer className="h-8 w-8 text-joe-gold" />
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Top Pages
        </h3>
        <div className="space-y-3">
          {analyticsData.topPages.map((page, index) => (
            <div key={page.path} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-joe-gold font-bold mr-3">#{index + 1}</span>
                <span className="text-joe-white">{page.path}</span>
              </div>
              <span className="text-joe-stone">{page.views.toLocaleString()} views</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Traffic Sources
        </h3>
        <div className="space-y-3">
          {analyticsData.trafficSources.map((source) => (
            <div key={source.source} className="flex items-center justify-between">
              <span className="text-joe-white">{source.source}</span>
              <div className="flex items-center">
                <div className="w-24 bg-joe-stone/20 rounded-full h-2 mr-3">
                  <div
                    className="bg-joe-gold h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
                <span className="text-joe-stone text-sm">{source.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Actions */}
      <div className="bg-joe-black/50 border border-joe-gold/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-joe-gold mb-4">Analytics Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => trackEvent('newsletter_signup', { source: 'analytics_dashboard' })}
            className="bg-joe-gold text-joe-black px-4 py-2 rounded-md hover:bg-joe-gold/90 transition-colors"
          >
            Track Newsletter Signup
          </button>
          <button
            onClick={() => trackEvent('merchandise_view', { product: 'cap', source: 'analytics_dashboard' })}
            className="bg-joe-gold text-joe-black px-4 py-2 rounded-md hover:bg-joe-gold/90 transition-colors"
          >
            Track Product View
          </button>
          <button
            onClick={() => trackConversion('purchase', 45.99)}
            className="bg-joe-gold text-joe-black px-4 py-2 rounded-md hover:bg-joe-gold/90 transition-colors"
          >
            Track Purchase
          </button>
        </div>
      </div>
    </div>
  )
}

// Analytics utility functions
export const analytics = {
  trackEvent: (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString()
      })
    }
  },
  trackPageView: (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
        page_title: pageTitle
      })
    }
  },
  trackConversion: (conversionType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_type: conversionType,
        value: value,
        currency: 'USD'
      })
    }
  }
}
