declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guestOnly?: boolean
    title?: string
    breadcrumb?: string[]
    moduleKey?: string
    moduleTitle?: string
  }
}

export {}
