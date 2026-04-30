import type { RouteRecordRaw } from 'vue-router'

const AppLayout = () => import('@/layouts/app-layout/AppLayout.vue')
const LoginPage = () => import('@/features/auth/pages/LoginPage.vue')
const AppsPage = () => import('@/features/apps/pages/AppsPage.vue')
const DashboardPage = () => import('@/features/dashboard/pages/DashboardPage.vue')
const CitizensPage = () => import('@/features/citizens/pages/CitizensPage.vue')
const ApplicationsPage = () => import('@/features/applications/pages/ApplicationsPage.vue')
const BenefitsPage = () => import('@/features/benefits/pages/BenefitsPage.vue')
const PaymentsPage = () => import('@/features/payments/pages/PaymentsPage.vue')
const DocumentsPage = () => import('@/features/documents/pages/DocumentsPage.vue')
const MonitoringPage = () => import('@/features/monitoring/pages/MonitoringPage.vue')
const ReportsPage = () => import('@/features/reports/pages/ReportsPage.vue')
const SettingsPage = () => import('@/features/settings/pages/SettingsPage.vue')
const UsersPage = () => import('@/features/users/pages/UsersPage.vue')
const IPTKPage = () => import('@/features/iptk/pages/IPTKPage.vue')
const IPTKApplicationsListPage = () => import('@/features/iptk/pages/IPTKApplicationsListPage.vue')
const MuruvvatPage = () => import('@/features/muruvvat/pages/MuruvvatPage.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: 'Kirish',
      guestOnly: true,
      breadcrumb: ['Kirish'],
    },
  },
  {
    path: '/',
    component: AppLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: '/apps',
      },
      {
        path: 'apps',
        name: 'apps',
        component: AppsPage,
        meta: {
          title: 'Ilovalar',
          requiresAuth: true,
          breadcrumb: ['Ilovalar'],
        },
      },
      {
        path: 'apps/iptk',
        name: 'iptk-dashboard',
        component: IPTKPage,
        props: {
          pageKey: 'dashboard',
        },
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Dashboard'],
        },
      },
      {
        path: 'apps/iptk/info/info-1',
        name: 'iptk-info-1',
        component: IPTKPage,
        props: {
          pageKey: 'info-1',
        },
        meta: {
          title: 'Info 1',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 1'],
        },
      },
      {
        path: 'apps/iptk/info/info-2',
        name: 'iptk-info-2',
        component: IPTKPage,
        props: {
          pageKey: 'info-2',
        },
        meta: {
          title: 'Info 2',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 2'],
        },
      },
      {
        path: 'apps/iptk/info/info-3',
        name: 'iptk-info-3',
        component: IPTKPage,
        props: {
          pageKey: 'info-3',
        },
        meta: {
          title: 'Info 3',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Info 3'],
        },
      },
      {
        path: 'apps/iptk/info/info-4',
        name: 'iptk-info-4',
        component: IPTKPage,
        props: {
          pageKey: 'info-4',
        },
        meta: {
          title: 'Hujjatlar',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', 'Hujjatlar'],
        },
      },
      {
        path: 'apps/iptk/info/info-5',
        name: 'iptk-info-5',
        component: IPTKPage,
        props: {
          pageKey: 'info-5',
        },
        meta: {
          title: "So'rovnoma shabloni",
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', "So'rovnoma shabloni"],
        },
      },
      {
        path: 'apps/iptk/info/info-6',
        name: 'iptk-info-6',
        component: IPTKPage,
        props: {
          pageKey: 'info-6',
        },
        meta: {
          title: "Toifa guruhlari",
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Info', "Toifa guruhlari"],
        },
      },
      {
        path: 'apps/iptk/applications/list',
        name: 'iptk-applications-list',
        component: IPTKApplicationsListPage,
        meta: {
          title: 'Arizalar',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Arizalar'],
        },
      },
      {
        path: 'apps/iptk/applications/commissions',
        name: 'iptk-commissions-composition',
        component: IPTKPage,
        props: {
          pageKey: 'commissions-composition',
        },
        meta: {
          title: 'Komissiyalar tarkibi',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Komissiyalar tarkibi'],
        },
      },
      {
        path: 'apps/iptk/applications/assessment',
        name: 'iptk-applications-assessment',
        component: IPTKPage,
        props: {
          pageKey: 'applications-assessment',
        },
        meta: {
          title: 'Baholash',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Baholash'],
        },
      },
      {
        path: 'apps/iptk/applications/protocol',
        name: 'iptk-applications-protocol',
        component: IPTKPage,
        props: {
          pageKey: 'applications-protocol',
        },
        meta: {
          title: 'Bayonnoma',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Arizalar', 'Bayonnoma'],
        },
      },
      {
        path: 'apps/iptk/reports/applications',
        name: 'iptk-applications-report',
        component: IPTKPage,
        props: {
          pageKey: 'applications-report',
        },
        meta: {
          title: 'Arizalar bo‘yicha hisobot',
          requiresAuth: true,
          moduleKey: 'iptk',
          moduleTitle: 'IPTK',
          breadcrumb: ['Ilovalar', 'IPTK', 'Hisobotlar', 'Arizalar bo‘yicha hisobot'],
        },
      },
      {
        path: 'apps/muruvvat',
        name: 'muruvvat-dashboard',
        component: MuruvvatPage,
        props: {
          pageKey: 'dashboard',
        },
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Dashboard'],
        },
      },
      {
        path: 'apps/muruvvat/info/info-1',
        name: 'muruvvat-info-1',
        component: MuruvvatPage,
        props: {
          pageKey: 'info-1',
        },
        meta: {
          title: 'Info 1',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 1'],
        },
      },
      {
        path: 'apps/muruvvat/info/info-2',
        name: 'muruvvat-info-2',
        component: MuruvvatPage,
        props: {
          pageKey: 'info-2',
        },
        meta: {
          title: 'Info 2',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 2'],
        },
      },
      {
        path: 'apps/muruvvat/info/info-3',
        name: 'muruvvat-info-3',
        component: MuruvvatPage,
        props: {
          pageKey: 'info-3',
        },
        meta: {
          title: 'Info 3',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Info', 'Info 3'],
        },
      },
      {
        path: 'apps/muruvvat/applications/list',
        name: 'muruvvat-applications-list',
        component: MuruvvatPage,
        props: {
          pageKey: 'applications-list',
        },
        meta: {
          title: 'Arizalar ro‘yxati',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Arizalar ro‘yxati'],
        },
      },
      {
        path: 'apps/muruvvat/applications/statements',
        name: 'muruvvat-statements',
        component: MuruvvatPage,
        props: {
          pageKey: 'statements',
        },
        meta: {
          title: 'Dalolatnomalar',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Dalolatnomalar'],
        },
      },
      {
        path: 'apps/muruvvat/applications/decisions',
        name: 'muruvvat-decisions',
        component: MuruvvatPage,
        props: {
          pageKey: 'decisions',
        },
        meta: {
          title: 'Qarorlar',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Arizalar', 'Qarorlar'],
        },
      },
      {
        path: 'apps/muruvvat/homes/queues',
        name: 'muruvvat-queues',
        component: MuruvvatPage,
        props: {
          pageKey: 'queues',
        },
        meta: {
          title: 'Navbatlar',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Navbatlar'],
        },
      },
      {
        path: 'apps/muruvvat/homes/registered',
        name: 'muruvvat-registered',
        component: MuruvvatPage,
        props: {
          pageKey: 'registered',
        },
        meta: {
          title: 'Ro‘yxatga olinganlar',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Ro‘yxatga olinganlar'],
        },
      },
      {
        path: 'apps/muruvvat/homes/removed',
        name: 'muruvvat-removed',
        component: MuruvvatPage,
        props: {
          pageKey: 'removed',
        },
        meta: {
          title: 'Ro‘yxatdan chiqqanlar',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Internat uylari', 'Ro‘yxatdan chiqqanlar'],
        },
      },
      {
        path: 'apps/muruvvat/reports/applications',
        name: 'muruvvat-applications-report',
        component: MuruvvatPage,
        props: {
          pageKey: 'applications-report',
        },
        meta: {
          title: 'Arizalar bo‘yicha hisobot',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Hisobotlar', 'Arizalar bo‘yicha hisobot'],
        },
      },
      {
        path: 'apps/muruvvat/reports/homes',
        name: 'muruvvat-homes-report',
        component: MuruvvatPage,
        props: {
          pageKey: 'homes-report',
        },
        meta: {
          title: 'Internat uylari bo‘yicha hisobot',
          requiresAuth: true,
          moduleKey: 'muruvvat',
          moduleTitle: 'Muruvvat',
          breadcrumb: ['Ilovalar', 'Muruvvat', 'Hisobotlar', 'Internat uylari bo‘yicha hisobot'],
        },
      },
      {
        path: 'apps/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          moduleTitle: 'Dashboard',
          breadcrumb: ['Ilovalar', 'Dashboard'],
        },
      },
      {
        path: 'apps/citizens',
        name: 'citizens',
        component: CitizensPage,
        meta: {
          title: 'Fuqarolar reyestri',
          requiresAuth: true,
          moduleTitle: 'Fuqarolar reyestri',
          breadcrumb: ['Ilovalar', 'Fuqarolar reyestri'],
        },
      },
      {
        path: 'apps/applications',
        name: 'applications',
        component: ApplicationsPage,
        meta: {
          title: 'Arizalar',
          requiresAuth: true,
          moduleTitle: 'Arizalar',
          breadcrumb: ['Ilovalar', 'Arizalar'],
        },
      },
      {
        path: 'apps/benefits',
        name: 'benefits',
        component: BenefitsPage,
        meta: {
          title: 'Nafaqalar',
          requiresAuth: true,
          moduleTitle: 'Nafaqalar',
          breadcrumb: ['Ilovalar', 'Nafaqalar'],
        },
      },
      {
        path: 'apps/payments',
        name: 'payments',
        component: PaymentsPage,
        meta: {
          title: 'To‘lovlar',
          requiresAuth: true,
          moduleTitle: 'To‘lovlar',
          breadcrumb: ['Ilovalar', 'To‘lovlar'],
        },
      },
      {
        path: 'apps/documents',
        name: 'documents',
        component: DocumentsPage,
        meta: {
          title: 'Hujjatlar',
          requiresAuth: true,
          moduleTitle: 'Hujjatlar',
          breadcrumb: ['Ilovalar', 'Hujjatlar'],
        },
      },
      {
        path: 'apps/monitoring',
        name: 'monitoring',
        component: MonitoringPage,
        meta: {
          title: 'Monitoring',
          requiresAuth: true,
          moduleTitle: 'Monitoring',
          breadcrumb: ['Ilovalar', 'Monitoring'],
        },
      },
      {
        path: 'apps/reports',
        name: 'reports',
        component: ReportsPage,
        meta: {
          title: 'Hisobotlar',
          requiresAuth: true,
          moduleTitle: 'Hisobotlar',
          breadcrumb: ['Ilovalar', 'Hisobotlar'],
        },
      },
      {
        path: 'apps/settings',
        name: 'settings',
        component: SettingsPage,
        meta: {
          title: 'Sozlamalar',
          requiresAuth: true,
          moduleTitle: 'Sozlamalar',
          breadcrumb: ['Ilovalar', 'Sozlamalar'],
        },
      },
      {
        path: 'apps/users',
        name: 'users',
        component: UsersPage,
        meta: {
          title: 'Foydalanuvchilar va rollar',
          requiresAuth: true,
          moduleTitle: 'Foydalanuvchilar va rollar',
          breadcrumb: ['Ilovalar', 'Foydalanuvchilar va rollar'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/apps',
  },
]
