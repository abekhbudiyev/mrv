import { BarChart3, FileStack, Home, Info, ListChecks, NotebookText } from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const iptkPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'IPTK moduli uchun umumiy holat, asosiy indikatorlar va tezkor ko‘rsatkichlar joylashuvi.',
    route: '/apps/iptk',
    breadcrumb: ['Ilovalar', 'IPTK', 'Dashboard'],
    sectionTitle: 'Asosiy ko‘rsatkichlar',
    sectionDescription: 'IPTK moduli bo‘yicha dashboard kartalari, statistik bloklar va monitoring vidjetlari keyinroq qo‘shiladi.',
  },
  {
    key: 'info-1',
    title: 'Info 1',
    description: 'IPTK modulidagi birinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/iptk/info/info-1',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 1'],
  },
  {
    key: 'info-2',
    title: 'Info 2',
    description: 'IPTK modulidagi ikkinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/iptk/info/info-2',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 2'],
  },
  {
    key: 'info-3',
    title: 'Info 3',
    description: 'IPTK modulidagi uchinchi ma’lumot bo‘limi uchun tayyorlangan sahifa.',
    route: '/apps/iptk/info/info-3',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 3'],
  },
  {
    key: 'applications-list',
    title: 'Arizalar',
    description: 'IPTK moduli bo‘yicha arizalar ro‘yxati va keyingi ish jarayonlari shu sahifada shakllantiriladi.',
    route: '/apps/iptk/applications/list',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Arizalar'],
    sectionTitle: 'Arizalar',
    sectionDescription: 'IPTK moduli uchun arizalar jadvali, filtrlar va amallar keyingi bosqichda qo‘shiladi.',
  },
  {
    key: 'commissions-composition',
    title: 'Komissiyalar tarkibi',
    description: '',
    route: '/apps/iptk/applications/commissions',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Komissiyalar tarkibi'],
    sectionTitle: 'Komissiyalar tarkibi',
    sectionDescription: 'Komissiya raisi, rais o‘rinbosari, kotib va a’zolardan iborat tarkibni yaratish, tahrirlash va tasdiqlash oqimi.',
  },
  {
    key: 'applications-report',
    title: 'Arizalar bo‘yicha hisobot',
    description: 'IPTK moduli bo‘yicha arizalar kesimidagi hisobotlar, eksportlar va agregatsiyalar uchun tayyor blok.',
    route: '/apps/iptk/reports/applications',
    breadcrumb: ['Ilovalar', 'IPTK', 'Hisobotlar', 'Arizalar bo‘yicha hisobot'],
  },
]

export const iptkMenu: MuruvvatMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    route: '/apps/iptk',
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
        route: '/apps/iptk/info/info-1',
        icon: NotebookText,
      },
      {
        id: 'info-2',
        title: 'Info 2',
        route: '/apps/iptk/info/info-2',
        icon: NotebookText,
      },
      {
        id: 'info-3',
        title: 'Info 3',
        route: '/apps/iptk/info/info-3',
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
        title: 'Arizalar',
        route: '/apps/iptk/applications/list',
        icon: ListChecks,
      },
      {
        id: 'commissions-composition',
        title: 'Komissiyalar tarkibi',
        route: '/apps/iptk/applications/commissions',
        icon: NotebookText,
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
        route: '/apps/iptk/reports/applications',
        icon: BarChart3,
      },
    ],
  },
]

export function getIPTKPage(pageKey: string) {
  return iptkPages.find((page) => page.key === pageKey)
}
