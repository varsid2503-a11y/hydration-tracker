self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('water-tracker-v1').then((cache) => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './splash.mp3',
        './icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});