import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { nextTick } from 'vue'
import { APP_TITLE } from '@/core/constants/app'
import { routes } from './routes'

export const router = createRouter({
  history: import.meta.env.PROD
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(),
  routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

router.afterEach(async (to) => {
  const pageTitle = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
  document.title = pageTitle

  await nextTick()

  document.querySelectorAll<HTMLElement>('main [class~="overflow-y-auto"]').forEach((element) => {
    element.scrollTop = 0
  })

  document.querySelectorAll<HTMLElement>('main [class~="overflow-x-auto"]').forEach((element) => {
    element.scrollLeft = 0
  })
})
