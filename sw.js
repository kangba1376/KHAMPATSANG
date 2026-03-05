const CACHE_NAME = 'soul-day-2026-03-06-00:35'; // 自动更新为当前北京时间

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // 激活时立即清理所有旧缓存，确保环境纯净
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => self.clients.claim())
  );
});

// 核心修改：真正的网络优先策略
self.addEventListener('fetch', (e) => {
  e.respondWith(
    // 1. 直接发起网络请求
    fetch(e.request)
      .then((response) => {
        // 2. 只有联网请求成功，才顺便更新一下缓存（为以后断网做准备）
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 3. 只有当网络完全断开（报错）时，才从缓存中读取
        return caches.match(e.request);
      })
  );
});