const CACHE_NAME = 'soul-day-2026-03-06-01:45'; // 已更新为当前北京时间

self.addEventListener('install', (e) => {
  // 强制跳过等待，让新脚本立即生效
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // 清理所有旧版本的缓存，确保空间干净
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // 立即接管所有页面控制权
  );
});

// 核心优化：真正的网络穿透策略
self.addEventListener('fetch', (e) => {
  // 忽略非 GET 请求（如 POST），这些不应被拦截
  if (e.request.method !== 'GET') return;

  e.respondWith(
    // 强制增加 cache: 'no-store'，告诉浏览器不要看它自己的 HTTP 缓存，直接去服务器取
    fetch(e.request, { cache: 'no-store' })
      .then((response) => {
        // 如果网络返回成功，就在后台偷偷更新一下缓存，备不时之需
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 只有当网络彻底断开（fetch 报错）时，才从缓存里翻东西出来
        return caches.match(e.request);
      })
  );
});