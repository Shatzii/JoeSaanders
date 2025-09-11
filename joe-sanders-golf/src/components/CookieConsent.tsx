'use client'

import { useState, useEffect } from 'react'
import { X, Settings, Shield, Cookie } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      // Apply saved preferences
      applyCookiePreferences(savedPreferences)
    }
  }, [])

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }

    // Marketing cookies
    if (prefs.marketing && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted'
      })
    } else if (window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied'
      })
    }

    // Functional cookies
    if (prefs.functional) {
      localStorage.setItem('functional-cookies', 'true')
    }
  }

  const acceptAllCookies = () => {
    const allPreferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    setPreferences(allPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(allPreferences))
    applyCookiePreferences(allPreferences)
    setShowBanner(false)
  }

  const acceptNecessaryOnly = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    setPreferences(necessaryOnly)
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly))
    applyCookiePreferences(necessaryOnly)
    setShowBanner(false)
  }

  const saveSettings = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    applyCookiePreferences(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-joe-black border-t border-joe-gold/20 p-4 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="h-6 w-6 text-joe-gold mt-1 flex-shrink-0" />
              <div className="text-sm text-joe-white">
                <p className="font-semibold mb-2 text-joe-gold">We value your privacy</p>
                <p className="text-joe-stone leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize content.
                  You can manage your preferences or accept all cookies.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm font-medium text-joe-gold border border-joe-gold/30 rounded-md hover:bg-joe-gold/10 transition-colors"
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Manage Preferences
              </button>
              <button
                onClick={acceptNecessaryOnly}
                className="px-4 py-2 text-sm font-medium text-joe-stone border border-joe-stone/30 rounded-md hover:bg-joe-stone/10 transition-colors"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAllCookies}
                className="px-4 py-2 text-sm font-medium bg-joe-gold text-joe-black rounded-md hover:bg-joe-gold/90 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-joe-black border border-joe-gold/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-joe-gold flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Cookie Preferences
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-joe-stone hover:text-joe-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-joe-gold/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-joe-gold">Necessary Cookies</h3>
                    <span className="text-xs bg-joe-gold/20 text-joe-gold px-2 py-1 rounded">Always Active</span>
                  </div>
                  <p className="text-sm text-joe-stone">
                    These cookies are essential for the website to function properly. They cannot be disabled.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-joe-stone/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-joe-gold bg-joe-black border-joe-stone rounded focus:ring-joe-gold"
                      />
                      <h3 className="font-semibold text-joe-white">Analytics Cookies</h3>
                    </label>
                  </div>
                  <p className="text-sm text-joe-stone">
                    Help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-joe-stone/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-joe-gold bg-joe-black border-joe-stone rounded focus:ring-joe-gold"
                      />
                      <h3 className="font-semibold text-joe-white">Marketing Cookies</h3>
                    </label>
                  </div>
                  <p className="text-sm text-joe-stone">
                    Used to track visitors across websites to display relevant advertisements.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-joe-stone/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-joe-gold bg-joe-black border-joe-stone rounded focus:ring-joe-gold"
                      />
                      <h3 className="font-semibold text-joe-white">Functional Cookies</h3>
                    </label>
                  </div>
                  <p className="text-sm text-joe-stone">
                    Enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-joe-stone/20">
                <button
                  onClick={acceptNecessaryOnly}
                  className="flex-1 px-4 py-2 text-sm font-medium text-joe-stone border border-joe-stone/30 rounded-md hover:bg-joe-stone/10 transition-colors"
                >
                  Accept Necessary Only
                </button>
                <button
                  onClick={saveSettings}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-joe-gold text-joe-black rounded-md hover:bg-joe-gold/90 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
