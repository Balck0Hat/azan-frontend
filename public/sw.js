// Service Worker for Azan App - Push Notifications & Offline Support

const CACHE_NAME = 'azan-cache-v3';
const OFFLINE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/logo512.png'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching offline pages');
            return cache.addAll(OFFLINE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches and take control
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Don't cache API responses
    if (event.request.url.includes('/api/')) return;

    // Navigation requests (HTML) — always network-first
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // Static assets — cache-first (filenames have hashes)
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            });
        }).catch(() => {
            if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
            }
        })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};

    const options = {
        body: data.body || 'حان وقت الصلاة',
        icon: '/logo192.png',
        badge: '/logo192.png',
        vibrate: [200, 100, 200],
        tag: data.tag || 'prayer-notification',
        renotify: true,
        requireInteraction: true,
        dir: 'rtl',
        lang: 'ar',
        data: {
            url: data.url || '/',
            prayer: data.prayer
        },
        actions: [
            { action: 'open', title: 'فتح التطبيق' },
            { action: 'close', title: 'إغلاق' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'أذان', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url || '/');
            }
        })
    );
});

// Background sync for offline prayer tracking
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-prayer-tracking') {
        event.waitUntil(syncPrayerTracking());
    }
});

async function syncPrayerTracking() {
    // Get pending prayer tracking data from IndexedDB and sync
    console.log('Syncing prayer tracking data...');
}
