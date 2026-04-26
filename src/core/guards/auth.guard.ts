import type { Pinia } from 'pinia'
import type { Router } from 'vue-router'
import { DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { MODULE_PERMISSION_BY_KEY } from '@/core/constants/permissions'
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

    const routePermission = to.meta.permission
      ?? (typeof to.meta.moduleKey === 'string'
        ? MODULE_PERMISSION_BY_KEY[to.meta.moduleKey]
        : undefined)

    if (routePermission && !authStore.hasPermission(routePermission)) {
      return DEFAULT_AUTH_REDIRECT
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
