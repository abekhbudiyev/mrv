const CACHE_VERSION = 'ihma-pwa-v1'
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`

const scopeUrl = new URL(self.registration.scope)
const appShellUrl = scopeUrl.href
const preCacheUrls = [
  appShellUrl,
  new URL('manifest.webmanifest', scopeUrl).href,
  new URL('pwa/logo-mark.svg', scopeUrl).href,
  new URL('pwa/logo-maskable.svg', scopeUrl).href,
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(preCacheUrls))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('ihma-pwa-') && !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)

  if (requestUrl.origin !== self.location.origin) {
    return
  }

  if (requestUrl.pathname.includes('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  if (shouldCacheStaticRequest(request)) {
    event.respondWith(handleStaticRequest(request))
  }
})

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_SHELL_CACHE)

  try {
    const response = await fetch(request)
    if (response.ok) {
      await cache.put(request, response.clone())
      await cache.put(appShellUrl, response.clone())
    }
    return response
  }
  catch {
    return await cache.match(request)
      ?? await cache.match(appShellUrl)
      ?? Response.error()
  }
}

async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(request)

  if (response.ok) {
    const cache = await caches.open(RUNTIME_CACHE)
    await cache.put(request, response.clone())
  }

  return response
}

function shouldCacheStaticRequest(request) {
  return ['font', 'image', 'manifest', 'script', 'style'].includes(request.destination)
}
