// ElewacjaPro Service Worker v5.0
// Bez folderów icons/ — ikony są inline w manifest.json (data URI)
const CACHE = 'elewacja-v5';
const FONTS = 'elewacja-fonts-v5';

// Tylko pliki w katalogu głównym
const CORE = [
  './',
  './index.html',
  './manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(
        CORE.map(url => c.add(url).catch(err => console.warn('SW: pominieto', url, err)))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname === 'api.anthropic.com') return;

  if (url.hostname.includes('fonts.') || url.hostname.includes('cdnjs.') || url.hostname.includes('gstatic.')) {
    e.respondWith(
      caches.open(FONTS).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res && res.status === 200) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => {
        if (e.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
