'use client'

import { useEffect, useState } from 'react'
import { Bell, Wifi, WifiOff, Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function ServiceWorkerRegister() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [serviceWorkerRegistered, setServiceWorkerRegistered] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)

    // Only proceed if we're in the browser
    if (typeof window === 'undefined') return

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration)
          setServiceWorkerRegistered(true)

          // Handle updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, notify user
                  showUpdateNotification()
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check initial online status
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Check notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const showUpdateNotification = () => {
    // Create a custom update notification
    const updateBanner = document.createElement('div')
    updateBanner.className = 'fixed top-0 left-0 right-0 bg-joe-gold text-joe-black p-4 z-50 shadow-lg'
    updateBanner.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          <span class="font-joe-accent font-medium">New version available!</span>
        </div>
        <div class="flex space-x-2">
          <button id="update-dismiss" class="px-3 py-1 bg-joe-stone text-joe-white rounded hover:bg-joe-stone/80 transition-colors">
            Dismiss
          </button>
          <button id="update-refresh" class="px-3 py-1 bg-joe-black text-joe-gold rounded hover:bg-joe-black/80 transition-colors">
            Update Now
          </button>
        </div>
      </div>
    `

    document.body.appendChild(updateBanner)

    // Handle update actions
    document.getElementById('update-dismiss')?.addEventListener('click', () => {
      document.body.removeChild(updateBanner)
    })

    document.getElementById('update-refresh')?.addEventListener('click', () => {
      window.location.reload()
    })

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(updateBanner)) {
        document.body.removeChild(updateBanner)
      }
    }, 10000)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setIsInstallable(false)
      }

      setDeferredPrompt(null)
    } catch (error) {
      console.error('Install prompt failed:', error)
    }
  }

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationsEnabled(permission === 'granted')

      if (permission === 'granted') {
        // Register for push notifications
        await registerForPushNotifications()
      }
    } catch (error) {
      console.error('Notification permission request failed:', error)
    }
  }

  const registerForPushNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const response = await fetch('/api/push-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
          })
        })
      })

      if (response.ok) {
        console.log('Push notification subscription successful')
      }
    } catch (error) {
      console.error('Push notification registration failed:', error)
    }
  }

  const sendTestNotification = () => {
    if (notificationsEnabled && 'Notification' in window) {
      new Notification('Uncle Joes Golf', {
        body: 'Test notification - PWA features are working!',
        icon: '/UnkJoeLogo.png',
        badge: '/UnkJoeLogo.png'
      })
    }
  }

  // Don't render anything during SSR or if PWA features aren't supported
  if (!isClient || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 space-y-2">
      {/* Online/Offline Status */}
      <div className={`flex items-center px-3 py-2 rounded-lg shadow-lg transition-colors ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white'
      }`}>
        {isOnline ? (
          <Wifi className="h-4 w-4 mr-2" />
        ) : (
          <WifiOff className="h-4 w-4 mr-2" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* PWA Install Button */}
      {isInstallable && (
        <button
          onClick={handleInstall}
          className="flex items-center px-3 py-2 bg-joe-gold text-joe-black rounded-lg shadow-lg hover:bg-joe-gold/90 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Install App</span>
        </button>
      )}

      {/* Notification Button */}
      {'Notification' in window && (
        <button
          onClick={notificationsEnabled ? sendTestNotification : requestNotificationPermission}
          className={`flex items-center px-3 py-2 rounded-lg shadow-lg transition-colors ${
            notificationsEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-joe-stone text-joe-white hover:bg-joe-stone/80'
          }`}
        >
          <Bell className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            {notificationsEnabled ? 'Test Notification' : 'Enable Notifications'}
          </span>
        </button>
      )}

      {/* Service Worker Status */}
      {serviceWorkerRegistered && (
        <div className="flex items-center px-3 py-2 bg-joe-stone/50 text-joe-white rounded-lg shadow-lg backdrop-blur-sm">
          <div className="h-2 w-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-sm font-medium">PWA Ready</span>
        </div>
      )}
    </div>
  )
}