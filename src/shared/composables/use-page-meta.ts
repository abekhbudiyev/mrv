import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePageMeta() {
  const route = useRoute()

  const title = computed(() => route.meta.title ?? '')
  const breadcrumbs = computed(() => route.meta.breadcrumb ?? [])

  return {
    title,
    breadcrumbs,
  }
}
