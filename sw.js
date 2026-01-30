// ===== Service Worker for PWA & Offline Support =====
// Cache version - increment when updating assets
const CACHE_VERSION = 'hacash-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/images/logo.png',
    '/images/architecture-diagram.png',
    '/images/pow-coins-system.png',
    '/images/three-layers-system.png'
];

// ===== Install Event =====
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// ===== Activate Event =====
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => !name.startsWith(CACHE_VERSION))
                    .map(name => {
                        console.log('Service Worker: Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// ===== Fetch Event - Smart Caching Strategy =====
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // API calls - Network First, fallback to cache
    if (url.hostname === 'api.coingecko.com') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // Clone and cache successful responses
                    if (response.ok) {
                        const cloned = response.clone();
                        caches.open(API_CACHE).then(cache => cache.put(request, cloned));
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache on network error
                    return caches.match(request)
                        .then(cached => cached || new Response(
                            JSON.stringify({ hacash: { usd: 0.2904 } }),
                            { headers: { 'Content-Type': 'application/json' } }
                        ));
                })
        );
        return;
    }
    
    // Static assets - Cache First, fallback to network
    if (request.destination === 'style' || 
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font') {
        event.respondWith(
            caches.match(request)
                .then(cached => cached || fetch(request)
                    .then(response => {
                        if (response.ok) {
                            caches.open(STATIC_CACHE).then(cache => cache.put(request, response.clone()));
                        }
                        return response;
                    })
                )
                .catch(() => {
                    // Fallback for missing resources
                    if (request.destination === 'image') {
                        return new Response('<svg></svg>', { headers: { 'Content-Type': 'image/svg+xml' } });
                    }
                    return new Response('Resource not available offline', { status: 503 });
                })
        );
        return;
    }
    
    // HTML documents - Network First, fallback to cache
    if (request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response.clone()));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then(cached => cached || caches.match('/index.html'));
                })
        );
        return;
    }
    
    // Default - Network first
    event.respondWith(
        fetch(request)
            .then(response => {
                if (response.ok) {
                    caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response.clone()));
                }
                return response;
            })
            .catch(() => caches.match(request))
    );
});

// ===== Message Event for Cache Updates =====
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
