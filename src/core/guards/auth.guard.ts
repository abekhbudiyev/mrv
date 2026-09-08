import type { Pinia } from 'pinia'
import type { RouteLocationNormalized, RouteLocationResolved, Router } from 'vue-router'
import { DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { MODULE_PERMISSION_BY_KEY } from '@/core/constants/permissions'
import type { CurrentUser } from '@/core/types/auth'
import { canAccessDemoPath, resolveDemoSession } from '@/features/auth/data/demo-accounts'
import { useAuthStore } from '@/stores/auth'

export function canAccessDemoRoute(user: CurrentUser | null, to: RouteLocationNormalized | RouteLocationResolved): boolean {
  const canonical = user ? resolveDemoSession(user) : null
  if (!canonical || !canAccessDemoPath(canonical, to.path)) return false
  // Check every matched record so a nested child cannot weaken a parent's requirement.
  return [...to.matched.map(record => record.meta), to.meta].every(meta => {
    const explicit = meta.permission
    const modulePermission = typeof meta.moduleKey === 'string' ? MODULE_PERMISSION_BY_KEY[meta.moduleKey] : undefined
    return (!explicit || canonical.permissions.includes(explicit)) && (!modulePermission || canonical.permissions.includes(modulePermission))
  })
}

export function resolveAuthorizedRedirect(router: Router, user: CurrentUser | null, candidate: unknown): string {
  if (typeof candidate !== 'string' || !canAccessDemoPath(user, candidate)) return DEFAULT_AUTH_REDIRECT
  try {
    const target = router.resolve(candidate)
    if (target.matched.some(record => record.path === '/:pathMatch(.*)*')) return DEFAULT_AUTH_REDIRECT
    return target.matched.length && !target.meta.guestOnly && canAccessDemoRoute(user, target) ? target.fullPath : DEFAULT_AUTH_REDIRECT
  }
  catch { return DEFAULT_AUTH_REDIRECT }
}

export function setupAuthGuard(router: Router, pinia: Pinia) {
  router.beforeEach((to) => {
    const authStore = useAuthStore(pinia)

    const requiresAuth = to.meta.requiresAuth || to.matched.some(record => record.meta.requiresAuth) || to.path === '/apps' || to.path.startsWith('/apps/')
    if (requiresAuth && !authStore.isAuthenticated) {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath,
        },
      }
    }

    if (requiresAuth && !canAccessDemoRoute(authStore.currentUser, to)) {
      return {
        name: 'forbidden',
      }
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      return resolveAuthorizedRedirect(router, authStore.currentUser, to.query.redirect)
    }

    return true
  })
}
