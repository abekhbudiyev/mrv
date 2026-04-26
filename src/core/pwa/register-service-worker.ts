const ENABLE_PWA_IN_DEV = import.meta.env.VITE_ENABLE_PWA_DEV === 'true'

export function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return
  }

  if (!import.meta.env.PROD && !ENABLE_PWA_IN_DEV) {
    return
  }

  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL

    navigator.serviceWorker.register(`${baseUrl}sw.js`, {
      scope: baseUrl,
    }).catch(() => {
      // PWA must never block the core app if registration fails.
    })
  })
}
