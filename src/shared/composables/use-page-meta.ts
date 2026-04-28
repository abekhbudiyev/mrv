import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/shared/i18n'

export function usePageMeta() {
  const route = useRoute()
  const { t } = useI18n()

  const title = computed(() => t(String(route.meta.title ?? '')))
  const breadcrumbs = computed(() => (route.meta.breadcrumb ?? []).map((item) => t(item)))

  return {
    title,
    breadcrumbs,
  }
}
