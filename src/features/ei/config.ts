import {
  Baby,
  CreditCard,
  FileCheck2,
  FileText,
  HeartHandshake,
  Home,
  ListChecks,
  ScrollText,
  Store,
  TicketCheck,
  UserCheck,
  UserX,
} from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const eiPages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Asosiy',
    description: 'Erta aralashuv moduli uchun umumiy ko‘rsatkichlar va tezkor ish maydoni.',
    route: '/apps/ei',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Asosiy'],
    sectionTitle: 'Asosiy ish maydoni',
    sectionDescription: 'Bolalar murojaatlari, vaucherlar, xizmat ko‘rsatuvchilar, davomat va moliyalashtirish bo‘yicha umumiy ko‘rsatkichlar shu yerda joylashadi.',
  },
  {
    key: 'providers-applications',
    title: 'Arizalar',
    description: 'Erta aralashuv xizmatini ko‘rsatish uchun murojaat qilgan nodavlat tashkilotlar arizalari.',
    route: '/apps/ei/providers/applications',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatuvchilar', 'Arizalar'],
  },
  {
    key: 'providers-conclusions',
    title: 'Xulosalar',
    description: 'Ishchi guruh o‘rganishi natijasida tayyorlangan xulosalar va ularni tasdiqlash jarayoni.',
    route: '/apps/ei/providers/conclusions',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatuvchilar', 'Xulosalar'],
  },
  {
    key: 'providers-registry',
    title: 'Reyestr',
    description: 'Erta aralashuv xizmatini ko‘rsatish huquqiga ega elektron reyestrdagi nodavlat tashkilotlar.',
    route: '/apps/ei/providers/registry',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatuvchilar', 'Reyestr'],
  },
  {
    key: 'children-questionnaires',
    title: 'Arizalar',
    description: 'Bolaning ota-onasi yoki vakili nomidan yuborilgan xizmatdan foydalanish arizalari.',
    route: '/apps/ei/children/applications',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Bolalar murojaatlari', 'Arizalar'],
  },
  {
    key: 'children-vouchers',
    title: 'Vaucherlar',
    description: 'Bolalarga avtomatik shakllantirilgan vaucherlar va ularning foydalanish holatlari.',
    route: '/apps/ei/children/vouchers',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Bolalar murojaatlari', 'Vaucherlar'],
  },
  {
    key: 'children-orders',
    title: 'Buyurtmalar',
    description: 'Vaucher orqali tanlangan xizmat ko‘rsatuvchiga yuborilgan buyurtmalar.',
    route: '/apps/ei/children/orders',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Bolalar murojaatlari', 'Buyurtmalar'],
  },
  {
    key: 'service-active',
    title: 'Xizmat olayotganlar',
    description: 'Erta aralashuv xizmatidan foydalanayotgan bolalar va oilalar ro‘yxati.',
    route: '/apps/ei/service/active',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatish', 'Xizmat olayotganlar'],
  },
  {
    key: 'service-plans',
    title: 'Erta aralashuv rejalari',
    description: 'Nodavlat tashkilot va oila bilan birgalikda ishlab chiqilgan individual erta aralashuv rejalari.',
    route: '/apps/ei/service/plans',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatish', 'Erta aralashuv rejalari'],
  },
  {
    key: 'service-attendance',
    title: 'Davomat',
    description: 'Xizmatdan haqiqiy foydalanish davomatini yuritish va biometrik tasdiqlash sahifasi.',
    route: '/apps/ei/service/attendance',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatish', 'Davomat'],
  },
  {
    key: 'service-terminated',
    title: 'Xizmati tugatilganlar',
    description: 'Vaucher muddati tugashi, bolaning uch yoshga to‘lishi yoki boshqa asoslar bo‘yicha tugatilgan xizmatlar.',
    route: '/apps/ei/service/terminated',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Xizmat ko‘rsatish', 'Xizmati tugatilganlar'],
  },
  {
    key: 'finance-subsidy-requests',
    title: 'Buyurtmanomalar',
    description: 'Ko‘rsatilgan xizmatlar va davomat asosida shakllangan subsidiya olish buyurtmanomalari.',
    route: '/apps/ei/finance/subsidy-requests',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Moliyalashtirish', 'Buyurtmanomalar'],
  },
  {
    key: 'finance-payments',
    title: "Subsidiyalar / To'lovlar",
    description: 'Vaucher asosida qoplab beriladigan subsidiya va to‘lovlar hisobi.',
    route: '/apps/ei/finance/payments',
    breadcrumb: ['Ilovalar', 'Erta aralashuv moduli', 'Moliyalashtirish', "Subsidiyalar / To'lovlar"],
  },
]

export const eiMenu: MuruvvatMenuItem[] = [
  {
    id: 'dashboard',
    title: 'Asosiy',
    route: '/apps/ei',
    icon: Home,
  },
  {
    id: 'providers',
    title: "Xizmat ko'rsatuvchilar",
    icon: Store,
    children: [
      {
        id: 'providers-applications',
        title: 'Arizalar',
        route: '/apps/ei/providers/applications',
        icon: FileText,
      },
      {
        id: 'providers-conclusions',
        title: 'Xulosalar',
        route: '/apps/ei/providers/conclusions',
        icon: FileCheck2,
      },
      {
        id: 'providers-registry',
        title: 'Reyestr',
        route: '/apps/ei/providers/registry',
        icon: ListChecks,
      },
    ],
  },
  {
    id: 'children',
    title: 'Bolalar murojaatlari',
    icon: Baby,
    children: [
      {
        id: 'children-questionnaires',
        title: 'Arizalar',
        route: '/apps/ei/children/applications',
        icon: ScrollText,
      },
      {
        id: 'children-vouchers',
        title: 'Vaucherlar',
        route: '/apps/ei/children/vouchers',
        icon: TicketCheck,
      },
      {
        id: 'children-orders',
        title: 'Buyurtmalar',
        route: '/apps/ei/children/orders',
        icon: FileText,
      },
    ],
  },
  {
    id: 'serviceDelivery',
    title: "Xizmat ko'rsatish",
    icon: HeartHandshake,
    children: [
      {
        id: 'service-active',
        title: 'Xizmat olayotganlar',
        route: '/apps/ei/service/active',
        icon: UserCheck,
      },
      {
        id: 'service-plans',
        title: 'Erta aralashuv rejalari',
        route: '/apps/ei/service/plans',
        icon: ScrollText,
      },
      {
        id: 'service-attendance',
        title: 'Davomat',
        route: '/apps/ei/service/attendance',
        icon: ListChecks,
      },
      {
        id: 'service-terminated',
        title: 'Xizmati tugatilganlar',
        route: '/apps/ei/service/terminated',
        icon: UserX,
      },
    ],
  },
  {
    id: 'finance',
    title: 'Moliyalashtirish',
    icon: CreditCard,
    children: [
      {
        id: 'finance-subsidy-requests',
        title: 'Buyurtmanomalar',
        route: '/apps/ei/finance/subsidy-requests',
        icon: FileText,
      },
      {
        id: 'finance-payments',
        title: "Subsidiyalar / To'lovlar",
        route: '/apps/ei/finance/payments',
        icon: CreditCard,
      },
    ],
  },
]

export function getEiPage(pageKey: string) {
  return eiPages.find((page) => page.key === pageKey) ?? eiPages[0]!
}
