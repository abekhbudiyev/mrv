import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from '@/core/router'
import { setupAuthGuard } from '@/core/guards/auth.guard'
import { useAuthStore } from '@/stores/auth'
import { registerAppServiceWorker } from '@/core/pwa/register-service-worker'
import { initializeTheme } from '@/shared/composables/use-theme'
import '@/styles/globals.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore(pinia)
authStore.restoreSession()
initializeTheme()

setupAuthGuard(router, pinia)
registerAppServiceWorker()

app.use(router)
app.mount('#app')
