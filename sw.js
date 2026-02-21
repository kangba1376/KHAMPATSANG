const CACHE_NAME = 'soul-day-2026-02-21-12:30'; // 自动更新的版本号
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

// 安装并预缓存
self.addEventListener('install', (e) => {
  self.skipWaiting(); // 强制跳过等待，立即进入激活状态
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 激活阶段：清理旧版本缓存
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
    }).then(() => self.clients.claim()) // 立即控制所有页面
  );
});

// 策略：优先从缓存读取，断网可用；有网时通过 index.html 的检测来触发更新
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});