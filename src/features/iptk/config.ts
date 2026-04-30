import { BarChart3, FileStack, Home, Info, ListChecks, NotebookText } from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const iptkPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: "Arizalar bo'yicha dashboard",
    description: '',
    route: '/apps/iptk',
    breadcrumb: ['Ilovalar', 'IPTK', "Arizalar bo'yicha dashboard"],
  },
  {
    key: 'info-1',
    title: 'Xizmat turlari',
    description: '',
    route: '/apps/iptk/info/info-1',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Xizmat turlari'],
  },
  {
    key: 'info-2',
    title: 'Mos tashxislar',
    description: '',
    route: '/apps/iptk/info/info-2',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Mos tashxislar'],
  },
  {
    key: 'info-3',
    title: "Qarshi ko'rsatmalar",
    description: '',
    route: '/apps/iptk/info/info-3',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', "Qarshi ko'rsatmalar"],
  },
  {
    key: 'info-4',
    title: 'Hujjatlar',
    description: '',
    route: '/apps/iptk/info/info-4',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Hujjatlar'],
  },
  {
    key: 'info-5',
    title: "So'rovnoma shabloni",
    description: '',
    route: '/apps/iptk/info/info-5',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', "So'rovnoma shabloni"],
  },
  {
    key: 'info-6',
    title: "Toifa guruhlari",
    description: '',
    route: '/apps/iptk/info/info-6',
    breadcrumb: ['Ilovalar', 'IPTK', 'Info', "Toifa guruhlari"],
  },
  {
    key: 'applications-list',
    title: 'Arizalar',
    description: '',
    route: '/apps/iptk/applications/list',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Arizalar'],
    sectionTitle: '',
    sectionDescription: '',
  },
  {
    key: 'applications-assessment',
    title: 'Baholash',
    description: '',
    route: '/apps/iptk/applications/assessment',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Baholash'],
    sectionTitle: 'Baholash',
    sectionDescription: '',
  },
  {
    key: 'applications-protocol',
    title: 'Bayonnoma',
    description: '',
    route: '/apps/iptk/applications/protocol',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Bayonnoma'],
    sectionTitle: 'Bayonnoma',
    sectionDescription: '',
  },
  {
    key: 'commissions-composition',
    title: 'Komissiyalar tarkibi',
    description: '',
    route: '/apps/iptk/applications/commissions',
    breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Komissiyalar tarkibi'],
    sectionTitle: 'Komissiyalar tarkibi',
    sectionDescription: "Komissiya raisi, rais o'rinbosari, kotib va a'zolardan iborat tarkibni yaratish, tahrirlash va tasdiqlash oqimi.",
  },
  {
    key: 'applications-report',
    title: "Arizalar bo'yicha hisobot",
    description: '',
    route: '/apps/iptk/reports/applications',
    breadcrumb: ['Ilovalar', 'IPTK', 'Hisobotlar', "Arizalar bo'yicha hisobot"],
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
        title: 'Xizmat turlari',
        route: '/apps/iptk/info/info-1',
        icon: NotebookText,
      },
      {
        id: 'info-2',
        title: 'Mos tashxislar',
        route: '/apps/iptk/info/info-2',
        icon: NotebookText,
      },
      {
        id: 'info-3',
        title: "Qarshi ko'rsatmalar",
        route: '/apps/iptk/info/info-3',
        icon: NotebookText,
      },
      {
        id: 'info-4',
        title: 'Hujjatlar',
        route: '/apps/iptk/info/info-4',
        icon: NotebookText,
      },
      {
        id: 'info-5',
        title: "So'rovnoma shabloni",
        route: '/apps/iptk/info/info-5',
        icon: NotebookText,
      },
      {
        id: 'info-6',
        title: "Toifa guruhlari",
        route: '/apps/iptk/info/info-6',
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
        id: 'applications-assessment',
        title: 'Baholash',
        route: '/apps/iptk/applications/assessment',
        icon: NotebookText,
      },
      {
        id: 'applications-protocol',
        title: 'Bayonnoma',
        route: '/apps/iptk/applications/protocol',
        icon: NotebookText,
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
        title: "Arizalar bo'yicha hisobot",
        route: '/apps/iptk/reports/applications',
        icon: BarChart3,
      },
    ],
  },
]

export function getIPTKPage(pageKey: string) {
  return iptkPages.find((page) => page.key === pageKey)
}
