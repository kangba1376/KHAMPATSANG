const CACHE_NAME = 'soul-day-2026-03-06-00:40'; // 已更新为当前北京时间

self.addEventListener('install', (e) => {
  // 强制跳过等待，直接进入激活阶段
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // 彻底清理所有旧缓存
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // 立即接管所有客户端
  );
});

// 真正的网络优先策略 + 缓存更新
self.addEventListener('fetch', (e) => {
  // 对主文档请求不使用缓存，确保 HTML 永远是最新的
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // 请求成功则存入新缓存
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 断网时回退到缓存
        return caches.match(e.request);
      })
  );
});