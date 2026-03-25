const cacheName = 'hydratepro-v2';
const appBase = self.location.pathname.replace(/\/[^/]*$/, '/');
const assets = [
  appBase,
  `${appBase}index.html`,
  `${appBase}style.css`,
  `${appBase}script.js`,
  `${appBase}icon.png`,
  `${appBase}manifest.json`,
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== cacheName)
        .map(key => caches.delete(key))
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
