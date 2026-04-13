import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import { DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { useAuthStore } from '@/stores/auth'

export function setupAuthGuard(router: Router, pinia: Pinia) {
  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      const redirectTarget = typeof to.query.redirect === 'string'
        ? to.query.redirect
        : DEFAULT_AUTH_REDIRECT

      return redirectTarget
    }

    return true
  })
}
