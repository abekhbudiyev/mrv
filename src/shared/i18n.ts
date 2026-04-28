import { computed, ref } from 'vue'

export type AppLocale = 'uz' | 'en' | 'ru' | 'i18n'

type TranslationMap = Partial<Record<Exclude<AppLocale, 'uz'>, string>>

const storageKey = 'nasp-locale'

export const appLanguages: Array<{ code: AppLocale, label: string, shortLabel: string }> = [
  { code: 'uz', label: "O'zbek", shortLabel: 'UZ' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU' },
  { code: 'i18n', label: 'i18n', shortLabel: 'i18n' },
]

function getInitialLocale(): AppLocale {
  if (typeof window === 'undefined') return 'uz'

  const storedLocale = window.localStorage.getItem(storageKey)
  return appLanguages.some((language) => language.code === storedLocale) ? storedLocale as AppLocale : 'uz'
}

const locale = ref<AppLocale>(getInitialLocale())

const translationKeys: Record<string, string> = {
  "Arizalar bo'yicha dashboard": 'page.iptk.dashboard',
  "Arizalar bo'yicha hisobot": 'page.applications.report',
  'Arizalar bo‘yicha hisobot': 'page.applications.report',
  'Arizalar boâ€˜yicha hisobot': 'page.applications.report',
  'Arizalar': 'nav.applications',
  "Arizalar ro'yxati": 'page.applications.list',
  'Arizalar ro‘yxati': 'page.applications.list',
  'Arizalar roâ€˜yxati': 'page.applications.list',
  'Asosiy ko‘rsatkichlar': 'page.dashboard.metrics',
  'Asosiy koâ€˜rsatkichlar': 'page.dashboard.metrics',
  'Baholash': 'page.assessment',
  'Dashboard': 'nav.dashboard',
  'Dalolatnomalar': 'page.statements',
  'Foydalanuvchilar va rollar': 'module.users',
  'Fuqarolar reyestri': 'module.citizens',
  'Hisobotlar': 'nav.reports',
  'Hujjatlar': 'nav.documents',
  'Ilovalar': 'nav.apps',
  'Info': 'nav.info',
  'Info 1': 'nav.info1',
  'Info 2': 'nav.info2',
  'Info 3': 'nav.info3',
  'Internat uylari': 'nav.homes',
  'Internat uylari bo‘yicha hisobot': 'page.homes.report',
  'Internat uylari boâ€˜yicha hisobot': 'page.homes.report',
  'IPTK': 'module.iptk',
  'Kirish': 'page.login',
  'Komissiyalar tarkibi': 'page.commissions',
  'Modullar': 'nav.modules',
  'Monitoring': 'module.monitoring',
  'Mos tashxislar': 'page.diagnoses',
  'Muruvvat': 'module.muruvvat',
  'Nafaqalar': 'module.benefits',
  'Navbatlar': 'page.queues',
  'Ochish': 'action.open',
  "Qarshi ko'rsatmalar": 'page.contraindications',
  'Qarorlar': 'page.decisions',
  "Ro'yxatga olinganlar": 'page.registered',
  'Ro‘yxatga olinganlar': 'page.registered',
  'Roâ€˜yxatga olinganlar': 'page.registered',
  "Ro'yxatdan chiqqanlar": 'page.removed',
  'Ro‘yxatdan chiqqanlar': 'page.removed',
  'Roâ€˜yxatdan chiqqanlar': 'page.removed',
  "So'rovnoma shabloni": 'page.questionnaireTemplate',
  'Sozlamalar': 'module.settings',
  "To'lovlar": 'module.payments',
  'To‘lovlar': 'module.payments',
  'Toâ€˜lovlar': 'module.payments',
  "Toifa guruhlari": 'page.categoryGroups',
  'Xizmat turlari': 'page.serviceTypes',
}

const translations: Record<string, TranslationMap> = {
  'action.open': {
    en: 'Open',
    ru: 'Открыть',
    i18n: 'action.open',
  },
  'module.benefits': {
    en: 'Benefits',
    ru: 'Пособия',
    i18n: 'module.benefits',
  },
  'module.citizens': {
    en: 'Citizens registry',
    ru: 'Реестр граждан',
    i18n: 'module.citizens',
  },
  'module.iptk': {
    en: 'IPTK',
    ru: 'ИПТК',
    i18n: 'module.iptk',
  },
  'module.monitoring': {
    en: 'Monitoring',
    ru: 'Мониторинг',
    i18n: 'module.monitoring',
  },
  'module.muruvvat': {
    en: 'Muruvvat',
    ru: 'Муравват',
    i18n: 'module.muruvvat',
  },
  'module.payments': {
    en: 'Payments',
    ru: 'Платежи',
    i18n: 'module.payments',
  },
  'module.settings': {
    en: 'Settings',
    ru: 'Настройки',
    i18n: 'module.settings',
  },
  'module.users': {
    en: 'Users and roles',
    ru: 'Пользователи и роли',
    i18n: 'module.users',
  },
  'nav.applications': {
    en: 'Applications',
    ru: 'Заявления',
    i18n: 'nav.applications',
  },
  'nav.apps': {
    en: 'Apps',
    ru: 'Приложения',
    i18n: 'nav.apps',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    ru: 'Дашборд',
    i18n: 'nav.dashboard',
  },
  'nav.documents': {
    en: 'Documents',
    ru: 'Документы',
    i18n: 'nav.documents',
  },
  'nav.homes': {
    en: 'Residential homes',
    ru: 'Дома-интернаты',
    i18n: 'nav.homes',
  },
  'nav.info': {
    en: 'Info',
    ru: 'Инфо',
    i18n: 'nav.info',
  },
  'nav.info1': {
    en: 'Info 1',
    ru: 'Инфо 1',
    i18n: 'nav.info1',
  },
  'nav.info2': {
    en: 'Info 2',
    ru: 'Инфо 2',
    i18n: 'nav.info2',
  },
  'nav.info3': {
    en: 'Info 3',
    ru: 'Инфо 3',
    i18n: 'nav.info3',
  },
  'nav.modules': {
    en: 'Modules',
    ru: 'Модули',
    i18n: 'nav.modules',
  },
  'nav.reports': {
    en: 'Reports',
    ru: 'Отчеты',
    i18n: 'nav.reports',
  },
  'page.applications.list': {
    en: 'Applications list',
    ru: 'Список заявлений',
    i18n: 'page.applications.list',
  },
  'page.applications.report': {
    en: 'Applications report',
    ru: 'Отчет по заявлениям',
    i18n: 'page.applications.report',
  },
  'page.assessment': {
    en: 'Assessment',
    ru: 'Оценка',
    i18n: 'page.assessment',
  },
  'page.categoryGroups': {
    en: 'Category groups',
    ru: 'Группы категорий',
    i18n: 'page.categoryGroups',
  },
  'page.commissions': {
    en: 'Commission composition',
    ru: 'Состав комиссий',
    i18n: 'page.commissions',
  },
  'page.contraindications': {
    en: 'Contraindications',
    ru: 'Противопоказания',
    i18n: 'page.contraindications',
  },
  'page.dashboard.metrics': {
    en: 'Key indicators',
    ru: 'Основные показатели',
    i18n: 'page.dashboard.metrics',
  },
  'page.decisions': {
    en: 'Decisions',
    ru: 'Решения',
    i18n: 'page.decisions',
  },
  'page.diagnoses': {
    en: 'Matching diagnoses',
    ru: 'Подходящие диагнозы',
    i18n: 'page.diagnoses',
  },
  'page.homes.report': {
    en: 'Residential homes report',
    ru: 'Отчет по домам-интернатам',
    i18n: 'page.homes.report',
  },
  'page.iptk.dashboard': {
    en: 'Applications dashboard',
    ru: 'Дашборд по заявлениям',
    i18n: 'page.iptk.dashboard',
  },
  'page.login': {
    en: 'Login',
    ru: 'Вход',
    i18n: 'page.login',
  },
  'page.queues': {
    en: 'Queues',
    ru: 'Очереди',
    i18n: 'page.queues',
  },
  'page.questionnaireTemplate': {
    en: 'Questionnaire template',
    ru: 'Шаблон анкеты',
    i18n: 'page.questionnaireTemplate',
  },
  'page.registered': {
    en: 'Registered',
    ru: 'Зарегистрированные',
    i18n: 'page.registered',
  },
  'page.removed': {
    en: 'Removed from registry',
    ru: 'Снятые с учета',
    i18n: 'page.removed',
  },
  'page.serviceTypes': {
    en: 'Service types',
    ru: 'Виды услуг',
    i18n: 'page.serviceTypes',
  },
  'page.statements': {
    en: 'Statements',
    ru: 'Акты',
    i18n: 'page.statements',
  },
}

export function translateText(value: string, targetLocale = locale.value) {
  if (targetLocale === 'uz') return value

  const key = translationKeys[value] ?? value
  return translations[key]?.[targetLocale] ?? (targetLocale === 'i18n' ? key : value)
}

export function useI18n() {
  const currentLanguage = computed(() => appLanguages.find((language) => language.code === locale.value) ?? appLanguages[0])

  function setLocale(nextLocale: AppLocale) {
    locale.value = nextLocale

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, nextLocale)
    }
  }

  function t(value: string) {
    return translateText(value, locale.value)
  }

  return {
    locale,
    languages: appLanguages,
    currentLanguage,
    setLocale,
    t,
  }
}
