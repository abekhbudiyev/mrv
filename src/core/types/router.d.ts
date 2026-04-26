import type { PermissionKey } from '@/core/types/permissions'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
    breadcrumb?: string[]
    moduleKey?: string
    moduleTitle?: string
    permission?: PermissionKey
  }
}

export {}
