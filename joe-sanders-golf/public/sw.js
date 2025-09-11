// Service Worker for Uncle Joes Golf PWA
const CACHE_NAME = 'uncle-joes-golf-v1'
const STATIC_CACHE_NAME = 'uncle-joes-golf-static-v1'
const DYNAMIC_CACHE_NAME = 'uncle-joes-golf-dynamic-v1'

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/journey',
  '/shop',
  '/fan-club',
  '/contact',
  '/sponsorship',
  '/admin',
  '/manifest.json',
  '/UnkJoeLogo.png',
  '/favicon.ico'
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/tournaments',
  '/api/sponsors',
  '/api/merch'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => {
            // Return cached version if available
            return cache.match(request)
          })
      })
    )
    return
  }

  // Handle static assets and pages
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Cache the response
            const responseToCache = response.clone()
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })

            return response
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/')
            }
          })
      })
  )
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event)

  let data = {}
  if (event.data) {
    data = event.data.json()
  }

  const options = {
    body: data.body || 'New update from Uncle Joes Golf!',
    icon: '/UnkJoeLogo.png',
    badge: '/UnkJoeLogo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/UnkJoeLogo.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/UnkJoeLogo.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Uncle Joes Golf',
      options
    )
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click received', event)

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event)

  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  try {
    // Implement background sync logic here
    // This could sync offline actions like newsletter subscriptions, contact forms, etc.
    console.log('Service Worker: Performing background sync')
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  console.log('Service Worker: Periodic sync', event)

  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent())
  }
})

async function updateContent() {
  try {
    // Update cached content periodically
    console.log('Service Worker: Updating content')

    const cache = await caches.open(DYNAMIC_CACHE_NAME)

    // Update API data
    for (const endpoint of API_ENDPOINTS) {
      try {
        const response = await fetch(endpoint)
        if (response.ok) {
          await cache.put(endpoint, response)
        }
      } catch (error) {
        console.error(`Failed to update ${endpoint}:`, error)
      }
    }
  } catch (error) {
    console.error('Service Worker: Content update failed', error)
  }
}

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: '1.0.0' })
  }
})