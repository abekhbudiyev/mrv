import {
  Activity,
  BookOpenCheck,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Network,
  RefreshCcw,
  Workflow,
} from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const ptpkPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'PTPK 2.0 — Bolalar ehtiyojlari',
    description: 'Signaldan xizmatning amalda boshlanishigacha bo‘lgan yagona muvofiqlashtirish oynasi.',
    route: '/apps/ptpk',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Dashboard'],
  },
  {
    key: 'cases',
    title: 'Case’lar registri',
    description: 'C1–C9 kirish holatlari bo‘yicha bolaga bog‘langan yagona case registri.',
    route: '/apps/ptpk/cases',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Case’lar'],
  },
  {
    key: 'triage',
    title: 'Triage va baholash',
    description: 'Shoshilinchlik, xavfsizlik va funksional ehtiyojlar asosida keyingi yo‘lni aniqlash.',
    route: '/apps/ptpk/triage',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Triage va baholash'],
  },
  {
    key: 'referrals',
    title: 'Xizmatga yo‘llanmalar',
    description: 'Bitta reja ichidagi parallel S0–S6 xizmat yo‘llanmalarini mustaqil boshqarish.',
    route: '/apps/ptpk/referrals',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Xizmatga yo‘llanmalar'],
  },
  {
    key: 'reviews',
    title: 'Ko‘rib chiqish va apellyatsiya',
    description: 'Rejali qayta ko‘rib chiqish, o‘zgarish va apellyatsiyani xizmatlardan uzmagan holda yuritish.',
    route: '/apps/ptpk/reviews',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Ko‘rib chiqish va apellyatsiya'],
  },
  {
    key: 'monitoring',
    title: 'Ijro monitoringi',
    description: 'Yo‘llanma berilgan emas, xizmat amalda boshlanganini va kutish muddatlarini nazorat qilish.',
    route: '/apps/ptpk/monitoring',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Ijro monitoringi'],
  },
  {
    key: 'process',
    title: 'Biznes jarayon',
    description: 'Signal, triage, reja, parallel yo‘llanma, xizmat boshlanishi va monitoringning target oqimi.',
    route: '/apps/ptpk/process',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Biznes jarayon'],
  },
  {
    key: 'references',
    title: 'Ma’lumotnomalar',
    description: 'Versiyalanadigan case, xizmat, status va qaror siyosatlari katalogi.',
    route: '/apps/ptpk/references',
    breadcrumb: ['Ilovalar', 'Bolalar ehtiyojlari', 'Ma’lumotnomalar'],
  },
]

export const ptpkMenu: MuruvvatMenuItem[] = [
  { id: 'dashboard', title: 'Dashboard', route: '/apps/ptpk', icon: LayoutDashboard },
  { id: 'cases', title: 'Case’lar', route: '/apps/ptpk/cases', icon: FolderKanban },
  { id: 'triage', title: 'Triage va baholash', route: '/apps/ptpk/triage', icon: ListChecks },
  { id: 'referrals', title: 'Xizmatga yo‘llanmalar', route: '/apps/ptpk/referrals', icon: Network },
  { id: 'reviews', title: 'Ko‘rib chiqish', route: '/apps/ptpk/reviews', icon: RefreshCcw },
  { id: 'monitoring', title: 'Ijro monitoringi', route: '/apps/ptpk/monitoring', icon: Activity },
  { id: 'process', title: 'Biznes jarayon', route: '/apps/ptpk/process', icon: Workflow },
  { id: 'references', title: 'Ma’lumotnomalar', route: '/apps/ptpk/references', icon: BookOpenCheck },
]

export function getPtpkPage(pageKey: string) {
  return ptpkPages.find((page) => page.key === pageKey)
}
