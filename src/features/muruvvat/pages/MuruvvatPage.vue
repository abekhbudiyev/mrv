<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { CalendarDays, Check, ChevronsLeft, ChevronsRight, ChevronDown, ChevronLeft, ChevronRight, Download, Ellipsis, Eye, FilePenLine, Filter, Plus, Search, Trash2, X } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { getMuruvvatPage } from '@/features/muruvvat/config'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'

const props = defineProps<{
  pageKey: string
}>()

const NOTIFICATION_DURATION = 2600
const EXPORT_MIN_LOADING_DURATION = 1000

type ApplicationStatus = 'Jarayonda' | 'Tasdiqlangan' | 'Rad etilgan'

type ApplicationRow = {
  id: string
  date: string
  fullName: string
  pinfl: string
  region: string
  district: string
  status: ApplicationStatus
  statusClass: string
}

type PageNotification = {
  tone: 'success' | 'destructive'
  title: string
  description: string
}

type PendingConfirmation = {
  tone: 'success' | 'destructive'
  title: string
  description: string
  confirmLabel: string
  action: () => void
}

const page = computed(() => getMuruvvatPage(props.pageKey))
const isApplicationsListPage = computed(() => props.pageKey === 'applications-list')

const applicationStatusCardMeta = [
  {
    id: 'total',
    title: 'Jami arizalar',
    tone: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40',
    badge: 'bg-slate-600',
  },
  {
    id: 'in-progress',
    title: 'Jarayonda',
    tone: 'border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/20',
    badge: 'bg-amber-500',
  },
  {
    id: 'approved',
    title: 'Tasdiqlangan',
    tone: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/20',
    badge: 'bg-emerald-600',
  },
  {
    id: 'rejected',
    title: 'Rad etilgan',
    tone: 'border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/20',
    badge: 'bg-rose-600',
  },
] as const

const statusStyles = {
  Jarayonda: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300',
  Tasdiqlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300',
  'Rad etilgan': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
} as const

const demoPeople = [
  "Aliyev Azizbek Anvar o'g'li",
  'Karimova Mohira Baxtiyor qizi',
  "Rasulov Doston Elyor o'g'li",
  'Tursunova Shahnoza Sherzod qizi',
  "Qodirov Jamshid Shuhrat o'g'li",
  'Saidova Nilufar Akmal qizi',
  "Yuldashev Bekzod Ilhom o'g'li",
  "Abdullayeva Madina Ulug'bek qizi",
  "Mamatov Sanjar Dilshod o'g'li",
  'Nazarova Maftuna Otabek qizi',
]

const demoRegions = [
  ['Toshkent viloyati', 'Zangiota tumani'],
  ['Samarqand viloyati', 'Samarqand shahri'],
  ['Andijon viloyati', 'Andijon shahri'],
  ["Farg'ona viloyati", "Qo'qon shahri"],
  ['Namangan viloyati', 'Chortoq tumani'],
  ['Buxoro viloyati', 'Buxoro shahri'],
  ['Qashqadaryo viloyati', 'Qarshi shahri'],
  ['Surxondaryo viloyati', 'Termiz shahri'],
  ['Navoiy viloyati', 'Navoiy shahri'],
  ['Xorazm viloyati', 'Urganch shahri'],
] as const

const demoStatuses = ['Jarayonda', 'Tasdiqlangan', 'Rad etilgan'] as const
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
] as const

const applicationRows = ref(Array.from({ length: 100 }, (_, index) => {
  const person = demoPeople[index % demoPeople.length] ?? demoPeople[0]
  const regionEntry = demoRegions[index % demoRegions.length] ?? demoRegions[0]
  const [region, district] = regionEntry
  const status = demoStatuses[index % demoStatuses.length] ?? demoStatuses[0]
  const day = String((index % 28) + 1).padStart(2, '0')
  const month = String((index % 12) + 1).padStart(2, '0')
  const year = 2024 + Math.floor(index / 50)
  const pinflSeed = String(10000000000000 + index * 137).padStart(14, '0')

  return {
    id: `ARZ-${String(index + 1).padStart(6, '0')}`,
    date: `${day}.${month}.${year}`,
    fullName: person,
    pinfl: pinflSeed,
    region,
    district,
    status,
    statusClass: statusStyles[status],
  }
}) as ApplicationRow[])

const rowsPerPageOptions = [20, 50, 100, 200, 500]
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const searchInput = ref('')
const searchQuery = ref('')
const isFiltersOpen = ref(false)
const appliedStatusFilter = ref<'all' | ApplicationStatus>('all')
const appliedRegionFilter = ref('all')
const appliedDistrictFilter = ref('all')
const appliedStartDateFilter = ref('')
const appliedEndDateFilter = ref('')
const draftStatusFilter = ref<'all' | ApplicationStatus>('all')
const draftRegionFilter = ref('all')
const draftDistrictFilter = ref('all')
const draftStartDateFilter = ref('')
const draftEndDateFilter = ref('')
const openFilterField = ref<'status' | 'region' | 'district' | null>(null)
const openCalendarField = ref<'start' | 'end' | null>(null)
const calendarMonth = ref('')
const isRowsPerPageOpen = ref(false)
const openActionMenuId = ref<string | null>(null)
const isTableLoading = ref(true)
const isExporting = ref(false)
const pageNotification = ref<PageNotification | null>(null)
const pendingConfirmation = ref<PendingConfirmation | null>(null)
const notificationProgress = ref(100)
const notificationRemaining = ref(NOTIFICATION_DURATION)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let notificationTimer: ReturnType<typeof setTimeout> | null = null
let notificationAnimationFrame: number | null = null
let notificationCountdownStart = NOTIFICATION_DURATION
let notificationStartedAt = 0

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return applicationRows.value.filter((row) => {
    const matchesQuery = !query || [
      row.id,
      row.date,
      row.fullName,
      row.pinfl,
      row.region,
      row.district,
      row.status,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)

    const matchesStatus = appliedStatusFilter.value === 'all' || row.status === appliedStatusFilter.value
    const matchesRegion = appliedRegionFilter.value === 'all' || row.region === appliedRegionFilter.value
    const matchesDistrict = appliedDistrictFilter.value === 'all' || row.district === appliedDistrictFilter.value
    const rowDate = parseApplicationDate(row.date)
    const matchesStartDate = !appliedStartDateFilter.value || (rowDate !== null && rowDate >= appliedStartDateFilter.value)
    const matchesEndDate = !appliedEndDateFilter.value || (rowDate !== null && rowDate <= appliedEndDateFilter.value)

    return matchesQuery && matchesStatus && matchesRegion && matchesDistrict && matchesStartDate && matchesEndDate
  })
})

const regionOptions = computed(() => {
  return Array.from(new Set(applicationRows.value.map((row) => row.region))).sort((left, right) => left.localeCompare(right))
})

const districtOptions = computed(() => {
  const rows = draftRegionFilter.value === 'all'
    ? applicationRows.value
    : applicationRows.value.filter((row) => row.region === draftRegionFilter.value)

  return Array.from(new Set(rows.map((row) => row.district))).sort((left, right) => left.localeCompare(right))
})

const hasActiveFilters = computed(() => {
  return appliedStatusFilter.value !== 'all'
    || appliedRegionFilter.value !== 'all'
    || appliedDistrictFilter.value !== 'all'
    || Boolean(appliedStartDateFilter.value)
    || Boolean(appliedEndDateFilter.value)
})

const activeFilterCount = computed(() => {
  return [
    appliedStatusFilter.value !== 'all',
    appliedRegionFilter.value !== 'all',
    appliedDistrictFilter.value !== 'all',
    Boolean(appliedStartDateFilter.value),
    Boolean(appliedEndDateFilter.value),
  ].filter(Boolean).length
})

const hasPendingFilterChanges = computed(() => {
  return draftStatusFilter.value !== appliedStatusFilter.value
    || draftRegionFilter.value !== appliedRegionFilter.value
    || draftDistrictFilter.value !== appliedDistrictFilter.value
    || draftStartDateFilter.value !== appliedStartDateFilter.value
    || draftEndDateFilter.value !== appliedEndDateFilter.value
})

const draftStatusLabel = computed(() => draftStatusFilter.value === 'all' ? 'Barchasi' : draftStatusFilter.value)
const draftRegionLabel = computed(() => draftRegionFilter.value === 'all' ? 'Barchasi' : draftRegionFilter.value)
const isDistrictFilterEnabled = computed(() => draftRegionFilter.value !== 'all')
const draftDistrictLabel = computed(() => {
  if (!isDistrictFilterEnabled.value) {
    return 'Avval viloyatni tanlang'
  }

  return draftDistrictFilter.value === 'all' ? 'Barchasi' : draftDistrictFilter.value
})
const calendarMonthLabel = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')

  if (!year || !month) {
    return ''
  }

  const monthIndex = Number(month) - 1
  const monthName = monthNames[monthIndex]

  if (!monthName) {
    return year
  }

  return `${monthName} ${year}`
})
const calendarWeekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
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
      value: `${yearString}-${monthString}-${dayValue}`,
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

function closeFilters() {
  isFiltersOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null
}

function setRowsPerPageOpen(nextOpen: boolean) {
  isRowsPerPageOpen.value = nextOpen
}

function setActionMenuOpen(rowId: string, nextOpen: boolean) {
  openActionMenuId.value = nextOpen ? rowId : null
}

function parseApplicationDate(value: string) {
  const [day, month, year] = value.split('.')

  if (!day || !month || !year) {
    return null
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function normalizeFilterDate(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)

  if (dotMatch) {
    const day = dotMatch[1]
    const month = dotMatch[2]
    const year = dotMatch[3]

    if (!day || !month || !year) {
      return ''
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (isoMatch) {
    return trimmed
  }

  return ''
}

function formatFilterDateForInput(value: string) {
  if (!value) {
    return ''
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!isoMatch) {
    return value
  }

  const year = isoMatch[1]
  const month = isoMatch[2]
  const day = isoMatch[3]

  if (!year || !month || !day) {
    return value
  }

  return `${day}.${month}.${year}`
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

function openCalendar(field: 'start' | 'end') {
  openCalendarField.value = openCalendarField.value === field ? null : field
  if (!openCalendarField.value) {
    return
  }

  const sourceDate = field === 'start' ? draftStartDateFilter.value : draftEndDateFilter.value
  calendarMonth.value = (sourceDate || getTodayIso()).slice(0, 7)
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
  }
  else {
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

function toggleFiltersFromMenu(nextOpen: boolean) {
  if (nextOpen) {
    draftStatusFilter.value = appliedStatusFilter.value
    draftRegionFilter.value = appliedRegionFilter.value
    draftDistrictFilter.value = appliedDistrictFilter.value
    draftStartDateFilter.value = appliedStartDateFilter.value
    draftEndDateFilter.value = appliedEndDateFilter.value
    openFilterField.value = null
  }

  isFiltersOpen.value = nextOpen
}

function toggleFilterField(field: 'status' | 'region' | 'district') {
  openFilterField.value = openFilterField.value === field ? null : field
}

function selectStatusFilter(value: 'all' | ApplicationStatus) {
  draftStatusFilter.value = value
  openFilterField.value = null
}

function selectRegionFilter(value: string) {
  draftRegionFilter.value = value

  if (value === 'all') {
    draftDistrictFilter.value = 'all'
    openFilterField.value = null
    return
  }

  const districtExists = applicationRows.value.some((row) => row.region === value && row.district === draftDistrictFilter.value)

  if (!districtExists) {
    draftDistrictFilter.value = 'all'
  }

  openFilterField.value = null
}

function selectDistrictFilter(value: string) {
  draftDistrictFilter.value = value
  openFilterField.value = null
}

function handleStartDateFilterChange(value: string) {
  const normalizedValue = normalizeFilterDate(value)
  draftStartDateFilter.value = normalizedValue

  if (draftEndDateFilter.value && normalizedValue && draftEndDateFilter.value < normalizedValue) {
    draftEndDateFilter.value = normalizedValue
  }
}

function handleEndDateFilterChange(value: string) {
  const normalizedValue = normalizeFilterDate(value)
  draftEndDateFilter.value = normalizedValue

  if (draftStartDateFilter.value && normalizedValue && draftStartDateFilter.value > normalizedValue) {
    draftStartDateFilter.value = normalizedValue
  }
}

function applyFilters() {
  runTableLoading(() => {
    appliedStatusFilter.value = draftStatusFilter.value
    appliedRegionFilter.value = draftRegionFilter.value
    appliedDistrictFilter.value = draftDistrictFilter.value
    appliedStartDateFilter.value = draftStartDateFilter.value
    appliedEndDateFilter.value = draftEndDateFilter.value
    currentPage.value = 1
  })

  closeFilters()
}

function clearFilters() {
  draftStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  draftDistrictFilter.value = 'all'
  draftStartDateFilter.value = ''
  draftEndDateFilter.value = ''
}

function clearAppliedFilters() {
  draftStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  draftDistrictFilter.value = 'all'
  draftStartDateFilter.value = ''
  draftEndDateFilter.value = ''

  runTableLoading(() => {
    appliedStatusFilter.value = 'all'
    appliedRegionFilter.value = 'all'
    appliedDistrictFilter.value = 'all'
    appliedStartDateFilter.value = ''
    appliedEndDateFilter.value = ''
    currentPage.value = 1
  })
}

function clearSearchAndFilters() {
  clearSearch()
  clearAppliedFilters()
}

const totalRows = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / selectedRowsPerPage.value)))
const applicationStatusCards = computed(() => {
  const total = filteredRows.value.length
  const inProgress = filteredRows.value.filter((row) => row.status === 'Jarayonda').length
  const approved = filteredRows.value.filter((row) => row.status === 'Tasdiqlangan').length
  const rejected = filteredRows.value.filter((row) => row.status === 'Rad etilgan').length

  const formatShare = (count: number) => {
    if (total === 0) {
      return '0%'
    }

    return `${Math.round((count / total) * 100)}%`
  }

  return applicationStatusCardMeta.map((card) => {
    const countMap = {
      total,
      'in-progress': inProgress,
      approved,
      rejected,
    } as const

    const value = countMap[card.id]

    return {
      ...card,
      value: String(value),
      share: card.id === 'total' ? '100%' : formatShare(value),
    }
  })
})
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * selectedRowsPerPage.value
  const end = start + selectedRowsPerPage.value

  return filteredRows.value.slice(start, end)
})
const paginationSummary = computed(() => {
  const start = totalRows.value === 0 ? 0 : (currentPage.value - 1) * selectedRowsPerPage.value + 1
  const end = Math.min(currentPage.value * selectedRowsPerPage.value, totalRows.value)

  return `${start}-${end} / ${totalRows.value}`
})
const currentPageSummary = computed(() => `${currentPage.value}/${totalPages.value}`)

function setRowsPerPage(nextValue: number) {
  runTableLoading(() => {
    selectedRowsPerPage.value = nextValue
    currentPage.value = 1
  })
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

function clearSearch() {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = null
  }

  searchInput.value = ''
  runTableLoading(() => {
    searchQuery.value = ''
    currentPage.value = 1
  })
}

function showNotification(notification: PageNotification) {
  pageNotification.value = notification
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
  pageNotification.value = null
  notificationProgress.value = 100
  notificationRemaining.value = NOTIFICATION_DURATION
}

function updateNotificationProgress() {
  if (!pageNotification.value) {
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
  if (!pageNotification.value) {
    return
  }

  const elapsed = performance.now() - notificationStartedAt
  notificationRemaining.value = Math.max(0, notificationCountdownStart - elapsed)
  notificationProgress.value = (notificationRemaining.value / NOTIFICATION_DURATION) * 100
  clearNotificationTimers()
}

function resumeNotificationCountdown() {
  if (!pageNotification.value || notificationRemaining.value <= 0) {
    return
  }

  startNotificationCountdown(notificationRemaining.value)
}

function openConfirmation(confirmation: PendingConfirmation) {
  pendingConfirmation.value = confirmation
}

function closeConfirmation() {
  pendingConfirmation.value = null
}

function confirmPendingAction() {
  if (!pendingConfirmation.value) {
    return
  }

  const action = pendingConfirmation.value.action
  pendingConfirmation.value = null
  action()
}

function updateRowStatus(rowId: string, nextStatus: ApplicationStatus) {
  const targetRow = applicationRows.value.find((row) => row.id === rowId)

  if (!targetRow) {
    return
  }

  targetRow.status = nextStatus
  targetRow.statusClass = statusStyles[nextStatus]
}

function confirmApprove(row: ApplicationRow) {
  openConfirmation({
    tone: 'success',
    title: 'Tasdiqlashni tasdiqlang',
    description: `${row.id} arizasini tasdiqlashni xohlaysizmi?`,
    confirmLabel: 'Tasdiqlash',
    action: () => {
      runTableLoading(() => {
        updateRowStatus(row.id, 'Tasdiqlangan')
        showNotification({
          tone: 'success',
          title: 'Ariza tasdiqlandi',
          description: `${row.id} muvaffaqiyatli tasdiqlandi.`,
        })
      })
    },
  })
}

function confirmReject(row: ApplicationRow) {
  openConfirmation({
    tone: 'destructive',
    title: 'Rad etishni tasdiqlang',
    description: `${row.id} arizasini rad etishni xohlaysizmi?`,
    confirmLabel: 'Rad etish',
    action: () => {
      runTableLoading(() => {
        updateRowStatus(row.id, 'Rad etilgan')
        showNotification({
          tone: 'destructive',
          title: 'Ariza rad etildi',
          description: `${row.id} rad etilgan holatiga o'tkazildi.`,
        })
      })
    },
  })
}

async function downloadApplicationsAsExcel() {
  if (isExporting.value) {
    return
  }

  if (!filteredRows.value.length) {
    showNotification({
      tone: 'destructive',
      title: 'Eksport uchun ma’lumot topilmadi',
      description: 'Joriy filterlar bo‘yicha yuklab olinadigan yozuv mavjud emas.',
    })
    return
  }

  let exportStartedAt = 0

  try {
    isExporting.value = true
    exportStartedAt = performance.now()
    const XLSX = await import('xlsx')
    const exportRows = filteredRows.value.map((row, index) => ({
      'T/r': index + 1,
      'Ariza ID': row.id,
      Sana: row.date,
      'Xizmat oluvchi': row.fullName,
      PINFL: row.pinfl,
      Viloyat: row.region,
      'Tuman yoki shahar': row.district,
      Status: row.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 16 },
      { wch: 14 },
      { wch: 34 },
      { wch: 18 },
      { wch: 24 },
      { wch: 24 },
      { wch: 16 },
    ]
    worksheet['!autofilter'] = {
      ref: `A1:H${exportRows.length + 1}`,
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Arizalar ro'yxati")

    const fileName = `arizalar-royxati-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(workbook, fileName, { compression: true })

    showNotification({
      tone: 'success',
      title: 'Eksport tayyor',
      description: `${filteredRows.value.length} ta yozuv .xlsx faylga yuklab olindi.`,
    })
  }
  catch {
    showNotification({
      tone: 'destructive',
      title: 'Eksportda xatolik',
      description: 'Excel faylni yaratishda muammo yuz berdi.',
    })
  }
  finally {
    const elapsed = performance.now() - exportStartedAt
    const remainingDelay = Math.max(0, EXPORT_MIN_LOADING_DURATION - elapsed)

    if (remainingDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingDelay))
    }

    isExporting.value = false
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  runTableLoading(() => {
    currentPage.value = page
  })
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

onMounted(() => {
  loadingTimer = setTimeout(() => {
    isTableLoading.value = false
    loadingTimer = null
  }, 200)
})

onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  if (notificationTimer) {
    clearNotificationTimers()
  }
})
</script>

<template>
  <PageContainer v-if="page">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <div class="relative flex min-h-0 min-w-0 max-w-full flex-1 flex-col xl:min-h-0">
      <div
        v-if="pendingConfirmation"
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
      >
        <div class="w-full max-w-md rounded-xl border border-border bg-card p-5">
          <div class="flex items-start gap-3">
            <div
              :class="[
                'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
                pendingConfirmation.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600',
              ]"
            />
            <div class="min-w-0 flex-1">
              <p class="text-base font-semibold text-foreground">
                {{ pendingConfirmation.title }}
              </p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ pendingConfirmation.description }}
              </p>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              @click="closeConfirmation"
            >
              Bekor qilish
            </Button>
            <Button
              :variant="pendingConfirmation.tone === 'success' ? 'default' : 'destructive'"
              @click="confirmPendingAction"
            >
              {{ pendingConfirmation.confirmLabel }}
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="pageNotification"
        :class="[
          'absolute right-4 top-4 z-30 flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border px-4 py-3 text-sm shadow-lg',
          pageNotification.tone === 'success'
            ? 'border-emerald-200 bg-card text-foreground dark:border-emerald-900/60'
            : 'border-rose-200 bg-card text-foreground dark:border-rose-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-100 ease-linear',
              pageNotification.tone === 'success' ? 'bg-emerald-500' : 'bg-rose-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            pageNotification.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ pageNotification.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ pageNotification.description }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div
        v-if="isTableLoading"
        class="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
          <span>Yuklanmoqda...</span>
        </div>
      </div>

      <SectionBlock
        class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden"
        content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-hidden p-5"
        :title="page.sectionTitle ?? ''"
        :description="page.sectionDescription ?? ''"
      >
        <template v-if="isApplicationsListPage">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              v-for="card in applicationStatusCards"
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

          <div class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="relative w-full lg:max-w-sm">
              <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                :model-value="searchInput"
                placeholder="Qidirish"
                class="pl-9"
                @update:model-value="handleSearchInput"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button class="gap-2">
                <Plus class="h-4 w-4" />
                <span>Yaratish</span>
              </Button>
              <div class="relative">
                <div
                  v-if="isFiltersOpen"
                  class="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
                  @click="closeFilters"
                />

                <Button
                  variant="outline"
                  :class="isFiltersOpen ? 'gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'gap-2'"
                  @click="toggleFiltersFromMenu(!isFiltersOpen)"
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
                  <span>Filter</span>
                </Button>

                <div
                  v-if="isFiltersOpen"
                  class="fixed inset-x-3 top-24 z-50 max-h-[calc(100vh-7rem)] overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none lg:absolute lg:inset-auto lg:right-0 lg:top-[calc(100%+0.5rem)] lg:max-h-[min(36rem,calc(100vh-10rem))] lg:w-[min(92vw,22rem)]"
                >
                  <div class="flex max-h-[calc(100vh-7rem)] flex-col gap-4 overflow-y-auto p-4 lg:max-h-[min(36rem,calc(100vh-10rem))]">
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm font-semibold text-foreground">
                        Filterlar
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        aria-label="Filterni yopish"
                        @click="closeFilters"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <div class="flex flex-col gap-4">
                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Status</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors',
                              openFilterField === 'status'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            @click="toggleFilterField('status')"
                          >
                            <span>{{ draftStatusLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 text-muted-foreground transition-transform',
                                openFilterField === 'status' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'status'"
                            class="overflow-hidden rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectStatusFilter('all')"
                            >
                              <span>Barchasi</span>
                              <Check
                                v-if="draftStatusFilter === 'all'"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                            <button
                              v-for="status in demoStatuses"
                              :key="status"
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectStatusFilter(status)"
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

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Viloyat</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors',
                              openFilterField === 'region'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            @click="toggleFilterField('region')"
                          >
                            <span class="truncate">{{ draftRegionLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                                openFilterField === 'region' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'region'"
                            class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectRegionFilter('all')"
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
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectRegionFilter(region)"
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

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Tuman yoki shahar</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                              openFilterField === 'district'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            :disabled="!isDistrictFilterEnabled"
                            @click="toggleFilterField('district')"
                          >
                            <span class="truncate">{{ draftDistrictLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 shrink-0 text-muted-foreground transition-transform',
                                openFilterField === 'district' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'district' && isDistrictFilterEnabled && districtOptions.length"
                            class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectDistrictFilter('all')"
                            >
                              <span>Barchasi</span>
                              <Check
                                v-if="draftDistrictFilter === 'all'"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                            <button
                              v-for="district in districtOptions"
                              :key="district"
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
                              @click="selectDistrictFilter(district)"
                            >
                              <span class="truncate">{{ district }}</span>
                              <Check
                                v-if="draftDistrictFilter === district"
                                class="h-4 w-4 shrink-0 text-primary"
                              />
                            </button>
                          </div>
                        </div>
                      </label>

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Boshlanish sanasi</span>
                        <div class="relative space-y-2 lg:mt-2 lg:space-y-0">
                          <div class="relative">
                            <Input
                              class="h-10 pr-10"
                              placeholder="dd.mm.yyyy"
                              :model-value="formatFilterDateForInput(draftStartDateFilter)"
                              @update:model-value="handleStartDateFilterChange"
                            />
                            <button
                              type="button"
                              class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Boshlanish sanasini tanlash"
                              @click="openCalendar('start')"
                            >
                              <CalendarDays class="h-4 w-4" />
                            </button>
                          </div>

                          <div
                            v-if="openCalendarField === 'start'"
                            class="rounded-lg border border-border bg-background p-3 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
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
                              <p class="text-sm font-medium capitalize text-foreground">
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
                                class="flex h-8 items-center justify-center rounded-md text-sm transition-colors"
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

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Tugash sanasi</span>
                        <div class="relative space-y-2 lg:mt-2 lg:space-y-0">
                          <div class="relative">
                            <Input
                              class="h-10 pr-10"
                              placeholder="dd.mm.yyyy"
                              :model-value="formatFilterDateForInput(draftEndDateFilter)"
                              @update:model-value="handleEndDateFilterChange"
                            />
                            <button
                              type="button"
                              class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              aria-label="Tugash sanasini tanlash"
                              @click="openCalendar('end')"
                            >
                              <CalendarDays class="h-4 w-4" />
                            </button>
                          </div>

                          <div
                            v-if="openCalendarField === 'end'"
                            class="rounded-lg border border-border bg-background p-3 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
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
                              <p class="text-sm font-medium capitalize text-foreground">
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
                                class="flex h-8 items-center justify-center rounded-md text-sm transition-colors"
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
                    </div>

                    <div class="flex items-center justify-end gap-2 border-t border-border pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        :disabled="!hasActiveFilters && !hasPendingFilterChanges"
                        @click="clearFilters"
                      >
                        Tozalash
                      </Button>
                      <Button
                        size="sm"
                        :disabled="!hasPendingFilterChanges"
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
                class="gap-2"
                :disabled="isExporting"
                @click="downloadApplicationsAsExcel"
              >
                <div
                  v-if="isExporting"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
                />
                <Download
                  v-else
                  class="h-4 w-4"
                />
                <span>Yuklab olish</span>
              </Button>
            </div>
          </div>

          <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
            <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
              <div class="flex-1 xl:hidden">
                <div
                  v-if="paginatedRows.length === 0"
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
                    v-for="row in paginatedRows"
                    :key="row.id"
                    class="border-border"
                  >
                    <CardContent class="space-y-4 p-4">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ariza
                          </p>
                          <p class="mt-1 font-semibold text-foreground">
                            {{ row.id }}
                          </p>
                          <p class="mt-1 text-sm text-muted-foreground">
                            {{ row.date }}
                          </p>
                        </div>

                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                              row.statusClass,
                            ]"
                          >
                            {{ row.status }}
                          </span>

                          <DropdownMenuRoot @update:open="setActionMenuOpen(row.id, $event)">
                            <DropdownMenuTrigger as-child>
                              <Button
                                variant="outline"
                                size="sm"
                                :class="openActionMenuId === row.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
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
                                <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                  <Eye class="h-4 w-4 shrink-0" />
                                  <span>Ko'rish</span>
                                </DropdownMenuItem>
                                <template v-if="row.status === 'Jarayonda'">
                                  <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                    <FilePenLine class="h-4 w-4 shrink-0" />
                                    <span>Tahrirlash</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                    @click="confirmApprove(row)"
                                  >
                                    <Check class="h-4 w-4 shrink-0" />
                                    <span>Tasdiqlash</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                    @click="confirmReject(row)"
                                  >
                                    <X class="h-4 w-4 shrink-0" />
                                    <span>Rad etish</span>
                                  </DropdownMenuItem>
                                </template>
                                <DropdownMenuItem
                                  v-if="row.status === 'Tasdiqlangan'"
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                >
                                  <Trash2 class="h-4 w-4 shrink-0" />
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
                            Xizmat oluvchi
                          </p>
                          <p class="mt-1 font-medium uppercase text-foreground">
                            {{ row.fullName }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            {{ row.pinfl }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Manzil
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ row.region }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            {{ row.district }}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div class="hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
                <table class="min-w-[1100px] border-separate border-spacing-0 text-sm xl:min-w-full">
                  <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                    <tr>
                      <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Ariza</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Xizmat oluvchi</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Manzil</th>
                      <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr v-if="paginatedRows.length === 0">
                    <td
                      colspan="5"
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
                          @click="clearSearchAndFilters"
                        >
                          Tozalash
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="row in paginatedRows"
                    :key="row.id"
                    class="transition-colors hover:bg-muted/40"
                  >
                      <td class="border-b border-border px-4 py-3 align-top">
                        <DropdownMenuRoot @update:open="setActionMenuOpen(row.id, $event)">
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="openActionMenuId === row.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
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
                              class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                            >
                              <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                <Eye class="h-4 w-4 shrink-0" />
                                <span>Ko'rish</span>
                              </DropdownMenuItem>
                              <template v-if="row.status === 'Jarayonda'">
                                <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                  <FilePenLine class="h-4 w-4 shrink-0" />
                                  <span>Tahrirlash</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                  @click="confirmApprove(row)"
                                >
                                  <Check class="h-4 w-4 shrink-0" />
                                  <span>Tasdiqlash</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                  @click="confirmReject(row)"
                                >
                                  <X class="h-4 w-4 shrink-0" />
                                  <span>Rad etish</span>
                                </DropdownMenuItem>
                              </template>
                              <DropdownMenuItem
                                v-if="row.status === 'Tasdiqlangan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                              >
                                <Trash2 class="h-4 w-4 shrink-0" />
                                <span>Bekor qilish</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenuRoot>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium text-foreground">
                          {{ row.id }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.date }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium uppercase text-foreground">
                          {{ row.fullName }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.pinfl }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium text-foreground">
                          {{ row.region }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.district }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <span
                          :class="[
                            'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                            row.statusClass,
                          ]"
                        >
                          {{ row.status }}
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
                  <div class="mx-1 flex h-7 min-w-14 items-center justify-center text-center text-sm font-semibold text-foreground">
                    {{ currentPageSummary }}
                  </div>
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
        </template>

        <EmptyState
          v-else
          title="Content will be added here later"
          description="This module is prepared for future implementation."
        />
      </SectionBlock>
    </div>

  </PageContainer>
</template>

