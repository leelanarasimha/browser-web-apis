const Version = 'v3';
const cache_name = `tasks-${Version}`;

globalThis.addEventListener('install', (event) => {
  console.log('Service Worker is installed', Version);
  event.waitUntil(preCache());
  globalThis.skipWaiting();
});

async function preCache() {
  const cache = await caches.open(cache_name);

  await cache.addAll(['/service-worker/offline-todo/todo.html', '/service-worker/offline-todo/todo.js']);
}

globalThis.addEventListener('activate', (event) => {
  console.log('service worker activated', Version);
  event.waitUntil(Promise.all([deleteCaches(), globalThis.clients.claim()]));
});

async function deleteCaches() {
  const cacheNames = await caches.keys();
  for (let cache of cacheNames) {
    if (cache !== cache_name) await caches.delete(cache);
  }
  console.log('available caches', await caches.keys());
}

globalThis.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (!url.startsWith('https://jsonplaceholder.typicode.com/todos/')) {
    return;
  }
  event.respondWith(handleTodoRequest(event));
});

async function handleTodoRequest(event) {
  const cache = await openCache();
  let message = 'Cache Hit';

  let response = await cache.match(event.request);

  if (!response) {
    message = 'Network';
    response = await fetch(event.request);
    await cache.put(event.request, response.clone());
  }

  const client = await globalThis.clients.get(event.clientId);
  client.postMessage({
    type: 'CACHE_MESSAGE',
    message
  });

  return response;
}

function openCache() {
  return caches.open(cache_name);
}

globalThis.addEventListener('message', (event) => {
  if (event.data.type === 'DELETE_CACHE') {
    const todoId = event.data.todoId;
    deleteCache(todoId);
  }
});

function generateRequestUrl(todoId) {
  const url = `https://jsonplaceholder.typicode.com/todos/${todoId}`;
  return new Request(url);
}

async function deleteCache(todoId) {
  const request = generateRequestUrl(todoId);
  const cache = await openCache();
  await cache.delete(request);
}
