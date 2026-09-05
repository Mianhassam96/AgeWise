'use strict';
/* ═══════════════════════════════════════════════
   WaqtX V3 — Service Worker
   Cache: waqtx-v23
   ═══════════════════════════════════════════════ */
var CACHE = 'waqtx-v23';
var ASSETS = [
  './',
  './index.html',
  './explore.html',
  './search.html',
  './prayers.html',
  './journey.html',
  './reflection.html',
  './calendar.html',
  './profile.html',
  './settings.html',
  './qibla.html',
  './stories.html',
  './privacy.html',
  './style.css',
  './style-pages.css',
  './app.js',
  './js/core.js',
  './js/home.js',
  './js/explore.js',
  './js/search.js',
  './js/history-data.js',
  './js/prayers.js',
  './js/journey.js',
  './js/reflection.js',
  './js/calendar.js',
  './js/profile.js',
  './js/settings.js',
  './daily-islam.js',
  './stories-data.js',
  './stories.js',
  './manifest.json',
  './favicon.svg',
  './favicon-32.svg',
  './og-image.svg',
  './lang/en.json',
  './lang/ur.json',
  './lang/ar.json',
  './lang/roman.json'
];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    }).catch(function(err) {
      console.warn('WaqtX SW: cache addAll partial failure', err);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  /* Only handle GET requests for same-origin or CDN assets */
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);

  /* For API requests (prayer times), go network-first */
  if (url.hostname === 'api.aladhan.com' || url.hostname === 'cdn.islamic.network') {
    e.respondWith(
      fetch(e.request).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }

  /* For app assets: cache-first, fallback to network */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        /* Cache successful responses for our own assets */
        if (response && response.status === 200 &&
            (url.hostname === self.location.hostname || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com')) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        }
        return response;
      }).catch(function() {
        /* Offline fallback */
        return caches.match('./index.html');
      });
    })
  );
});
