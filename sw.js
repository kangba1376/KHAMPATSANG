const CACHE_NAME = 'soul-day-2026-03-02-13:55'; // 每次更新必须修改这个时间戳
const ASSETS = [
  './',
  './index.html',
  './BZDHT.ttf',
  './TibetWildYak.ttf',
  './converter.js',
  './rules_data.js',
  './logo.png',
  './favicon.ico',
  './apple-touch-icon.png',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) 
  );
});

// 核心修改：网络优先，且对 index.html 强制不走缓存
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // 如果请求的是主页，强制从网络获取最新的
  if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});