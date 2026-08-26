// Trade Assist Coach — minimal offline-first service worker (v7)
const CACHE = 'tac-v7';
const CORE = [
  './index.html',
  './icon.svg',
  './manifest.webmanifest',
  './css/styles.css',
  './js/state.js', './js/i18n.js', './js/security.js', './js/ui.js',
  './js/checklist.js', './js/rules.js', './js/dashboard.js', './js/trade-form.js',
  './js/result-modal.js', './js/performance.js', './js/history.js', './js/weekly.js',
  './js/settings-page.js', './js/backup.js', './js/main.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin && (url.pathname.includes('/_baseline/') || url.pathname.includes('/tools/'))) return;

  // Google Fonts: cache-first (opaque responses are fine to reuse)
  if (url.hostname.includes('fonts.g')) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  // Same-origin: network-first for HTML (fresh app shell), cache-first for assets
  const isHTML = req.headers.get('accept') && req.headers.get('accept').includes('text/html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (url.origin === location.origin && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
