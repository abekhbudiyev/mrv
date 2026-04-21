<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { CalendarDays, Check, CheckCheck, ChevronsLeft, ChevronsRight, ChevronDown, ChevronLeft, ChevronRight, Download, Ellipsis, Eye, Filter, Pencil, Plus, Search, Trash2, X } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { getIPTKPage } from '@/features/iptk/config'
import { cn } from '@/shared/lib/utils'
import EmptyState from '@/shared/components/EmptyState.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'

type CommissionStatus = 'Jarayonda' | 'Tasdiqlangan' | 'Bekor qilingan'
type CommissionWorkflowStage = 'Qoralama' | 'Tasdiqlashga yuborildi' | 'Tasdiqlangan' | 'Bekor qilingan'
type FeedbackType = 'success' | 'error' | 'info'

type PendingConfirmation = {
  tone: 'success' | 'destructive'
  title: string
  description: string
  confirmLabel: string
  action: () => void
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

const props = defineProps<{
  pageKey: string
}>()

const page = computed(() => getIPTKPage(props.pageKey))
const isCommissionCompositionPage = computed(() => props.pageKey === 'commissions-composition')

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
  'Toshkent shahri',
  'Xorazm viloyati',
] as const

const statusClassMap: Record<CommissionStatus, string> = {
  Jarayonda: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300',
  Tasdiqlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300',
  'Bekor qilingan': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
}

const workflowStageLabels: Record<CommissionWorkflowStage, string> = {
  Qoralama: 'Qoralama',
  'Tasdiqlashga yuborildi': 'Tasdiqlashga yuborildi',
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
    workflowStage: 'Tasdiqlashga yuborildi',
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
    status: 'Tasdiqlangan',
    workflowStage: 'Tasdiqlangan',
    createdAt: '2026-04-11 14:20',
    updatedAt: '2026-04-12 10:05',
    submittedAt: '2026-04-12 09:10',
    approvedAt: '2026-04-12 10:05',
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
    status: 'Bekor qilingan',
    workflowStage: 'Bekor qilingan',
    createdAt: '2026-04-13 11:40',
    updatedAt: '2026-04-13 17:25',
    submittedAt: '2026-04-13 14:00',
    rejectedAt: '2026-04-13 17:25',
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
const pendingConfirmation = ref<PendingConfirmation | null>(null)
const feedback = ref<{ type: FeedbackType; message: string } | null>(null)
const notificationProgress = ref(100)
const notificationRemaining = ref(NOTIFICATION_DURATION)
const isTableLoading = ref(false)
const searchInput = ref('')
const searchQuery = ref('')
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

const formRegion = ref('')
const chairSearch = ref<CommissionSearchState>(createSearchState())
const deputyChairSearch = ref<CommissionSearchState>(createSearchState())
const secretarySearch = ref<CommissionSearchState>(createSearchState())
const formMembers = ref<CommissionMemberDraft[]>([createEmptyMember()])

let notificationTimer: ReturnType<typeof setTimeout> | null = null
let notificationAnimationFrame: number | null = null
let notificationCountdownStart = NOTIFICATION_DURATION
let notificationStartedAt = 0
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let loadingTimer: ReturnType<typeof setTimeout> | null = null
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

const commissionStats = computed(() => {
  const rows = filteredCommissions.value
  const total = rows.length
  const inProgress = rows.filter((item) => item.status === 'Jarayonda').length
  const approved = rows.filter((item) => item.status === 'Tasdiqlangan').length
  const rejected = rows.filter((item) => item.status === 'Bekor qilingan').length

  return { total, inProgress, approved, rejected }
})

const commissionStatusCards = computed(() => {
  const total = commissionStats.value.total

  const buildShare = (value: number) => {
    if (!total) return '0%'
    return `${Math.round((value / total) * 100)}%`
  }

  return [
    {
      id: 'total',
      title: 'Jami hujjatlar',
      value: total,
      share: buildShare(total),
      tone: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40',
      badge: 'bg-slate-600',
    },
    {
      id: 'in-progress',
      title: 'Jarayonda',
      value: commissionStats.value.inProgress,
      share: buildShare(commissionStats.value.inProgress),
      tone: 'border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/20',
      badge: 'bg-amber-500',
    },
    {
      id: 'approved',
      title: 'Tasdiqlangan',
      value: commissionStats.value.approved,
      share: buildShare(commissionStats.value.approved),
      tone: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/20',
      badge: 'bg-emerald-600',
    },
    {
      id: 'rejected',
      title: 'Bekor qilingan',
      value: commissionStats.value.rejected,
      share: buildShare(commissionStats.value.rejected),
      tone: 'border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/20',
      badge: 'bg-rose-600',
    },
  ]
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
const activeFilterCount = computed(() => {
  let count = 0

  if (appliedStatusFilter.value !== 'all') count += 1
  if (appliedRegionFilter.value !== 'all') count += 1
  if (appliedStartDateFilter.value) count += 1
  if (appliedEndDateFilter.value) count += 1

  return count
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

const feedbackTitleMap: Record<FeedbackType, string> = {
  success: 'Muvaffaqiyatli',
  error: 'Xatolik',
  info: "Ma'lumot",
}

function pushFeedback(type: FeedbackType, message: string) {
  feedback.value = { type, message }
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
      target.workflowStage = 'Tasdiqlashga yuborildi'
      target.status = 'Jarayonda'
      target.rejectedAt = undefined
    }

    pushFeedback('success', `${target.documentNumber} yangilandi.`)
  } else {
    const createdRecord: CommissionRecord = {
      id: String(commissions.value.length + 1),
      documentNumber: nextDocumentNumber(),
      status: 'Jarayonda',
      workflowStage: 'Tasdiqlashga yuborildi',
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
    }

    commissions.value.unshift(createdRecord)
    pushFeedback('success', `${createdRecord.documentNumber} yaratildi.`)
  }

  closeCreateDialog()
}

function editCommission(record: CommissionRecord) {
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
  selectedViewRecord.value = record
  openActionMenuId.value = null
}

function closeViewDialog() {
  selectedViewRecord.value = null
}

function openConfirmation(confirmation: PendingConfirmation) {
  pendingConfirmation.value = confirmation
  openActionMenuId.value = null
}

function closeConfirmation() {
  pendingConfirmation.value = null
}

function confirmPendingAction() {
  const confirmation = pendingConfirmation.value
  if (!confirmation) return

  confirmation.action()
  pendingConfirmation.value = null
}

function requestApproveCommission(record: CommissionRecord) {
  openConfirmation({
    tone: 'success',
    title: 'Hujjat tasdiqlansinmi?',
    description: `${record.documentNumber} tasdiqlangandan keyin faqat ko'rish mumkin bo'ladi.`,
    confirmLabel: 'Tasdiqlash',
    action: () => approveCommission(record.id),
  })
}

function requestRejectCommission(record: CommissionRecord) {
  openConfirmation({
    tone: 'destructive',
    title: 'Hujjat rad etilsinmi?',
    description: `${record.documentNumber} bekor qilingandan keyin uni qayta tahrirlash mumkin bo'ladi.`,
    confirmLabel: 'Bekor qilish',
    action: () => rejectCommission(record.id),
  })
}

function approveCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Tasdiqlangan'
  target.status = 'Tasdiqlangan'
  target.approvedAt = nowLabel()
  target.updatedAt = target.approvedAt
  openActionMenuId.value = null
  pushFeedback('success', `${target.documentNumber} tasdiqlandi.`)
}

function rejectCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Bekor qilingan'
  target.status = 'Bekor qilingan'
  target.rejectedAt = nowLabel()
  target.updatedAt = target.rejectedAt
  openActionMenuId.value = null
  pushFeedback('success', `${target.documentNumber} bekor qilindi.`)
}

function applyFilters() {
  isFilterOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null

  runTableLoading(() => {
    appliedStatusFilter.value = draftStatusFilter.value
    appliedRegionFilter.value = draftRegionFilter.value
    appliedStartDateFilter.value = draftStartDateFilter.value
    appliedEndDateFilter.value = draftEndDateFilter.value
    currentPage.value = 1
  })
}

function clearFilters() {
  resetSearchAndFilters()
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
  xlsx.writeFile(workbook, 'iptk-komissiyalar-tarkibi.xlsx')
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

onUnmounted(() => {
  clearNotificationTimers()

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})
</script>

<template>
  <PageContainer v-if="page">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <template v-if="isCommissionCompositionPage">
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
          <p class="font-semibold">{{ feedbackTitleMap[feedback.type] }}</p>
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
        <div
          v-if="isTableLoading"
          class="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-sm"
        >
          <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
            <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
            <span>Yuklanmoqda...</span>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card
            v-for="card in commissionStatusCards"
            :key="card.id"
            :class="card.tone"
          >
            <CardContent class="space-y-2 pt-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span
                    :class="['h-2.5 w-2.5 rounded-full', card.badge]"
                  />
                  <p class="text-xs font-medium text-muted-foreground">
                    {{ card.title }}
                  </p>
                </div>
                <p class="text-lg font-semibold tracking-tight text-foreground">
                  {{ card.value }}
                </p>
              </div>
              <div class="flex items-center justify-between border-t border-border pt-2 text-xs">
                <span class="text-muted-foreground">Ulushi</span>
                <span class="font-medium text-foreground">{{ card.share }}</span>
              </div>
            </CardContent>
          </Card>
        </div>

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
                class="h-10 gap-2"
                @click="openCreateDialog"
              >
                <Plus class="h-4 w-4" />
                Yaratish
              </Button>

              <div class="relative">
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
                  <span
                    v-if="activeFilterCount > 0"
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
                            v-for="status in ['Jarayonda', 'Tasdiqlangan', 'Bekor qilingan']"
                            :key="status"
                            type="button"
                            class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                            @click.stop.prevent="selectStatusFilter(status as CommissionStatus)"
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
                        @click="clearFilters"
                      >
                        Tozalash
                      </Button>
                      <Button
                        size="sm"
                        :disabled="isTableLoading || !hasPendingFilterChanges"
                        @click="applyFilters"
                      >
                        Qo'llash
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                class="h-10 gap-2"
                @click="downloadCommissions"
              >
                <Download class="h-4 w-4" />
                Yuklab olish
              </Button>
            </div>
        </div>

        <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
          <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
            <div class="flex-1 xl:hidden">
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
                              <Ellipsis class="h-4 w-4" />
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
                                v-if="record.status !== 'Tasdiqlangan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="editCommission(record)"
                              >
                                <Pencil class="h-4 w-4 shrink-0" />
                                <span>Tahrirlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Jarayonda'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="requestApproveCommission(record)"
                              >
                                <CheckCheck class="h-4 w-4 shrink-0" />
                                <span>Tasdiqlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.status === 'Jarayonda'"
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

            <div class="hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
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
                            <Ellipsis class="h-4 w-4" />
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
                              v-if="record.status !== 'Tasdiqlangan'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="editCommission(record)"
                            >
                              <Pencil class="h-4 w-4 shrink-0" />
                              <span>Tahrirlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Jarayonda'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="requestApproveCommission(record)"
                            >
                              <CheckCheck class="h-4 w-4 shrink-0" />
                              <span>Tasdiqlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.status === 'Jarayonda'"
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
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
        @click.self="closeViewDialog"
      >
        <div class="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-border bg-background shadow-2xl">
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
        @cancel="closeConfirmation"
        @confirm="confirmPendingAction"
      />

      <div
        v-if="isCreateDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
        @click.self="closeCreateDialog"
      >
        <div class="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-border bg-background shadow-2xl">
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

            <div
              v-if="formRegion"
              class="grid gap-4 xl:grid-cols-2"
            >
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

            <div
              v-if="formRegion"
              class="space-y-4 rounded-3xl border border-border bg-card p-4"
            >
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
