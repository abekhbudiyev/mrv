import {
  BedDouble,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardList,
  HeartHandshake,
  House,
  LayoutDashboard,
  LibraryBig,
  PackageCheck,
  Route,
} from 'lucide-vue-next'
import type { MuruvvatMenuItem, MuruvvatPageDefinition } from '@/features/muruvvat/types'

export const palliativePages: MuruvvatPageDefinition[] = [
  {
    key: 'dashboard',
    title: 'Bolalar palliativ yordami',
    description: 'Bola va oilaga yordamning o‘z vaqtida boshlanishi va uzluksiz davom etishi.',
    route: '/apps/palliative-care',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Bosh sahifa'],
  },
  {
    key: 'cases',
    title: 'Bolalar va yo‘llanmalar',
    description: 'Murojaat, baholash va yo‘llanmadan keyingi kuzatuvgacha — bola va oilaning yagona kartasi.',
    route: '/apps/palliative-care/cases',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Bolalar va yo‘llanmalar'],
  },
  {
    key: 'consilium',
    title: 'Konsilium',
    description: 'Yo‘llanma bergan muassasa xulosasi va Markazning alohida qabul qarori.',
    route: '/apps/palliative-care/consilium',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Konsilium'],
  },
  {
    key: 'inpatient',
    title: 'Statsionar',
    description: 'O‘rinlar, joylashtirish muddati, parvarish va oilaviy shifokorga topshirish.',
    route: '/apps/palliative-care/inpatient',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Statsionar'],
  },
  {
    key: 'mobile',
    title: 'Mobil yordam',
    description: 'Individual reja, brigadalar, uyga tashriflar va bajarilgan yordam natijalari.',
    route: '/apps/palliative-care/mobile',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Mobil yordam'],
  },
  {
    key: 'equipment',
    title: 'Jihoz berish',
    description: 'Zarur jihozlar, bepul foydalanish shartnomalari, berish va qaytarish hisobi.',
    route: '/apps/palliative-care/equipment',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Jihoz berish'],
  },
  {
    key: 'reports',
    title: 'Davriy hisobot',
    description: 'Ko‘rsatilgan yordam, tashriflar va resurslar bo‘yicha davriy natijalar.',
    route: '/apps/palliative-care/reports',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Davriy hisobot'],
  },
  {
    key: 'references',
    title: 'Kataloglar',
    description: 'Hududlar, xizmat turlari va resurslar katalogi.',
    route: '/apps/palliative-care/references',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Kataloglar'],
  },
  {
    key: 'process',
    title: 'Biznes jarayon',
    description: 'Har bir bosqichning mas’uli, qarori va keyingi yordami bir zanjirda.',
    route: '/apps/palliative-care/process',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Biznes jarayon'],
  },
  {
    key: 'guides',
    title: 'Qo‘llanmalar',
    description: 'Modul bilan ishlashni tushuntirish, qadamlar, blok-sxema va demo misollar orqali o‘rganing.',
    route: '/apps/palliative-care/guides',
    breadcrumb: ['Ilovalar', 'Bolalar palliativ yordami', 'Qo‘llanmalar'],
  },
]

export interface PalliativeMenuGroup {
  id: string
  title?: string
  items: (MuruvvatMenuItem & { route: string })[]
}

export const palliativeMenuGroups: PalliativeMenuGroup[] = [
  {
    id: 'overview',
    items: [
      { id: 'dashboard', title: 'Bosh sahifa', route: '/apps/palliative-care', icon: LayoutDashboard },
    ],
  },
  {
    id: 'workflow', title: 'Ish jarayoni',
    items: [
      { id: 'cases', title: 'Bolalar va yo‘llanmalar', route: '/apps/palliative-care/cases', icon: HeartHandshake },
      { id: 'consilium', title: 'Konsilium', route: '/apps/palliative-care/consilium', icon: ClipboardList },
      { id: 'inpatient', title: 'Statsionar', route: '/apps/palliative-care/inpatient', icon: BedDouble },
      { id: 'mobile', title: 'Mobil yordam', route: '/apps/palliative-care/mobile', icon: House },
      { id: 'equipment', title: 'Jihoz berish', route: '/apps/palliative-care/equipment', icon: PackageCheck },
    ],
  },
  {
    id: 'references', title: 'Ma’lumotnomalar',
    items: [
      { id: 'references', title: 'Kataloglar', route: '/apps/palliative-care/references', icon: LibraryBig },
    ],
  },
  {
    id: 'reports', title: 'Hisobotlar',
    items: [
      { id: 'reports', title: 'Davriy hisobot', route: '/apps/palliative-care/reports', icon: ChartNoAxesCombined },
    ],
  },
  {
    id: 'help', title: 'Yordam',
    items: [
      { id: 'process', title: 'Biznes jarayon', route: '/apps/palliative-care/process', icon: Route },
      { id: 'guides', title: 'Qo‘llanmalar', route: '/apps/palliative-care/guides', icon: BookOpen },
    ],
  },
]

export const palliativeMenu: MuruvvatMenuItem[] = palliativeMenuGroups.flatMap(group => group.items)

export function getPalliativePage(pageKey: string) {
  if (pageKey === 'case-detail') {
    return {
      ...palliativePages[1]!,
      key: 'case-detail',
      title: 'Bola va oila kartasi',
      description: 'Ehtiyoj, qaror, ko‘rsatilgan yordam va keyingi mas’ul bitta kartada.',
    }
  }

  return palliativePages.find((page) => page.key === pageKey)
}
