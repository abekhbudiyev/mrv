import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '@/shared/i18n'

const pageI18nKeysByRoute: Record<string, string> = {
  '/apps': 'nav.apps',
  '/apps/iptk': 'page.iptk.dashboard',
  '/apps/iptk/info/info-1': 'page.serviceTypes',
  '/apps/iptk/info/info-2': 'page.diagnoses',
  '/apps/iptk/info/info-3': 'page.contraindications',
  '/apps/iptk/info/info-4': 'page.documents',
  '/apps/iptk/info/info-5': 'page.questionnaireTemplate',
  '/apps/iptk/info/info-6': 'page.categoryGroups',
  '/apps/iptk/applications/list': 'page.applications.list',
  '/apps/iptk/applications/assessment': 'page.assessment',
  '/apps/iptk/applications/protocol': 'page.protocol',
  '/apps/iptk/applications/commissions': 'page.commissions',
  '/apps/iptk/reports/applications': 'page.applications.report',
  '/apps/muruvvat': 'nav.dashboard',
  '/apps/muruvvat/info/info-1': 'nav.info1',
  '/apps/muruvvat/info/info-2': 'nav.info2',
  '/apps/muruvvat/info/info-3': 'nav.info3',
  '/apps/muruvvat/applications/list': 'page.applications.list',
  '/apps/muruvvat/applications/statements': 'page.statements',
  '/apps/muruvvat/applications/decisions': 'page.decisions',
  '/apps/muruvvat/homes/queues': 'page.queues',
  '/apps/muruvvat/homes/registered': 'page.registered',
  '/apps/muruvvat/homes/removed': 'page.removed',
  '/apps/muruvvat/reports/applications': 'page.applications.report',
  '/apps/muruvvat/reports/homes': 'page.homes.report',
  '/apps/dashboard': 'nav.dashboard',
  '/apps/citizens': 'module.citizens',
  '/apps/applications': 'nav.applications',
  '/apps/benefits': 'module.benefits',
  '/apps/payments': 'module.payments',
  '/apps/documents': 'nav.documents',
  '/apps/monitoring': 'module.monitoring',
  '/apps/reports': 'nav.reports',
  '/apps/settings': 'module.settings',
  '/apps/users': 'module.users',
  '/login': 'page.login',
}

const breadcrumbI18nKeys: Record<string, string> = {
  'Arizalar': 'nav.applications',
  'Dashboard': 'nav.dashboard',
  'Hisobotlar': 'nav.reports',
  'Hujjatlar': 'nav.documents',
  'Ilovalar': 'nav.apps',
  'Info': 'nav.info',
  'Internat uylari': 'nav.homes',
  'IPTK': 'module.iptk',
  'Kirish': 'page.login',
  'Modullar': 'nav.modules',
  'Muruvvat': 'module.muruvvat',
}

export function usePageMeta() {
  const route = useRoute()
  const { locale, t } = useI18n()

  const title = computed(() => {
    if (locale.value === 'i18n') {
      return pageI18nKeysByRoute[route.path] ?? String(route.meta.title ?? '')
    }

    return t(String(route.meta.title ?? ''))
  })

  const breadcrumbs = computed(() => {
    const items = route.meta.breadcrumb ?? []

    if (locale.value !== 'i18n') {
      return items.map((item) => t(item))
    }

    return items.map((item, index) => {
      if (index === items.length - 1) {
        return pageI18nKeysByRoute[route.path] ?? breadcrumbI18nKeys[item] ?? item
      }

      return breadcrumbI18nKeys[item] ?? item
    })
  })

  return {
    title,
    breadcrumbs,
  }
}
