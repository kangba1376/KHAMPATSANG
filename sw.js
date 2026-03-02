const CACHE_NAME = 'soul-day-2026-03-02-13:45'; // 已自动为您更新为当前北京时间
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

// 安装阶段：强制跳过等待
self.addEventListener('install', (e) => {
  self.skipWaiting(); 
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 激活阶段：彻底清理旧缓存并强制接管页面
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('清理旧版本缓存:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // 关键：立即控制所有客户端，不等待下次刷新
  );
});

// 抓取策略：网络优先（确保最新消息），失败后退回缓存（保证离线可用）
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});