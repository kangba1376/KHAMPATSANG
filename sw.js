const CACHE_NAME = 'soul-day-cache-v6.0';
const ASSETS = [
  './',
  './index.html',
  './TibetWildYak.ttf',
  './logo.png',
  './favicon.png',
  './favicon-small.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './manifest.json'
];

// 安装阶段：预缓存所有资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// 激活阶段：清理旧版本缓存并立刻接管控制权
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

// 请求阶段：网络优先，成功则更新缓存，失败则使用缓存
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果网络请求成功，克隆一份存入缓存，实现“有网立马更新”
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 如果断网，则从缓存中读取，实现“没网照样能用”
        return caches.match(event.request);
      })
  );
});