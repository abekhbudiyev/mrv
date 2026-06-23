<script lang="ts">
import { ref as moduleRef } from 'vue'
import type { EiRecord as EiDraftRecord } from '@/features/ei/data'

const providerApplicationDrafts = moduleRef<EiDraftRecord[]>([])
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarDays, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, Ellipsis, Eye, FilePenLine, Plus, RotateCcw, Search, Send } from 'lucide-vue-next'
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

const rowsPerPageOptions = [20, 50, 100, 200, 500]
const editableConclusionStatuses = ['Yangi', 'Tahrirlangan', 'Qaytarilgan']
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

const providerApplicationApplicantsByPinfl: Record<string, ProviderApplicationApplicantLookup> = {
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

const searchQuery = ref('')
const selectedStatuses = ref<string[]>([])
const selectedProviderRegion = ref('')
const selectedProviderDistrict = ref('')
const providerApplicationsStartDate = ref('')
const providerApplicationsEndDate = ref('')
const draftProviderRegion = ref('')
const draftProviderDistrict = ref('')
const draftProviderApplicationsStartDate = ref('')
const draftProviderApplicationsEndDate = ref('')
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const isRowsPerPageOpen = ref(false)
const isProviderApplicationsFilterOpen = ref(false)
const openActionMenuId = ref<string | null>(null)
const isExportingRecords = ref(false)

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
const isProvidersApplicationsCreatePage = computed(() => props.pageKey === 'providers-applications-create')
const isProvidersConclusionsPage = computed(() => props.pageKey === 'providers-conclusions')
const isProvidersRegistryPage = computed(() => props.pageKey === 'providers-registry')
const usesProviderApplicationsTable = computed(() => (
  isProvidersApplicationsPage.value || isProvidersConclusionsPage.value || isProvidersRegistryPage.value
))
const pageRecords = computed(() => {
  if (props.pageKey === 'dashboard') {
    return getEiDashboardRecords()
  }

  const records = getEiRecords(props.pageKey)

  if (props.pageKey === 'providers-applications') {
    return [...providerApplicationDrafts.value, ...records]
  }

  return records
})

const statusTabs = computed(() => buildEiStatusTabs(pageRecords.value))
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
  return [
    selectedProviderRegion.value,
    selectedProviderDistrict.value,
    providerApplicationsStartDate.value,
    providerApplicationsEndDate.value,
  ].filter(Boolean).length
})
const hasPendingProviderApplicationFilterChanges = computed(() => (
  draftProviderRegion.value !== selectedProviderRegion.value
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
    const matchesProviderFilters = !isProvidersApplicationsPage.value || (
      (!selectedProviderRegion.value || record.region === selectedProviderRegion.value)
      && (!selectedProviderDistrict.value || record.district === selectedProviderDistrict.value)
      && isDateWithinRange(record.submittedAt, providerApplicationsStartDate.value, providerApplicationsEndDate.value)
    )

    return matchesStatus && matchesQuery && matchesProviderFilters
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

watch(draftProviderRegion, () => {
  draftProviderDistrict.value = ''
})

watch(filteredRecords, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
}, { immediate: true })

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
  selectedProviderRegion.value = ''
  selectedProviderDistrict.value = ''
  providerApplicationsStartDate.value = ''
  providerApplicationsEndDate.value = ''
  draftProviderRegion.value = ''
  draftProviderDistrict.value = ''
  draftProviderApplicationsStartDate.value = ''
  draftProviderApplicationsEndDate.value = ''
}

function clearProviderApplicationFilters() {
  resetProviderApplicationFilters()
  currentPage.value = 1
}

function syncProviderApplicationDraftFilters() {
  draftProviderRegion.value = selectedProviderRegion.value
  draftProviderDistrict.value = selectedProviderDistrict.value
  draftProviderApplicationsStartDate.value = providerApplicationsStartDate.value
  draftProviderApplicationsEndDate.value = providerApplicationsEndDate.value
}

function applyProviderApplicationFilters() {
  selectedProviderRegion.value = draftProviderRegion.value
  selectedProviderDistrict.value = draftProviderDistrict.value
  providerApplicationsStartDate.value = draftProviderApplicationsStartDate.value
  providerApplicationsEndDate.value = draftProviderApplicationsEndDate.value
  currentPage.value = 1
  isProviderApplicationsFilterOpen.value = false
}

function handleProviderApplicationStartDateChange(value: string | number) {
  draftProviderApplicationsStartDate.value = normalizeProviderApplicationDateInput(String(value))
}

function handleProviderApplicationEndDateChange(value: string | number) {
  draftProviderApplicationsEndDate.value = normalizeProviderApplicationDateInput(String(value))
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

function normalizeProviderApplicationDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean)

  return parts.join('.')
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
      v-if="!isProvidersApplicationsCreatePage"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-visible p-5"
      title=""
      description=""
    >
      <div class="flex min-h-[74px] flex-col gap-4 rounded-lg border border-border bg-card p-4">
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
              v-if="isProvidersApplicationsPage"
              v-model:open="isProviderApplicationsFilterOpen"
              wrapper-class="order-1"
              :active-count="activeProviderApplicationFilterCount"
            >
              <div class="flex flex-col gap-3">
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

                <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                  <span class="font-medium text-foreground">Boshlanish sanasi</span>
                  <div class="relative xl:mt-2">
                    <Input
                      :model-value="draftProviderApplicationsStartDate"
                      class="h-10 pr-10"
                      inputmode="numeric"
                      maxlength="10"
                      placeholder="dd.mm.yyyy"
                      @update:model-value="handleProviderApplicationStartDateChange(String($event ?? ''))"
                    />
                    <span
                      class="pointer-events-none absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground"
                      aria-hidden="true"
                    >
                      <CalendarDays class="h-4 w-4" />
                    </span>
                  </div>
                </label>

                <label class="space-y-2 text-sm xl:relative xl:space-y-0">
                  <span class="font-medium text-foreground">Tugash sanasi</span>
                  <div class="relative xl:mt-2">
                    <Input
                      :model-value="draftProviderApplicationsEndDate"
                      class="h-10 pr-10"
                      inputmode="numeric"
                      maxlength="10"
                      placeholder="dd.mm.yyyy"
                      @update:model-value="handleProviderApplicationEndDateChange(String($event ?? ''))"
                    />
                    <span
                      class="pointer-events-none absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground"
                      aria-hidden="true"
                    >
                      <CalendarDays class="h-4 w-4" />
                    </span>
                  </div>
                </label>
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
              class="order-3 h-10 gap-2"
              @click="openCreateDialog"
            >
              <Plus class="h-4 w-4" />
              <span>Yaratish</span>
            </Button>
            <Button
              variant="outline"
              class="order-2 h-10 gap-2"
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
                    v-if="usesProviderApplicationsTable"
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
              class="border-separate border-spacing-0 text-sm xl:min-w-full"
              :class="isProvidersConclusionsPage ? 'min-w-[1240px]' : 'min-w-[1140px]'"
            >
              <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                <tr>
                  <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                    Hujjat
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
                  <th
                    v-if="isProvidersConclusionsPage"
                    class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                  >
                    Natija
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
                      {{ getApplicantName(record) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      JSHSHIR: {{ getApplicantPinfl(record) }}
                    </div>
                  </td>
                  <td class="border-b border-border px-4 py-3 align-top">
                    <div class="font-medium text-foreground">
                      {{ formatName(record.title) }}
                    </div>
                    <div class="mt-1 text-muted-foreground">
                      STIR: {{ record.tin ?? '-' }}
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
                  <td
                    v-if="isProvidersConclusionsPage"
                    class="border-b border-border px-4 py-3 align-top"
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
                  placeholder="30401876543210"
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
              class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.applicantPinfl }}
            </p>
            <p
              v-if="providerApplicationFormErrors.applicantFullName"
              class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.applicantFullName }}
            </p>

            <div
              v-if="isProviderApplicationApplicantFound"
              class="grid gap-4 rounded-2xl border border-border bg-muted/20 p-4 md:grid-cols-[136px_1fr]"
            >
              <div class="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-3 py-4">
                <div class="flex h-28 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-muted">
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

              <div class="overflow-hidden rounded-2xl border border-border bg-card">
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

            <div class="rounded-xl border border-border/70 bg-card p-4">
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
                  placeholder="309845672"
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
              class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.tin }}
            </p>
            <p
              v-if="providerApplicationFormErrors.organizationName"
              class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {{ providerApplicationFormErrors.organizationName }}
            </p>

            <div
              v-if="isProviderApplicationBusinessFound"
              class="overflow-hidden rounded-2xl border border-border bg-card"
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
