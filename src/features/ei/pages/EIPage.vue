<script lang="ts">
import { ref as moduleRef } from 'vue'
import type { EiRecord as EiDraftRecord } from '@/features/ei/data'

const providerApplicationDrafts = moduleRef<EiDraftRecord[]>([])
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Building2, CalendarDays, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Ellipsis, ExternalLink, Eye, FilePenLine, FileText, History, LandPlot, Map, Plus, RotateCcw, Search, Send, Table2, UserCheck, UserRound } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import {
  buildEiStatusTabs,
  eiStatusClasses,
  getEiDashboardRecords,
  getEiRecords,
  type EiRecord,
} from '@/features/ei/data'
import PageContainer from '@/shared/components/PageContainer.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import StatusTabs from '@/shared/components/StatusTabs.vue'
import FilterPopover from '@/shared/components/FilterPopover.vue'
import FilterSelect from '@/shared/components/FilterSelect.vue'
import FilterDateInput from '@/shared/components/FilterDateInput.vue'
import YandexMap from '@/shared/components/YandexMap.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { cn } from '@/shared/lib/utils'
import applicantManPhoto from '@/assets/applicant-man.png'
import applicantWomanPhoto from '@/assets/applicant-woman.png'

const props = withDefaults(defineProps<{
  pageKey?: string
}>(), {
  pageKey: 'dashboard',
})
const router = useRouter()
const route = useRoute()

const rowsPerPageOptions = [20, 50, 100, 200, 500]
const editableConclusionStatuses = ['Yangi', 'Tahrirlangan', 'Qaytarilgan']
const providerApplicationReportStatuses = ['Yangi', 'O‘rganilmoqda', 'Qabul qilingan', 'Rad etilgan']
const providerApplicationReportRegions = [
  'Qoraqalpog‘iston Respublikasi',
  'Andijon',
  'Buxoro',
  'Jizzax',
  'Qashqadaryo',
  'Navoiy',
  'Namangan',
  'Samarqand',
  'Surxondaryo',
  'Sirdaryo',
  'Toshkent viloyati',
  'Farg‘ona',
  'Xorazm',
  'Toshkent shahri',
]
const providerApplicationWhitelistedPinfl = '11111111111111'
const providerApplicationBlacklistedPinfl = '00000000000000'
const providerApplicationWhitelistedTin = '111111111'
const providerApplicationBlacklistedTin = '000000000'
const providerApplicationAddressOptions: Record<string, Record<string, string[]>> = {
  'Toshkent shahri': {
    'Yunusobod': ['Bog‘ishamol MFY', 'Minor MFY', 'Oqtepa MFY'],
    'Mirzo Ulug‘bek': ['Buyuk Ipak Yo‘li MFY', 'Qorasuv MFY', 'Olimlar MFY'],
    'Shayxontohur': ['Labzak MFY', 'Gulobod MFY', 'Kamolon MFY'],
  },
  'Samarqand': {
    'Samarqand shahri': ['Universitet MFY', 'Registon MFY', 'Bog‘bon MFY'],
    'Kattaqo‘rg‘on': ['Yangiobod MFY', 'Do‘stlik MFY', 'Oq oltin MFY'],
  },
  'Farg‘ona': {
    'Qo‘qon': ['Istiqlol MFY', 'Turon MFY', 'Navbahor MFY'],
    'Marg‘ilon': ['Yuksalish MFY', 'Saxovat MFY', 'Atlas MFY'],
  },
}
const providerApplicationRegionOptions = Object.keys(providerApplicationAddressOptions)

type ProviderApplicationApplicantLookup = {
  fullName: string
  birthDate: string
  gender: string
  photo: string
}

type ProviderApplicationBusinessLookup = {
  organizationName: string
  director: string
  registeredAt: string
  activityType: string
  status: string
  region: string
  district: string
  mahalla: string
  address: string
}

type EiDetailField = {
  label: string
  value: string
  kind?: string
}

type ChildApplicationViewMode = 'sections' | 'tabs'
type ChildApplicationDetailTab = 'main' | 'basis' | 'process' | 'history'
type ProviderApplicationDetailTab = 'main' | 'conclusion' | 'history'

const providerApplicationRequirements = [
  "Davolovchi jismoniy tarbiya yo'riqchisi va maxsus pedagogik ma'lumotga ega mutaxassis (maxsus pedagog, defektolog, logoped, tiflopedagog, surdopedagog, oligofrenopedagog) faoliyati tashkil etilganligi",
  "Individual va guruhli mashg'ulotlar o'tkazishni tashkil etish uchun xonalar mavjudligi",
  'Xonalarda jihoz va buyumlar mavjudligi',
  'Xonalar, jihoz va buyumlarning minimal talablarga javob berishi',
]

const providerApplicationApplicantsByPinfl: Record<string, ProviderApplicationApplicantLookup> = {
  '11111111111111': {
    fullName: 'Aliyev Ali Akmal ogli',
    birthDate: '1991-01-11',
    gender: 'Erkak',
    photo: applicantManPhoto,
  },
  '30401876543210': {
    fullName: 'Rahimov Abror Anvar o‘g‘li',
    birthDate: '1990-04-01',
    gender: 'Erkak',
    photo: applicantManPhoto,
  },
  '40502876543211': {
    fullName: 'Madaminova Dilfuza Karimovna',
    birthDate: '1988-05-12',
    gender: 'Ayol',
    photo: applicantWomanPhoto,
  },
  '30603876543212': {
    fullName: 'Abdullayev Javlon Bahodir o‘g‘li',
    birthDate: '1992-03-18',
    gender: 'Erkak',
    photo: applicantManPhoto,
  },
}

const providerApplicationBusinessesByTin: Record<string, ProviderApplicationBusinessLookup> = {
  '111111111': {
    organizationName: 'Whitelist Reabilitatsiya MCHJ',
    director: 'Aliyev Ali Akmal ogli',
    registeredAt: '2021-01-11',
    activityType: 'Erta aralashuv va reabilitatsiya xizmatlari',
    status: 'Faol',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    mahalla: 'Minor MFY',
    address: 'Yunusobod tumani, 11-mavze, 11-uy',
  },
  '309845672': {
    organizationName: 'Mehrli Qadam MCHJ',
    director: 'Rahimov Abror Anvar o‘g‘li',
    registeredAt: '2021-09-14',
    activityType: 'Reabilitatsiya va korreksion pedagogik xizmatlar',
    status: 'Faol',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    mahalla: 'Bog‘ishamol MFY',
    address: 'Yunusobod tumani, 7-mavze, 12-uy',
  },
  '302471895': {
    organizationName: 'Kelajak Reabilitatsiya NNT',
    director: 'Madaminova Dilfuza Karimovna',
    registeredAt: '2020-02-21',
    activityType: 'Nodavlat notijorat reabilitatsiya xizmati',
    status: 'Faol',
    region: 'Samarqand',
    district: 'Samarqand shahri',
    mahalla: 'Universitet MFY',
    address: 'Universitet xiyoboni, 18-uy',
  },
  '614923780': {
    organizationName: 'Bolajon Terapiya Markazi',
    director: 'Abdullayev Javlon Bahodir o‘g‘li',
    registeredAt: '2022-07-05',
    activityType: 'Yakka tartibdagi pedagogik va terapiya xizmatlari',
    status: 'Faol',
    region: 'Farg‘ona',
    district: 'Qo‘qon',
    mahalla: 'Istiqlol MFY',
    address: 'Istiqlol ko‘chasi, 24-uy',
  },
}
const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'EA-ATT-2026-0001',
    date: '2026-06-02',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    provider: 'MEHRLI QADAM MCHJ',
    tin: '309845672',
    childName: 'Karimova Madina Dilshod qizi',
    childPinfl: '51302876543212',
    applicantName: 'Karimov Dilshod Bahrom ogli',
    applicantPinfl: '41302876543213',
    plannedTime: '09:00-11:00',
    arrivedAt: '09:03',
    leftAt: '11:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0002',
    date: '2026-06-02',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    provider: 'MEHRLI QADAM MCHJ',
    tin: '309845672',
    childName: 'Nazarov Diyorbek Dilshod ogli',
    childPinfl: '51403876543214',
    applicantName: 'Nazarova Shahnoza Ilhomovna',
    applicantPinfl: '41403876543215',
    plannedTime: '11:30-13:30',
    arrivedAt: '',
    leftAt: '',
    hours: 0,
    status: 'Kelmadi',
    calculationStatus: 'Hisoblanmaydi',
    biometricStatus: 'Qayd etilmadi',
    geoStatus: 'Qayd etilmadi',
  },
  {
    id: 'EA-ATT-2026-0003',
    date: '2026-06-05',
    region: 'Samarqand',
    district: 'Samarqand shahri',
    provider: 'KELAJAK REABILITATSIYA NNT',
    tin: '302471895',
    childName: 'Saidova Muslima Akmal qizi',
    childPinfl: '51504876543216',
    applicantName: 'Saidov Akmal Olimovich',
    applicantPinfl: '41504876543217',
    plannedTime: '10:00-12:00',
    arrivedAt: '10:18',
    leftAt: '12:05',
    hours: 2,
    status: 'Kechikdi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0004',
    date: '2026-06-05',
    region: 'Samarqand',
    district: 'Samarqand shahri',
    provider: 'KELAJAK REABILITATSIYA NNT',
    tin: '302471895',
    childName: 'Raxmonov Azizbek Jamshid ogli',
    childPinfl: '51605876543218',
    applicantName: 'Raxmonova Mohira Jamshidovna',
    applicantPinfl: '41605876543219',
    plannedTime: '14:00-16:00',
    arrivedAt: '14:01',
    leftAt: '16:10',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Limitdan tashqari',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0005',
    date: '2026-06-11',
    region: 'Farg‘ona',
    district: 'Qo‘qon',
    provider: 'BOLAJON TERAPIYA MARKAZI',
    tin: '614923780',
    childName: 'Tursunova Maftuna Ravshan qizi',
    childPinfl: '51706876543210',
    applicantName: 'Tursunov Ravshan Komilovich',
    applicantPinfl: '41706876543211',
    plannedTime: '09:30-11:30',
    arrivedAt: '09:32',
    leftAt: '11:28',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0006',
    date: '2026-06-11',
    region: 'Farg‘ona',
    district: 'Qo‘qon',
    provider: 'BOLAJON TERAPIYA MARKAZI',
    tin: '614923780',
    childName: 'Abdullayev Sardor Javlon ogli',
    childPinfl: '51807876543212',
    applicantName: 'Abdullayeva Dilnoza Hamidovna',
    applicantPinfl: '41807876543213',
    plannedTime: '12:00-14:00',
    arrivedAt: '12:00',
    leftAt: '13:50',
    hours: 2,
    status: 'Tasdiqlanmagan',
    calculationStatus: 'Biometrik tasdiqlanmagan',
    biometricStatus: 'Xatolik',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0007',
    date: '2026-06-18',
    region: 'Toshkent shahri',
    district: 'Mirzo Ulug‘bek',
    provider: 'YUKSALISH BOLALAR MARKAZI',
    tin: '301582746',
    childName: 'Murodova Zilola Shavkat qizi',
    childPinfl: '51908876543214',
    applicantName: 'Murodov Shavkat Baxtiyorovich',
    applicantPinfl: '41908876543215',
    plannedTime: '15:00-17:00',
    arrivedAt: '15:05',
    leftAt: '17:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0008',
    date: '2026-06-18',
    region: 'Toshkent shahri',
    district: 'Mirzo Ulug‘bek',
    provider: 'YUKSALISH BOLALAR MARKAZI',
    tin: '301582746',
    childName: 'Qodirov Jasur Bekzod ogli',
    childPinfl: '52009876543216',
    applicantName: 'Qodirova Nargiza Ilhomovna',
    applicantPinfl: '42009876543217',
    plannedTime: '17:00-19:00',
    arrivedAt: '17:02',
    leftAt: '19:01',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Geolokatsiya mos emas',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos emas',
  },
  {
    id: 'EA-ATT-2026-0009',
    date: '2026-06-24',
    region: 'Samarqand',
    district: 'Kattaqo‘rg‘on',
    provider: 'IMKON TERAPIYA NNT',
    tin: '305914628',
    childName: 'Eshonqulova Sevinch Farrux qizi',
    childPinfl: '52110876543218',
    applicantName: 'Eshonqulov Farrux Olimovich',
    applicantPinfl: '42110876543219',
    plannedTime: '09:00-11:00',
    arrivedAt: '09:00',
    leftAt: '11:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0010',
    date: '2026-07-01',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    provider: 'MEHRLI QADAM MCHJ',
    tin: '309845672',
    childName: 'Karimova Madina Dilshod qizi',
    childPinfl: '51302876543212',
    applicantName: 'Karimov Dilshod Bahrom ogli',
    applicantPinfl: '41302876543213',
    plannedTime: '09:00-11:00',
    arrivedAt: '09:01',
    leftAt: '11:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0011',
    date: '2026-07-01',
    region: 'Toshkent shahri',
    district: 'Yunusobod',
    provider: 'MEHRLI QADAM MCHJ',
    tin: '309845672',
    childName: 'Nazarov Diyorbek Dilshod ogli',
    childPinfl: '51403876543214',
    applicantName: 'Nazarova Shahnoza Ilhomovna',
    applicantPinfl: '41403876543215',
    plannedTime: '11:30-13:30',
    arrivedAt: '',
    leftAt: '',
    hours: 0,
    status: 'Kelmadi',
    calculationStatus: 'Hisoblanmaydi',
    biometricStatus: 'Qayd etilmadi',
    geoStatus: 'Qayd etilmadi',
  },
  {
    id: 'EA-ATT-2026-0012',
    date: '2026-07-03',
    region: 'Samarqand',
    district: 'Samarqand shahri',
    provider: 'KELAJAK REABILITATSIYA NNT',
    tin: '302471895',
    childName: 'Saidova Muslima Akmal qizi',
    childPinfl: '51504876543216',
    applicantName: 'Saidov Akmal Olimovich',
    applicantPinfl: '41504876543217',
    plannedTime: '10:00-12:00',
    arrivedAt: '10:12',
    leftAt: '12:00',
    hours: 2,
    status: 'Kechikdi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0013',
    date: '2026-07-08',
    region: 'Farg‘ona',
    district: 'Qo‘qon',
    provider: 'BOLAJON TERAPIYA MARKAZI',
    tin: '614923780',
    childName: 'Tursunova Maftuna Ravshan qizi',
    childPinfl: '51706876543210',
    applicantName: 'Tursunov Ravshan Komilovich',
    applicantPinfl: '41706876543211',
    plannedTime: '09:30-11:30',
    arrivedAt: '09:30',
    leftAt: '11:25',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0014',
    date: '2026-07-08',
    region: 'Farg‘ona',
    district: 'Qo‘qon',
    provider: 'BOLAJON TERAPIYA MARKAZI',
    tin: '614923780',
    childName: 'Abdullayev Sardor Javlon ogli',
    childPinfl: '51807876543212',
    applicantName: 'Abdullayeva Dilnoza Hamidovna',
    applicantPinfl: '41807876543213',
    plannedTime: '12:00-14:00',
    arrivedAt: '',
    leftAt: '',
    hours: 0,
    status: 'Kelmadi',
    calculationStatus: 'Hisoblanmaydi',
    biometricStatus: 'Qayd etilmadi',
    geoStatus: 'Qayd etilmadi',
  },
  {
    id: 'EA-ATT-2026-0015',
    date: '2026-07-15',
    region: 'Toshkent shahri',
    district: 'Mirzo Ulug‘bek',
    provider: 'YUKSALISH BOLALAR MARKAZI',
    tin: '301582746',
    childName: 'Murodova Zilola Shavkat qizi',
    childPinfl: '51908876543214',
    applicantName: 'Murodov Shavkat Baxtiyorovich',
    applicantPinfl: '41908876543215',
    plannedTime: '15:00-17:00',
    arrivedAt: '15:00',
    leftAt: '17:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
  {
    id: 'EA-ATT-2026-0016',
    date: '2026-07-22',
    region: 'Samarqand',
    district: 'Kattaqo‘rg‘on',
    provider: 'IMKON TERAPIYA NNT',
    tin: '305914628',
    childName: 'Eshonqulova Sevinch Farrux qizi',
    childPinfl: '52110876543218',
    applicantName: 'Eshonqulov Farrux Olimovich',
    applicantPinfl: '42110876543219',
    plannedTime: '09:00-11:00',
    arrivedAt: '09:04',
    leftAt: '11:00',
    hours: 2,
    status: 'Keldi',
    calculationStatus: 'Hisoblanadi',
    biometricStatus: 'Tasdiqlandi',
    geoStatus: 'Mos',
  },
]

const searchQuery = ref('')
const selectedStatuses = ref<string[]>([])
const selectedProviderConclusionResult = ref('')
const selectedProviderRegion = ref('')
const selectedProviderDistrict = ref('')
const providerApplicationsStartDate = ref('')
const providerApplicationsEndDate = ref('')
const draftProviderConclusionResult = ref('')
const draftProviderRegion = ref('')
const draftProviderDistrict = ref('')
const draftProviderApplicationsStartDate = ref('')
const draftProviderApplicationsEndDate = ref('')
const providerApplicationReportStartDate = ref('')
const providerApplicationReportEndDate = ref('')
const draftProviderApplicationReportStartDate = ref('')
const draftProviderApplicationReportEndDate = ref('')
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const isRowsPerPageOpen = ref(false)
const isProviderApplicationsFilterOpen = ref(false)
const isProviderApplicationReportFilterOpen = ref(false)
const openActionMenuId = ref<string | null>(null)
const isExportingRecords = ref(false)
const childApplicationStatusOverrides = ref<Record<string, {
  status: string
  tone: EiRecord['tone']
  nextAction: string
  historyLabel: string
}>>({})
const selectedProviderApplicationReportRegion = ref('')
const selectedProviderApplicationReportCells = ref<Record<string, {
  label: string
  value: number
}>>({})
const isProviderApplicationReportCellDragging = ref(false)
const suppressNextProviderApplicationReportCellClick = ref(false)
const providerApplicationReportCellDragStart = ref<ProviderApplicationReportCellSelection | null>(null)
const providerApplicationReportCellDragAppend = ref(false)
const providerApplicationReportCellDragVisitedKeys = ref<Set<string>>(new Set())
const selectedAttendanceMonth = ref(toInputDate().slice(0, 7))
const selectedAttendanceRegion = ref('')
const selectedAttendanceProvider = ref('')
const selectedAttendanceDay = ref(toInputDate())
const selectedAttendanceListTab = ref<AttendanceListTab>('all')
const attendanceViewMode = ref<AttendanceViewMode>('calendar')
const attendanceScopeLevel = ref<AttendanceScopeLevel>('republic')
const childApplicationViewMode = ref<ChildApplicationViewMode>('sections')
const selectedChildApplicationDetailTab = ref<ChildApplicationDetailTab>('main')
const selectedProviderApplicationDetailTab = ref<ProviderApplicationDetailTab>('main')

type ProviderApplicationForm = {
  applicantFullName: string
  applicantPinfl: string
  applicantBirthDate: string
  applicantGender: string
  applicantPhoto: string
  applicantAddressRegion: string
  applicantAddressDistrict: string
  applicantAddressMahalla: string
  applicantAddressFull: string
  organizationName: string
  tin: string
  organizationDirector: string
  organizationRegisteredAt: string
  organizationActivityType: string
  organizationStatus: string
  organizationRegion: string
  organizationDistrict: string
  organizationMahalla: string
  organizationAddress: string
  owner: string
  submittedAt: string
  summary: string
}

type ProviderApplicationFormErrors = Partial<Record<keyof ProviderApplicationForm, string>>
type ProviderApplicationInfoRow = {
  label: string
  value: string
  kind?: 'status'
}
type ProviderApplicationReportRow = {
  region: string
  total: number
  statuses: Record<string, number>
  isTotal?: boolean
}
type ProviderApplicationReportCellSelection = {
  row: string
  group: string
  label: string
  value: number
}
type AttendanceStatus = 'Keldi' | 'Kelmadi' | 'Kechikdi' | 'Tasdiqlanmagan'
type AttendanceCalculationStatus = 'Hisoblanadi' | 'Hisoblanmaydi' | 'Limitdan tashqari' | 'Biometrik tasdiqlanmagan' | 'Geolokatsiya mos emas'
type AttendanceListTab = 'all' | 'present' | 'absent'
type AttendanceViewMode = 'calendar' | 'timesheet'
type AttendanceScopeLevel = 'republic' | 'region' | 'provider'
type AttendanceTimesheetTone = 'success' | 'info' | 'warning' | 'danger'
type AttendanceMetrics = {
  planned: number
  plannedHours: number
  actualHours: number
  varianceHours: number
  billableHours: number
  present: number
  absent: number
  late: number
  issues: number
  completionRate: number
  attendanceRate: number
  uniqueBeneficiaries: number
  providers: number
}
type AttendanceRecord = {
  id: string
  date: string
  region: string
  district: string
  provider: string
  tin: string
  childName: string
  childPinfl: string
  applicantName: string
  applicantPinfl: string
  plannedTime: string
  arrivedAt: string
  leftAt: string
  hours: number
  status: AttendanceStatus
  calculationStatus: AttendanceCalculationStatus
  biometricStatus: string
  geoStatus: string
}
type AttendanceTimesheetEntry = {
  date: string
  hours: number
  plannedHours: number
  billableHours: number
  planned: number
  present: number
  absent: number
  late: number
  issues: number
  completionRate: number
  tone: AttendanceTimesheetTone
}
type AttendanceTimesheetRow = {
  key: string
  label: string
  meta: string
  region: string
  provider: string
  records: AttendanceRecord[]
  entries: Record<number, AttendanceTimesheetEntry>
  plannedHours: number
  actualHours: number
  varianceHours: number
  billableHours: number
  completionRate: number
  present: number
  absent: number
  late: number
  issues: number
}
const attendanceScopeOptions: Array<{ value: AttendanceScopeLevel; label: string }> = [
  { value: 'republic', label: 'Respublika' },
  { value: 'region', label: 'Hudud' },
  { value: 'provider', label: 'Tadbirkor' },
]

function toInputDate(value = new Date()) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`)
  date.setDate(date.getDate() + days)

  return toInputDate(date)
}

function getDefaultProviderApplicationForm(): ProviderApplicationForm {
  return {
    applicantFullName: '',
    applicantPinfl: '',
    applicantBirthDate: '',
    applicantGender: '',
    applicantPhoto: '',
    applicantAddressRegion: '',
    applicantAddressDistrict: '',
    applicantAddressMahalla: '',
    applicantAddressFull: '',
    organizationName: '',
    tin: '',
    organizationDirector: '',
    organizationRegisteredAt: '',
    organizationActivityType: '',
    organizationStatus: '',
    organizationRegion: '',
    organizationDistrict: '',
    organizationMahalla: '',
    organizationAddress: '',
    owner: 'Ishchi guruh',
    submittedAt: toInputDate(),
    summary: '',
  }
}

const providerApplicationForm = ref<ProviderApplicationForm>(getDefaultProviderApplicationForm())
const providerApplicationFormErrors = ref<ProviderApplicationFormErrors>({})

const isProviderApplicationApplicantFound = computed(() => {
  const form = providerApplicationForm.value

  return Boolean(
    form.applicantFullName.trim()
    && form.applicantBirthDate
    && form.applicantGender
    && form.applicantPhoto,
  )
})
const isProviderApplicationAddressComplete = computed(() => {
  const form = providerApplicationForm.value

  return Boolean(
    form.applicantAddressRegion.trim()
    && form.applicantAddressDistrict.trim()
    && form.applicantAddressMahalla.trim()
    && form.applicantAddressFull.trim(),
  )
})
const isProviderApplicationBusinessFound = computed(() => {
  const form = providerApplicationForm.value

  return Boolean(
    form.organizationName.trim()
    && form.organizationDirector.trim()
    && form.organizationRegisteredAt
    && form.organizationActivityType.trim()
    && form.organizationStatus.trim(),
  )
})
const isProviderApplicationReadyToSave = computed(() => {
  return Boolean(
    isProviderApplicationApplicantFound.value
    && isProviderApplicationAddressComplete.value
    && isProviderApplicationBusinessFound.value
    && providerApplicationForm.value.submittedAt,
  )
})
const providerApplicationDistrictOptions = computed(() => {
  return Object.keys(providerApplicationAddressOptions[providerApplicationForm.value.applicantAddressRegion] ?? {})
})
const providerApplicationMahallaOptions = computed(() => {
  const regionOptions = providerApplicationAddressOptions[providerApplicationForm.value.applicantAddressRegion] ?? {}

  return regionOptions[providerApplicationForm.value.applicantAddressDistrict] ?? []
})
const providerApplicationApplicantRows = computed<Array<[string, string]>>(() => {
  const form = providerApplicationForm.value

  return [
    ['FIO', form.applicantFullName ? formatName(form.applicantFullName) : '-'],
    ['JSHSHIR', form.applicantPinfl || '-'],
    ['Tug‘ilgan sana', form.applicantBirthDate ? formatDate(form.applicantBirthDate) : '-'],
    ['Jinsi', form.applicantGender || '-'],
  ]
})
const providerApplicationBusinessRows = computed<ProviderApplicationInfoRow[]>(() => {
  const form = providerApplicationForm.value

  return [
    { label: 'Tadbirkorlik subyekti nomi', value: form.organizationName ? formatName(form.organizationName) : '-' },
    { label: 'STIR', value: form.tin || '-' },
    { label: 'Direktori', value: form.organizationDirector ? formatName(form.organizationDirector) : '-' },
    { label: 'Ro‘yxatdan o‘tkazilgan sanasi', value: form.organizationRegisteredAt ? formatDate(form.organizationRegisteredAt) : '-' },
    { label: 'Faoliyat turi', value: form.organizationActivityType || '-' },
    { label: 'Holati', value: form.organizationStatus || '-', kind: 'status' },
    {
      label: 'Manzil',
      value: formatProviderAddress(
        form.organizationRegion,
        form.organizationDistrict,
        form.organizationMahalla,
        form.organizationAddress,
      ) || '-',
    },
  ]
})

const isProvidersApplicationsPage = computed(() => props.pageKey === 'providers-applications')
const isProvidersApplicationsReportPage = computed(() => props.pageKey === 'providers-applications-report')
const isProvidersApplicationsCreatePage = computed(() => props.pageKey === 'providers-applications-create')
const isProvidersApplicationViewPage = computed(() => props.pageKey === 'providers-application-view')
const isProvidersConclusionsPage = computed(() => props.pageKey === 'providers-conclusions')
const isProvidersRegistryPage = computed(() => props.pageKey === 'providers-registry')
const isChildrenApplicationsPage = computed(() => props.pageKey === 'children-questionnaires')
const isChildrenApplicationViewPage = computed(() => props.pageKey === 'children-application-view')
const isChildrenVouchersPage = computed(() => props.pageKey === 'children-vouchers')
const isChildrenOrdersPage = computed(() => props.pageKey === 'children-orders')
const usesProviderFilter = computed(() => (
  isProvidersApplicationsPage.value || isProvidersConclusionsPage.value || isProvidersRegistryPage.value
))
const usesProviderApplicationsTable = computed(() => (
  isProvidersApplicationsPage.value || isProvidersConclusionsPage.value || isProvidersRegistryPage.value
))
const usesChildrenApplicationsTable = computed(() => (
  isChildrenApplicationsPage.value || isChildrenVouchersPage.value || isChildrenOrdersPage.value
))
const isServiceAttendancePage = computed(() => props.pageKey === 'service-attendance')
const isServiceAttendanceDayPage = computed(() => props.pageKey === 'service-attendance-day')
const pageRecords = computed(() => {
  if (props.pageKey === 'dashboard') {
    return getEiDashboardRecords()
  }

  const records = getEiRecords(props.pageKey)

  if (props.pageKey === 'providers-applications') {
    return [...providerApplicationDrafts.value, ...records]
  }

  if (props.pageKey === 'children-questionnaires' || props.pageKey === 'children-vouchers') {
    return records.map((record) => applyChildApplicationStatusOverride(record))
  }

  return records
})
const providerApplicationRecords = computed(() => [
  ...providerApplicationDrafts.value,
  ...getEiRecords('providers-applications'),
])
const selectedProviderApplicationId = computed(() => String(route.params.id ?? ''))
const selectedProviderApplication = computed(() => (
  providerApplicationRecords.value.find((record) => record.id === selectedProviderApplicationId.value)
))
const selectedProviderApplicationDetail = computed(() => (
  selectedProviderApplication.value ? getProviderApplicationDetail(selectedProviderApplication.value) : null
))
const selectedProviderApplicationConclusion = computed(() => {
  if (!selectedProviderApplication.value) {
    return null
  }

  return getEiRecords('providers-conclusions').find((record) => (
    record.tin === selectedProviderApplication.value?.tin
  )) ?? null
})
const selectedProviderApplicationConclusionFields = computed<EiDetailField[]>(() => {
  const conclusion = selectedProviderApplicationConclusion.value

  if (!conclusion) {
    return []
  }

  const result = conclusion.result || getMetadataValue(conclusion, 'Xulosa turi') || '-'
  return [
    { label: 'ID', value: conclusion.id },
    { label: 'Sana', value: formatDate(conclusion.submittedAt) },
    { label: 'Natija', value: result, kind: result === 'Ijobiy' ? 'success' : result === 'Salbiy' ? 'danger' : 'neutral' },
    { label: 'Holat', value: conclusion.status, kind: 'status' },
  ]
})
const selectedProviderApplicationRequirementResults = computed(() => {
  const conclusion = selectedProviderApplicationConclusion.value
  const result = conclusion
    ? conclusion.result || getMetadataValue(conclusion, 'Xulosa turi')
    : ''

  return providerApplicationRequirements.map((label, index) => {
    const savedResult = conclusion ? getMetadataValue(conclusion, `Talab ${index + 1}`) : ''

    return {
      label,
      isMet: savedResult
        ? savedResult === 'Javob beradi'
        : result === 'Ijobiy' || (result === 'Salbiy' && [1, 2].includes(index)),
    }
  })
})
const selectedProviderApplicationHistory = computed(() => {
  const application = selectedProviderApplication.value

  if (!application) {
    return []
  }

  const applicationHistory = application.history.map((item, index) => ({
    ...item,
    actor: index === 0 ? getApplicantName(application) : application.owner,
  }))
  const conclusionHistory = selectedProviderApplicationConclusion.value?.history.map((item) => ({
    ...item,
    actor: selectedProviderApplicationConclusion.value?.owner || '-',
  })) ?? []

  return [...applicationHistory, ...conclusionHistory]
})
const childApplicationRecords = computed(() => (
  getEiRecords('children-questionnaires').map((record) => applyChildApplicationStatusOverride(record))
))
const selectedChildApplicationId = computed(() => String(route.params.id ?? ''))
const selectedChildApplication = computed(() => (
  childApplicationRecords.value.find((record) => record.id === selectedChildApplicationId.value)
))
const selectedChildApplicationDetail = computed(() => (
  selectedChildApplication.value ? getChildApplicationDetail(selectedChildApplication.value) : null
))
const selectedChildApplicationPersonSections = computed<Array<{
  key: string
  title: string
  data: {
    photo: string
    fields: EiDetailField[]
  }
}>>(() => {
  if (!selectedChildApplicationDetail.value) {
    return []
  }

  return [
    { key: 'applicant', title: 'Ariza beruvchi ma\'lumotlari', data: selectedChildApplicationDetail.value.applicant },
    { key: 'child', title: 'Xizmatdan foydalanuvchi ma\'lumotlari', data: selectedChildApplicationDetail.value.child },
  ]
})
const selectedChildApplicationLinkedSections = computed<Array<{
  key: string
  title: string
  fields: EiDetailField[]
}>>(() => {
  if (!selectedChildApplicationDetail.value) {
    return []
  }

  return [
    { key: 'provider', title: 'Tadbirkor ma\'lumotlari', fields: selectedChildApplicationDetail.value.provider },
    { key: 'voucher', title: 'Vaucher ma\'lumotlari', fields: selectedChildApplicationDetail.value.voucher },
    { key: 'order', title: 'Buyurtma ma\'lumotlari', fields: selectedChildApplicationDetail.value.order },
    { key: 'plan', title: 'Erta aralashuv rejasi', fields: selectedChildApplicationDetail.value.plan },
    { key: 'attendance', title: 'Davomat va xizmat ko\'rsatish ma\'lumotlari', fields: selectedChildApplicationDetail.value.attendance },
  ]
})
const selectedChildApplicationReceiverFields = computed<EiDetailField[]>(() => {
  const receiver = selectedChildApplicationDetail.value?.receiver

  if (!receiver) {
    return []
  }

  return [
    { label: 'Lavozim', value: receiver.position },
    { label: 'Telefon', value: receiver.phone },
  ]
})
const childApplicationDetailTabs = computed<Array<{
  value: ChildApplicationDetailTab
  label: string
  count: number
}>>(() => [
  { value: 'main', label: 'Asosiy', count: 4 },
  { value: 'basis', label: 'Asos hujjati', count: 1 },
  { value: 'process', label: 'Xizmat jarayoni', count: selectedChildApplicationLinkedSections.value.length },
  { value: 'history', label: 'Hujjat tarixi', count: selectedChildApplicationDetail.value?.history.length ?? 0 },
])

function shouldShowChildApplicationTab(tab: ChildApplicationDetailTab) {
  return childApplicationViewMode.value === 'sections' || selectedChildApplicationDetailTab.value === tab
}
const providerApplicationReportRecords = computed(() => {
  const records = [
    ...providerApplicationDrafts.value,
    ...getEiRecords('providers-applications'),
  ]

  return records.filter((record) => (
    isDateWithinRange(record.submittedAt, providerApplicationReportStartDate.value, providerApplicationReportEndDate.value)
  ))
})
function buildProviderApplicationReportRow(
  region: string,
  rowRecords: EiRecord[],
  isTotal = false,
): ProviderApplicationReportRow {
  return {
    region,
    total: rowRecords.length,
    isTotal,
    statuses: Object.fromEntries(
      providerApplicationReportStatuses.map((status) => [
        status,
        rowRecords.filter((record) => record.status === status).length,
      ]),
    ),
  }
}

const providerApplicationReportRows = computed<ProviderApplicationReportRow[]>(() => {
  const records = providerApplicationReportRecords.value

  return [
    buildProviderApplicationReportRow("Respublika bo'yicha jami", records, true),
    ...providerApplicationReportRegions.map((region) => (
      buildProviderApplicationReportRow(region, records.filter((record) => record.region === region))
    )),
  ]
})
const selectedProviderApplicationReportRegionRecords = computed(() => (
  providerApplicationReportRecords.value.filter((record) => record.region === selectedProviderApplicationReportRegion.value)
))
const selectedProviderApplicationReportRegionTotalRow = computed(() => (
  buildProviderApplicationReportRow(
    `${selectedProviderApplicationReportRegion.value} bo‘yicha jami`,
    selectedProviderApplicationReportRegionRecords.value,
    true,
  )
))
const providerApplicationReportDistrictRows = computed<ProviderApplicationReportRow[]>(() => {
  if (!selectedProviderApplicationReportRegion.value) {
    return []
  }

  const districtNames = [
    ...Object.keys(providerApplicationAddressOptions[selectedProviderApplicationReportRegion.value] ?? {}),
    ...selectedProviderApplicationReportRegionRecords.value.map((record) => record.district),
  ]
  const uniqueDistricts = [...new Set(districtNames)]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, 'uz-UZ'))

  return uniqueDistricts.map((district) => (
    buildProviderApplicationReportRow(
      district,
      selectedProviderApplicationReportRegionRecords.value.filter((record) => record.district === district),
    )
  ))
})
const providerApplicationReportDisplayRows = computed<ProviderApplicationReportRow[]>(() => (
  selectedProviderApplicationReportRegion.value
    ? [
        selectedProviderApplicationReportRegionTotalRow.value,
        ...providerApplicationReportDistrictRows.value,
      ]
    : providerApplicationReportRows.value
))
const providerApplicationReportFirstColumnLabel = computed(() => (
  selectedProviderApplicationReportRegion.value ? 'Tuman (shahar)' : 'Hudud'
))
const selectedProviderApplicationReportCellValues = computed(() => Object.values(selectedProviderApplicationReportCells.value))
const providerApplicationReportSelectionAnalytics = computed(() => {
  const values = selectedProviderApplicationReportCellValues.value.map((cell) => cell.value)

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
const activeProviderApplicationReportFilterCount = computed(() => {
  return [
    providerApplicationReportStartDate.value,
    providerApplicationReportEndDate.value,
  ].filter(Boolean).length
})
const hasPendingProviderApplicationReportFilterChanges = computed(() => (
  draftProviderApplicationReportStartDate.value !== providerApplicationReportStartDate.value
  || draftProviderApplicationReportEndDate.value !== providerApplicationReportEndDate.value
))
const attendanceRegionOptions = computed(() => (
  [...new Set(attendanceRecords.map((record) => record.region))]
    .sort((left, right) => left.localeCompare(right, 'uz-UZ'))
))
const attendanceProviderOptions = computed(() => (
  [...new Set(
    attendanceRecords
      .filter((record) => !selectedAttendanceRegion.value || record.region === selectedAttendanceRegion.value)
      .map((record) => record.provider),
  )].sort((left, right) => left.localeCompare(right, 'uz-UZ'))
))
const attendanceScopeLabel = computed(() => {
  if (attendanceScopeLevel.value === 'provider') {
    return selectedAttendanceProvider.value || 'Tadbirkor tanlanmagan'
  }

  if (attendanceScopeLevel.value === 'region') {
    return selectedAttendanceRegion.value || 'Hudud tanlanmagan'
  }

  return 'O‘zbekiston Respublikasi'
})
const attendanceTimesheetFirstColumnLabel = computed(() => {
  if (attendanceScopeLevel.value === 'republic') {
    return 'Hudud'
  }

  if (attendanceScopeLevel.value === 'region') {
    return 'Tadbirkor'
  }

  return 'Xizmat oluvchi'
})
const attendanceTimesheetTitle = computed(() => {
  if (attendanceScopeLevel.value === 'republic') {
    return 'Respublika bo‘yicha oylik davomat tabeli'
  }

  if (attendanceScopeLevel.value === 'region') {
    return `${selectedAttendanceRegion.value || 'Hudud'} bo‘yicha oylik davomat tabeli`
  }

  return `${selectedAttendanceProvider.value || 'Tadbirkor'} bo‘yicha oylik davomat tabeli`
})
const filteredAttendanceRecords = computed(() => {
  const monthPrefix = selectedAttendanceMonth.value

  return attendanceRecords.filter((record) => {
    const matchesMonth = record.date.startsWith(monthPrefix)

    return matchesMonth && isAttendanceRecordInScope(record)
  })
})
const attendanceCalendarDays = computed(() => {
  const { year, month } = parseAttendanceMonth(selectedAttendanceMonth.value)
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const leadingBlankCount = (firstDay.getDay() + 6) % 7
  const days: Array<{
    key: string
    date: string
    day: number
    isBlank: boolean
    planned: number
    present: number
    absent: number
    hours: number
    plannedHours: number
    billableHours: number
    late: number
    issues: number
    completionRate: number
  }> = []

  for (let index = 0; index < leadingBlankCount; index += 1) {
    days.push({
      key: `blank-${index}`,
      date: '',
      day: 0,
      isBlank: true,
      planned: 0,
      present: 0,
      absent: 0,
      hours: 0,
      plannedHours: 0,
      billableHours: 0,
      late: 0,
      issues: 0,
      completionRate: 0,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${selectedAttendanceMonth.value}-${String(day).padStart(2, '0')}`
    const records = filteredAttendanceRecords.value.filter((record) => record.date === date)

    const metrics = buildAttendanceMetrics(records)

    days.push({
      key: date,
      date,
      day,
      isBlank: false,
      planned: metrics.planned,
      present: metrics.present,
      absent: metrics.absent,
      hours: metrics.actualHours,
      plannedHours: metrics.plannedHours,
      billableHours: metrics.billableHours,
      late: metrics.late,
      issues: metrics.issues,
      completionRate: metrics.completionRate,
    })
  }

  return days
})
const attendanceSummary = computed(() => {
  return buildAttendanceMetrics(filteredAttendanceRecords.value)
})
const previousAttendanceSummary = computed(() => {
  const previousMonth = getAttendanceMonthKey(selectedAttendanceMonth.value, -1)
  const records = attendanceRecords.filter((record) => (
    record.date.startsWith(previousMonth)
    && isAttendanceRecordInScope(record)
  ))

  return buildAttendanceMetrics(records)
})
const attendanceCompletionTrend = computed(() => (
  previousAttendanceSummary.value.plannedHours > 0
    ? attendanceSummary.value.completionRate - previousAttendanceSummary.value.completionRate
    : null
))
const attendanceCompletionTrendLabel = computed(() => {
  const trend = attendanceCompletionTrend.value

  if (trend === null) {
    return 'Oldingi oy uchun ma’lumot yo‘q'
  }

  const prefix = trend > 0 ? '+' : ''
  const formattedTrend = trend.toLocaleString('uz-UZ', { maximumFractionDigits: 1 })
  return `Oldingi oyga nisbatan ${prefix}${formattedTrend} foiz punkt`
})
const attendanceMonthDays = computed(() => {
  const { year, month } = parseAttendanceMonth(selectedAttendanceMonth.value)
  const daysInMonth = new Date(year, month, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => index + 1)
})
const attendanceTimesheetRows = computed(() => {
  const rows = new globalThis.Map<string, Omit<AttendanceTimesheetRow, 'entries' | 'plannedHours' | 'actualHours' | 'varianceHours' | 'billableHours' | 'completionRate' | 'present' | 'absent' | 'late' | 'issues'>>()

  filteredAttendanceRecords.value.forEach((record) => {
    const key = attendanceScopeLevel.value === 'republic'
      ? record.region
      : attendanceScopeLevel.value === 'region'
        ? record.tin
        : `${record.childPinfl}-${record.tin}`
    const existing = rows.get(key)

    if (existing) {
      existing.records.push(record)
      return
    }

    rows.set(key, {
      key,
      label: attendanceScopeLevel.value === 'republic'
        ? record.region
        : attendanceScopeLevel.value === 'region'
          ? record.provider
          : formatName(record.childName),
      meta: attendanceScopeLevel.value === 'provider'
        ? `JSHSHIR: ${record.childPinfl}`
        : '',
      region: record.region,
      provider: record.provider,
      records: [record],
    })
  })

  return [...rows.values()]
    .map((row): AttendanceTimesheetRow => {
      const recordsByDay = new globalThis.Map<number, AttendanceRecord[]>()

      row.records.forEach((record) => {
        const day = Number(record.date.slice(-2))
        recordsByDay.set(day, [...(recordsByDay.get(day) ?? []), record])
      })

      if (attendanceScopeLevel.value === 'republic') {
        const providerCount = new Set(row.records.map((record) => record.tin)).size
        row.meta = `${providerCount} ta tadbirkor`
      } else if (attendanceScopeLevel.value === 'region') {
        row.meta = `STIR: ${row.records[0]?.tin ?? ''}`
      }

      return {
        ...row,
        entries: Object.fromEntries([...recordsByDay.entries()].map(([day, records]) => [
          day,
          buildAttendanceTimesheetEntry(records),
        ])) as Record<number, AttendanceTimesheetEntry>,
        ...buildAttendanceMetrics(row.records),
      }
    })
    .sort((left, right) => left.label.localeCompare(right.label, 'uz-UZ'))
})
const attendanceTimesheetDayTotals = computed(() => Object.fromEntries(
  attendanceMonthDays.value.map((day) => [
    day,
    filteredAttendanceRecords.value
      .filter((record) => Number(record.date.slice(-2)) === day)
      .reduce((total, record) => total + record.hours, 0),
  ]),
) as Record<number, number>)
const attendanceDayRouteDate = computed(() => {
  const date = Array.isArray(route.params.date) ? route.params.date[0] : route.params.date

  return /^\d{4}-\d{2}-\d{2}$/.test(date ?? '') ? String(date) : toInputDate()
})
const selectedAttendanceDayRecords = computed(() => (
  attendanceRecords.filter((record) => (
    record.date === attendanceDayRouteDate.value
    && isAttendanceRecordInScope(record)
  ))
))
const attendanceListTabs = computed(() => {
  const records = selectedAttendanceDayRecords.value

  return [
    { label: 'Barchasi', value: 'all' as const, count: records.length },
    {
      label: 'Kelganlar',
      value: 'present' as const,
      count: records.filter((record) => record.status === 'Keldi' || record.status === 'Kechikdi').length,
    },
    {
      label: 'Kelmaganlar',
      value: 'absent' as const,
      count: records.filter((record) => record.status === 'Kelmadi').length,
    },
  ]
})
const selectedAttendanceDayTableRecords = computed(() => {
  if (selectedAttendanceListTab.value === 'present') {
    return selectedAttendanceDayRecords.value.filter((record) => record.status === 'Keldi' || record.status === 'Kechikdi')
  }

  if (selectedAttendanceListTab.value === 'absent') {
    return selectedAttendanceDayRecords.value.filter((record) => record.status === 'Kelmadi')
  }

  return selectedAttendanceDayRecords.value
})
const statusTabs = computed(() => buildEiStatusTabs(pageRecords.value))
const providerConclusionResultFilterOptions = computed(() => {
  return [...new Set([
    'Ijobiy',
    'Salbiy',
    ...pageRecords.value.map((record) => getConclusionResult(record)).filter((value) => value !== '-'),
  ])].sort((left, right) => left.localeCompare(right, 'uz-UZ'))
})
const providerApplicationRegionFilterOptions = computed(() => {
  return [...new Set(pageRecords.value.map((record) => record.region))]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, 'uz-UZ'))
})
const providerApplicationDistrictFilterOptions = computed(() => {
  return [...new Set(
    pageRecords.value
      .filter((record) => !draftProviderRegion.value || record.region === draftProviderRegion.value)
      .map((record) => record.district),
  )]
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right, 'uz-UZ'))
})
const activeProviderApplicationFilterCount = computed(() => {
  const filters = [
    selectedProviderRegion.value,
    selectedProviderDistrict.value,
    providerApplicationsStartDate.value,
    providerApplicationsEndDate.value,
  ]

  if (isProvidersConclusionsPage.value) {
    filters.unshift(selectedProviderConclusionResult.value)
  }

  return filters.filter(Boolean).length
})
const hasPendingProviderApplicationFilterChanges = computed(() => (
  draftProviderConclusionResult.value !== selectedProviderConclusionResult.value
  || draftProviderRegion.value !== selectedProviderRegion.value
  || draftProviderDistrict.value !== selectedProviderDistrict.value
  || draftProviderApplicationsStartDate.value !== providerApplicationsStartDate.value
  || draftProviderApplicationsEndDate.value !== providerApplicationsEndDate.value
))
const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return pageRecords.value.filter((record) => {
    const matchesStatus = selectedStatuses.value.length === 0 || selectedStatuses.value.includes(record.status)
    const matchesQuery = !query || [
      record.id,
      record.applicant?.fullName ?? '',
      record.applicant?.pinfl ?? '',
      record.title,
      record.tin ?? '',
      record.subject,
      record.region,
      record.district,
      record.owner,
      record.status,
      record.result ?? '',
      record.nextAction,
    ].some((value) => value.toLowerCase().includes(query))
    const matchesProviderLocationFilters = !usesProviderFilter.value || (
      (!selectedProviderRegion.value || record.region === selectedProviderRegion.value)
      && (!selectedProviderDistrict.value || record.district === selectedProviderDistrict.value)
      && isDateWithinRange(record.submittedAt, providerApplicationsStartDate.value, providerApplicationsEndDate.value)
    )
    const matchesProviderConclusionFilters = !isProvidersConclusionsPage.value || (
      (!selectedProviderConclusionResult.value || getConclusionResult(record) === selectedProviderConclusionResult.value)
    )

    return matchesStatus && matchesQuery && matchesProviderLocationFilters && matchesProviderConclusionFilters
  })
})

const totalRows = computed(() => filteredRecords.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / selectedRowsPerPage.value)))
const paginatedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * selectedRowsPerPage.value

  return filteredRecords.value.slice(startIndex, startIndex + selectedRowsPerPage.value)
})
const paginationSummary = computed(() => {
  const start = totalRows.value === 0 ? 0 : (currentPage.value - 1) * selectedRowsPerPage.value + 1
  const end = Math.min(currentPage.value * selectedRowsPerPage.value, totalRows.value)

  return `${start}-${end} / ${totalRows.value}`
})
const currentPageSummary = computed(() => `${currentPage.value}/${totalPages.value}`)
const exportFileName = computed(() => `ei-${props.pageKey}-${toInputDate()}.xlsx`)

watch(() => props.pageKey, (nextPageKey, previousPageKey) => {
  searchQuery.value = ''
  selectedStatuses.value = []
  resetProviderApplicationFilters()
  isProviderApplicationsFilterOpen.value = false
  selectedProviderApplicationReportRegion.value = ''
  resetProviderApplicationReportFilters()
  isProviderApplicationReportFilterOpen.value = false
  clearProviderApplicationReportCellSelection()
  currentPage.value = 1
  if (nextPageKey === 'providers-applications-create' && previousPageKey !== 'providers-applications-create') {
    resetProviderApplicationForm()
  }
}, { immediate: true })

watch(isProviderApplicationsFilterOpen, (isOpen) => {
  if (isOpen) {
    syncProviderApplicationDraftFilters()
  }
})

watch(isProviderApplicationReportFilterOpen, (isOpen) => {
  if (isOpen) {
    syncProviderApplicationReportDraftFilters()
  }
})

watch(draftProviderRegion, () => {
  draftProviderDistrict.value = ''
})

watch(selectedAttendanceRegion, (region) => {
  if (!region && attendanceScopeLevel.value !== 'republic') {
    attendanceScopeLevel.value = 'republic'
  }

  if (!attendanceProviderOptions.value.includes(selectedAttendanceProvider.value)) {
    selectedAttendanceProvider.value = ''
  }
})

watch(selectedAttendanceProvider, (provider) => {
  if (!provider && attendanceScopeLevel.value === 'provider') {
    attendanceScopeLevel.value = selectedAttendanceRegion.value ? 'region' : 'republic'
  }
})

watch(selectedAttendanceMonth, (month) => {
  if (!selectedAttendanceDay.value.startsWith(month)) {
    selectedAttendanceDay.value = `${month}-01`
  }
})

watch(filteredRecords, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('keydown', handleProviderApplicationReportGlobalKeydown)
  window.addEventListener('mouseup', stopProviderApplicationReportCellDrag)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleProviderApplicationReportGlobalKeydown)
  window.removeEventListener('mouseup', stopProviderApplicationReportCellDrag)
})

function handleStatusSelect(value: string) {
  selectedStatuses.value = value === 'all' || selectedStatuses.value.includes(value)
    ? []
    : [value]
  currentPage.value = 1
}

function setRowsPerPageOpen(nextOpen: boolean) {
  isRowsPerPageOpen.value = nextOpen
}

function setActionMenuOpen(recordId: string, nextOpen: boolean) {
  openActionMenuId.value = nextOpen ? recordId : null
}

function closeActionMenu() {
  openActionMenuId.value = null
}

function getProviderApplicationReportCellKey(row: string, group: string, label: string) {
  return `${row}::${group}::${label}`
}

function isProviderApplicationReportCellSelected(row: string, group: string, label: string) {
  return Boolean(selectedProviderApplicationReportCells.value[getProviderApplicationReportCellKey(row, group, label)])
}

function clearProviderApplicationReportCellSelection() {
  selectedProviderApplicationReportCells.value = {}
}

function selectProviderApplicationReportCell(
  row: string,
  group: string,
  label: string,
  value: number,
  append = true,
) {
  const key = getProviderApplicationReportCellKey(row, group, label)
  selectedProviderApplicationReportCells.value = {
    ...(append ? selectedProviderApplicationReportCells.value : {}),
    [key]: {
      label: `${row} / ${label}`,
      value,
    },
  }
}

function toggleProviderApplicationReportCell(row: string, group: string, label: string, value: number) {
  const key = getProviderApplicationReportCellKey(row, group, label)
  const nextSelectedCells = { ...selectedProviderApplicationReportCells.value }

  if (nextSelectedCells[key]) {
    delete nextSelectedCells[key]
  }
  else {
    nextSelectedCells[key] = {
      label: `${row} / ${label}`,
      value,
    }
  }

  selectedProviderApplicationReportCells.value = nextSelectedCells
}

function handleProviderApplicationReportCellClick(
  event: MouseEvent,
  row: string,
  group: string,
  label: string,
  value: number,
) {
  event.preventDefault()

  if (suppressNextProviderApplicationReportCellClick.value) {
    suppressNextProviderApplicationReportCellClick.value = false
    return
  }

  const hasSelectedCells = selectedProviderApplicationReportCellValues.value.length > 0

  if (!event.ctrlKey && !event.metaKey) {
    selectProviderApplicationReportCell(row, group, label, value, false)
    return
  }

  if (!hasSelectedCells) {
    selectProviderApplicationReportCell(row, group, label, value, false)
    return
  }

  toggleProviderApplicationReportCell(row, group, label, value)
}

function handleProviderApplicationReportCellMouseDown(
  event: MouseEvent,
  row: string,
  group: string,
  label: string,
  value: number,
) {
  if (event.button !== 0) return
  const appendSelection = event.ctrlKey || event.metaKey
  const hasSelectedCells = selectedProviderApplicationReportCellValues.value.length > 0

  if (appendSelection && !hasSelectedCells) return

  event.preventDefault()
  isProviderApplicationReportCellDragging.value = true
  suppressNextProviderApplicationReportCellClick.value = appendSelection
  providerApplicationReportCellDragStart.value = { row, group, label, value }
  providerApplicationReportCellDragAppend.value = appendSelection
  providerApplicationReportCellDragVisitedKeys.value = new Set([getProviderApplicationReportCellKey(row, group, label)])

  if (appendSelection) {
    toggleProviderApplicationReportCell(row, group, label, value)
  }
  else {
    selectProviderApplicationReportCell(row, group, label, value, false)
  }
}

function handleProviderApplicationReportCellMouseEnter(row: string, group: string, label: string, value: number) {
  if (!isProviderApplicationReportCellDragging.value) return

  const startCell = providerApplicationReportCellDragStart.value
  if (startCell && !suppressNextProviderApplicationReportCellClick.value) {
    selectProviderApplicationReportCell(
      startCell.row,
      startCell.group,
      startCell.label,
      startCell.value,
      providerApplicationReportCellDragAppend.value,
    )
  }

  suppressNextProviderApplicationReportCellClick.value = true
  const key = getProviderApplicationReportCellKey(row, group, label)
  if (providerApplicationReportCellDragVisitedKeys.value.has(key)) return

  providerApplicationReportCellDragVisitedKeys.value = new Set([...providerApplicationReportCellDragVisitedKeys.value, key])

  if (providerApplicationReportCellDragAppend.value) {
    toggleProviderApplicationReportCell(row, group, label, value)
  }
  else {
    selectProviderApplicationReportCell(row, group, label, value)
  }
}

function stopProviderApplicationReportCellDrag() {
  isProviderApplicationReportCellDragging.value = false
  providerApplicationReportCellDragStart.value = null
  providerApplicationReportCellDragAppend.value = false
  providerApplicationReportCellDragVisitedKeys.value = new Set()
}

function handleProviderApplicationReportGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !isProvidersApplicationsReportPage.value) return
  if (!selectedProviderApplicationReportCellValues.value.length && !isProviderApplicationReportCellDragging.value) return

  event.preventDefault()
  stopProviderApplicationReportCellDrag()
  clearProviderApplicationReportCellSelection()
}

function getProviderApplicationReportCellClass(row: string, group: string, label: string) {
  return isProviderApplicationReportCellSelected(row, group, label)
    ? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/35'
    : 'hover:bg-primary/5'
}

function toggleProviderApplicationReportRegion(row: ProviderApplicationReportRow) {
  if (row.isTotal) {
    return
  }

  clearProviderApplicationReportCellSelection()
  selectedProviderApplicationReportRegion.value = selectedProviderApplicationReportRegion.value === row.region
    ? ''
    : row.region
}

function closeProviderApplicationReportRegion() {
  clearProviderApplicationReportCellSelection()
  selectedProviderApplicationReportRegion.value = ''
}

function getProviderApplicationReportStatusClasses(status: string) {
  if (status === 'Yangi') {
    return eiStatusClasses.info
  }

  if (status === 'O‘rganilmoqda') {
    return eiStatusClasses.warning
  }

  if (status === 'Qabul qilingan') {
    return eiStatusClasses.success
  }

  if (status === 'Rad etilgan') {
    return eiStatusClasses.danger
  }

  return eiStatusClasses.neutral
}

function setRowsPerPage(nextValue: number) {
  selectedRowsPerPage.value = nextValue
  currentPage.value = 1
}

function goToPage(pageNumber: number) {
  if (pageNumber < 1 || pageNumber > totalPages.value || pageNumber === currentPage.value) {
    return
  }

  currentPage.value = pageNumber
}

function clearSearchAndFilters() {
  searchQuery.value = ''
  selectedStatuses.value = []
  resetProviderApplicationFilters()
  currentPage.value = 1
}

function resetProviderApplicationFilters() {
  selectedProviderConclusionResult.value = ''
  selectedProviderRegion.value = ''
  selectedProviderDistrict.value = ''
  providerApplicationsStartDate.value = ''
  providerApplicationsEndDate.value = ''
  draftProviderConclusionResult.value = ''
  draftProviderRegion.value = ''
  draftProviderDistrict.value = ''
  draftProviderApplicationsStartDate.value = ''
  draftProviderApplicationsEndDate.value = ''
}

function clearProviderApplicationFilters() {
  resetProviderApplicationFilters()
  currentPage.value = 1
}

function resetProviderApplicationReportFilters() {
  providerApplicationReportStartDate.value = ''
  providerApplicationReportEndDate.value = ''
  draftProviderApplicationReportStartDate.value = ''
  draftProviderApplicationReportEndDate.value = ''
}

function clearProviderApplicationReportFilters() {
  resetProviderApplicationReportFilters()
  selectedProviderApplicationReportRegion.value = ''
  clearProviderApplicationReportCellSelection()
}

function syncProviderApplicationDraftFilters() {
  draftProviderConclusionResult.value = selectedProviderConclusionResult.value
  draftProviderRegion.value = selectedProviderRegion.value
  draftProviderDistrict.value = selectedProviderDistrict.value
  draftProviderApplicationsStartDate.value = providerApplicationsStartDate.value
  draftProviderApplicationsEndDate.value = providerApplicationsEndDate.value
}

function syncProviderApplicationReportDraftFilters() {
  draftProviderApplicationReportStartDate.value = providerApplicationReportStartDate.value
  draftProviderApplicationReportEndDate.value = providerApplicationReportEndDate.value
}

function applyProviderApplicationFilters() {
  selectedProviderConclusionResult.value = draftProviderConclusionResult.value
  selectedProviderRegion.value = draftProviderRegion.value
  selectedProviderDistrict.value = draftProviderDistrict.value
  providerApplicationsStartDate.value = draftProviderApplicationsStartDate.value
  providerApplicationsEndDate.value = draftProviderApplicationsEndDate.value
  currentPage.value = 1
  isProviderApplicationsFilterOpen.value = false
}

function applyProviderApplicationReportFilters() {
  providerApplicationReportStartDate.value = draftProviderApplicationReportStartDate.value
  providerApplicationReportEndDate.value = draftProviderApplicationReportEndDate.value
  selectedProviderApplicationReportRegion.value = ''
  clearProviderApplicationReportCellSelection()
  isProviderApplicationReportFilterOpen.value = false
}

function parseAttendanceMonth(value: string): { year: number; month: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  const fallbackDate = new Date()
  const fallbackYear = fallbackDate.getFullYear()
  const fallbackMonth = fallbackDate.getMonth() + 1
  const year = match ? Number(match[1]) : fallbackYear
  const month = match ? Number(match[2]) : fallbackMonth

  if (month < 1 || month > 12) {
    return { year: fallbackYear, month: fallbackMonth }
  }

  return { year, month }
}

function openAttendanceDay(date: string) {
  selectedAttendanceListTab.value = 'all'
  router.push(`/apps/ei/service/attendance/${date}`)
}

function isAttendancePresent(record: AttendanceRecord) {
  return record.status === 'Keldi' || record.status === 'Kechikdi'
}

function isAttendanceRecordInScope(record: AttendanceRecord) {
  if (attendanceScopeLevel.value === 'republic') {
    return true
  }

  if (record.region !== selectedAttendanceRegion.value) {
    return false
  }

  return attendanceScopeLevel.value !== 'provider'
    || record.provider === selectedAttendanceProvider.value
}

function setAttendanceScopeLevel(level: AttendanceScopeLevel) {
  attendanceScopeLevel.value = level

  if (level === 'republic') {
    selectedAttendanceRegion.value = ''
    selectedAttendanceProvider.value = ''
    return
  }

  if (!selectedAttendanceRegion.value) {
    selectedAttendanceRegion.value = attendanceRegionOptions.value[0] ?? ''
  }

  if (level === 'region') {
    selectedAttendanceProvider.value = ''
    return
  }

  if (!selectedAttendanceProvider.value) {
    selectedAttendanceProvider.value = attendanceProviderOptions.value[0] ?? ''
  }
}

function drillDownAttendanceTimesheetRow(row: AttendanceTimesheetRow) {
  if (attendanceScopeLevel.value === 'republic') {
    selectedAttendanceRegion.value = row.region
    selectedAttendanceProvider.value = ''
    attendanceScopeLevel.value = 'region'
    return
  }

  if (attendanceScopeLevel.value === 'region') {
    selectedAttendanceProvider.value = row.provider
    attendanceScopeLevel.value = 'provider'
  }
}

function openAttendanceTimesheetCell(row: AttendanceTimesheetRow, entry: AttendanceTimesheetEntry) {
  drillDownAttendanceTimesheetRow(row)
  openAttendanceDay(entry.date)
}

function shiftAttendanceMonth(offset: number) {
  selectedAttendanceMonth.value = getAttendanceMonthKey(selectedAttendanceMonth.value, offset)
}

function getAttendanceMonthKey(monthValue: string, offset: number) {
  const { year, month } = parseAttendanceMonth(monthValue)
  const date = new Date(year, month - 1 + offset, 1)

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getAttendancePlannedHours(record: AttendanceRecord) {
  const match = /^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/.exec(record.plannedTime)

  if (!match) {
    return 0
  }

  const startHour = Number(match[1])
  const startMinute = Number(match[2])
  const endHour = Number(match[3])
  const endMinute = Number(match[4])

  return ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60
}

function formatAttendanceHours(hours: number) {
  const totalMinutes = Math.round(hours * 60)
  const hourPart = Math.floor(totalMinutes / 60)
  const minutePart = String(totalMinutes % 60).padStart(2, '0')

  return `${hourPart}:${minutePart}`
}

function formatSignedAttendanceHours(hours: number) {
  if (hours === 0) {
    return '0:00'
  }

  return `${hours > 0 ? '+' : '−'}${formatAttendanceHours(Math.abs(hours))}`
}

function formatAttendancePercentage(value: number) {
  return `${value.toLocaleString('uz-UZ', { maximumFractionDigits: 1 })}%`
}

function isAttendanceIssue(record: AttendanceRecord) {
  if (record.status === 'Tasdiqlanmagan') {
    return true
  }

  if (!isAttendancePresent(record)) {
    return false
  }

  return record.calculationStatus !== 'Hisoblanadi'
    || record.biometricStatus !== 'Tasdiqlandi'
    || record.geoStatus !== 'Mos'
}

function buildAttendanceMetrics(records: AttendanceRecord[]): AttendanceMetrics {
  const plannedHours = records.reduce((total, record) => total + getAttendancePlannedHours(record), 0)
  const actualHours = records.reduce((total, record) => total + record.hours, 0)
  const present = records.filter(isAttendancePresent).length

  return {
    planned: records.length,
    plannedHours,
    actualHours,
    varianceHours: actualHours - plannedHours,
    billableHours: records
      .filter((record) => record.calculationStatus === 'Hisoblanadi')
      .reduce((total, record) => total + record.hours, 0),
    present,
    absent: records.filter((record) => record.status === 'Kelmadi').length,
    late: records.filter((record) => record.status === 'Kechikdi').length,
    issues: records.filter(isAttendanceIssue).length,
    completionRate: plannedHours > 0 ? (actualHours / plannedHours) * 100 : 0,
    attendanceRate: records.length > 0 ? (present / records.length) * 100 : 0,
    uniqueBeneficiaries: new Set(records.map((record) => record.childPinfl)).size,
    providers: new Set(records.map((record) => record.tin)).size,
  }
}

function buildAttendanceTimesheetEntry(records: AttendanceRecord[]): AttendanceTimesheetEntry {
  const metrics = buildAttendanceMetrics(records)
  const requiresReview = metrics.issues > 0
  const hasLateArrival = metrics.late > 0

  let tone: AttendanceTimesheetTone = 'success'
  if (requiresReview || (metrics.present > 0 && metrics.absent > 0)) {
    tone = 'warning'
  } else if (metrics.absent > 0 && metrics.present === 0) {
    tone = 'danger'
  } else if (hasLateArrival) {
    tone = 'info'
  }

  return {
    date: records[0]?.date ?? '',
    hours: metrics.actualHours,
    plannedHours: metrics.plannedHours,
    billableHours: metrics.billableHours,
    planned: metrics.planned,
    present: metrics.present,
    absent: metrics.absent,
    late: metrics.late,
    issues: metrics.issues,
    completionRate: metrics.completionRate,
    tone,
  }
}

function getAttendanceTimesheetCellClass(entry?: AttendanceTimesheetEntry) {
  if (!entry) {
    return 'bg-background text-muted-foreground'
  }

  if (entry.tone === 'danger') {
    return 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/25 dark:text-red-300'
  }

  if (entry.tone === 'warning') {
    return 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/25 dark:text-amber-300'
  }

  if (entry.tone === 'info') {
    return 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/25 dark:text-blue-300'
  }

  return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/25 dark:text-emerald-300'
}

function getAttendanceDayClass(day: { planned: number; absent: number; issues: number; date: string }) {
  if (selectedAttendanceDay.value === day.date) {
    return 'border-primary bg-primary/10 ring-2 ring-primary/20'
  }

  if (day.absent > 0) {
    return 'border-red-200 bg-red-50/70 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/20'
  }

  if (day.issues > 0) {
    return 'border-amber-200 bg-amber-50/70 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20'
  }

  if (day.planned > 0) {
    return 'border-emerald-200 bg-emerald-50/70 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/20'
  }

  return 'border-border bg-background hover:bg-muted/40'
}

function formatName(value: string) {
  return value.toLocaleUpperCase('uz-UZ')
}

function getApplicantName(record: EiRecord) {
  return record.applicant?.fullName ? formatName(record.applicant.fullName) : '-'
}

function getApplicantPinfl(record: EiRecord) {
  return record.applicant?.pinfl ?? '-'
}

function getMetadataValue(record: EiRecord, label: string) {
  return record.metadata.find((item) => item.label === label)?.value ?? ''
}

function getChildServiceUserName(record: EiRecord) {
  return getMetadataValue(record, 'Xizmatdan foydalanuvchi FIO')
    ? formatName(getMetadataValue(record, 'Xizmatdan foydalanuvchi FIO'))
    : record.title
      ? formatName(record.title)
      : '-'
}

function getChildServiceUserPinfl(record: EiRecord) {
  return getMetadataValue(record, 'Xizmatdan foydalanuvchi JSHSHIR') || '-'
}

function getChildApplicationApplicantName(record: EiRecord) {
  return getMetadataValue(record, 'Ariza beruvchi FIO')
    ? formatName(getMetadataValue(record, 'Ariza beruvchi FIO'))
    : getApplicantName(record)
}

function getChildApplicationApplicantPinfl(record: EiRecord) {
  return getMetadataValue(record, 'Ariza beruvchi JSHSHIR') || getApplicantPinfl(record)
}

function getChildApplicationProviderName(record: EiRecord) {
  return getMetadataValue(record, 'Tadbirkor')
    ? formatName(getMetadataValue(record, 'Tadbirkor'))
    : '-'
}

function getChildApplicationProviderInn(record: EiRecord) {
  return getMetadataValue(record, 'INN') || record.tin || '-'
}

function applyChildApplicationStatusOverride(record: EiRecord): EiRecord {
  const override = childApplicationStatusOverrides.value[record.id]

  if (!override) {
    return record
  }

  return {
    ...record,
    status: override.status,
    tone: override.tone,
    nextAction: override.nextAction,
    history: [
      {
        label: override.historyLabel,
        date: formatDate(toInputDate()),
      },
      ...record.history,
    ],
  }
}

function openProviderApplication(record: EiRecord) {
  closeActionMenu()
  router.push(`/apps/ei/providers/applications/${record.id}`)
}

function getProviderApplicationCoordinates(record: EiRecord) {
  const coordinatesByRegion: Record<string, { latitude: number; longitude: number }> = {
    'Toshkent shahri': { latitude: 41.3111, longitude: 69.2797 },
    Samarqand: { latitude: 39.6542, longitude: 66.9597 },
    "Farg'ona": { latitude: 40.3864, longitude: 71.7864 },
  }

  return coordinatesByRegion[record.region] ?? { latitude: 41.3775, longitude: 64.5853 }
}

function getProviderApplicationDetail(record: EiRecord) {
  const applicantLookup = providerApplicationApplicantsByPinfl[getApplicantPinfl(record)]
  const organizationType = getMetadataValue(record, 'Tashkilot turi')
    || (record.subject.toLocaleLowerCase('uz-UZ').includes('yakka') ? 'YaTT' : 'NNT')
  const isIndividualEntrepreneur = ['ytt', 'yatt'].includes(organizationType.toLocaleLowerCase('uz-UZ'))
  const applicantAddress = getMetadataValue(record, 'Ariza beruvchi manzili')
    || `${record.region}, ${record.district}, Yangi hayot MFY, Mustaqillik ko'chasi, 12-uy`
  const organizationAddress = getMetadataValue(record, 'Tadbirkorlik subyekti manzili')
    || getMetadataValue(record, 'Xizmat manzili')
    || `${record.region}, ${record.district}, Barkamol MFY, Markaziy ko'cha, 8-uy`
  const organizationStatus = getMetadataValue(record, 'Tadbirkorlik subyekti holati') || 'Faol'
  const coordinates = getProviderApplicationCoordinates(record)
  const coordinatePair = `${coordinates.latitude},${coordinates.longitude}`

  return {
    document: [
      { label: 'ID', value: record.id },
      { label: 'Sana', value: formatDate(record.submittedAt) },
      { label: 'Holat', value: record.status, kind: 'status' },
      { label: 'Murojaat kanali', value: getMetadataValue(record, 'Murojaat kanali') || 'Operator orqali' },
      { label: 'Manzil', value: `${record.region}, ${record.district}` },
    ] as EiDetailField[],
    receiver: {
      photo: applicantManPhoto,
      fullName: record.owner === 'Ishchi guruh'
        ? 'Tursunov Sardor Akmalovich'
        : 'Mamadaliyev Shavkat Ilhom ogli',
      pinfl: record.owner === 'Ishchi guruh' ? '30908765432109' : '31101876543210',
      fields: [
        { label: 'Lavozim', value: record.owner === 'Ishchi guruh' ? 'Yetakchi mutaxassis' : 'Hududiy operator' },
      ] as EiDetailField[],
    },
    applicant: {
      photo: applicantLookup?.photo || applicantManPhoto,
      fields: [
        { label: 'FIO', value: getApplicantName(record) },
        { label: 'JSHSHIR', value: getApplicantPinfl(record) },
        { label: "Tug'ilgan sanasi", value: applicantLookup?.birthDate ? formatDate(applicantLookup.birthDate) : '01.04.1990' },
        { label: 'Jinsi', value: applicantLookup?.gender || 'Erkak' },
        { label: 'Manzil', value: applicantAddress },
        { label: 'Telefon raqami', value: '+998 90 123 45 67' },
      ] as EiDetailField[],
    },
    organization: [
      { label: 'Nomi', value: formatName(record.title) },
      { label: 'Turi', value: organizationType },
      { label: isIndividualEntrepreneur ? 'JSHSHIR' : 'STIR', value: record.tin || '-' },
      { label: 'Manzil', value: organizationAddress },
      { label: 'Telefon raqami', value: '+998 71 200 10 20' },
      { label: 'Holati', value: organizationStatus, kind: organizationStatus.toLocaleLowerCase('uz-UZ') === 'faol' ? 'success' : 'neutral' },
    ] as EiDetailField[],
    cadastre: [
      { label: 'Nomi', value: `${formatName(record.title)} xizmat ko'rsatish binosi` },
      { label: 'Kadastr raqami', value: `10:01:02:03:${record.id.slice(-4)}` },
      { label: 'Manzil', value: organizationAddress },
    ] as EiDetailField[],
    location: {
      coordinates: [coordinates.latitude, coordinates.longitude] as [number, number],
      markers: [{
        coordinates: [coordinates.latitude, coordinates.longitude] as [number, number],
        title: formatName(record.title),
        description: organizationAddress,
      }],
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinatePair)}`,
      yandexMapsUrl: `https://yandex.com/maps/?ll=${coordinates.longitude}%2C${coordinates.latitude}&z=16&pt=${coordinates.longitude}%2C${coordinates.latitude}`,
    },
  }
}

function openChildApplication(record: EiRecord) {
  closeActionMenu()
  router.push(`/apps/ei/children/applications/${record.id}`)
}

function getChildApplicationReceiver(record: EiRecord) {
  const channel = getMetadataValue(record, 'Murojaat kanali') || record.owner

  if (['YIDXP', 'Ijtimoiy karta'].includes(channel)) {
    return null
  }

  return {
    photo: applicantManPhoto,
    fullName: channel === 'Ijtimoiy xodim' ? 'Mamadaliyev Shavkat Ilhom ogli' : 'Tursunova Dilnoza Akmalovna',
    pinfl: channel === 'Ijtimoiy xodim' ? '31101876543210' : '41102876543211',
    system: channel || 'Inson markazi',
    position: channel === 'Ijtimoiy xodim' ? 'Ijtimoiy xodim' : 'Operator',
    phone: '+998 90 123 45 67',
    acceptedAt: `${formatDate(record.submittedAt)} 10:24`,
  }
}

function getChildApplicationDetail(record: EiRecord) {
  const childName = getChildServiceUserName(record)
  const childPinfl = getChildServiceUserPinfl(record)
  const applicantName = getChildApplicationApplicantName(record)
  const applicantPinfl = getChildApplicationApplicantPinfl(record)
  const providerName = getChildApplicationProviderName(record)
  const providerInn = getChildApplicationProviderInn(record)
  const basisDocument = getMetadataValue(record, 'Asos hujjat') || 'Oilaviy shifokor xulosasi'
  const voucherId = getMetadataValue(record, 'Vaucher') || (record.status.includes('Vaucher') ? `EA-VCH-${record.submittedAt.slice(0, 4)}-${record.id.slice(-4)}` : '')
  const receiver = getChildApplicationReceiver(record)
  const isVoucherAvailable = Boolean(voucherId) || ['Vaucher shakllandi', 'Vaucher yaratilgan'].includes(record.status)
  const isOrderAvailable = record.status === 'Qabul qilingan' || getMetadataValue(record, 'Vaucher')
  const address = `${record.region}, ${record.district}, Yangi hayot MFY, Mustaqillik ko'chasi, 12-uy`

  return {
    application: [
      { label: 'Ariza ID', value: record.id },
      { label: 'Ariza sanasi', value: formatDate(record.submittedAt) },
      { label: 'Ariza holati', value: record.status, kind: 'status' },
      { label: 'Ariza turi', value: receiver ? 'Operator orqali' : 'Mustaqil' },
      { label: 'Hududiy tegishlilik', value: `${record.region}, ${record.district}` },
    ],
    receiver,
    applicant: {
      photo: applicantWomanPhoto,
      fields: [
        { label: 'FIO', value: applicantName },
        { label: 'JSHSHIR', value: applicantPinfl },
        { label: 'Tugilgan sanasi', value: '14.05.1994' },
        { label: 'Jinsi', value: applicantName.includes('OVA') ? 'Ayol' : 'Erkak' },
        { label: 'Manzil', value: address },
        { label: 'Telefon raqami', value: '+998 93 456 78 90' },
      ],
    },
    child: {
      photo: applicantManPhoto,
      fields: [
        { label: 'FIO', value: childName },
        { label: 'JSHSHIR', value: childPinfl },
        { label: 'Tugilgan sanasi', value: record.id.endsWith('0210') ? '18.02.2024' : '05.09.2024' },
        { label: 'Jinsi', value: childName.includes('QIZI') || childName.includes('KARIMOVA') ? 'Ayol' : 'Erkak' },
        { label: 'Manzil', value: address },
      ],
    },
    basis: [
      { label: 'Asos turi', value: basisDocument },
      { label: 'Hujjat raqami', value: basisDocument.includes('Nogiron') ? 'NOG-2026-0145' : 'OSH-2026-0478' },
      { label: 'Hujjat sanasi', value: '15.06.2026' },
      { label: 'Yo\'naltiruvchi havola', value: 'integration://ei/basis-document' },
      { label: 'Integratsiya holati', value: 'Avtomatik olindi', kind: 'success' },
    ],
    provider: [
      { label: 'Tashkilot nomi', value: providerName },
      { label: 'Tashkilot turi', value: providerName.includes('YATT') ? 'YaTT' : 'NNT / yuridik shaxs' },
      { label: 'STIR', value: providerInn },
      { label: 'Manzil', value: `${record.region}, ${record.district}, Barkamol MFY, Markaziy ko'cha, 8-uy` },
      { label: 'Telefon raqami', value: '+998 71 200 10 20' },
      { label: 'Faoliyat holati', value: providerName === '-' ? 'Tanlanmagan' : 'Faol', kind: providerName === '-' ? 'neutral' : 'success' },
      { label: 'Reyestrga kiritilgan sana', value: providerName === '-' ? '-' : '15.06.2026' },
    ],
    voucher: [
      { label: 'Vaucher ID', value: isVoucherAvailable ? (voucherId || `EA-VCH-${record.id.slice(-4)}`) : 'Hali shakllanmagan' },
      { label: 'Shakllangan sana', value: isVoucherAvailable ? formatDate(addDays(record.submittedAt, 1)) : '-' },
      { label: 'Amal qilish muddati', value: isVoucherAvailable ? formatDate(addDays(record.submittedAt, 31)) : '-' },
      { label: 'Holati', value: isVoucherAvailable ? record.status : 'Kutilmoqda', kind: isVoucherAvailable ? 'status' : 'neutral' },
    ],
    order: [
      { label: 'Buyurtma ID', value: isOrderAvailable ? `EA-ORD-${record.id.slice(-4)}` : 'Hali shakllanmagan' },
      { label: 'Buyurtma sanasi', value: isOrderAvailable ? formatDate(addDays(record.submittedAt, 2)) : '-' },
      { label: 'Tadbirkor', value: isOrderAvailable ? providerName : '-' },
      { label: 'Holati', value: isOrderAvailable ? 'Qabul qilingan' : 'Kutilmoqda', kind: isOrderAvailable ? 'success' : 'neutral' },
      { label: 'Xizmat boshlanish sanasi', value: isOrderAvailable ? formatDate(addDays(record.submittedAt, 3)) : '-' },
    ],
    plan: [
      { label: 'Reja ID', value: isOrderAvailable ? `EA-PLN-${record.id.slice(-4)}` : 'Hali shakllanmagan' },
      { label: 'Reja tuzilgan sana', value: isOrderAvailable ? formatDate(addDays(record.submittedAt, 5)) : '-' },
      { label: 'Masul mutaxassis', value: isOrderAvailable ? 'Ergasheva Nilufar Komilovna' : '-' },
      { label: 'Reja muddati', value: isOrderAvailable ? '6 oy' : '-' },
      { label: 'Haftalik xizmat soatlari', value: isOrderAvailable ? '6 soatgacha' : '-' },
      { label: 'Holati', value: isOrderAvailable ? 'Ishlab chiqilmoqda' : 'Kutilmoqda', kind: isOrderAvailable ? 'warning' : 'neutral' },
    ],
    attendance: [
      { label: 'Oxirgi davomat sanasi', value: isOrderAvailable ? '03.07.2026' : '-' },
      { label: 'Reja bo\'yicha', value: isOrderAvailable ? '7 ta' : '-' },
      { label: 'Kelgan', value: isOrderAvailable ? '5 ta' : '-' },
      { label: 'Kelmagan', value: isOrderAvailable ? '2 ta' : '-' },
      { label: 'Xizmat soatlari', value: isOrderAvailable ? '10 soat' : '-' },
    ],
    history: record.history,
  }
}

function getDetailFieldBadgeClass(kind?: string) {
  if (kind === 'success') {
    return eiStatusClasses.success
  }

  if (kind === 'warning') {
    return eiStatusClasses.warning
  }

  if (kind === 'neutral') {
    return eiStatusClasses.neutral
  }

  if (kind === 'status' && selectedChildApplication.value) {
    return eiStatusClasses[selectedChildApplication.value.tone]
  }

  return ''
}

function getConclusionResult(record: EiRecord) {
  return record.result ?? record.metadata.find((item) => item.label === 'Xulosa turi')?.value ?? '-'
}

function getConclusionResultClasses(record: EiRecord) {
  const result = getConclusionResult(record).toLocaleLowerCase('uz-UZ')

  if (result.includes('salbiy')) {
    return eiStatusClasses.danger
  }

  if (result.includes('ijobiy')) {
    return eiStatusClasses.success
  }

  return eiStatusClasses.neutral
}

function canEditAndSendConclusion(record: EiRecord) {
  return isProvidersConclusionsPage.value && editableConclusionStatuses.includes(record.status)
}

function canReviewConclusion(record: EiRecord) {
  return isProvidersConclusionsPage.value && record.status === 'Yuborilgan'
}

function canRunChildApplicationDecision(record: EiRecord) {
  return isChildrenApplicationsPage.value && record.status === 'Yangi'
}

function canCreateChildVoucherOrder(record: EiRecord) {
  return isChildrenVouchersPage.value && record.status === 'Qabul qilingan'
}

function updateChildApplicationStatus(
  record: EiRecord,
  status: string,
  tone: EiRecord['tone'],
  nextAction: string,
  historyLabel: string,
) {
  childApplicationStatusOverrides.value = {
    ...childApplicationStatusOverrides.value,
    [record.id]: {
      status,
      tone,
      nextAction,
      historyLabel,
    },
  }
  closeActionMenu()
}

function createChildApplicationVoucher(record: EiRecord) {
  updateChildApplicationStatus(
    record,
    'Vaucher yaratilgan',
    'success',
    'Vaucher asosida xizmat ko‘rsatuvchini tanlash',
    'Vaucher shakllantirildi',
  )
}

function rejectChildApplication(record: EiRecord) {
  updateChildApplicationStatus(
    record,
    'Rad etilgan',
    'danger',
    'Rad etish sababini xabarnoma qilish',
    'Ariza rad etildi',
  )
}

function createChildVoucherOrder(record: EiRecord) {
  updateChildApplicationStatus(
    record,
    'Foydalanilgan',
    'neutral',
    'Buyurtmani xizmat ko‘rsatuvchiga yuborish',
    'Buyurtma shakllantirildi',
  )
}

function getProviderExportRows() {
  return filteredRecords.value.map((record, index) => {
    const row: Record<string, string | number> = {
      '№': index + 1,
      'Hujjat': record.id,
      'Sana': formatDate(record.submittedAt),
      'Ariza beruvchi FIO': getApplicantName(record),
      'JSHSHIR': getApplicantPinfl(record),
      'Tadbirkor': formatName(record.title),
      'STIR': record.tin ?? '',
      'Hudud': record.region,
      'Tuman/shahar': record.district,
    }

    if (isProvidersConclusionsPage.value) {
      row.Natija = getConclusionResult(record)
    }

    row.Holat = record.status

    return row
  })
}

function getProviderApplicationReportExportRows() {
  return providerApplicationReportDisplayRows.value.map((row) => {
    const reportRow: Record<string, string | number> = {
      [providerApplicationReportFirstColumnLabel.value]: row.region,
      'Barcha arizalar': row.total,
    }

    providerApplicationReportStatuses.forEach((status) => {
      reportRow[status] = row.statuses[status] ?? 0
    })

    return reportRow
  })
}

function getGenericExportRows() {
  return filteredRecords.value.map((record, index) => ({
    '№': index + 1,
    'Yozuv': formatName(record.title),
    'Hujjat': record.id,
    'Hujjat turi': record.subject,
    'Hudud': record.region,
    'Tuman/shahar': record.district,
    'Mas’ul': record.owner,
    'Holat': record.status,
    'Sana': formatDate(record.submittedAt),
    'Muddat': formatDate(record.dueAt),
  }))
}

async function downloadRecordsAsExcel() {
  if (isExportingRecords.value || filteredRecords.value.length === 0) {
    return
  }

  isExportingRecords.value = true

  try {
    const xlsx = await import('xlsx')
    const exportRows = props.pageKey.startsWith('providers-')
      ? getProviderExportRows()
      : getGenericExportRows()
    const worksheet = xlsx.utils.json_to_sheet(exportRows)
    worksheet['!cols'] = Object.keys(exportRows[0] ?? {}).map((key) => ({
      wch: Math.min(Math.max(key.length + 2, 12), 32),
    }))

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Arizalar')
    xlsx.writeFile(workbook, exportFileName.value, { compression: true })
  }
  finally {
    isExportingRecords.value = false
  }
}

async function downloadProviderApplicationReportAsExcel() {
  if (isExportingRecords.value || providerApplicationReportDisplayRows.value.length === 0) {
    return
  }

  isExportingRecords.value = true

  try {
    const xlsx = await import('xlsx')
    const exportRows = getProviderApplicationReportExportRows()
    const worksheet = xlsx.utils.json_to_sheet(exportRows)
    worksheet['!cols'] = Object.keys(exportRows[0] ?? {}).map((key) => ({
      wch: Math.min(Math.max(key.length + 4, 14), 36),
    }))

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Hisobot')
    const reportScope = selectedProviderApplicationReportRegion.value || 'respublika'
    xlsx.writeFile(workbook, `ei-xizmat-korsatuvchilar-arizalari-${reportScope}-${toInputDate()}.xlsx`, { compression: true })
  }
  finally {
    isExportingRecords.value = false
  }
}

function resetProviderApplicationForm() {
  providerApplicationForm.value = getDefaultProviderApplicationForm()
  providerApplicationFormErrors.value = {}
}

function openCreateDialog() {
  if (!isProvidersApplicationsPage.value) {
    return
  }

  resetProviderApplicationForm()
  router.push('/apps/ei/providers/applications/create')
}

function closeCreateProviderApplicationDialog() {
  resetProviderApplicationForm()
  router.push('/apps/ei/providers/applications')
}

function resetProviderApplicationApplicantFields() {
  providerApplicationForm.value.applicantFullName = ''
  providerApplicationForm.value.applicantBirthDate = ''
  providerApplicationForm.value.applicantGender = ''
  providerApplicationForm.value.applicantPhoto = ''
}

function resetProviderApplicationAddressFields() {
  providerApplicationForm.value.applicantAddressRegion = ''
  providerApplicationForm.value.applicantAddressDistrict = ''
  providerApplicationForm.value.applicantAddressMahalla = ''
  providerApplicationForm.value.applicantAddressFull = ''
}

function resetProviderApplicationBusinessFields() {
  providerApplicationForm.value.organizationName = ''
  providerApplicationForm.value.organizationDirector = ''
  providerApplicationForm.value.organizationRegisteredAt = ''
  providerApplicationForm.value.organizationActivityType = ''
  providerApplicationForm.value.organizationStatus = ''
  providerApplicationForm.value.organizationRegion = ''
  providerApplicationForm.value.organizationDistrict = ''
  providerApplicationForm.value.organizationMahalla = ''
  providerApplicationForm.value.organizationAddress = ''
}

function updateProviderApplicationTin(value: string) {
  providerApplicationForm.value.tin = value.replace(/\D/g, '').slice(0, 9)
  resetProviderApplicationBusinessFields()
  delete providerApplicationFormErrors.value.tin
  delete providerApplicationFormErrors.value.organizationName
}

function updateProviderApplicationPinfl(value: string) {
  providerApplicationForm.value.applicantPinfl = value.replace(/\D/g, '').slice(0, 14)
  resetProviderApplicationApplicantFields()
  resetProviderApplicationAddressFields()
  providerApplicationForm.value.tin = ''
  resetProviderApplicationBusinessFields()
  delete providerApplicationFormErrors.value.applicantPinfl
  delete providerApplicationFormErrors.value.applicantFullName
  delete providerApplicationFormErrors.value.applicantAddressRegion
  delete providerApplicationFormErrors.value.applicantAddressDistrict
  delete providerApplicationFormErrors.value.applicantAddressMahalla
  delete providerApplicationFormErrors.value.applicantAddressFull
  delete providerApplicationFormErrors.value.tin
  delete providerApplicationFormErrors.value.organizationName
}

function getEventValue(event: Event) {
  const target = event.target

  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement ? target.value : ''
}

function updateProviderApplicationAddressRegion(value: string) {
  providerApplicationForm.value.applicantAddressRegion = value
  providerApplicationForm.value.applicantAddressDistrict = ''
  providerApplicationForm.value.applicantAddressMahalla = ''
  delete providerApplicationFormErrors.value.applicantAddressRegion
  delete providerApplicationFormErrors.value.applicantAddressDistrict
  delete providerApplicationFormErrors.value.applicantAddressMahalla
}

function updateProviderApplicationAddressDistrict(value: string) {
  providerApplicationForm.value.applicantAddressDistrict = value
  providerApplicationForm.value.applicantAddressMahalla = ''
  delete providerApplicationFormErrors.value.applicantAddressDistrict
  delete providerApplicationFormErrors.value.applicantAddressMahalla
}

function updateProviderApplicationAddressMahalla(value: string) {
  providerApplicationForm.value.applicantAddressMahalla = value
  delete providerApplicationFormErrors.value.applicantAddressMahalla
}

function getProviderApplicationStatusClasses(status: string) {
  return status.toLocaleLowerCase('uz-UZ') === 'faol'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
    : 'border-border bg-muted text-muted-foreground'
}

function searchProviderApplicationApplicant() {
  const pinfl = providerApplicationForm.value.applicantPinfl
  const applicant = providerApplicationApplicantsByPinfl[pinfl]

  if (!/^\d{14}$/.test(pinfl)) {
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      applicantPinfl: 'JSHSHIR 14 ta raqamdan iborat bo‘lishi kerak',
    }
    return
  }

  if (pinfl === providerApplicationBlacklistedPinfl) {
    resetProviderApplicationApplicantFields()
    resetProviderApplicationAddressFields()
    providerApplicationForm.value.tin = ''
    resetProviderApplicationBusinessFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      applicantPinfl: "Ushbu JSHSHIR qora ro'yxatda",
    }
    return
  }

  if (pinfl !== providerApplicationWhitelistedPinfl) {
    resetProviderApplicationApplicantFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      applicantPinfl: 'Ushbu JSHSHIR bo‘yicha ma’lumot topilmadi',
    }
    return
  }

  if (!applicant) {
    resetProviderApplicationApplicantFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      applicantPinfl: 'Ushbu JSHSHIR bo‘yicha ma’lumot topilmadi',
    }
    return
  }

  providerApplicationForm.value.applicantFullName = applicant.fullName
  providerApplicationForm.value.applicantBirthDate = applicant.birthDate
  providerApplicationForm.value.applicantGender = applicant.gender
  providerApplicationForm.value.applicantPhoto = applicant.photo
  delete providerApplicationFormErrors.value.applicantPinfl
  delete providerApplicationFormErrors.value.applicantFullName
}

function searchProviderApplicationBusiness() {
  const tin = providerApplicationForm.value.tin
  const business = providerApplicationBusinessesByTin[tin]

  if (!/^\d{9}$/.test(tin)) {
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      tin: 'STIR 9 ta raqamdan iborat bo‘lishi kerak',
    }
    return
  }

  if (tin === providerApplicationBlacklistedTin) {
    resetProviderApplicationBusinessFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      tin: "Ushbu STIR qora ro'yxatda",
    }
    return
  }

  if (tin !== providerApplicationWhitelistedTin) {
    resetProviderApplicationBusinessFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      tin: 'Ushbu STIR bo‘yicha ma’lumot topilmadi',
    }
    return
  }

  if (!business) {
    resetProviderApplicationBusinessFields()
    providerApplicationFormErrors.value = {
      ...providerApplicationFormErrors.value,
      tin: 'Ushbu STIR bo‘yicha ma’lumot topilmadi',
    }
    return
  }

  providerApplicationForm.value.organizationName = business.organizationName
  providerApplicationForm.value.organizationDirector = business.director
  providerApplicationForm.value.organizationRegisteredAt = business.registeredAt
  providerApplicationForm.value.organizationActivityType = business.activityType
  providerApplicationForm.value.organizationStatus = business.status
  providerApplicationForm.value.organizationRegion = business.region
  providerApplicationForm.value.organizationDistrict = business.district
  providerApplicationForm.value.organizationMahalla = business.mahalla
  providerApplicationForm.value.organizationAddress = business.address
  delete providerApplicationFormErrors.value.tin
  delete providerApplicationFormErrors.value.organizationName
}

function formatProviderAddress(region: string, district: string, mahalla: string, address: string) {
  return [region, district, mahalla, address]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(', ')
}

function validateProviderApplicationForm() {
  const form = providerApplicationForm.value
  const errors: ProviderApplicationFormErrors = {}

  if (!form.applicantFullName.trim()) {
    errors.applicantFullName = 'JSHSHIR bo‘yicha ariza beruvchini qidiring'
  }

  if (!/^\d{14}$/.test(form.applicantPinfl)) {
    errors.applicantPinfl = 'JSHSHIR 14 ta raqamdan iborat bo‘lishi kerak'
  }

  if (/^\d{14}$/.test(form.applicantPinfl) && form.applicantPinfl === providerApplicationBlacklistedPinfl) {
    errors.applicantPinfl = "Ushbu JSHSHIR qora ro'yxatda"
  }

  if (
    /^\d{14}$/.test(form.applicantPinfl)
    && form.applicantPinfl !== providerApplicationWhitelistedPinfl
    && form.applicantPinfl !== providerApplicationBlacklistedPinfl
  ) {
    errors.applicantPinfl = 'Ushbu JSHSHIR bo‘yicha ma’lumot topilmadi'
  }

  if (!form.applicantAddressRegion.trim()) {
    errors.applicantAddressRegion = 'Hududni kiriting'
  }

  if (!form.applicantAddressDistrict.trim()) {
    errors.applicantAddressDistrict = 'Tuman yoki shaharni kiriting'
  }

  if (!form.applicantAddressMahalla.trim()) {
    errors.applicantAddressMahalla = 'MFYni kiriting'
  }

  if (!form.applicantAddressFull.trim()) {
    errors.applicantAddressFull = 'To‘liq manzilni kiriting'
  }

  if (!/^\d{9}$/.test(form.tin)) {
    errors.tin = 'STIR 9 ta raqamdan iborat bo‘lishi kerak'
  }

  if (/^\d{9}$/.test(form.tin) && form.tin === providerApplicationBlacklistedTin) {
    errors.tin = "Ushbu STIR qora ro'yxatda"
  }

  if (
    /^\d{9}$/.test(form.tin)
    && form.tin !== providerApplicationWhitelistedTin
    && form.tin !== providerApplicationBlacklistedTin
  ) {
    errors.tin = 'Ushbu STIR bo‘yicha ma’lumot topilmadi'
  }

  if (!form.organizationName.trim()) {
    errors.organizationName = 'STIR bo‘yicha tadbirkorlik subyektini qidiring'
  }

  if (!form.submittedAt) {
    errors.submittedAt = 'Ariza sanasini kiriting'
  }

  providerApplicationFormErrors.value = errors

  return Object.keys(errors).length === 0
}

function generateNextProviderApplicationId() {
  const currentYear = new Date().getFullYear()
  const sequence = pageRecords.value.reduce((maxSequence, record) => {
    const match = record.id.match(/^EA-PRA-\d{4}-(\d+)$/)

    return match ? Math.max(maxSequence, Number(match[1])) : maxSequence
  }, 0) + 1

  return `EA-PRA-${currentYear}-${String(sequence).padStart(4, '0')}`
}

function submitProviderApplicationForm() {
  if (!validateProviderApplicationForm()) {
    return
  }

  const form = providerApplicationForm.value
  const submittedAt = form.submittedAt
  const normalizedTitle = formatName(form.organizationName.trim())
  const applicantAddress = formatProviderAddress(
    form.applicantAddressRegion,
    form.applicantAddressDistrict,
    form.applicantAddressMahalla,
    form.applicantAddressFull,
  )
  const businessAddress = formatProviderAddress(
    form.organizationRegion,
    form.organizationDistrict,
    form.organizationMahalla,
    form.organizationAddress,
  )
  const newRecord: EiRecord = {
    id: generateNextProviderApplicationId(),
    title: normalizedTitle,
    tin: form.tin,
    applicant: {
      fullName: formatName(form.applicantFullName.trim()),
      pinfl: form.applicantPinfl,
    },
    subject: 'Tadbirkorlik subyekti arizasi',
    region: form.organizationRegion.trim(),
    district: form.organizationDistrict.trim(),
    owner: form.owner.trim() || 'Ishchi guruh',
    status: 'Yangi',
    tone: 'info',
    submittedAt,
    dueAt: addDays(submittedAt, 7),
    nextAction: 'Hujjatlarni birlamchi tekshirish',
    summary: form.summary.trim() || `${normalizedTitle} erta aralashuv xizmatini ko‘rsatish uchun ariza yubordi.`,
    metadata: [
      { label: 'Ariza beruvchi manzili', value: applicantAddress },
      { label: 'Direktor', value: form.organizationDirector.trim() },
      { label: 'Ro‘yxatdan o‘tgan sana', value: formatDate(form.organizationRegisteredAt) },
      { label: 'Faoliyat turi', value: form.organizationActivityType.trim() },
      { label: 'Tadbirkorlik subyekti holati', value: form.organizationStatus.trim() },
      { label: 'Tadbirkorlik subyekti manzili', value: businessAddress },
    ],
    history: [
      { label: 'Ariza yaratildi', date: formatDate(submittedAt) },
    ],
  }

  providerApplicationDrafts.value = [newRecord, ...providerApplicationDrafts.value]
  selectedStatuses.value = []
  searchQuery.value = ''
  currentPage.value = 1
  closeCreateProviderApplicationDialog()
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}.${month}.${year}`
}

function parseProviderApplicationFilterDate(value: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)

  if (!match) {
    return ''
  }

  const [, day, month, year] = match
  const isoDate = `${year}-${month}-${day}`
  const date = new Date(`${isoDate}T00:00:00`)

  if (
    Number.isNaN(date.getTime())
    || date.getFullYear() !== Number(year)
    || date.getMonth() + 1 !== Number(month)
    || date.getDate() !== Number(day)
  ) {
    return ''
  }

  return isoDate
}

function isDateWithinRange(value: string, startDate: string, endDate: string) {
  const normalizedStartDate = parseProviderApplicationFilterDate(startDate)
  const normalizedEndDate = parseProviderApplicationFilterDate(endDate)

  if (normalizedStartDate && value < normalizedStartDate) {
    return false
  }

  if (normalizedEndDate && value > normalizedEndDate) {
    return false
  }

  return true
}
</script>

<template>
  <PageContainer>
    <SectionBlock
      v-if="isProvidersApplicationViewPage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden border-0 bg-transparent shadow-none"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-y-auto p-0 pb-6"
      title=""
      description=""
    >
      <div class="ei-detail-toolbar flex items-center rounded-lg border border-border bg-card p-3">
        <div class="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            class="h-10 gap-2"
            @click="router.push('/apps/ei/providers/applications')"
          >
            <ChevronLeft class="h-4 w-4" />
            Ortga
          </Button>
        </div>
      </div>

      <div
        v-if="!selectedProviderApplication || !selectedProviderApplicationDetail"
        class="flex min-h-[24rem] items-center justify-center rounded-lg border border-border bg-card p-8 text-center"
      >
        <div class="max-w-md">
          <p class="text-sm font-medium text-foreground">
            Ariza topilmadi
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Berilgan ID bo'yicha xizmat ko'rsatuvchi arizasi mavjud emas.
          </p>
          <Button
            variant="outline"
            class="mt-4"
            @click="router.push('/apps/ei/providers/applications')"
          >
            Arizalarga qaytish
          </Button>
        </div>
      </div>

      <div
        v-if="selectedProviderApplication && selectedProviderApplicationDetail"
        class="grid w-full grid-cols-2 rounded-lg border border-border bg-card p-1 sm:w-fit sm:grid-cols-3"
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          :class="selectedProviderApplicationDetailTab === 'main' ? 'h-9 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground sm:min-w-28 sm:px-4' : 'h-9 px-3 sm:min-w-28 sm:px-4'"
          @click="selectedProviderApplicationDetailTab = 'main'"
        >
          Asosiy
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          :class="selectedProviderApplicationDetailTab === 'conclusion' ? 'h-9 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground sm:min-w-44 sm:px-4' : 'h-9 px-3 sm:min-w-44 sm:px-4'"
          @click="selectedProviderApplicationDetailTab = 'conclusion'"
        >
          Xulosa ma'lumotlari
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          :class="cn('col-span-2 sm:col-span-1', selectedProviderApplicationDetailTab === 'history' ? 'h-9 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground sm:min-w-36 sm:px-4' : 'h-9 px-3 sm:min-w-36 sm:px-4')"
          @click="selectedProviderApplicationDetailTab = 'history'"
        >
          Hujjat tarixi
        </Button>
      </div>

      <div
        v-if="selectedProviderApplication && selectedProviderApplicationDetail && selectedProviderApplicationDetailTab === 'main'"
        class="ei-detail-view grid gap-4"
      >
        <div class="grid items-stretch gap-4 xl:grid-cols-2">
        <div class="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card">
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <FileText class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              Hujjat ma'lumotlari
            </p>
          </div>
          <div class="flex-1 overflow-hidden">
            <table class="ei-detail-data-table w-full border-separate border-spacing-0 text-sm">
              <tbody>
                <tr
                  v-for="field in selectedProviderApplicationDetail.document"
                  :key="`provider-document-${field.label}`"
                >
                  <td class="w-52 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                    {{ field.label }}
                  </td>
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <span
                      v-if="field.kind"
                      :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getDetailFieldBadgeClass(field.kind))"
                    >
                      {{ field.value }}
                    </span>
                    <p
                      v-else
                      class="break-words font-medium text-foreground"
                    >
                      {{ field.value }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card">
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UserCheck class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              Arizani qabul qiluvchi ma'lumotlari
            </p>
          </div>
          <div class="flex items-center gap-3 border-b border-border bg-muted/15 px-4 py-4">
              <img
                :src="selectedProviderApplicationDetail.receiver.photo"
                alt=""
                class="h-14 w-14 rounded-full border border-border object-cover"
              >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-foreground">
                  {{ formatName(selectedProviderApplicationDetail.receiver.fullName) }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  JSHSHIR: {{ selectedProviderApplicationDetail.receiver.pinfl }}
                </p>
              </div>
          </div>
          <div class="overflow-hidden">
            <table class="ei-detail-data-table w-full border-separate border-spacing-0 text-sm">
              <tbody>
                <tr
                  v-for="field in selectedProviderApplicationDetail.receiver.fields"
                  :key="`provider-receiver-${field.label}`"
                >
                  <td class="w-52 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                    {{ field.label }}
                  </td>
                  <td class="px-4 py-3 align-top font-medium text-foreground">
                    {{ field.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>

        <div class="rounded-lg border border-border bg-card">
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UserRound class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              Ariza beruvchi ma'lumotlari
            </p>
          </div>
          <div class="flex items-center gap-3 border-b border-border bg-muted/15 px-4 py-4">
              <img
                :src="selectedProviderApplicationDetail.applicant.photo"
                alt=""
                class="h-14 w-14 rounded-full border border-border object-cover"
              >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-foreground">
                  {{ selectedProviderApplicationDetail.applicant.fields[0]?.value }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  JSHSHIR: {{ selectedProviderApplicationDetail.applicant.fields[1]?.value }}
                </p>
              </div>
          </div>
            <div class="overflow-hidden">
              <table class="ei-detail-data-table w-full border-separate border-spacing-0 text-sm">
                <tbody>
                  <tr
                    v-for="field in selectedProviderApplicationDetail.applicant.fields.slice(2)"
                    :key="`provider-applicant-${field.label}`"
                  >
                    <td class="w-72 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                      {{ field.label }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top font-medium text-foreground">
                      {{ field.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        <div class="grid items-stretch gap-4 xl:grid-cols-2">
          <div
            v-for="section in [
              { key: 'organization', title: 'Tadbirkorlik subyekti ma\'lumotlari', fields: selectedProviderApplicationDetail.organization, icon: Building2 },
              { key: 'cadastre', title: 'Kadastr ma\'lumotlari', fields: selectedProviderApplicationDetail.cadastre, icon: LandPlot },
            ]"
            :key="section.key"
            class="flex h-full min-w-0 flex-col rounded-lg border border-border bg-card"
          >
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <component :is="section.icon" class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              {{ section.title }}
            </p>
          </div>
          <div class="overflow-hidden">
            <table class="ei-detail-data-table w-full border-separate border-spacing-0 text-sm">
              <tbody>
                <tr
                  v-for="field in section.fields"
                  :key="`${section.key}-${field.label}`"
                >
                  <td class="w-52 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                    {{ field.label }}
                  </td>
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <span
                      v-if="field.kind"
                      :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getDetailFieldBadgeClass(field.kind))"
                    >
                      {{ field.value }}
                    </span>
                    <p
                      v-else
                      class="break-words font-medium text-foreground"
                    >
                      {{ field.value }}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>

        <div class="rounded-lg border border-border bg-card">
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Map class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              Joylashuv
            </p>
          </div>
          <div class="p-4">
            <YandexMap
              :center="selectedProviderApplicationDetail.location.coordinates"
              :markers="selectedProviderApplicationDetail.location.markers"
              :zoom="16"
              height="20rem"
            />
            <div class="mt-4 flex flex-col justify-end gap-2 border-t border-border pt-4 sm:flex-row">
              <a
                :href="selectedProviderApplicationDetail.location.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
              >
                Google Maps
                <ExternalLink class="h-4 w-4" />
              </a>
              <a
                :href="selectedProviderApplicationDetail.location.yandexMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Yandex Maps
                <ExternalLink class="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="selectedProviderApplication && selectedProviderApplicationDetail && selectedProviderApplicationDetailTab === 'conclusion'"
        class="ei-detail-view"
      >
        <div
          v-if="selectedProviderApplicationConclusion"
          class="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div class="flex flex-col gap-3 border-b border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2.5">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <FileText class="h-4 w-4" />
              </span>
              <p class="text-sm font-semibold text-foreground">
                Xulosa ma'lumotlari
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              class="w-full gap-2 sm:w-auto"
              @click="router.push('/apps/ei/providers/conclusions')"
            >
              <FileText class="h-4 w-4" />
              Xulosaga o'tish
            </Button>
          </div>
          <table class="ei-detail-data-table w-full border-separate border-spacing-0 text-sm">
            <tbody>
              <tr
                v-for="field in selectedProviderApplicationConclusionFields"
                :key="`provider-conclusion-${field.label}`"
              >
                <td class="w-72 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                  {{ field.label }}
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <span
                    v-if="field.kind"
                    :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', field.kind === 'status' ? eiStatusClasses[selectedProviderApplicationConclusion.tone] : getDetailFieldBadgeClass(field.kind))"
                  >
                    {{ field.value }}
                  </span>
                  <p
                    v-else
                    class="break-words font-medium text-foreground"
                  >
                    {{ field.value }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="border-t border-border px-4 py-4">
            <p class="mb-3 text-sm font-semibold text-foreground">
              Talablar haqida ma'lumot
            </p>
            <div class="overflow-hidden rounded-md border border-border">
              <div
                v-for="requirement in selectedProviderApplicationRequirementResults"
                :key="requirement.label"
                :class="cn('flex items-start gap-3 border-b border-border px-3 py-3 last:border-b-0', requirement.isMet ? 'bg-emerald-50/70 dark:bg-emerald-950/20' : 'bg-card')"
              >
                <span
                  :class="cn('mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border', requirement.isMet ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-border bg-background')"
                  aria-hidden="true"
                >
                  <Check
                    v-if="requirement.isMet"
                    class="h-3 w-3"
                    :stroke-width="3"
                  />
                </span>
                <p class="text-sm leading-5 text-foreground">
                  {{ requirement.label }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex min-h-[18rem] items-center justify-center rounded-lg border border-border bg-card p-8 text-center"
        >
          <div class="max-w-md">
            <p class="text-sm font-medium text-foreground">
              Xulosa hali shakllanmagan
            </p>
            <p class="mt-2 text-sm text-muted-foreground">
              Ushbu ariza bo'yicha xulosa yaratilgach, uning ma'lumotlari shu yerda ko'rsatiladi.
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="selectedProviderApplication && selectedProviderApplicationDetail && selectedProviderApplicationDetailTab === 'history'"
        class="ei-detail-view"
      >
        <div class="overflow-hidden rounded-lg border border-border bg-card">
          <div class="flex items-center gap-2.5 border-b border-border bg-muted/40 px-4 py-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <History class="h-4 w-4" />
            </span>
            <p class="text-sm font-semibold text-foreground">
              Hujjat tarixi
            </p>
          </div>
          <div class="divide-y divide-border">
            <div
              v-for="(item, index) in selectedProviderApplicationHistory"
              :key="`${item.label}-${item.date}-${index}`"
              class="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p class="text-sm font-medium text-foreground">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  Amal bajargan: {{ item.actor }}
                </p>
              </div>
              <p class="text-sm font-medium text-muted-foreground sm:text-right">
                {{ item.date }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      v-else-if="isChildrenApplicationViewPage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden border-0 bg-transparent shadow-none"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-y-auto p-0 pb-6"
      title=""
      description=""
    >
      <div class="ei-detail-toolbar flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            class="h-10 gap-2"
            @click="router.push('/apps/ei/children/applications')"
          >
            <ChevronLeft class="h-4 w-4" />
            Ortga
          </Button>
          <div
            v-if="selectedChildApplication"
            class="min-w-0"
          >
            <p class="truncate text-sm font-semibold text-foreground">
              Bola arizasini ko'rish
            </p>
            <p class="mt-1 truncate text-sm text-muted-foreground">
              {{ selectedChildApplication.id }} · {{ getChildServiceUserName(selectedChildApplication) }}
            </p>
          </div>
        </div>

        <div
          v-if="selectedChildApplication"
          class="flex flex-wrap items-center gap-2"
        >
          <div class="inline-flex rounded-lg border border-border bg-background p-0.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              :class="childApplicationViewMode === 'sections' ? 'h-8 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'h-8 px-3'"
              @click="childApplicationViewMode = 'sections'"
            >
              Ketma-ket
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              :class="childApplicationViewMode === 'tabs' ? 'h-8 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'h-8 px-3'"
              @click="childApplicationViewMode = 'tabs'"
            >
              Tablar
            </Button>
          </div>

          <span :class="cn('inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[selectedChildApplication.tone])">
            {{ selectedChildApplication.status }}
          </span>
        </div>
      </div>

      <div
        v-if="!selectedChildApplication || !selectedChildApplicationDetail"
        class="flex min-h-[24rem] items-center justify-center rounded-lg border border-border bg-card p-8 text-center"
      >
        <div class="max-w-md">
          <p class="text-sm font-medium text-foreground">
            Ariza topilmadi
          </p>
          <p class="mt-2 text-sm text-muted-foreground">
            Berilgan ID bo'yicha bola arizasi mavjud emas yoki ro'yxatdan olib tashlangan.
          </p>
          <Button
            variant="outline"
            class="mt-4"
            @click="router.push('/apps/ei/children/applications')"
          >
            Arizalarga qaytish
          </Button>
        </div>
      </div>

      <div
        v-else
        class="ei-detail-view grid gap-4"
      >
        <div
          v-if="childApplicationViewMode === 'tabs'"
          class="inline-flex w-full overflow-x-auto rounded-lg border border-border bg-card p-1 sm:w-fit"
        >
          <Button
            v-for="tab in childApplicationDetailTabs"
            :key="tab.value"
            type="button"
            variant="ghost"
            size="sm"
            :class="selectedChildApplicationDetailTab === tab.value ? 'h-9 shrink-0 gap-2 bg-primary px-3 text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'h-9 shrink-0 gap-2 px-3'"
            @click="selectedChildApplicationDetailTab = tab.value"
          >
            <span>{{ tab.label }}</span>
            <span :class="selectedChildApplicationDetailTab === tab.value ? 'rounded-full bg-primary-foreground/20 px-1.5 text-[11px]' : 'rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground'">
              {{ tab.count }}
            </span>
          </Button>
        </div>

        <div
          v-if="shouldShowChildApplicationTab('main')"
          class="rounded-lg border border-border bg-card"
        >
          <div class="border-b border-border px-4 py-3">
            <p class="text-sm font-semibold text-foreground">
              Ariza ma'lumotlari
            </p>
          </div>
          <div class="overflow-hidden">
            <table class="w-full border-separate border-spacing-0 text-sm">
              <tbody>
                <tr
              v-for="field in selectedChildApplicationDetail.application"
              :key="`application-${field.label}`"
                  class="border-b border-border last:border-b-0"
            >
                  <td class="w-72 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                {{ field.label }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
              <span
                v-if="field.kind"
                :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getDetailFieldBadgeClass(field.kind))"
              >
                {{ field.value }}
              </span>
              <p
                v-else
                class="break-words font-medium text-foreground"
              >
                {{ field.value }}
              </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="shouldShowChildApplicationTab('main') || shouldShowChildApplicationTab('basis')"
          class="grid gap-4"
        >
          <div
            v-if="shouldShowChildApplicationTab('main')"
            class="rounded-lg border border-border bg-card"
          >
            <div class="border-b border-border px-4 py-3">
              <p class="text-sm font-semibold text-foreground">
                Arizani qabul qiluvchi ma'lumotlari
              </p>
            </div>
            <div
              v-if="selectedChildApplicationDetail.receiver"
              class="space-y-4 p-4"
            >
              <div class="flex items-center gap-3">
                <img
                  :src="selectedChildApplicationDetail.receiver.photo"
                  alt=""
                  class="h-14 w-14 rounded-full border border-border object-cover"
                >
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-foreground">
                    {{ formatName(selectedChildApplicationDetail.receiver.fullName) }}
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    JSHSHIR: {{ selectedChildApplicationDetail.receiver.pinfl }}
                  </p>
                </div>
              </div>
              <div class="-mx-4 overflow-hidden border-t border-border">
                <table class="w-full border-separate border-spacing-0 text-sm">
                  <tbody>
                    <tr
                      v-for="field in selectedChildApplicationReceiverFields"
                      :key="`receiver-${field.label}`"
                      class="border-b border-border last:border-b-0"
                    >
                      <td class="w-56 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                        {{ field.label }}
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top font-medium text-foreground">
                        {{ field.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p
              v-else
              class="p-4 text-sm text-muted-foreground"
            >
              Ariza beruvchi tomonidan mustaqil yuborilgan.
            </p>
          </div>

          <div
            v-if="shouldShowChildApplicationTab('basis')"
            class="rounded-lg border border-border bg-card"
          >
            <div class="border-b border-border px-4 py-3">
              <p class="text-sm font-semibold text-foreground">
                Xizmatdan foydalanish uchun asos
              </p>
            </div>
            <div class="overflow-hidden">
              <table class="w-full border-separate border-spacing-0 text-sm">
                <tbody>
                  <tr
                v-for="field in selectedChildApplicationDetail.basis"
                :key="`basis-${field.label}`"
                    class="border-b border-border last:border-b-0"
              >
                    <td class="w-72 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                  {{ field.label }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                <span
                  v-if="field.kind"
                  :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getDetailFieldBadgeClass(field.kind))"
                >
                  {{ field.value }}
                </span>
                <p
                  v-else
                  class="break-words font-medium text-foreground"
                >
                  {{ field.value }}
                </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div
          v-if="shouldShowChildApplicationTab('main')"
          class="grid gap-4"
        >
          <div
            v-for="personSection in selectedChildApplicationPersonSections"
            :key="personSection.key"
            class="rounded-lg border border-border bg-card"
          >
            <div class="border-b border-border px-4 py-3">
              <p class="text-sm font-semibold text-foreground">
                {{ personSection.title }}
              </p>
            </div>
            <div class="space-y-4 p-4">
              <div class="flex items-center gap-3">
                <img
                  :src="personSection.data.photo"
                  alt=""
                  class="h-14 w-14 rounded-full border border-border object-cover"
                >
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold text-foreground">
                    {{ personSection.data.fields[0]?.value }}
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    JSHSHIR: {{ personSection.data.fields[1]?.value }}
                  </p>
                </div>
              </div>
              <div class="-mx-4 overflow-hidden border-t border-border">
                <table class="w-full border-separate border-spacing-0 text-sm">
                  <tbody>
                    <tr
                  v-for="field in personSection.data.fields"
                  :key="`${personSection.key}-${field.label}`"
                      class="border-b border-border last:border-b-0"
                >
                      <td class="w-56 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                    {{ field.label }}
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top font-medium text-foreground">
                    {{ field.value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="shouldShowChildApplicationTab('process')"
          v-for="section in selectedChildApplicationLinkedSections"
          :key="section.key"
          class="rounded-lg border border-border bg-card"
        >
          <div class="border-b border-border px-4 py-3">
            <p class="text-sm font-semibold text-foreground">
              {{ section.title }}
            </p>
          </div>
          <div class="overflow-hidden">
            <table class="w-full border-separate border-spacing-0 text-sm">
              <tbody>
                <tr
              v-for="field in section.fields"
              :key="`${section.key}-${field.label}`"
                  class="border-b border-border last:border-b-0"
            >
                  <td class="w-72 border-b border-r border-border bg-muted/35 px-4 py-3 align-top text-xs font-medium text-muted-foreground">
                {{ field.label }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
              <span
                v-if="field.kind"
                :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getDetailFieldBadgeClass(field.kind))"
              >
                {{ field.value }}
              </span>
              <p
                v-else
                class="break-words font-medium text-foreground"
              >
                {{ field.value }}
              </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="shouldShowChildApplicationTab('history')"
          class="rounded-lg border border-border bg-card"
        >
          <div class="border-b border-border px-4 py-3">
            <p class="text-sm font-semibold text-foreground">
              Hujjat tarixi
            </p>
          </div>
          <div class="divide-y divide-border">
            <div
              v-for="(item, index) in selectedChildApplicationDetail.history"
              :key="`${item.label}-${item.date}-${index}`"
              class="grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p class="text-sm font-medium text-foreground">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  Amal bajargan: {{ selectedChildApplication ? (index === 0 ? getChildApplicationApplicantName(selectedChildApplication) : selectedChildApplication.owner) : '-' }}
                </p>
              </div>
              <p class="text-sm font-medium text-muted-foreground sm:text-right">
                {{ item.date }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      v-else-if="isProvidersApplicationsReportPage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible p-5"
      title=""
      description=""
    >
      <div class="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-4 overflow-visible">
        <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-center gap-2">
            <Button
              v-if="selectedProviderApplicationReportRegion"
              variant="outline"
              class="h-10 gap-2"
              @click="closeProviderApplicationReportRegion"
            >
              <ChevronLeft class="h-4 w-4" />
              Ortga
            </Button>
            <span
              v-if="selectedProviderApplicationReportRegion"
              class="truncate text-sm font-medium text-muted-foreground"
            >
              {{ selectedProviderApplicationReportRegion }} tumanlari kesimi
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <FilterPopover
              v-model:open="isProviderApplicationReportFilterOpen"
              :active-count="activeProviderApplicationReportFilterCount"
            >
              <div class="flex flex-col gap-3">
                <FilterDateInput
                  v-model="draftProviderApplicationReportStartDate"
                  label="Boshlanish sanasi"
                />

                <FilterDateInput
                  v-model="draftProviderApplicationReportEndDate"
                  label="Tugash sanasi"
                />
              </div>

              <template #footer>
                <div class="flex justify-end gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="activeProviderApplicationReportFilterCount === 0 && !hasPendingProviderApplicationReportFilterChanges"
                    @click="clearProviderApplicationReportFilters"
                  >
                    Tozalash
                  </Button>
                  <Button
                    size="sm"
                    @click="applyProviderApplicationReportFilters"
                  >
                    Qo'llash
                  </Button>
                </div>
              </template>
            </FilterPopover>

            <Button
              variant="outline"
              class="h-10 gap-2"
              :disabled="isExportingRecords"
              @click="downloadProviderApplicationReportAsExcel"
            >
              <Download class="h-4 w-4" />
              <span>{{ isExportingRecords ? 'Yuklanmoqda' : 'Yuklab olish' }}</span>
            </Button>
          </div>
        </div>

        <div class="relative flex min-h-[calc(100vh-16rem)] flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
          <div class="min-h-[22rem] flex-1 overflow-auto">
            <table class="w-full min-w-[900px] border-separate border-spacing-0 text-sm">
              <thead class="bg-muted/45 text-left text-muted-foreground">
                <tr>
                  <th
                    rowspan="2"
                    class="sticky left-0 top-0 z-50 h-24 w-72 min-w-72 max-w-72 border-b border-r border-border bg-muted px-4 py-0 text-xs font-semibold uppercase tracking-wide"
                  >
                    {{ providerApplicationReportFirstColumnLabel }}
                  </th>
                  <th
                    rowspan="2"
                    class="sticky top-0 z-40 h-24 min-w-28 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    Barcha arizalar
                  </th>
                  <th
                    :colspan="providerApplicationReportStatuses.length"
                    class="sticky top-0 z-40 h-12 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide"
                  >
                    Bosqichlari bo'yicha
                  </th>
                </tr>
                <tr>
                  <th
                    v-for="status in providerApplicationReportStatuses"
                    :key="status"
                    class="sticky top-12 z-40 h-12 min-w-36 border-b border-r border-border bg-muted px-4 py-0 text-center text-xs font-semibold uppercase tracking-wide last:border-r-0"
                  >
                    {{ status }}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="row in providerApplicationReportDisplayRows"
                  :key="`provider-report-${row.region}`"
                  :class="[
                    'transition-colors duration-200 ease-out hover:bg-muted/25',
                    row.isTotal ? 'bg-muted/35' : '',
                  ]"
                >
                  <td
                    :class="[
                      'sticky left-0 z-20 w-72 min-w-72 max-w-72 border-b border-r border-border px-4 py-3 font-medium text-foreground',
                      row.isTotal ? 'bg-muted font-semibold' : 'bg-card',
                    ]"
                  >
                    <button
                      type="button"
                      :disabled="row.isTotal || Boolean(selectedProviderApplicationReportRegion)"
                      :class="[
                        'inline-flex items-center text-left transition-colors duration-200 ease-out',
                        !row.isTotal && !selectedProviderApplicationReportRegion
                          ? 'cursor-pointer hover:text-primary focus-visible:outline-none focus-visible:text-primary'
                          : 'cursor-default disabled:opacity-100',
                      ]"
                      @click="toggleProviderApplicationReportRegion(row)"
                    >
                      {{ row.region }}
                    </button>
                  </td>
                  <td
                    :class="[
                      'select-none border-b border-r border-border px-4 py-3 text-center font-semibold tabular-nums text-foreground transition-colors duration-150 ease-out',
                      getProviderApplicationReportCellClass(row.region, 'total', 'Barcha arizalar'),
                    ]"
                    @mousedown="handleProviderApplicationReportCellMouseDown($event, row.region, 'total', 'Barcha arizalar', row.total)"
                    @mouseenter="handleProviderApplicationReportCellMouseEnter(row.region, 'total', 'Barcha arizalar', row.total)"
                    @click="handleProviderApplicationReportCellClick($event, row.region, 'total', 'Barcha arizalar', row.total)"
                  >
                    {{ row.total }}
                  </td>
                  <td
                    v-for="status in providerApplicationReportStatuses"
                    :key="`${row.region}-${status}`"
                    :class="[
                      'select-none border-b border-r border-border px-4 py-3 text-center transition-colors duration-150 ease-out last:border-r-0',
                      getProviderApplicationReportCellClass(row.region, 'status', status),
                    ]"
                    @mousedown="handleProviderApplicationReportCellMouseDown($event, row.region, 'status', status, row.statuses[status] ?? 0)"
                    @mouseenter="handleProviderApplicationReportCellMouseEnter(row.region, 'status', status, row.statuses[status] ?? 0)"
                    @click="handleProviderApplicationReportCellClick($event, row.region, 'status', status, row.statuses[status] ?? 0)"
                  >
                    <span :class="cn('inline-flex min-w-10 justify-center rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums', getProviderApplicationReportStatusClasses(status))">
                      {{ row.statuses[status] }}
                    </span>
                  </td>
                </tr>
                <tr v-if="providerApplicationReportDisplayRows.length === 1 && selectedProviderApplicationReportRegion">
                  <td
                    :colspan="providerApplicationReportStatuses.length + 2"
                    class="border-b border-border px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    Ushbu hudud bo'yicha tuman ma'lumoti topilmadi.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="border-t border-border bg-card px-3 py-2">
            <div
              v-if="providerApplicationReportSelectionAnalytics.count > 0"
              class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between"
            >
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Tanlangan:
                  <strong class="font-semibold text-foreground">{{ providerApplicationReportSelectionAnalytics.count }} ta</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Jami:
                  <strong class="font-semibold text-foreground">{{ providerApplicationReportSelectionAnalytics.sum }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Minimum:
                  <strong class="font-semibold text-foreground">{{ providerApplicationReportSelectionAnalytics.min }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  Maksimum:
                  <strong class="font-semibold text-foreground">{{ providerApplicationReportSelectionAnalytics.max }}</strong>
                </span>
                <span class="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-sm text-muted-foreground">
                  O'rtacha:
                  <strong class="font-semibold text-foreground">{{ providerApplicationReportSelectionAnalytics.average.toFixed(1) }}</strong>
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                class="h-8 shrink-0"
                @click="clearProviderApplicationReportCellSelection"
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
    </SectionBlock>

    <SectionBlock
      v-else-if="isServiceAttendanceDayPage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-visible p-5"
      title=""
      description=""
    >
      <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex min-w-0 items-center gap-3">
          <Button
            variant="outline"
            class="h-10 gap-2"
            @click="router.push('/apps/ei/service/attendance')"
          >
            <ChevronLeft class="h-4 w-4" />
            Ortga
          </Button>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-foreground">
              {{ formatDate(attendanceDayRouteDate) }}
            </p>
            <p class="mt-1 truncate text-xs text-muted-foreground">
              {{ attendanceScopeLabel }}
            </p>
          </div>
        </div>

        <div class="inline-flex w-full rounded-lg border border-border bg-background p-0.5 sm:w-auto">
          <Button
            v-for="tab in attendanceListTabs"
            :key="tab.value"
            type="button"
            variant="ghost"
            size="sm"
            :class="selectedAttendanceListTab === tab.value ? 'h-8 flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground sm:flex-none' : 'h-8 flex-1 gap-2 sm:flex-none'"
            @click="selectedAttendanceListTab = tab.value"
          >
            <span>{{ tab.label }}</span>
            <span :class="selectedAttendanceListTab === tab.value ? 'rounded-full bg-primary-foreground/20 px-1.5 text-[11px]' : 'rounded-full bg-muted px-1.5 text-[11px] text-muted-foreground'">
              {{ tab.count }}
            </span>
          </Button>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-border bg-card">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[1120px] border-separate border-spacing-0 text-sm">
            <thead class="bg-muted/45 text-left text-muted-foreground">
              <tr>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Hujjat
                </th>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Xizmatdan foydalanuvchi
                </th>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Qonuniy vakil
                </th>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Tadbirkor
                </th>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Manzil
                </th>
                <th class="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Xizmat ko'rsatilgan soatlar
                </th>
                <th class="w-24 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="selectedAttendanceDayTableRecords.length === 0">
                <td
                  colspan="7"
                  class="border-b border-border px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  Tanlangan kun va tab bo'yicha ma'lumot topilmadi.
                </td>
              </tr>
              <tr
                v-for="record in selectedAttendanceDayTableRecords"
                :key="record.id"
                class="transition-colors duration-200 ease-out hover:bg-muted/30"
              >
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ record.id }}
                  </div>
                  <div class="mt-1 text-muted-foreground">
                    {{ formatDate(record.date) }}
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ formatName(record.childName) }}
                  </div>
                  <div class="mt-1 text-muted-foreground">
                    JSHSHIR: {{ record.childPinfl }}
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ formatName(record.applicantName) }}
                  </div>
                  <div class="mt-1 text-muted-foreground">
                    JSHSHIR: {{ record.applicantPinfl }}
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ record.provider }}
                  </div>
                  <div class="mt-1 text-muted-foreground">
                    STIR: {{ record.tin }}
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ record.region }}
                  </div>
                  <div class="mt-1 text-muted-foreground">
                    {{ record.district }}
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <div class="font-medium text-foreground">
                    {{ record.hours }}/2
                  </div>
                </td>
                <td class="border-b border-border px-4 py-3 align-top">
                  <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                    <DropdownMenuTrigger as-child>
                      <Button
                        variant="outline"
                        size="sm"
                        :class="openActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                      >
                        <Ellipsis class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuPortal>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        :side-offset="6"
                        :collision-padding="12"
                        class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                      >
                        <DropdownMenuItem
                          class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                          @select.prevent="closeActionMenu"
                        >
                          <Eye class="h-4 w-4 shrink-0" />
                          <span>Ko'rish</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      v-else-if="isServiceAttendancePage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-visible p-5"
      title=""
      description=""
    >
      <div class="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              <CalendarDays class="h-5 w-5 text-muted-foreground" />
            </div>
            <div class="ml-1 inline-flex h-10 items-center gap-1 rounded-lg border border-border bg-background p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0"
                @click="shiftAttendanceMonth(-1)"
              >
                <ChevronLeft class="h-4 w-4" />
              </Button>
              <input
                v-model="selectedAttendanceMonth"
                type="month"
                class="h-8 w-36 border-0 bg-transparent px-2 text-sm font-medium text-foreground outline-none"
              >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="h-8 w-8 p-0"
                @click="shiftAttendanceMonth(1)"
              >
                <ChevronRight class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <div class="inline-flex h-10 items-center rounded-lg border border-border bg-background p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                :class="attendanceViewMode === 'calendar' ? 'h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'h-8 gap-2'"
                @click="attendanceViewMode = 'calendar'"
              >
                <CalendarDays class="h-4 w-4" />
                Kalendar
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                :class="attendanceViewMode === 'timesheet' ? 'h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' : 'h-8 gap-2'"
                @click="attendanceViewMode = 'timesheet'"
              >
                <Table2 class="h-4 w-4" />
                Tabel
              </Button>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-border pt-3 xl:flex-row xl:items-end xl:justify-between">
          <div class="min-w-0">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ko‘rish darajasi
            </p>
            <p class="mt-1 truncate text-sm font-semibold text-foreground">
              {{ attendanceScopeLabel }}
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div class="inline-flex h-10 w-full items-center rounded-lg border border-border bg-background p-0.5 sm:w-auto">
              <Button
                v-for="scope in attendanceScopeOptions"
                :key="scope.value"
                type="button"
                variant="ghost"
                size="sm"
                :class="attendanceScopeLevel === scope.value ? 'h-8 flex-1 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground sm:flex-none' : 'h-8 flex-1 sm:flex-none'"
                @click="setAttendanceScopeLevel(scope.value)"
              >
                {{ scope.label }}
              </Button>
            </div>

            <div
              v-if="attendanceScopeLevel !== 'republic'"
              class="min-w-56"
            >
              <FilterSelect
                v-model="selectedAttendanceRegion"
                label="Hudud"
                all-label="Respublika"
                :options="attendanceRegionOptions"
              />
            </div>

            <div
              v-if="attendanceScopeLevel === 'provider'"
              class="min-w-64"
            >
              <FilterSelect
                v-model="selectedAttendanceProvider"
                label="Tadbirkor"
                all-label="Barcha tadbirkorlar"
                :options="attendanceProviderOptions"
                :disabled="!selectedAttendanceRegion"
              />
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <div class="rounded-lg border border-border bg-background px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Reja soat
            </p>
            <p class="mt-1 text-2xl font-semibold text-foreground">
              {{ formatAttendanceHours(attendanceSummary.plannedHours) }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ attendanceSummary.planned }} mashg‘ulot · {{ attendanceSummary.uniqueBeneficiaries }} xizmat oluvchi
            </p>
          </div>
          <div class="rounded-lg border border-border bg-background px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Fakt soat
            </p>
            <p class="mt-1 text-2xl font-semibold text-foreground">
              {{ formatAttendanceHours(attendanceSummary.actualHours) }}
            </p>
            <p
              :class="cn('mt-1 text-xs', attendanceSummary.varianceHours < 0 ? 'text-red-600' : 'text-emerald-600')"
            >
              Rejadan {{ formatSignedAttendanceHours(attendanceSummary.varianceHours) }}
            </p>
          </div>
          <div class="rounded-lg border border-border bg-background px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Bajarilish
            </p>
            <p class="mt-1 text-2xl font-semibold text-foreground">
              {{ formatAttendancePercentage(attendanceSummary.completionRate) }}
            </p>
            <p
              :class="cn('mt-1 text-xs', (attendanceCompletionTrend ?? 0) < 0 ? 'text-red-600' : 'text-muted-foreground')"
            >
              {{ attendanceCompletionTrendLabel }}
            </p>
          </div>
          <div class="rounded-lg border border-border bg-background px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Davomat
            </p>
            <p class="mt-1 text-2xl font-semibold text-emerald-600">
              {{ formatAttendancePercentage(attendanceSummary.attendanceRate) }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ attendanceSummary.present }} kelgan · {{ attendanceSummary.absent }} kelmagan
            </p>
          </div>
          <div class="rounded-lg border border-border bg-background px-4 py-3">
            <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Hisoblanadigan
            </p>
            <p class="mt-1 text-2xl font-semibold text-foreground">
              {{ formatAttendanceHours(attendanceSummary.billableHours) }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              {{ formatAttendanceHours(Math.max(0, attendanceSummary.actualHours - attendanceSummary.billableHours)) }} hisoblanmaydi
            </p>
          </div>
          <div class="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/20">
            <p class="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Muammoli qayd
            </p>
            <p class="mt-1 text-2xl font-semibold text-amber-700 dark:text-amber-300">
              {{ attendanceSummary.issues }}
            </p>
            <p class="mt-1 text-xs text-amber-700/80 dark:text-amber-300/80">
              {{ attendanceSummary.late }} kechikish · {{ attendanceSummary.providers }} tadbirkor
            </p>
          </div>
        </div>
      </div>

      <div
        v-if="attendanceViewMode === 'calendar'"
        class="min-h-[34rem]"
      >
        <div class="overflow-x-auto rounded-lg border border-border bg-card">
          <div class="min-w-[52rem]">
          <div class="grid grid-cols-7 border-b border-border bg-muted/45 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <div
              v-for="weekday in ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']"
              :key="weekday"
              class="border-r border-border px-2 py-3 last:border-r-0"
            >
              {{ weekday }}
            </div>
          </div>

          <div class="grid grid-cols-7">
            <div
              v-for="day in attendanceCalendarDays"
              :key="day.key"
              class="min-h-36 border-b border-r border-border p-2 last:border-r-0"
            >
              <div
                v-if="day.isBlank"
                class="h-full rounded-md bg-muted/20"
              />
              <div
                v-else
                :class="cn('relative flex h-full min-h-32 w-full flex-col rounded-md border p-2 text-left transition-colors duration-200 ease-out', getAttendanceDayClass(day))"
              >
                <div class="flex items-start justify-between gap-2">
                  <span class="text-sm font-semibold text-foreground">{{ day.day }}</span>
                  <Button
                    v-if="day.planned > 0"
                    type="button"
                    variant="outline"
                    size="sm"
                    class="h-7 w-7 rounded-md p-0"
                    :aria-label="`${formatDate(day.date)} bo'yicha kirish`"
                    @click="openAttendanceDay(day.date)"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                </div>
                <span
                  v-if="day.planned > 0"
                  class="mt-2 grid gap-1 text-xs"
                >
                  <span class="flex items-center justify-between gap-2 text-muted-foreground">
                    <span>Reja</span>
                    <strong class="font-semibold text-foreground">{{ formatAttendanceHours(day.plannedHours) }}</strong>
                  </span>
                  <span class="flex items-center justify-between gap-2 text-foreground">
                    <span>Fakt</span>
                    <strong>{{ formatAttendanceHours(day.hours) }} · {{ formatAttendancePercentage(day.completionRate) }}</strong>
                  </span>
                  <span class="flex items-center justify-between gap-2 text-muted-foreground">
                    <span>Davomat</span>
                    <strong class="text-foreground">{{ day.present }}/{{ day.planned }}</strong>
                  </span>
                  <span
                    v-if="day.late > 0 || day.issues > 0"
                    class="flex items-center justify-between gap-2 text-amber-700 dark:text-amber-300"
                  >
                    <span>{{ day.issues > 0 ? 'Muammoli' : 'Kechikdi' }}</span>
                    <strong>{{ day.issues > 0 ? day.issues : day.late }}</strong>
                  </span>
                </span>
                <span
                  v-else
                  class="mt-auto text-xs text-muted-foreground"
                >
                  Reja yo'q
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="overflow-hidden rounded-lg border border-border bg-card"
      >
        <div class="flex flex-col gap-3 border-b border-border bg-muted/25 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm font-semibold text-foreground">
              {{ attendanceTimesheetTitle }}
            </p>
            <p class="mt-1 text-xs text-muted-foreground">
              Katakda fakt soat va kelganlar ulushi ko‘rsatiladi. Qator orqali keyingi darajaga, katak orqali kunlik ro‘yxatga o‘ting.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-sm bg-emerald-100 ring-1 ring-emerald-300" />
              Keldi
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-sm bg-blue-100 ring-1 ring-blue-300" />
              Kechikdi
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-sm bg-red-100 ring-1 ring-red-300" />
              Kelmadi
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-sm bg-amber-100 ring-1 ring-amber-300" />
              Tekshiruv talab etiladi
            </span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-max border-separate border-spacing-0 text-sm">
            <thead class="bg-muted/45 text-muted-foreground">
              <tr>
                <th class="sticky left-0 z-30 min-w-72 border-b border-r border-border bg-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                  {{ attendanceTimesheetFirstColumnLabel }}
                </th>
                <th
                  v-for="day in attendanceMonthDays"
                  :key="`attendance-head-${day}`"
                  class="h-12 min-w-12 border-b border-r border-border px-1 text-center text-xs font-semibold"
                >
                  {{ day }}
                </th>
                <th class="min-w-20 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Reja
                </th>
                <th class="min-w-20 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Fakt
                </th>
                <th class="min-w-20 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Farq
                </th>
                <th class="min-w-24 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Bajarilish
                </th>
                <th class="min-w-28 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Hisoblanadi
                </th>
                <th class="min-w-20 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Kelgan
                </th>
                <th class="min-w-24 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Kelmagan
                </th>
                <th class="min-w-24 border-b border-r border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Kechikdi
                </th>
                <th class="min-w-24 border-b border-border bg-muted px-2 text-center text-xs font-semibold uppercase tracking-wide">
                  Muammoli
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="attendanceTimesheetRows.length === 0">
                <td
                  :colspan="attendanceMonthDays.length + 10"
                  class="px-6 py-16 text-center text-sm text-muted-foreground"
                >
                  Tanlangan oy va filterlar bo'yicha davomat topilmadi.
                </td>
              </tr>
              <tr
                v-for="row in attendanceTimesheetRows"
                :key="row.key"
                class="group"
              >
                <td class="sticky left-0 z-20 border-b border-r border-border bg-card px-4 py-3 group-hover:bg-muted/20">
                  <button
                    v-if="attendanceScopeLevel !== 'provider'"
                    type="button"
                    class="flex w-full items-center justify-between gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    :title="`${row.label} bo‘yicha batafsil ko‘rish`"
                    @click="drillDownAttendanceTimesheetRow(row)"
                  >
                    <span class="min-w-0">
                      <span class="block truncate font-medium text-foreground">{{ row.label }}</span>
                      <span class="mt-1 block text-xs text-muted-foreground">{{ row.meta }}</span>
                    </span>
                    <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                  <div v-else>
                    <p class="font-medium text-foreground">
                      {{ row.label }}
                    </p>
                    <p class="mt-1 text-xs text-muted-foreground">
                      {{ row.meta }}
                    </p>
                  </div>
                </td>
                <td
                  v-for="day in attendanceMonthDays"
                  :key="`${row.key}-${day}`"
                  :class="cn('border-b border-r border-border p-1 text-center', getAttendanceTimesheetCellClass(row.entries[day]))"
                >
                  <button
                    v-if="row.entries[day]"
                    type="button"
                    class="flex h-10 w-full min-w-10 flex-col items-center justify-center rounded text-xs font-semibold outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
                    :title="`${formatAttendanceHours(row.entries[day].plannedHours)} reja; ${formatAttendanceHours(row.entries[day].hours)} fakt; ${formatAttendancePercentage(row.entries[day].completionRate)} bajarilish; ${row.entries[day].present}/${row.entries[day].planned} kelgan; ${row.entries[day].issues} muammoli`"
                    @click="openAttendanceTimesheetCell(row, row.entries[day])"
                  >
                    <span>{{ row.entries[day].hours > 0 ? formatAttendanceHours(row.entries[day].hours) : '—' }}</span>
                    <span
                      v-if="attendanceScopeLevel !== 'provider'"
                      class="text-[10px] font-medium opacity-75"
                    >
                      {{ row.entries[day].present }}/{{ row.entries[day].planned }}
                    </span>
                  </button>
                  <span
                    v-else
                    class="text-muted-foreground/35"
                  >·</span>
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-medium text-foreground">
                  {{ formatAttendanceHours(row.plannedHours) }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-foreground">
                  {{ formatAttendanceHours(row.actualHours) }}
                </td>
                <td
                  :class="cn('border-b border-r border-border bg-muted/20 px-2 text-center font-semibold', row.varianceHours < 0 ? 'text-red-700' : 'text-emerald-700')"
                >
                  {{ formatSignedAttendanceHours(row.varianceHours) }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-foreground">
                  {{ formatAttendancePercentage(row.completionRate) }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-foreground">
                  {{ formatAttendanceHours(row.billableHours) }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-emerald-700">
                  {{ row.present }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-red-700">
                  {{ row.absent }}
                </td>
                <td class="border-b border-r border-border bg-muted/20 px-2 text-center font-semibold text-blue-700">
                  {{ row.late }}
                </td>
                <td class="border-b border-border bg-muted/20 px-2 text-center">
                  <span
                    :class="cn('inline-flex min-w-8 justify-center rounded-full px-2 py-0.5 text-xs font-semibold', row.issues > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-muted text-muted-foreground')"
                  >
                    {{ row.issues }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="attendanceTimesheetRows.length > 0">
              <tr class="bg-muted/50 font-semibold text-foreground">
                <td class="sticky left-0 z-20 border-r border-t border-border bg-muted px-4 py-3 text-left">
                  Jami
                </td>
                <td
                  v-for="day in attendanceMonthDays"
                  :key="`attendance-total-${day}`"
                  class="border-r border-t border-border px-1 py-3 text-center text-xs"
                >
                  {{ (attendanceTimesheetDayTotals[day] ?? 0) > 0 ? formatAttendanceHours(attendanceTimesheetDayTotals[day] ?? 0) : '—' }}
                </td>
                <td class="border-r border-t border-border px-2 text-center">
                  {{ formatAttendanceHours(attendanceTimesheetRows.reduce((total, row) => total + row.plannedHours, 0)) }}
                </td>
                <td class="border-r border-t border-border px-2 text-center">
                  {{ formatAttendanceHours(attendanceSummary.actualHours) }}
                </td>
                <td
                  :class="cn('border-r border-t border-border px-2 text-center', attendanceSummary.varianceHours < 0 ? 'text-red-700' : 'text-emerald-700')"
                >
                  {{ formatSignedAttendanceHours(attendanceSummary.varianceHours) }}
                </td>
                <td class="border-r border-t border-border px-2 text-center">
                  {{ formatAttendancePercentage(attendanceSummary.completionRate) }}
                </td>
                <td class="border-r border-t border-border px-2 text-center">
                  {{ formatAttendanceHours(attendanceSummary.billableHours) }}
                </td>
                <td class="border-r border-t border-border px-2 text-center text-emerald-700">
                  {{ attendanceSummary.present }}
                </td>
                <td class="border-r border-t border-border px-2 text-center text-red-700">
                  {{ attendanceSummary.absent }}
                </td>
                <td class="border-r border-t border-border px-2 text-center text-blue-700">
                  {{ attendanceSummary.late }}
                </td>
                <td class="border-t border-border px-2 text-center text-amber-700">
                  {{ attendanceSummary.issues }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      v-else-if="!isProvidersApplicationsCreatePage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-3 overflow-visible p-0"
      title=""
      description=""
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute z-10 left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Qidirish"
              class="pl-9"
              @update:model-value="currentPage = 1"
            />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <FilterPopover
              v-if="usesProviderFilter"
              v-model:open="isProviderApplicationsFilterOpen"
              wrapper-class="order-1"
              :active-count="activeProviderApplicationFilterCount"
            >
              <div class="flex flex-col gap-3">
                <FilterSelect
                  v-if="isProvidersConclusionsPage"
                  v-model="draftProviderConclusionResult"
                  label="Natija"
                  :options="providerConclusionResultFilterOptions"
                />

                <FilterSelect
                  v-model="draftProviderRegion"
                  label="Hudud"
                  :options="providerApplicationRegionFilterOptions"
                />

                <FilterSelect
                  v-model="draftProviderDistrict"
                  label="Tuman (shahar)"
                  :options="providerApplicationDistrictFilterOptions"
                  :disabled="providerApplicationDistrictFilterOptions.length === 0"
                />

                <FilterDateInput
                  v-model="draftProviderApplicationsStartDate"
                  label="Boshlanish sanasi"
                />

                <FilterDateInput
                  v-model="draftProviderApplicationsEndDate"
                  label="Tugash sanasi"
                />
              </div>

              <template #footer>
                <div class="flex justify-end gap-2 border-t border-border pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="activeProviderApplicationFilterCount === 0 && !hasPendingProviderApplicationFilterChanges"
                    @click="clearProviderApplicationFilters"
                  >
                    Tozalash
                  </Button>
                  <Button
                    size="sm"
                    @click="applyProviderApplicationFilters"
                  >
                    Qo'llash
                  </Button>
                </div>
              </template>
            </FilterPopover>

            <Button
              v-if="isProvidersApplicationsPage"
              size="sm"
              class="order-3 h-7 gap-1.5"
              @click="openCreateDialog"
            >
              <Plus class="h-4 w-4" />
              <span>Yaratish</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="order-2 h-7 gap-1.5"
              :disabled="isExportingRecords || filteredRecords.length === 0"
              @click="downloadRecordsAsExcel"
            >
              <Download class="h-4 w-4" />
              <span>{{ isExportingRecords ? 'Yuklanmoqda' : 'Yuklab olish' }}</span>
            </Button>
          </div>
        </div>

      </div>

      <StatusTabs
        :tabs="statusTabs"
        :selected-values="selectedStatuses"
        :show-indicator="!isProvidersApplicationsPage"
        item-key-prefix="ei-status"
        @select="handleStatusSelect"
      />

      <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
        <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
          <div class="relative flex-1 xl:hidden">
            <div
              v-if="paginatedRecords.length === 0"
              class="flex min-h-[18rem] items-center justify-center px-4 py-10 text-center"
            >
              <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                <p class="text-sm font-medium text-foreground">
                  Ma'lumot topilmadi
                </p>
                <p class="text-sm text-muted-foreground">
                  Qidiruv yoki status filteriga mos yozuv topilmadi.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  class="mt-2"
                  @click="clearSearchAndFilters"
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
                v-for="record in paginatedRecords"
                :key="record.id"
                class="border-border"
              >
                <CardContent class="space-y-4 p-4">
                  <div
                    v-if="usesProviderApplicationsTable || usesChildrenApplicationsTable"
                    class="space-y-4"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="min-w-0">
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Hujjat
                        </p>
                        <p class="mt-1 font-semibold text-foreground">
                          {{ record.id }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                          {{ formatDate(record.submittedAt) }}
                        </p>
                      </div>

                      <span :class="cn('inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[record.tone])">
                        {{ record.status }}
                      </span>
                    </div>

                    <div class="grid gap-3 text-sm">
                      <template v-if="usesChildrenApplicationsTable">
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Xizmatdan foydalanuvchi
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ getChildServiceUserName(record) }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            JSHSHIR: {{ getChildServiceUserPinfl(record) }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ariza beruvchi
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ getChildApplicationApplicantName(record) }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            JSHSHIR: {{ getChildApplicationApplicantPinfl(record) }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Tadbirkor
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ getChildApplicationProviderName(record) }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            INN: {{ getChildApplicationProviderInn(record) }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Manzil
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ record.region }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            {{ record.district }}
                          </p>
                        </div>
                      </template>

                      <template v-else>
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Ariza beruvchi
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ getApplicantName(record) }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          JSHSHIR: {{ getApplicantPinfl(record) }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Tadbirkor
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ formatName(record.title) }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          STIR: {{ record.tin ?? '-' }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Manzil
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ record.region }}
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ record.district }}
                        </p>
                      </div>

                      <div v-if="isProvidersConclusionsPage">
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Natija
                        </p>
                        <span :class="cn('mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getConclusionResultClasses(record))">
                          {{ getConclusionResult(record) }}
                        </span>
                      </div>
                      </template>
                    </div>
                  </div>

                  <template v-else>
                    <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Yozuv
                      </p>
                      <p class="mt-1 font-semibold text-foreground">
                        {{ formatName(record.title) }}
                      </p>
                      <p class="mt-1 text-sm text-muted-foreground">
                        {{ record.id }}
                      </p>
                    </div>

                    <span :class="cn('inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[record.tone])">
                      {{ record.status }}
                    </span>
                  </div>

                  <div class="grid gap-3 text-sm">
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Hujjat turi
                      </p>
                      <p class="mt-1 font-medium text-foreground">
                        {{ record.subject }}
                      </p>
                    </div>

                    <div v-if="isProvidersRegistryPage">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Ariza beruvchi
                      </p>
                      <p class="mt-1 font-medium text-foreground">
                        {{ getApplicantName(record) }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        JSHSHIR: {{ getApplicantPinfl(record) }}
                      </p>
                    </div>

                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Hudud
                      </p>
                      <p class="mt-1 font-medium text-foreground">
                        {{ record.region }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ record.district }}
                      </p>
                    </div>

                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Mas'ul
                      </p>
                      <p class="mt-1 font-medium text-foreground">
                        {{ record.owner }}
                      </p>
                    </div>

                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Muddat
                      </p>
                      <p class="mt-1 font-medium text-foreground">
                        {{ formatDate(record.dueAt) }}
                      </p>
                      <p class="mt-1 text-muted-foreground">
                        {{ formatDate(record.submittedAt) }} dan
                      </p>
                    </div>
                  </div>
                  </template>
                </CardContent>
              </Card>
            </div>
          </div>

          <div class="relative hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
            <table
              v-if="usesProviderApplicationsTable"
              class="w-full border-separate border-spacing-0 text-sm"
              :class="isProvidersConclusionsPage ? 'min-w-[1480px]' : 'min-w-[1360px]'"
            >
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="h-10 whitespace-nowrap rounded-tl-lg border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Hujjat
                  </th>
                  <th class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Ariza beruvchi
                  </th>
                  <th class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Tadbirkor
                  </th>
                  <th class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Manzil
                  </th>
                  <th
                    v-if="isProvidersConclusionsPage"
                    class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground"
                  >
                    Natija
                  </th>
                  <th class="h-10 whitespace-nowrap border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Holat
                  </th>
                  <th class="h-10 w-24 whitespace-nowrap rounded-tr-lg border-b border-border px-2 text-left align-middle text-sm font-medium text-foreground">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedRecords.length === 0">
                  <td
                    :colspan="isProvidersConclusionsPage ? 7 : 6"
                    class="border-b border-border px-4 py-12 text-center"
                  >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                      <p class="text-sm font-medium text-foreground">
                        Ma'lumot topilmadi
                      </p>
                      <p class="text-sm text-muted-foreground">
                        Qidiruv yoki status filteriga mos yozuv topilmadi.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        class="mt-2"
                        @click="clearSearchAndFilters"
                      >
                        Tozalash
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="record in paginatedRecords"
                  :key="record.id"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <div class="font-medium text-foreground">
                      {{ record.id }}
                    </div>
                    <div class="mt-0.5 text-xs text-muted-foreground">
                      {{ formatDate(record.submittedAt) }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <div class="font-medium text-foreground">
                      {{ getApplicantName(record) }}
                    </div>
                    <div class="mt-0.5 text-xs text-muted-foreground">
                      JSHSHIR: {{ getApplicantPinfl(record) }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <div class="font-medium text-foreground">
                      {{ formatName(record.title) }}
                    </div>
                    <div class="mt-0.5 text-xs text-muted-foreground">
                      STIR: {{ record.tin ?? '-' }}
                    </div>
                  </td>
                  <td class="whitespace-nowrap border-b border-border p-2 align-middle">
                    <div class="font-medium text-foreground">
                      {{ record.region }}
                    </div>
                    <div class="mt-0.5 text-xs text-muted-foreground">
                      {{ record.district }}
                    </div>
                  </td>
                  <td
                    v-if="isProvidersConclusionsPage"
                    class="whitespace-nowrap border-b border-border p-2 align-middle"
                  >
                    <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', getConclusionResultClasses(record))">
                      {{ getConclusionResult(record) }}
                    </span>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[record.tone])">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openActionMenuId === record.id ? 'h-7 w-7 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-7 w-7 rounded-md p-0'"
                        >
                          <Ellipsis class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="isProvidersApplicationsPage ? openProviderApplication(record) : closeActionMenu()"
                          >
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="isProvidersApplicationsPage && record.status === 'Yangi'"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <FilePenLine class="h-4 w-4 shrink-0" />
                            <span>O‘rganish uchun yuborish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canEditAndSendConclusion(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <FilePenLine class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canEditAndSendConclusion(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <Send class="h-4 w-4 shrink-0" />
                            <span>Yuborish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canReviewConclusion(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <RotateCcw class="h-4 w-4 shrink-0" />
                            <span>Qaytarish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canReviewConclusion(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <Check class="h-4 w-4 shrink-0" />
                            <span>Qabul qilish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              v-else-if="usesChildrenApplicationsTable"
              class="min-w-[1320px] border-separate border-spacing-0 text-sm xl:min-w-full"
            >
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Hujjat
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Xizmatdan foydalanuvchi
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Ariza beruvchi
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Tadbirkor
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Manzil
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Holat
                  </th>
                  <th class="w-24 rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedRecords.length === 0">
                  <td
                    colspan="7"
                    class="border-b border-border px-4 py-12 text-center"
                  >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                      <p class="text-sm font-medium text-foreground">
                        Ma'lumot topilmadi
                      </p>
                      <p class="text-sm text-muted-foreground">
                        Qidiruv yoki status filteriga mos yozuv topilmadi.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        class="mt-2"
                        @click="clearSearchAndFilters"
                      >
                        Tozalash
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="record in paginatedRecords"
                  :key="record.id"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ record.id }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      {{ formatDate(record.submittedAt) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ getChildServiceUserName(record) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      JSHSHIR: {{ getChildServiceUserPinfl(record) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ getChildApplicationApplicantName(record) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      JSHSHIR: {{ getChildApplicationApplicantPinfl(record) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ getChildApplicationProviderName(record) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      INN: {{ getChildApplicationProviderInn(record) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ record.region }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      {{ record.district }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[record.tone])">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <Ellipsis class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="openChildApplication(record)"
                          >
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canCreateChildVoucherOrder(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="createChildVoucherOrder(record)"
                          >
                            <Send class="h-4 w-4 shrink-0" />
                            <span>Buyurtma shakllantirish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canRunChildApplicationDecision(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="createChildApplicationVoucher(record)"
                          >
                            <Send class="h-4 w-4 shrink-0" />
                            <span>Vaucher shakllantirish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            v-if="canRunChildApplicationDecision(record)"
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-destructive/10"
                            @select.prevent="rejectChildApplication(record)"
                          >
                            <RotateCcw class="h-4 w-4 shrink-0" />
                            <span>Rad etish</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              v-else
              class="border-separate border-spacing-0 text-sm xl:min-w-full"
              :class="isProvidersRegistryPage ? 'min-w-[1380px]' : 'min-w-[1220px]'"
            >
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Yozuv
                  </th>
                  <th
                    v-if="isProvidersRegistryPage"
                    class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                  >
                    Ariza beruvchi
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Hudud
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Mas'ul
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Status
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Muddat
                  </th>
                  <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Keyingi amal
                  </th>
                  <th class="w-24 rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="paginatedRecords.length === 0">
                  <td
                    :colspan="isProvidersRegistryPage ? 8 : 7"
                    class="border-b border-border px-4 py-12 text-center"
                  >
                    <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                      <p class="text-sm font-medium text-foreground">
                        Ma'lumot topilmadi
                      </p>
                      <p class="text-sm text-muted-foreground">
                        Qidiruv yoki status filteriga mos yozuv topilmadi.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        class="mt-2"
                        @click="clearSearchAndFilters"
                      >
                        Tozalash
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="record in paginatedRecords"
                  :key="record.id"
                  class="transition-colors duration-200 ease-out hover:bg-muted/30"
                >
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ formatName(record.title) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      {{ record.id }} · {{ record.subject }}
                    </div>
                  </td>
                  <td
                    v-if="isProvidersRegistryPage"
                    class="border-b border-border px-4 py-3 align-top"
                  >
                    <div class="font-medium text-foreground">
                      {{ getApplicantName(record) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      JSHSHIR: {{ getApplicantPinfl(record) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ record.region }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      {{ record.district }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-foreground">
                    {{ record.owner }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <span :class="cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', eiStatusClasses[record.tone])">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ formatDate(record.dueAt) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      {{ formatDate(record.submittedAt) }} dan
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">
                    {{ record.nextAction }}
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <DropdownMenuRoot @update:open="setActionMenuOpen(record.id, $event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="openActionMenuId === record.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                        >
                          <Ellipsis class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="bottom"
                          align="end"
                          :side-offset="6"
                          :collision-padding="12"
                          class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <Eye class="h-4 w-4 shrink-0" />
                            <span>Ko'rish</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                            @select.prevent="closeActionMenu"
                          >
                            <FilePenLine class="h-4 w-4 shrink-0" />
                            <span>Tahrirlash</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
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

              <div class="flex items-center gap-2">
                <span class="text-muted-foreground">Sahifada:</span>
                <span class="font-medium text-foreground">{{ paginationSummary }}</span>
              </div>
            </div>

            <div class="inline-flex h-9 w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-0.5 min-[480px]:w-auto min-[480px]:justify-start">
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0 self-center"
                :disabled="currentPage === 1"
                aria-label="Birinchi sahifa"
                @click="goToPage(1)"
              >
                <ChevronsLeft class="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0 self-center"
                :disabled="currentPage === 1"
                aria-label="Oldingi sahifa"
                @click="goToPage(currentPage - 1)"
              >
                <ChevronLeft class="h-5 w-5" />
              </Button>
              <div class="mx-1 flex h-7 min-w-14 items-center justify-center text-center text-sm font-semibold text-foreground">
                {{ currentPageSummary }}
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0 self-center"
                :disabled="currentPage === totalPages"
                aria-label="Keyingi sahifa"
                @click="goToPage(currentPage + 1)"
              >
                <ChevronRight class="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0 self-center"
                :disabled="currentPage === totalPages"
                aria-label="Oxirgi sahifa"
                @click="goToPage(totalPages)"
              >
                <ChevronsRight class="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SectionBlock>

    <SectionBlock
      v-else
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible p-5"
      title=""
      description=""
    >
      <form
        class="flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground"
        @submit.prevent="submitProviderApplicationForm"
      >
        <div class="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-foreground">
              Xizmat ko‘rsatuvchi arizasini yaratish
            </h2>
          </div>
        </div>

        <div class="space-y-6 px-5 py-5 sm:px-6">
          <section class="space-y-4">
            <div>
              <p class="text-base font-semibold text-foreground">
                Ariza beruvchi
              </p>
            </div>

            <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">JSHSHIR</span>
                <Input
                  :model-value="providerApplicationForm.applicantPinfl"
                  inputmode="numeric"
                  maxlength="14"
                  autocomplete="off"
                  placeholder="11111111111111"
                  class="h-11"
                  @update:model-value="updateProviderApplicationPinfl(String($event ?? ''))"
                  @keydown.enter.prevent="searchProviderApplicationApplicant"
                />
              </label>

              <Button
                type="button"
                class="h-11 gap-2"
                :disabled="providerApplicationForm.applicantPinfl.length !== 14"
                @click="searchProviderApplicationApplicant"
              >
                <Search class="h-4 w-4" />
                <span>Qidirish</span>
              </Button>
            </div>

            <p
              v-if="providerApplicationFormErrors.applicantPinfl"
              class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.applicantPinfl }}
            </p>
            <p
              v-if="providerApplicationFormErrors.applicantFullName"
              class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.applicantFullName }}
            </p>

            <div
              v-if="isProviderApplicationApplicantFound"
              class="grid gap-4 rounded-lg border border-border bg-muted/20 p-4 md:grid-cols-[136px_1fr]"
            >
              <div class="flex flex-col items-center justify-center rounded-lg border border-border bg-card px-3 py-4">
                <div class="flex h-28 w-20 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-muted">
                  <img
                    :src="providerApplicationForm.applicantPhoto"
                    alt="Ariza beruvchi rasmi"
                    class="h-full w-full object-cover"
                  >
                </div>
                <p class="mt-2 text-center text-sm text-muted-foreground">
                  Rasm
                </p>
              </div>

              <div class="overflow-hidden rounded-lg border border-border bg-card">
                <table class="w-full border-collapse text-sm">
                  <tbody>
                    <tr
                      v-for="[label, value] in providerApplicationApplicantRows"
                      :key="label"
                      class="border-b border-border last:border-b-0"
                    >
                      <td class="w-44 bg-muted/40 px-4 py-3 font-medium text-muted-foreground">
                        {{ label }}
                      </td>
                      <td class="px-4 py-3 font-medium text-foreground">
                        {{ value }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            v-if="isProviderApplicationApplicantFound"
            class="space-y-4 border-t border-border pt-5"
          >
            <div>
              <p class="text-base font-semibold text-foreground">
                Manzil ma'lumoti
              </p>
            </div>

            <div class="rounded-lg border border-border/70 bg-card p-4">
              <div class="grid gap-4 md:grid-cols-3">
                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Hudud</span>
                  <select
                    :value="providerApplicationForm.applicantAddressRegion"
                    class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring"
                    @change="updateProviderApplicationAddressRegion(getEventValue($event))"
                  >
                    <option value="">
                      Tanlang
                    </option>
                    <option
                      v-for="region in providerApplicationRegionOptions"
                      :key="region"
                      :value="region"
                    >
                      {{ region }}
                    </option>
                  </select>
                  <p
                    v-if="providerApplicationFormErrors.applicantAddressRegion"
                    class="text-xs text-destructive"
                  >
                    {{ providerApplicationFormErrors.applicantAddressRegion }}
                  </p>
                </label>

                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">Tuman (shahar)</span>
                  <select
                    :value="providerApplicationForm.applicantAddressDistrict"
                    :disabled="!providerApplicationForm.applicantAddressRegion"
                    class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring"
                    @change="updateProviderApplicationAddressDistrict(getEventValue($event))"
                  >
                    <option value="">
                      Tanlang
                    </option>
                    <option
                      v-for="district in providerApplicationDistrictOptions"
                      :key="district"
                      :value="district"
                    >
                      {{ district }}
                    </option>
                  </select>
                  <p
                    v-if="providerApplicationFormErrors.applicantAddressDistrict"
                    class="text-xs text-destructive"
                  >
                    {{ providerApplicationFormErrors.applicantAddressDistrict }}
                  </p>
                </label>

                <label class="space-y-2">
                  <span class="text-sm font-medium text-foreground">MFY</span>
                  <select
                    :value="providerApplicationForm.applicantAddressMahalla"
                    :disabled="!providerApplicationForm.applicantAddressDistrict"
                    class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring"
                    @change="updateProviderApplicationAddressMahalla(getEventValue($event))"
                  >
                    <option value="">
                      Tanlang
                    </option>
                    <option
                      v-for="mahalla in providerApplicationMahallaOptions"
                      :key="mahalla"
                      :value="mahalla"
                    >
                      {{ mahalla }}
                    </option>
                  </select>
                  <p
                    v-if="providerApplicationFormErrors.applicantAddressMahalla"
                    class="text-xs text-destructive"
                  >
                    {{ providerApplicationFormErrors.applicantAddressMahalla }}
                  </p>
                </label>

                <label class="space-y-2 md:col-span-3">
                  <span class="text-sm font-medium text-foreground">To‘liq manzil</span>
                  <Input
                    v-model="providerApplicationForm.applicantAddressFull"
                    placeholder="Ko‘cha, uy yoki mo‘ljal"
                    class="h-10"
                  />
                  <p
                    v-if="providerApplicationFormErrors.applicantAddressFull"
                    class="text-xs text-destructive"
                  >
                    {{ providerApplicationFormErrors.applicantAddressFull }}
                  </p>
                </label>
              </div>
            </div>
          </section>

          <section
            v-if="isProviderApplicationApplicantFound && isProviderApplicationAddressComplete"
            class="space-y-4 border-t border-border pt-5"
          >
            <div>
              <p class="text-base font-semibold text-foreground">
                Tadbirkorlik subyekti
              </p>
            </div>

            <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">STIR</span>
                <Input
                  :model-value="providerApplicationForm.tin"
                  inputmode="numeric"
                  maxlength="9"
                  autocomplete="off"
                  placeholder="111111111"
                  class="h-11"
                  @update:model-value="updateProviderApplicationTin(String($event ?? ''))"
                  @keydown.enter.prevent="searchProviderApplicationBusiness"
                />
              </label>

              <Button
                type="button"
                class="h-11 gap-2"
                :disabled="providerApplicationForm.tin.length !== 9"
                @click="searchProviderApplicationBusiness"
              >
                <Search class="h-4 w-4" />
                <span>Qidirish</span>
              </Button>
            </div>

            <p
              v-if="providerApplicationFormErrors.tin"
              class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.tin }}
            </p>
            <p
              v-if="providerApplicationFormErrors.organizationName"
              class="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.organizationName }}
            </p>

            <div
              v-if="isProviderApplicationBusinessFound"
              class="overflow-hidden rounded-lg border border-border bg-card"
            >
              <table class="w-full border-collapse text-sm">
                <tbody>
                  <tr
                    v-for="row in providerApplicationBusinessRows"
                    :key="row.label"
                    class="border-b border-border last:border-b-0"
                  >
                    <td class="w-64 bg-muted/40 px-4 py-3 font-medium text-muted-foreground">
                      {{ row.label }}
                    </td>
                    <td class="px-4 py-3 font-medium text-foreground">
                      <span
                        v-if="row.kind === 'status'"
                        :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', getProviderApplicationStatusClasses(row.value))"
                      >
                        {{ row.value }}
                      </span>
                      <span v-else>
                        {{ row.value }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div class="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            @click="closeCreateProviderApplicationDialog"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            :disabled="!isProviderApplicationReadyToSave"
          >
            Saqlash
          </Button>
        </div>
      </form>
    </SectionBlock>
  </PageContainer>
</template>

<style scoped>
.ei-detail-toolbar {
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(15, 23, 18, 0.04);
}

.ei-detail-view :deep(.rounded-lg.border.border-border.bg-card) {
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(15, 23, 18, 0.035);
}

.ei-detail-view :deep(table) {
  font-size: 0.875rem;
  border-collapse: separate;
  border-spacing: 0;
}

.ei-detail-view :deep(tbody tr) {
  transition: background-color 160ms ease;
}

.ei-detail-view :deep(tbody tr:hover) {
  background: color-mix(in oklab, var(--muted) 65%, transparent);
}

.ei-detail-view :deep(td:first-child) {
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--muted);
  padding: 0.625rem 1rem;
  color: var(--muted-foreground);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0;
}

.ei-detail-view :deep(td:last-child) {
  border-bottom: 1px solid var(--border);
  padding: 0.625rem 1rem;
}

.ei-detail-view :deep(tbody tr:last-child td) {
  border-bottom: 0;
}

.ei-detail-view :deep(img) {
  box-shadow: 0 0 0 3px var(--background);
}

.ei-detail-view :deep(.ei-detail-data-table td:first-child) {
  border-right: 0;
  border-bottom: 0;
  background: transparent;
  color: var(--muted-foreground);
  font-weight: 600;
}

.ei-detail-view :deep(.ei-detail-data-table td:last-child) {
  border-bottom: 0;
  background: transparent;
  color: var(--foreground);
  font-weight: 600;
}

.ei-detail-view :deep(.ei-detail-data-table tbody tr:hover) {
  background: transparent;
}

@media (max-width: 640px) {
  .ei-detail-view :deep(td:first-child),
  .ei-detail-view :deep(td:last-child) {
    display: block;
    width: 100%;
    border-right: 0;
  }

  .ei-detail-view :deep(td:first-child) {
    padding-bottom: 0.25rem;
  }

  .ei-detail-view :deep(td:last-child) {
    padding-top: 0.25rem;
  }
}
</style>
