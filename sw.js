const CACHE_NAME = 'soulday-v1';
const ASSETS = [
  './',
  './index.html',
  './BZDHT.ttf',
  './TibetWildYak.ttf',
  './converter.js',
  './rules_data.js',
  './logo.png',
  './manifest.json'
];

// 安装时预缓存所有本地资源（包括你的班智达和野牛字体）
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 拦截请求：优先从本地读取，实现断网也能在桌面运行
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});