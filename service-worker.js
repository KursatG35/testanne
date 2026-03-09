'use strict';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/script.js',
                '/images/icon.png'
            ]);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('push', event => {
    const title = event.data ? event.data.text() : 'Default title';
    const options = {
        body: 'Notification body text.',
        icon: '/images/icon.png',
        badge: '/images/badge.png',
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('sync', event => {
    if (event.tag == 'sync-new-content') {
        event.waitUntil(
            fetch('/api/sync').then(response => {
                // Handle the response
            }).catch(err => {
                console.error('Sync failed', err);
            })
        );
    }
});
