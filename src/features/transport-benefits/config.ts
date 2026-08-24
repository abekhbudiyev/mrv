import {
  Boxes,
  BookOpenCheck,
  Cable,
  LayoutDashboard,
  ListChecks,
  ShieldCheck,
  TicketCheck,
  UsersRound,
  WalletCards,
} from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const transportBenefitsPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Transport imtiyozlari',
    description: 'Kontingentdan immutable claim va moliya ATiga handoffgacha bo‘lgan MVP target ko‘rinishi.',
    route: '/apps/transport-benefits',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Dashboard'],
  },
  {
    key: 'contingents',
    title: 'Kontingent',
    description: 'Barcha manba tashkilotlar uchun yagona event modeli va huquqlar registri.',
    route: '/apps/transport-benefits/contingents',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Kontingent'],
  },
  {
    key: 'mvp-plan',
    title: 'MVP reja va rollar',
    description: 'To‘lovga yuborish chegarasigacha bo‘lgan scope, rollar, bosqichlar va qabul mezonlari.',
    route: '/apps/transport-benefits/mvp-plan',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'MVP reja va rollar'],
  },
  {
    key: 'eligibility',
    title: 'Moslik va rezerv',
    description: 'Transport turidan qat’i nazar yagona qaror API orqali huquq va limitni tekshirish.',
    route: '/apps/transport-benefits/eligibility',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Moslik va rezerv'],
  },
  {
    key: 'ticket-events',
    title: 'Chipta eventlari',
    description: 'Issue, return, travelled va boshqa holatlar uchun kanonik event oqimi.',
    route: '/apps/transport-benefits/ticket-events',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Chipta eventlari'],
  },
  {
    key: 'settlements',
    title: 'Reyestr va claim',
    description: 'Tashuvchi reyestrini tekshirish, immutable claim yaratish va moliya ATiga handoffgacha yuritish.',
    route: '/apps/transport-benefits/settlements',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Reyestr va claim'],
  },
  {
    key: 'reference-categories',
    title: 'Toifalar va huquqiy asoslar',
    description: 'Normativ mazmun, texnik profillar va tenglashtirish asoslarining versiyalangan registri.',
    route: '/apps/transport-benefits/references/categories',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Ma’lumotnomalar', 'Toifalar va huquqiy asoslar'],
  },
  {
    key: 'reference-policies',
    title: 'Imtiyoz siyosatlari',
    description: 'Amal davri, to‘lov kanali va qaror-gate’larini boshqaruvchi konfiguratsiyalar.',
    route: '/apps/transport-benefits/references/policies',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Ma’lumotnomalar', 'Imtiyoz siyosatlari'],
  },
  {
    key: 'reference-transport',
    title: 'Transport va tariflar',
    description: 'Transport turlari, chipta klasslari va tasdiqlovchi hujjatlar katalogi.',
    route: '/apps/transport-benefits/references/transport',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Ma’lumotnomalar', 'Transport va tariflar'],
  },
  {
    key: 'reference-organizations',
    title: 'Tashkilotlar',
    description: 'Kontingent manbalari, integratsiya egalari va operatsion ishtirokchilar registri.',
    route: '/apps/transport-benefits/references/organizations',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Ma’lumotnomalar', 'Tashkilotlar'],
  },
  {
    key: 'reference-system-codes',
    title: 'Tizim kodlari',
    description: 'Event, holat, sabab va rol kodlari uchun yagona read-only kataloglar.',
    route: '/apps/transport-benefits/references/system-codes',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'Ma’lumotnomalar', 'Tizim kodlari'],
  },
  {
    key: 'integrations',
    title: 'API va arxitektura',
    description: 'Umumlashtirilgan API kontraktlari, servis chegaralari va ma’lumot egaligi.',
    route: '/apps/transport-benefits/integrations',
    breadcrumb: ['Ilovalar', 'Transport imtiyozlari', 'API va arxitektura'],
  },
]

export const transportBenefitsMenu: MuruvvatMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    route: '/apps/transport-benefits',
    icon: LayoutDashboard,
  },
  {
    id: 'contingents',
    title: 'Kontingent',
    route: '/apps/transport-benefits/contingents',
    icon: UsersRound,
  },
  {
    id: 'mvp-plan',
    title: 'MVP reja va rollar',
    route: '/apps/transport-benefits/mvp-plan',
    icon: ListChecks,
  },
  {
    id: 'eligibility',
    title: 'Moslik va rezerv',
    route: '/apps/transport-benefits/eligibility',
    icon: ShieldCheck,
  },
  {
    id: 'ticket-events',
    title: 'Chipta eventlari',
    route: '/apps/transport-benefits/ticket-events',
    icon: TicketCheck,
  },
  {
    id: 'settlements',
    title: 'Reyestr va claim',
    route: '/apps/transport-benefits/settlements',
    icon: WalletCards,
  },
  {
    id: 'info',
    title: 'Ma’lumotnomalar',
    icon: BookOpenCheck,
    children: [
      { id: 'reference-categories', title: 'Toifalar va huquqiy asoslar', route: '/apps/transport-benefits/references/categories' },
      { id: 'reference-policies', title: 'Imtiyoz siyosatlari', route: '/apps/transport-benefits/references/policies' },
      { id: 'reference-transport', title: 'Transport va tariflar', route: '/apps/transport-benefits/references/transport' },
      { id: 'reference-organizations', title: 'Tashkilotlar', route: '/apps/transport-benefits/references/organizations' },
      { id: 'reference-system-codes', title: 'Tizim kodlari', route: '/apps/transport-benefits/references/system-codes' },
    ],
  },
  {
    id: 'integrations',
    title: 'API va arxitektura',
    route: '/apps/transport-benefits/integrations',
    icon: Cable,
  },
]

export const transportBenefitArchitectureIcon = Boxes

export function getTransportBenefitsPage(pageKey: string) {
  return transportBenefitsPages.find((page) => page.key === pageKey)
}
