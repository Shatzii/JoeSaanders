// Enhanced service worker for Phone-as-Putter offline support
const CACHE_VERSION = 'v1.2.0'
const STATIC_CACHE = `static-${CACHE_VERSION}`
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`
const CONTROLLER_CACHE = `controller-${CACHE_VERSION}`

// Critical assets for offline controller functionality
const STATIC_ASSETS = [
    '/',
    '/controller',
    '/game',
    '/manifest.json',
    '/images/UnkJoeLogo.png',
]

// Install event - cache critical assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...', CACHE_VERSION)
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets')
            return cache.addAll(STATIC_ASSETS)
        }).then(() => {
            return self.skipWaiting()
        })
    )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...', CACHE_VERSION)
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                .filter((name) => name.startsWith('static-') || name.startsWith('dynamic-') || name.startsWith('controller-'))
                .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== CONTROLLER_CACHE)
                .map((name) => {
                    console.log('[SW] Deleting old cache:', name)
                    return caches.delete(name)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})
return caches.delete(cacheName)
}
})
)
}).then(() => {
return self.clients.claim()
})
)
})

// Fetch event - network first for API, cache first for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // API routes - network only (real-time data required)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request).catch(() => {
                return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 503
                })
            })
        )
        return
    }

    // Controller page - cache first for offline support
    if (url.pathname === '/controller' || url.pathname.startsWith('/controller/')) {
        event.respondWith(
            caches.open(CONTROLLER_CACHE).then((cache) => {
                return cache.match(request).then((cached) => {
                    const fetchPromise = fetch(request).then((response) => {
                        if (response.ok) {
                            cache.put(request, response.clone())
                        }
                        return response
                    })
                    return cached || fetchPromise
                })
            })
        )
        return
    }

    // Static assets - cache first
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/images/') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.png')
    ) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached
                return fetch(request).then((response) => {
                    if (response.ok) {
                        caches.open(STATIC_CACHE).then((cache) => {
                            cache.put(request, response.clone())
                        })
                    }
                    return response
                })
            })
        )
        return
    }

    // Everything else - network first with cache fallback
    event.respondWith(
        fetch(request)
        .then((response) => {
            if (response.ok) {
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, response.clone())
                })
            }
            return response
        })
        .catch(() => caches.match(request))
    )
})

// Message event - handle skip waiting
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

// Push event - handle push notifications
self.addEventListener('push', (event) => {
    console.log('[SW] Push received', event)

    let data = {}
    if (event.data) {
        data = event.data.json()
    }

    const options = {
        body: data.body || 'New update from Uncle Joes Golf!',
        icon: '/images/UnkJoeLogo.png',
        badge: '/images/UnkJoeLogo.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [{
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