<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { Activity, BarChart3, CalendarDays, Check, CheckCheck, ChevronsLeft, ChevronsRight, ChevronDown, ChevronLeft, ChevronRight, Clock3, Download, Ellipsis, Eye, FileCheck2, Filter, LoaderCircle, Pencil, Plus, Search, TrendingUp, Trash2, UsersRound, X } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { getIPTKPage } from '@/features/iptk/config'
import { allAssessmentQuestions, barthelAssessmentQuestions, lawtonAssessmentQuestions, type AssessmentQuestion } from '@/features/muruvvat/assessment'
import { cn } from '@/shared/lib/utils'
import EmptyState from '@/shared/components/EmptyState.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'

type CommissionStatus = 'Jarayonda' | 'Yuborilgan' | 'Bekor qilingan' | 'Tasdiqlangan'
type AssessmentStatus = 'Jarayonda' | 'Yuborilgan' | 'Bekor qilingan' | 'Tasdiqlangan'
type CommissionWorkflowStage = 'Jarayonda' | 'Yuborilgan' | 'Tasdiqlangan' | 'Bekor qilingan'
type ServiceTypeStatus = 'Faol' | 'Nofaol'
type FeedbackType = 'success' | 'error' | 'info'
type AssessmentAnswers = Record<string, string>
type ApplicationReportStatus = 'Jarayonda' | 'Tasdiqlangan' | 'Bekor qilingan'
type ApplicationReportStep =
  | 'Ariza yaratildi'
  | 'Baholash jarayoni'
  | 'Qo‘shimcha hujjatlar yig‘ilmoqda'
  | 'IPTKga yuborildi'
  | 'IPTK qabul qildi'
  | 'Qayta ishlashga qaytarildi'
  | 'IPTK yig‘ilishiga kiritildi'
  | 'IPTK tekshiruvi o‘tkazildi'
  | 'Tasdiqlandi'
  | 'Boshqa xizmat tavsiya qilindi'
  | 'Bekor qilindi'
  | 'Rad etildi'
type ApplicationReportDateField = 'start' | 'end'

type PendingConfirmation = {
  tone: 'success' | 'destructive'
  title: string
  description: string
  confirmLabel: string
  action: () => void
}

type DocumentHistoryEntry = {
  operation: string
  performer: string
  performedAt: string
  tone: 'process' | 'success' | 'destructive'
}

const NOTIFICATION_DURATION = 2600

interface CommissionMemberDraft {
  id: string
  pinfl: string
  fullName: string
  birthDate: string
  position: string
  phone: string
  organization: string
  region: string
  district: string
  error: string
}

interface CommissionLookupProfile {
  pinfl: string
  fullName: string
  birthDate: string
  region: string
  district: string
}

interface CommissionSearchState {
  pinfl: string
  profile: CommissionLookupProfile | null
  position: string
  phone: string
  error: string
}

interface CommissionRecord {
  id: string
  documentNumber: string
  region: string
  chair: string
  chairPinfl: string
  chairPosition: string
  chairPhone: string
  deputyChair: string
  deputyChairPinfl: string
  deputyChairPosition: string
  deputyChairPhone: string
  secretary: string
  secretaryPinfl: string
  secretaryPosition: string
  secretaryPhone: string
  members: CommissionMemberDraft[]
  status: CommissionStatus
  workflowStage: CommissionWorkflowStage
  createdAt: string
  updatedAt: string
  submittedAt?: string
  approvedAt?: string
  rejectedAt?: string
}

interface AssessmentRecord {
  id: string
  documentNumber: string
  createdAt: string
  serviceRecipient: string
  serviceRecipientPinfl: string
  serviceType: string
  result: string
  answers?: AssessmentAnswers
  hasCloseRelatives?: boolean
  hasHousing?: boolean
  region: string
  district: string
  status: AssessmentStatus
}

interface LocalizedValue {
  uzLatn: string
  uzCyrl: string
  kaaLatn: string
  ru: string
}

interface ServiceTypeRecord {
  id: string
  date: string
  shortName: LocalizedValue
  fullName: LocalizedValue
  minAge: number
  maxAge: number | null
  diagnosisIds: string[]
  contraindicationIds: string[]
  documentIds: string[]
  status: ServiceTypeStatus
}

interface ServiceTypeForm {
  shortName: LocalizedValue
  fullName: LocalizedValue
  minAge: string
  maxAge: string
  diagnosisIds: string[]
  contraindicationIds: string[]
  documentIds: string[]
  status: ServiceTypeStatus | ''
}

interface DiagnosisRecord {
  id: string
  date: string
  shortName: LocalizedValue
  fullName: LocalizedValue
  icdCodes: string[]
  status: ServiceTypeStatus
}

interface QuestionnaireTemplateAnswer {
  id: string
  text: string
  score: number
}

interface QuestionnaireTemplateQuestion {
  id: string
  text: string
  answers: QuestionnaireTemplateAnswer[]
}

interface QuestionnaireTemplateGroup {
  id: string
  title: string
  questions: QuestionnaireTemplateQuestion[]
}

interface QuestionnaireTemplateAnswerDraft {
  id: string
  text: string
  score: string
}

interface QuestionnaireTemplateQuestionDraft {
  id: string
  text: string
  answers: QuestionnaireTemplateAnswerDraft[]
}

interface QuestionnaireTemplateGroupDraft {
  id: string
  title: string
  questions: QuestionnaireTemplateQuestionDraft[]
}

interface QuestionnaireTemplateRecord extends DiagnosisRecord {
  questionGroups: QuestionnaireTemplateGroup[]
}

interface CategoryGroupRecord extends DiagnosisRecord {
  minScore: number
  maxScore: number
}

interface DiagnosisForm {
  shortName: LocalizedValue
  fullName: LocalizedValue
  icdCodes: string[]
  status: ServiceTypeStatus | ''
  questionGroups: QuestionnaireTemplateGroupDraft[]
  minScore: string
  maxScore: string
}

const props = defineProps<{
  pageKey: string
}>()

const page = computed(() => getIPTKPage(props.pageKey))
const isDashboardPage = computed(() => props.pageKey === 'dashboard')
const isCommissionCompositionPage = computed(() => props.pageKey === 'commissions-composition')
const isAssessmentPage = computed(() => props.pageKey === 'applications-assessment')
const isServiceTypesPage = computed(() => props.pageKey === 'info-1')
const isDiagnosesPage = computed(() => props.pageKey === 'info-2')
const isContraindicationsPage = computed(() => props.pageKey === 'info-3')
const isDocumentsPage = computed(() => props.pageKey === 'info-4')
const isQuestionnaireTemplatesPage = computed(() => props.pageKey === 'info-5')
const isCategoryGroupsPage = computed(() => props.pageKey === 'info-6')
const isApplicationsReportPage = computed(() => props.pageKey === 'applications-report')
const isMedicalReferencePage = computed(() => (
  isDiagnosesPage.value
  || isContraindicationsPage.value
  || isDocumentsPage.value
  || isQuestionnaireTemplatesPage.value
  || isCategoryGroupsPage.value
))
const requiresMedicalReferenceIcd = computed(() => isDiagnosesPage.value || isContraindicationsPage.value)

const regionOptions = [
  "Qoraqalpog'iston Respublikasi",
  'Andijon viloyati',
  'Buxoro viloyati',
  "Farg'ona viloyati",
  'Jizzax viloyati',
  'Namangan viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  'Samarqand viloyati',
  'Sirdaryo viloyati',
  'Surxondaryo viloyati',
  'Toshkent viloyati',
  'Xorazm viloyati',
  'Toshkent shahri',
] as const

const statusClassMap: Record<CommissionStatus | AssessmentStatus, string> = {
  Jarayonda: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300',
  Yuborilgan: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/20 dark:text-sky-300',
  Tasdiqlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300',
  'Bekor qilingan': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
}

const applicationReportStatuses: ApplicationReportStatus[] = ['Jarayonda', 'Tasdiqlangan', 'Bekor qilingan']
const applicationReportSteps: ApplicationReportStep[] = [
  'Ariza yaratildi',
  'Baholash jarayoni',
  'Qo‘shimcha hujjatlar yig‘ilmoqda',
  'IPTKga yuborildi',
  'IPTK qabul qildi',
  'Qayta ishlashga qaytarildi',
  'IPTK yig‘ilishiga kiritildi',
  'IPTK tekshiruvi o‘tkazildi',
  'Tasdiqlandi',
  'Boshqa xizmat tavsiya qilindi',
  'Bekor qilindi',
  'Rad etildi',
]
const applicationReportStepStatusMap: Record<ApplicationReportStep, ApplicationReportStatus> = {
  'Ariza yaratildi': 'Jarayonda',
  'Baholash jarayoni': 'Jarayonda',
  'Qo‘shimcha hujjatlar yig‘ilmoqda': 'Jarayonda',
  'IPTKga yuborildi': 'Jarayonda',
  'IPTK qabul qildi': 'Jarayonda',
  'Qayta ishlashga qaytarildi': 'Jarayonda',
  'IPTK yig‘ilishiga kiritildi': 'Jarayonda',
  'IPTK tekshiruvi o‘tkazildi': 'Jarayonda',
  Tasdiqlandi: 'Tasdiqlangan',
  'Boshqa xizmat tavsiya qilindi': 'Tasdiqlangan',
  'Bekor qilindi': 'Bekor qilingan',
  'Rad etildi': 'Bekor qilingan',
}
const applicationReportServiceTypes = [
  'Huzur',
  'Madad',
  'Ijtimoiy ta’til',
  'Uyda qarab turish',
  'Yangi kun',
] as const
const applicationReportDisabilityGroups = ['1-guruh', '2-guruh'] as const
const applicationReportDiagnoses = ['F00-F03', 'F71', 'F72', 'F73'] as const
const applicationReportGenders = ['Erkak', 'Ayol'] as const
const applicationReportAgeGroups = ['18-55/60', '55/60+'] as const
const applicationReportMetricGroups = [
  {
    key: 'serviceTypes',
    label: 'Xizmat turi',
    options: applicationReportServiceTypes,
  },
  {
    key: 'disabilityGroups',
    label: 'Nogironlik guruhi',
    options: applicationReportDisabilityGroups,
  },
  {
    key: 'diagnoses',
    label: 'Tashxis',
    options: applicationReportDiagnoses,
  },
  {
    key: 'genders',
    label: 'Jins',
    options: applicationReportGenders,
  },
  {
    key: 'ageGroups',
    label: 'Yosh',
    options: applicationReportAgeGroups,
  },
] as const
type ApplicationReportMetricKey = typeof applicationReportMetricGroups[number]['key']
type ApplicationReportMetricOption = typeof applicationReportMetricGroups[number]['options'][number]
const applicationReportRegions = [
  'Qoraqalpog‘iston Respublikasi',
  'Andijon viloyati',
  'Buxoro viloyati',
  'Farg‘ona viloyati',
  'Jizzax viloyati',
  'Namangan viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  'Samarqand viloyati',
  'Sirdaryo viloyati',
  'Surxondaryo viloyati',
  'Toshkent viloyati',
  'Xorazm viloyati',
  'Toshkent shahri',
]
const applicationReportDistricts: Record<string, string[]> = {
  'Qoraqalpog‘iston Respublikasi': ['Nukus shahri', 'Beruniy tumani', 'Qo‘ng‘irot tumani'],
  'Andijon viloyati': ['Andijon shahri', 'Asaka tumani', 'Xo‘jaobod tumani'],
  'Buxoro viloyati': ['Buxoro shahri', 'G‘ijduvon tumani', 'Kogon tumani'],
  'Farg‘ona viloyati': ['Farg‘ona shahri', 'Qo‘qon shahri', 'Marg‘ilon shahri'],
  'Jizzax viloyati': ['Jizzax shahri', 'Zomin tumani', 'G‘allaorol tumani'],
  'Namangan viloyati': ['Namangan shahri', 'Chortoq tumani', 'Pop tumani'],
  'Navoiy viloyati': ['Navoiy shahri', 'Zarafshon shahri', 'Karmana tumani'],
  'Qashqadaryo viloyati': ['Qarshi shahri', 'Shahrisabz shahri', 'Kitob tumani'],
  'Samarqand viloyati': ['Samarqand shahri', 'Kattaqo‘rg‘on shahri', 'Urgut tumani'],
  'Sirdaryo viloyati': ['Guliston shahri', 'Yangiyer shahri', 'Sirdaryo tumani'],
  'Surxondaryo viloyati': ['Termiz shahri', 'Denov tumani', 'Sherobod tumani'],
  'Toshkent viloyati': ['Zangiota tumani', 'Chirchiq shahri', 'Olmaliq shahri'],
  'Toshkent shahri': ['Yunusobod tumani', 'Chilonzor tumani', 'Yakkasaroy tumani'],
  'Xorazm viloyati': ['Urganch shahri', 'Xiva shahri', 'Hazorasp tumani'],
}

const assessmentStatusOptions: AssessmentStatus[] = ['Jarayonda', 'Yuborilgan', 'Bekor qilingan', 'Tasdiqlangan']
const commissionStatusOptions: CommissionStatus[] = ['Jarayonda', 'Yuborilgan', 'Bekor qilingan', 'Tasdiqlangan']

const workflowStageLabels: Record<CommissionWorkflowStage, string> = {
  Jarayonda: 'Jarayonda',
  Yuborilgan: 'Yuborilgan',
  Tasdiqlangan: 'Tasdiqlangan',
  'Bekor qilingan': 'Bekor qilingan',
}

const commissions = ref<CommissionRecord[]>([
  {
    id: '1',
    documentNumber: 'IPTK-TARKIB-2026-001',
    region: 'Samarqand viloyati',
    chair: 'Abdullayev Komiljon Zafarovich',
    chairPinfl: '10000000001001',
    chairPosition: 'Komissiya raisi',
    chairPhone: '+998901234567',
    deputyChair: 'Saidov Muzaffar Anvarovich',
    deputyChairPinfl: '10000000001002',
    deputyChairPosition: "Rais o'rinbosari",
    deputyChairPhone: '+998901234568',
    secretary: 'Karimova Dilnoza Bahrom qizi',
    secretaryPinfl: '10000000001003',
    secretaryPosition: 'Komissiya kotibi',
    secretaryPhone: '+998901234569',
    members: [
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000001',
        fullName: "Rasulov Sherzod G'ayratovich",
        birthDate: '14.03.1984',
        position: 'Psixiatr',
        phone: '+998901112233',
        organization: 'Ruhiy salomatlik markazi',
        region: 'Samarqand viloyati',
        district: 'Samarqand shahri',
        error: '',
      },
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000002',
        fullName: 'Bozorova Nilufar Sodiq qizi',
        birthDate: '02.07.1988',
        position: 'Nevropatolog',
        phone: '+998911234567',
        organization: "Hududiy sog'liqni saqlash boshqarmasi",
        region: 'Samarqand viloyati',
        district: 'Urgut tumani',
        error: '',
      },
    ],
    status: 'Jarayonda',
    workflowStage: 'Jarayonda',
    createdAt: '2026-04-10 09:30',
    updatedAt: '2026-04-10 09:30',
  },
  {
    id: '2',
    documentNumber: 'IPTK-TARKIB-2026-002',
    region: 'Toshkent shahri',
    chair: 'Raximov Oybek Jalolovich',
    chairPinfl: '10000000002001',
    chairPosition: 'Komissiya raisi',
    chairPhone: '+998901234567',
    deputyChair: 'Tursunova Mohira Ahror qizi',
    deputyChairPinfl: '10000000002002',
    deputyChairPosition: "Rais o'rinbosari",
    deputyChairPhone: '+998901234568',
    secretary: "Jo'rayeva Sevara Ikrom qizi",
    secretaryPinfl: '10000000002003',
    secretaryPosition: 'Komissiya kotibi',
    secretaryPhone: '+998901234569',
    members: [
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000003',
        fullName: 'Yusupov Odilbek Akbarovich',
        birthDate: '22.11.1981',
        position: 'Psixolog',
        phone: '+998937654321',
        organization: 'Hududiy IPTK',
        region: 'Toshkent shahri',
        district: 'Mirzo Ulug‘bek tumani',
        error: '',
      },
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000004',
        fullName: 'Eshonqulova Shahlo Islom qizi',
        birthDate: '09.05.1987',
        position: 'Ijtimoiy xodim',
        phone: '+998909998877',
        organization: 'Inson markazi',
        region: 'Toshkent shahri',
        district: 'Shayxontohur tumani',
        error: '',
      },
    ],
    status: 'Yuborilgan',
    workflowStage: 'Yuborilgan',
    createdAt: '2026-04-11 14:20',
    updatedAt: '2026-04-12 10:05',
    submittedAt: '2026-04-12 09:10',
  },
  {
    id: '3',
    documentNumber: 'IPTK-TARKIB-2026-003',
    region: 'Buxoro viloyati',
    chair: 'Sharipov Bobur Alisherovich',
    chairPinfl: '10000000003001',
    chairPosition: 'Komissiya raisi',
    chairPhone: '+998901234567',
    deputyChair: 'Aminova Yulduz Oybek qizi',
    deputyChairPinfl: '10000000003002',
    deputyChairPosition: "Rais o'rinbosari",
    deputyChairPhone: '+998901234568',
    secretary: 'Qobilova Shahnoza Rustam qizi',
    secretaryPinfl: '10000000003003',
    secretaryPosition: 'Komissiya kotibi',
    secretaryPhone: '+998901234569',
    members: [
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000005',
        fullName: 'Meliqulov Doston Otabekovich',
        birthDate: '17.01.1983',
        position: 'Psixiatr',
        phone: '+998935551122',
        organization: "Viloyat ruhiy salomatlik markazi",
        region: 'Buxoro viloyati',
        district: 'Buxoro shahri',
        error: '',
      },
    ],
    status: 'Tasdiqlangan',
    workflowStage: 'Tasdiqlangan',
    createdAt: '2026-04-13 11:40',
    updatedAt: '2026-04-13 17:25',
    submittedAt: '2026-04-13 14:00',
    approvedAt: '2026-04-13 17:25',
  },
  {
    id: '4',
    documentNumber: 'IPTK-TARKIB-2026-004',
    region: 'Andijon viloyati',
    chair: 'Tursunov Javlon Komilovich',
    chairPinfl: '10000000004001',
    chairPosition: 'Komissiya raisi',
    chairPhone: '+998901234567',
    deputyChair: 'Xolmatova Madina Ulug‘bek qizi',
    deputyChairPinfl: '10000000004002',
    deputyChairPosition: "Rais o'rinbosari",
    deputyChairPhone: '+998901234568',
    secretary: 'Norboyeva Gulbahor Aziz qizi',
    secretaryPinfl: '10000000004003',
    secretaryPosition: 'Komissiya kotibi',
    secretaryPhone: '+998901234569',
    members: [
      {
        id: crypto.randomUUID(),
        pinfl: '10000000000006',
        fullName: 'Akramov Sanjar Bahromovich',
        birthDate: '12.12.1982',
        position: 'Psixiatr',
        phone: '+998901112244',
        organization: 'Viloyat ruhiy salomatlik markazi',
        region: 'Andijon viloyati',
        district: 'Andijon shahri',
        error: '',
      },
    ],
    status: 'Bekor qilingan',
    workflowStage: 'Bekor qilingan',
    createdAt: '2026-04-14 13:15',
    updatedAt: '2026-04-15 10:00',
    submittedAt: '2026-04-14 16:20',
    rejectedAt: '2026-04-15 10:00',
  },
])

const assessments = ref<AssessmentRecord[]>([
  {
    id: '1',
    documentNumber: 'BHL-2026-001',
    createdAt: '2026-04-12 10:20',
    serviceRecipient: 'ALIYEV AZIZBEK ANVAR O‘G‘LI',
    serviceRecipientPinfl: '10000000000001',
    serviceType: 'Huzur',
    answers: buildAssessmentAnswersByScoreMode('low'),
    result: 'Tezkor guruh',
    hasCloseRelatives: false,
    hasHousing: false,
    region: 'Toshkent viloyati',
    district: 'Zangiota tumani',
    status: 'Jarayonda',
  },
  {
    id: '2',
    documentNumber: 'BHL-2026-002',
    createdAt: '2026-04-13 11:10',
    serviceRecipient: 'KARIMOVA MOHIRA BAXTIYOR QIZI',
    serviceRecipientPinfl: '10000000000137',
    serviceType: 'Madad',
    answers: buildAssessmentAnswersByScoreMode('high'),
    result: 'Rejali guruh',
    hasCloseRelatives: true,
    hasHousing: true,
    region: 'Samarqand viloyati',
    district: 'Samarqand shahri',
    status: 'Yuborilgan',
  },
  {
    id: '3',
    documentNumber: 'BHL-2026-003',
    createdAt: '2026-04-14 15:45',
    serviceRecipient: 'RASULOV DOSTON ELYOR O‘G‘LI',
    serviceRecipientPinfl: '10000000000274',
    serviceType: 'Huzur',
    answers: buildAssessmentAnswersByScoreMode('low'),
    result: 'Baholash to‘xtatilgan',
    hasCloseRelatives: false,
    hasHousing: false,
    region: 'Andijon viloyati',
    district: 'Andijon shahri',
    status: 'Tasdiqlangan',
  },
  {
    id: '4',
    documentNumber: 'BHL-2026-004',
    createdAt: '2026-04-15 09:05',
    serviceRecipient: 'TURSUNOVA SHAHNOZA SHERZOD QIZI',
    serviceRecipientPinfl: '10000000000411',
    serviceType: 'Madad',
    result: 'Rejali guruh',
    hasCloseRelatives: true,
    hasHousing: true,
    region: "Farg'ona viloyati",
    district: "Qo'qon shahri",
    status: 'Bekor qilingan',
  },
]) 

const serviceTypes = ref<ServiceTypeRecord[]>([
  {
    id: 'XIZ-2026-001',
    date: '2026-04-10 09:30',
    shortName: {
      uzLatn: 'Huzur markazi',
      uzCyrl: 'Ҳузур маркази',
      kaaLatn: 'Huzur orayı',
      ru: 'Центр Хузур',
    },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsni “Huzur” markaziga joylashtirish',
      uzCyrl: 'Ногиронлиги бўлган шахсни “Ҳузур” марказига жойлаштириш',
      kaaLatn: 'Mayıplıǵı bolǵan shaxstı “Huzur” orayına jaylastırıw',
      ru: 'Размещение лица с инвалидностью в центр «Хузур»',
    },
    minAge: 18,
    maxAge: null,
    diagnosisIds: ['TASH-2026-002', 'TASH-2026-003', 'TASH-2026-004', 'TASH-2026-001'],
    contraindicationIds: ['QK-2026-001', 'QK-2026-002', 'QK-2026-003', 'QK-2026-004'],
    documentIds: ['HUJ-2026-001', 'HUJ-2026-002', 'HUJ-2026-003', 'HUJ-2026-004', 'HUJ-2026-005'],
    status: 'Faol',
  },
  {
    id: 'XIZ-2026-002',
    date: '2026-04-11 14:20',
    shortName: {
      uzLatn: 'Madad uylari',
      uzCyrl: 'Мадад уйлари',
      kaaLatn: 'Madad úyleri',
      ru: 'Дома Мадад',
    },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsni kichik hajmli “Madad” uylari xizmatiga joylashtirish',
      uzCyrl: 'Ногиронлиги бўлган шахсни кичик ҳажмли “Мадад” уйлари хизматига жойлаштириш',
      kaaLatn: 'Mayıplıǵı bolǵan shaxstı kishi kólemli “Madad” úyleri xızmetine jaylastırıw',
      ru: 'Размещение лица с инвалидностью в услугу домов малого объема «Мадад»',
    },
    minAge: 18,
    maxAge: null,
    diagnosisIds: ['TASH-2026-002', 'TASH-2026-003', 'TASH-2026-004', 'TASH-2026-001'],
    contraindicationIds: ['QK-2026-001', 'QK-2026-002', 'QK-2026-003', 'QK-2026-004'],
    documentIds: ['HUJ-2026-001', 'HUJ-2026-002', 'HUJ-2026-006', 'HUJ-2026-007', 'HUJ-2026-008', 'HUJ-2026-009', 'HUJ-2026-010', 'HUJ-2026-011', 'HUJ-2026-012', 'HUJ-2026-013', 'HUJ-2026-014', 'HUJ-2026-015', 'HUJ-2026-016', 'HUJ-2026-003', 'HUJ-2026-004', 'HUJ-2026-005'],
    status: 'Faol',
  },
  {
    id: 'XIZ-2026-003',
    date: '2026-04-12 10:15',
    shortName: {
      uzLatn: 'Ijtimoiy ta’til',
      uzCyrl: 'Ижтимоий таътил',
      kaaLatn: 'Áleumetlik dem alıs',
      ru: 'Социальный отпуск',
    },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsni “Ijtimoiy ta’til” qisqa muddatli joylashtirish xizmatiga yo‘naltirish',
      uzCyrl: 'Ногиронлиги бўлган шахсни “Ижтимоий таътил” қисқа муддатли жойлаштириш хизматига йўналтириш',
      kaaLatn: 'Mayıplıǵı bolǵan shaxstı “Áleumetlik dem alıs” qısqa múddetli jaylastırıw xızmetine jiberiw',
      ru: 'Направление лица с инвалидностью в краткосрочную услугу «Социальный отпуск»',
    },
    minAge: 18,
    maxAge: null,
    diagnosisIds: ['TASH-2026-002', 'TASH-2026-003', 'TASH-2026-004', 'TASH-2026-001'],
    contraindicationIds: ['QK-2026-001', 'QK-2026-002', 'QK-2026-003', 'QK-2026-004'],
    documentIds: ['HUJ-2026-001', 'HUJ-2026-002'],
    status: 'Faol',
  },
  {
    id: 'XIZ-2026-004',
    date: '2026-04-13 11:40',
    shortName: {
      uzLatn: 'Uy sharoitida qarab turish',
      uzCyrl: 'Уй шароитида қараб туриш',
      kaaLatn: 'Úy sharayatında qarap turıw',
      ru: 'Уход на дому',
    },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsni uy sharoitida qarab turish xizmatiga yo‘naltirish',
      uzCyrl: 'Ногиронлиги бўлган шахсни уй шароитида қараб туриш хизматига йўналтириш',
      kaaLatn: 'Mayıplıǵı bolǵan shaxstı úy sharayatında qarap turıw xızmetine jiberiw',
      ru: 'Направление лица с инвалидностью на услугу ухода на дому',
    },
    minAge: 18,
    maxAge: null,
    diagnosisIds: ['TASH-2026-004'],
    contraindicationIds: ['QK-2026-002', 'QK-2026-003'],
    documentIds: ['HUJ-2026-001', 'HUJ-2026-002'],
    status: 'Faol',
  },
  {
    id: 'XIZ-2026-005',
    date: '2026-04-14 15:05',
    shortName: {
      uzLatn: 'Yangi kun',
      uzCyrl: 'Янги кун',
      kaaLatn: 'Jańa kún',
      ru: 'Янги кун',
    },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsni “Yangi kun” kunduzgi qarab turish xizmatiga yo‘naltirish',
      uzCyrl: 'Ногиронлиги бўлган шахсни “Янги кун” кундузги қараб туриш хизматига йўналтириш',
      kaaLatn: 'Mayıplıǵı bolǵan shaxstı “Jańa kún” kúndizgi qarap turıw xızmetine jiberiw',
      ru: 'Направление лица с инвалидностью на дневную услугу ухода «Янги кун»',
    },
    minAge: 18,
    maxAge: null,
    diagnosisIds: ['TASH-2026-002', 'TASH-2026-003', 'TASH-2026-004', 'TASH-2026-001'],
    contraindicationIds: ['QK-2026-001', 'QK-2026-002', 'QK-2026-003', 'QK-2026-004'],
    documentIds: ['HUJ-2026-001', 'HUJ-2026-002'],
    status: 'Faol',
  },
])

const diagnoses = ref<DiagnosisRecord[]>([
  {
    id: 'TASH-2026-001',
    date: '2026-04-10 09:30',
    shortName: {
      uzLatn: 'F00-F03',
      uzCyrl: 'F00-F03',
      kaaLatn: 'F00-F03',
      ru: 'F00-F03',
    },
    fullName: {
      uzLatn: 'Demensiya',
      uzCyrl: 'Деменция',
      kaaLatn: 'Demensiya',
      ru: 'Деменция',
    },
    icdCodes: [
      'F00',
      'F00.0',
      'F00.1',
      'F00.2',
      'F00.9',
      'F01',
      'F01.0',
      'F01.1',
      'F01.2',
      'F01.3',
      'F01.8',
      'F01.9',
      'F02',
      'F02.0',
      'F02.1',
      'F02.2',
      'F02.3',
      'F02.4',
      'F02.8',
      'F03',
    ],
    status: 'Faol',
  },
  {
    id: 'TASH-2026-002',
    date: '2026-04-11 14:20',
    shortName: {
      uzLatn: 'F71',
      uzCyrl: 'F71',
      kaaLatn: 'F71',
      ru: 'F71',
    },
    fullName: {
      uzLatn: "Mo'tadil darajadagi aqliy zaiflik",
      uzCyrl: 'Мўътадил даражадаги ақлий заифлик',
      kaaLatn: 'Ortasha dárejedegi aqıllıq ázizlik',
      ru: 'Умеренная умственная отсталость',
    },
    icdCodes: ['F71', 'F71.0', 'F71.1', 'F71.8', 'F71.9'],
    status: 'Faol',
  },
  {
    id: 'TASH-2026-003',
    date: '2026-04-12 10:15',
    shortName: {
      uzLatn: 'F72',
      uzCyrl: 'F72',
      kaaLatn: 'F72',
      ru: 'F72',
    },
    fullName: {
      uzLatn: "Og'ir darajadagi aqliy zaiflik",
      uzCyrl: 'Оғир даражадаги ақлий заифлик',
      kaaLatn: 'Awır dárejedegi aqıllıq ázizlik',
      ru: 'Тяжелая умственная отсталость',
    },
    icdCodes: ['F72', 'F72.0', 'F72.1', 'F72.8', 'F72.9'],
    status: 'Faol',
  },
  {
    id: 'TASH-2026-004',
    date: '2026-04-13 11:40',
    shortName: {
      uzLatn: 'F73',
      uzCyrl: 'F73',
      kaaLatn: 'F73',
      ru: 'F73',
    },
    fullName: {
      uzLatn: 'Chuqur darajadagi aqliy zaiflik',
      uzCyrl: 'Чуқур даражадаги ақлий заифлик',
      kaaLatn: 'Tereń dárejedegi aqıllıq ázizlik',
      ru: 'Глубокая умственная отсталость',
    },
    icdCodes: ['F73', 'F73.0', 'F73.1', 'F73.8', 'F73.9'],
    status: 'Faol',
  },
])

const contraindications = ref<DiagnosisRecord[]>([
  {
    id: 'QK-2026-001',
    date: '2026-04-10 09:30',
    shortName: {
      uzLatn: 'F40',
      uzCyrl: 'F40',
      kaaLatn: 'F40',
      ru: 'F40',
    },
    fullName: {
      uzLatn: "Tez-tez, har oyda ikki martadan ko'p tutqanoq xurujlari sodir bo'ladigan epilepsiya",
      uzCyrl: "Тез-тез, ҳар ойда икки мартадан кўп тутқаноқ хуружлари содир бўладиган эпилепция",
      kaaLatn: "Tez-tez, har ayda eki márteden kóp tutqanaq xurujları júz beretuǵın epilepsiya",
      ru: "Эпилепсия с частыми приступами, более двух раз в месяц",
    },
    icdCodes: ['F40'],
    status: 'Faol',
  },
  {
    id: 'QK-2026-002',
    date: '2026-04-11 14:20',
    shortName: {
      uzLatn: 'F20-F29',
      uzCyrl: 'F20-F29',
      kaaLatn: 'F20-F29',
      ru: 'F20-F29',
    },
    fullName: {
      uzLatn: "Shizofreniya, shizotipik va alahlashli buzilishlar",
      uzCyrl: "Шизофрения, шизотипик ва алаҳлашли бузилишлар",
      kaaLatn: "Shizofreniya, shizotipik hám alahlı buzılıslar",
      ru: "Шизофрения, шизотипические и бредовые расстройства",
    },
    icdCodes: ['F20', 'F21', 'F22', 'F23', 'F24', 'F25', 'F28', 'F29'],
    status: 'Faol',
  },
  {
    id: 'QK-2026-003',
    date: '2026-04-12 10:15',
    shortName: {
      uzLatn: 'F60-F69',
      uzCyrl: 'F60-F69',
      kaaLatn: 'F60-F69',
      ru: 'F60-F69',
    },
    fullName: {
      uzLatn: "Balog'at yoshida shaxsiyat va fe'l-atvor buzilishlari",
      uzCyrl: "Балоғат ёшида шахсият ва феъл-атвор бузилишлари",
      kaaLatn: "Erjetken jasta shaxsiyat hám minez-qulıq buzılısları",
      ru: "Расстройства личности и поведения в зрелом возрасте",
    },
    icdCodes: ['F60', 'F61', 'F62', 'F63', 'F64', 'F65', 'F66', 'F68', 'F69'],
    status: 'Faol',
  },
  {
    id: 'QK-2026-004',
    date: '2026-04-13 11:40',
    shortName: {
      uzLatn: 'F15-F19',
      uzCyrl: 'F15-F19',
      kaaLatn: 'F15-F19',
      ru: 'F15-F19',
    },
    fullName: {
      uzLatn: "Sil (tuberkulyoz)",
      uzCyrl: "Сил (туберкулёз)",
      kaaLatn: "Sil (tuberkulyoz)",
      ru: "Туберкулез",
    },
    icdCodes: ['F15', 'F16', 'F17', 'F18', 'F19'],
    status: 'Faol',
  },
])

const documents = ref<DiagnosisRecord[]>([
  {
    id: 'HUJ-2026-001',
    date: '2026-04-10 09:30',
    shortName: { uzLatn: '027-shakl', uzCyrl: '027-шакл', kaaLatn: '027-forma', ru: 'Форма 027' },
    fullName: {
      uzLatn: 'Tibbiy kartadan batafsil ko‘chirma, oilaviy shifokor va psixiatr xulosalari bilan',
      uzCyrl: 'Тиббий картадан батафсил кўчирма, оилавий шифокор ва психиатр хулосалари билан',
      kaaLatn: 'Medicinalıq kartadan tolıq kóshirme, shańaraq dárygeri hám psixiatr juwmaqları menen',
      ru: 'Подробная выписка из медицинской карты с заключениями семейного врача и психиатра',
    },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-002',
    date: '2026-04-10 09:35',
    shortName: { uzLatn: 'Kasallik tarixi', uzCyrl: 'Касаллик тарихи', kaaLatn: 'Awırıw tariyxı', ru: 'История болезни' },
    fullName: {
      uzLatn: 'Ruhiy-asab kasalliklari shifoxonasida oxirgi 5 yil davomida davolanganligi to‘g‘risida kasallik tarixidan ko‘chirma',
      uzCyrl: 'Руҳий-асаб касалликлари шифохонасида охирги 5 йил давомида даволанганлиги тўғрисида касаллик тарихидан кўчирма',
      kaaLatn: 'Sońǵı 5 jıl ishinde psixonevrologiyalıq awırıwlar shıypaxanasında emlengenligi haqqında awırıw tariyxınan kóshirme',
      ru: 'Выписка из истории болезни о лечении в психоневрологической больнице за последние 5 лет',
    },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-003',
    date: '2026-04-10 09:40',
    shortName: { uzLatn: 'Vasiylik qarori', uzCyrl: 'Васийлик қарори', kaaLatn: 'Qamqorlıq qararı', ru: 'Решение об опеке' },
    fullName: {
      uzLatn: 'Nogironligi bo‘lgan shaxsga vasiy tayinlash to‘g‘risidagi qaror',
      uzCyrl: 'Ногиронлиги бўлган шахсга васий тайинлаш тўғрисидаги қарор',
      kaaLatn: 'Mayıplıǵı bolǵan shaxsqa qamqor tayınlaw haqqında qarar',
      ru: 'Решение о назначении опекуна лицу с инвалидностью',
    },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-004',
    date: '2026-04-10 09:45',
    shortName: { uzLatn: 'Sud qarori', uzCyrl: 'Суд қарори', kaaLatn: 'Sud qararı', ru: 'Решение суда' },
    fullName: {
      uzLatn: 'Shaxsni muomalaga layoqatsiz deb topish to‘g‘risidagi sud qarori',
      uzCyrl: 'Шахсни муомалага лаёқатсиз деб топиш тўғрисидаги суд қарори',
      kaaLatn: 'Shaxstı muamalaǵa uqıpsız dep tabıw haqqında sud qararı',
      ru: 'Решение суда о признании лица недееспособным',
    },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-005',
    date: '2026-04-10 09:50',
    shortName: { uzLatn: 'Sud-psixiatriya xulosasi', uzCyrl: 'Суд-психиатрия хулосаси', kaaLatn: 'Sud-psixiatriya juwmaǵı', ru: 'Судебно-психиатрическое заключение' },
    fullName: {
      uzLatn: 'Sud tomonidan tayinlangan sud-psixiatriya ekspertizasi xulosasi',
      uzCyrl: 'Суд томонидан тайинланган суд-психиатрия экспертизаси хулосаси',
      kaaLatn: 'Sud tárepinen tayınlanǵan sud-psixiatriya ekspertizası juwmaǵı',
      ru: 'Заключение судебно-психиатрической экспертизы, назначенной судом',
    },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-006',
    date: '2026-04-10 09:55',
    shortName: { uzLatn: 'Qon tahlili', uzCyrl: 'Қон таҳлили', kaaLatn: 'Qan analizi', ru: 'Анализ крови' },
    fullName: { uzLatn: 'Qonning umumiy tahlili', uzCyrl: 'Қоннинг умумий таҳлили', kaaLatn: 'Qannıń ulıwma analizi', ru: 'Общий анализ крови' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-007',
    date: '2026-04-10 10:00',
    shortName: { uzLatn: 'Siydik tahlili', uzCyrl: 'Сийдик таҳлили', kaaLatn: 'Sidik analizi', ru: 'Анализ мочи' },
    fullName: { uzLatn: 'Siydikning umumiy tahlili', uzCyrl: 'Сийдикнинг умумий таҳлили', kaaLatn: 'Sidiktiń ulıwma analizi', ru: 'Общий анализ мочи' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-008',
    date: '2026-04-10 10:05',
    shortName: { uzLatn: 'RW tahlili', uzCyrl: 'RW таҳлили', kaaLatn: 'RW analizi', ru: 'Анализ RW' },
    fullName: { uzLatn: 'Qonning RW (Vasserman reaksiyasi) tahlili', uzCyrl: 'Қоннинг RW (Вассерман реакцияси) таҳлили', kaaLatn: 'Qannıń RW (Vasserman reakciyası) analizi', ru: 'Анализ крови RW (реакция Вассермана)' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-009',
    date: '2026-04-10 10:10',
    shortName: { uzLatn: 'Gepatit markerlari', uzCyrl: 'Гепатит маркерлари', kaaLatn: 'Gepatit markerleri', ru: 'Маркеры гепатита' },
    fullName: { uzLatn: '“B” va “C” gepatitlarining markerlarini aniqlovchi qon tahlili', uzCyrl: '“В” ва “С” гепатитларининг маркерларини аниқловчи қон таҳлили', kaaLatn: '“B” hám “C” gepatit markerlerin anıqlawshı qan analizi', ru: 'Анализ крови на маркеры гепатитов B и C' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-010',
    date: '2026-04-10 10:15',
    shortName: { uzLatn: 'OIV tahlili', uzCyrl: 'ОИВ таҳлили', kaaLatn: 'AİV analizi', ru: 'Анализ ВИЧ' },
    fullName: { uzLatn: 'Qonning OIV bilan zararlanishi to‘g‘risidagi tahlili', uzCyrl: 'Қоннинг ОИВ билан зарарланиши тўғрисидаги таҳлили', kaaLatn: 'Qannıń AİV menen zaqımlanıwı haqqında analiz', ru: 'Анализ крови на заражение ВИЧ' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-011',
    date: '2026-04-10 10:20',
    shortName: { uzLatn: 'Flyuorografiya', uzCyrl: 'Флюорография', kaaLatn: 'Flyuorografiya', ru: 'Флюорография' },
    fullName: { uzLatn: 'Ko‘krak qafasi a’zolarining flyuorografiyasi', uzCyrl: 'Кўкрак қафаси аъзоларининг флюорографияси', kaaLatn: 'Kókirek qapası aǵzalarınıń flyuorografiyası', ru: 'Флюорография органов грудной клетки' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-012',
    date: '2026-04-10 10:25',
    shortName: { uzLatn: 'TMK xulosasi', uzCyrl: 'ТМК хулосаси', kaaLatn: 'TMK juwmaǵı', ru: 'Заключение ВКК' },
    fullName: { uzLatn: 'Psixiatriya xizmati bo‘yicha Tibbiy-maslahat komissiyasi xulosasi', uzCyrl: 'Психиатрия хизмати бўйича Тиббий-маслаҳат комиссияси хулосаси', kaaLatn: 'Psixiatriya xızmeti boyınsha Medicinalıq-másláhát komissiyası juwmaǵı', ru: 'Заключение врачебно-консультативной комиссии по психиатрической службе' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-013',
    date: '2026-04-10 10:30',
    shortName: { uzLatn: 'Sil dispanseri', uzCyrl: 'Сил диспансери', kaaLatn: 'Sil dispanseri', ru: 'Противотуберкулезный диспансер' },
    fullName: { uzLatn: 'Silga qarshi kurashish dispanseri xulosasi', uzCyrl: 'Силга қарши курашиш диспансери хулосаси', kaaLatn: 'Silge qarsı gúresiw dispanseri juwmaǵı', ru: 'Заключение противотуберкулезного диспансера' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-014',
    date: '2026-04-10 10:35',
    shortName: { uzLatn: 'Onkologik dispanser', uzCyrl: 'Онкологик диспансер', kaaLatn: 'Onkologiyalıq dispanser', ru: 'Онкологический диспансер' },
    fullName: { uzLatn: 'Onkologik dispanser xulosasi', uzCyrl: 'Онкологик диспансер хулосаси', kaaLatn: 'Onkologiyalıq dispanser juwmaǵı', ru: 'Заключение онкологического диспансера' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-015',
    date: '2026-04-10 10:40',
    shortName: { uzLatn: 'Teri-tanosil dispanseri', uzCyrl: 'Тери-таносил диспансери', kaaLatn: 'Teri-tanosil dispanseri', ru: 'Кожно-венерологический диспансер' },
    fullName: { uzLatn: 'Teri-tanosil kasalliklari dispanseri xulosasi', uzCyrl: 'Тери-таносил касалликлари диспансери хулосаси', kaaLatn: 'Teri-tanosil awırıwları dispanseri juwmaǵı', ru: 'Заключение кожно-венерологического диспансера' },
    icdCodes: [],
    status: 'Faol',
  },
  {
    id: 'HUJ-2026-016',
    date: '2026-04-10 10:45',
    shortName: { uzLatn: 'OITS markazi', uzCyrl: 'ОИТС маркази', kaaLatn: 'JİTS orayı', ru: 'Центр СПИД' },
    fullName: { uzLatn: 'OITSga qarshi kurash markazining xulosasi', uzCyrl: 'ОИТСга қарши кураш марказининг хулосаси', kaaLatn: 'JİTSke qarsı gúres orayınıń juwmaǵı', ru: 'Заключение центра по борьбе со СПИД' },
    icdCodes: [],
    status: 'Faol',
  },
])

const questionnaireTemplates = ref<QuestionnaireTemplateRecord[]>([
  {
    id: 'SOR-2026-001',
    date: '2026-04-20 09:00',
    shortName: {
      uzLatn: 'Barthel va Lawton',
      uzCyrl: 'Бартел ва Лоутон',
      kaaLatn: 'Barthel hám Lawton',
      ru: 'Бартел и Лоутон',
    },
    fullName: {
      uzLatn: "Barthel va Lawton baholash so'rovnomasi shabloni",
      uzCyrl: 'Бартел ва Лоутон баҳолаш сўровномаси шаблони',
      kaaLatn: 'Barthel hám Lawton bahalaw sorawnaması shablonı',
      ru: 'Шаблон опросника оценки Бартел и Лоутон',
    },
    icdCodes: [],
    status: 'Faol',
    questionGroups: createBarthelLawtonQuestionnaireGroups(),
  },
  {
    id: 'SOR-2026-002',
    date: '2026-04-20 09:10',
    shortName: {
      uzLatn: 'WHODAS',
      uzCyrl: 'WHODAS',
      kaaLatn: 'WHODAS',
      ru: 'WHODAS',
    },
    fullName: {
      uzLatn: 'WHODAS funksional holatni baholash so‘rovnomasi shabloni',
      uzCyrl: 'WHODAS функционал ҳолатни баҳолаш сўровномаси шаблони',
      kaaLatn: 'WHODAS funktsional jaǵdaydı bahalaw sorawnaması shablonı',
      ru: 'Шаблон опросника оценки функционального состояния WHODAS',
    },
    icdCodes: [],
    status: 'Faol',
    questionGroups: [
      {
        id: crypto.randomUUID(),
        title: 'Funktsional baholash',
        questions: [
          {
            id: crypto.randomUUID(),
            text: 'Harakatlanish darajasi',
            answers: [
              { id: crypto.randomUUID(), text: 'Yuqori', score: 5 },
              { id: crypto.randomUUID(), text: "O'rta", score: 3 },
              { id: crypto.randomUUID(), text: 'Past', score: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'SOR-2026-003',
    date: '2026-04-20 09:20',
    shortName: {
      uzLatn: 'PPS',
      uzCyrl: 'PPS',
      kaaLatn: 'PPS',
      ru: 'PPS',
    },
    fullName: {
      uzLatn: 'PPS palyativ funksional holat shkalasi shabloni',
      uzCyrl: 'PPS паллиатив функционал ҳолат шкаласи шаблони',
      kaaLatn: 'PPS palliyativ funktsional jaǵday shkalası shablonı',
      ru: 'Шаблон шкалы паллиативного функционального состояния PPS',
    },
    icdCodes: [],
    status: 'Faol',
    questionGroups: [
      {
        id: crypto.randomUUID(),
        title: 'Palyativ holat',
        questions: [
          {
            id: crypto.randomUUID(),
            text: 'Faollik darajasi',
            answers: [
              { id: crypto.randomUUID(), text: 'Faol', score: 100 },
              { id: crypto.randomUUID(), text: 'Qisman cheklangan', score: 60 },
              { id: crypto.randomUUID(), text: 'To‘liq qaram', score: 30 },
            ],
          },
        ],
      },
    ],
  },
])

const categoryGroups = ref<CategoryGroupRecord[]>([
  {
    id: 'TOI-2026-001',
    date: '2026-04-21 09:00',
    shortName: {
      uzLatn: 'Tezkor',
      uzCyrl: 'Тезкор',
      kaaLatn: 'Tezkor',
      ru: 'Срочная',
    },
    fullName: {
      uzLatn: "Tezkor toifa guruhi",
      uzCyrl: 'Тезкор тоифа гуруҳи',
      kaaLatn: 'Tezkor toifa toparı',
      ru: 'Срочная категория',
    },
    icdCodes: [],
    minScore: 0,
    maxScore: 62,
    status: 'Faol',
  },
  {
    id: 'TOI-2026-002',
    date: '2026-04-21 09:10',
    shortName: {
      uzLatn: 'Rejali',
      uzCyrl: 'Режали',
      kaaLatn: 'Rejeli',
      ru: 'Плановая',
    },
    fullName: {
      uzLatn: "Rejali toifa guruhi",
      uzCyrl: 'Режали тоифа гуруҳи',
      kaaLatn: 'Rejeli toifa toparı',
      ru: 'Плановая категория',
    },
    icdCodes: [],
    minScore: 63,
    maxScore: 999,
    status: 'Faol',
  },
])

const isCreateDialogOpen = ref(false)
const isFilterOpen = ref(false)
const openFilterField = ref<'status' | 'region' | null>(null)
const openCalendarField = ref<'start' | 'end' | null>(null)
const calendarMonth = ref('')
const isFormRegionOpen = ref(false)
const editingId = ref<string | null>(null)
const openActionMenuId = ref<string | null>(null)
const selectedViewRecord = ref<CommissionRecord | null>(null)
const selectedAssessmentViewRecord = ref<AssessmentRecord | null>(null)
const selectedAssessmentViewMode = ref<'view' | 'edit'>('view')
const assessmentAnswers = ref<AssessmentAnswers>({})
const pendingConfirmation = ref<PendingConfirmation | null>(null)
const feedback = ref<{ type: FeedbackType; title: string; message: string } | null>(null)
const notificationProgress = ref(100)
const notificationRemaining = ref(NOTIFICATION_DURATION)
const isTableLoading = ref(false)
const actionLoadingKey = ref<string | null>(null)
const isConfirmationLoading = ref(false)
const searchInput = ref('')
const searchQuery = ref('')
const assessmentSearchInput = ref('')
const assessmentSearchQuery = ref('')
const isAssessmentFilterOpen = ref(false)
const openAssessmentFilterField = ref<'status' | 'region' | null>(null)
const openAssessmentCalendarField = ref<'start' | 'end' | null>(null)
const assessmentCalendarMonth = ref('')
const draftAssessmentStatusFilter = ref<'all' | AssessmentStatus>('all')
const appliedAssessmentStatusFilter = ref<'all' | AssessmentStatus>('all')
const draftAssessmentRegionFilter = ref<'all' | string>('all')
const appliedAssessmentRegionFilter = ref<'all' | string>('all')
const draftAssessmentStartDateFilter = ref('')
const appliedAssessmentStartDateFilter = ref('')
const draftAssessmentEndDateFilter = ref('')
const appliedAssessmentEndDateFilter = ref('')
const isApplicationReportFilterOpen = ref(false)
const openApplicationReportFilterField = ref<'status' | 'step' | 'region' | 'district' | ApplicationReportMetricKey | null>(null)
const openApplicationReportCalendarField = ref<ApplicationReportDateField | null>(null)
const applicationReportCalendarMonth = ref('')
const draftApplicationReportStatusFilter = ref<ApplicationReportStatus[]>([])
const appliedApplicationReportStatusFilter = ref<ApplicationReportStatus[]>([])
const draftApplicationReportStepFilter = ref<ApplicationReportStep[]>([])
const appliedApplicationReportStepFilter = ref<ApplicationReportStep[]>([])
const draftApplicationReportRegionFilter = ref<string[]>([])
const appliedApplicationReportRegionFilter = ref<string[]>([])
const draftApplicationReportDistrictFilter = ref<string[]>([])
const appliedApplicationReportDistrictFilter = ref<string[]>([])
const draftApplicationReportMetricFilters = ref<Record<ApplicationReportMetricKey, string[]>>(createApplicationReportMetricFilterState())
const appliedApplicationReportMetricFilters = ref<Record<ApplicationReportMetricKey, string[]>>(createApplicationReportMetricFilterState())
const draftApplicationReportStartDateFilter = ref('')
const appliedApplicationReportStartDateFilter = ref('')
const draftApplicationReportEndDateFilter = ref('')
const appliedApplicationReportEndDateFilter = ref('')
const defaultApplicationReportSnapshotDate = getTodayDisplayDate()
const defaultApplicationReportComparisonDate = getPreviousMonthDisplayDate()
const draftApplicationReportSnapshotDateFilter = ref(defaultApplicationReportSnapshotDate)
const appliedApplicationReportSnapshotDateFilter = ref(defaultApplicationReportSnapshotDate)
const draftApplicationReportComparisonDateFilter = ref(defaultApplicationReportComparisonDate)
const appliedApplicationReportComparisonDateFilter = ref(defaultApplicationReportComparisonDate)
const selectedApplicationReportCells = ref<Record<string, { label: string, value: number }>>({})
const draftStatusFilter = ref<'all' | CommissionStatus>('all')
const appliedStatusFilter = ref<'all' | CommissionStatus>('all')
const draftRegionFilter = ref<'all' | string>('all')
const appliedRegionFilter = ref<'all' | string>('all')
const draftStartDateFilter = ref('')
const appliedStartDateFilter = ref('')
const draftEndDateFilter = ref('')
const appliedEndDateFilter = ref('')
const rowsPerPageOptions = [20, 50, 100, 200, 500]
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const isRowsPerPageOpen = ref(false)
const assessmentRowsPerPage = ref(20)
const assessmentCurrentPage = ref(1)
const isAssessmentRowsPerPageOpen = ref(false)

const formRegion = ref('')
const chairSearch = ref<CommissionSearchState>(createSearchState())
const deputyChairSearch = ref<CommissionSearchState>(createSearchState())
const secretarySearch = ref<CommissionSearchState>(createSearchState())
const formMembers = ref<CommissionMemberDraft[]>([createEmptyMember()])
const serviceTypeSearchInput = ref('')
const serviceTypeSearchQuery = ref('')
const serviceTypeRowsPerPage = ref(20)
const serviceTypeCurrentPage = ref(1)
const isServiceTypeRowsPerPageOpen = ref(false)
const openServiceTypeActionMenuId = ref<string | null>(null)
const isServiceTypeDialogOpen = ref(false)
const isServiceTypeStatusOpen = ref(false)
const isServiceTypeDiagnosesOpen = ref(false)
const isServiceTypeContraindicationsOpen = ref(false)
const isServiceTypeDocumentsOpen = ref(false)
const isServiceTypeTranslationsOpen = ref(false)
const editingServiceTypeId = ref<string | null>(null)
const selectedServiceTypeRecord = ref<ServiceTypeRecord | null>(null)
const serviceTypeForm = ref<ServiceTypeForm>(createServiceTypeForm())
const diagnosisSearchInput = ref('')
const diagnosisSearchQuery = ref('')
const diagnosisRowsPerPage = ref(20)
const diagnosisCurrentPage = ref(1)
const isDiagnosisRowsPerPageOpen = ref(false)
const openDiagnosisActionMenuId = ref<string | null>(null)
const selectedApplicationReportRegion = ref<string | null>(null)
const isDiagnosisDialogOpen = ref(false)
const isDiagnosisStatusOpen = ref(false)
const isDiagnosisIcdOpen = ref(false)
const isDiagnosisTranslationsOpen = ref(false)
const editingDiagnosisId = ref<string | null>(null)
const selectedDiagnosisRecord = ref<DiagnosisRecord | QuestionnaireTemplateRecord | CategoryGroupRecord | null>(null)
const diagnosisForm = ref<DiagnosisForm>(createDiagnosisForm())
const isAnyDialogOpen = computed(() => (
  isCreateDialogOpen.value
  || isServiceTypeDialogOpen.value
  || isDiagnosisDialogOpen.value
  || Boolean(selectedViewRecord.value)
  || Boolean(selectedAssessmentViewRecord.value)
  || Boolean(selectedServiceTypeRecord.value)
  || Boolean(selectedDiagnosisRecord.value)
  || Boolean(pendingConfirmation.value)
))

let notificationTimer: ReturnType<typeof setTimeout> | null = null
let notificationAnimationFrame: number | null = null
let notificationCountdownStart = NOTIFICATION_DURATION
let notificationStartedAt = 0
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let serviceTypeSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let diagnosisSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let actionLoadingTimer: ReturnType<typeof setTimeout> | null = null
let isHydratingEditForm = false

const selectedViewLeadership = computed(() => {
  const record = selectedViewRecord.value
  if (!record) return []

  return [
    {
      role: 'Komissiya raisi',
      position: record.chairPosition,
      phone: record.chairPhone,
      profile: hydrateExistingProfile(record.chair, record.region, record.chairPinfl),
    },
    {
      role: "Rais o'rinbosari",
      position: record.deputyChairPosition,
      phone: record.deputyChairPhone,
      profile: hydrateExistingProfile(record.deputyChair, record.region, record.deputyChairPinfl),
    },
    {
      role: 'Komissiya kotibi',
      position: record.secretaryPosition,
      phone: record.secretaryPhone,
      profile: hydrateExistingProfile(record.secretary, record.region, record.secretaryPinfl),
    },
  ]
})

const selectedViewHistory = computed<DocumentHistoryEntry[]>(() => {
  const record = selectedViewRecord.value

  if (!record) {
    return []
  }

  const history: DocumentHistoryEntry[] = [
    {
      operation: 'Hujjat yaratildi',
      performer: 'Hududiy kotib',
      performedAt: record.createdAt,
      tone: 'process',
    },
  ]

  if (record.submittedAt) {
    history.push({
      operation: 'Yuborildi',
      performer: 'Hududiy kotib',
      performedAt: record.submittedAt ?? record.createdAt,
      tone: 'process',
    })
  }

  if (record.approvedAt) {
    history.push({
      operation: 'Tasdiqlandi',
      performer: `Komissiya raisi: ${normalizeFullName(record.chair)}`,
      performedAt: record.approvedAt,
      tone: 'success',
    })
  }

  if (record.rejectedAt) {
    history.push({
      operation: 'Bekor qilindi',
      performer: `Komissiya raisi: ${normalizeFullName(record.chair)}`,
      performedAt: record.rejectedAt,
      tone: 'destructive',
    })
  }

  if (!record.approvedAt && !record.rejectedAt && record.updatedAt !== record.createdAt) {
    history.push({
      operation: 'Tahrirlandi',
      performer: 'Hududiy kotib',
      performedAt: record.updatedAt,
      tone: 'process',
    })
  }

  return history
})

function createSearchState(): CommissionSearchState {
  return {
    pinfl: '',
    profile: null,
    position: '',
    phone: '',
    error: '',
  }
}

function createEmptyMember(): CommissionMemberDraft {
  return {
    id: crypto.randomUUID(),
    pinfl: '',
    fullName: '',
    birthDate: '',
    position: '',
    phone: '',
    organization: '',
    region: '',
    district: '',
    error: '',
  }
}

const commissionFirstNames = ['Azizbek', 'Javohir', 'Komiljon', 'Muzaffar', 'Doston', 'Oybek', 'Sevara', 'Dilnoza', 'Mohira', 'Yulduz']
const commissionLastNames = ['Abdullayev', 'Karimova', 'Raximov', 'Tursunova', 'Meliqulov', 'Sharipov', 'Qobilova', 'Jo‘rayeva', 'Bozorova', 'Rasulov']
const commissionPatronymics = ['Anvarovich', 'Zafarovich', 'Rustam qizi', 'Oybek qizi', 'Bahrom qizi', 'Alisherovich', 'Ikrom qizi']
const monthNames = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]
const calendarWeekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
const applicationReportDateFieldGroups: Array<Array<{ key: ApplicationReportDateField, label: string }>> = [
  [{ key: 'start', label: 'Boshlanish sanasi' }],
  [{ key: 'end', label: 'Tugash sanasi' }],
]
const regionDistrictOptions: Record<string, string[]> = {
  "Qoraqalpog'iston Respublikasi": ['Nukus shahri', "To'rtko'l tumani", "Xo'jayli tumani"],
  'Andijon viloyati': ['Andijon shahri', 'Asaka tumani', 'Buloqboshi tumani'],
  'Buxoro viloyati': ['Buxoro shahri', 'G‘ijduvon tumani', 'Kogon shahri'],
  "Farg'ona viloyati": ["Farg'ona shahri", 'Qo‘qon shahri', 'Marg‘ilon shahri'],
  'Jizzax viloyati': ['Jizzax shahri', 'G‘allaorol tumani', 'Zomin tumani'],
  'Namangan viloyati': ['Namangan shahri', 'Chortoq tumani', 'Kosonsoy tumani'],
  'Navoiy viloyati': ['Navoiy shahri', 'Karmana tumani', 'Zarafshon shahri'],
  'Qashqadaryo viloyati': ['Qarshi shahri', 'Shahrisabz shahri', 'Kitob tumani'],
  'Samarqand viloyati': ['Samarqand shahri', 'Urgut tumani', 'Kattaqo‘rg‘on shahri'],
  'Sirdaryo viloyati': ['Guliston shahri', 'Yangiyer shahri', 'Shirin shahri'],
  'Surxondaryo viloyati': ['Termiz shahri', 'Denov tumani', 'Sherobod tumani'],
  'Toshkent viloyati': ['Nurafshon shahri', 'Chirchiq shahri', 'Zangiota tumani'],
  'Toshkent shahri': ['Mirzo Ulug‘bek tumani', 'Shayxontohur tumani', 'Yakkasaroy tumani'],
  'Xorazm viloyati': ['Urganch shahri', 'Xiva shahri', 'Hazorasp tumani'],
}

function sanitizePinfl(value: string) {
  return value.replace(/\D/g, '').slice(0, 14)
}

function preventInvalidPinflKey(event: KeyboardEvent) {
  const navigationKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ])

  if (navigationKeys.has(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
    return
  }

  const input = event.target as HTMLInputElement
  const selectionStart = input.selectionStart ?? input.value.length
  const selectionEnd = input.selectionEnd ?? input.value.length
  const selectedLength = Math.max(selectionEnd - selectionStart, 0)

  if (input.value.length - selectedLength >= 14) {
    event.preventDefault()
  }
}

function preventInvalidPinflPaste(event: ClipboardEvent) {
  const pastedValue = event.clipboardData?.getData('text') ?? ''
  const input = event.target as HTMLInputElement
  const selectionStart = input.selectionStart ?? input.value.length
  const selectionEnd = input.selectionEnd ?? input.value.length
  const selectedLength = Math.max(selectionEnd - selectionStart, 0)
  const nextLength = input.value.length - selectedLength + pastedValue.length

  if (!/^\d+$/.test(pastedValue) || nextLength > 14) {
    event.preventDefault()
  }
}

function sanitizePhoneDigits(value: string) {
  return value.replace(/\D/g, '').replace(/^998/, '').slice(0, 9)
}

function toStoredPhone(value: string) {
  const digits = sanitizePhoneDigits(value)

  return digits ? `+998${digits}` : ''
}

function formatPhoneDisplay(value: string) {
  const digits = sanitizePhoneDigits(value)

  if (!digits) return '-'

  return `+998 ${digits.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4')}`
}

function preventInvalidPhoneKey(event: KeyboardEvent) {
  const navigationKeys = new Set([
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ])

  if (navigationKeys.has(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
    return
  }

  const input = event.target as HTMLInputElement
  const selectionStart = input.selectionStart ?? input.value.length
  const selectionEnd = input.selectionEnd ?? input.value.length
  const selectedLength = Math.max(selectionEnd - selectionStart, 0)

  if (input.value.length - selectedLength >= 9) {
    event.preventDefault()
  }
}

function preventInvalidPhonePaste(event: ClipboardEvent) {
  const pastedValue = event.clipboardData?.getData('text') ?? ''
  const digits = pastedValue.replace(/\D/g, '').replace(/^998/, '')
  const input = event.target as HTMLInputElement
  const selectionStart = input.selectionStart ?? input.value.length
  const selectionEnd = input.selectionEnd ?? input.value.length
  const selectedLength = Math.max(selectionEnd - selectionStart, 0)
  const nextLength = input.value.length - selectedLength + digits.length

  if (!digits || nextLength > 9 || /[A-Za-zА-Яа-я]/.test(pastedValue)) {
    event.preventDefault()
  }
}

function normalizeFullName(value: string) {
  return value.trim().toLocaleUpperCase('uz-UZ')
}

const serviceTypeStatusClassMap: Record<ServiceTypeStatus, string> = {
  Faol: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300',
  Nofaol: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300',
}

const localizedLanguageFields: { key: keyof LocalizedValue; label: string }[] = [
  { key: 'uzLatn', label: "O'zbek lotin" },
  { key: 'uzCyrl', label: "O'zbek kirill" },
  { key: 'kaaLatn', label: 'Qoraqalpoq lotin' },
  { key: 'ru', label: 'Rus tili' },
]

const optionalLocalizedLanguageFields = localizedLanguageFields.filter((field) => field.key !== 'uzLatn')

const icdCodeOptions = [
  'F00',
  'F00.0',
  'F00.1',
  'F00.2',
  'F00.9',
  'F01',
  'F01.0',
  'F01.1',
  'F01.2',
  'F01.3',
  'F01.8',
  'F01.9',
  'F02',
  'F02.0',
  'F02.1',
  'F02.2',
  'F02.3',
  'F02.4',
  'F02.8',
  'F03',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
  'F21',
  'F22',
  'F23',
  'F24',
  'F25',
  'F28',
  'F29',
  'F40',
  'F60',
  'F61',
  'F62',
  'F63',
  'F64',
  'F65',
  'F66',
  'F68',
  'F69',
  'F71',
  'F71.0',
  'F71.1',
  'F71.8',
  'F71.9',
  'F72',
  'F72.0',
  'F72.1',
  'F72.8',
  'F72.9',
  'F73',
  'F73.0',
  'F73.1',
  'F73.8',
  'F73.9',
] as const

function formatDateDisplay(value: string) {
  const [datePart = ''] = value.split(' ')
  const [year, month, day] = datePart.split('-')

  if (!year || !month || !day) {
    return value
  }

  return `${day}.${month}.${year}`
}

function sanitizeDateFilterInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean)

  return parts.join('.')
}

function formatDateForDisplay(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`
}

function getTodayDisplayDate() {
  return formatDateForDisplay(new Date())
}

function getPreviousMonthDisplayDate() {
  const today = new Date()
  const targetYear = today.getFullYear()
  const targetMonth = today.getMonth() - 1
  const lastDayOfTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
  const targetDay = Math.min(today.getDate(), lastDayOfTargetMonth)

  return formatDateForDisplay(new Date(targetYear, targetMonth, targetDay))
}

function preventDateNonDigitKeydown(event: KeyboardEvent) {
  const allowedControlKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Enter',
    'Escape',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Home',
    'End',
  ]

  if (event.ctrlKey || event.metaKey || event.altKey || allowedControlKeys.includes(event.key)) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

function displayDateToIso(value: string) {
  const [day, month, year] = value.split('.')

  if (!day || !month || !year || value.length !== 10) {
    return ''
  }

  return `${year}-${month}-${day}`
}

function calendarMonthFromDisplayDate(value: string) {
  const iso = displayDateToIso(value)

  return iso ? iso.slice(0, 7) : getTodayIso().slice(0, 7)
}

function parseDisplayDate(value: string) {
  const [day, month, year] = value.split('.').map((part) => Number(part))

  if (!day || !month || !year || value.length !== 10) {
    return null
  }

  const parsed = new Date(year, month - 1, day)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed
}

function parseRecordDate(value: string) {
  const [datePart = ''] = value.split(' ')
  const [year, month, day] = datePart.split('-').map((part) => Number(part))

  if (!day || !month || !year) {
    return null
  }

  const parsed = new Date(year, month - 1, day)

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function buildCommissionProfile(pinfl: string, region: string, offset = 0): CommissionLookupProfile {
  const seed = Number.parseInt(pinfl.slice(-4) || '0', 10) + offset
  const districts = regionDistrictOptions[region] ?? ['Hudud aniqlanmagan']
  const lastName = commissionLastNames[seed % commissionLastNames.length]
  const firstName = commissionFirstNames[(seed + 3) % commissionFirstNames.length]
  const patronymic = commissionPatronymics[(seed + 5) % commissionPatronymics.length]
  const year = 1975 + (seed % 20)
  const month = String((seed % 12) + 1).padStart(2, '0')
  const day = String((seed % 28) + 1).padStart(2, '0')

  return {
    pinfl,
    fullName: normalizeFullName(`${lastName} ${firstName} ${patronymic}`),
    birthDate: `${day}.${month}.${year}`,
    region,
    district: districts[seed % districts.length] ?? 'Hudud aniqlanmagan',
  }
}

function hydrateExistingProfile(fullName: string, region: string, suffix: string): CommissionLookupProfile {
  const normalized = suffix.padStart(14, '1').slice(0, 14)
  const districts = regionDistrictOptions[region] ?? ['Hudud aniqlanmagan']

  return {
    pinfl: normalized,
    fullName: normalizeFullName(fullName),
    birthDate: buildCommissionProfile(normalized, region).birthDate,
    region,
    district: districts[0] ?? 'Hudud aniqlanmagan',
  }
}

function getProfileInitials(profile?: CommissionLookupProfile | null) {
  if (!profile?.fullName) return 'SH'

  return profile.fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

function updateSearchPinfl(state: CommissionSearchState, value: string) {
  state.pinfl = sanitizePinfl(value)
  state.profile = null
  state.position = ''
  state.phone = ''
  state.error = ''
}

function lookupCommissionSearch(state: CommissionSearchState, offset = 0) {
  if (!formRegion.value) {
    state.error = 'Avval viloyatni tanlang.'
    state.profile = null
    return
  }

  if (state.pinfl.length !== 14) {
    state.error = 'JSHSHIR 14 xonali bo‘lishi kerak.'
    state.profile = null
    return
  }

  state.profile = buildCommissionProfile(state.pinfl, formRegion.value, offset)
  state.error = ''
}

function updateMemberPinfl(member: CommissionMemberDraft, value: string) {
  member.pinfl = sanitizePinfl(value)
  member.fullName = ''
  member.birthDate = ''
  member.region = ''
  member.district = ''
  member.position = ''
  member.phone = ''
  member.error = ''
}

function lookupCommissionMember(member: CommissionMemberDraft, offset = 0) {
  if (!formRegion.value) {
    member.error = 'Avval viloyatni tanlang.'
    return
  }

  if (member.pinfl.length !== 14) {
    member.error = 'JSHSHIR 14 xonali bo‘lishi kerak.'
    return
  }

  const profile = buildCommissionProfile(member.pinfl, formRegion.value, offset)
  member.fullName = profile.fullName
  member.birthDate = profile.birthDate
  member.organization = formRegion.value
  member.region = profile.region
  member.district = profile.district
  member.error = ''
}

function nowLabel() {
  const formatted = new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  return formatted.replace(' ', ' ')
}

function nextDocumentNumber() {
  const nextIndex = commissions.value.length + 1
  return `IPTK-TARKIB-2026-${String(nextIndex).padStart(3, '0')}`
}

const normalizedMembers = computed(() =>
  formMembers.value.filter((member) => member.fullName.trim())
)

const formError = computed(() => {
  if (!formRegion.value) return 'Viloyat tanlanishi kerak.'
  if (!chairSearch.value.profile) return 'Komissiya raisi JSHSHIR orqali aniqlanishi kerak.'
  if (!deputyChairSearch.value.profile) return "Rais o'rinbosari JSHSHIR orqali aniqlanishi kerak."
  if (!secretarySearch.value.profile) return 'Kotib JSHSHIR orqali aniqlanishi kerak.'
  if (normalizedMembers.value.length === 0) return "Kamida bitta a'zo kiritilishi kerak."

const invalidMember = normalizedMembers.value.some((member) =>
    !member.fullName.trim() || !member.position.trim() || sanitizePhoneDigits(member.phone).length !== 9
  )

  const invalidLeadership = [
    chairSearch.value,
    deputyChairSearch.value,
    secretarySearch.value,
  ].some((item) => !item.position.trim() || sanitizePhoneDigits(item.phone).length !== 9)

  if (invalidLeadership) {
    return 'Rais, o‘rinbosar va kotib uchun asosiy lavozim hamda telefon raqami to‘ldirilishi kerak.'
  }

  if (invalidMember) {
    return "Har bir a'zo uchun JSHSHIR, asosiy lavozimi va telefon raqami to'liq bo'lishi kerak."
  }

  return ''
})

const canSave = computed(() => !formError.value)

const serviceTypeFormError = computed(() => {
  const values = [
    serviceTypeForm.value.shortName.uzLatn,
    serviceTypeForm.value.fullName.uzLatn,
    serviceTypeForm.value.status,
  ]

  if (!values.every((value) => String(value).trim())) {
    return "Qisqa nomi, to'liq nomi va status to'ldirilishi kerak."
  }

  if (!serviceTypeForm.value.minAge.trim()) {
    return "Minimal yosh kiritilishi kerak."
  }

  const minAge = Number(serviceTypeForm.value.minAge)
  const maxAge = serviceTypeForm.value.maxAge.trim() ? Number(serviceTypeForm.value.maxAge) : null

  if (!Number.isInteger(minAge) || minAge < 0) {
    return "Minimal yosh manfiy bo'lmagan butun son bo'lishi kerak."
  }

  if (maxAge !== null && (!Number.isInteger(maxAge) || maxAge < 0)) {
    return "Maksimal yosh manfiy bo'lmagan butun son bo'lishi kerak."
  }

  if (maxAge !== null && minAge > maxAge) {
    return "Minimal yosh maksimal yoshdan katta bo'lishi mumkin emas."
  }

  if (serviceTypeForm.value.diagnosisIds.length === 0) {
    return 'Kamida bitta mos tashxis tanlanishi kerak.'
  }

  if (serviceTypeForm.value.contraindicationIds.length === 0) {
    return "Kamida bitta qarshi ko'rsatma tanlanishi kerak."
  }

  if (serviceTypeForm.value.documentIds.length === 0) {
    return 'Kamida bitta talab etiladigan hujjat tanlanishi kerak.'
  }

  return ''
})

const canSaveServiceType = computed(() => !serviceTypeFormError.value)

const filteredServiceTypes = computed(() => {
  const query = serviceTypeSearchQuery.value.trim().toLowerCase()

  if (!query) {
    return serviceTypes.value
  }

  return serviceTypes.value.filter((record) => [
    record.id,
    record.date,
    formatDateDisplay(record.date),
    record.status,
    ...Object.values(record.shortName),
    ...Object.values(record.fullName),
    ...getServiceTypeDiagnoses(record).map(medicalReferenceLabel),
    ...getServiceTypeContraindications(record).map(medicalReferenceLabel),
    ...getServiceTypeDocuments(record).map(medicalReferenceLabel),
  ].some((value) => value.toLowerCase().includes(query)))
})

const serviceTypeTotalRows = computed(() => filteredServiceTypes.value.length)
const serviceTypeTotalPages = computed(() => Math.max(1, Math.ceil(serviceTypeTotalRows.value / serviceTypeRowsPerPage.value)))
const paginatedServiceTypes = computed(() => {
  const start = (serviceTypeCurrentPage.value - 1) * serviceTypeRowsPerPage.value
  return filteredServiceTypes.value.slice(start, start + serviceTypeRowsPerPage.value)
})
const serviceTypePaginationRange = computed(() => {
  const start = serviceTypeTotalRows.value === 0 ? 0 : (serviceTypeCurrentPage.value - 1) * serviceTypeRowsPerPage.value + 1
  const end = Math.min(serviceTypeCurrentPage.value * serviceTypeRowsPerPage.value, serviceTypeTotalRows.value)
  return { start, end }
})
const serviceTypeCurrentPageSummary = computed(() => `${serviceTypeCurrentPage.value}/${serviceTypeTotalPages.value}`)

const medicalReferenceTitle = computed(() => {
  if (isDocumentsPage.value) return 'Hujjat'
  if (isQuestionnaireTemplatesPage.value) return "So'rovnoma shabloni"
  if (isCategoryGroupsPage.value) return 'Toifa guruhi'
  return isContraindicationsPage.value ? "Qarshi ko'rsatma" : 'Mos tashxis'
})
const medicalReferenceCreateTitle = computed(() => `${medicalReferenceTitle.value} yaratish`)
const medicalReferenceEditTitle = computed(() => `${medicalReferenceTitle.value}ni tahrirlash`)
const medicalReferenceExportName = computed(() => {
  if (isDocumentsPage.value) return 'iptk-hujjatlar.xlsx'
  if (isQuestionnaireTemplatesPage.value) return 'iptk-sorovnoma-shablonlari.xlsx'
  if (isCategoryGroupsPage.value) return 'iptk-toifa-guruhlari.xlsx'
  return isContraindicationsPage.value ? 'iptk-qarshi-korsatmalar.xlsx' : 'iptk-mos-tashxislar.xlsx'
})
const medicalReferenceSheetName = computed(() => {
  if (isDocumentsPage.value) return 'Hujjatlar'
  if (isQuestionnaireTemplatesPage.value) return "So'rovnoma shablonlari"
  if (isCategoryGroupsPage.value) return 'Toifa guruhlari'
  return isContraindicationsPage.value ? "Qarshi ko'rsatmalar" : 'Mos tashxislar'
})

function medicalReferenceLabel(record: DiagnosisRecord) {
  return `${record.shortName.uzLatn} - ${record.fullName.uzLatn}`
}

function isQuestionnaireTemplateRecord(
  record: DiagnosisRecord | QuestionnaireTemplateRecord | CategoryGroupRecord,
): record is QuestionnaireTemplateRecord {
  return 'questionGroups' in record
}

function isCategoryGroupRecord(
  record: DiagnosisRecord | QuestionnaireTemplateRecord | CategoryGroupRecord,
): record is CategoryGroupRecord {
  return 'minScore' in record && 'maxScore' in record
}

function cloneQuestionnaireGroups(
  groups: QuestionnaireTemplateGroup[],
): QuestionnaireTemplateGroupDraft[] {
  return groups.map((group) => ({
    id: group.id,
    title: group.title,
    questions: group.questions.map((question) => ({
      id: question.id,
      text: question.text,
      answers: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.text,
        score: String(answer.score),
      })),
    })),
  }))
}

function buildQuestionnaireGroupsPayload(
  groups: QuestionnaireTemplateGroupDraft[],
): QuestionnaireTemplateGroup[] {
  return groups.map((group) => ({
    id: group.id,
    title: group.title.trim(),
    questions: group.questions.map((question) => ({
      id: question.id,
      text: question.text.trim(),
      answers: question.answers.map((answer) => ({
        id: answer.id,
        text: answer.text.trim(),
        score: Number(answer.score),
      })),
    })),
  }))
}

function mapAssessmentQuestionsToGroup(
  title: string,
  questions: Array<{ title: string, options: Array<{ label: string, score: number }> }>,
): QuestionnaireTemplateGroup {
  return {
    id: crypto.randomUUID(),
    title,
    questions: questions.map((question) => ({
      id: crypto.randomUUID(),
      text: question.title,
      answers: question.options.map((option) => ({
        id: crypto.randomUUID(),
        text: option.label,
        score: option.score,
      })),
    })),
  }
}

function createBarthelLawtonQuestionnaireGroups(): QuestionnaireTemplateGroup[] {
  return [
    mapAssessmentQuestionsToGroup('Elementar harakatlar', barthelAssessmentQuestions),
    mapAssessmentQuestionsToGroup('Murakkab harakatlar', lawtonAssessmentQuestions),
  ]
}

function resolveMedicalReference(ids: string[], records: DiagnosisRecord[]) {
  return ids
    .map((id) => records.find((record) => record.id === id))
    .filter((record): record is DiagnosisRecord => Boolean(record))
}

function getServiceTypeDiagnoses(record: Pick<ServiceTypeRecord, 'diagnosisIds'>) {
  return resolveMedicalReference(record.diagnosisIds, diagnoses.value)
}

function getServiceTypeContraindications(record: Pick<ServiceTypeRecord, 'contraindicationIds'>) {
  return resolveMedicalReference(record.contraindicationIds, contraindications.value)
}

function getServiceTypeDocuments(record: Pick<ServiceTypeRecord, 'documentIds'>) {
  return resolveMedicalReference(record.documentIds, documents.value)
}

function getActiveMedicalReferenceRecords() {
  if (isDocumentsPage.value) return documents
  if (isQuestionnaireTemplatesPage.value) return questionnaireTemplates
  if (isCategoryGroupsPage.value) return categoryGroups
  return isContraindicationsPage.value ? contraindications : diagnoses
}

const diagnosisFormError = computed(() => {
  const values = [
    diagnosisForm.value.shortName.uzLatn,
    diagnosisForm.value.fullName.uzLatn,
    diagnosisForm.value.status,
  ]

  if (!values.every((value) => String(value).trim())) {
    return "Qisqa nomi, to'liq nomi va status to'ldirilishi kerak."
  }

  if (requiresMedicalReferenceIcd.value && diagnosisForm.value.icdCodes.length === 0) {
    return "Kamida bitta ICD-10 kodi tanlanishi kerak."
  }

  if (isCategoryGroupsPage.value) {
    if (diagnosisForm.value.minScore === '' || diagnosisForm.value.maxScore === '') {
      return "Minimal va maksimal ball kiritilishi kerak."
    }

    const minScore = Number(diagnosisForm.value.minScore)
    const maxScore = Number(diagnosisForm.value.maxScore)

    if (Number.isNaN(minScore) || Number.isNaN(maxScore)) {
      return "Minimal va maksimal ball son bo'lishi kerak."
    }

    if (minScore > maxScore) {
      return "Minimal ball maksimal balldan katta bo'lishi mumkin emas."
    }
  }

  if (isQuestionnaireTemplatesPage.value) {
    if (diagnosisForm.value.questionGroups.length === 0) {
      return "Kamida bitta savollar guruhi qo'shilishi kerak."
    }

    const hasInvalidGroup = diagnosisForm.value.questionGroups.some((group) => {
      if (!group.title.trim() || group.questions.length === 0) {
        return true
      }

      return group.questions.some((question) => {
        if (!question.text.trim() || question.answers.length === 0) {
          return true
        }

        return question.answers.some((answer) => {
          if (!answer.text.trim() || answer.score === '') {
            return true
          }

          return Number.isNaN(Number(answer.score))
        })
      })
    })

    if (hasInvalidGroup) {
      return "Savollar guruhi, savollar va javoblar to'liq kiritilishi kerak."
    }
  }

  return ''
})

const canSaveDiagnosis = computed(() => !diagnosisFormError.value)

const filteredDiagnoses = computed(() => {
  const query = diagnosisSearchQuery.value.trim().toLowerCase()
  const records = getActiveMedicalReferenceRecords().value

  if (!query) {
    return records
  }

  return records.filter((record) => [
    record.id,
    record.date,
    formatDateDisplay(record.date),
    record.status,
    record.icdCodes.join(' '),
    isCategoryGroupRecord(record) ? String(record.minScore) : '',
    isCategoryGroupRecord(record) ? String(record.maxScore) : '',
    ...Object.values(record.shortName),
    ...Object.values(record.fullName),
  ].some((value) => value.toLowerCase().includes(query)))
})

const diagnosisTotalRows = computed(() => filteredDiagnoses.value.length)
const diagnosisTotalPages = computed(() => Math.max(1, Math.ceil(diagnosisTotalRows.value / diagnosisRowsPerPage.value)))
const paginatedDiagnoses = computed(() => {
  const start = (diagnosisCurrentPage.value - 1) * diagnosisRowsPerPage.value
  return filteredDiagnoses.value.slice(start, start + diagnosisRowsPerPage.value)
})
const diagnosisPaginationRange = computed(() => {
  const start = diagnosisTotalRows.value === 0 ? 0 : (diagnosisCurrentPage.value - 1) * diagnosisRowsPerPage.value + 1
  const end = Math.min(diagnosisCurrentPage.value * diagnosisRowsPerPage.value, diagnosisTotalRows.value)
  return { start, end }
})
const diagnosisCurrentPageSummary = computed(() => `${diagnosisCurrentPage.value}/${diagnosisTotalPages.value}`)

const filteredCommissions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return commissions.value.filter((record) => {
    const matchesQuery = !query || [
      record.documentNumber,
      record.createdAt,
      formatDateDisplay(record.createdAt),
    ].some((value) => value.toLowerCase().includes(query))

    const matchesStatus = appliedStatusFilter.value === 'all' || record.status === appliedStatusFilter.value
    const matchesRegion = appliedRegionFilter.value === 'all' || record.region === appliedRegionFilter.value
    const recordDate = parseRecordDate(record.createdAt)
    const startDate = parseDisplayDate(appliedStartDateFilter.value)
    const endDate = parseDisplayDate(appliedEndDateFilter.value)
    const matchesStartDate = !startDate || !recordDate || recordDate >= startDate
    const matchesEndDate = !endDate || !recordDate || recordDate <= endDate

    return matchesQuery && matchesStatus && matchesRegion && matchesStartDate && matchesEndDate
  })
})

const filteredAssessments = computed(() => {
  const query = assessmentSearchQuery.value.trim().toLowerCase()
  return assessments.value.filter((record) => {
    const matchesQuery = !query || [
      record.documentNumber,
      record.createdAt,
      formatDateDisplay(record.createdAt),
      record.serviceRecipient,
      record.serviceRecipientPinfl,
      record.serviceType,
      getAssessmentResultDisplay(record),
      record.region,
      record.district,
      record.status,
    ].some((value) => value.toLowerCase().includes(query))

    const matchesStatus = appliedAssessmentStatusFilter.value === 'all' || record.status === appliedAssessmentStatusFilter.value
    const matchesRegion = appliedAssessmentRegionFilter.value === 'all' || record.region === appliedAssessmentRegionFilter.value
    const recordDate = parseRecordDate(record.createdAt)
    const startDate = parseDisplayDate(appliedAssessmentStartDateFilter.value)
    const endDate = parseDisplayDate(appliedAssessmentEndDateFilter.value)
    const matchesStartDate = !startDate || !recordDate || recordDate >= startDate
    const matchesEndDate = !endDate || !recordDate || recordDate <= endDate

    return matchesQuery && matchesStatus && matchesRegion && matchesStartDate && matchesEndDate
  })
})

const totalRows = computed(() => filteredCommissions.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / selectedRowsPerPage.value)))
const paginatedCommissions = computed(() => {
  const start = (currentPage.value - 1) * selectedRowsPerPage.value
  return filteredCommissions.value.slice(start, start + selectedRowsPerPage.value)
})
const paginationRange = computed(() => {
  const start = totalRows.value === 0 ? 0 : (currentPage.value - 1) * selectedRowsPerPage.value + 1
  const end = Math.min(currentPage.value * selectedRowsPerPage.value, totalRows.value)
  return { start, end }
})
const currentPageSummary = computed(() => `${currentPage.value}/${totalPages.value}`)
const assessmentTotalRows = computed(() => filteredAssessments.value.length)
const assessmentTotalPages = computed(() => Math.max(1, Math.ceil(assessmentTotalRows.value / assessmentRowsPerPage.value)))
const paginatedAssessments = computed(() => {
  const start = (assessmentCurrentPage.value - 1) * assessmentRowsPerPage.value
  return filteredAssessments.value.slice(start, start + assessmentRowsPerPage.value)
})
const assessmentPaginationRange = computed(() => {
  const start = assessmentTotalRows.value === 0 ? 0 : (assessmentCurrentPage.value - 1) * assessmentRowsPerPage.value + 1
  const end = Math.min(assessmentCurrentPage.value * assessmentRowsPerPage.value, assessmentTotalRows.value)
  return { start, end }
})
const assessmentCurrentPageSummary = computed(() => `${assessmentCurrentPage.value}/${assessmentTotalPages.value}`)
const assessmentActiveFilterCount = computed(() => {
  let count = 0
  if (appliedAssessmentStatusFilter.value !== 'all') count += 1
  if (appliedAssessmentRegionFilter.value !== 'all') count += 1
  if (appliedAssessmentStartDateFilter.value) count += 1
  if (appliedAssessmentEndDateFilter.value) count += 1
  return count
})
const assessmentHasActiveFilters = computed(() => {
  return appliedAssessmentStatusFilter.value !== 'all'
    || appliedAssessmentRegionFilter.value !== 'all'
    || Boolean(appliedAssessmentStartDateFilter.value)
    || Boolean(appliedAssessmentEndDateFilter.value)
})
const assessmentHasPendingFilterChanges = computed(() => {
  return draftAssessmentStatusFilter.value !== appliedAssessmentStatusFilter.value
    || draftAssessmentRegionFilter.value !== appliedAssessmentRegionFilter.value
    || draftAssessmentStartDateFilter.value !== appliedAssessmentStartDateFilter.value
    || draftAssessmentEndDateFilter.value !== appliedAssessmentEndDateFilter.value
})
const draftAssessmentStatusLabel = computed(() => (
  draftAssessmentStatusFilter.value === 'all' ? 'Barchasi' : draftAssessmentStatusFilter.value
))
const draftAssessmentRegionLabel = computed(() => (
  draftAssessmentRegionFilter.value === 'all' ? 'Barchasi' : draftAssessmentRegionFilter.value
))
const assessmentCalendarMonthLabel = computed(() => {
  const monthValue = assessmentCalendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')
  const monthIndex = Number(month) - 1

  if (!year || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return ''
  }

  return `${monthNames[monthIndex]} ${year}`
})
const assessmentCalendarDays = computed(() => {
  const monthValue = assessmentCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return []
  }

  const year = Number(yearString)
  const monthIndex = Number(monthString) - 1

  if (Number.isNaN(year) || Number.isNaN(monthIndex)) {
    return []
  }

  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const offset = (firstDay.getDay() + 6) % 7
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - offset + 1

    if (dayNumber < 1 || dayNumber > daysInMonth) {
      return {
        key: `empty-${index}`,
        label: '',
        value: '',
        isCurrentMonth: false,
      }
    }

    const value = `${String(dayNumber).padStart(2, '0')}.${String(monthIndex + 1).padStart(2, '0')}.${year}`
    return {
      key: value,
      label: String(dayNumber),
      value,
      isCurrentMonth: true,
    }
  })
})
const barthelQuestions = barthelAssessmentQuestions
const lawtonQuestions = lawtonAssessmentQuestions
const selectedAssessmentReadonly = computed(() => selectedAssessmentViewMode.value === 'view')
const assessmentBarthelTotal = computed(() => {
  return barthelQuestions.reduce((total, question) => {
    const option = getAssessmentSelectedOption(question)
    return total + (option?.score ?? 0)
  }, 0)
})
const assessmentLawtonTotal = computed(() => {
  return lawtonQuestions.reduce((total, question) => {
    const option = getAssessmentSelectedOption(question)
    return total + (option?.score ?? 0)
  }, 0)
})
const assessmentGrandTotal = computed(() => assessmentBarthelTotal.value + assessmentLawtonTotal.value)
const isAssessmentComplete = computed(() => {
  return allAssessmentQuestions.every((question) => Boolean(assessmentAnswers.value[question.id]))
})
const assessmentGroupLabel = computed(() => {
  if (!isAssessmentComplete.value) return 'Aniqlanmagan'
  const record = selectedAssessmentViewRecord.value
  const hasCloseRelatives = getAssessmentHasCloseRelatives(record)
  const hasHousing = getAssessmentHasHousing(record)
  return assessmentGrandTotal.value <= 62 && hasCloseRelatives === false && hasHousing === false ? 'Tezkor' : 'Rejali'
})
const assessmentGroupBadgeClass = computed(() => {
  if (assessmentGroupLabel.value === 'Tezkor') {
    return statusClassMap['Bekor qilingan']
  }

  if (assessmentGroupLabel.value === 'Rejali') {
    return statusClassMap.Tasdiqlangan
  }

  return 'border-border bg-background text-muted-foreground'
})
const selectedAssessmentServiceRecipientRows = computed(() => {
  const record = selectedAssessmentViewRecord.value
  if (!record) return []

  return [
    ['FIO', normalizeFullName(record.serviceRecipient)],
    ["Tug'ilgan sanasi", getAssessmentRecipientBirthDate(record)],
    ['Tashxis', getAssessmentRecipientDiagnosis(record)],
    ['Nogironlik guruhi', getAssessmentRecipientDisabilityGroup(record)],
    ['JSHSHIR', record.serviceRecipientPinfl],
    ['Manzil', `${record.region}, ${record.district}`],
  ] as const
})
const activeFilterCount = computed(() => {
  let count = 0

  if (appliedStatusFilter.value !== 'all') count += 1
  if (appliedRegionFilter.value !== 'all') count += 1
  if (appliedStartDateFilter.value) count += 1
  if (appliedEndDateFilter.value) count += 1

  return count
})

function getApplicationReportDemoCount(regionIndex: number, stepIndex: number) {
  if ((regionIndex + stepIndex) % 6 === 0) return 0
  return ((regionIndex + 2) * (stepIndex + 3)) % 11 + 1
}

function getApplicationReportMetricCount(regionIndex: number, groupIndex: number, optionIndex: number) {
  const seed = (regionIndex + 3) * (groupIndex + 2) * (optionIndex + 1)
  if (seed % 7 === 0) return 0
  return (seed % 19) + 2
}

function buildApplicationReportRow(label: string, seedIndex: number) {
  const steps = Object.fromEntries(
    applicationReportSteps.map((step, stepIndex) => [
      step,
      getApplicationReportDemoCount(seedIndex, stepIndex),
    ]),
  ) as Record<ApplicationReportStep, number>

  const statuses = Object.fromEntries(
    applicationReportStatuses.map((status) => [
      status,
      applicationReportSteps
        .filter((step) => applicationReportStepStatusMap[step] === status)
        .reduce((total, step) => total + steps[step], 0),
    ]),
  ) as Record<ApplicationReportStatus, number>

  const total = applicationReportSteps.reduce((sum, step) => sum + steps[step], 0)
  const metrics = Object.fromEntries(
    applicationReportMetricGroups.map((group, groupIndex) => [
      group.key,
      Object.fromEntries(
        group.options.map((option, optionIndex) => [
          option,
          getApplicationReportMetricCount(seedIndex, groupIndex, optionIndex),
        ]),
      ),
    ]),
  ) as Record<
    typeof applicationReportMetricGroups[number]['key'],
    Partial<Record<
      typeof applicationReportMetricGroups[number]['options'][number],
      number
    >>
  >

  return {
    region: label,
    statuses,
    steps,
    metrics,
    total,
  }
}

function areApplicationReportFiltersEqual<T extends string>(first: T[], second: T[]) {
  return first.length === second.length && first.every((item) => second.includes(item))
}

function createApplicationReportMetricFilterState() {
  return Object.fromEntries(
    applicationReportMetricGroups.map((group) => [group.key, []]),
  ) as unknown as Record<ApplicationReportMetricKey, string[]>
}

function areApplicationReportMetricFiltersEqual(
  first: Record<ApplicationReportMetricKey, string[]>,
  second: Record<ApplicationReportMetricKey, string[]>,
) {
  return applicationReportMetricGroups.every((group) => areApplicationReportFiltersEqual(
    first[group.key],
    second[group.key],
  ))
}

const applicationReportStepFilterOptions = computed(() => {
  if (!draftApplicationReportStatusFilter.value.length) return applicationReportSteps

  return applicationReportSteps.filter((step) => (
    draftApplicationReportStatusFilter.value.includes(applicationReportStepStatusMap[step])
  ))
})

const applicationReportDistrictFilterOptions = computed(() => {
  const selectedRegions = draftApplicationReportRegionFilter.value
  if (!selectedRegions.length) return []

  return selectedRegions.flatMap((region) => applicationReportDistricts[region] ?? [])
})

const isApplicationReportDistrictFilterDisabled = computed(() => !draftApplicationReportRegionFilter.value.length)

const applicationReportVisibleStatuses = computed(() => (
  appliedApplicationReportStatusFilter.value.length
    ? appliedApplicationReportStatusFilter.value
    : applicationReportStatuses
))

const applicationReportVisibleSteps = computed(() => {
  const statusFilteredSteps = applicationReportSteps.filter((step) => (
    !appliedApplicationReportStatusFilter.value.length
    || appliedApplicationReportStatusFilter.value.includes(applicationReportStepStatusMap[step])
  ))

  if (!appliedApplicationReportStepFilter.value.length) return statusFilteredSteps

  return statusFilteredSteps.filter((step) => appliedApplicationReportStepFilter.value.includes(step))
})

const applicationReportVisibleMetricGroups = computed(() => applicationReportMetricGroups.map((group) => {
  const selectedOptions = appliedApplicationReportMetricFilters.value[group.key]

  return {
    ...group,
    options: selectedOptions.length
      ? group.options.filter((option) => selectedOptions.includes(option))
    : group.options,
  }
}).filter((group) => group.options.length > 0))

const applicationReportMetricFilterGroups = computed(() => (
  applicationReportMetricGroups.filter((group) => group.key !== 'serviceTypes')
))

const applicationReportStatusFilterLabel = computed(() => {
  if (!draftApplicationReportStatusFilter.value.length) return 'Barchasi'
  if (draftApplicationReportStatusFilter.value.length === 1) return draftApplicationReportStatusFilter.value[0]
  return `${draftApplicationReportStatusFilter.value.length} ta tanlandi`
})

const applicationReportStepFilterLabel = computed(() => {
  if (!draftApplicationReportStepFilter.value.length) return 'Barchasi'
  if (draftApplicationReportStepFilter.value.length === 1) return draftApplicationReportStepFilter.value[0]
  return `${draftApplicationReportStepFilter.value.length} ta tanlandi`
})

const applicationReportRegionFilterLabel = computed(() => {
  if (!draftApplicationReportRegionFilter.value.length) return 'Barchasi'
  if (draftApplicationReportRegionFilter.value.length === 1) return draftApplicationReportRegionFilter.value[0]
  return `${draftApplicationReportRegionFilter.value.length} ta tanlandi`
})

const applicationReportDistrictFilterLabel = computed(() => {
  if (isApplicationReportDistrictFilterDisabled.value) return 'Avval hududni tanlang'
  if (!draftApplicationReportDistrictFilter.value.length) return 'Barchasi'
  if (draftApplicationReportDistrictFilter.value.length === 1) return draftApplicationReportDistrictFilter.value[0]
  return `${draftApplicationReportDistrictFilter.value.length} ta tanlandi`
})

function getApplicationReportMetricFilterLabel(key: ApplicationReportMetricKey) {
  const selectedItems = draftApplicationReportMetricFilters.value[key]
  if (!selectedItems.length) return 'Barchasi'
  if (selectedItems.length === 1) return selectedItems[0]
  return `${selectedItems.length} ta tanlandi`
}

const applicationReportActiveFilterCount = computed(() => {
  let count = 0

  if (appliedApplicationReportStatusFilter.value.length) count += 1
  if (appliedApplicationReportStepFilter.value.length) count += 1
  if (appliedApplicationReportRegionFilter.value.length) count += 1
  if (appliedApplicationReportDistrictFilter.value.length) count += 1
  applicationReportMetricGroups.forEach((group) => {
    if (appliedApplicationReportMetricFilters.value[group.key].length) count += 1
  })
  if (appliedApplicationReportStartDateFilter.value) count += 1
  if (appliedApplicationReportEndDateFilter.value) count += 1

  return count
})

const applicationReportHasActiveFilters = computed(() => applicationReportActiveFilterCount.value > 0)
const applicationReportHasPendingFilterChanges = computed(() => {
  return !areApplicationReportFiltersEqual(
    draftApplicationReportStatusFilter.value,
    appliedApplicationReportStatusFilter.value,
  )
    || !areApplicationReportFiltersEqual(
      draftApplicationReportStepFilter.value,
      appliedApplicationReportStepFilter.value,
    )
    || !areApplicationReportFiltersEqual(
      draftApplicationReportRegionFilter.value,
      appliedApplicationReportRegionFilter.value,
    )
    || !areApplicationReportFiltersEqual(
      draftApplicationReportDistrictFilter.value,
      appliedApplicationReportDistrictFilter.value,
    )
    || !areApplicationReportMetricFiltersEqual(
      draftApplicationReportMetricFilters.value,
      appliedApplicationReportMetricFilters.value,
    )
    || draftApplicationReportStartDateFilter.value !== appliedApplicationReportStartDateFilter.value
    || draftApplicationReportEndDateFilter.value !== appliedApplicationReportEndDateFilter.value
})

function getApplicationReportDateFactor() {
  if (appliedApplicationReportStartDateFilter.value && appliedApplicationReportEndDateFilter.value) return 0.64
  if (appliedApplicationReportStartDateFilter.value || appliedApplicationReportEndDateFilter.value) return 0.82
  return 1
}

function getApplicationReportMetricFactor() {
  return applicationReportMetricGroups.reduce((factor, group) => {
    const selectedOptions = appliedApplicationReportMetricFilters.value[group.key]
    if (!selectedOptions.length) return factor

    return factor * Math.min(1, selectedOptions.length / group.options.length)
  }, 1)
}

function getApplicationReportDisplayCount(value: number) {
  return Math.round(value * getApplicationReportDateFactor() * getApplicationReportMetricFactor())
}

function getApplicationReportStatusCount(
  row: ReturnType<typeof buildApplicationReportRow>,
  status: ApplicationReportStatus,
) {
  return applicationReportVisibleSteps.value
    .filter((step) => applicationReportStepStatusMap[step] === status)
    .reduce((total, step) => total + getApplicationReportDisplayCount(row.steps[step]), 0)
}

function normalizeApplicationReportCounts<T extends string>(
  entries: Array<[T, number]>,
  targetTotal: number,
) {
  const normalized = Object.fromEntries(entries.map(([key]) => [key, 0])) as Partial<Record<T, number>>
  const safeTarget = Math.max(0, Math.round(targetTotal))

  if (!entries.length || safeTarget <= 0) {
    return normalized
  }

  const safeEntries = entries.map(([key, value]) => [key, Math.max(0, value)] as [T, number])
  const rawTotal = safeEntries.reduce((sum, [, value]) => sum + value, 0)

  if (rawTotal <= 0) {
    const baseValue = Math.floor(safeTarget / safeEntries.length)
    let remainder = safeTarget - baseValue * safeEntries.length

    safeEntries.forEach(([key]) => {
      normalized[key] = baseValue + (remainder > 0 ? 1 : 0)
      remainder -= 1
    })

    return normalized
  }

  const scaledEntries = safeEntries.map(([key, value]) => {
    const scaledValue = (value / rawTotal) * safeTarget

    return {
      key,
      value: Math.floor(scaledValue),
      fraction: scaledValue - Math.floor(scaledValue),
    }
  })

  let remainder = safeTarget - scaledEntries.reduce((sum, item) => sum + item.value, 0)
  scaledEntries
    .sort((first, second) => second.fraction - first.fraction)
    .forEach((item) => {
      const extra = remainder > 0 ? 1 : 0
      normalized[item.key] = item.value + extra
      remainder -= extra
    })

  return normalized
}

function buildApplicationReportDisplayRow(
  row: ReturnType<typeof buildApplicationReportRow>,
  isTotal = false,
) {
  const steps = Object.fromEntries(
    applicationReportVisibleSteps.value.map((step) => [
      step,
      getApplicationReportDisplayCount(row.steps[step]),
    ]),
  ) as Partial<Record<ApplicationReportStep, number>>
  const total = applicationReportVisibleSteps.value.reduce((sum, step) => sum + (steps[step] ?? 0), 0)
  const statuses = Object.fromEntries(
    applicationReportVisibleStatuses.value.map((status) => [
      status,
      getApplicationReportStatusCount(row, status),
    ]),
  ) as Partial<Record<ApplicationReportStatus, number>>
  const metrics = Object.fromEntries(
    applicationReportVisibleMetricGroups.value.map((group) => [
      group.key,
      normalizeApplicationReportCounts(
        group.options.map((option) => [
          option,
          getApplicationReportDisplayCount(row.metrics[group.key][option] ?? 0),
        ]),
        total,
      ),
    ]),
  ) as ReturnType<typeof buildApplicationReportRow>['metrics']

  return {
    ...row,
    statuses: normalizeApplicationReportCounts(
      applicationReportVisibleStatuses.value.map((status) => [status, statuses[status] ?? 0]),
      total,
    ),
    steps,
    metrics,
    total,
    isTotal,
  }
}

const applicationReportAllRegionRows = computed(() => {
  return applicationReportRegions.map((region, regionIndex) => {
    return buildApplicationReportRow(region, regionIndex)
  })
})

function buildApplicationReportDistrictRows(region: string) {
  const regionIndex = Math.max(0, applicationReportRegions.indexOf(region))
  const districts = applicationReportDistricts[region] ?? []

  return districts.map((district, districtIndex) => (
    buildApplicationReportRow(district, (regionIndex + 1) * 10 + districtIndex)
  ))
}

const applicationReportRows = computed(() => {
  const selectedRegions = appliedApplicationReportRegionFilter.value.length
    ? appliedApplicationReportRegionFilter.value
    : applicationReportRegions

  if (appliedApplicationReportDistrictFilter.value.length) {
    return selectedRegions
      .flatMap((region) => buildApplicationReportDistrictRows(region))
      .filter((row) => appliedApplicationReportDistrictFilter.value.includes(row.region))
  }

  return applicationReportAllRegionRows.value.filter((row) => selectedRegions.includes(row.region))
})

function getApplicationDashboardMetricTotal(key: ApplicationReportMetricKey, option: ApplicationReportMetricOption) {
  const selectedOptions = appliedApplicationReportMetricFilters.value[key]

  if (selectedOptions.length && !selectedOptions.includes(option)) return 0

  return applicationReportRows.value.reduce((sum, row) => (
    sum + getApplicationReportDisplayCount(row.metrics[key][option] ?? 0)
  ), 0)
}

function getDashboardPercent(value: number, total: number) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

function getDashboardTrendSeed(value: string) {
  return value.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

function getDashboardDateFactor(value: string, seed: number) {
  const parsedDate = parseDisplayDate(value)

  if (!parsedDate) return null

  const day = parsedDate.getDate()
  const month = parsedDate.getMonth() + 1
  const year = parsedDate.getFullYear()
  const spread = ((day * 3 + month * 5 + (year % 19) + seed) % 23) - 11

  return 1 + (spread / 100)
}

function getApplicationDashboardTrend(value: number, label: string) {
  const seed = getDashboardTrendSeed(label)
  const snapshotFactor = getDashboardDateFactor(appliedApplicationReportSnapshotDateFilter.value, seed)
  const comparisonFactor = getDashboardDateFactor(appliedApplicationReportComparisonDateFilter.value, seed + 7)

  if (!snapshotFactor || !comparisonFactor) return null

  const previousValue = Math.max(1, Math.round(value * (comparisonFactor / snapshotFactor)))
  const change = Math.round(((value - previousValue) / previousValue) * 100)
  const delta = value - previousValue
  const isPositive = change > 0
  const isNegative = change < 0

  return {
    value: change,
    delta,
    label: `${isPositive ? '↑' : isNegative ? '↓' : '→'} ${Math.abs(change)}% (${delta > 0 ? '+' : ''}${delta})`,
    className: isPositive
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300'
      : isNegative
        ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300'
        : 'border-border bg-muted text-muted-foreground',
    textClassName: isPositive
      ? 'text-emerald-600 dark:text-emerald-300'
      : isNegative
        ? 'text-rose-600 dark:text-rose-300'
        : 'text-muted-foreground',
  }
}

const applicationDashboardStepTotals = computed(() => Object.fromEntries(
  applicationReportSteps.map((step) => [
    step,
    applicationReportVisibleSteps.value.includes(step)
      ? applicationReportRows.value.reduce((sum, row) => (
        sum + getApplicationReportDisplayCount(row.steps[step])
      ), 0)
      : 0,
  ]),
) as Record<ApplicationReportStep, number>)

const applicationDashboardStatusTotals = computed(() => Object.fromEntries(
  applicationReportStatuses.map((status) => [
    status,
    applicationReportVisibleStatuses.value.includes(status)
      ? applicationReportSteps
        .filter((step) => applicationReportStepStatusMap[step] === status)
        .reduce((sum, step) => sum + applicationDashboardStepTotals.value[step], 0)
      : 0,
  ]),
) as Record<ApplicationReportStatus, number>)

const applicationDashboardTotal = computed(() => (
  applicationReportSteps.reduce((sum, step) => sum + applicationDashboardStepTotals.value[step], 0)
))

const applicationDashboardKpis = computed(() => {
  const total = applicationDashboardTotal.value
  const inProcess = applicationDashboardStatusTotals.value.Jarayonda
  const approved = applicationDashboardStatusTotals.value.Tasdiqlangan
  const canceled = applicationDashboardStatusTotals.value['Bekor qilingan']
  const iptkQueue = (
    applicationDashboardStepTotals.value['IPTKga yuborildi']
    + applicationDashboardStepTotals.value['IPTK qabul qildi']
    + applicationDashboardStepTotals.value['IPTK yig‘ilishiga kiritildi']
  )

  void iptkQueue

  return [
    {
      label: 'Jami arizalar',
      value: total,
      note: '100% umumiy ulush',
      percent: 100,
      status: null,
      trend: getApplicationDashboardTrend(total, 'Jami arizalar'),
      icon: FileCheck2,
      className: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-200',
      barClass: 'bg-slate-500/70',
    },
    {
      label: 'Jarayondagi arizalar',
      value: inProcess,
      note: `${getDashboardPercent(inProcess, total)}% umumiy ulush`,
      percent: getDashboardPercent(inProcess, total),
      status: 'Jarayonda' as ApplicationReportStatus,
      trend: getApplicationDashboardTrend(inProcess, 'Jarayondagi arizalar'),
      icon: Clock3,
      className: statusClassMap.Jarayonda,
      barClass: 'bg-amber-500/80',
    },
    {
      label: 'Tasdiqlangan arizalar',
      value: approved,
      note: `${getDashboardPercent(approved, total)}% umumiy ulush`,
      percent: getDashboardPercent(approved, total),
      status: 'Tasdiqlangan' as ApplicationReportStatus,
      trend: getApplicationDashboardTrend(approved, 'Tasdiqlangan arizalar'),
      icon: CheckCheck,
      className: statusClassMap.Tasdiqlangan,
      barClass: 'bg-emerald-500/80',
    },
    {
      label: 'Bekor qilingan',
      value: canceled,
      note: `${getDashboardPercent(canceled, total)}% umumiy ulush`,
      percent: getDashboardPercent(canceled, total),
      status: 'Bekor qilingan' as ApplicationReportStatus,
      trend: getApplicationDashboardTrend(canceled, 'Bekor qilingan'),
      icon: X,
      className: statusClassMap['Bekor qilingan'],
      barClass: 'bg-rose-500/80',
    },
  ]
})

const applicationDashboardStatusSummary = computed(() => applicationReportStatuses.map((status) => {
  const value = applicationDashboardStatusTotals.value[status]

  return {
    label: status,
    value,
    percent: getDashboardPercent(value, applicationDashboardTotal.value),
    className: statusClassMap[status],
  }
}))

const applicationDashboardStatusStepGroups = computed(() => applicationDashboardStatusSummary.value.map((status) => ({
  ...status,
  steps: applicationReportSteps
    .filter((step) => applicationReportStepStatusMap[step] === status.label)
    .map((step) => {
      const value = applicationDashboardStepTotals.value[step]

      return {
        label: step,
        value,
        percent: getDashboardPercent(value, status.value),
        trend: getApplicationDashboardTrend(value, step),
      }
    }),
})))

function getApplicationDashboardStatusSteps(status: ApplicationReportStatus | null) {
  if (!status) return []

  return applicationDashboardStatusStepGroups.value.find((item) => item.label === status)?.steps ?? []
}

const applicationDashboardServiceDistribution = computed(() => {
  const entries = applicationReportServiceTypes.map((service) => ({
    label: service,
    value: getApplicationDashboardMetricTotal('serviceTypes', service),
  }))
  const total = entries.reduce((sum, item) => sum + item.value, 0)

  return entries.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, total),
    trend: getApplicationDashboardTrend(item.value, `Xizmat turlari ${item.label}`),
  }))
})

const applicationDashboardDisabilityGroupDistribution = computed(() => {
  const entries = applicationReportDisabilityGroups.map((group) => ({
    label: group,
    value: getApplicationDashboardMetricTotal('disabilityGroups', group),
  }))
  const total = entries.reduce((sum, item) => sum + item.value, 0)

  return entries.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, total),
    trend: getApplicationDashboardTrend(item.value, `Nogironlik guruhi ${item.label}`),
  }))
})

const applicationDashboardDiagnosisDistribution = computed(() => {
  const entries = applicationReportDiagnoses.map((diagnosis) => ({
    label: diagnosis,
    value: getApplicationDashboardMetricTotal('diagnoses', diagnosis),
  }))
  const total = entries.reduce((sum, item) => sum + item.value, 0)

  return entries.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, total),
    trend: getApplicationDashboardTrend(item.value, `Tashxis ${item.label}`),
  }))
})

const applicationDashboardGenderDistribution = computed(() => {
  const entries = applicationReportGenders.map((gender) => ({
    label: gender,
    value: getApplicationDashboardMetricTotal('genders', gender),
  }))
  const total = entries.reduce((sum, item) => sum + item.value, 0)

  return entries.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, total),
    trend: getApplicationDashboardTrend(item.value, `Jins ${item.label}`),
  }))
})

const applicationDashboardAgeDistribution = computed(() => {
  const entries = applicationReportAgeGroups.map((ageGroup) => ({
    label: ageGroup,
    value: getApplicationDashboardMetricTotal('ageGroups', ageGroup),
  }))
  const total = entries.reduce((sum, item) => sum + item.value, 0)

  return entries.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, total),
    trend: getApplicationDashboardTrend(item.value, `Yosh ${item.label}`),
  }))
})

const applicationDashboardDistributionCards = computed(() => [
  {
    title: 'Xizmat turlari',
    icon: FileCheck2,
    items: applicationDashboardServiceDistribution.value,
    barClass: 'bg-emerald-500/80',
  },
  {
    title: 'Nogironlik guruhi',
    icon: UsersRound,
    items: applicationDashboardDisabilityGroupDistribution.value,
    barClass: 'bg-amber-500/80',
  },
  {
    title: 'Tashxislar',
    icon: Activity,
    items: applicationDashboardDiagnosisDistribution.value,
    barClass: 'bg-sky-500/80',
  },
  {
    title: 'Jins',
    icon: UsersRound,
    items: applicationDashboardGenderDistribution.value,
    barClass: 'bg-rose-500/80',
  },
  {
    title: 'Yosh',
    icon: BarChart3,
    items: applicationDashboardAgeDistribution.value,
    barClass: 'bg-primary',
  },
])

const applicationDashboardStatusBarClassMap: Record<ApplicationReportStatus, string> = {
  Jarayonda: 'bg-amber-500',
  Tasdiqlangan: 'bg-emerald-500',
  'Bekor qilingan': 'bg-rose-500',
}

const applicationDashboardRegionBars = computed(() => {
  const rows = applicationReportRows.value.map((row) => {
    const segments = applicationReportStatuses.map((status) => ({
      status,
      value: getApplicationReportStatusCount(row, status),
      barClass: applicationDashboardStatusBarClassMap[status],
      badgeClass: statusClassMap[status],
    }))
    const total = segments.reduce((sum, segment) => sum + segment.value, 0)

    return {
      region: row.region,
      total,
      segments,
    }
  })
  const maxTotal = Math.max(...rows.map((row) => row.total), 1)

  return rows
    .map((row) => ({
      ...row,
      percent: getDashboardPercent(row.total, maxTotal),
      segments: row.segments.map((segment) => ({
        ...segment,
        percent: getDashboardPercent(segment.value, row.total),
      })),
    }))
})

const applicationDashboardMonthlyTrend = computed(() => {
  const labels = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
  const total = applicationDashboardTotal.value
  const values = labels.map((label, index) => {
    const value = Math.max(8, Math.round((total / labels.length) * (0.72 + ((index * 7) % 9) / 10)))

    return { label, value }
  })
  const maxValue = Math.max(...values.map((item) => item.value), 1)

  return values.map((item) => ({
    ...item,
    percent: getDashboardPercent(item.value, maxValue),
  }))
})

function buildSmoothDashboardPath(points: Array<{ x: number, y: number }>) {
  if (!points.length) return ''
  const firstPoint = points[0]

  if (!firstPoint) return ''
  if (points.length === 1) return `M ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)}`

  const smoothing = 0.18

  function controlPoint(
    current: { x: number, y: number },
    previous: { x: number, y: number } | undefined,
    next: { x: number, y: number } | undefined,
    reverse = false,
  ) {
    const previousPoint = previous ?? current
    const nextPoint = next ?? current
    const factor = reverse ? -smoothing : smoothing

    return {
      x: current.x + (nextPoint.x - previousPoint.x) * factor,
      y: current.y + (nextPoint.y - previousPoint.y) * factor,
    }
  }

  return points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
    }

    const previousPoint = points[index - 1] ?? point
    const controlStart = controlPoint(previousPoint, points[index - 2], point)
    const controlEnd = controlPoint(point, previousPoint, points[index + 1], true)

    return `${path} C ${controlStart.x.toFixed(1)} ${controlStart.y.toFixed(1)}, ${controlEnd.x.toFixed(1)} ${controlEnd.y.toFixed(1)}, ${point.x.toFixed(1)} ${point.y.toFixed(1)}`
  }, '')
}

const applicationDashboardAreaChart = computed(() => {
  const labels = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']
  const width = 1280
  const height = 320
  const padding = {
    top: 22,
    right: 28,
    bottom: 44,
    left: 54,
  }
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const bottomY = padding.top + innerHeight
  const statusColors: Record<ApplicationReportStatus, string> = {
    Jarayonda: '#f59e0b',
    Tasdiqlangan: '#10b981',
    'Bekor qilingan': '#e11d48',
  }
  const rawSeries = applicationReportVisibleStatuses.value.map((status, statusIndex) => {
    const total = applicationDashboardStatusTotals.value[status]
    const monthlyAverage = total / labels.length
    const values = labels.map((label, monthIndex) => {
      const factor = 0.62 + (((monthIndex + 2) * (statusIndex + 3)) % 8) / 10
      const value = total > 0 ? Math.max(1, Math.round(monthlyAverage * factor)) : 0

      return {
        label,
        value,
      }
    })

    return {
      status,
      values,
    }
  })
  const maxValue = Math.max(...rawSeries.flatMap((series) => series.values.map((item) => item.value)), 1)
  const monthPoints = labels.map((label, index) => ({
    label,
    x: padding.left + (innerWidth / Math.max(labels.length - 1, 1)) * index,
  }))
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    y: bottomY - innerHeight * ratio,
    label: Math.round(maxValue * ratio),
  }))
  const series = rawSeries.map((raw) => {
    const points = raw.values.map((item, index) => {
      const monthPoint = monthPoints[index] ?? { x: padding.left, label: item.label }

      return {
        ...item,
        x: monthPoint.x,
        y: bottomY - (item.value / maxValue) * innerHeight,
      }
    })
    const linePath = buildSmoothDashboardPath(points)
    const firstPoint = points[0] ?? { x: padding.left, y: bottomY }
    const lastPoint = points[points.length - 1] ?? firstPoint
    const areaPath = `${linePath} L ${lastPoint.x.toFixed(1)} ${bottomY.toFixed(1)} L ${firstPoint.x.toFixed(1)} ${bottomY.toFixed(1)} Z`

    return {
      label: raw.status,
      stroke: statusColors[raw.status],
      fillId: `dashboard-${raw.status.toLowerCase().replace(/\s+/g, '-')}-gradient`,
      linePath,
      areaPath,
      points,
      total: applicationDashboardStatusTotals.value[raw.status],
    }
  })

  return {
    width,
    height,
    bottomY,
    leftX: padding.left,
    rightX: padding.left + innerWidth,
    monthPoints,
    gridLines,
    series,
  }
})

const selectedApplicationReportDistrictRows = computed(() => {
  if (!selectedApplicationReportRegion.value) return []
  const rows = buildApplicationReportDistrictRows(selectedApplicationReportRegion.value)

  if (!appliedApplicationReportDistrictFilter.value.length) return rows

  return rows.filter((row) => appliedApplicationReportDistrictFilter.value.includes(row.region))
})

const applicationReportBodyRows = computed(() => {
  const sourceRows = selectedApplicationReportRegion.value
    ? selectedApplicationReportDistrictRows.value
    : applicationReportRows.value

  return sourceRows.map((row) => buildApplicationReportDisplayRow(row, false))
})

function aggregateApplicationReportRows(rows: Array<ReturnType<typeof buildApplicationReportDisplayRow>>) {
  const steps = Object.fromEntries(
    applicationReportVisibleSteps.value.map((step) => [
      step,
      rows.reduce((total, row) => total + (row.steps[step] ?? 0), 0),
    ]),
  ) as Partial<Record<ApplicationReportStep, number>>

  const statuses = Object.fromEntries(
    applicationReportVisibleStatuses.value.map((status) => [
      status,
      rows.reduce((total, row) => total + (row.statuses[status] ?? 0), 0),
    ]),
  ) as Partial<Record<ApplicationReportStatus, number>>
  const metrics = Object.fromEntries(
    applicationReportVisibleMetricGroups.value.map((group) => [
      group.key,
      Object.fromEntries(
        group.options.map((option) => [
          option,
          rows.reduce((total, row) => total + (row.metrics[group.key][option] ?? 0), 0),
        ]),
      ),
    ]),
  ) as ReturnType<typeof buildApplicationReportRow>['metrics']
  const total = rows.reduce((sum, row) => sum + row.total, 0)

  return {
    statuses: normalizeApplicationReportCounts(
      applicationReportVisibleStatuses.value.map((status) => [status, statuses[status] ?? 0]),
      total,
    ),
    steps,
    metrics: Object.fromEntries(
      applicationReportVisibleMetricGroups.value.map((group) => [
        group.key,
        normalizeApplicationReportCounts(
          group.options.map((option) => [option, metrics[group.key][option] ?? 0]),
          total,
        ),
      ]),
    ) as ReturnType<typeof buildApplicationReportRow>['metrics'],
    total,
  }
}

const applicationReportTotals = computed(() => {
  return aggregateApplicationReportRows(applicationReportBodyRows.value)
})

const applicationReportDisplayRows = computed(() => [
  {
    region: selectedApplicationReportRegion.value
      ? `${selectedApplicationReportRegion.value} bo'yicha jami`
      : "Respublika bo'yicha jami",
    statuses: applicationReportTotals.value.statuses,
    steps: applicationReportTotals.value.steps,
    metrics: applicationReportTotals.value.metrics,
    total: applicationReportTotals.value.total,
    isTotal: true,
  },
  ...applicationReportBodyRows.value,
])

const selectedApplicationReportCellValues = computed(() => Object.values(selectedApplicationReportCells.value))
const applicationReportSelectionAnalytics = computed(() => {
  const values = selectedApplicationReportCellValues.value.map((cell) => cell.value)

  if (!values.length) {
    return {
      count: 0,
      sum: 0,
      min: 0,
      max: 0,
      average: 0,
    }
  }

  const sum = values.reduce((total, value) => total + value, 0)

  return {
    count: values.length,
    sum,
    min: Math.min(...values),
    max: Math.max(...values),
    average: sum / values.length,
  }
})

const hasActiveFilters = computed(() => {
  return appliedStatusFilter.value !== 'all'
    || appliedRegionFilter.value !== 'all'
    || Boolean(appliedStartDateFilter.value)
    || Boolean(appliedEndDateFilter.value)
})
const hasPendingFilterChanges = computed(() => {
  return draftStatusFilter.value !== appliedStatusFilter.value
    || draftRegionFilter.value !== appliedRegionFilter.value
    || draftStartDateFilter.value !== appliedStartDateFilter.value
    || draftEndDateFilter.value !== appliedEndDateFilter.value
})
const draftStatusLabel = computed(() => (
  draftStatusFilter.value === 'all' ? 'Barchasi' : draftStatusFilter.value
))
const draftRegionLabel = computed(() => (
  draftRegionFilter.value === 'all' ? 'Barchasi' : draftRegionFilter.value
))
const calendarMonthLabel = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')

  if (!year || !month) {
    return ''
  }

  return `${monthNames[Number(month) - 1] ?? month} ${year}`
})
const calendarDays = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return []
  }

  const year = Number(yearString)
  const monthIndex = Number(monthString) - 1
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const days: Array<{ key: string, label: string, value: string, isCurrentMonth: boolean }> = []

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push({
      key: `empty-start-${index}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayValue = String(day).padStart(2, '0')
    days.push({
      key: `${yearString}-${monthString}-${dayValue}`,
      label: String(day),
      value: `${dayValue}.${monthString}.${yearString}`,
      isCurrentMonth: true,
    })
  }

  while (days.length % 7 !== 0) {
    days.push({
      key: `empty-end-${days.length}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  return days
})

const applicationReportCalendarMonthLabel = computed(() => {
  const monthValue = applicationReportCalendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')

  if (!year || !month) {
    return ''
  }

  return `${monthNames[Number(month) - 1] ?? month} ${year}`
})
const applicationReportCalendarDays = computed(() => {
  const monthValue = applicationReportCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return []
  }

  const year = Number(yearString)
  const monthIndex = Number(monthString) - 1
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const days: Array<{ key: string, label: string, value: string, isCurrentMonth: boolean }> = []

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push({
      key: `application-report-empty-start-${index}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayValue = String(day).padStart(2, '0')

    days.push({
      key: `application-report-${yearString}-${monthString}-${dayValue}`,
      label: String(day),
      value: `${dayValue}.${monthString}.${yearString}`,
      isCurrentMonth: true,
    })
  }

  while (days.length % 7 !== 0) {
    days.push({
      key: `application-report-empty-end-${days.length}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  return days
})

const feedbackTitleMap: Record<FeedbackType, string> = {
  success: 'Muvaffaqiyatli',
  error: 'Xatolik',
  info: "Ma'lumot",
}

function buildOperationNotification(
  actionTitle: string,
  actionName: string,
  documentType: string,
  documentId: string,
  isSuccess = true,
) {
  return {
    title: `${actionTitle} ${isSuccess ? 'bajarildi' : 'bajarilmadi'}`,
    message: `${documentId} raqamli ${documentType.toLowerCase()} bo‘yicha ${actionName} amali${isSuccess ? ' muvaffaqiyatli bajarildi' : 'ni bajarib bo‘lmadi'}.`,
  }
}

function pushFeedback(type: FeedbackType, message: string, title = feedbackTitleMap[type]) {
  feedback.value = { type, title, message }
  notificationProgress.value = 100
  notificationRemaining.value = NOTIFICATION_DURATION

  startNotificationCountdown(NOTIFICATION_DURATION)
}

function clearNotificationTimers() {
  if (notificationTimer) {
    clearTimeout(notificationTimer)
    notificationTimer = null
  }

  if (notificationAnimationFrame) {
    cancelAnimationFrame(notificationAnimationFrame)
    notificationAnimationFrame = null
  }
}

function closeNotification() {
  clearNotificationTimers()
  feedback.value = null
  notificationProgress.value = 100
  notificationRemaining.value = NOTIFICATION_DURATION
}

function updateNotificationProgress() {
  if (!feedback.value) {
    notificationAnimationFrame = null
    return
  }

  const elapsed = performance.now() - notificationStartedAt
  const remaining = Math.max(0, notificationCountdownStart - elapsed)
  notificationRemaining.value = remaining
  notificationProgress.value = (remaining / NOTIFICATION_DURATION) * 100

  if (remaining > 0) {
    notificationAnimationFrame = requestAnimationFrame(updateNotificationProgress)
    return
  }

  notificationAnimationFrame = null
}

function startNotificationCountdown(duration: number) {
  clearNotificationTimers()
  notificationCountdownStart = duration
  notificationRemaining.value = duration
  notificationStartedAt = performance.now()
  notificationTimer = setTimeout(() => {
    closeNotification()
  }, duration)
  notificationAnimationFrame = requestAnimationFrame(updateNotificationProgress)
}

function pauseNotificationCountdown() {
  if (!feedback.value) {
    return
  }

  const elapsed = performance.now() - notificationStartedAt
  notificationRemaining.value = Math.max(0, notificationCountdownStart - elapsed)
  notificationProgress.value = (notificationRemaining.value / NOTIFICATION_DURATION) * 100
  clearNotificationTimers()
}

function resumeNotificationCountdown() {
  if (!feedback.value || notificationRemaining.value <= 0) {
    return
  }

  startNotificationCountdown(notificationRemaining.value)
}

function resetForm() {
  editingId.value = null
  isFormRegionOpen.value = false
  formRegion.value = ''
  chairSearch.value = createSearchState()
  deputyChairSearch.value = createSearchState()
  secretarySearch.value = createSearchState()
  formMembers.value = [createEmptyMember()]
}

function openCreateDialog() {
  resetForm()
  isCreateDialogOpen.value = true
}

function closeCreateDialog() {
  isCreateDialogOpen.value = false
  isFormRegionOpen.value = false
  resetForm()
}

function selectFormRegion(region: string) {
  formRegion.value = region
  isFormRegionOpen.value = false
}

function addMember() {
  formMembers.value.push(createEmptyMember())
}

function removeMember(memberId: string) {
  if (formMembers.value.length === 1) {
    formMembers.value = [createEmptyMember()]
    return
  }

  formMembers.value = formMembers.value.filter((member) => member.id !== memberId)
}

function saveCommission() {
  if (formError.value) {
    pushFeedback('error', formError.value)
    return
  }

  const timestamp = nowLabel()
  const payload = {
    region: formRegion.value,
    chair: normalizeFullName(chairSearch.value.profile?.fullName ?? ''),
    chairPinfl: chairSearch.value.profile?.pinfl ?? '',
    chairPosition: chairSearch.value.position.trim(),
    chairPhone: toStoredPhone(chairSearch.value.phone),
    deputyChair: normalizeFullName(deputyChairSearch.value.profile?.fullName ?? ''),
    deputyChairPinfl: deputyChairSearch.value.profile?.pinfl ?? '',
    deputyChairPosition: deputyChairSearch.value.position.trim(),
    deputyChairPhone: toStoredPhone(deputyChairSearch.value.phone),
    secretary: normalizeFullName(secretarySearch.value.profile?.fullName ?? ''),
    secretaryPinfl: secretarySearch.value.profile?.pinfl ?? '',
    secretaryPosition: secretarySearch.value.position.trim(),
    secretaryPhone: toStoredPhone(secretarySearch.value.phone),
    members: normalizedMembers.value.map((member) => ({
      ...member,
      fullName: normalizeFullName(member.fullName),
      position: member.position.trim(),
      phone: toStoredPhone(member.phone),
      organization: member.organization.trim() || formRegion.value,
    })),
  }

  if (editingId.value) {
    const target = commissions.value.find((record) => record.id === editingId.value)
    if (!target) return

    target.region = payload.region
    target.chair = payload.chair
    target.chairPinfl = payload.chairPinfl
    target.chairPosition = payload.chairPosition
    target.chairPhone = payload.chairPhone
    target.deputyChair = payload.deputyChair
    target.deputyChairPinfl = payload.deputyChairPinfl
    target.deputyChairPosition = payload.deputyChairPosition
    target.deputyChairPhone = payload.deputyChairPhone
    target.secretary = payload.secretary
    target.secretaryPinfl = payload.secretaryPinfl
    target.secretaryPosition = payload.secretaryPosition
    target.secretaryPhone = payload.secretaryPhone
    target.members = payload.members
    target.updatedAt = timestamp

    if (target.status !== 'Tasdiqlangan') {
      target.workflowStage = 'Jarayonda'
      target.status = 'Jarayonda'
      target.submittedAt = timestamp
      target.rejectedAt = undefined
    }

    const notification = buildOperationNotification('Tahrirlash', 'tahrirlash', 'Komissiya tarkibi', target.documentNumber)
    pushFeedback('success', notification.message, notification.title)
  } else {
    const createdRecord: CommissionRecord = {
      id: String(commissions.value.length + 1),
      documentNumber: nextDocumentNumber(),
      status: 'Jarayonda',
      workflowStage: 'Jarayonda',
      createdAt: timestamp,
      updatedAt: timestamp,
      submittedAt: timestamp,
      ...payload,
    }

    commissions.value.unshift(createdRecord)
    const notification = buildOperationNotification('Yaratish', 'yaratish', 'Komissiya tarkibi', createdRecord.documentNumber)
    pushFeedback('success', notification.message, notification.title)
  }

  closeCreateDialog()
}

function editCommission(record: CommissionRecord) {
  runActionIconLoading(`commission-edit-${record.id}`, () => hydrateCommissionEditForm(record))
}

function hydrateCommissionEditForm(record: CommissionRecord) {
  isHydratingEditForm = true
  editingId.value = record.id
  openActionMenuId.value = null
  formRegion.value = record.region
  chairSearch.value = {
    pinfl: record.chairPinfl,
    profile: hydrateExistingProfile(record.chair, record.region, record.chairPinfl),
    position: record.chairPosition,
    phone: sanitizePhoneDigits(record.chairPhone),
    error: '',
  }
  deputyChairSearch.value = {
    pinfl: record.deputyChairPinfl,
    profile: hydrateExistingProfile(record.deputyChair, record.region, record.deputyChairPinfl),
    position: record.deputyChairPosition,
    phone: sanitizePhoneDigits(record.deputyChairPhone),
    error: '',
  }
  secretarySearch.value = {
    pinfl: record.secretaryPinfl,
    profile: hydrateExistingProfile(record.secretary, record.region, record.secretaryPinfl),
    position: record.secretaryPosition,
    phone: sanitizePhoneDigits(record.secretaryPhone),
    error: '',
  }
  formMembers.value = record.members.map((member) => ({
    ...member,
    fullName: normalizeFullName(member.fullName),
    phone: sanitizePhoneDigits(member.phone),
    pinfl: member.pinfl,
    region: record.region,
    district: member.district,
    error: '',
  }))
  isFormRegionOpen.value = false
  isCreateDialogOpen.value = true

  nextTick(() => {
    isHydratingEditForm = false
  })
}

function viewCommission(record: CommissionRecord) {
  runActionIconLoading(`commission-view-${record.id}`, () => {
    selectedViewRecord.value = record
    openActionMenuId.value = null
  })
}

function closeViewDialog() {
  selectedViewRecord.value = null
}

function openConfirmation(confirmation: PendingConfirmation) {
  pendingConfirmation.value = confirmation
  openActionMenuId.value = null
}

function buildConfirmationCopy(
  documentType: string,
  actionTitleStem: string,
  actionBodyName: string,
  documentId: string,
) {
  return {
    title: `${documentType} ${actionTitleStem}sinmi?`,
    description: `${documentId} raqamli ${documentType.toLowerCase()} bo'yicha ${actionBodyName} amalini bajarishni tasdiqlang.`,
  }
}

function closeConfirmation() {
  if (isConfirmationLoading.value) return
  pendingConfirmation.value = null
}

function confirmPendingAction() {
  const confirmation = pendingConfirmation.value
  if (!confirmation || isConfirmationLoading.value) return

  isConfirmationLoading.value = true
  const stopLoading = startActionLoading('confirmation-action', 700)
  stopLoading(() => {
    try {
      confirmation.action()
      pendingConfirmation.value = null
    } finally {
      isConfirmationLoading.value = false
    }
  })
}

function startActionLoading(key: string, minimumDuration = 420) {
  if (actionLoadingTimer) {
    clearTimeout(actionLoadingTimer)
  }

  const startedAt = Date.now()
  actionLoadingKey.value = key

  return (afterLoading?: () => void) => {
    const remaining = Math.max(minimumDuration - (Date.now() - startedAt), 0)
    actionLoadingTimer = setTimeout(() => {
      afterLoading?.()
      if (actionLoadingKey.value === key) {
        actionLoadingKey.value = null
      }
      actionLoadingTimer = null
    }, remaining)
  }
}

function runActionIconLoading(key: string, action: () => void) {
  const stopLoading = startActionLoading(key, 520)
  stopLoading(action)
}

function isActionButtonLoading(...keys: string[]) {
  return Boolean(actionLoadingKey.value && keys.includes(actionLoadingKey.value))
}

function requestApproveCommission(record: CommissionRecord) {
  const copy = buildConfirmationCopy('Komissiya tarkibi', 'tasdiqlan', 'tasdiqlash', record.documentNumber)
  openConfirmation({
    tone: 'success',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Tasdiqlash',
    action: () => approveCommission(record.id),
  })
}

function requestRejectCommission(record: CommissionRecord) {
  const copy = buildConfirmationCopy('Komissiya tarkibi', 'bekor qilin', 'bekor qilish', record.documentNumber)
  openConfirmation({
    tone: 'destructive',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Bekor qilish',
    action: () => rejectCommission(record.id),
  })
}

function requestSendCommission(record: CommissionRecord) {
  const copy = buildConfirmationCopy('Komissiya tarkibi', 'yuboril', 'yuborish', record.documentNumber)
  openConfirmation({
    tone: 'success',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Yuborish',
    action: () => sendCommission(record.id),
  })
}

function sendCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Yuborilgan'
  target.status = 'Yuborilgan'
  target.submittedAt = nowLabel()
  target.updatedAt = target.submittedAt
  target.rejectedAt = undefined
  openActionMenuId.value = null
  const notification = buildOperationNotification('Yuborish', 'yuborish', 'Komissiya tarkibi', target.documentNumber)
  pushFeedback('success', notification.message, notification.title)
}

function approveCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Tasdiqlangan'
  target.status = 'Tasdiqlangan'
  target.approvedAt = nowLabel()
  target.updatedAt = target.approvedAt
  openActionMenuId.value = null
  const notification = buildOperationNotification('Tasdiqlash', 'tasdiqlash', 'Komissiya tarkibi', target.documentNumber)
  pushFeedback('success', notification.message, notification.title)
}

function rejectCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Bekor qilingan'
  target.status = 'Bekor qilingan'
  target.rejectedAt = nowLabel()
  target.updatedAt = target.rejectedAt
  openActionMenuId.value = null
  const notification = buildOperationNotification('Bekor qilish', 'bekor qilish', 'Komissiya tarkibi', target.documentNumber)
  pushFeedback('success', notification.message, notification.title)
}

function applyFilters() {
  const stopLoading = startActionLoading('commission-filter-apply')
  isFilterOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null

  runTableLoading(() => {
    appliedStatusFilter.value = draftStatusFilter.value
    appliedRegionFilter.value = draftRegionFilter.value
    appliedStartDateFilter.value = draftStartDateFilter.value
    appliedEndDateFilter.value = draftEndDateFilter.value
    currentPage.value = 1
    stopLoading()
  })
}

function clearFilters() {
  const stopLoading = startActionLoading('commission-filter-clear')
  resetSearchAndFilters()
  stopLoading()
}

function resetSearchAndFilters() {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = null
  }

  searchInput.value = ''
  draftStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  draftStartDateFilter.value = ''
  draftEndDateFilter.value = ''
  isFilterOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null

  runTableLoading(() => {
    searchQuery.value = ''
    appliedStatusFilter.value = 'all'
    appliedRegionFilter.value = 'all'
    appliedStartDateFilter.value = ''
    appliedEndDateFilter.value = ''
    currentPage.value = 1
  })
}

function closeFilters() {
  isFilterOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null
}

function toggleFiltersFromMenu(nextOpen: boolean) {
  if (nextOpen) {
    draftStatusFilter.value = appliedStatusFilter.value
    draftRegionFilter.value = appliedRegionFilter.value
    draftStartDateFilter.value = appliedStartDateFilter.value
    draftEndDateFilter.value = appliedEndDateFilter.value
    openFilterField.value = null
    openCalendarField.value = null
  } else {
    openFilterField.value = null
    openCalendarField.value = null
  }

  isFilterOpen.value = nextOpen
}

function toggleFilterField(field: 'status' | 'region') {
  openFilterField.value = openFilterField.value === field ? null : field
}

function selectStatusFilter(value: 'all' | CommissionStatus) {
  draftStatusFilter.value = value
  openFilterField.value = null
}

function selectRegionFilter(value: 'all' | string) {
  draftRegionFilter.value = value
  openFilterField.value = null
}

function handleStartDateFilterChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftStartDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftEndDateFilter.value.length === 10
    && parseDisplayDate(draftEndDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(draftEndDateFilter.value)! < parseDisplayDate(normalizedValue)!
  ) {
    draftEndDateFilter.value = normalizedValue
  }
}

function createLocalizedValue(): LocalizedValue {
  return {
    uzLatn: '',
    uzCyrl: '',
    kaaLatn: '',
    ru: '',
  }
}

function createServiceTypeForm(): ServiceTypeForm {
  return {
    shortName: createLocalizedValue(),
    fullName: createLocalizedValue(),
    minAge: '18',
    maxAge: '',
    diagnosisIds: [],
    contraindicationIds: [],
    documentIds: [],
    status: 'Faol',
  }
}

function createQuestionnaireAnswerDraft(): QuestionnaireTemplateAnswerDraft {
  return {
    id: crypto.randomUUID(),
    text: '',
    score: '',
  }
}

function createQuestionnaireQuestionDraft(): QuestionnaireTemplateQuestionDraft {
  return {
    id: crypto.randomUUID(),
    text: '',
    answers: [createQuestionnaireAnswerDraft()],
  }
}

function createQuestionnaireGroupDraft(): QuestionnaireTemplateGroupDraft {
  return {
    id: crypto.randomUUID(),
    title: '',
    questions: [createQuestionnaireQuestionDraft()],
  }
}

function createDiagnosisForm(): DiagnosisForm {
  return {
    shortName: createLocalizedValue(),
    fullName: createLocalizedValue(),
    icdCodes: [],
    status: 'Faol',
    questionGroups: [createQuestionnaireGroupDraft()],
    minScore: '',
    maxScore: '',
  }
}

function handleEndDateFilterChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftEndDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftStartDateFilter.value.length === 10
    && parseDisplayDate(draftStartDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(draftStartDateFilter.value)! > parseDisplayDate(normalizedValue)!
  ) {
    draftStartDateFilter.value = normalizedValue
  }
}

function openCalendar(field: 'start' | 'end') {
  openCalendarField.value = openCalendarField.value === field ? null : field

  if (!openCalendarField.value) {
    return
  }

  const sourceDate = field === 'start' ? draftStartDateFilter.value : draftEndDateFilter.value
  calendarMonth.value = calendarMonthFromDisplayDate(sourceDate)
}

function shiftCalendarMonth(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString), Number(monthString) - 1 + direction, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shiftCalendarYear(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString) + direction, Number(monthString) - 1, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectCalendarDate(field: 'start' | 'end', value: string) {
  if (field === 'start') {
    handleStartDateFilterChange(value)
  } else {
    handleEndDateFilterChange(value)
  }

  openCalendarField.value = null
}

function isCalendarDateSelected(value: string) {
  if (openCalendarField.value === 'start') {
    return draftStartDateFilter.value === value
  }

  if (openCalendarField.value === 'end') {
    return draftEndDateFilter.value === value
  }

  return false
}

function handleSearchInput(value: string) {
  searchInput.value = value

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  searchDebounceTimer = setTimeout(() => {
    runTableLoading(() => {
      searchQuery.value = searchInput.value
      currentPage.value = 1
    })
    searchDebounceTimer = null
  }, 1000)
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return

  runTableLoading(() => {
    currentPage.value = page
  })
}

function setRowsPerPageOpen(nextOpen: boolean) {
  isRowsPerPageOpen.value = nextOpen
}

function setRowsPerPage(nextValue: number) {
  runTableLoading(() => {
    selectedRowsPerPage.value = nextValue
    currentPage.value = 1
  })
}

function handleAssessmentSearchInput(value: string) {
  assessmentSearchInput.value = value

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  searchDebounceTimer = setTimeout(() => {
    runTableLoading(() => {
      assessmentSearchQuery.value = assessmentSearchInput.value
      assessmentCurrentPage.value = 1
    })
    searchDebounceTimer = null
  }, 1000)
}

function goToAssessmentPage(page: number) {
  if (page < 1 || page > assessmentTotalPages.value || page === assessmentCurrentPage.value) return

  runTableLoading(() => {
    assessmentCurrentPage.value = page
  })
}

function setAssessmentRowsPerPageOpen(nextOpen: boolean) {
  isAssessmentRowsPerPageOpen.value = nextOpen
}

function setAssessmentRowsPerPage(nextValue: number) {
  runTableLoading(() => {
    assessmentRowsPerPage.value = nextValue
    assessmentCurrentPage.value = 1
  })
}

function applyAssessmentFilters() {
  const stopLoading = startActionLoading('assessment-filter-apply')
  isAssessmentFilterOpen.value = false
  openAssessmentFilterField.value = null
  openAssessmentCalendarField.value = null

  runTableLoading(() => {
    appliedAssessmentStatusFilter.value = draftAssessmentStatusFilter.value
    appliedAssessmentRegionFilter.value = draftAssessmentRegionFilter.value
    appliedAssessmentStartDateFilter.value = draftAssessmentStartDateFilter.value
    appliedAssessmentEndDateFilter.value = draftAssessmentEndDateFilter.value
    assessmentCurrentPage.value = 1
    stopLoading()
  })
}

function resetAssessmentSearchAndFilters() {
  assessmentSearchInput.value = ''
  assessmentSearchQuery.value = ''
  draftAssessmentStatusFilter.value = 'all'
  draftAssessmentRegionFilter.value = 'all'
  draftAssessmentStartDateFilter.value = ''
  draftAssessmentEndDateFilter.value = ''
  isAssessmentFilterOpen.value = false
  openAssessmentFilterField.value = null
  openAssessmentCalendarField.value = null

  runTableLoading(() => {
    appliedAssessmentStatusFilter.value = 'all'
    appliedAssessmentRegionFilter.value = 'all'
    appliedAssessmentStartDateFilter.value = ''
    appliedAssessmentEndDateFilter.value = ''
    assessmentCurrentPage.value = 1
  })
}

function clearAssessmentFilters() {
  const stopLoading = startActionLoading('assessment-filter-clear')
  resetAssessmentSearchAndFilters()
  stopLoading()
}

function closeAssessmentFilters() {
  isAssessmentFilterOpen.value = false
  openAssessmentFilterField.value = null
  openAssessmentCalendarField.value = null
}

function toggleAssessmentFiltersFromMenu(nextOpen: boolean) {
  if (nextOpen) {
    draftAssessmentStatusFilter.value = appliedAssessmentStatusFilter.value
    draftAssessmentRegionFilter.value = appliedAssessmentRegionFilter.value
    draftAssessmentStartDateFilter.value = appliedAssessmentStartDateFilter.value
    draftAssessmentEndDateFilter.value = appliedAssessmentEndDateFilter.value
    openAssessmentFilterField.value = null
    openAssessmentCalendarField.value = null
  } else {
    openAssessmentFilterField.value = null
    openAssessmentCalendarField.value = null
  }

  isAssessmentFilterOpen.value = nextOpen
}

function toggleAssessmentFilterField(field: 'status' | 'region') {
  openAssessmentFilterField.value = openAssessmentFilterField.value === field ? null : field
}

function selectAssessmentStatusFilter(value: 'all' | AssessmentStatus) {
  draftAssessmentStatusFilter.value = value
  openAssessmentFilterField.value = null
}

function formatAssessmentScore(score: number) {
  return Number.isInteger(score) ? String(score) : String(score).replace('.', ',')
}

function getAssessmentSelectedOption(question: AssessmentQuestion) {
  const selectedOptionId = assessmentAnswers.value[question.id]
  return question.options.find((option) => option.id === selectedOptionId)
}

function setAssessmentAnswer(questionId: string, optionId: string) {
  if (selectedAssessmentReadonly.value) return

  assessmentAnswers.value = {
    ...assessmentAnswers.value,
    [questionId]: optionId,
  }
}

function resetAssessmentDialogState() {
  assessmentAnswers.value = {}
}

function buildAssessmentAnswersByScoreMode(mode: 'low' | 'high'): AssessmentAnswers {
  return Object.fromEntries(
    allAssessmentQuestions.map((question) => {
      const sortedOptions = [...question.options].sort((first, second) => {
        return mode === 'low' ? first.score - second.score : second.score - first.score
      })

      return [question.id, sortedOptions[0]?.id ?? '']
    }),
  )
}

function isAssessmentAnswersComplete(answers?: AssessmentAnswers) {
  if (!answers) return false
  return allAssessmentQuestions.every((question) => Boolean(answers[question.id]))
}

function getAssessmentTotalByAnswers(answers?: AssessmentAnswers) {
  if (!answers) return 0

  return allAssessmentQuestions.reduce((total, question) => {
    const option = question.options.find((item) => item.id === answers[question.id])
    return total + (option?.score ?? 0)
  }, 0)
}

function getAssessmentHasCloseRelatives(record?: AssessmentRecord | null) {
  if (typeof record?.hasCloseRelatives === 'boolean') return record.hasCloseRelatives
  return true
}

function getAssessmentHasHousing(record?: AssessmentRecord | null) {
  if (typeof record?.hasHousing === 'boolean') return record.hasHousing
  return true
}

function getAssessmentCloseRelativesLabel(record?: AssessmentRecord | null) {
  return getAssessmentHasCloseRelatives(record) ? 'Bor' : "Yo'q"
}

function getAssessmentHousingLabel(record?: AssessmentRecord | null) {
  return getAssessmentHasHousing(record) ? 'Bor' : "Yo'q"
}

function getAssessmentGroupByRecord(record?: AssessmentRecord | null) {
  if (!record || !isAssessmentAnswersComplete(record.answers)) return ''
  const isUrgent = getAssessmentTotalByAnswers(record.answers) <= 62
    && getAssessmentHasCloseRelatives(record) === false
    && getAssessmentHasHousing(record) === false
  return isUrgent ? 'Tezkor' : 'Rejali'
}

function getAssessmentRecipientBirthDate(record: AssessmentRecord) {
  const seed = Number(record.id) || 1
  return `${String((seed % 28) + 1).padStart(2, '0')}.${String((seed % 12) + 1).padStart(2, '0')}.${2010 + (seed % 8)}`
}

function getAssessmentRecipientDiagnosis(record: AssessmentRecord) {
  if (record.serviceType.toLowerCase().includes('madad')) return "Og'ir darajadagi aqliy zaiflik (F72)"
  if (record.serviceType.toLowerCase().includes('huzur')) return "Mo'tadil darajadagi aqliy zaiflik (F71)"
  return 'Chuqur darajadagi aqliy zaiflik (F73)'
}

function getAssessmentRecipientDisabilityGroup(record: AssessmentRecord) {
  return Number(record.id) % 2 === 0 ? 'II guruh' : 'III guruh'
}

function getAssessmentResultDisplay(record?: AssessmentRecord | null) {
  if (!record) return '-'
  return getAssessmentGroupByRecord(record) || '-'
}

function getAssessmentResultBadgeClass(record?: AssessmentRecord | null) {
  const result = getAssessmentResultDisplay(record)

  if (record?.status === 'Tasdiqlangan' && result === 'Tezkor') {
    return statusClassMap['Bekor qilingan']
  }

  if (record?.status === 'Tasdiqlangan' && result === 'Rejali') {
    return statusClassMap.Tasdiqlangan
  }

  return 'border-border bg-muted/40 text-muted-foreground'
}

function viewAssessment(record: AssessmentRecord) {
  runActionIconLoading(`assessment-view-${record.id}`, () => {
    assessmentAnswers.value = { ...(record.answers ?? {}) }
    selectedAssessmentViewMode.value = 'view'
    selectedAssessmentViewRecord.value = record
    openActionMenuId.value = null
  })
}

function editAssessment(record: AssessmentRecord) {
  runActionIconLoading(`assessment-edit-${record.id}`, () => {
    assessmentAnswers.value = { ...(record.answers ?? {}) }
    selectedAssessmentViewMode.value = 'edit'
    selectedAssessmentViewRecord.value = record
    openActionMenuId.value = null
  })
}

function closeAssessmentViewDialog() {
  selectedAssessmentViewRecord.value = null
  resetAssessmentDialogState()
}

function saveAssessmentFromDialog() {
  const record = selectedAssessmentViewRecord.value
  if (!record || !isAssessmentComplete.value) return

  record.answers = { ...assessmentAnswers.value }
  record.result = assessmentGroupLabel.value
  closeAssessmentViewDialog()
  const notification = buildOperationNotification('Tahrirlash', 'tahrirlash', 'Baholash hujjati', record.documentNumber)
  pushFeedback('success', notification.message, notification.title)
}

function updateAssessmentStatus(recordId: string, status: AssessmentStatus, actionTitle: string, actionName: string) {
  const target = assessments.value.find((record) => record.id === recordId)
  if (!target) return

  target.status = status
  openActionMenuId.value = null
  const notification = buildOperationNotification(actionTitle, actionName, 'Baholash hujjati', target.documentNumber)
  pushFeedback('success', notification.message, notification.title)
}

function requestSendAssessment(record: AssessmentRecord) {
  const copy = buildConfirmationCopy('Baholash hujjati', 'yuboril', 'yuborish', record.documentNumber)
  openConfirmation({
    tone: 'success',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Yuborish',
    action: () => {
      if (!isAssessmentAnswersComplete(record.answers)) {
        const notification = buildOperationNotification('Yuborish', 'yuborish', 'Baholash hujjati', record.documentNumber, false)
        nextTick(() => {
          pushFeedback(
            'error',
            `${notification.message} So'rovnoma to'liq to'ldirilmagan.`,
            notification.title,
          )
        })
        return
      }

      updateAssessmentStatus(record.id, 'Yuborilgan', 'Yuborish', 'yuborish')
    },
  })
}

function requestCancelAssessment(record: AssessmentRecord) {
  const copy = buildConfirmationCopy('Baholash hujjati', 'bekor qilin', 'bekor qilish', record.documentNumber)
  openConfirmation({
    tone: 'destructive',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Bekor qilish',
    action: () => updateAssessmentStatus(record.id, 'Bekor qilingan', 'Bekor qilish', 'bekor qilish'),
  })
}

function requestApproveAssessment(record: AssessmentRecord) {
  const copy = buildConfirmationCopy('Baholash hujjati', 'tasdiqlan', 'tasdiqlash', record.documentNumber)
  openConfirmation({
    tone: 'success',
    title: copy.title,
    description: copy.description,
    confirmLabel: 'Tasdiqlash',
    action: () => updateAssessmentStatus(record.id, 'Tasdiqlangan', 'Tasdiqlash', 'tasdiqlash'),
  })
}

function selectAssessmentRegionFilter(value: 'all' | string) {
  draftAssessmentRegionFilter.value = value
  openAssessmentFilterField.value = null
}

function handleAssessmentStartDateFilterChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftAssessmentStartDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftAssessmentEndDateFilter.value.length === 10
    && parseDisplayDate(draftAssessmentEndDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(draftAssessmentEndDateFilter.value)! < parseDisplayDate(normalizedValue)!
  ) {
    draftAssessmentEndDateFilter.value = normalizedValue
  }
}

function handleAssessmentEndDateFilterChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftAssessmentEndDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftAssessmentStartDateFilter.value.length === 10
    && parseDisplayDate(draftAssessmentStartDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(draftAssessmentStartDateFilter.value)! > parseDisplayDate(normalizedValue)!
  ) {
    draftAssessmentStartDateFilter.value = normalizedValue
  }
}

function openAssessmentCalendar(field: 'start' | 'end') {
  openAssessmentCalendarField.value = openAssessmentCalendarField.value === field ? null : field

  if (!openAssessmentCalendarField.value) {
    return
  }

  const sourceDate = field === 'start' ? draftAssessmentStartDateFilter.value : draftAssessmentEndDateFilter.value
  assessmentCalendarMonth.value = calendarMonthFromDisplayDate(sourceDate)
}

function shiftAssessmentCalendarMonth(direction: -1 | 1) {
  const monthValue = assessmentCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString), Number(monthString) - 1 + direction, 1)
  assessmentCalendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shiftAssessmentCalendarYear(direction: -1 | 1) {
  const monthValue = assessmentCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString) + direction, Number(monthString) - 1, 1)
  assessmentCalendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectAssessmentCalendarDate(field: 'start' | 'end', value: string) {
  if (field === 'start') {
    handleAssessmentStartDateFilterChange(value)
  } else {
    handleAssessmentEndDateFilterChange(value)
  }

  openAssessmentCalendarField.value = null
}

function isAssessmentCalendarDateSelected(value: string) {
  if (openAssessmentCalendarField.value === 'start') {
    return draftAssessmentStartDateFilter.value === value
  }

  if (openAssessmentCalendarField.value === 'end') {
    return draftAssessmentEndDateFilter.value === value
  }

  return false
}

async function downloadAssessments() {
  const stopLoading = startActionLoading('assessment-download', 700)
  let downloadScheduled = false

  try {
    const xlsx = await import('xlsx')

    const exportRows = filteredAssessments.value.map((record) => ({
      ID: record.documentNumber,
      Sana: formatDateDisplay(record.createdAt),
      'Xizmat oluvchi': normalizeFullName(record.serviceRecipient),
      'Xizmat oluvchi JSHSHIR': record.serviceRecipientPinfl,
      'Xizmat turi': record.serviceType,
      Natija: getAssessmentResultDisplay(record),
      Hudud: record.region,
      Tuman: record.district,
      Status: record.status,
    }))

    const worksheet = xlsx.utils.json_to_sheet(exportRows)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Baholash')
    downloadScheduled = true
    stopLoading(() => {
      xlsx.writeFile(workbook, 'iptk-baholash.xlsx')
      pushFeedback('success', 'Baholash hujjatlari ro‘yxati Excel formatida yuklab olindi.', 'Yuklab olish bajarildi')
    })
  } finally {
    if (!downloadScheduled && actionLoadingKey.value === 'assessment-download') {
      stopLoading()
    }
  }
}

function setActionMenuOpen(recordId: string, nextOpen: boolean) {
  openActionMenuId.value = nextOpen ? recordId : (openActionMenuId.value === recordId ? null : openActionMenuId.value)
}

function runTableLoading(update: () => void) {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  isTableLoading.value = true

  loadingTimer = setTimeout(() => {
    update()
    isTableLoading.value = false
    loadingTimer = null
  }, 200)
}

async function downloadCommissions() {
  const stopLoading = startActionLoading('commission-download', 700)
  let downloadScheduled = false

  try {
    const xlsx = await import('xlsx')

    const exportRows = filteredCommissions.value.map((record) => ({
      ID: record.documentNumber,
      Sana: formatDateDisplay(record.createdAt),
      Hudud: record.region,
      Status: record.status,
      Bosqich: workflowStageLabels[record.workflowStage],
      Rais: normalizeFullName(record.chair),
      'Rais JSHSHIR': record.chairPinfl,
      "Rais o'rinbosari": normalizeFullName(record.deputyChair),
      "Rais o'rinbosari JSHSHIR": record.deputyChairPinfl,
      Kotib: normalizeFullName(record.secretary),
      'Kotib JSHSHIR': record.secretaryPinfl,
      "A'zolar soni": record.members.length,
    }))

    const worksheet = xlsx.utils.json_to_sheet(exportRows)
    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Komissiyalar')
    downloadScheduled = true
    stopLoading(() => {
      xlsx.writeFile(workbook, 'iptk-komissiyalar-tarkibi.xlsx')
      pushFeedback('success', 'Komissiyalar tarkibi ro‘yxati Excel formatida yuklab olindi.', 'Yuklab olish bajarildi')
    })
  } finally {
    if (!downloadScheduled && actionLoadingKey.value === 'commission-download') {
      stopLoading()
    }
  }
}

function nextServiceTypeId() {
  const nextIndex = serviceTypes.value.length + 1
  return `XIZ-2026-${String(nextIndex).padStart(3, '0')}`
}

function resetServiceTypeForm() {
  editingServiceTypeId.value = null
  isServiceTypeStatusOpen.value = false
  isServiceTypeDiagnosesOpen.value = false
  isServiceTypeContraindicationsOpen.value = false
  isServiceTypeDocumentsOpen.value = false
  isServiceTypeTranslationsOpen.value = false
  serviceTypeForm.value = createServiceTypeForm()
}

function openCreateServiceTypeDialog() {
  resetServiceTypeForm()
  isServiceTypeDialogOpen.value = true
}

function closeServiceTypeDialog() {
  isServiceTypeDialogOpen.value = false
  resetServiceTypeForm()
}

function editServiceType(record: ServiceTypeRecord) {
  runActionIconLoading(`service-type-edit-${record.id}`, () => hydrateServiceTypeEditForm(record))
}

function hydrateServiceTypeEditForm(record: ServiceTypeRecord) {
  editingServiceTypeId.value = record.id
  openServiceTypeActionMenuId.value = null
  isServiceTypeStatusOpen.value = false
  isServiceTypeDiagnosesOpen.value = false
  isServiceTypeContraindicationsOpen.value = false
  isServiceTypeDocumentsOpen.value = false
  isServiceTypeTranslationsOpen.value = false
  serviceTypeForm.value = {
    shortName: { ...record.shortName },
    fullName: { ...record.fullName },
    minAge: String(record.minAge),
    maxAge: record.maxAge === null ? '' : String(record.maxAge),
    diagnosisIds: [...record.diagnosisIds],
    contraindicationIds: [...record.contraindicationIds],
    documentIds: [...record.documentIds],
    status: record.status,
  }
  isServiceTypeDialogOpen.value = true
}

function viewServiceType(record: ServiceTypeRecord) {
  runActionIconLoading(`service-type-view-${record.id}`, () => {
    selectedServiceTypeRecord.value = record
    openServiceTypeActionMenuId.value = null
  })
}

function closeServiceTypeViewDialog() {
  selectedServiceTypeRecord.value = null
}

function saveServiceType() {
  if (serviceTypeFormError.value) {
    pushFeedback('error', serviceTypeFormError.value)
    return
  }

  const payload = {
    shortName: {
      uzLatn: serviceTypeForm.value.shortName.uzLatn.trim(),
      uzCyrl: serviceTypeForm.value.shortName.uzCyrl.trim(),
      kaaLatn: serviceTypeForm.value.shortName.kaaLatn.trim(),
      ru: serviceTypeForm.value.shortName.ru.trim(),
    },
    fullName: {
      uzLatn: serviceTypeForm.value.fullName.uzLatn.trim(),
      uzCyrl: serviceTypeForm.value.fullName.uzCyrl.trim(),
      kaaLatn: serviceTypeForm.value.fullName.kaaLatn.trim(),
      ru: serviceTypeForm.value.fullName.ru.trim(),
    },
    minAge: Number(serviceTypeForm.value.minAge),
    maxAge: serviceTypeForm.value.maxAge.trim() ? Number(serviceTypeForm.value.maxAge) : null,
    diagnosisIds: [...serviceTypeForm.value.diagnosisIds],
    contraindicationIds: [...serviceTypeForm.value.contraindicationIds],
    documentIds: [...serviceTypeForm.value.documentIds],
    status: serviceTypeForm.value.status as ServiceTypeStatus,
  }

  if (editingServiceTypeId.value) {
    const target = serviceTypes.value.find((record) => record.id === editingServiceTypeId.value)
    if (!target) return

    target.shortName = payload.shortName
    target.fullName = payload.fullName
    target.minAge = payload.minAge
    target.maxAge = payload.maxAge
    target.diagnosisIds = payload.diagnosisIds
    target.contraindicationIds = payload.contraindicationIds
    target.documentIds = payload.documentIds
    target.status = payload.status
    const notification = buildOperationNotification('Tahrirlash', 'tahrirlash', 'Xizmat turi', target.id)
    pushFeedback('success', notification.message, notification.title)
  } else {
    const createdRecord: ServiceTypeRecord = {
      id: nextServiceTypeId(),
      date: nowLabel(),
      ...payload,
    }

    serviceTypes.value.unshift(createdRecord)
    const notification = buildOperationNotification('Yaratish', 'yaratish', 'Xizmat turi', createdRecord.id)
    pushFeedback('success', notification.message, notification.title)
  }

  closeServiceTypeDialog()
}

function requestDeleteServiceType(record: ServiceTypeRecord) {
  openServiceTypeActionMenuId.value = null
  const copy = buildConfirmationCopy('Xizmat turi', "o'chiril", "o'chirish", record.id)
  openConfirmation({
    tone: 'destructive',
    title: copy.title,
    description: copy.description,
    confirmLabel: "O'chirish",
    action: () => deleteServiceType(record.id),
  })
}

function deleteServiceType(recordId: string) {
  serviceTypes.value = serviceTypes.value.filter((record) => record.id !== recordId)
  const notification = buildOperationNotification("O'chirish", "o'chirish", 'Xizmat turi', recordId)
  pushFeedback('success', notification.message, notification.title)
}

function handleServiceTypeSearchInput(value: string) {
  serviceTypeSearchInput.value = value

  if (serviceTypeSearchDebounceTimer) {
    clearTimeout(serviceTypeSearchDebounceTimer)
  }

  serviceTypeSearchDebounceTimer = setTimeout(() => {
    serviceTypeSearchQuery.value = serviceTypeSearchInput.value
    serviceTypeCurrentPage.value = 1
    serviceTypeSearchDebounceTimer = null
  }, 1000)
}

function goToServiceTypePage(page: number) {
  if (page < 1 || page > serviceTypeTotalPages.value || page === serviceTypeCurrentPage.value) return
  serviceTypeCurrentPage.value = page
}

function setServiceTypeRowsPerPageOpen(nextOpen: boolean) {
  isServiceTypeRowsPerPageOpen.value = nextOpen
}

function setServiceTypeRowsPerPage(nextValue: number) {
  serviceTypeRowsPerPage.value = nextValue
  serviceTypeCurrentPage.value = 1
}

function setServiceTypeActionMenuOpen(recordId: string, nextOpen: boolean) {
  openServiceTypeActionMenuId.value = nextOpen ? recordId : (openServiceTypeActionMenuId.value === recordId ? null : openServiceTypeActionMenuId.value)
}

type ServiceTypeDropdown = 'diagnoses' | 'contraindications' | 'documents' | 'status'

function closeServiceTypeDropdowns(except?: ServiceTypeDropdown) {
  if (except !== 'diagnoses') isServiceTypeDiagnosesOpen.value = false
  if (except !== 'contraindications') isServiceTypeContraindicationsOpen.value = false
  if (except !== 'documents') isServiceTypeDocumentsOpen.value = false
  if (except !== 'status') isServiceTypeStatusOpen.value = false
}

function toggleServiceTypeDropdown(dropdown: ServiceTypeDropdown) {
  const isOpening = dropdown === 'diagnoses'
    ? !isServiceTypeDiagnosesOpen.value
    : dropdown === 'contraindications'
      ? !isServiceTypeContraindicationsOpen.value
      : dropdown === 'documents'
        ? !isServiceTypeDocumentsOpen.value
        : !isServiceTypeStatusOpen.value

  closeServiceTypeDropdowns(isOpening ? dropdown : undefined)

  if (dropdown === 'diagnoses') isServiceTypeDiagnosesOpen.value = isOpening
  if (dropdown === 'contraindications') isServiceTypeContraindicationsOpen.value = isOpening
  if (dropdown === 'documents') isServiceTypeDocumentsOpen.value = isOpening
  if (dropdown === 'status') isServiceTypeStatusOpen.value = isOpening
}

function toggleServiceTypeTranslations() {
  closeServiceTypeDropdowns()
  isServiceTypeTranslationsOpen.value = !isServiceTypeTranslationsOpen.value
}

function selectServiceTypeStatus(status: ServiceTypeStatus) {
  serviceTypeForm.value.status = status
  isServiceTypeStatusOpen.value = false
}

function toggleServiceTypeDiagnosis(diagnosisId: string) {
  const selected = serviceTypeForm.value.diagnosisIds
  serviceTypeForm.value.diagnosisIds = selected.includes(diagnosisId)
    ? selected.filter((id) => id !== diagnosisId)
    : [...selected, diagnosisId]
}

function toggleServiceTypeContraindication(contraindicationId: string) {
  const selected = serviceTypeForm.value.contraindicationIds
  serviceTypeForm.value.contraindicationIds = selected.includes(contraindicationId)
    ? selected.filter((id) => id !== contraindicationId)
    : [...selected, contraindicationId]
}

function toggleServiceTypeDocument(documentId: string) {
  const selected = serviceTypeForm.value.documentIds
  serviceTypeForm.value.documentIds = selected.includes(documentId)
    ? selected.filter((id) => id !== documentId)
    : [...selected, documentId]
}

async function downloadServiceTypes() {
  const xlsx = await import('xlsx')

  const exportRows = filteredServiceTypes.value.map((record) => ({
    ID: record.id,
    Sana: formatDateDisplay(record.date),
    'Qisqa nomi': record.shortName.uzLatn,
    "To'liq nomi": record.fullName.uzLatn,
    'Minimal yosh': String(record.minAge),
    'Maksimal yosh': record.maxAge === null ? '-' : String(record.maxAge),
    'Mos tashxislar': getServiceTypeDiagnoses(record).map(medicalReferenceLabel).join('; '),
    "Qarshi ko'rsatmalar": getServiceTypeContraindications(record).map(medicalReferenceLabel).join('; '),
    'Talab etiladigan hujjatlar': getServiceTypeDocuments(record).map(medicalReferenceLabel).join('; '),
    Status: record.status,
  }))

  const worksheet = xlsx.utils.json_to_sheet(exportRows)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Xizmat turlari')
  xlsx.writeFile(workbook, 'iptk-xizmat-turlari.xlsx')
}

function nextDiagnosisId() {
  const records = getActiveMedicalReferenceRecords().value
  const prefix = isDocumentsPage.value
    ? 'HUJ'
    : isQuestionnaireTemplatesPage.value
      ? 'SOR'
      : isCategoryGroupsPage.value
        ? 'TOI'
      : isContraindicationsPage.value
        ? 'QK'
        : 'TASH'
  const nextIndex = records.length + 1
  return `${prefix}-2026-${String(nextIndex).padStart(3, '0')}`
}

function resetDiagnosisForm() {
  editingDiagnosisId.value = null
  isDiagnosisStatusOpen.value = false
  isDiagnosisIcdOpen.value = false
  isDiagnosisTranslationsOpen.value = false
  diagnosisForm.value = createDiagnosisForm()
}

function openCreateDiagnosisDialog() {
  resetDiagnosisForm()
  isDiagnosisDialogOpen.value = true
}

function closeDiagnosisDialog() {
  isDiagnosisDialogOpen.value = false
  resetDiagnosisForm()
}

function editDiagnosis(record: DiagnosisRecord) {
  runActionIconLoading(`diagnosis-edit-${record.id}`, () => hydrateDiagnosisEditForm(record))
}

function hydrateDiagnosisEditForm(record: DiagnosisRecord) {
  editingDiagnosisId.value = record.id
  openDiagnosisActionMenuId.value = null
  isDiagnosisStatusOpen.value = false
  isDiagnosisIcdOpen.value = false
  isDiagnosisTranslationsOpen.value = false
  diagnosisForm.value = {
    shortName: { ...record.shortName },
    fullName: { ...record.fullName },
    icdCodes: [...record.icdCodes],
    status: record.status,
    questionGroups: isQuestionnaireTemplateRecord(record)
      ? cloneQuestionnaireGroups(record.questionGroups)
      : [createQuestionnaireGroupDraft()],
    minScore: isCategoryGroupRecord(record) ? String(record.minScore) : '',
    maxScore: isCategoryGroupRecord(record) ? String(record.maxScore) : '',
  }
  isDiagnosisDialogOpen.value = true
}

function viewDiagnosis(record: DiagnosisRecord) {
  runActionIconLoading(`diagnosis-view-${record.id}`, () => {
    selectedDiagnosisRecord.value = record
    openDiagnosisActionMenuId.value = null
  })
}

function closeDiagnosisViewDialog() {
  selectedDiagnosisRecord.value = null
}

function saveDiagnosis() {
  if (diagnosisFormError.value) {
    pushFeedback('error', diagnosisFormError.value)
    return
  }

  const payload = {
    shortName: {
      uzLatn: diagnosisForm.value.shortName.uzLatn.trim(),
      uzCyrl: diagnosisForm.value.shortName.uzCyrl.trim(),
      kaaLatn: diagnosisForm.value.shortName.kaaLatn.trim(),
      ru: diagnosisForm.value.shortName.ru.trim(),
    },
    fullName: {
      uzLatn: diagnosisForm.value.fullName.uzLatn.trim(),
      uzCyrl: diagnosisForm.value.fullName.uzCyrl.trim(),
      kaaLatn: diagnosisForm.value.fullName.kaaLatn.trim(),
      ru: diagnosisForm.value.fullName.ru.trim(),
    },
    icdCodes: [...diagnosisForm.value.icdCodes],
    status: diagnosisForm.value.status as ServiceTypeStatus,
    questionGroups: buildQuestionnaireGroupsPayload(diagnosisForm.value.questionGroups),
    minScore: Number(diagnosisForm.value.minScore),
    maxScore: Number(diagnosisForm.value.maxScore),
  }

  if (editingDiagnosisId.value) {
    const target = getActiveMedicalReferenceRecords().value.find((record) => record.id === editingDiagnosisId.value)
    if (!target) return

    target.shortName = payload.shortName
    target.fullName = payload.fullName
    target.icdCodes = payload.icdCodes
    target.status = payload.status
    if (isQuestionnaireTemplateRecord(target)) {
      target.questionGroups = payload.questionGroups
    }
    if (isCategoryGroupRecord(target)) {
      target.minScore = payload.minScore
      target.maxScore = payload.maxScore
    }
    const notification = buildOperationNotification('Tahrirlash', 'tahrirlash', medicalReferenceTitle.value, target.id)
    pushFeedback('success', notification.message, notification.title)
  } else {
    const createdRecord = isQuestionnaireTemplatesPage.value
      ? {
          id: nextDiagnosisId(),
          date: nowLabel(),
          shortName: payload.shortName,
          fullName: payload.fullName,
          icdCodes: [],
          status: payload.status,
          questionGroups: payload.questionGroups,
        } satisfies QuestionnaireTemplateRecord
      : isCategoryGroupsPage.value
        ? {
            id: nextDiagnosisId(),
            date: nowLabel(),
            shortName: payload.shortName,
            fullName: payload.fullName,
            icdCodes: [],
            minScore: payload.minScore,
            maxScore: payload.maxScore,
            status: payload.status,
          } satisfies CategoryGroupRecord
      : {
          id: nextDiagnosisId(),
          date: nowLabel(),
          shortName: payload.shortName,
          fullName: payload.fullName,
          icdCodes: payload.icdCodes,
          status: payload.status,
        } satisfies DiagnosisRecord

    getActiveMedicalReferenceRecords().value.unshift(createdRecord)
    const notification = buildOperationNotification('Yaratish', 'yaratish', medicalReferenceTitle.value, createdRecord.id)
    pushFeedback('success', notification.message, notification.title)
  }

  closeDiagnosisDialog()
}

function addQuestionnaireGroup() {
  diagnosisForm.value.questionGroups = [...diagnosisForm.value.questionGroups, createQuestionnaireGroupDraft()]
}

function removeQuestionnaireGroup(groupId: string) {
  if (diagnosisForm.value.questionGroups.length === 1) {
    diagnosisForm.value.questionGroups = [createQuestionnaireGroupDraft()]
    return
  }

  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.filter((group) => group.id !== groupId)
}

function addQuestionnaireQuestion(groupId: string) {
  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.map((group) => (
    group.id === groupId
      ? { ...group, questions: [...group.questions, createQuestionnaireQuestionDraft()] }
      : group
  ))
}

function removeQuestionnaireQuestion(groupId: string, questionId: string) {
  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.map((group) => {
    if (group.id !== groupId) return group

    if (group.questions.length === 1) {
      return { ...group, questions: [createQuestionnaireQuestionDraft()] }
    }

    return { ...group, questions: group.questions.filter((question) => question.id !== questionId) }
  })
}

function addQuestionnaireAnswer(groupId: string, questionId: string) {
  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.map((group) => {
    if (group.id !== groupId) return group

    return {
      ...group,
      questions: group.questions.map((question) => (
        question.id === questionId
          ? { ...question, answers: [...question.answers, createQuestionnaireAnswerDraft()] }
          : question
      )),
    }
  })
}

function removeQuestionnaireAnswer(groupId: string, questionId: string, answerId: string) {
  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.map((group) => {
    if (group.id !== groupId) return group

    return {
      ...group,
      questions: group.questions.map((question) => {
        if (question.id !== questionId) return question

        if (question.answers.length === 1) {
          return { ...question, answers: [createQuestionnaireAnswerDraft()] }
        }

        return { ...question, answers: question.answers.filter((answer) => answer.id !== answerId) }
      }),
    }
  })
}

function normalizeQuestionnaireScore(groupId: string, questionId: string, answerId: string, value: string) {
  const normalized = value.replace(/[^\d.-]/g, '')

  diagnosisForm.value.questionGroups = diagnosisForm.value.questionGroups.map((group) => {
    if (group.id !== groupId) return group

    return {
      ...group,
      questions: group.questions.map((question) => {
        if (question.id !== questionId) return question

        return {
          ...question,
          answers: question.answers.map((answer) => (
            answer.id === answerId
              ? { ...answer, score: normalized }
              : answer
          )),
        }
      }),
    }
  })
}

function requestDeleteDiagnosis(record: DiagnosisRecord) {
  openDiagnosisActionMenuId.value = null
  const copy = buildConfirmationCopy(medicalReferenceTitle.value, "o'chiril", "o'chirish", record.id)
  openConfirmation({
    tone: 'destructive',
    title: copy.title,
    description: copy.description,
    confirmLabel: "O'chirish",
    action: () => deleteDiagnosis(record.id),
  })
}

function deleteDiagnosis(recordId: string) {
  const records = getActiveMedicalReferenceRecords()
  records.value = records.value.filter((record) => record.id !== recordId)
  const notification = buildOperationNotification("O'chirish", "o'chirish", medicalReferenceTitle.value, recordId)
  pushFeedback('success', notification.message, notification.title)
}

function toggleDiagnosisIcdCode(code: string) {
  if (diagnosisForm.value.icdCodes.includes(code)) {
    diagnosisForm.value.icdCodes = diagnosisForm.value.icdCodes.filter((item) => item !== code)
    return
  }

  diagnosisForm.value.icdCodes = [...diagnosisForm.value.icdCodes, code]
}

type DiagnosisDropdown = 'icd' | 'status'

function closeDiagnosisDropdowns(except?: DiagnosisDropdown) {
  if (except !== 'icd') isDiagnosisIcdOpen.value = false
  if (except !== 'status') isDiagnosisStatusOpen.value = false
}

function toggleDiagnosisDropdown(dropdown: DiagnosisDropdown) {
  const isOpening = dropdown === 'icd'
    ? !isDiagnosisIcdOpen.value
    : !isDiagnosisStatusOpen.value

  closeDiagnosisDropdowns(isOpening ? dropdown : undefined)

  if (dropdown === 'icd') isDiagnosisIcdOpen.value = isOpening
  if (dropdown === 'status') isDiagnosisStatusOpen.value = isOpening
}

function toggleDiagnosisTranslations() {
  closeDiagnosisDropdowns()
  isDiagnosisTranslationsOpen.value = !isDiagnosisTranslationsOpen.value
}

function selectDiagnosisStatus(status: ServiceTypeStatus) {
  diagnosisForm.value.status = status
  isDiagnosisStatusOpen.value = false
}

function handleDiagnosisSearchInput(value: string) {
  diagnosisSearchInput.value = value

  if (diagnosisSearchDebounceTimer) {
    clearTimeout(diagnosisSearchDebounceTimer)
  }

  diagnosisSearchDebounceTimer = setTimeout(() => {
    diagnosisSearchQuery.value = diagnosisSearchInput.value
    diagnosisCurrentPage.value = 1
    diagnosisSearchDebounceTimer = null
  }, 1000)
}

function goToDiagnosisPage(page: number) {
  if (page < 1 || page > diagnosisTotalPages.value || page === diagnosisCurrentPage.value) return
  diagnosisCurrentPage.value = page
}

function setDiagnosisRowsPerPageOpen(nextOpen: boolean) {
  isDiagnosisRowsPerPageOpen.value = nextOpen
}

function setDiagnosisRowsPerPage(nextValue: number) {
  diagnosisRowsPerPage.value = nextValue
  diagnosisCurrentPage.value = 1
}

function setDiagnosisActionMenuOpen(recordId: string, nextOpen: boolean) {
  openDiagnosisActionMenuId.value = nextOpen ? recordId : (openDiagnosisActionMenuId.value === recordId ? null : openDiagnosisActionMenuId.value)
}

function getApplicationReportExportFilePart(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['‘’`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    || 'hisobot'
}

function getApplicationReportFilterExportValue(values: string[]) {
  return values.length ? values.join(', ') : 'Barchasi'
}

function getApplicationReportFilterExportRows() {
  return [
    {
      Filter: 'Kesim',
      Qiymat: selectedApplicationReportRegion.value
        ? `${selectedApplicationReportRegion.value} tumanlari kesimi`
        : 'Hududlar kesimi',
    },
    {
      Filter: 'Status',
      Qiymat: getApplicationReportFilterExportValue(appliedApplicationReportStatusFilter.value),
    },
    {
      Filter: 'Bosqich',
      Qiymat: getApplicationReportFilterExportValue(appliedApplicationReportStepFilter.value),
    },
    {
      Filter: 'Hudud',
      Qiymat: getApplicationReportFilterExportValue(appliedApplicationReportRegionFilter.value),
    },
    {
      Filter: 'Tuman (shahar)',
      Qiymat: getApplicationReportFilterExportValue(appliedApplicationReportDistrictFilter.value),
    },
    ...applicationReportMetricGroups.map((group) => ({
      Filter: group.label,
      Qiymat: getApplicationReportFilterExportValue(appliedApplicationReportMetricFilters.value[group.key]),
    })),
    {
      Filter: 'Boshlanish sanasi',
      Qiymat: appliedApplicationReportStartDateFilter.value || 'Belgilanmagan',
    },
    {
      Filter: 'Tugash sanasi',
      Qiymat: appliedApplicationReportEndDateFilter.value || 'Belgilanmagan',
    },
  ]
}

async function downloadApplicationReport() {
  const stopLoading = startActionLoading('application-report-download', 700)
  let downloadScheduled = false

  try {
    const xlsx = await import('xlsx')

    const exportRows = applicationReportDisplayRows.value.map((row) => {
      const exportRow: Record<string, string | number> = {
        Hudud: row.region,
        Jami: row.total,
      }

      applicationReportVisibleStatuses.value.forEach((status) => {
        exportRow[`Status: ${status}`] = row.statuses[status] ?? 0
      })

      applicationReportVisibleSteps.value.forEach((step) => {
        exportRow[`Bosqich: ${step}`] = row.steps[step] ?? 0
      })

      applicationReportVisibleMetricGroups.value.forEach((group) => {
        group.options.forEach((option) => {
          exportRow[`${group.label}: ${option}`] = row.metrics[group.key][option] ?? 0
        })
      })

      return exportRow
    })

    const worksheet = xlsx.utils.json_to_sheet(exportRows)
    worksheet['!cols'] = Object.keys(exportRows[0] ?? { Hudud: '', Jami: 0 }).map((key) => ({
      wch: Math.min(Math.max(key.length + 4, key === 'Hudud' ? 30 : 14), 42),
    }))

    const filterWorksheet = xlsx.utils.json_to_sheet(getApplicationReportFilterExportRows())
    filterWorksheet['!cols'] = [{ wch: 24 }, { wch: 48 }]

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Arizalar hisoboti')
    xlsx.utils.book_append_sheet(workbook, filterWorksheet, 'Filterlar')

    const reportScope = selectedApplicationReportRegion.value
      ? getApplicationReportExportFilePart(selectedApplicationReportRegion.value)
      : 'hududlar'
    const reportDate = new Date().toISOString().slice(0, 10)

    downloadScheduled = true
    stopLoading(() => {
      xlsx.writeFile(workbook, `iptk-arizalar-hisoboti-${reportScope}-${reportDate}.xlsx`)
      pushFeedback('success', 'Arizalar bo‘yicha hisobot Excel formatida yuklab olindi.', 'Yuklab olish bajarildi')
    })
  } finally {
    if (!downloadScheduled && actionLoadingKey.value === 'application-report-download') {
      stopLoading()
    }
  }
}

async function downloadApplicationDashboard() {
  const stopLoading = startActionLoading('application-dashboard-download', 700)
  let downloadScheduled = false

  try {
    const xlsx = await import('xlsx')
    const workbook = xlsx.utils.book_new()

    const kpiRows = applicationDashboardKpis.value.map((item) => ({
      "Ko'rsatkich": item.label,
      Qiymat: item.value,
      Ulush: `${item.percent}%`,
      Izoh: item.note,
    }))
    const statusRows = applicationReportVisibleStatuses.value.map((status) => ({
      Status: status,
      Qiymat: applicationDashboardStatusTotals.value[status],
      Ulush: `${getDashboardPercent(applicationDashboardStatusTotals.value[status], applicationDashboardTotal.value)}%`,
    }))
    const stepRows = applicationReportVisibleSteps.value.map((step) => ({
      Bosqich: step,
      Qiymat: applicationDashboardStepTotals.value[step],
      Ulush: `${getDashboardPercent(applicationDashboardStepTotals.value[step], applicationDashboardTotal.value)}%`,
    }))

    const kpiWorksheet = xlsx.utils.json_to_sheet(kpiRows)
    const statusWorksheet = xlsx.utils.json_to_sheet(statusRows)
    const stepWorksheet = xlsx.utils.json_to_sheet(stepRows)
    const filterWorksheet = xlsx.utils.json_to_sheet(getApplicationReportFilterExportRows())

    kpiWorksheet['!cols'] = [{ wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 32 }]
    statusWorksheet['!cols'] = [{ wch: 22 }, { wch: 12 }, { wch: 12 }]
    stepWorksheet['!cols'] = [{ wch: 42 }, { wch: 12 }, { wch: 12 }]
    filterWorksheet['!cols'] = [{ wch: 24 }, { wch: 48 }]

    xlsx.utils.book_append_sheet(workbook, kpiWorksheet, 'Dashboard')
    xlsx.utils.book_append_sheet(workbook, statusWorksheet, 'Statuslar')
    xlsx.utils.book_append_sheet(workbook, stepWorksheet, 'Bosqichlar')
    xlsx.utils.book_append_sheet(workbook, filterWorksheet, 'Filterlar')

    const reportDate = new Date().toISOString().slice(0, 10)
    downloadScheduled = true
    stopLoading(() => {
      xlsx.writeFile(workbook, `iptk-arizalar-dashboard-${reportDate}.xlsx`)
      pushFeedback('success', 'Dashboard maʼlumotlari Excel formatida yuklab olindi.', 'Yuklab olish bajarildi')
    })
  } finally {
    if (!downloadScheduled && actionLoadingKey.value === 'application-dashboard-download') {
      stopLoading()
    }
  }
}

function openApplicationReportRegion(region: string, isTotal: boolean) {
  if (isTotal || selectedApplicationReportRegion.value || appliedApplicationReportDistrictFilter.value.length) return
  clearApplicationReportCellSelection()
  selectedApplicationReportRegion.value = region
}

function closeApplicationReportRegion() {
  clearApplicationReportCellSelection()
  selectedApplicationReportRegion.value = null
}

function getApplicationReportCellKey(region: string, group: string, column: string) {
  return `${region}::${group}::${column}`
}

function isApplicationReportCellSelected(region: string, group: string, column: string) {
  return Boolean(selectedApplicationReportCells.value[getApplicationReportCellKey(region, group, column)])
}

function getApplicationReportCellClass(region: string, group: string, column: string) {
  return isApplicationReportCellSelected(region, group, column)
    ? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/35'
    : 'hover:bg-primary/5'
}

function clearApplicationReportCellSelection() {
  selectedApplicationReportCells.value = {}
}

function handleApplicationReportCellClick(
  event: MouseEvent,
  region: string,
  group: string,
  column: string,
  value: number,
) {
  event.preventDefault()
  const key = getApplicationReportCellKey(region, group, column)
  const hasSelectedCells = selectedApplicationReportCellValues.value.length > 0

  if (!event.ctrlKey && !event.metaKey) {
    selectedApplicationReportCells.value = {
      [key]: {
        label: `${region} / ${column}`,
        value,
      },
    }
    return
  }

  if (!hasSelectedCells) return

  const nextSelectedCells = { ...selectedApplicationReportCells.value }
  if (nextSelectedCells[key]) {
    delete nextSelectedCells[key]
  } else {
    nextSelectedCells[key] = {
      label: `${region} / ${column}`,
      value,
    }
  }

  selectedApplicationReportCells.value = nextSelectedCells
}

function syncApplicationReportDraftFilters() {
  draftApplicationReportStatusFilter.value = [...appliedApplicationReportStatusFilter.value]
  draftApplicationReportStepFilter.value = [...appliedApplicationReportStepFilter.value]
  draftApplicationReportRegionFilter.value = [...appliedApplicationReportRegionFilter.value]
  draftApplicationReportDistrictFilter.value = [...appliedApplicationReportDistrictFilter.value]
  draftApplicationReportMetricFilters.value = Object.fromEntries(
    applicationReportMetricGroups.map((group) => [
      group.key,
      [...appliedApplicationReportMetricFilters.value[group.key]],
    ]),
  ) as Record<ApplicationReportMetricKey, string[]>
  draftApplicationReportStartDateFilter.value = appliedApplicationReportStartDateFilter.value
  draftApplicationReportEndDateFilter.value = appliedApplicationReportEndDateFilter.value
  draftApplicationReportSnapshotDateFilter.value = appliedApplicationReportSnapshotDateFilter.value
  draftApplicationReportComparisonDateFilter.value = appliedApplicationReportComparisonDateFilter.value
}

function closeApplicationReportFilters() {
  isApplicationReportFilterOpen.value = false
  openApplicationReportFilterField.value = null
  openApplicationReportCalendarField.value = null
}

function toggleApplicationReportFilters(nextOpen: boolean) {
  if (nextOpen) {
    syncApplicationReportDraftFilters()
  }

  isApplicationReportFilterOpen.value = nextOpen
  openApplicationReportFilterField.value = null
  openApplicationReportCalendarField.value = null
}

function toggleApplicationReportFilterField(field: 'status' | 'step' | 'region' | 'district' | ApplicationReportMetricKey) {
  openApplicationReportFilterField.value = openApplicationReportFilterField.value === field ? null : field
  openApplicationReportCalendarField.value = null
}

function toggleApplicationReportStatusFilter(status: ApplicationReportStatus) {
  const nextStatuses = draftApplicationReportStatusFilter.value.includes(status)
    ? draftApplicationReportStatusFilter.value.filter((item) => item !== status)
    : [...draftApplicationReportStatusFilter.value, status]

  draftApplicationReportStatusFilter.value = nextStatuses
  draftApplicationReportStepFilter.value = draftApplicationReportStepFilter.value.filter((step) => (
    !nextStatuses.length || nextStatuses.includes(applicationReportStepStatusMap[step])
  ))
}

function toggleApplicationReportStepFilter(step: ApplicationReportStep) {
  draftApplicationReportStepFilter.value = draftApplicationReportStepFilter.value.includes(step)
    ? draftApplicationReportStepFilter.value.filter((item) => item !== step)
    : [...draftApplicationReportStepFilter.value, step]
}

function toggleApplicationReportRegionFilter(region: string) {
  draftApplicationReportRegionFilter.value = draftApplicationReportRegionFilter.value.includes(region)
    ? draftApplicationReportRegionFilter.value.filter((item) => item !== region)
    : [...draftApplicationReportRegionFilter.value, region]

  const availableDistricts = draftApplicationReportRegionFilter.value
    .flatMap((selectedRegion) => applicationReportDistricts[selectedRegion] ?? [])

  draftApplicationReportDistrictFilter.value = draftApplicationReportDistrictFilter.value.filter((district) => (
    availableDistricts.includes(district)
  ))
}

function toggleApplicationReportDistrictFilter(district: string) {
  if (isApplicationReportDistrictFilterDisabled.value) return

  draftApplicationReportDistrictFilter.value = draftApplicationReportDistrictFilter.value.includes(district)
    ? draftApplicationReportDistrictFilter.value.filter((item) => item !== district)
    : [...draftApplicationReportDistrictFilter.value, district]
}

function toggleApplicationReportMetricFilter(key: ApplicationReportMetricKey, option: string) {
  const selectedItems = draftApplicationReportMetricFilters.value[key]
  draftApplicationReportMetricFilters.value = {
    ...draftApplicationReportMetricFilters.value,
    [key]: selectedItems.includes(option)
      ? selectedItems.filter((item) => item !== option)
      : [...selectedItems, option],
  }
}

function handleApplicationReportStartDateChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftApplicationReportStartDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftApplicationReportEndDateFilter.value.length === 10
    && parseDisplayDate(draftApplicationReportEndDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(draftApplicationReportEndDateFilter.value)! < parseDisplayDate(normalizedValue)!
  ) {
    draftApplicationReportEndDateFilter.value = normalizedValue
  }
}

function handleApplicationReportEndDateChange(value: unknown) {
  const normalizedValue = sanitizeDateFilterInput(String(value ?? ''))
  draftApplicationReportEndDateFilter.value = normalizedValue

  if (
    normalizedValue.length === 10
    && draftApplicationReportStartDateFilter.value.length === 10
    && parseDisplayDate(draftApplicationReportStartDateFilter.value)
    && parseDisplayDate(normalizedValue)
    && parseDisplayDate(normalizedValue)! < parseDisplayDate(draftApplicationReportStartDateFilter.value)!
  ) {
    draftApplicationReportStartDateFilter.value = normalizedValue
  }
}

function getApplicationReportDateFieldValue(field: ApplicationReportDateField) {
  if (field === 'start') return draftApplicationReportStartDateFilter.value
  return draftApplicationReportEndDateFilter.value
}

function handleApplicationReportDateFieldChange(field: ApplicationReportDateField, value: unknown) {
  if (field === 'start') {
    handleApplicationReportStartDateChange(value)
    return
  }

  if (field === 'end') {
    handleApplicationReportEndDateChange(value)
  }
}

function openApplicationReportCalendar(field: ApplicationReportDateField) {
  openApplicationReportCalendarField.value = openApplicationReportCalendarField.value === field ? null : field
  openApplicationReportFilterField.value = null

  if (!openApplicationReportCalendarField.value) {
    return
  }

  applicationReportCalendarMonth.value = calendarMonthFromDisplayDate(getApplicationReportDateFieldValue(field))
}

function shiftApplicationReportCalendarMonth(direction: -1 | 1) {
  const monthValue = applicationReportCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString), Number(monthString) - 1 + direction, 1)
  applicationReportCalendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shiftApplicationReportCalendarYear(direction: -1 | 1) {
  const monthValue = applicationReportCalendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString) + direction, Number(monthString) - 1, 1)
  applicationReportCalendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectApplicationReportCalendarDate(field: ApplicationReportDateField, value: string) {
  handleApplicationReportDateFieldChange(field, value)
  openApplicationReportCalendarField.value = null
}

function isApplicationReportCalendarDateSelected(field: ApplicationReportDateField, value: string) {
  return getApplicationReportDateFieldValue(field) === value
}

function applyApplicationReportFilters() {
  const stopLoading = startActionLoading('application-report-filter-apply')
  closeApplicationReportFilters()
  clearApplicationReportCellSelection()

  runTableLoading(() => {
    appliedApplicationReportStatusFilter.value = [...draftApplicationReportStatusFilter.value]
    appliedApplicationReportStepFilter.value = [...draftApplicationReportStepFilter.value]
    appliedApplicationReportRegionFilter.value = [...draftApplicationReportRegionFilter.value]
    appliedApplicationReportDistrictFilter.value = [...draftApplicationReportDistrictFilter.value]
    appliedApplicationReportMetricFilters.value = Object.fromEntries(
      applicationReportMetricGroups.map((group) => [
        group.key,
        [...draftApplicationReportMetricFilters.value[group.key]],
      ]),
    ) as Record<ApplicationReportMetricKey, string[]>
    appliedApplicationReportStartDateFilter.value = draftApplicationReportStartDateFilter.value
    appliedApplicationReportEndDateFilter.value = draftApplicationReportEndDateFilter.value
    appliedApplicationReportSnapshotDateFilter.value = draftApplicationReportSnapshotDateFilter.value
    appliedApplicationReportComparisonDateFilter.value = draftApplicationReportComparisonDateFilter.value
    if (
      selectedApplicationReportRegion.value
      && appliedApplicationReportRegionFilter.value.length
      && !appliedApplicationReportRegionFilter.value.includes(selectedApplicationReportRegion.value)
    ) {
      selectedApplicationReportRegion.value = null
    }
    stopLoading()
  })
}

function clearApplicationReportFilters() {
  const stopLoading = startActionLoading('application-report-filter-clear')
  closeApplicationReportFilters()
  clearApplicationReportCellSelection()

  draftApplicationReportStatusFilter.value = []
  draftApplicationReportStepFilter.value = []
  draftApplicationReportRegionFilter.value = []
  draftApplicationReportDistrictFilter.value = []
  draftApplicationReportMetricFilters.value = createApplicationReportMetricFilterState()
  draftApplicationReportStartDateFilter.value = ''
  draftApplicationReportEndDateFilter.value = ''

  runTableLoading(() => {
    appliedApplicationReportStatusFilter.value = []
    appliedApplicationReportStepFilter.value = []
    appliedApplicationReportRegionFilter.value = []
    appliedApplicationReportDistrictFilter.value = []
    appliedApplicationReportMetricFilters.value = createApplicationReportMetricFilterState()
    appliedApplicationReportStartDateFilter.value = ''
    appliedApplicationReportEndDateFilter.value = ''
    stopLoading()
  })
}

function closeTransientUi() {
  closeFilters()
  closeAssessmentFilters()
  closeApplicationReportFilters()
  clearApplicationReportCellSelection()
  openActionMenuId.value = null
  openServiceTypeActionMenuId.value = null
  openDiagnosisActionMenuId.value = null
  isRowsPerPageOpen.value = false
  isAssessmentRowsPerPageOpen.value = false
  isServiceTypeRowsPerPageOpen.value = false
  isDiagnosisRowsPerPageOpen.value = false
  isFormRegionOpen.value = false
  isServiceTypeStatusOpen.value = false
  isServiceTypeDiagnosesOpen.value = false
  isServiceTypeContraindicationsOpen.value = false
  isServiceTypeDocumentsOpen.value = false
  isServiceTypeTranslationsOpen.value = false
  isDiagnosisStatusOpen.value = false
  isDiagnosisIcdOpen.value = false
  isDiagnosisTranslationsOpen.value = false
}

function closeTopLayer() {
  if (pendingConfirmation.value && !isConfirmationLoading.value) {
    closeConfirmation()
    return
  }

  if (selectedAssessmentViewRecord.value) {
    closeAssessmentViewDialog()
    return
  }

  if (selectedViewRecord.value) {
    closeViewDialog()
    return
  }

  if (selectedServiceTypeRecord.value) {
    closeServiceTypeViewDialog()
    return
  }

  if (selectedDiagnosisRecord.value) {
    closeDiagnosisViewDialog()
    return
  }

  if (isCreateDialogOpen.value) {
    closeCreateDialog()
    return
  }

  if (isServiceTypeDialogOpen.value) {
    closeServiceTypeDialog()
    return
  }

  if (isDiagnosisDialogOpen.value) {
    closeDiagnosisDialog()
    return
  }

  closeTransientUi()
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  event.preventDefault()
  closeTopLayer()
}

async function downloadDiagnoses() {
  const xlsx = await import('xlsx')

  const exportRows = filteredDiagnoses.value.map((record) => {
    const row: Record<string, string> = {
      ID: record.id,
      Sana: formatDateDisplay(record.date),
      'Qisqa nomi': record.shortName.uzLatn,
      "To'liq nomi": record.fullName.uzLatn,
      Status: record.status,
    }

    if (requiresMedicalReferenceIcd.value) {
      row['ICD-10 kodlari'] = record.icdCodes.join(', ')
    }

    if (isCategoryGroupRecord(record)) {
      row['Minimal ball'] = String(record.minScore)
      row['Maksimal ball'] = String(record.maxScore)
    }

    return row
  })

  const worksheet = xlsx.utils.json_to_sheet(exportRows)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, medicalReferenceSheetName.value)
  xlsx.writeFile(workbook, medicalReferenceExportName.value)
}

watch(formRegion, (nextRegion, previousRegion) => {
  if (isHydratingEditForm || !nextRegion || nextRegion === previousRegion) {
    return
  }

  chairSearch.value = createSearchState()
  deputyChairSearch.value = createSearchState()
  secretarySearch.value = createSearchState()
  formMembers.value = formMembers.value.map(() => createEmptyMember())
})

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal
  }
})

watch(assessmentTotalPages, (nextTotal) => {
  if (assessmentCurrentPage.value > nextTotal) {
    assessmentCurrentPage.value = nextTotal
  }
})

watch(serviceTypeTotalPages, (nextTotal) => {
  if (serviceTypeCurrentPage.value > nextTotal) {
    serviceTypeCurrentPage.value = nextTotal
  }
})

watch(diagnosisTotalPages, (nextTotal) => {
  if (diagnosisCurrentPage.value > nextTotal) {
    diagnosisCurrentPage.value = nextTotal
  }
})

watch(() => props.pageKey, () => {
  runTableLoading(() => {})
}, { immediate: true })

watch(isAnyDialogOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
}, { immediate: true })

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  clearNotificationTimers()
  document.body.style.overflow = ''

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  if (serviceTypeSearchDebounceTimer) {
    clearTimeout(serviceTypeSearchDebounceTimer)
  }

  if (diagnosisSearchDebounceTimer) {
    clearTimeout(diagnosisSearchDebounceTimer)
  }

  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  if (actionLoadingTimer) {
    clearTimeout(actionLoadingTimer)
  }

})
</script>

<template>
  <PageContainer v-if="page">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <template v-if="isDashboardPage">
      <div class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-2xl border border-border bg-card p-5">
        <div class="relative flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-end">
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              class="order-2 h-10 gap-2"
              :disabled="actionLoadingKey === 'application-dashboard-download'"
              @click="downloadApplicationDashboard"
            >
              <LoaderCircle
                v-if="actionLoadingKey === 'application-dashboard-download'"
                class="h-4 w-4 animate-spin"
              />
              <Download v-else class="h-4 w-4" />
              Yuklab olish
            </Button>

            <div class="relative order-1">
              <div
                v-if="isApplicationReportFilterOpen"
                class="fixed inset-0 z-40 bg-background/40 xl:hidden"
                @click="closeApplicationReportFilters"
              />

              <Button
                variant="outline"
                :class="isApplicationReportFilterOpen ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
                @click="toggleApplicationReportFilters(!isApplicationReportFilterOpen)"
              >
                <LoaderCircle
                  v-if="actionLoadingKey && actionLoadingKey.startsWith('application-report-filter')"
                  class="h-4 w-4 animate-spin"
                />
                <span
                  v-else-if="applicationReportActiveFilterCount > 0"
                  class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
                >
                  {{ applicationReportActiveFilterCount }}
                </span>
                <Filter v-else class="h-4 w-4" />
                Filter
              </Button>

              <div
                v-if="isApplicationReportFilterOpen"
                class="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none xl:absolute xl:right-0 xl:left-auto xl:top-[calc(100%+0.4rem)] xl:w-[21rem] xl:origin-top-right"
              >
                <div class="flex flex-col gap-3 overflow-y-auto p-4 xl:max-h-[min(34rem,calc(100vh-10rem))] xl:p-3.5">
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-sm font-semibold text-foreground">Filterlar</p>
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground"
                      @click="closeApplicationReportFilters"
                    >
                      <X class="h-4 w-4" />
                    </button>
                  </div>

                  <div class="relative space-y-1.5">
                    <p class="text-sm font-medium text-foreground">Status</p>
                    <button
                      type="button"
                      :class="[
                        'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                        openApplicationReportFilterField === 'status'
                          ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                          : 'border-input hover:border-ring',
                      ]"
                      @click="toggleApplicationReportFilterField('status')"
                    >
                      <span class="truncate">{{ applicationReportStatusFilterLabel }}</span>
                      <ChevronDown
                        :class="[
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                          openApplicationReportFilterField === 'status' ? 'rotate-180' : '',
                        ]"
                      />
                    </button>
                    <div
                      v-if="openApplicationReportFilterField === 'status'"
                      class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                    >
                      <button
                        v-for="status in applicationReportStatuses"
                        :key="`dashboard-filter-status-${status}`"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                        @click="toggleApplicationReportStatusFilter(status)"
                      >
                        <span>{{ status }}</span>
                        <Check
                          v-if="draftApplicationReportStatusFilter.includes(status)"
                          class="h-4 w-4 text-primary"
                        />
                      </button>
                    </div>
                  </div>

                  <div class="relative space-y-1.5">
                    <p class="text-sm font-medium text-foreground">Bosqich</p>
                    <button
                      type="button"
                      :class="[
                        'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                        openApplicationReportFilterField === 'step'
                          ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                          : 'border-input hover:border-ring',
                      ]"
                      @click="toggleApplicationReportFilterField('step')"
                    >
                      <span class="truncate">{{ applicationReportStepFilterLabel }}</span>
                      <ChevronDown
                        :class="[
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                          openApplicationReportFilterField === 'step' ? 'rotate-180' : '',
                        ]"
                      />
                    </button>
                    <div
                      v-if="openApplicationReportFilterField === 'step'"
                      class="max-h-64 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                    >
                      <button
                        v-for="step in applicationReportStepFilterOptions"
                        :key="`dashboard-filter-step-${step}`"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                        @click="toggleApplicationReportStepFilter(step)"
                      >
                        <span>{{ step }}</span>
                        <Check
                          v-if="draftApplicationReportStepFilter.includes(step)"
                          class="h-4 w-4 text-primary"
                        />
                      </button>
                    </div>
                  </div>

                  <div class="relative space-y-1.5">
                    <p class="text-sm font-medium text-foreground">Hudud</p>
                    <button
                      type="button"
                      :class="[
                        'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                        openApplicationReportFilterField === 'region'
                          ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                          : 'border-input hover:border-ring',
                      ]"
                      @click="toggleApplicationReportFilterField('region')"
                    >
                      <span class="truncate">{{ applicationReportRegionFilterLabel }}</span>
                      <ChevronDown
                        :class="[
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                          openApplicationReportFilterField === 'region' ? 'rotate-180' : '',
                        ]"
                      />
                    </button>
                    <div
                      v-if="openApplicationReportFilterField === 'region'"
                      class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                    >
                      <button
                        v-for="region in applicationReportRegions"
                        :key="`dashboard-filter-region-${region}`"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                        @click="toggleApplicationReportRegionFilter(region)"
                      >
                        <span>{{ region }}</span>
                        <Check
                          v-if="draftApplicationReportRegionFilter.includes(region)"
                          class="h-4 w-4 text-primary"
                        />
                      </button>
                    </div>
                  </div>

                  <div class="relative space-y-1.5">
                    <p class="text-sm font-medium text-foreground">Tuman (shahar)</p>
                    <button
                      type="button"
                      :disabled="isApplicationReportDistrictFilterDisabled"
                      :class="[
                        'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                        openApplicationReportFilterField === 'district'
                          ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                          : 'border-input hover:border-ring',
                      ]"
                      @click="toggleApplicationReportFilterField('district')"
                    >
                      <span class="truncate">{{ applicationReportDistrictFilterLabel }}</span>
                      <ChevronDown
                        :class="[
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                          openApplicationReportFilterField === 'district' ? 'rotate-180' : '',
                        ]"
                      />
                    </button>
                    <div
                      v-if="openApplicationReportFilterField === 'district'"
                      class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                    >
                      <button
                        v-for="district in applicationReportDistrictFilterOptions"
                        :key="`dashboard-filter-district-${district}`"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                        @click="toggleApplicationReportDistrictFilter(district)"
                      >
                        <span>{{ district }}</span>
                        <Check
                          v-if="draftApplicationReportDistrictFilter.includes(district)"
                          class="h-4 w-4 text-primary"
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    v-for="group in applicationReportMetricFilterGroups"
                    :key="`dashboard-filter-metric-${group.key}`"
                    class="relative space-y-1.5"
                  >
                    <p class="text-sm font-medium text-foreground">{{ group.label }}</p>
                    <button
                      type="button"
                      :class="[
                        'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                        openApplicationReportFilterField === group.key
                          ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                          : 'border-input hover:border-ring',
                      ]"
                      @click="toggleApplicationReportFilterField(group.key)"
                    >
                      <span class="truncate">{{ getApplicationReportMetricFilterLabel(group.key) }}</span>
                      <ChevronDown
                        :class="[
                          'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                          openApplicationReportFilterField === group.key ? 'rotate-180' : '',
                        ]"
                      />
                    </button>
                    <div
                      v-if="openApplicationReportFilterField === group.key"
                      class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                    >
                      <button
                        v-for="option in group.options"
                        :key="`dashboard-filter-metric-${group.key}-${option}`"
                        type="button"
                        class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                        @click="toggleApplicationReportMetricFilter(group.key, option)"
                      >
                        <span>{{ option }}</span>
                        <Check
                          v-if="draftApplicationReportMetricFilters[group.key].includes(option)"
                          class="h-4 w-4 text-primary"
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    v-for="dateFieldGroup in applicationReportDateFieldGroups"
                    :key="`dashboard-date-group-${dateFieldGroup[0]?.key}`"
                    class="grid gap-3"
                  >
                    <label
                      v-for="dateField in dateFieldGroup"
                      :key="`dashboard-date-${dateField.key}`"
                      class="space-y-1.5 sm:relative"
                    >
                      <span class="text-sm font-medium text-foreground">{{ dateField.label }}</span>
                      <div class="relative space-y-2">
                        <div class="relative">
                          <Input
                            :model-value="getApplicationReportDateFieldValue(dateField.key)"
                            class="h-10 pr-10"
                            inputmode="numeric"
                            maxlength="10"
                            placeholder="dd.mm.yyyy"
                            @keydown="preventDateNonDigitKeydown"
                            @update:model-value="handleApplicationReportDateFieldChange(dateField.key, $event)"
                          />
                          <button
                            type="button"
                            class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                            :aria-label="`${dateField.label}ni tanlash`"
                            @click="openApplicationReportCalendar(dateField.key)"
                          >
                            <CalendarDays class="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          v-if="openApplicationReportCalendarField === dateField.key"
                          class="rounded-lg border border-border bg-background p-3 shadow-sm sm:absolute sm:left-0 sm:right-0 sm:top-[calc(100%+0.5rem)] sm:z-30"
                        >
                          <div class="mb-3 flex items-center justify-between gap-2">
                            <div class="flex items-center gap-1">
                              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Oldingi yil" @click="shiftApplicationReportCalendarYear(-1)">
                                <ChevronsLeft class="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Oldingi oy" @click="shiftApplicationReportCalendarMonth(-1)">
                                <ChevronLeft class="h-4 w-4" />
                              </Button>
                            </div>
                            <p class="text-sm font-medium text-foreground">{{ applicationReportCalendarMonthLabel }}</p>
                            <div class="flex items-center gap-1">
                              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Keyingi oy" @click="shiftApplicationReportCalendarMonth(1)">
                                <ChevronRight class="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Keyingi yil" @click="shiftApplicationReportCalendarYear(1)">
                                <ChevronsRight class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                            <span v-for="weekday in calendarWeekdays" :key="`dashboard-${dateField.key}-${weekday}`" class="py-1">{{ weekday }}</span>
                          </div>

                          <div class="grid grid-cols-7 gap-1">
                            <button
                              v-for="day in applicationReportCalendarDays"
                              :key="`dashboard-${dateField.key}-${day.key}`"
                              type="button"
                              class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                              :class="day.isCurrentMonth
                                ? isApplicationReportCalendarDateSelected(dateField.key, day.value)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-foreground hover:bg-muted'
                                : 'pointer-events-none opacity-0'"
                              :disabled="!day.isCurrentMonth"
                              @click="selectApplicationReportCalendarDate(dateField.key, day.value)"
                            >
                              {{ day.label }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>

                  <div class="flex justify-end gap-2 border-t border-border pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      class="gap-2"
                      :disabled="isTableLoading || (!applicationReportHasActiveFilters && !applicationReportHasPendingFilterChanges)"
                      @click="clearApplicationReportFilters"
                    >
                      <LoaderCircle v-if="actionLoadingKey === 'application-report-filter-clear'" class="h-4 w-4 animate-spin" />
                      Tozalash
                    </Button>
                    <Button
                      size="sm"
                      class="gap-2"
                      :disabled="isTableLoading || !applicationReportHasPendingFilterChanges"
                      @click="applyApplicationReportFilters"
                    >
                      <LoaderCircle v-if="actionLoadingKey === 'application-report-filter-apply'" class="h-4 w-4 animate-spin" />
                      Qo'llash
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="item in applicationDashboardKpis"
            :key="item.label"
            class="flex min-h-[15.5rem] flex-col rounded-xl border border-border bg-background p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-muted-foreground">{{ item.label }}</p>
                <p class="mt-2 text-3xl font-semibold leading-none text-foreground">{{ item.value }}</p>
              </div>
              <div :class="cn('flex h-10 w-10 items-center justify-center rounded-lg border', item.className)">
                <component
                  :is="item.icon"
                  class="h-5 w-5"
                />
              </div>
            </div>
            <p class="mt-3 text-xs text-muted-foreground">{{ item.note }}</p>
            <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                :class="['h-full rounded-full', item.barClass]"
                :style="{ width: `${item.percent}%` }"
              />
            </div>
            <div
              v-if="item.status"
              class="mt-4 flex-1 border-t border-border pt-3"
            >
              <div
                v-for="step in getApplicationDashboardStatusSteps(item.status)"
                :key="step.label"
                class="flex items-center justify-between gap-3 py-1 text-xs"
              >
                <span class="min-w-0 truncate text-muted-foreground">{{ step.label }}</span>
                <span class="shrink-0 font-medium text-foreground">
                  {{ step.value }}
                  <span class="font-normal text-muted-foreground">({{ step.percent }}%)</span>
                </span>
              </div>
            </div>
            <div
              v-else
              class="mt-4 flex-1 border-t border-border pt-3"
            >
              <p class="text-xs text-muted-foreground">Barcha statuslar bo‘yicha umumiy ko‘rsatkich.</p>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-background p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-base font-semibold text-foreground">Statuslar bo'yicha oylik dinamika</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="item in applicationDashboardAreaChart.series"
                :key="item.label"
                class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <span
                  class="h-2.5 w-2.5 rounded-full"
                  :style="{ backgroundColor: item.stroke }"
                />
                {{ item.label }}: {{ item.total }}
              </span>
            </div>
          </div>

          <div class="mt-5 w-full overflow-hidden">
            <svg
              class="block h-auto w-full max-w-full overflow-visible"
              :viewBox="`0 0 ${applicationDashboardAreaChart.width} ${applicationDashboardAreaChart.height}`"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Oylar va statuslar bo'yicha arizalar area chart"
            >
              <defs>
                <linearGradient
                  v-for="item in applicationDashboardAreaChart.series"
                  :id="item.fillId"
                  :key="item.fillId"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    :stop-color="item.stroke"
                    stop-opacity="0.24"
                  />
                  <stop
                    offset="100%"
                    :stop-color="item.stroke"
                    stop-opacity="0.02"
                  />
                </linearGradient>
              </defs>

              <g>
                <line
                  v-for="line in applicationDashboardAreaChart.gridLines"
                  :key="`grid-${line.label}`"
                  :x1="applicationDashboardAreaChart.leftX"
                  :x2="applicationDashboardAreaChart.rightX"
                  :y1="line.y"
                  :y2="line.y"
                  class="stroke-border"
                  stroke-dasharray="4 6"
                />
                <text
                  v-for="line in applicationDashboardAreaChart.gridLines"
                  :key="`grid-label-${line.label}`"
                  x="18"
                  :y="line.y + 4"
                  class="fill-muted-foreground text-[11px]"
                >
                  {{ line.label }}
                </text>
              </g>

              <g>
                <path
                  v-for="item in applicationDashboardAreaChart.series"
                  :key="`area-${item.label}`"
                  :d="item.areaPath"
                  :fill="`url(#${item.fillId})`"
                />
                <path
                  v-for="item in applicationDashboardAreaChart.series"
                  :key="`line-${item.label}`"
                  :d="item.linePath"
                  fill="none"
                  :stroke="item.stroke"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.4"
                />
                <g
                  v-for="item in applicationDashboardAreaChart.series"
                  :key="`points-${item.label}`"
                >
                  <circle
                    v-for="point in item.points"
                    :key="`${item.label}-${point.label}`"
                    :cx="point.x"
                    :cy="point.y"
                    r="2.8"
                    :fill="item.stroke"
                    class="stroke-background"
                    stroke-width="2"
                  />
                </g>
              </g>

              <g>
                <line
                  :x1="applicationDashboardAreaChart.leftX"
                  :x2="applicationDashboardAreaChart.rightX"
                  :y1="applicationDashboardAreaChart.bottomY"
                  :y2="applicationDashboardAreaChart.bottomY"
                  class="stroke-border"
                />
                <text
                  v-for="month in applicationDashboardAreaChart.monthPoints"
                  :key="month.label"
                  :x="month.x"
                  :y="applicationDashboardAreaChart.bottomY + 26"
                  text-anchor="middle"
                  class="fill-muted-foreground text-[11px]"
                >
                  {{ month.label }}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <div v-if="false" class="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <div class="rounded-xl border border-border bg-background p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-foreground">Arizalar dinamikasi</p>
                <p class="text-sm text-muted-foreground">Oylar kesimida kelib tushgan arizalar</p>
              </div>
              <span class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <TrendingUp class="h-4 w-4 text-primary" />
                Yillik ko‘rinish
              </span>
            </div>
            <div class="mt-6 flex h-56 items-end gap-2 overflow-hidden">
              <div
                v-for="item in applicationDashboardMonthlyTrend"
                :key="item.label"
                class="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div class="flex h-44 w-full items-end rounded-t-lg bg-muted/45 px-1">
                  <div
                    class="w-full rounded-t-md bg-primary/80 transition-all duration-300 ease-out"
                    :style="{ height: `${item.percent}%` }"
                  />
                </div>
                <div class="text-center">
                  <p class="text-xs font-medium text-foreground">{{ item.value }}</p>
                  <p class="text-[11px] text-muted-foreground">{{ item.label }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-background p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-foreground">Statuslar</p>
                <p class="text-sm text-muted-foreground">Jami arizalarga nisbatan ulush</p>
              </div>
              <BarChart3 class="h-5 w-5 text-muted-foreground" />
            </div>
            <div class="mt-5 space-y-4">
              <div
                v-for="item in applicationDashboardStatusSummary"
                :key="item.label"
                class="space-y-2"
              >
                <div class="flex items-center justify-between gap-3">
                  <span :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', item.className)">
                    {{ item.label }}
                  </span>
                  <span class="text-sm font-semibold text-foreground">{{ item.value }} / {{ item.percent }}%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full bg-primary transition-all duration-300 ease-out"
                    :style="{ width: `${item.percent}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="card in applicationDashboardDistributionCards"
            :key="card.title"
            class="rounded-xl border border-border bg-background p-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-foreground">{{ card.title }}</p>
              </div>
              <component :is="card.icon" class="h-5 w-5 text-muted-foreground" />
            </div>
            <div class="mt-5 space-y-3">
              <div
                v-for="item in card.items"
                :key="item.label"
                class="space-y-1.5"
              >
                <div class="flex items-center justify-between gap-3 text-sm">
                  <span class="truncate text-foreground">{{ item.label }}</span>
                  <span class="flex shrink-0 items-center gap-1.5">
                    <span class="font-semibold text-foreground">{{ item.value }}</span>
                    <span class="text-xs font-medium text-muted-foreground">({{ item.percent }}%)</span>
                  </span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    :class="['h-full rounded-full', card.barClass]"
                    :style="{ width: `${item.percent}%` }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border border-border bg-background p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-base font-semibold text-foreground">Hududlar bo'yicha statuslar</p>
              <p class="text-sm text-muted-foreground">Har bir hududdagi arizalar statuslar bo'yicha taqsimlangan</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="status in applicationReportStatuses"
                :key="`dashboard-region-legend-${status}`"
                class="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <span :class="['h-2.5 w-2.5 rounded-full', applicationDashboardStatusBarClassMap[status]]" />
                {{ status }}
              </span>
            </div>
          </div>
          <div class="mt-5 overflow-x-auto pb-2">
            <div class="flex min-w-max items-end gap-4 pr-2">
              <div
                v-for="item in applicationDashboardRegionBars"
                :key="item.region"
                class="flex w-28 shrink-0 flex-col items-center gap-2 rounded-lg border border-border bg-card p-3"
              >
                <p class="text-sm font-semibold leading-none text-foreground">{{ item.total }}</p>

                <div class="flex h-56 w-full items-end rounded-xl bg-muted/50 px-3 py-2">
                  <div
                    class="flex w-full min-w-0 flex-col-reverse overflow-hidden rounded-lg bg-muted transition-[height] duration-300 ease-out"
                    :style="{ height: `${item.percent}%` }"
                    :title="`${item.region}: ${item.total}`"
                  >
                    <div
                      v-for="segment in item.segments"
                      v-show="segment.value > 0"
                      :key="`${item.region}-${segment.status}`"
                      :class="['w-full', segment.barClass]"
                      :style="{ height: `${segment.percent}%` }"
                      :title="`${segment.status}: ${segment.value} (${segment.percent}%)`"
                    />
                  </div>
                </div>

                <div class="flex w-full justify-center gap-1">
                  <span
                    v-for="segment in item.segments"
                    :key="`${item.region}-${segment.status}-value`"
                    :class="cn('inline-flex min-w-6 justify-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium', segment.badgeClass)"
                  >
                    {{ segment.value }}
                  </span>
                </div>

                <p class="h-10 w-full overflow-hidden text-center text-xs font-medium leading-5 text-muted-foreground">
                  {{ item.region }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="isCommissionCompositionPage">
      <div
        v-if="feedback"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg',
          feedback.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 dark:border-sky-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              feedback.type === 'success' && 'bg-emerald-500',
              feedback.type === 'error' && 'bg-rose-500',
              feedback.type === 'info' && 'bg-sky-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            feedback.type === 'success' && 'bg-emerald-600',
            feedback.type === 'error' && 'bg-rose-600',
            feedback.type === 'info' && 'bg-sky-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ feedback.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ feedback.message }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible rounded-2xl border border-border bg-card p-5">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="relative w-full lg:max-w-sm">
              <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                :model-value="searchInput"
                class="pl-9"
                placeholder="Qidirish"
                @update:model-value="handleSearchInput(String($event ?? ''))"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button
                class="order-3 h-10 gap-2"
                @click="openCreateDialog"
              >
                <Plus class="h-4 w-4" />
                Yaratish
              </Button>

              <div class="relative order-1">
                <div
                  v-if="isFilterOpen"
                  class="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm xl:hidden"
                  @click="closeFilters"
                />

                <Button
                  variant="outline"
                  :class="isFilterOpen ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
                  @click="toggleFiltersFromMenu(!isFilterOpen)"
                >
                  <LoaderCircle
                    v-if="actionLoadingKey && actionLoadingKey.startsWith('commission-filter')"
                    class="h-4 w-4 animate-spin"
                  />
                  <span
                    v-else-if="activeFilterCount > 0"
                    class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
                  >
                    {{ activeFilterCount }}
                  </span>
                  <Filter
                    v-else
                    class="h-4 w-4"
                  />
                  Filter
                </Button>

                <div
                  v-if="isFilterOpen"
                  class="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none max-xl:max-h-[calc(100vh-7rem)] xl:absolute xl:right-0 xl:top-[calc(100%+0.4rem)] xl:w-[17.5rem] xl:-translate-x-6 xl:origin-top-right"
                >
                  <div class="flex flex-col gap-3 overflow-y-auto p-4 xl:gap-3 xl:p-3.5 xl:max-h-[min(28rem,calc(100vh-10rem))]">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-semibold text-foreground">Filterlar</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        @click="closeFilters"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                      <span class="font-medium text-foreground">Status</span>
                      <div class="space-y-2 xl:mt-2 xl:space-y-0">
                        <button
                          type="button"
                          :class="[
                            'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                            openFilterField === 'status'
                              ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                              : 'border-input hover:border-ring',
                          ]"
                          @click="toggleFilterField('status')"
                        >
                          <span>{{ draftStatusLabel }}</span>
                          <ChevronDown
                            :class="[
                              'h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out',
                              openFilterField === 'status' ? 'rotate-180' : '',
                            ]"
                          />
                        </button>
                        <div
                          v-if="openFilterField === 'status'"
                          class="overflow-hidden rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                        >
                          <button
                            type="button"
                            class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                            @click.stop.prevent="selectStatusFilter('all')"
                          >
                            <span>Barchasi</span>
                            <Check
                              v-if="draftStatusFilter === 'all'"
                              class="h-4 w-4 text-primary"
                            />
                          </button>
                          <button
                            v-for="status in commissionStatusOptions"
                            :key="status"
                            type="button"
                            class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                            @click.stop.prevent="selectStatusFilter(status)"
                          >
                            <span>{{ status }}</span>
                            <Check
                              v-if="draftStatusFilter === status"
                              class="h-4 w-4 text-primary"
                            />
                          </button>
                        </div>
                      </div>
                    </label>

                    <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                      <span class="font-medium text-foreground">Hudud</span>
                      <div class="space-y-2 xl:mt-2 xl:space-y-0">
                        <button
                          type="button"
                          :class="[
                            'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                            openFilterField === 'region'
                              ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                              : 'border-input hover:border-ring',
                          ]"
                          @click="toggleFilterField('region')"
                        >
                          <span class="truncate">{{ draftRegionLabel }}</span>
                          <ChevronDown
                            :class="[
                              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                              openFilterField === 'region' ? 'rotate-180' : '',
                            ]"
                          />
                        </button>
                        <div
                          v-if="openFilterField === 'region'"
                          class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                        >
                          <button
                            type="button"
                            class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                            @click.stop.prevent="selectRegionFilter('all')"
                          >
                            <span>Barchasi</span>
                            <Check
                              v-if="draftRegionFilter === 'all'"
                              class="h-4 w-4 text-primary"
                            />
                          </button>
                          <button
                            v-for="region in regionOptions"
                            :key="region"
                            type="button"
                            class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                            @click.stop.prevent="selectRegionFilter(region)"
                          >
                            <span class="truncate">{{ region }}</span>
                            <Check
                              v-if="draftRegionFilter === region"
                              class="h-4 w-4 shrink-0 text-primary"
                            />
                          </button>
                        </div>
                      </div>
                    </label>

                    <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                      <span class="font-medium text-foreground">Boshlanish sanasi</span>
                      <div class="relative space-y-2 xl:mt-2 xl:space-y-0">
                        <div class="relative">
                          <Input
                            :model-value="draftStartDateFilter"
                            class="h-10 pr-10"
                            inputmode="numeric"
                            maxlength="10"
                            placeholder="dd.mm.yyyy"
                            @keydown="preventDateNonDigitKeydown"
                            @update:model-value="handleStartDateFilterChange"
                          />
                          <button
                            type="button"
                            class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                            aria-label="Boshlanish sanasini tanlash"
                            @click="openCalendar('start')"
                          >
                            <CalendarDays class="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          v-if="openCalendarField === 'start'"
                          class="rounded-lg border border-border bg-background p-3 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-30"
                        >
                          <div class="mb-3 flex items-center justify-between gap-2">
                            <div class="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Oldingi yil"
                                @click="shiftCalendarYear(-1)"
                              >
                                <ChevronsLeft class="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Oldingi oy"
                                @click="shiftCalendarMonth(-1)"
                              >
                                <ChevronLeft class="h-4 w-4" />
                              </Button>
                            </div>
                            <p class="text-sm font-medium text-foreground">
                              {{ calendarMonthLabel }}
                            </p>
                            <div class="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Keyingi oy"
                                @click="shiftCalendarMonth(1)"
                              >
                                <ChevronRight class="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Keyingi yil"
                                @click="shiftCalendarYear(1)"
                              >
                                <ChevronsRight class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                            <span
                              v-for="weekday in calendarWeekdays"
                              :key="weekday"
                              class="py-1"
                            >
                              {{ weekday }}
                            </span>
                          </div>

                          <div class="grid grid-cols-7 gap-1">
                            <button
                              v-for="day in calendarDays"
                              :key="day.key"
                              type="button"
                              class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                              :class="day.isCurrentMonth
                                ? isCalendarDateSelected(day.value)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-foreground hover:bg-muted'
                                : 'pointer-events-none opacity-0'"
                              :disabled="!day.isCurrentMonth"
                              @click="selectCalendarDate('start', day.value)"
                            >
                              {{ day.label }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </label>

                    <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                      <span class="font-medium text-foreground">Tugash sanasi</span>
                      <div class="relative space-y-2 xl:mt-2 xl:space-y-0">
                        <div class="relative">
                          <Input
                            :model-value="draftEndDateFilter"
                            class="h-10 pr-10"
                            inputmode="numeric"
                            maxlength="10"
                            placeholder="dd.mm.yyyy"
                            @keydown="preventDateNonDigitKeydown"
                            @update:model-value="handleEndDateFilterChange"
                          />
                          <button
                            type="button"
                            class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                            aria-label="Tugash sanasini tanlash"
                            @click="openCalendar('end')"
                          >
                            <CalendarDays class="h-4 w-4" />
                          </button>
                        </div>

                        <div
                          v-if="openCalendarField === 'end'"
                          class="rounded-lg border border-border bg-background p-3 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-30"
                        >
                          <div class="mb-3 flex items-center justify-between gap-2">
                            <div class="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Oldingi yil"
                                @click="shiftCalendarYear(-1)"
                              >
                                <ChevronsLeft class="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Oldingi oy"
                                @click="shiftCalendarMonth(-1)"
                              >
                                <ChevronLeft class="h-4 w-4" />
                              </Button>
                            </div>
                            <p class="text-sm font-medium text-foreground">
                              {{ calendarMonthLabel }}
                            </p>
                            <div class="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Keyingi oy"
                                @click="shiftCalendarMonth(1)"
                              >
                                <ChevronRight class="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                class="h-8 w-8 p-0"
                                aria-label="Keyingi yil"
                                @click="shiftCalendarYear(1)"
                              >
                                <ChevronsRight class="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                            <span
                              v-for="weekday in calendarWeekdays"
                              :key="weekday"
                              class="py-1"
                            >
                              {{ weekday }}
                            </span>
                          </div>

                          <div class="grid grid-cols-7 gap-1">
                            <button
                              v-for="day in calendarDays"
                              :key="day.key"
                              type="button"
                              class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                              :class="day.isCurrentMonth
                                ? isCalendarDateSelected(day.value)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'text-foreground hover:bg-muted'
                                : 'pointer-events-none opacity-0'"
                              :disabled="!day.isCurrentMonth"
                              @click="selectCalendarDate('end', day.value)"
                            >
                              {{ day.label }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </label>

                    <div class="flex items-center justify-end gap-3 border-t border-border pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        :disabled="isTableLoading || (!hasActiveFilters && !hasPendingFilterChanges)"
                        class="gap-2"
                        @click="clearFilters"
                      >
                        <LoaderCircle
                          v-if="actionLoadingKey === 'commission-filter-clear'"
                          class="h-4 w-4 animate-spin"
                        />
                        Tozalash
                      </Button>
                      <Button
                        size="sm"
                        :disabled="isTableLoading || !hasPendingFilterChanges"
                        class="gap-2"
                        @click="applyFilters"
                      >
                        <LoaderCircle
                          v-if="actionLoadingKey === 'commission-filter-apply'"
                          class="h-4 w-4 animate-spin"
                        />
                        Qo'llash
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                class="order-2 h-10 gap-2"
                :disabled="actionLoadingKey === 'commission-download'"
                @click="downloadCommissions"
              >
                <LoaderCircle
                  v-if="actionLoadingKey === 'commission-download'"
                  class="h-4 w-4 animate-spin"
                />
                <Download
                  v-else
                  class="h-4 w-4"
                />
                Yuklab olish
              </Button>
            </div>
        </div>

        <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
          <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
            <div class="relative flex-1 xl:hidden">
              <div
                v-if="isTableLoading"
                class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              >
                <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                  <span>Yuklanmoqda...</span>
                </div>
              </div>
              <div
                v-if="paginatedCommissions.length === 0"
                class="flex min-h-[18rem] items-center justify-center px-4 py-10 text-center"
              >
                <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                  <p class="text-sm font-medium text-foreground">
                    Ma'lumot topilmadi
                  </p>
                  <p class="text-sm text-muted-foreground">
                    Qidiruv yoki filter shartlariga mos yozuv topilmadi.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    class="mt-2"
                    @click="resetSearchAndFilters"
                  >
                    Tozalash
                  </Button>
                </div>
              </div>

              <div
                v-else
                class="grid grid-cols-1 gap-3 p-4 md:grid-cols-2"
              >
                <Card
                  v-for="record in paginatedCommissions"
                  :key="record.id"
                  class="border-border"
                >
                  <CardContent class="space-y-4 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          ID
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ record.documentNumber }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ formatDateDisplay(record.createdAt) }}
                        </p>
                      </div>

                      <div class="flex items-center gap-2">
                        <span :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[record.status])">
                          {{ record.status }}
                        </span>

                        <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="openActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                            >
                              <LoaderCircle v-if="isActionButtonLoading(`commission-view-${record.id}`, `commission-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                              <Ellipsis v-else class="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuContent
                              side="bottom"
                              align="end"
                              :side-offset="6"
                              :collision-padding="12"
                              class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                            >
                              <DropdownMenuItem
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="viewCommission(record)"
                              >
                                <Eye class="h-4 w-4 shrink-0" />
                                <span>Ko'rish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="editCommission(record)"
                              >
                                <Pencil class="h-4 w-4 shrink-0" />
                                <span>Tahrirlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="requestSendCommission(record)"
                              >
                                <Check class="h-4 w-4 shrink-0" />
                                <span>Yuborish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Yuborilgan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="requestApproveCommission(record)"
                              >
                                <CheckCheck class="h-4 w-4 shrink-0" />
                                <span>Tasdiqlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Yuborilgan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                @click="requestRejectCommission(record)"
                              >
                                <X class="h-4 w-4 shrink-0" />
                                <span>Bekor qilish</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenuRoot>
                      </div>
                    </div>

                    <div class="grid gap-3 text-sm">
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Rais
                        </p>
                        <p class="mt-1 font-medium uppercase text-foreground">
                          {{ normalizeFullName(record.chair) }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ record.chairPinfl }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Rais o'rinbosari
                        </p>
                        <p class="mt-1 font-medium uppercase text-foreground">
                          {{ normalizeFullName(record.deputyChair) }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ record.deputyChairPinfl }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Kotib
                        </p>
                        <p class="mt-1 font-medium uppercase text-foreground">
                          {{ normalizeFullName(record.secretary) }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ record.secretaryPinfl }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          A'zolar
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ record.members.length }} ta
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Hudud
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ record.region }}
                        </p>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div class="relative hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
              <div
                v-if="isTableLoading"
                class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              >
                <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                  <span>Yuklanmoqda...</span>
                </div>
              </div>
              <table class="min-w-[1380px] border-separate border-spacing-0 text-sm xl:min-w-full">
                <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                  <tr>
                    <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Hujjat</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Rais</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Rais o'rinbosari</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Kotib</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">A'zolar</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Hudud</th>
                    <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedCommissions.length === 0">
                    <td
                      colspan="8"
                      class="border-b border-border px-4 py-12 text-center"
                    >
                      <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                        <p class="text-sm font-medium text-foreground">
                          Ma'lumot topilmadi
                        </p>
                        <p class="text-sm text-muted-foreground">
                          Qidiruv yoki filter shartlariga mos yozuv topilmadi.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          class="mt-2"
                          @click="resetSearchAndFilters"
                        >
                          Tozalash
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="record in paginatedCommissions"
                    :key="record.id"
                    class="transition-colors duration-200 ease-out hover:bg-muted/30"
                  >
                    <td class="border-b border-border px-4 py-3 align-top">
                      <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                        <DropdownMenuTrigger as-child>
                          <Button
                            variant="outline"
                            size="sm"
                            :class="openActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                          >
                            <LoaderCircle v-if="isActionButtonLoading(`commission-view-${record.id}`, `commission-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                            <Ellipsis v-else class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            :side-offset="6"
                            :collision-padding="12"
                            class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                          >
                            <DropdownMenuItem
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="viewCommission(record)"
                            >
                              <Eye class="h-4 w-4 shrink-0" />
                              <span>Ko'rish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="editCommission(record)"
                            >
                              <Pencil class="h-4 w-4 shrink-0" />
                              <span>Tahrirlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="requestSendCommission(record)"
                            >
                              <Check class="h-4 w-4 shrink-0" />
                              <span>Yuborish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Yuborilgan'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="requestApproveCommission(record)"
                            >
                              <CheckCheck class="h-4 w-4 shrink-0" />
                              <span>Tasdiqlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Yuborilgan'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                              @click="requestRejectCommission(record)"
                            >
                              <X class="h-4 w-4 shrink-0" />
                              <span>Bekor qilish</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuPortal>
                      </DropdownMenuRoot>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium text-foreground">
                        {{ record.documentNumber }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ formatDateDisplay(record.createdAt) }}
                      </p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium uppercase text-foreground">
                        {{ normalizeFullName(record.chair) }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ record.chairPinfl }}
                      </p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium uppercase text-foreground">
                        {{ normalizeFullName(record.deputyChair) }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ record.deputyChairPinfl }}
                      </p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium uppercase text-foreground">
                        {{ normalizeFullName(record.secretary) }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ record.secretaryPinfl }}
                      </p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-foreground">
                      {{ record.members.length }} ta
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-foreground">
                      {{ record.region }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[record.status])">
                        {{ record.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Qatorlar soni</span>
              <DropdownMenuRoot @update:open="setRowsPerPageOpen($event)">
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="outline"
                    size="sm"
                    :class="isRowsPerPageOpen ? 'h-8 gap-1.5 rounded-md border-ring bg-accent/40 px-2.5 text-sm ring-2 ring-ring/20' : 'h-8 gap-1.5 rounded-md px-2.5 text-sm'"
                  >
                    <span>{{ selectedRowsPerPage }}</span>
                    <ChevronRight class="h-4 w-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent
                    align="start"
                    :side-offset="6"
                    class="z-50 w-[var(--reka-dropdown-menu-trigger-width)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                  >
                    <DropdownMenuItem
                      v-for="option in rowsPerPageOptions"
                      :key="option"
                      class="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted"
                      @select.prevent="setRowsPerPage(option)"
                    >
                      <span :class="option === selectedRowsPerPage ? 'font-semibold text-foreground' : 'text-foreground'">
                        {{ option }}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenuRoot>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">Sahifada:</span>
              <span class="font-medium text-foreground">{{ paginationRange.start }}-{{ paginationRange.end }} / {{ totalRows }}</span>
            </div>
          </div>

          <div class="inline-flex h-9 w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-0.5 min-[480px]:w-auto min-[480px]:justify-start">
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || currentPage === 1"
              @click="goToPage(1)"
            >
              <ChevronsLeft class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              <ChevronLeft class="h-5 w-5" />
            </Button>
            <span class="min-w-14 text-center text-sm font-semibold text-foreground">
              {{ currentPageSummary }}
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <ChevronRight class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || currentPage === totalPages"
              @click="goToPage(totalPages)"
            >
              <ChevronsRight class="h-5 w-5" />
            </Button>
          </div>
        </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedViewRecord"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeViewDialog"
      >
        <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h2 class="text-xl font-semibold text-foreground">
                  Komissiya tarkibi
                </h2>
                <span :class="cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', statusClassMap[selectedViewRecord.status])">
                  {{ selectedViewRecord.status }}
                </span>
              </div>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ selectedViewRecord.documentNumber }} · {{ selectedViewRecord.region }}
              </p>
            </div>

            <button
              class="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              @click="closeViewDialog"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
            <div class="grid gap-3 md:grid-cols-4">
              <div class="rounded-2xl border border-border bg-muted/20 p-4">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Sana</p>
                <p class="mt-1 font-semibold text-foreground">{{ formatDateDisplay(selectedViewRecord.createdAt) }}</p>
              </div>
              <div class="rounded-2xl border border-border bg-muted/20 p-4">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bosqich</p>
                <p class="mt-1 font-semibold text-foreground">{{ workflowStageLabels[selectedViewRecord.workflowStage] }}</p>
              </div>
              <div class="rounded-2xl border border-border bg-muted/20 p-4">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Yangilangan</p>
                <p class="mt-1 font-semibold text-foreground">{{ selectedViewRecord.updatedAt }}</p>
              </div>
              <div class="rounded-2xl border border-border bg-muted/20 p-4">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">A'zolar soni</p>
                <p class="mt-1 font-semibold text-foreground">{{ selectedViewRecord.members.length }}</p>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">
                Rahbariyat
              </h3>
              <div class="grid gap-3 lg:grid-cols-3">
                <div
                  v-for="leader in selectedViewLeadership"
                  :key="leader.role"
                  class="rounded-2xl border border-border bg-card p-4"
                >
                  <div class="flex gap-4">
                    <div class="flex shrink-0 flex-col items-center gap-2">
                      <div class="flex h-28 w-20 items-center justify-center rounded-2xl border border-border bg-primary/5 text-base font-semibold text-primary">
                        {{ getProfileInitials(leader.profile) }}
                      </div>
                      <span class="text-xs text-muted-foreground">Rasm</span>
                    </div>
                    <div class="min-w-0 flex-1 space-y-3">
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ leader.role }}</p>
                        <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(leader.profile.fullName) }}</p>
                      </div>
                      <div class="grid gap-2 text-sm">
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                          <p class="text-foreground">{{ leader.profile.birthDate }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                          <p class="text-foreground">{{ leader.profile.pinfl }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Asosiy lavozimi</p>
                          <p class="text-foreground">{{ leader.position }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Telefon raqami</p>
                          <p class="text-foreground">{{ formatPhoneDisplay(leader.phone) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">
                Komissiya a'zolari
              </h3>
              <div class="grid gap-3 md:grid-cols-2">
                <div
                  v-for="member in selectedViewRecord.members"
                  :key="member.id"
                  class="rounded-2xl border border-border bg-card p-4"
                >
                  <div class="grid gap-4 md:grid-cols-[6rem_minmax(0,1fr)]">
                    <div class="flex flex-col items-center gap-2">
                      <div class="flex h-28 w-20 items-center justify-center rounded-2xl border border-border bg-primary/5 text-base font-semibold text-primary">
                        {{ getProfileInitials({ fullName: member.fullName, pinfl: member.pinfl, birthDate: member.birthDate, region: member.region, district: member.district }) }}
                      </div>
                      <span class="text-xs text-muted-foreground">Rasm</span>
                    </div>
                    <div class="min-w-0 space-y-3">
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">FIO</p>
                        <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(member.fullName) }}</p>
                      </div>
                      <div class="grid gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                          <p class="text-foreground">{{ member.birthDate }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                          <p class="text-foreground">{{ member.pinfl }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Asosiy lavozimi</p>
                          <p class="text-foreground">{{ member.position || '-' }}</p>
                        </div>
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Telefon raqami</p>
                          <p class="text-foreground">{{ formatPhoneDisplay(member.phone) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <h3 class="text-base font-semibold text-foreground">
                Hujjat tarixi
              </h3>
              <div class="mt-4 space-y-3">
                <div
                  v-for="(history, index) in selectedViewHistory"
                  :key="`${history.operation}-${index}`"
                  class="grid gap-3 rounded-xl border border-border bg-background px-4 py-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_10rem]"
                >
                  <div class="flex min-w-0 gap-3">
                    <span
                      :class="[
                        'mt-1 h-2.5 w-2.5 shrink-0 rounded-full',
                        history.tone === 'success'
                          ? 'bg-emerald-500'
                          : history.tone === 'destructive'
                            ? 'bg-rose-500'
                            : 'bg-amber-500',
                      ]"
                    />
                    <div class="min-w-0">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Amaliyot
                      </p>
                      <p class="mt-1 text-sm font-semibold text-foreground">
                        {{ history.operation }}
                      </p>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Bajaruvchi
                    </p>
                    <p class="mt-1 truncate text-sm text-foreground">
                      {{ history.performer }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Bajarilgan vaqt
                    </p>
                    <p class="mt-1 text-sm text-foreground">
                      {{ history.performedAt }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end border-t border-border px-6 py-4">
            <Button
              variant="outline"
              @click="closeViewDialog"
            >
              Yopish
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        :open="Boolean(pendingConfirmation)"
        :tone="pendingConfirmation?.tone"
        :title="pendingConfirmation?.title ?? ''"
        :description="pendingConfirmation?.description ?? ''"
        :confirm-label="pendingConfirmation?.confirmLabel ?? ''"
        :loading="isConfirmationLoading"
        @cancel="closeConfirmation"
        @confirm="confirmPendingAction"
      />

      <div
        v-if="isCreateDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeCreateDialog"
      >
        <div class="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <h2 class="text-xl font-semibold text-foreground">
                  Komissiya tarkibini shakllantirish
                </h2>
                <span
                  v-if="editingId"
                  class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                >
                  Tahrirlash
                </span>
              </div>
              <p
                v-if="editingId"
                class="mt-1 text-sm text-muted-foreground"
              >
                Mavjud hujjat ma'lumotlarini shu forma orqali yangilang.
              </p>
            </div>

            <button
              class="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              @click="closeCreateDialog"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-6 px-6 py-6">
            <div class="grid gap-4">
              <label class="relative max-w-sm space-y-2 text-sm font-medium text-foreground">
                <span>Viloyat</span>
                <button
                  type="button"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                    isFormRegionOpen
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="isFormRegionOpen = !isFormRegionOpen"
                >
                  <span class="truncate">{{ formRegion || 'Viloyatni tanlang' }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      isFormRegionOpen ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="isFormRegionOpen"
                  class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                >
                  <button
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click="selectFormRegion('')"
                  >
                    <span>Viloyatni tanlang</span>
                    <CheckCheck
                      v-if="!formRegion"
                      class="h-4 w-4 text-primary"
                    />
                  </button>
                  <button
                    v-for="region in regionOptions"
                    :key="region"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click="selectFormRegion(region)"
                  >
                    <span>{{ region }}</span>
                    <CheckCheck
                      v-if="formRegion === region"
                      class="h-4 w-4 text-primary"
                    />
                  </button>
                </div>
              </label>
            </div>

            <div class="grid gap-4 xl:grid-cols-2">
              <div class="space-y-4 rounded-3xl border border-border bg-card p-4">
                <p class="text-sm font-semibold text-foreground">
                  Komissiya raisi
                </p>
                <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label class="space-y-2">
                    <span class="text-sm font-medium text-foreground">JSHSHIR</span>
                    <Input
                      :model-value="chairSearch.pinfl"
                      inputmode="numeric"
                      maxlength="14"
                      autocomplete="off"
                      placeholder="JSHSHIR kiriting"
                      @keydown="preventInvalidPinflKey"
                      @keyup.enter="lookupCommissionSearch(chairSearch, 1)"
                      @paste="preventInvalidPinflPaste"
                      @update:model-value="updateSearchPinfl(chairSearch, String($event ?? ''))"
                    />
                  </label>
                  <Button
                    :disabled="chairSearch.pinfl.length !== 14"
                    @click="lookupCommissionSearch(chairSearch, 1)"
                  >
                    Qidiruv
                  </Button>
                </div>
                <p
                  v-if="chairSearch.error"
                  class="text-sm text-rose-600"
                >
                  {{ chairSearch.error }}
                </p>
                <div
                  v-if="chairSearch.profile"
                  class="grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <div class="flex flex-col items-center gap-2">
                    <div class="flex h-32 w-24 items-center justify-center rounded-2xl border border-border bg-primary/5 text-lg font-semibold text-primary">
                      {{ getProfileInitials(chairSearch.profile) }}
                    </div>
                    <span class="text-xs text-muted-foreground">Rasm</span>
                  </div>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="md:col-span-2">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">FIO</p>
                      <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(chairSearch.profile.fullName) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                      <p class="mt-1 text-sm text-foreground">{{ chairSearch.profile.birthDate }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                      <p class="mt-1 text-sm text-foreground">{{ chairSearch.profile.pinfl }}</p>
                    </div>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Asosiy lavozimi</span>
                      <Input
                        v-model="chairSearch.position"
                        placeholder="Lavozimini kiriting"
                      />
                    </label>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Telefon raqami</span>
                      <div class="flex h-9 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <span class="flex h-full items-center border-r border-border px-3 text-sm font-medium text-foreground">
                          +998
                        </span>
                        <Input
                          :model-value="chairSearch.phone"
                          inputmode="numeric"
                          maxlength="9"
                          autocomplete="off"
                          placeholder="90 123 45 67"
                          class="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
                          @keydown="preventInvalidPhoneKey"
                          @paste="preventInvalidPhonePaste"
                          @update:model-value="chairSearch.phone = sanitizePhoneDigits(String($event ?? ''))"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div class="space-y-4 rounded-3xl border border-border bg-card p-4">
                <p class="text-sm font-semibold text-foreground">
                  Rais o'rinbosari
                </p>
                <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label class="space-y-2">
                    <span class="text-sm font-medium text-foreground">JSHSHIR</span>
                    <Input
                      :model-value="deputyChairSearch.pinfl"
                      inputmode="numeric"
                      maxlength="14"
                      autocomplete="off"
                      placeholder="JSHSHIR kiriting"
                      @keydown="preventInvalidPinflKey"
                      @keyup.enter="lookupCommissionSearch(deputyChairSearch, 2)"
                      @paste="preventInvalidPinflPaste"
                      @update:model-value="updateSearchPinfl(deputyChairSearch, String($event ?? ''))"
                    />
                  </label>
                  <Button
                    :disabled="deputyChairSearch.pinfl.length !== 14"
                    @click="lookupCommissionSearch(deputyChairSearch, 2)"
                  >
                    Qidiruv
                  </Button>
                </div>
                <p
                  v-if="deputyChairSearch.error"
                  class="text-sm text-rose-600"
                >
                  {{ deputyChairSearch.error }}
                </p>
                <div
                  v-if="deputyChairSearch.profile"
                  class="grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <div class="flex flex-col items-center gap-2">
                    <div class="flex h-32 w-24 items-center justify-center rounded-2xl border border-border bg-primary/5 text-lg font-semibold text-primary">
                      {{ getProfileInitials(deputyChairSearch.profile) }}
                    </div>
                    <span class="text-xs text-muted-foreground">Rasm</span>
                  </div>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="md:col-span-2">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">FIO</p>
                      <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(deputyChairSearch.profile.fullName) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                      <p class="mt-1 text-sm text-foreground">{{ deputyChairSearch.profile.birthDate }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                      <p class="mt-1 text-sm text-foreground">{{ deputyChairSearch.profile.pinfl }}</p>
                    </div>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Asosiy lavozimi</span>
                      <Input
                        v-model="deputyChairSearch.position"
                        placeholder="Lavozimini kiriting"
                      />
                    </label>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Telefon raqami</span>
                      <div class="flex h-9 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <span class="flex h-full items-center border-r border-border px-3 text-sm font-medium text-foreground">
                          +998
                        </span>
                        <Input
                          :model-value="deputyChairSearch.phone"
                          inputmode="numeric"
                          maxlength="9"
                          autocomplete="off"
                          placeholder="90 123 45 67"
                          class="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
                          @keydown="preventInvalidPhoneKey"
                          @paste="preventInvalidPhonePaste"
                          @update:model-value="deputyChairSearch.phone = sanitizePhoneDigits(String($event ?? ''))"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div class="space-y-4 rounded-3xl border border-border bg-card p-4 xl:col-span-2">
                <p class="text-sm font-semibold text-foreground">
                  Komissiya kotibi
                </p>
                <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                  <label class="space-y-2">
                    <span class="text-sm font-medium text-foreground">JSHSHIR</span>
                    <Input
                      :model-value="secretarySearch.pinfl"
                      inputmode="numeric"
                      maxlength="14"
                      autocomplete="off"
                      placeholder="JSHSHIR kiriting"
                      @keydown="preventInvalidPinflKey"
                      @keyup.enter="lookupCommissionSearch(secretarySearch, 3)"
                      @paste="preventInvalidPinflPaste"
                      @update:model-value="updateSearchPinfl(secretarySearch, String($event ?? ''))"
                    />
                  </label>
                  <Button
                    :disabled="secretarySearch.pinfl.length !== 14"
                    @click="lookupCommissionSearch(secretarySearch, 3)"
                  >
                    Qidiruv
                  </Button>
                </div>
                <p
                  v-if="secretarySearch.error"
                  class="text-sm text-rose-600"
                >
                  {{ secretarySearch.error }}
                </p>
                <div
                  v-if="secretarySearch.profile"
                  class="grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <div class="flex flex-col items-center gap-2">
                    <div class="flex h-32 w-24 items-center justify-center rounded-2xl border border-border bg-primary/5 text-lg font-semibold text-primary">
                      {{ getProfileInitials(secretarySearch.profile) }}
                    </div>
                    <span class="text-xs text-muted-foreground">Rasm</span>
                  </div>
                  <div class="grid gap-3 md:grid-cols-2">
                    <div class="md:col-span-2">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">FIO</p>
                      <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(secretarySearch.profile.fullName) }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                      <p class="mt-1 text-sm text-foreground">{{ secretarySearch.profile.birthDate }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                      <p class="mt-1 text-sm text-foreground">{{ secretarySearch.profile.pinfl }}</p>
                    </div>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Asosiy lavozimi</span>
                      <Input
                        v-model="secretarySearch.position"
                        placeholder="Lavozimini kiriting"
                      />
                    </label>
                    <label class="space-y-2 md:col-span-2">
                      <span class="text-sm font-medium text-foreground">Telefon raqami</span>
                      <div class="flex h-9 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                        <span class="flex h-full items-center border-r border-border px-3 text-sm font-medium text-foreground">
                          +998
                        </span>
                        <Input
                          :model-value="secretarySearch.phone"
                          inputmode="numeric"
                          maxlength="9"
                          autocomplete="off"
                          placeholder="90 123 45 67"
                          class="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
                          @keydown="preventInvalidPhoneKey"
                          @paste="preventInvalidPhonePaste"
                          @update:model-value="secretarySearch.phone = sanitizePhoneDigits(String($event ?? ''))"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 rounded-3xl border border-border bg-card p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-foreground">
                    Komissiya a'zolari
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    A'zolar JSHSHIR orqali bittalab qo'shiladi.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  @click="addMember"
                >
                  <Plus class="h-4 w-4" />
                  A'zo qo'shish
                </Button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(member, index) in formMembers"
                  :key="member.id"
                  class="rounded-2xl border border-border bg-card p-4"
                >
                  <div class="mb-3 flex items-center justify-between gap-3">
                    <p class="text-sm font-semibold text-foreground">
                      A'zo {{ index + 1 }}
                    </p>

                    <Button
                      variant="ghost"
                      size="sm"
                      class="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      @click="removeMember(member.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                      Olib tashlash
                    </Button>
                  </div>

                  <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                    <label class="space-y-2">
                      <span class="text-sm font-medium text-foreground">JSHSHIR</span>
                      <Input
                        :model-value="member.pinfl"
                        inputmode="numeric"
                        maxlength="14"
                        autocomplete="off"
                        placeholder="JSHSHIR kiriting"
                        @keydown="preventInvalidPinflKey"
                        @keyup.enter="lookupCommissionMember(member, index + 4)"
                        @paste="preventInvalidPinflPaste"
                        @update:model-value="updateMemberPinfl(member, String($event ?? ''))"
                      />
                    </label>
                    <Button
                      :disabled="member.pinfl.length !== 14"
                      @click="lookupCommissionMember(member, index + 4)"
                    >
                      Qidiruv
                    </Button>
                  </div>
                  <p
                    v-if="member.error"
                    class="mt-3 text-sm text-rose-600"
                  >
                    {{ member.error }}
                  </p>
                  <div
                    v-if="member.fullName"
                    class="mt-3 grid gap-4 rounded-2xl border border-border bg-background p-4 md:grid-cols-[7rem_minmax(0,1fr)]"
                  >
                    <div class="flex flex-col items-center gap-2">
                      <div class="flex h-32 w-24 items-center justify-center rounded-2xl border border-border bg-primary/5 text-lg font-semibold text-primary">
                        {{ getProfileInitials({ fullName: member.fullName, pinfl: member.pinfl, birthDate: member.birthDate, region: member.region, district: member.district }) }}
                      </div>
                      <span class="text-xs text-muted-foreground">Rasm</span>
                    </div>
                    <div class="grid gap-3 md:grid-cols-2">
                      <div class="md:col-span-2">
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">FIO</p>
                        <p class="mt-1 font-semibold text-foreground">{{ normalizeFullName(member.fullName) }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tug'ilgan sanasi</p>
                        <p class="mt-1 text-sm text-foreground">{{ member.birthDate }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">JSHSHIR</p>
                        <p class="mt-1 text-sm text-foreground">{{ member.pinfl }}</p>
                      </div>
                      <label class="space-y-2 md:col-span-2">
                        <span class="text-sm font-medium text-foreground">Asosiy lavozimi</span>
                        <Input
                          v-model="member.position"
                          placeholder="Lavozimini kiriting"
                        />
                      </label>
                      <label class="space-y-2 md:col-span-2">
                        <span class="text-sm font-medium text-foreground">Telefon raqami</span>
                        <div class="flex h-9 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                          <span class="flex h-full items-center border-r border-border px-3 text-sm font-medium text-foreground">
                            +998
                          </span>
                          <Input
                            :model-value="member.phone"
                            inputmode="numeric"
                            maxlength="9"
                            autocomplete="off"
                            placeholder="90 123 45 67"
                            class="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
                            @keydown="preventInvalidPhoneKey"
                            @paste="preventInvalidPhonePaste"
                            @update:model-value="member.phone = sanitizePhoneDigits(String($event ?? ''))"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p
                v-if="formError"
                class="text-sm text-rose-600"
              >
                {{ formError }}
              </p>
              <p
                v-else
                class="text-sm text-muted-foreground"
              >
                Viloyat, rais, rais o'rinbosari, kotib va kamida bitta a'zo aniqlangandan keyin saqlash ochiladi.
              </p>

              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  @click="resetForm"
                >
                  Tozalash
                </Button>
                <Button
                  :disabled="!canSave"
                  @click="saveCommission"
                >
                  Saqlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="isAssessmentPage">
      <div
        v-if="feedback"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg',
          feedback.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 dark:border-sky-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              feedback.type === 'success' && 'bg-emerald-500',
              feedback.type === 'error' && 'bg-rose-500',
              feedback.type === 'info' && 'bg-sky-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            feedback.type === 'success' && 'bg-emerald-600',
            feedback.type === 'error' && 'bg-rose-600',
            feedback.type === 'info' && 'bg-sky-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ feedback.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ feedback.message }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible rounded-2xl border border-border bg-card p-5">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="assessmentSearchInput"
              class="pl-9"
              placeholder="Qidirish"
              @update:model-value="handleAssessmentSearchInput(String($event ?? ''))"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="relative order-1">
              <div
                v-if="isAssessmentFilterOpen"
                class="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm xl:hidden"
                @click="closeAssessmentFilters"
              />

              <Button
                variant="outline"
                :class="isAssessmentFilterOpen ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
                @click="toggleAssessmentFiltersFromMenu(!isAssessmentFilterOpen)"
              >
                <LoaderCircle
                  v-if="actionLoadingKey && actionLoadingKey.startsWith('assessment-filter')"
                  class="h-4 w-4 animate-spin"
                />
                <span
                  v-else-if="assessmentActiveFilterCount > 0"
                  class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
                >
                  {{ assessmentActiveFilterCount }}
                </span>
                <Filter
                  v-else
                  class="h-4 w-4"
                />
                Filter
              </Button>

              <div
                v-if="isAssessmentFilterOpen"
                class="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none max-xl:max-h-[calc(100vh-7rem)] xl:absolute xl:right-0 xl:top-[calc(100%+0.4rem)] xl:w-[17.5rem] xl:origin-top-right"
              >
                <div class="flex flex-col gap-3 overflow-y-auto p-4 xl:gap-3 xl:p-3.5 xl:max-h-[min(28rem,calc(100vh-10rem))]">
                  <div class="flex items-center justify-between gap-2">
                    <p class="text-sm font-semibold text-foreground">Filterlar</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-8 w-8 p-0"
                      @click="closeAssessmentFilters"
                    >
                      <X class="h-4 w-4" />
                    </Button>
                  </div>

                  <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                    <span class="font-medium text-foreground">Status</span>
                    <div class="space-y-2 xl:mt-2 xl:space-y-0">
                      <button
                        type="button"
                        :class="[
                          'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                          openAssessmentFilterField === 'status'
                            ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                            : 'border-input hover:border-ring',
                        ]"
                        @click="toggleAssessmentFilterField('status')"
                      >
                        <span>{{ draftAssessmentStatusLabel }}</span>
                        <ChevronDown :class="['h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out', openAssessmentFilterField === 'status' ? 'rotate-180' : '']" />
                      </button>
                      <div
                        v-if="openAssessmentFilterField === 'status'"
                        class="overflow-hidden rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                          @click.stop.prevent="selectAssessmentStatusFilter('all')"
                        >
                          <span>Barchasi</span>
                          <Check v-if="draftAssessmentStatusFilter === 'all'" class="h-4 w-4 text-primary" />
                        </button>
                        <button
                          v-for="status in assessmentStatusOptions"
                          :key="status"
                          type="button"
                          class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                          @click.stop.prevent="selectAssessmentStatusFilter(status)"
                        >
                          <span>{{ status }}</span>
                          <Check v-if="draftAssessmentStatusFilter === status" class="h-4 w-4 text-primary" />
                        </button>
                      </div>
                    </div>
                  </label>

                  <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                    <span class="font-medium text-foreground">Hudud</span>
                    <div class="space-y-2 xl:mt-2 xl:space-y-0">
                      <button
                        type="button"
                        :class="[
                          'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                          openAssessmentFilterField === 'region'
                            ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                            : 'border-input hover:border-ring',
                        ]"
                        @click="toggleAssessmentFilterField('region')"
                      >
                        <span class="truncate">{{ draftAssessmentRegionLabel }}</span>
                        <ChevronDown :class="['h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out', openAssessmentFilterField === 'region' ? 'rotate-180' : '']" />
                      </button>
                      <div
                        v-if="openAssessmentFilterField === 'region'"
                        class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                          @click.stop.prevent="selectAssessmentRegionFilter('all')"
                        >
                          <span>Barchasi</span>
                          <Check v-if="draftAssessmentRegionFilter === 'all'" class="h-4 w-4 text-primary" />
                        </button>
                        <button
                          v-for="region in regionOptions"
                          :key="region"
                          type="button"
                          class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                          @click.stop.prevent="selectAssessmentRegionFilter(region)"
                        >
                          <span class="truncate">{{ region }}</span>
                          <Check v-if="draftAssessmentRegionFilter === region" class="h-4 w-4 shrink-0 text-primary" />
                        </button>
                      </div>
                    </div>
                  </label>

                  <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                    <span class="font-medium text-foreground">Boshlanish sanasi</span>
                    <div class="relative space-y-2 xl:mt-2 xl:space-y-0">
                      <div class="relative">
                        <Input :model-value="draftAssessmentStartDateFilter" class="h-10 pr-10" inputmode="numeric" maxlength="10" placeholder="dd.mm.yyyy" @keydown="preventDateNonDigitKeydown" @update:model-value="handleAssessmentStartDateFilterChange" />
                        <button type="button" class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground" @click="openAssessmentCalendar('start')">
                          <CalendarDays class="h-4 w-4" />
                        </button>
                      </div>
                      <div v-if="openAssessmentCalendarField === 'start'" class="rounded-lg border border-border bg-background p-3 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-30">
                        <div class="mb-3 flex items-center justify-between gap-2">
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarYear(-1)"><ChevronsLeft class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarMonth(-1)"><ChevronLeft class="h-4 w-4" /></Button>
                          </div>
                          <p class="text-sm font-medium text-foreground">{{ assessmentCalendarMonthLabel }}</p>
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarMonth(1)"><ChevronRight class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarYear(1)"><ChevronsRight class="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                          <span v-for="weekday in calendarWeekdays" :key="weekday" class="py-1">{{ weekday }}</span>
                        </div>
                        <div class="grid grid-cols-7 gap-1">
                          <button v-for="day in assessmentCalendarDays" :key="day.key" type="button" class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out" :class="day.isCurrentMonth ? isAssessmentCalendarDateSelected(day.value) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted' : 'pointer-events-none opacity-0'" :disabled="!day.isCurrentMonth" @click="selectAssessmentCalendarDate('start', day.value)">{{ day.label }}</button>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                    <span class="font-medium text-foreground">Tugash sanasi</span>
                    <div class="relative space-y-2 xl:mt-2 xl:space-y-0">
                      <div class="relative">
                        <Input :model-value="draftAssessmentEndDateFilter" class="h-10 pr-10" inputmode="numeric" maxlength="10" placeholder="dd.mm.yyyy" @keydown="preventDateNonDigitKeydown" @update:model-value="handleAssessmentEndDateFilterChange" />
                        <button type="button" class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground" @click="openAssessmentCalendar('end')">
                          <CalendarDays class="h-4 w-4" />
                        </button>
                      </div>
                      <div v-if="openAssessmentCalendarField === 'end'" class="rounded-lg border border-border bg-background p-3 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-30">
                        <div class="mb-3 flex items-center justify-between gap-2">
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarYear(-1)"><ChevronsLeft class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarMonth(-1)"><ChevronLeft class="h-4 w-4" /></Button>
                          </div>
                          <p class="text-sm font-medium text-foreground">{{ assessmentCalendarMonthLabel }}</p>
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarMonth(1)"><ChevronRight class="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="shiftAssessmentCalendarYear(1)"><ChevronsRight class="h-4 w-4" /></Button>
                          </div>
                        </div>
                        <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                          <span v-for="weekday in calendarWeekdays" :key="weekday" class="py-1">{{ weekday }}</span>
                        </div>
                        <div class="grid grid-cols-7 gap-1">
                          <button v-for="day in assessmentCalendarDays" :key="day.key" type="button" class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out" :class="day.isCurrentMonth ? isAssessmentCalendarDateSelected(day.value) ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted' : 'pointer-events-none opacity-0'" :disabled="!day.isCurrentMonth" @click="selectAssessmentCalendarDate('end', day.value)">{{ day.label }}</button>
                        </div>
                      </div>
                    </div>
                  </label>

                  <div class="flex items-center justify-end gap-3 border-t border-border pt-3">
                    <Button variant="outline" size="sm" class="gap-2" :disabled="isTableLoading || (!assessmentHasActiveFilters && !assessmentHasPendingFilterChanges)" @click="clearAssessmentFilters">
                      <LoaderCircle v-if="actionLoadingKey === 'assessment-filter-clear'" class="h-4 w-4 animate-spin" />
                      Tozalash
                    </Button>
                    <Button size="sm" class="gap-2" :disabled="isTableLoading || !assessmentHasPendingFilterChanges" @click="applyAssessmentFilters">
                      <LoaderCircle v-if="actionLoadingKey === 'assessment-filter-apply'" class="h-4 w-4 animate-spin" />
                      Qo'llash
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              class="order-2 h-10 gap-2"
              :disabled="actionLoadingKey === 'assessment-download'"
              @click="downloadAssessments"
            >
              <LoaderCircle
                v-if="actionLoadingKey === 'assessment-download'"
                class="h-4 w-4 animate-spin"
              />
              <Download
                v-else
                class="h-4 w-4"
              />
              Yuklab olish
            </Button>
          </div>
        </div>

        <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
          <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
            <div class="relative flex-1 xl:hidden">
              <div
                v-if="isTableLoading"
                class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              >
                <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                  <span>Yuklanmoqda...</span>
                </div>
              </div>

              <div
                v-if="paginatedAssessments.length === 0"
                class="flex min-h-[18rem] items-center justify-center px-4 py-10 text-center"
              >
                <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                  <p class="text-sm font-medium text-foreground">Ma'lumot topilmadi</p>
                  <p class="text-sm text-muted-foreground">Qidiruv yoki filter shartlariga mos yozuv topilmadi.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    class="mt-2"
                    :disabled="isTableLoading || (!assessmentSearchQuery && !assessmentHasActiveFilters)"
                    @click="resetAssessmentSearchAndFilters"
                  >
                    Tozalash
                  </Button>
                </div>
              </div>

              <div
                v-else
                class="grid grid-cols-1 gap-3 p-4 md:grid-cols-2"
              >
                <Card
                  v-for="record in paginatedAssessments"
                  :key="record.id"
                  class="border-border"
                >
                  <CardContent class="space-y-4 p-4">
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hujjat</p>
                        <p class="mt-1 font-semibold text-foreground">{{ record.documentNumber }}</p>
                        <p class="mt-1 text-sm text-muted-foreground">{{ formatDateDisplay(record.createdAt) }}</p>
                      </div>
                      <div class="flex items-center gap-2">
                        <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[record.status])">
                          {{ record.status }}
                        </span>
                        <DropdownMenuRoot @update:open="setActionMenuOpen(`assessment-${record.id}`, $event)">
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="openActionMenuId === `assessment-${record.id}` ? 'h-9 w-9 shrink-0 rounded-full border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-9 w-9 shrink-0 rounded-full p-0'"
                            >
                              <LoaderCircle v-if="isActionButtonLoading(`assessment-view-${record.id}`, `assessment-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                              <Ellipsis v-else class="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuContent
                              side="bottom"
                              align="end"
                              :side-offset="6"
                              :collision-padding="12"
                              class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                            >
                              <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="viewAssessment(record)">
                                <Eye class="h-4 w-4 shrink-0" />
                                <span>Ko'rish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="editAssessment(record)">
                                <Pencil class="h-4 w-4 shrink-0" />
                                <span>Tahrirlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="requestSendAssessment(record)">
                                <Check class="h-4 w-4 shrink-0" />
                                <span>Yuborish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem v-if="record.status === 'Yuborilgan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted" @click="requestCancelAssessment(record)">
                                <X class="h-4 w-4 shrink-0" />
                                <span>Bekor qilish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem v-if="record.status === 'Yuborilgan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="requestApproveAssessment(record)">
                                <CheckCheck class="h-4 w-4 shrink-0" />
                                <span>Tasdiqlash</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenuRoot>
                      </div>
                    </div>

                    <div class="grid gap-3">
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Xizmat oluvchi</p>
                        <p class="mt-1 font-semibold uppercase text-foreground">{{ normalizeFullName(record.serviceRecipient) }}</p>
                        <p class="mt-1 text-sm text-muted-foreground">{{ record.serviceRecipientPinfl }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Xizmat turi</p>
                        <p class="mt-1 text-sm text-foreground">{{ record.serviceType }}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Natija</p>
                        <span
                          v-if="getAssessmentResultDisplay(record) !== '-'"
                          :class="cn('mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', getAssessmentResultBadgeClass(record))"
                        >
                          {{ getAssessmentResultDisplay(record) }}
                        </span>
                        <p v-else class="mt-1 text-sm text-muted-foreground">-</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Manzil</p>
                        <p class="mt-1 font-medium text-foreground">{{ record.region }}</p>
                        <p class="mt-1 text-sm text-muted-foreground">{{ record.district }}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div class="relative hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
              <div
                v-if="isTableLoading"
                class="absolute inset-0 z-20 flex items-center justify-center bg-background/70"
              >
                <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                  <span>Yuklanmoqda...</span>
                </div>
              </div>

              <table class="min-w-[1240px] border-separate border-spacing-0 text-sm xl:min-w-full">
                <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                  <tr>
                    <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Hujjat</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Xizmat oluvchi</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Xizmat turi</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Natija</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Manzil</th>
                    <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedAssessments.length === 0">
                    <td colspan="7" class="border-b border-border px-4 py-12 text-center">
                      <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                        <p class="text-sm font-medium text-foreground">Ma'lumot topilmadi</p>
                        <p class="text-sm text-muted-foreground">Qidiruv yoki filter shartlariga mos yozuv topilmadi.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          :disabled="isTableLoading || (!assessmentSearchQuery && !assessmentHasActiveFilters)"
                          @click="resetAssessmentSearchAndFilters"
                        >
                          Tozalash
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="record in paginatedAssessments"
                    :key="record.id"
                    class="transition-colors duration-200 ease-out hover:bg-muted/30"
                  >
                    <td class="border-b border-border px-4 py-3 align-top">
                      <DropdownMenuRoot @update:open="setActionMenuOpen(`assessment-${record.id}`, $event)">
                        <DropdownMenuTrigger as-child>
                          <Button
                            variant="outline"
                            size="sm"
                            :class="openActionMenuId === `assessment-${record.id}` ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                          >
                            <LoaderCircle v-if="isActionButtonLoading(`assessment-view-${record.id}`, `assessment-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                            <Ellipsis v-else class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuContent
                            side="right"
                            align="start"
                            :side-offset="6"
                            :collision-padding="12"
                            class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                          >
                            <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="viewAssessment(record)">
                              <Eye class="h-4 w-4 shrink-0" />
                              <span>Ko'rish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="editAssessment(record)">
                              <Pencil class="h-4 w-4 shrink-0" />
                              <span>Tahrirlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="record.status === 'Jarayonda' || record.status === 'Bekor qilingan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="requestSendAssessment(record)">
                              <Check class="h-4 w-4 shrink-0" />
                              <span>Yuborish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="record.status === 'Yuborilgan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted" @click="requestCancelAssessment(record)">
                              <X class="h-4 w-4 shrink-0" />
                              <span>Bekor qilish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="record.status === 'Yuborilgan'" class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="requestApproveAssessment(record)">
                              <CheckCheck class="h-4 w-4 shrink-0" />
                              <span>Tasdiqlash</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuPortal>
                      </DropdownMenuRoot>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium text-foreground">{{ record.documentNumber }}</p>
                      <p class="mt-1 text-muted-foreground">{{ formatDateDisplay(record.createdAt) }}</p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-medium uppercase text-foreground">{{ normalizeFullName(record.serviceRecipient) }}</p>
                      <p class="mt-1 text-muted-foreground">{{ record.serviceRecipientPinfl }}</p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-foreground">
                      {{ record.serviceType }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <span
                        v-if="getAssessmentResultDisplay(record) !== '-'"
                        :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', getAssessmentResultBadgeClass(record))"
                      >
                        {{ getAssessmentResultDisplay(record) }}
                      </span>
                      <span v-else class="text-muted-foreground">-</span>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-foreground">
                      <p class="font-medium text-foreground">{{ record.region }}</p>
                      <p class="mt-1 text-muted-foreground">{{ record.district }}</p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[record.status])">
                        {{ record.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

        <div class="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Qatorlar soni</span>
              <DropdownMenuRoot @update:open="setAssessmentRowsPerPageOpen($event)">
                <DropdownMenuTrigger as-child>
                  <Button
                    variant="outline"
                    size="sm"
                    :class="isAssessmentRowsPerPageOpen ? 'h-8 gap-1.5 rounded-md border-ring bg-accent/40 px-2.5 text-sm ring-2 ring-ring/20' : 'h-8 gap-1.5 rounded-md px-2.5 text-sm'"
                  >
                    <span>{{ assessmentRowsPerPage }}</span>
                    <ChevronRight class="h-4 w-4 rotate-90" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent
                    align="start"
                    :side-offset="6"
                    class="z-50 w-[var(--reka-dropdown-menu-trigger-width)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                  >
                    <DropdownMenuItem
                      v-for="option in rowsPerPageOptions"
                      :key="option"
                      class="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted"
                      @select.prevent="setAssessmentRowsPerPage(option)"
                    >
                      <span :class="option === assessmentRowsPerPage ? 'font-semibold text-foreground' : 'text-foreground'">
                        {{ option }}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenuRoot>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <span class="text-muted-foreground">Sahifada:</span>
              <span class="font-medium text-foreground">{{ assessmentPaginationRange.start }}-{{ assessmentPaginationRange.end }} / {{ assessmentTotalRows }}</span>
            </div>
          </div>

          <div class="inline-flex h-9 w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-0.5 min-[480px]:w-auto min-[480px]:justify-start">
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || assessmentCurrentPage === 1"
              @click="goToAssessmentPage(1)"
            >
              <ChevronsLeft class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || assessmentCurrentPage === 1"
              @click="goToAssessmentPage(assessmentCurrentPage - 1)"
            >
              <ChevronLeft class="h-5 w-5" />
            </Button>
            <span class="min-w-14 text-center text-sm font-semibold text-foreground">
              {{ assessmentCurrentPageSummary }}
            </span>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || assessmentCurrentPage === assessmentTotalPages"
              @click="goToAssessmentPage(assessmentCurrentPage + 1)"
            >
              <ChevronRight class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="isTableLoading || assessmentCurrentPage === assessmentTotalPages"
              @click="goToAssessmentPage(assessmentTotalPages)"
            >
              <ChevronsRight class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="selectedAssessmentViewRecord"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 dark:bg-black/60"
    @click.self="closeAssessmentViewDialog"
  >
    <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
      <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p class="text-lg font-semibold text-foreground">Barthel va Lawton baholashi</p>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ selectedAssessmentViewRecord.documentNumber }} bo'yicha parvarishga muhtojlik va kundalik mustaqillik baholanadi.
          </p>
        </div>
        <Button variant="ghost" size="sm" class="h-9 w-9 p-0" aria-label="Oynani yopish" @click="closeAssessmentViewDialog">
          <X class="h-4 w-4" />
        </Button>
      </div>

      <div class="flex-1 space-y-6 overflow-y-auto p-5">
        <div class="rounded-2xl border border-border bg-card p-4">
          <p class="text-base font-semibold text-foreground">Xizmat oluvchi</p>
          <div class="mt-4 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
            <div class="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-border bg-background px-5 py-6 text-center">
              <div class="flex h-32 w-24 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 text-sm font-semibold text-muted-foreground">
                Rasm yo'q
              </div>
              <span class="mt-3 text-sm text-muted-foreground">Rasm</span>
            </div>
            <div class="overflow-hidden rounded-2xl border border-border bg-background">
              <div
                v-for="[label, value] in selectedAssessmentServiceRecipientRows"
                :key="`assessment-service-recipient-${label}`"
                class="grid border-b border-border last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div class="bg-muted/35 px-4 py-3 text-sm font-medium text-muted-foreground">{{ label }}</div>
                <div class="px-4 py-3 text-sm text-foreground">{{ value }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-foreground">Elementar harakatlarni baholash</p>
              <p class="mt-1 text-sm text-muted-foreground">Barthel shkalasi bo'yicha 10 ta savol. Har bir savolda bitta variant tanlanadi.</p>
            </div>
            <div class="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
              {{ formatAssessmentScore(assessmentBarthelTotal) }} ball
            </div>
          </div>
          <div class="mt-4 space-y-4">
            <div v-for="question in barthelQuestions" :key="question.id" class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm font-semibold text-foreground">{{ question.order }}. {{ question.title }}</p>
              <p class="mt-1 text-xs text-muted-foreground">Tanlangan ball: {{ formatAssessmentScore(getAssessmentSelectedOption(question)?.score ?? 0) }}</p>
              <div class="mt-3 grid gap-2">
                <button
                  v-for="option in question.options"
                  :key="option.id"
                  type="button"
                  :disabled="selectedAssessmentReadonly"
                  :class="[
                    'rounded-xl border px-3 py-3 text-left transition-colors disabled:cursor-default',
                    getAssessmentSelectedOption(question)?.id === option.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/40 disabled:hover:bg-card',
                  ]"
                  @click="setAssessmentAnswer(question.id, option.id)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-medium text-foreground">{{ option.label }}</p>
                    <span class="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground">{{ formatAssessmentScore(option.score) }} ball</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-base font-semibold text-foreground">Murakkab harakatlarni baholash</p>
              <p class="mt-1 text-sm text-muted-foreground">Lawton shkalasi bo'yicha 9 ta savol. Har bir savolda bitta variant tanlanadi.</p>
            </div>
            <div class="rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground">
              {{ formatAssessmentScore(assessmentLawtonTotal) }} ball
            </div>
          </div>
          <div class="mt-4 space-y-4">
            <div v-for="question in lawtonQuestions" :key="question.id" class="rounded-2xl border border-border bg-background p-4">
              <p class="text-sm font-semibold text-foreground">{{ question.order }}. {{ question.title }}</p>
              <p class="mt-1 text-xs text-muted-foreground">Tanlangan ball: {{ formatAssessmentScore(getAssessmentSelectedOption(question)?.score ?? 0) }}</p>
              <div class="mt-3 grid gap-2">
                <button
                  v-for="option in question.options"
                  :key="option.id"
                  type="button"
                  :disabled="selectedAssessmentReadonly"
                  :class="[
                    'rounded-xl border px-3 py-3 text-left transition-colors disabled:cursor-default',
                    getAssessmentSelectedOption(question)?.id === option.id ? 'border-primary bg-primary/10' : 'border-border bg-card hover:bg-muted/40 disabled:hover:bg-card',
                  ]"
                  @click="setAssessmentAnswer(question.id, option.id)"
                >
                  <div class="flex items-start justify-between gap-3">
                    <p class="text-sm font-medium text-foreground">{{ option.label }}</p>
                    <span class="shrink-0 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground">{{ formatAssessmentScore(option.score) }} ball</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-border bg-card p-4">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-stretch">
            <div
              :class="[
                'flex min-w-0 flex-1 flex-col justify-between rounded-xl border p-4',
                assessmentGroupLabel === 'Tezkor'
                  ? 'border-destructive/25 bg-destructive/5'
                  : assessmentGroupLabel === 'Rejali'
                    ? 'border-emerald-500/25 bg-emerald-500/5'
                    : 'border-border bg-muted/20',
              ]"
            >
              <div>
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Baholash natijasi</p>
                <p v-if="isAssessmentComplete" :class="['mt-3 inline-flex rounded-full border px-4 py-2 text-lg font-semibold', assessmentGroupBadgeClass]">
                  {{ assessmentGroupLabel }}
                </p>
                <p v-else class="mt-3 text-sm text-muted-foreground">
                  So'rovnoma to'liq to'ldirilgandan keyin ko'rsatiladi.
                </p>
              </div>
              <div class="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span class="rounded-full border border-border bg-background px-3 py-1">Umumiy ball: {{ formatAssessmentScore(assessmentGrandTotal) }}</span>
                <span class="rounded-full border border-border bg-background px-3 py-1">{{ isAssessmentComplete ? "So'rovnoma to'ldirilgan" : "So'rovnoma davom etmoqda" }}</span>
              </div>
            </div>
            <div class="grid flex-[1.4] gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">Barthel</p>
                <p class="mt-1 text-base font-semibold text-foreground">{{ formatAssessmentScore(assessmentBarthelTotal) }} ball</p>
              </div>
              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">Lawton</p>
                <p class="mt-1 text-base font-semibold text-foreground">{{ formatAssessmentScore(assessmentLawtonTotal) }} ball</p>
              </div>
              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">Yaqin qarindoshlari</p>
                <p class="mt-1 text-base font-semibold text-foreground">{{ getAssessmentCloseRelativesLabel(selectedAssessmentViewRecord) }}</p>
              </div>
              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium text-muted-foreground">Uy-joyi</p>
                <p class="mt-1 text-base font-semibold text-foreground">{{ getAssessmentHousingLabel(selectedAssessmentViewRecord) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <p class="text-sm text-muted-foreground">
          {{ isAssessmentComplete ? "Barcha savollar to'ldirildi." : `${Object.keys(assessmentAnswers).length}/${allAssessmentQuestions.length} savol to'ldirildi.` }}
        </p>
        <div class="flex items-center gap-2">
          <Button variant="outline" @click="closeAssessmentViewDialog">
            {{ selectedAssessmentReadonly ? 'Yopish' : 'Bekor qilish' }}
          </Button>
          <Button v-if="!selectedAssessmentReadonly" :disabled="!isAssessmentComplete" @click="saveAssessmentFromDialog">
            Baholashni saqlash
          </Button>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="false && selectedAssessmentViewRecord"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 dark:bg-black/60"
    @click.self="closeAssessmentViewDialog"
  >
    <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
      <div class="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <h2 class="text-lg font-semibold">
            {{ selectedAssessmentViewMode === 'edit' ? 'Baholash hujjatini tahrirlash' : 'Baholash hujjatini ko‘rish' }}
          </h2>
          <p class="mt-1 text-sm text-muted-foreground">
            {{ selectedAssessmentViewRecord?.documentNumber }} raqamli baholash hujjati.
          </p>
        </div>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="closeAssessmentViewDialog">
          <X class="h-4 w-4" />
        </Button>
      </div>
      <div class="space-y-4 px-6 py-5">
        <div class="overflow-hidden rounded-xl border border-border">
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Hujjat</div>
            <div class="px-4 py-3 font-medium text-foreground">{{ selectedAssessmentViewRecord?.documentNumber }}</div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Sana</div>
            <div class="px-4 py-3 text-foreground">{{ formatDateDisplay(selectedAssessmentViewRecord?.createdAt ?? '') }}</div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Xizmat oluvchi</div>
            <div class="px-4 py-3">
              <p class="font-medium uppercase text-foreground">{{ normalizeFullName(selectedAssessmentViewRecord?.serviceRecipient ?? '') }}</p>
              <p class="mt-1 text-muted-foreground">{{ selectedAssessmentViewRecord?.serviceRecipientPinfl }}</p>
            </div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Xizmat turi</div>
            <div class="px-4 py-3 text-foreground">{{ selectedAssessmentViewRecord?.serviceType }}</div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Natija</div>
            <div class="px-4 py-3">
              <span
                v-if="selectedAssessmentViewRecord && getAssessmentResultDisplay(selectedAssessmentViewRecord) !== '-'"
                :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', getAssessmentResultBadgeClass(selectedAssessmentViewRecord))"
              >
                {{ getAssessmentResultDisplay(selectedAssessmentViewRecord) }}
              </span>
              <span v-else class="text-muted-foreground">-</span>
            </div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] border-b border-border text-sm last:border-b-0">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Manzil</div>
            <div class="px-4 py-3 text-foreground">{{ selectedAssessmentViewRecord?.region }}, {{ selectedAssessmentViewRecord?.district }}</div>
          </div>
          <div class="grid grid-cols-[12rem_1fr] text-sm">
            <div class="bg-muted/30 px-4 py-3 font-medium text-muted-foreground">Status</div>
            <div class="px-4 py-3">
              <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[selectedAssessmentViewRecord?.status ?? 'Jarayonda'])">
                {{ selectedAssessmentViewRecord?.status }}
              </span>
            </div>
          </div>
        </div>
        <p v-if="selectedAssessmentViewMode === 'edit'" class="text-sm text-muted-foreground">
          Demo rejimida tahrirlash oynasi hujjat ma'lumotlarini ko‘rsatadi. Keyingi bosqichda maydonlarni shu yerga qo‘shamiz.
        </p>
      </div>
    </div>
  </div>

      <ConfirmDialog
        :open="Boolean(pendingConfirmation)"
        :tone="pendingConfirmation?.tone"
        :title="pendingConfirmation?.title ?? ''"
        :description="pendingConfirmation?.description ?? ''"
        :confirm-label="pendingConfirmation?.confirmLabel ?? ''"
        :loading="isConfirmationLoading"
        @cancel="closeConfirmation"
        @confirm="confirmPendingAction"
      />
    </template>

    <template v-else-if="isServiceTypesPage">
      <div
        v-if="feedback"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg',
          feedback.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 dark:border-sky-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              feedback.type === 'success' && 'bg-emerald-500',
              feedback.type === 'error' && 'bg-rose-500',
              feedback.type === 'info' && 'bg-sky-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            feedback.type === 'success' && 'bg-emerald-600',
            feedback.type === 'error' && 'bg-rose-600',
            feedback.type === 'info' && 'bg-sky-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ feedback.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ feedback.message }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible rounded-2xl border border-border bg-card p-5">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="serviceTypeSearchInput"
              class="pl-9"
              placeholder="Qidirish"
              @update:model-value="handleServiceTypeSearchInput(String($event ?? ''))"
            />
          </div>

          <div class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Button
              class="order-2 h-10 w-full gap-2 sm:w-auto"
              @click="openCreateServiceTypeDialog"
            >
              <Plus class="h-4 w-4" />
              Yaratish
            </Button>
            <Button
              variant="outline"
              class="order-1 h-10 w-full gap-2 sm:w-auto"
              @click="downloadServiceTypes"
            >
              <Download class="h-4 w-4" />
              Yuklab olish
            </Button>
          </div>
        </div>

        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border">
          <div class="relative hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
            <div
              v-if="isTableLoading"
              class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                <span>Yuklanmoqda...</span>
              </div>
            </div>
            <table class="min-w-[980px] border-separate border-spacing-0 text-sm xl:min-w-full">
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Sana</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Qisqa nomi</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">To'liq nomi</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Minimal yosh</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Maksimal yosh</th>
                  <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedServiceTypes.length === 0">
                  <td
                    colspan="8"
                    class="border-b border-border px-4 py-12 text-center"
                  >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                      <p class="text-sm font-medium text-foreground">Ma'lumot topilmadi</p>
                      <p class="text-sm text-muted-foreground">Qidiruv shartlariga mos yozuv topilmadi.</p>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="record in paginatedServiceTypes"
                  :key="record.id"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td class="border-b border-border px-4 py-3 align-top">
                    <DropdownMenuRoot @update:open="setServiceTypeActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openServiceTypeActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <LoaderCircle v-if="isActionButtonLoading(`service-type-view-${record.id}`, `service-type-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                          <Ellipsis v-else class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @click="viewServiceType(record)"
                          >
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @click="editServiceType(record)"
                          >
                            <Pencil class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                            @click="requestDeleteServiceType(record)"
                          >
                            <Trash2 class="h-4 w-4 shrink-0" />
                            <span>O'chirish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ record.id }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">
                    {{ formatDateDisplay(record.date) }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ record.shortName.uzLatn }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="max-w-xl font-medium text-foreground">{{ record.fullName.uzLatn }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">
                    {{ record.minAge }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">
                    {{ record.maxAge ?? '-' }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[record.status]]">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="relative grid gap-3 p-3 xl:hidden">
            <div
              v-if="isTableLoading"
              class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                <span>Yuklanmoqda...</span>
              </div>
            </div>
            <Card
              v-for="record in paginatedServiceTypes"
              :key="record.id"
              class="border-border"
            >
              <CardContent class="space-y-4 pt-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</p>
                    <p class="mt-1 font-medium text-foreground">{{ record.id }}</p>
                    <p class="mt-1 text-sm text-muted-foreground">{{ formatDateDisplay(record.date) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[record.status]]">
                      {{ record.status }}
                    </span>
                    <DropdownMenuRoot @update:open="setServiceTypeActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openServiceTypeActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <LoaderCircle v-if="isActionButtonLoading(`service-type-view-${record.id}`, `service-type-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                          <Ellipsis v-else class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="viewServiceType(record)">
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="editServiceType(record)">
                            <Pencil class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted" @click="requestDeleteServiceType(record)">
                            <Trash2 class="h-4 w-4 shrink-0" />
                            <span>O'chirish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Qisqa nomi</p>
                  <p class="mt-1 font-medium text-foreground">{{ record.shortName.uzLatn }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">To'liq nomi</p>
                  <p class="mt-1 text-sm font-medium text-foreground">{{ record.fullName.uzLatn }}</p>
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Minimal yosh</p>
                    <p class="mt-1 text-sm font-medium text-foreground">{{ record.minAge }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Maksimal yosh</p>
                    <p class="mt-1 text-sm font-medium text-foreground">{{ record.maxAge ?? '-' }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="flex flex-col gap-3 border-t border-border bg-card p-4 text-sm md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Qatorlar soni</span>
                <DropdownMenuRoot @update:open="setServiceTypeRowsPerPageOpen">
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="outline"
                      size="sm"
                      :class="isServiceTypeRowsPerPageOpen ? 'h-9 min-w-16 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-9 min-w-16'"
                    >
                      {{ serviceTypeRowsPerPage }}
                      <ChevronDown class="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuContent
                      side="top"
                      align="start"
                      :side-offset="6"
                      class="z-50 min-w-24 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                    >
                      <DropdownMenuItem
                        v-for="option in rowsPerPageOptions"
                        :key="option"
                        class="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted"
                        @click="setServiceTypeRowsPerPage(option)"
                      >
                        {{ option }}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>
              </div>
              <span class="text-muted-foreground">
                Sahifada:
                <strong class="font-semibold text-foreground">
                  {{ serviceTypePaginationRange.start }}-{{ serviceTypePaginationRange.end }} / {{ serviceTypeTotalRows }}
                </strong>
              </span>
            </div>

            <div class="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                class="h-9 w-9 p-0"
                :disabled="serviceTypeCurrentPage === 1"
                @click="goToServiceTypePage(1)"
              >
                <ChevronsLeft class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-9 w-9 p-0"
                :disabled="serviceTypeCurrentPage === 1"
                @click="goToServiceTypePage(serviceTypeCurrentPage - 1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="min-w-16 text-center font-semibold text-foreground">{{ serviceTypeCurrentPageSummary }}</span>
              <Button
                variant="outline"
                size="sm"
                class="h-9 w-9 p-0"
                :disabled="serviceTypeCurrentPage === serviceTypeTotalPages"
                @click="goToServiceTypePage(serviceTypeCurrentPage + 1)"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="h-9 w-9 p-0"
                :disabled="serviceTypeCurrentPage === serviceTypeTotalPages"
                @click="goToServiceTypePage(serviceTypeTotalPages)"
              >
                <ChevronsRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isServiceTypeDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeServiceTypeDialog"
      >
        <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-popover px-6 py-5">
            <div>
              <h2 class="text-lg font-semibold text-foreground">
                {{ editingServiceTypeId ? 'Xizmat turini tahrirlash' : 'Xizmat turi yaratish' }}
              </h2>
              <p class="mt-1 text-sm text-muted-foreground">
                Asosiy nomlar va minimal yosh majburiy, tarjimalar ixtiyoriy.
              </p>
            </div>
            <button
              type="button"
              class="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              @click="closeServiceTypeDialog"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-6 px-6 py-5">
            <section class="space-y-4 rounded-2xl border border-border bg-card p-4">
              <div class="grid gap-4 md:grid-cols-2">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Qisqa nomi</span>
                  <Input
                    v-model="serviceTypeForm.shortName.uzLatn"
                    placeholder="Qisqa nomini kiriting"
                  />
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">To'liq nomi</span>
                  <Input
                    v-model="serviceTypeForm.fullName.uzLatn"
                    placeholder="To'liq nomini kiriting"
                  />
                </label>
              </div>

              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                @click="toggleServiceTypeTranslations"
              >
                <span>Tarjimalar (ixtiyoriy)</span>
                <ChevronDown :class="['h-4 w-4 text-muted-foreground transition-transform', isServiceTypeTranslationsOpen && 'rotate-180']" />
              </button>

              <div v-if="isServiceTypeTranslationsOpen" class="grid gap-4 md:grid-cols-2">
                <div class="space-y-3 rounded-xl border border-border bg-background p-3">
                  <h4 class="text-sm font-semibold text-foreground">Qisqa nomi tarjimalari</h4>
                  <label v-for="field in optionalLocalizedLanguageFields" :key="field.key" class="space-y-2">
                    <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ field.label }}</span>
                    <Input v-model="serviceTypeForm.shortName[field.key]" placeholder="Ixtiyoriy" />
                  </label>
                </div>
                <div class="space-y-3 rounded-xl border border-border bg-background p-3">
                  <h4 class="text-sm font-semibold text-foreground">To'liq nomi tarjimalari</h4>
                  <label v-for="field in optionalLocalizedLanguageFields" :key="field.key" class="space-y-2">
                    <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ field.label }}</span>
                    <Input v-model="serviceTypeForm.fullName[field.key]" placeholder="Ixtiyoriy" />
                  </label>
                </div>
              </div>
            </section>

            <section class="grid gap-4 md:grid-cols-2">
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">Minimal yosh</span>
                <Input
                  v-model="serviceTypeForm.minAge"
                  inputmode="numeric"
                  placeholder="Masalan: 18"
                />
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">Maksimal yosh</span>
                <Input
                  v-model="serviceTypeForm.maxAge"
                  inputmode="numeric"
                  placeholder="Ixtiyoriy"
                />
              </label>
            </section>

            <section class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <span class="text-sm font-medium text-foreground">Mos tashxislar</span>
                <div class="relative">
                  <button
                    type="button"
                    :class="[
                      'flex min-h-10 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition',
                      isServiceTypeDiagnosesOpen && 'border-ring ring-2 ring-ring/20',
                    ]"
                    @click="toggleServiceTypeDropdown('diagnoses')"
                  >
                    <span class="flex flex-wrap gap-1.5">
                      <span v-if="serviceTypeForm.diagnosisIds.length === 0" class="text-muted-foreground">Mos tashxislarni tanlang</span>
                      <span
                        v-for="record in getServiceTypeDiagnoses(serviceTypeForm)"
                        :key="record.id"
                        class="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground"
                      >
                        {{ record.shortName.uzLatn }}
                      </span>
                    </span>
                    <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <div
                    v-if="isServiceTypeDiagnosesOpen"
                    class="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                  >
                    <button
                      v-for="record in diagnoses"
                      :key="record.id"
                      type="button"
                      class="flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      @click="toggleServiceTypeDiagnosis(record.id)"
                    >
                      <span>
                        <span class="block font-semibold">{{ record.shortName.uzLatn }}</span>
                        <span class="block text-xs text-muted-foreground">{{ record.fullName.uzLatn }}</span>
                      </span>
                      <Check v-if="serviceTypeForm.diagnosisIds.includes(record.id)" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-sm font-medium text-foreground">Qarshi ko'rsatmalar</span>
                <div class="relative">
                  <button
                    type="button"
                    :class="[
                      'flex min-h-10 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition',
                      isServiceTypeContraindicationsOpen && 'border-ring ring-2 ring-ring/20',
                    ]"
                    @click="toggleServiceTypeDropdown('contraindications')"
                  >
                    <span class="flex flex-wrap gap-1.5">
                      <span v-if="serviceTypeForm.contraindicationIds.length === 0" class="text-muted-foreground">Qarshi ko'rsatmalarni tanlang</span>
                      <span
                        v-for="record in getServiceTypeContraindications(serviceTypeForm)"
                        :key="record.id"
                        class="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground"
                      >
                        {{ record.shortName.uzLatn }}
                      </span>
                    </span>
                    <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <div
                    v-if="isServiceTypeContraindicationsOpen"
                    class="absolute left-0 top-full z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                  >
                    <button
                      v-for="record in contraindications"
                      :key="record.id"
                      type="button"
                      class="flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      @click="toggleServiceTypeContraindication(record.id)"
                    >
                      <span>
                        <span class="block font-semibold">{{ record.shortName.uzLatn }}</span>
                        <span class="block text-xs text-muted-foreground">{{ record.fullName.uzLatn }}</span>
                      </span>
                      <Check v-if="serviceTypeForm.contraindicationIds.includes(record.id)" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="space-y-2">
              <span class="text-sm font-medium text-foreground">Talab etiladigan hujjatlar</span>
              <div class="relative">
                <button
                  type="button"
                  :class="[
                    'flex min-h-10 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition',
                    isServiceTypeDocumentsOpen && 'border-ring ring-2 ring-ring/20',
                  ]"
                  @click="toggleServiceTypeDropdown('documents')"
                >
                  <span class="flex flex-wrap gap-1.5">
                    <span v-if="serviceTypeForm.documentIds.length === 0" class="text-muted-foreground">Hujjatlarni tanlang</span>
                    <span
                      v-for="record in getServiceTypeDocuments(serviceTypeForm)"
                      :key="record.id"
                      class="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground"
                    >
                      {{ record.shortName.uzLatn }}
                    </span>
                  </span>
                  <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
                <div
                  v-if="isServiceTypeDocumentsOpen"
                  class="absolute left-0 top-full z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                  <button
                    v-for="record in documents"
                    :key="record.id"
                    type="button"
                    class="flex w-full items-start justify-between gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                    @click="toggleServiceTypeDocument(record.id)"
                  >
                    <span>
                      <span class="block font-semibold">{{ record.shortName.uzLatn }}</span>
                      <span class="block text-xs text-muted-foreground">{{ record.fullName.uzLatn }}</span>
                    </span>
                    <Check v-if="serviceTypeForm.documentIds.includes(record.id)" class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  </button>
                </div>
              </div>
            </section>

            <section class="space-y-2">
              <span class="text-sm font-medium text-foreground">Status</span>
              <div class="relative max-w-sm">
                <button
                  type="button"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm transition',
                    isServiceTypeStatusOpen && 'border-ring ring-2 ring-ring/20',
                  ]"
                  @click="toggleServiceTypeDropdown('status')"
                >
                  <span>{{ serviceTypeForm.status || 'Statusni tanlang' }}</span>
                  <ChevronDown class="h-4 w-4 text-muted-foreground" />
                </button>
                <div
                  v-if="isServiceTypeStatusOpen"
                  class="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                  <button
                    v-for="status in ['Faol', 'Nofaol'] as ServiceTypeStatus[]"
                    :key="status"
                    type="button"
                    class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                    @click="selectServiceTypeStatus(status)"
                  >
                    <span>{{ status }}</span>
                    <Check
                      v-if="serviceTypeForm.status === status"
                      class="h-4 w-4 text-primary"
                    />
                  </button>
                </div>
              </div>
            </section>

            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p
                v-if="serviceTypeFormError"
                class="text-sm text-rose-600"
              >
                {{ serviceTypeFormError }}
              </p>
              <p
                v-else
                class="text-sm text-muted-foreground"
              >
                Barcha ma'lumotlar to'ldirildi.
              </p>

              <div class="flex items-center gap-3">
                <Button
                  variant="outline"
                  @click="resetServiceTypeForm"
                >
                  Tozalash
                </Button>
                <Button
                  :disabled="!canSaveServiceType"
                  @click="saveServiceType"
                >
                  Saqlash
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedServiceTypeRecord"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeServiceTypeViewDialog"
      >
        <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-popover px-6 py-5">
            <div>
              <h2 class="text-lg font-semibold text-foreground">{{ selectedServiceTypeRecord.id }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ formatDateDisplay(selectedServiceTypeRecord.date) }}</p>
            </div>
            <button
              type="button"
              class="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              @click="closeServiceTypeViewDialog"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="space-y-5 px-6 py-5">
            <div>
              <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[selectedServiceTypeRecord.status]]">
                {{ selectedServiceTypeRecord.status }}
              </span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Qisqa nomi</h3>
                <div class="mt-4 divide-y divide-border text-sm">
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">O'zbek lotin</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.shortName.uzLatn }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">O'zbek kirill</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.shortName.uzCyrl }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">Qoraqalpoq lotin</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.shortName.kaaLatn }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">Rus tili</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.shortName.ru }}</span>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">To'liq nomi</h3>
                <div class="mt-4 divide-y divide-border text-sm">
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">O'zbek lotin</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.fullName.uzLatn }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">O'zbek kirill</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.fullName.uzCyrl }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">Qoraqalpoq lotin</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.fullName.kaaLatn }}</span>
                  </div>
                  <div class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">Rus tili</span>
                    <span class="font-medium text-foreground">{{ selectedServiceTypeRecord.fullName.ru }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Minimal yosh</h3>
                <p class="mt-4 text-sm font-medium text-foreground">{{ selectedServiceTypeRecord.minAge }}</p>
              </div>
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Maksimal yosh</h3>
                <p class="mt-4 text-sm font-medium text-foreground">{{ selectedServiceTypeRecord.maxAge ?? '-' }}</p>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Mos tashxislar</h3>
                <div class="mt-4 space-y-2">
                  <div
                    v-for="record in getServiceTypeDiagnoses(selectedServiceTypeRecord)"
                    :key="record.id"
                    class="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <p class="font-semibold text-foreground">{{ record.shortName.uzLatn }}</p>
                    <p class="mt-1 text-muted-foreground">{{ record.fullName.uzLatn }}</p>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Qarshi ko'rsatmalar</h3>
                <div class="mt-4 space-y-2">
                  <div
                    v-for="record in getServiceTypeContraindications(selectedServiceTypeRecord)"
                    :key="record.id"
                    class="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <p class="font-semibold text-foreground">{{ record.shortName.uzLatn }}</p>
                    <p class="mt-1 text-muted-foreground">{{ record.fullName.uzLatn }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <h3 class="font-semibold text-foreground">Talab etiladigan hujjatlar</h3>
              <div class="mt-4 grid gap-2 md:grid-cols-2">
                <div
                  v-for="record in getServiceTypeDocuments(selectedServiceTypeRecord)"
                  :key="record.id"
                  class="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <p class="font-semibold text-foreground">{{ record.shortName.uzLatn }}</p>
                  <p class="mt-1 text-muted-foreground">{{ record.fullName.uzLatn }}</p>
                </div>
              </div>
            </div>

            <div
              v-if="selectedDiagnosisRecord && isQuestionnaireTemplateRecord(selectedDiagnosisRecord)"
              class="rounded-2xl border border-border bg-card p-4"
            >
              <h3 class="font-semibold text-foreground">Savollar shabloni</h3>
              <div class="mt-4 space-y-4">
                <div
                  v-for="(group, groupIndex) in selectedDiagnosisRecord.questionGroups"
                  :key="group.id"
                  class="rounded-xl border border-border bg-background p-4"
                >
                  <p class="text-sm font-semibold text-foreground">{{ groupIndex + 1 }}. {{ group.title }}</p>
                  <div class="mt-3 space-y-3">
                    <div
                      v-for="(question, questionIndex) in group.questions"
                      :key="question.id"
                      class="rounded-lg border border-border bg-card p-3"
                    >
                      <p class="text-sm font-medium text-foreground">{{ groupIndex + 1 }}.{{ questionIndex + 1 }} {{ question.text }}</p>
                      <div class="mt-3 grid gap-2">
                        <div
                          v-for="answer in question.answers"
                          :key="answer.id"
                          class="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
                        >
                          <span class="text-foreground">{{ answer.text }}</span>
                          <span class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">{{ answer.score }} ball</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="selectedDiagnosisRecord && isCategoryGroupRecord(selectedDiagnosisRecord)"
              class="grid gap-4 md:grid-cols-2"
            >
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Minimal ball</h3>
                <p class="mt-4 text-sm font-medium text-foreground">{{ selectedDiagnosisRecord.minScore }}</p>
              </div>
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Maksimal ball</h3>
                <p class="mt-4 text-sm font-medium text-foreground">{{ selectedDiagnosisRecord.maxScore }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        :open="Boolean(pendingConfirmation)"
        :tone="pendingConfirmation?.tone"
        :title="pendingConfirmation?.title ?? ''"
        :description="pendingConfirmation?.description ?? ''"
        :confirm-label="pendingConfirmation?.confirmLabel ?? ''"
        :loading="isConfirmationLoading"
        @cancel="closeConfirmation"
        @confirm="confirmPendingAction"
      />
    </template>

    <template v-else-if="isMedicalReferencePage">
      <div
        v-if="feedback"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg',
          feedback.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 dark:border-sky-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              feedback.type === 'success' && 'bg-emerald-500',
              feedback.type === 'error' && 'bg-rose-500',
              feedback.type === 'info' && 'bg-sky-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            feedback.type === 'success' && 'bg-emerald-600',
            feedback.type === 'error' && 'bg-rose-600',
            feedback.type === 'info' && 'bg-sky-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ feedback.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ feedback.message }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible rounded-2xl border border-border bg-card p-5">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              :model-value="diagnosisSearchInput"
              class="pl-9"
              placeholder="Qidirish"
              @update:model-value="handleDiagnosisSearchInput(String($event ?? ''))"
            />
          </div>

          <div class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <Button
              class="order-2 h-10 w-full gap-2 sm:w-auto"
              @click="openCreateDiagnosisDialog"
            >
              <Plus class="h-4 w-4" />
              Yaratish
            </Button>
            <Button
              variant="outline"
              class="order-1 h-10 w-full gap-2 sm:w-auto"
              @click="downloadDiagnoses"
            >
              <Download class="h-4 w-4" />
              Yuklab olish
            </Button>
          </div>
        </div>

        <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-border">
          <div class="relative hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
            <div
              v-if="isTableLoading"
              class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                <span>Yuklanmoqda...</span>
              </div>
            </div>
            <table class="min-w-[1040px] border-separate border-spacing-0 text-sm xl:min-w-full">
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Sana</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Qisqa nomi</th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">To'liq nomi</th>
                  <th v-if="isCategoryGroupsPage" class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Minimal ball</th>
                  <th v-if="isCategoryGroupsPage" class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Maksimal ball</th>
                  <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedDiagnoses.length === 0">
                  <td
                    :colspan="isCategoryGroupsPage ? 8 : 6"
                    class="border-b border-border px-4 py-12 text-center"
                  >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                      <p class="text-sm font-medium text-foreground">Ma'lumot topilmadi</p>
                      <p class="text-sm text-muted-foreground">Qidiruv shartlariga mos yozuv topilmadi.</p>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="record in paginatedDiagnoses"
                  :key="record.id"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td class="border-b border-border px-4 py-3 align-top">
                    <DropdownMenuRoot @update:open="setDiagnosisActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openDiagnosisActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <LoaderCircle v-if="isActionButtonLoading(`diagnosis-view-${record.id}`, `diagnosis-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                          <Ellipsis v-else class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="viewDiagnosis(record)">
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="editDiagnosis(record)">
                            <Pencil class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted" @click="requestDeleteDiagnosis(record)">
                            <Trash2 class="h-4 w-4 shrink-0" />
                            <span>O'chirish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ record.id }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">{{ formatDateDisplay(record.date) }}</td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ record.shortName.uzLatn }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <p class="max-w-xl font-medium text-foreground">{{ record.fullName.uzLatn }}</p>
                  </td>
                  <td v-if="isCategoryGroupsPage" class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ isCategoryGroupRecord(record) ? record.minScore : '' }}</p>
                  </td>
                  <td v-if="isCategoryGroupsPage" class="border-b border-border px-4 py-3 align-top">
                    <p class="font-medium text-foreground">{{ isCategoryGroupRecord(record) ? record.maxScore : '' }}</p>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[record.status]]">
                      {{ record.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="relative grid gap-3 p-3 xl:hidden">
            <div
              v-if="isTableLoading"
              class="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm"
            >
              <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
                <span>Yuklanmoqda...</span>
              </div>
            </div>
            <Card
              v-for="record in paginatedDiagnoses"
              :key="record.id"
              class="border-border"
            >
              <CardContent class="space-y-4 pt-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</p>
                    <p class="mt-1 font-medium text-foreground">{{ record.id }}</p>
                    <p class="mt-1 text-sm text-muted-foreground">{{ formatDateDisplay(record.date) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[record.status]]">{{ record.status }}</span>
                    <DropdownMenuRoot @update:open="setDiagnosisActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openDiagnosisActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <LoaderCircle v-if="isActionButtonLoading(`diagnosis-view-${record.id}`, `diagnosis-edit-${record.id}`)" class="h-4 w-4 animate-spin" />
                          <Ellipsis v-else class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="viewDiagnosis(record)">
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted" @click="editDiagnosis(record)">
                            <Pencil class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted" @click="requestDeleteDiagnosis(record)">
                            <Trash2 class="h-4 w-4 shrink-0" />
                            <span>O'chirish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Qisqa nomi</p>
                  <p class="mt-1 font-medium text-foreground">{{ record.shortName.uzLatn }}</p>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">To'liq nomi</p>
                  <p class="mt-1 text-sm font-medium text-foreground">{{ record.fullName.uzLatn }}</p>
                </div>
                <div v-if="isCategoryGroupsPage && isCategoryGroupRecord(record)" class="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Minimal ball</p>
                    <p class="mt-1 text-sm font-medium text-foreground">{{ record.minScore }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Maksimal ball</p>
                    <p class="mt-1 text-sm font-medium text-foreground">{{ record.maxScore }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="flex flex-col gap-3 border-t border-border bg-card p-4 text-sm md:flex-row md:items-center md:justify-between">
            <div class="flex flex-wrap items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Qatorlar soni</span>
                <DropdownMenuRoot @update:open="setDiagnosisRowsPerPageOpen">
                  <DropdownMenuTrigger as-child>
                    <Button
                      variant="outline"
                      size="sm"
                      :class="isDiagnosisRowsPerPageOpen ? 'h-9 min-w-16 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-9 min-w-16'"
                    >
                      {{ diagnosisRowsPerPage }}
                      <ChevronDown class="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuContent side="top" align="start" :side-offset="6" class="z-50 min-w-24 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                      <DropdownMenuItem
                        v-for="option in rowsPerPageOptions"
                        :key="option"
                        class="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted"
                        @click="setDiagnosisRowsPerPage(option)"
                      >
                        {{ option }}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenuRoot>
              </div>
              <span class="text-muted-foreground">
                Sahifada:
                <strong class="font-semibold text-foreground">{{ diagnosisPaginationRange.start }}-{{ diagnosisPaginationRange.end }} / {{ diagnosisTotalRows }}</strong>
              </span>
            </div>
            <div class="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" class="h-9 w-9 p-0" :disabled="diagnosisCurrentPage === 1" @click="goToDiagnosisPage(1)">
                <ChevronsLeft class="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" class="h-9 w-9 p-0" :disabled="diagnosisCurrentPage === 1" @click="goToDiagnosisPage(diagnosisCurrentPage - 1)">
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <span class="min-w-16 text-center font-semibold text-foreground">{{ diagnosisCurrentPageSummary }}</span>
              <Button variant="outline" size="sm" class="h-9 w-9 p-0" :disabled="diagnosisCurrentPage === diagnosisTotalPages" @click="goToDiagnosisPage(diagnosisCurrentPage + 1)">
                <ChevronRight class="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" class="h-9 w-9 p-0" :disabled="diagnosisCurrentPage === diagnosisTotalPages" @click="goToDiagnosisPage(diagnosisTotalPages)">
                <ChevronsRight class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isDiagnosisDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeDiagnosisDialog"
      >
        <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-popover px-6 py-5">
            <div>
              <h2 class="text-lg font-semibold text-foreground">{{ editingDiagnosisId ? medicalReferenceEditTitle : medicalReferenceCreateTitle }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ isCategoryGroupsPage ? "Asosiy nomlar, minimal va maksimal ball majburiy, tarjimalar ixtiyoriy." : requiresMedicalReferenceIcd ? 'Asosiy nomlar va ICD-10 kodlari majburiy, tarjimalar ixtiyoriy.' : 'Asosiy nomlar majburiy, tarjimalar ixtiyoriy.' }}
              </p>
            </div>
            <button type="button" class="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" @click="closeDiagnosisDialog">
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="space-y-6 px-6 py-5">
            <section class="space-y-4 rounded-2xl border border-border bg-card p-4">
              <div class="grid gap-4 md:grid-cols-2">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Qisqa nomi</span>
                  <Input v-model="diagnosisForm.shortName.uzLatn" placeholder="Qisqa nomini kiriting" />
                </label>
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">To'liq nomi</span>
                  <Input v-model="diagnosisForm.fullName.uzLatn" placeholder="To'liq nomini kiriting" />
                </label>
              </div>

              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left text-sm font-semibold text-foreground transition hover:bg-muted"
                @click="toggleDiagnosisTranslations"
              >
                <span>Tarjimalar (ixtiyoriy)</span>
                <ChevronDown :class="['h-4 w-4 text-muted-foreground transition-transform', isDiagnosisTranslationsOpen && 'rotate-180']" />
              </button>

              <div v-if="isDiagnosisTranslationsOpen" class="grid gap-4 md:grid-cols-2">
                <div class="space-y-3 rounded-xl border border-border bg-background p-3">
                  <h4 class="text-sm font-semibold text-foreground">Qisqa nomi tarjimalari</h4>
                  <label v-for="field in optionalLocalizedLanguageFields" :key="field.key" class="space-y-2">
                    <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ field.label }}</span>
                    <Input v-model="diagnosisForm.shortName[field.key]" placeholder="Ixtiyoriy" />
                  </label>
                </div>
                <div class="space-y-3 rounded-xl border border-border bg-background p-3">
                  <h4 class="text-sm font-semibold text-foreground">To'liq nomi tarjimalari</h4>
                  <label v-for="field in optionalLocalizedLanguageFields" :key="field.key" class="space-y-2">
                    <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ field.label }}</span>
                    <Input v-model="diagnosisForm.fullName[field.key]" placeholder="Ixtiyoriy" />
                  </label>
                </div>
              </div>
            </section>

            <section
              v-if="isCategoryGroupsPage"
              class="grid gap-4 rounded-2xl border border-border bg-card p-4 md:grid-cols-2"
            >
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">Minimal ball</span>
                <Input v-model="diagnosisForm.minScore" inputmode="numeric" placeholder="Masalan: 0" />
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">Maksimal ball</span>
                <Input v-model="diagnosisForm.maxScore" inputmode="numeric" placeholder="Masalan: 62" />
              </label>
            </section>

            <section
              v-if="isQuestionnaireTemplatesPage"
              class="space-y-4 rounded-2xl border border-border bg-card p-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-foreground">Savollar shabloni</h3>
                  <p class="mt-1 text-sm text-muted-foreground">Savollar guruhi, savollar va javob variantlarini ballari bilan kiriting.</p>
                </div>
                <Button variant="outline" class="gap-2" @click="addQuestionnaireGroup">
                  <Plus class="h-4 w-4" />
                  Guruh qo'shish
                </Button>
              </div>

              <div class="space-y-4">
                <div
                  v-for="(group, groupIndex) in diagnosisForm.questionGroups"
                  :key="group.id"
                  class="space-y-4 rounded-xl border border-border bg-background p-4"
                >
                  <div class="flex items-center justify-between gap-3">
                    <label class="flex-1 space-y-2">
                      <span class="text-sm font-medium text-foreground">Savollar guruhi {{ groupIndex + 1 }}</span>
                      <Input v-model="group.title" placeholder="Masalan: Elementar harakatlar" />
                    </label>
                    <Button
                      variant="ghost"
                      class="mt-7 gap-2 text-destructive hover:text-destructive"
                      @click="removeQuestionnaireGroup(group.id)"
                    >
                      <Trash2 class="h-4 w-4" />
                      Olib tashlash
                    </Button>
                  </div>

                  <div class="space-y-3 rounded-xl border border-dashed border-border p-3">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-foreground">Savollar</p>
                      <Button variant="outline" size="sm" class="gap-2" @click="addQuestionnaireQuestion(group.id)">
                        <Plus class="h-4 w-4" />
                        Savol qo'shish
                      </Button>
                    </div>

                    <div
                      v-for="(question, questionIndex) in group.questions"
                      :key="question.id"
                      class="space-y-3 rounded-lg border border-border bg-card p-3"
                    >
                      <div class="flex items-center justify-between gap-3">
                        <label class="flex-1 space-y-2">
                          <span class="text-sm font-medium text-foreground">Savol {{ questionIndex + 1 }}</span>
                          <Input v-model="question.text" placeholder="Savol matnini kiriting" />
                        </label>
                        <Button
                          variant="ghost"
                          class="mt-7 gap-2 text-destructive hover:text-destructive"
                          @click="removeQuestionnaireQuestion(group.id, question.id)"
                        >
                          <Trash2 class="h-4 w-4" />
                          Olib tashlash
                        </Button>
                      </div>

                      <div class="space-y-2 rounded-lg border border-dashed border-border p-3">
                        <div class="flex items-center justify-between gap-3">
                          <p class="text-sm font-medium text-foreground">Javob variantlari</p>
                          <Button variant="outline" size="sm" class="gap-2" @click="addQuestionnaireAnswer(group.id, question.id)">
                            <Plus class="h-4 w-4" />
                            Javob qo'shish
                          </Button>
                        </div>

                        <div
                          v-for="(answer, answerIndex) in question.answers"
                          :key="answer.id"
                          class="grid gap-3 rounded-lg border border-border bg-background p-3 md:grid-cols-[minmax(0,1fr)_140px_auto]"
                        >
                          <label class="space-y-2">
                            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Javob {{ answerIndex + 1 }}</span>
                            <Input v-model="answer.text" placeholder="Javob variantini kiriting" />
                          </label>
                          <label class="space-y-2">
                            <span class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ball</span>
                            <Input
                              :model-value="answer.score"
                              inputmode="decimal"
                              placeholder="Masalan: 5"
                              @update:model-value="normalizeQuestionnaireScore(group.id, question.id, answer.id, String($event ?? ''))"
                            />
                          </label>
                          <div class="flex items-end">
                            <Button
                              variant="ghost"
                              class="w-full gap-2 text-destructive hover:text-destructive md:w-auto"
                              @click="removeQuestionnaireAnswer(group.id, question.id, answer.id)"
                            >
                              <Trash2 class="h-4 w-4" />
                              Olib tashlash
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section :class="['grid gap-4', requiresMedicalReferenceIcd ? 'md:grid-cols-2' : 'md:grid-cols-1']">
              <div v-if="requiresMedicalReferenceIcd" class="space-y-2">
                <span class="text-sm font-medium text-foreground">ICD-10 kodlari</span>
                <div class="relative">
                  <button
                    type="button"
                    :class="[
                      'flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm transition',
                      isDiagnosisIcdOpen && 'border-ring ring-2 ring-ring/20',
                    ]"
                    @click="toggleDiagnosisDropdown('icd')"
                  >
                    <span class="flex flex-wrap gap-1.5">
                      <span v-if="diagnosisForm.icdCodes.length === 0" class="text-muted-foreground">ICD-10 kodlarini tanlang</span>
                      <span
                        v-for="code in diagnosisForm.icdCodes"
                        :key="code"
                        class="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-semibold text-foreground"
                      >
                        {{ code }}
                      </span>
                    </span>
                    <ChevronDown class="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <div
                    v-if="isDiagnosisIcdOpen"
                    class="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                  >
                    <button
                      v-for="code in icdCodeOptions"
                      :key="code"
                      type="button"
                      class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      @click="toggleDiagnosisIcdCode(code)"
                    >
                      <span>{{ code }}</span>
                      <Check v-if="diagnosisForm.icdCodes.includes(code)" class="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-sm font-medium text-foreground">Status</span>
                <div class="relative">
                  <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm transition',
                      isDiagnosisStatusOpen && 'border-ring ring-2 ring-ring/20',
                    ]"
                    @click="toggleDiagnosisDropdown('status')"
                  >
                    <span>{{ diagnosisForm.status || 'Statusni tanlang' }}</span>
                    <ChevronDown class="h-4 w-4 text-muted-foreground" />
                  </button>
                  <div v-if="isDiagnosisStatusOpen" class="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg">
                    <button
                      v-for="status in ['Faol', 'Nofaol'] as ServiceTypeStatus[]"
                      :key="status"
                      type="button"
                      class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      @click="selectDiagnosisStatus(status)"
                    >
                      <span>{{ status }}</span>
                      <Check v-if="diagnosisForm.status === status" class="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
              <p v-if="diagnosisFormError" class="text-sm text-rose-600">{{ diagnosisFormError }}</p>
              <p v-else class="text-sm text-muted-foreground">Barcha ma'lumotlar to'ldirildi.</p>
              <div class="flex items-center gap-3">
                <Button variant="outline" @click="resetDiagnosisForm">Tozalash</Button>
                <Button :disabled="!canSaveDiagnosis" @click="saveDiagnosis">Saqlash</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedDiagnosisRecord"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
        @click.self="closeDiagnosisViewDialog"
      >
        <div class="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-popover px-6 py-5">
            <div>
              <h2 class="text-lg font-semibold text-foreground">{{ selectedDiagnosisRecord.id }}</h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ formatDateDisplay(selectedDiagnosisRecord.date) }}</p>
            </div>
            <button type="button" class="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" @click="closeDiagnosisViewDialog">
              <X class="h-5 w-5" />
            </button>
          </div>
          <div class="space-y-5 px-6 py-5">
            <div class="flex flex-wrap items-center gap-2">
              <span :class="['inline-flex rounded-full border px-3 py-1 text-xs font-semibold', serviceTypeStatusClassMap[selectedDiagnosisRecord.status]]">{{ selectedDiagnosisRecord.status }}</span>
              <span
                v-for="code in requiresMedicalReferenceIcd ? selectedDiagnosisRecord.icdCodes : []"
                :key="code"
                class="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-foreground"
              >
                {{ code }}
              </span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">Qisqa nomi</h3>
                <div class="mt-4 divide-y divide-border text-sm">
                  <div v-for="field in localizedLanguageFields" :key="field.key" class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">{{ field.label }}</span>
                    <span class="font-medium text-foreground">{{ selectedDiagnosisRecord.shortName[field.key] }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-2xl border border-border bg-card p-4">
                <h3 class="font-semibold text-foreground">To'liq nomi</h3>
                <div class="mt-4 divide-y divide-border text-sm">
                  <div v-for="field in localizedLanguageFields" :key="field.key" class="grid grid-cols-[150px_1fr] gap-3 py-2">
                    <span class="text-muted-foreground">{{ field.label }}</span>
                    <span class="font-medium text-foreground">{{ selectedDiagnosisRecord.fullName[field.key] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        :open="Boolean(pendingConfirmation)"
        :tone="pendingConfirmation?.tone"
        :title="pendingConfirmation?.title ?? ''"
        :description="pendingConfirmation?.description ?? ''"
        :confirm-label="pendingConfirmation?.confirmLabel ?? ''"
        :loading="isConfirmationLoading"
        @cancel="closeConfirmation"
        @confirm="confirmPendingAction"
      />
    </template>

    <template v-else-if="isApplicationsReportPage">
      <div
        v-if="feedback"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card px-4 py-3 text-sm text-foreground shadow-lg',
          feedback.type === 'success' && 'border-emerald-200 dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 dark:border-sky-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              feedback.type === 'success' && 'bg-emerald-500',
              feedback.type === 'error' && 'bg-rose-500',
              feedback.type === 'info' && 'bg-sky-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            feedback.type === 'success' && 'bg-emerald-600',
            feedback.type === 'error' && 'bg-rose-600',
            feedback.type === 'info' && 'bg-sky-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ feedback.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ feedback.message }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible rounded-2xl border border-border bg-card p-5">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-2">
            <Button
              v-if="selectedApplicationReportRegion"
              variant="outline"
              class="h-10 gap-2"
              @click="closeApplicationReportRegion"
            >
              <ChevronLeft class="h-4 w-4" />
              Ortga
            </Button>
            <span
              v-if="selectedApplicationReportRegion"
              class="truncate text-sm font-medium text-muted-foreground"
            >
              {{ selectedApplicationReportRegion }} tumanlari kesimi
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              class="order-2 h-10 gap-2"
              :disabled="actionLoadingKey === 'application-report-download'"
              @click="downloadApplicationReport"
            >
              <LoaderCircle
                v-if="actionLoadingKey === 'application-report-download'"
                class="h-4 w-4 animate-spin"
              />
              <Download v-else class="h-4 w-4" />
              Yuklab olish
            </Button>

            <div class="relative order-1">
            <div
              v-if="isApplicationReportFilterOpen"
              class="fixed inset-0 z-40 bg-background/40 xl:hidden"
              @click="closeApplicationReportFilters"
            />

            <Button
              variant="outline"
              :class="isApplicationReportFilterOpen ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
              @click="toggleApplicationReportFilters(!isApplicationReportFilterOpen)"
            >
              <LoaderCircle
                v-if="actionLoadingKey && actionLoadingKey.startsWith('application-report-filter')"
                class="h-4 w-4 animate-spin"
              />
              <span
                v-else-if="applicationReportActiveFilterCount > 0"
                class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
              >
                {{ applicationReportActiveFilterCount }}
              </span>
              <Filter v-else class="h-4 w-4" />
              Filter
            </Button>

            <div
              v-if="isApplicationReportFilterOpen"
              class="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none xl:absolute xl:right-0 xl:left-auto xl:top-[calc(100%+0.4rem)] xl:w-[21rem] xl:origin-top-right"
            >
              <div class="flex flex-col gap-3 overflow-y-auto p-4 xl:max-h-[min(34rem,calc(100vh-10rem))] xl:p-3.5">
                <div class="flex items-center justify-between gap-3">
                  <p class="text-sm font-semibold text-foreground">Filterlar</p>
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground"
                    @click="closeApplicationReportFilters"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </div>

                <div class="relative space-y-1.5">
                  <p class="text-sm font-medium text-foreground">Status</p>
                  <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                      openApplicationReportFilterField === 'status'
                        ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                        : 'border-input hover:border-ring',
                    ]"
                    @click="toggleApplicationReportFilterField('status')"
                  >
                    <span class="truncate">{{ applicationReportStatusFilterLabel }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                        openApplicationReportFilterField === 'status' ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <div
                    v-if="openApplicationReportFilterField === 'status'"
                    class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                  >
                    <button
                      v-for="status in applicationReportStatuses"
                      :key="`report-filter-status-${status}`"
                      type="button"
                      class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                      @click="toggleApplicationReportStatusFilter(status)"
                    >
                      <span>{{ status }}</span>
                      <Check
                        v-if="draftApplicationReportStatusFilter.includes(status)"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                  </div>
                </div>

                <div class="relative space-y-1.5">
                  <p class="text-sm font-medium text-foreground">Bosqich</p>
                  <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                      openApplicationReportFilterField === 'step'
                        ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                        : 'border-input hover:border-ring',
                    ]"
                    @click="toggleApplicationReportFilterField('step')"
                  >
                    <span class="truncate">{{ applicationReportStepFilterLabel }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                        openApplicationReportFilterField === 'step' ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <div
                    v-if="openApplicationReportFilterField === 'step'"
                    class="max-h-64 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                  >
                    <button
                      v-for="step in applicationReportStepFilterOptions"
                      :key="`report-filter-step-${step}`"
                      type="button"
                      class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                      @click="toggleApplicationReportStepFilter(step)"
                    >
                      <span>{{ step }}</span>
                      <Check
                        v-if="draftApplicationReportStepFilter.includes(step)"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                  </div>
                </div>

                <div class="relative space-y-1.5">
                  <p class="text-sm font-medium text-foreground">Hudud</p>
                  <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                      openApplicationReportFilterField === 'region'
                        ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                        : 'border-input hover:border-ring',
                    ]"
                    @click="toggleApplicationReportFilterField('region')"
                  >
                    <span class="truncate">{{ applicationReportRegionFilterLabel }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                        openApplicationReportFilterField === 'region' ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <div
                    v-if="openApplicationReportFilterField === 'region'"
                    class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                  >
                    <button
                      v-for="region in applicationReportRegions"
                      :key="`report-filter-region-${region}`"
                      type="button"
                      class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                      @click="toggleApplicationReportRegionFilter(region)"
                    >
                      <span>{{ region }}</span>
                      <Check
                        v-if="draftApplicationReportRegionFilter.includes(region)"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                  </div>
                </div>

                <div class="relative space-y-1.5">
                  <p class="text-sm font-medium text-foreground">Tuman (shahar)</p>
                  <button
                    type="button"
                    :disabled="isApplicationReportDistrictFilterDisabled"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                      openApplicationReportFilterField === 'district'
                        ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                        : 'border-input hover:border-ring',
                    ]"
                    @click="toggleApplicationReportFilterField('district')"
                  >
                    <span class="truncate">{{ applicationReportDistrictFilterLabel }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                        openApplicationReportFilterField === 'district' ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <div
                    v-if="openApplicationReportFilterField === 'district'"
                    class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                  >
                    <button
                      v-for="district in applicationReportDistrictFilterOptions"
                      :key="`report-filter-district-${district}`"
                      type="button"
                      class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                      @click="toggleApplicationReportDistrictFilter(district)"
                    >
                      <span>{{ district }}</span>
                      <Check
                        v-if="draftApplicationReportDistrictFilter.includes(district)"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                  </div>
                </div>

                <div
                  v-for="group in applicationReportMetricFilterGroups"
                  :key="`report-filter-metric-${group.key}`"
                  class="relative space-y-1.5"
                >
                  <p class="text-sm font-medium text-foreground">{{ group.label }}</p>
                  <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                      openApplicationReportFilterField === group.key
                        ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                        : 'border-input hover:border-ring',
                    ]"
                    @click="toggleApplicationReportFilterField(group.key)"
                  >
                    <span class="truncate">{{ getApplicationReportMetricFilterLabel(group.key) }}</span>
                    <ChevronDown
                      :class="[
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                        openApplicationReportFilterField === group.key ? 'rotate-180' : '',
                      ]"
                    />
                  </button>
                  <div
                    v-if="openApplicationReportFilterField === group.key"
                    class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
                  >
                    <button
                      v-for="option in group.options"
                      :key="`report-filter-metric-${group.key}-${option}`"
                      type="button"
                      class="flex w-full items-center justify-between gap-2 rounded-sm px-2 py-2 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out hover:bg-muted"
                      @click="toggleApplicationReportMetricFilter(group.key, option)"
                    >
                      <span>{{ option }}</span>
                      <Check
                        v-if="draftApplicationReportMetricFilters[group.key].includes(option)"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                  </div>
                </div>

                <div
                  v-for="dateFieldGroup in applicationReportDateFieldGroups"
                  :key="`report-date-group-${dateFieldGroup[0]?.key}`"
                  class="grid gap-3"
                >
                  <label
                    v-for="dateField in dateFieldGroup"
                    :key="`report-date-${dateField.key}`"
                    class="space-y-1.5 sm:relative"
                  >
                    <span class="text-sm font-medium text-foreground">{{ dateField.label }}</span>
                    <div class="relative space-y-2">
                      <div class="relative">
                        <Input
                          :model-value="getApplicationReportDateFieldValue(dateField.key)"
                          class="h-10 pr-10"
                          inputmode="numeric"
                          maxlength="10"
                          placeholder="dd.mm.yyyy"
                          @keydown="preventDateNonDigitKeydown"
                          @update:model-value="handleApplicationReportDateFieldChange(dateField.key, $event)"
                        />
                        <button
                          type="button"
                          class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                          :aria-label="`${dateField.label}ni tanlash`"
                          @click="openApplicationReportCalendar(dateField.key)"
                        >
                          <CalendarDays class="h-4 w-4" />
                        </button>
                      </div>

                      <div
                        v-if="openApplicationReportCalendarField === dateField.key"
                        class="rounded-lg border border-border bg-background p-3 shadow-sm sm:absolute sm:left-0 sm:right-0 sm:top-[calc(100%+0.5rem)] sm:z-30"
                      >
                        <div class="mb-3 flex items-center justify-between gap-2">
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Oldingi yil" @click="shiftApplicationReportCalendarYear(-1)">
                              <ChevronsLeft class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Oldingi oy" @click="shiftApplicationReportCalendarMonth(-1)">
                              <ChevronLeft class="h-4 w-4" />
                            </Button>
                          </div>
                          <p class="text-sm font-medium text-foreground">{{ applicationReportCalendarMonthLabel }}</p>
                          <div class="flex items-center gap-1">
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Keyingi oy" @click="shiftApplicationReportCalendarMonth(1)">
                              <ChevronRight class="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" class="h-8 w-8 p-0" aria-label="Keyingi yil" @click="shiftApplicationReportCalendarYear(1)">
                              <ChevronsRight class="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                          <span v-for="weekday in calendarWeekdays" :key="`report-${dateField.key}-${weekday}`" class="py-1">{{ weekday }}</span>
                        </div>

                        <div class="grid grid-cols-7 gap-1">
                          <button
                            v-for="day in applicationReportCalendarDays"
                            :key="`report-${dateField.key}-${day.key}`"
                            type="button"
                            class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                            :class="day.isCurrentMonth
                              ? isApplicationReportCalendarDateSelected(dateField.key, day.value)
                                ? 'bg-primary text-primary-foreground'
                                : 'text-foreground hover:bg-muted'
                              : 'pointer-events-none opacity-0'"
                            :disabled="!day.isCurrentMonth"
                            @click="selectApplicationReportCalendarDate(dateField.key, day.value)"
                          >
                            {{ day.label }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div class="flex justify-end gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    class="gap-2"
                    :disabled="isTableLoading || (!applicationReportHasActiveFilters && !applicationReportHasPendingFilterChanges)"
                    @click="clearApplicationReportFilters"
                  >
                    <LoaderCircle v-if="actionLoadingKey === 'application-report-filter-clear'" class="h-4 w-4 animate-spin" />
                    Tozalash
                  </Button>
                  <Button
                    size="sm"
                    class="gap-2"
                    :disabled="isTableLoading || !applicationReportHasPendingFilterChanges"
                    @click="applyApplicationReportFilters"
                  >
                    <LoaderCircle v-if="actionLoadingKey === 'application-report-filter-apply'" class="h-4 w-4 animate-spin" />
                    Qo'llash
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div class="relative flex min-h-[calc(100vh-16rem)] flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div
            v-if="isTableLoading"
            class="absolute inset-0 z-20 flex items-center justify-center bg-card/70 backdrop-blur-[1px]"
          >
            <LoaderCircle class="h-6 w-6 animate-spin text-primary" />
          </div>

          <div class="min-h-[22rem] flex-1 overflow-auto">
            <table class="min-w-[2600px] w-full border-separate border-spacing-0 text-sm">
              <thead class="bg-muted/45 text-left text-muted-foreground">
                <tr>
                  <th
                    rowspan="2"
                    class="sticky left-0 top-0 z-50 h-28 w-64 min-w-64 max-w-64 border-b border-r border-border bg-muted px-4 py-0 text-xs font-semibold uppercase tracking-wide"
                  >
                    Hudud
                  </th>
                  <th
                    rowspan="2"
                    class="sticky top-0 z-40 h-28 min-w-24 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    Jami
                  </th>
                  <th
                    :colspan="applicationReportVisibleStatuses.length"
                    class="sticky top-0 z-40 h-12 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    Status
                  </th>
                  <th
                    :colspan="applicationReportVisibleSteps.length"
                    class="sticky top-0 z-40 h-12 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    Bosqich
                  </th>
                  <th
                    v-for="group in applicationReportVisibleMetricGroups"
                    :key="`report-metric-group-${group.key}`"
                    :colspan="group.options.length"
                    class="sticky top-0 z-40 h-12 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide last:border-r-0"
                  >
                    {{ group.label }}
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="status in applicationReportVisibleStatuses"
                    :key="`report-status-head-${status}`"
                    class="sticky top-12 z-40 h-16 min-w-32 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    {{ status }}
                  </th>
                  <th
                    v-for="step in applicationReportVisibleSteps"
                    :key="`report-step-head-${step}`"
                    class="sticky top-12 z-40 h-16 min-w-40 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    {{ step }}
                  </th>
                  <template
                    v-for="group in applicationReportVisibleMetricGroups"
                    :key="`report-metric-head-group-${group.key}`"
                  >
                    <th
                      v-for="option in group.options"
                      :key="`report-metric-head-${group.key}-${option}`"
                      class="sticky top-12 z-40 h-16 min-w-28 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide last:border-r-0"
                    >
                      {{ option }}
                    </th>
                  </template>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in applicationReportDisplayRows"
                  :key="`report-region-${row.region}`"
                  :class="[
                    'transition-colors duration-200 ease-out hover:bg-muted/25',
                    row.isTotal ? 'bg-muted/35' : '',
                  ]"
                >
                  <td
                    :class="[
                      'sticky left-0 z-20 w-64 min-w-64 max-w-64 border-b border-r border-border px-4 py-3 font-medium text-foreground',
                      row.isTotal ? 'bg-muted font-semibold' : 'bg-card',
                    ]"
                  >
                    <button
                      type="button"
                      :disabled="row.isTotal || Boolean(selectedApplicationReportRegion) || Boolean(appliedApplicationReportDistrictFilter.length)"
                      :class="[
                        'inline-flex items-center text-left transition-colors duration-200 ease-out',
                        !row.isTotal && !selectedApplicationReportRegion && !appliedApplicationReportDistrictFilter.length
                          ? 'cursor-pointer hover:text-primary focus-visible:outline-none focus-visible:text-primary'
                          : 'cursor-default disabled:opacity-100',
                      ]"
                      @click="openApplicationReportRegion(row.region, row.isTotal)"
                    >
                      {{ row.region }}
                    </button>
                  </td>
                  <td
                    :class="[
                      'select-none border-b border-r border-border px-4 py-3 text-center font-semibold text-foreground transition-colors duration-150 ease-out',
                      getApplicationReportCellClass(row.region, 'total', 'Jami'),
                    ]"
                    title="Click: analitika, Ctrl + click: tanlovga qo'shish"
                    @click="handleApplicationReportCellClick($event, row.region, 'total', 'Jami', row.total)"
                  >
                    {{ row.total }}
                  </td>
                  <td
                    v-for="status in applicationReportVisibleStatuses"
                    :key="`report-status-${row.region}-${status}`"
                    :class="[
                      'select-none border-b border-r border-border px-4 py-3 text-center transition-colors duration-150 ease-out',
                      getApplicationReportCellClass(row.region, 'status', status),
                    ]"
                    title="Click: analitika, Ctrl + click: tanlovga qo'shish"
                    @click="handleApplicationReportCellClick($event, row.region, 'status', status, row.statuses[status] ?? 0)"
                  >
                    <span :class="cn('inline-flex min-w-10 justify-center rounded-full border px-2.5 py-1 text-xs font-medium', statusClassMap[status])">
                      {{ row.statuses[status] ?? 0 }}
                    </span>
                  </td>
                  <td
                    v-for="step in applicationReportVisibleSteps"
                    :key="`report-step-${row.region}-${step}`"
                    :class="[
                      'select-none border-b border-r border-border px-4 py-3 text-center text-foreground transition-colors duration-150 ease-out',
                      getApplicationReportCellClass(row.region, 'step', step),
                    ]"
                    title="Click: analitika, Ctrl + click: tanlovga qo'shish"
                    @click="handleApplicationReportCellClick($event, row.region, 'step', step, row.steps[step] ?? 0)"
                  >
                    {{ row.steps[step] ?? 0 }}
                  </td>
                  <template
                    v-for="group in applicationReportVisibleMetricGroups"
                    :key="`report-metric-body-group-${row.region}-${group.key}`"
                  >
                    <td
                      v-for="option in group.options"
                      :key="`report-metric-${row.region}-${group.key}-${option}`"
                      :class="[
                        'select-none border-b border-r border-border px-4 py-3 text-center text-foreground transition-colors duration-150 ease-out last:border-r-0',
                        getApplicationReportCellClass(row.region, group.key, option),
                      ]"
                      title="Click: analitika, Ctrl + click: tanlovga qo'shish"
                      @click="handleApplicationReportCellClick($event, row.region, group.key, option, row.metrics[group.key][option] ?? 0)"
                    >
                      {{ row.metrics[group.key][option] ?? 0 }}
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-border bg-card px-3 py-2">
            <div
              v-if="applicationReportSelectionAnalytics.count > 0"
              class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Tanlangan:
                  <strong class="font-semibold text-foreground">{{ applicationReportSelectionAnalytics.count }} ta</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Jami:
                  <strong class="font-semibold text-foreground">{{ applicationReportSelectionAnalytics.sum }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Minimum:
                  <strong class="font-semibold text-foreground">{{ applicationReportSelectionAnalytics.min }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Maksimum:
                  <strong class="font-semibold text-foreground">{{ applicationReportSelectionAnalytics.max }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  O'rtacha:
                  <strong class="font-semibold text-foreground">{{ applicationReportSelectionAnalytics.average.toFixed(1) }}</strong>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                class="h-8 shrink-0"
                @click="clearApplicationReportCellSelection"
              >
                Tanlovni tozalash
              </Button>
            </div>

            <p
              v-else
              class="text-sm text-muted-foreground"
            >
              Analitika uchun jadvaldagi raqamni bosing. Davom ettirish uchun Ctrl + click ishlating.
            </p>
          </div>
        </div>
      </div>
    </template>

    <SectionBlock
      v-else
      :title="page.sectionTitle ?? page.title"
      :description="page.sectionDescription"
    >
      <EmptyState
        title="Content will be added here later"
        description="This module is prepared for future implementation."
      />
    </SectionBlock>
  </PageContainer>
</template>
