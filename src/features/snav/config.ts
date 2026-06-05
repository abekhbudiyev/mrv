import { Building2, CalendarClock, Home, Info, Tags } from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const snavPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Ijtimoiy navigator',
    description: 'Agentlik tizimidagi tashkilotlarni xaritada ko‘rish va yo‘nalish olish uchun navigator.',
    route: '/apps/snav',
    breadcrumb: ['Ilovalar', 'Ijtimoiy navigator', 'Dashboard'],
    sectionTitle: 'Tashkilotlar xaritasi',
    sectionDescription: 'Tuman Inson markazlari, hududiy boshqarmalar, sanatoriylar, Muruvvat va Saxovat internat uylari xaritada ko‘rsatiladi.',
  },
  {
    key: 'organization-types',
    title: 'Tashkilot turlari',
    description: '',
    route: '/apps/snav/info/organization-types',
    breadcrumb: ['Ilovalar', 'Ijtimoiy navigator', "Ma'lumotnomalar", 'Tashkilot turlari'],
  },
  {
    key: 'organizations',
    title: 'Tashkilotlar',
    description: '',
    route: '/apps/snav/info/organizations',
    breadcrumb: ['Ilovalar', 'Ijtimoiy navigator', "Ma'lumotnomalar", 'Tashkilotlar'],
  },
  {
    key: 'reception-schedules',
    title: 'Qabul jadvallari',
    description: '',
    route: '/apps/snav/info/reception-schedules',
    breadcrumb: ['Ilovalar', 'Ijtimoiy navigator', "Ma'lumotnomalar", 'Qabul jadvallari'],
  },
]

export const snavMenu: MuruvvatMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    route: '/apps/snav',
    icon: Home,
  },
  {
    id: 'info',
    title: "Ma'lumotnomalar",
    icon: Info,
    children: [
      {
        id: 'organization-types',
        title: 'Tashkilot turlari',
        route: '/apps/snav/info/organization-types',
        icon: Tags,
      },
      {
        id: 'organizations',
        title: 'Tashkilotlar',
        route: '/apps/snav/info/organizations',
        icon: Building2,
      },
      {
        id: 'reception-schedules',
        title: 'Qabul jadvallari',
        route: '/apps/snav/info/reception-schedules',
        icon: CalendarClock,
      },
    ],
  },
]

export function getSnavPage(pageKey: string) {
  return snavPages.find((page) => page.key === pageKey) ?? snavPages[0]!
}
