import {
  BarChart3,
  Building2,
  FileCheck2,
  FileStack,
  Files,
  Home,
  Info,
  ListChecks,
  NotebookText,
  ScrollText,
  Users,
} from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from './types'

export const muruvvatPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'Muruvvat moduli uchun umumiy holat, asosiy indikatorlar va tezkor ko‘rsatkichlar joylashuvi.',
    route: '/apps/muruvvat',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Dashboard'],
    sectionTitle: 'Asosiy ko‘rsatkichlar',
    sectionDescription: 'Muruvvat moduli bo‘yicha dashboard kartalari, statistik bloklar va monitoring vidjetlari keyinroq qo‘shiladi.',
  },
  {
    key: 'info-1',
    title: 'Info 1',
    description: 'Muruvvat modulidagi birinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/muruvvat/info/info-1',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 1'],
  },
  {
    key: 'info-2',
    title: 'Info 2',
    description: 'Muruvvat modulidagi ikkinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/muruvvat/info/info-2',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 2'],
  },
  {
    key: 'info-3',
    title: 'Info 3',
    description: 'Muruvvat modulidagi uchinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/muruvvat/info/info-3',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 3'],
  },
  {
    key: 'applications-list',
    title: 'Arizalar ro‘yxati',
    description: '',
    route: '/apps/muruvvat/applications/list',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Arizalar ro‘yxati'],
  },
  {
    key: 'statements',
    title: 'Dalolatnomalar',
    description: 'Dalolatnomalar bilan ishlash uchun bo‘sh, kengaytirishga tayyor sahifa.',
    route: '/apps/muruvvat/applications/statements',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Dalolatnomalar'],
  },
  {
    key: 'decisions',
    title: 'Qarorlar',
    description: 'Qarorlar shakllantirish va ko‘rish jarayonlari uchun tayanch sahifa.',
    route: '/apps/muruvvat/applications/decisions',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Qarorlar'],
  },
  {
    key: 'queues',
    title: 'Navbatlar',
    description: 'Internat uylari bo‘yicha navbatlar, ustuvorlik va holatlarni yuritish uchun sahifa.',
    route: '/apps/muruvvat/homes/queues',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Navbatlar'],
  },
  {
    key: 'registered',
    title: 'Ro‘yxatga olinganlar',
    description: 'Ro‘yxatga olingan shaxslar bo‘yicha kelajakdagi jadval va detal ko‘rinishlari uchun joy.',
    route: '/apps/muruvvat/homes/registered',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Ro‘yxatga olinganlar'],
  },
  {
    key: 'removed',
    title: 'Ro‘yxatdan chiqqanlar',
    description: 'Ro‘yxatdan chiqqanlar bo‘yicha tarix va nazorat uchun tayyor sahifa.',
    route: '/apps/muruvvat/homes/removed',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Ro‘yxatdan chiqqanlar'],
  },
  {
    key: 'applications-report',
    title: 'Arizalar bo‘yicha hisobot',
    description: 'Arizalar kesimidagi hisobotlar, eksportlar va agregatsiyalar uchun tayyor blok.',
    route: '/apps/muruvvat/reports/applications',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Hisobotlar', 'Arizalar bo‘yicha hisobot'],
  },
  {
    key: 'homes-report',
    title: 'Internat uylari bo‘yicha hisobot',
    description: 'Internat uylari kesimidagi hisobot va analitik ko‘rinishlar uchun bo‘sh tayanch.',
    route: '/apps/muruvvat/reports/homes',
    breadcrumb: ['Ilovalar', 'Muruvvat', 'Hisobotlar', 'Internat uylari bo‘yicha hisobot'],
  },
]

export const muruvvatMenu: MuruvvatMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    route: '/apps/muruvvat',
    icon: Home,
  },
  {
    id: 'info',
    title: 'Info',
    icon: Info,
    children: [
      {
        id: 'info-1',
        title: 'Info 1',
        route: '/apps/muruvvat/info/info-1',
        icon: NotebookText,
      },
      {
        id: 'info-2',
        title: 'Info 2',
        route: '/apps/muruvvat/info/info-2',
        icon: NotebookText,
      },
      {
        id: 'info-3',
        title: 'Info 3',
        route: '/apps/muruvvat/info/info-3',
        icon: NotebookText,
      },
    ],
  },
  {
    id: 'applications',
    title: 'Arizalar',
    icon: FileStack,
    children: [
      {
        id: 'applications-list',
        title: 'Arizalar ro‘yxati',
        route: '/apps/muruvvat/applications/list',
        icon: ListChecks,
      },
      {
        id: 'statements',
        title: 'Dalolatnomalar',
        route: '/apps/muruvvat/applications/statements',
        icon: ScrollText,
      },
      {
        id: 'decisions',
        title: 'Qarorlar',
        route: '/apps/muruvvat/applications/decisions',
        icon: FileCheck2,
      },
    ],
  },
  {
    id: 'homes',
    title: 'Internat uylari',
    icon: Building2,
    children: [
      {
        id: 'queues',
        title: 'Navbatlar',
        route: '/apps/muruvvat/homes/queues',
        icon: Files,
      },
      {
        id: 'registered',
        title: 'Ro‘yxatga olinganlar',
        route: '/apps/muruvvat/homes/registered',
        icon: Users,
      },
      {
        id: 'removed',
        title: 'Ro‘yxatdan chiqqanlar',
        route: '/apps/muruvvat/homes/removed',
        icon: Users,
      },
    ],
  },
  {
    id: 'reports',
    title: 'Hisobotlar',
    icon: BarChart3,
    children: [
      {
        id: 'applications-report',
        title: 'Arizalar bo‘yicha hisobot',
        route: '/apps/muruvvat/reports/applications',
        icon: BarChart3,
      },
      {
        id: 'homes-report',
        title: 'Internat uylari bo‘yicha hisobot',
        route: '/apps/muruvvat/reports/homes',
        icon: BarChart3,
      },
    ],
  },
]

export function getMuruvvatPage(pageKey: string) {
  return muruvvatPages.find((page) => page.key === pageKey)
}
