const CACHE_NAME = 'soul-day-2026-03-02-15:05'; // 每次发布新消息，必须改这个时间
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

// 安装：立即接管
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 激活：暴力删除所有旧缓存
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

// 策略修改：网络优先。解决手机桌面版不刷新的核心
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // 只有请求成功，才更新缓存
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 没网时，才走缓存
        return caches.match(e.request);
      })
  );
});