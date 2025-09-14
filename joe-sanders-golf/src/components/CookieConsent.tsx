'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const acceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    }
    setPreferences(allPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(allPreferences))
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false
    }
    setPreferences(necessaryOnly)
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly))
    setShowBanner(false)
  }

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-joe-black border-t border-joe-gold/20 p-4 z-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-joe-gold mb-2">Cookie Preferences</h3>
            <p className="text-sm text-joe-white/80 mb-4">
              We use cookies to enhance your experience, analyze site traffic, and personalize content.
              You can choose which cookies to accept below.
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.necessary}
                  disabled
                  className="rounded border-joe-gold/30"
                />
                <label className="text-joe-white/90">Necessary Cookies (Required)</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                  className="rounded border-joe-gold/30"
                />
                <label className="text-joe-white/90">Analytics Cookies</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                  className="rounded border-joe-gold/30"
                />
                <label className="text-joe-white/90">Marketing Cookies</label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={acceptNecessary}
              className="px-4 py-2 bg-joe-white/10 hover:bg-joe-white/20 text-joe-white rounded border border-joe-gold/30 transition-colors"
            >
              Accept Necessary Only
            </button>
            <button
              onClick={savePreferences}
              className="px-4 py-2 bg-joe-gold/20 hover:bg-joe-gold/30 text-joe-gold rounded border border-joe-gold/50 transition-colors"
            >
              Save Preferences
            </button>
            <button
              onClick={acceptAll}
              className="px-4 py-2 bg-joe-gold hover:bg-joe-gold/80 text-joe-black rounded font-semibold transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}