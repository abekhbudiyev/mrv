<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CheckCheck, ChevronsLeft, ChevronsRight, ChevronDown, ChevronLeft, ChevronRight, Download, Ellipsis, Filter, Pencil, Plus, Search, Send, Trash2, X } from 'lucide-vue-next'
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
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'

type CommissionStatus = 'Jarayonda' | 'Tasdiqlangan' | 'Rad etilgan'
type CommissionWorkflowStage = 'Qoralama' | 'Tasdiqlashga yuborildi' | 'Tasdiqlangan' | 'Rad etilgan'

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
  error: string
}

interface CommissionRecord {
  id: string
  documentNumber: string
  region: string
  chair: string
  deputyChair: string
  secretary: string
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
  'Rad etilgan': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
}

const workflowStageLabels: Record<CommissionWorkflowStage, string> = {
  Qoralama: 'Qoralama',
  'Tasdiqlashga yuborildi': 'Tasdiqlashga yuborildi',
  Tasdiqlangan: 'Tasdiqlangan',
  'Rad etilgan': 'Rad etilgan',
}

const commissions = ref<CommissionRecord[]>([
  {
    id: '1',
    documentNumber: 'IPTK-TARKIB-2026-001',
    region: 'Samarqand viloyati',
    chair: 'Abdullayev Komiljon Zafarovich',
    deputyChair: 'Saidov Muzaffar Anvarovich',
    secretary: 'Karimova Dilnoza Bahrom qizi',
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
    workflowStage: 'Qoralama',
    createdAt: '2026-04-10 09:30',
    updatedAt: '2026-04-10 09:30',
  },
  {
    id: '2',
    documentNumber: 'IPTK-TARKIB-2026-002',
    region: 'Toshkent shahri',
    chair: 'Raximov Oybek Jalolovich',
    deputyChair: 'Tursunova Mohira Ahror qizi',
    secretary: "Jo'rayeva Sevara Ikrom qizi",
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
    deputyChair: 'Aminova Yulduz Oybek qizi',
    secretary: 'Qobilova Shahnoza Rustam qizi',
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
    status: 'Rad etilgan',
    workflowStage: 'Rad etilgan',
    createdAt: '2026-04-13 11:40',
    updatedAt: '2026-04-13 17:25',
    submittedAt: '2026-04-13 14:00',
    rejectedAt: '2026-04-13 17:25',
  },
])

const isCreateDialogOpen = ref(false)
const isFilterOpen = ref(false)
const openFilterField = ref<'status' | 'region' | null>(null)
const editingId = ref<string | null>(null)
const openActionMenuId = ref<string | null>(null)
const feedback = ref<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
const searchQuery = ref('')
const draftStatusFilter = ref<'all' | CommissionStatus>('all')
const appliedStatusFilter = ref<'all' | CommissionStatus>('all')
const draftRegionFilter = ref<'all' | string>('all')
const appliedRegionFilter = ref<'all' | string>('all')
const rowsPerPageOptions = [20, 50, 100, 200, 500]
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const isRowsPerPageOpen = ref(false)

const formRegion = ref('')
const chairSearch = ref<CommissionSearchState>(createSearchState())
const deputyChairSearch = ref<CommissionSearchState>(createSearchState())
const secretarySearch = ref<CommissionSearchState>(createSearchState())
const formMembers = ref<CommissionMemberDraft[]>([createEmptyMember()])

function createSearchState(): CommissionSearchState {
  return {
    pinfl: '',
    profile: null,
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

function normalizeFullName(value: string) {
  return value.trim().toLocaleUpperCase('uz-UZ')
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

function updateSearchPinfl(state: { pinfl: string; profile: CommissionLookupProfile | null; error: string }, value: string) {
  state.pinfl = sanitizePinfl(value)
  state.profile = null
  state.error = ''
}

function lookupCommissionSearch(state: { pinfl: string; profile: CommissionLookupProfile | null; error: string }, offset = 0) {
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
    !member.fullName.trim() || !member.position.trim() || !member.phone.trim()
  )

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
      record.id,
      record.documentNumber,
      record.region,
      record.chair,
      record.secretary,
    ].some((value) => value.toLowerCase().includes(query))

    const matchesStatus = appliedStatusFilter.value === 'all' || record.status === appliedStatusFilter.value
    const matchesRegion = appliedRegionFilter.value === 'all' || record.region === appliedRegionFilter.value

    return matchesQuery && matchesStatus && matchesRegion
  })
})

const commissionStats = computed(() => {
  const total = commissions.value.length
  const inProgress = commissions.value.filter((item) => item.status === 'Jarayonda').length
  const approved = commissions.value.filter((item) => item.status === 'Tasdiqlangan').length
  const rejected = commissions.value.filter((item) => item.status === 'Rad etilgan').length

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
      title: 'Rad etilgan',
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

  return count
})
const hasActiveFilters = computed(() => {
  return appliedStatusFilter.value !== 'all' || appliedRegionFilter.value !== 'all'
})
const hasPendingFilterChanges = computed(() => {
  return draftStatusFilter.value !== appliedStatusFilter.value
    || draftRegionFilter.value !== appliedRegionFilter.value
})
const draftStatusLabel = computed(() => (
  draftStatusFilter.value === 'all' ? 'Barchasi' : draftStatusFilter.value
))
const draftRegionLabel = computed(() => (
  draftRegionFilter.value === 'all' ? 'Barchasi' : draftRegionFilter.value
))

function pushFeedback(type: 'success' | 'error' | 'info', message: string) {
  feedback.value = { type, message }
}

function resetForm() {
  editingId.value = null
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
  resetForm()
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
    deputyChair: normalizeFullName(deputyChairSearch.value.profile?.fullName ?? ''),
    secretary: normalizeFullName(secretarySearch.value.profile?.fullName ?? ''),
    members: normalizedMembers.value.map((member) => ({
      ...member,
      fullName: normalizeFullName(member.fullName),
      position: member.position.trim(),
      phone: member.phone.trim(),
      organization: member.organization.trim() || formRegion.value,
    })),
  }

  if (editingId.value) {
    const target = commissions.value.find((record) => record.id === editingId.value)
    if (!target) return

    target.region = payload.region
    target.chair = payload.chair
    target.deputyChair = payload.deputyChair
    target.secretary = payload.secretary
    target.members = payload.members
    target.updatedAt = timestamp

    if (target.workflowStage !== 'Tasdiqlangan') {
      target.workflowStage = 'Qoralama'
      target.status = 'Jarayonda'
      target.submittedAt = undefined
      target.rejectedAt = undefined
    }

    pushFeedback('success', `${target.documentNumber} yangilandi.`)
  } else {
    commissions.value.unshift({
      id: String(commissions.value.length + 1),
      documentNumber: nextDocumentNumber(),
      status: 'Jarayonda',
      workflowStage: 'Qoralama',
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload,
    })

    pushFeedback('success', 'Komissiya tarkibi yaratildi.')
  }

  closeCreateDialog()
}

function editCommission(record: CommissionRecord) {
  editingId.value = record.id
  formRegion.value = record.region
  chairSearch.value = {
    pinfl: hydrateExistingProfile(record.chair, record.region, `${record.id}01`).pinfl,
    profile: hydrateExistingProfile(record.chair, record.region, `${record.id}01`),
    error: '',
  }
  deputyChairSearch.value = {
    pinfl: hydrateExistingProfile(record.deputyChair, record.region, `${record.id}02`).pinfl,
    profile: hydrateExistingProfile(record.deputyChair, record.region, `${record.id}02`),
    error: '',
  }
  secretarySearch.value = {
    pinfl: hydrateExistingProfile(record.secretary, record.region, `${record.id}03`).pinfl,
    profile: hydrateExistingProfile(record.secretary, record.region, `${record.id}03`),
    error: '',
  }
  formMembers.value = record.members.map((member, index) => ({
    ...member,
    fullName: normalizeFullName(member.fullName),
    pinfl: hydrateExistingProfile(member.fullName, record.region, `${record.id}${String(index + 4).padStart(2, '0')}`).pinfl,
    region: record.region,
    district: hydrateExistingProfile(member.fullName, record.region, `${record.id}${String(index + 4).padStart(2, '0')}`).district,
    error: '',
  }))
  isCreateDialogOpen.value = true
  pushFeedback('info', `${record.documentNumber} tahrirlash uchun ochildi.`)
}

function deleteCommission(recordId: string) {
  commissions.value = commissions.value.filter((record) => record.id !== recordId)
  pushFeedback('success', "Komissiya tarkibi o'chirildi.")
}

function submitForApproval(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Tasdiqlashga yuborildi'
  target.status = 'Jarayonda'
  target.submittedAt = nowLabel()
  target.updatedAt = target.submittedAt
  pushFeedback('success', `${target.documentNumber} tasdiqlashga yuborildi.`)
}

function approveCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Tasdiqlangan'
  target.status = 'Tasdiqlangan'
  target.approvedAt = nowLabel()
  target.updatedAt = target.approvedAt
  pushFeedback('success', `${target.documentNumber} tasdiqlandi.`)
}

function rejectCommission(recordId: string) {
  const target = commissions.value.find((record) => record.id === recordId)
  if (!target) return

  target.workflowStage = 'Rad etilgan'
  target.status = 'Rad etilgan'
  target.rejectedAt = nowLabel()
  target.updatedAt = target.rejectedAt
  pushFeedback('success', `${target.documentNumber} rad etildi.`)
}

function applyFilters() {
  appliedStatusFilter.value = draftStatusFilter.value
  appliedRegionFilter.value = draftRegionFilter.value
  isFilterOpen.value = false
  openFilterField.value = null
  currentPage.value = 1
}

function clearFilters() {
  draftStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  openFilterField.value = null
}

function resetSearchAndFilters() {
  searchQuery.value = ''
  draftStatusFilter.value = 'all'
  appliedStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  appliedRegionFilter.value = 'all'
  isFilterOpen.value = false
  openFilterField.value = null
  currentPage.value = 1
}

function closeFilters() {
  isFilterOpen.value = false
  openFilterField.value = null
}

function toggleFiltersFromMenu(nextOpen: boolean) {
  if (nextOpen) {
    draftStatusFilter.value = appliedStatusFilter.value
    draftRegionFilter.value = appliedRegionFilter.value
    openFilterField.value = null
  } else {
    openFilterField.value = null
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

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
}

function setRowsPerPageOpen(nextOpen: boolean) {
  isRowsPerPageOpen.value = nextOpen
}

function setRowsPerPage(nextValue: number) {
  selectedRowsPerPage.value = nextValue
  currentPage.value = 1
}

function setActionMenuOpen(recordId: string, nextOpen: boolean) {
  openActionMenuId.value = nextOpen ? recordId : (openActionMenuId.value === recordId ? null : openActionMenuId.value)
}

async function downloadCommissions() {
  const xlsx = await import('xlsx')

  const exportRows = filteredCommissions.value.map((record) => ({
    ID: record.documentNumber,
    Sana: record.createdAt,
    Hudud: record.region,
    Status: record.status,
    Bosqich: workflowStageLabels[record.workflowStage],
    Rais: record.chair,
    Kotib: record.secretary,
    "A'zolar soni": record.members.length,
  }))

  const worksheet = xlsx.utils.json_to_sheet(exportRows)
  const workbook = xlsx.utils.book_new()
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Komissiyalar')
  xlsx.writeFile(workbook, 'iptk-komissiyalar-tarkibi.xlsx')
}

watch(formRegion, (nextRegion, previousRegion) => {
  if (!nextRegion || nextRegion === previousRegion) {
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
        :class="cn(
          'mb-4 rounded-2xl border px-4 py-3 text-sm',
          feedback.type === 'success' && 'border-emerald-200 bg-card text-foreground dark:border-emerald-900/60',
          feedback.type === 'error' && 'border-rose-200 bg-card text-foreground dark:border-rose-900/60',
          feedback.type === 'info' && 'border-sky-200 bg-card text-foreground dark:border-sky-900/60',
        )"
      >
        {{ feedback.message }}
      </div>

      <div class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col gap-5 overflow-visible rounded-2xl border border-border bg-card p-5">
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

        <div class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="relative w-full lg:max-w-sm">
              <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                class="pl-9"
                placeholder="Qidirish"
              />
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <Button @click="openCreateDialog">
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
                  :class="isFilterOpen ? 'gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'gap-2'"
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
                            v-for="status in ['Jarayonda', 'Tasdiqlangan', 'Rad etilgan']"
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

                    <div class="flex items-center justify-end gap-3 border-t border-border pt-3">
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
                        <p class="mt-1 font-semibold text-foreground">
                          {{ record.documentNumber }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                          {{ record.createdAt }}
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
                                :disabled="record.workflowStage === 'Tasdiqlangan'"
                                @click="editCommission(record)"
                              >
                                <Pencil class="h-4 w-4 shrink-0" />
                                <span>Tahrirlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.workflowStage === 'Qoralama'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="submitForApproval(record.id)"
                              >
                                <Send class="h-4 w-4 shrink-0" />
                                <span>Yuborish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.workflowStage === 'Tasdiqlashga yuborildi'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="approveCommission(record.id)"
                              >
                                <CheckCheck class="h-4 w-4 shrink-0" />
                                <span>Tasdiqlash</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.workflowStage === 'Tasdiqlashga yuborildi'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                @click="rejectCommission(record.id)"
                              >
                                <X class="h-4 w-4 shrink-0" />
                                <span>Rad etish</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                v-if="record.workflowStage === 'Qoralama'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                @click="deleteCommission(record.id)"
                              >
                                <Trash2 class="h-4 w-4 shrink-0" />
                                <span>O'chirish</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenuRoot>
                      </div>
                    </div>

                    <div class="grid gap-3 text-sm">
                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Hudud
                        </p>
                        <p class="mt-1 font-medium text-foreground">
                          {{ record.region }}
                        </p>
                      </div>

                      <div>
                        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Bosqich
                        </p>
                        <p class="mt-1 text-muted-foreground">
                          {{ workflowStageLabels[record.workflowStage] }}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div class="hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
              <table class="min-w-[1040px] border-separate border-spacing-0 text-sm xl:min-w-full">
                <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                  <tr>
                    <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">ID</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Sana</th>
                    <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Hudud</th>
                    <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedCommissions.length === 0">
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
                              :disabled="record.workflowStage === 'Tasdiqlangan'"
                              @click="editCommission(record)"
                            >
                              <Pencil class="h-4 w-4 shrink-0" />
                              <span>Tahrirlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.workflowStage === 'Qoralama'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="submitForApproval(record.id)"
                            >
                              <Send class="h-4 w-4 shrink-0" />
                              <span>Yuborish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.workflowStage === 'Tasdiqlashga yuborildi'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @click="approveCommission(record.id)"
                            >
                              <CheckCheck class="h-4 w-4 shrink-0" />
                              <span>Tasdiqlash</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.workflowStage === 'Tasdiqlashga yuborildi'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                              @click="rejectCommission(record.id)"
                            >
                              <X class="h-4 w-4 shrink-0" />
                              <span>Rad etish</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              v-if="record.workflowStage === 'Qoralama'"
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                              @click="deleteCommission(record.id)"
                            >
                              <Trash2 class="h-4 w-4 shrink-0" />
                              <span>O'chirish</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuPortal>
                      </DropdownMenuRoot>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <p class="font-semibold text-foreground">
                        {{ record.documentNumber }}
                      </p>
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-muted-foreground">
                      {{ record.createdAt }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top text-foreground">
                      {{ record.region }}
                    </td>
                    <td class="border-b border-border px-4 py-3 align-top">
                      <span :class="cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', statusClassMap[record.status])">
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
              :disabled="currentPage === 1"
              @click="goToPage(1)"
            >
              <ChevronsLeft class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="currentPage === 1"
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
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              <ChevronRight class="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 w-7 rounded-md p-0 self-center"
              :disabled="currentPage === totalPages"
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
        v-if="isCreateDialogOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6"
        @click.self="closeCreateDialog"
      >
        <div class="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-border bg-background shadow-2xl">
          <div class="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 class="text-xl font-semibold text-foreground">
                {{ editingId ? "Komissiya tarkibini tahrirlash" : "Komissiya tarkibini shakllantirish" }}
              </h2>
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
              <label class="max-w-sm space-y-2 text-sm font-medium text-foreground">
                <span>Viloyat</span>
                <select
                  v-model="formRegion"
                  class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    Viloyatni tanlang
                  </option>
                  <option
                    v-for="region in regionOptions"
                    :key="region"
                    :value="region"
                  >
                    {{ region }}
                  </option>
                </select>
              </label>
            </div>

            <div
              v-if="formRegion"
              class="grid gap-4 xl:grid-cols-2"
            >
              <div class="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
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
                  class="overflow-hidden rounded-2xl border border-border bg-background"
                >
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">F.I.O.</div>
                    <div class="px-4 py-3 text-foreground">{{ chairSearch.profile.fullName }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">JSHSHIR</div>
                    <div class="px-4 py-3 text-foreground">{{ chairSearch.profile.pinfl }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">Hudud</div>
                    <div class="px-4 py-3 text-foreground">{{ chairSearch.profile.region }}, {{ chairSearch.profile.district }}</div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4">
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
                  class="overflow-hidden rounded-2xl border border-border bg-background"
                >
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">F.I.O.</div>
                    <div class="px-4 py-3 text-foreground">{{ deputyChairSearch.profile.fullName }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">JSHSHIR</div>
                    <div class="px-4 py-3 text-foreground">{{ deputyChairSearch.profile.pinfl }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">Hudud</div>
                    <div class="px-4 py-3 text-foreground">{{ deputyChairSearch.profile.region }}, {{ deputyChairSearch.profile.district }}</div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 rounded-3xl border border-border/70 bg-muted/20 p-4 xl:col-span-2">
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
                  class="overflow-hidden rounded-2xl border border-border bg-background"
                >
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">F.I.O.</div>
                    <div class="px-4 py-3 text-foreground">{{ secretarySearch.profile.fullName }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">JSHSHIR</div>
                    <div class="px-4 py-3 text-foreground">{{ secretarySearch.profile.pinfl }}</div>
                  </div>
                  <div class="grid grid-cols-[180px_minmax(0,1fr)] text-sm">
                    <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">Hudud</div>
                    <div class="px-4 py-3 text-foreground">{{ secretarySearch.profile.region }}, {{ secretarySearch.profile.district }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="formRegion"
              class="space-y-4 rounded-3xl border border-dashed border-border/70 bg-muted/20 p-4"
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
                  class="rounded-2xl border border-border/70 bg-background p-4"
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
                    class="mt-3 overflow-hidden rounded-2xl border border-border bg-muted/10"
                  >
                    <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                      <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">F.I.O.</div>
                      <div class="px-4 py-3 text-foreground">{{ member.fullName }}</div>
                    </div>
                    <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                      <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">Tug'ilgan sanasi</div>
                      <div class="px-4 py-3 text-foreground">{{ member.birthDate }}</div>
                    </div>
                    <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                      <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">JSHSHIR</div>
                      <div class="px-4 py-3 text-foreground">{{ member.pinfl }}</div>
                    </div>
                    <div class="grid grid-cols-[180px_minmax(0,1fr)] border-b border-border text-sm">
                      <div class="bg-muted/40 px-4 py-3 font-medium text-muted-foreground">Hudud</div>
                      <div class="px-4 py-3 text-foreground">{{ member.region }}, {{ member.district }}</div>
                    </div>
                    <div class="grid gap-3 border-t-0 p-4 md:grid-cols-2">
                      <label class="space-y-2 text-sm font-medium text-foreground">
                        <span>Asosiy lavozimi</span>
                        <Input
                          v-model="member.position"
                          placeholder="Asosiy lavozimini kiriting"
                        />
                      </label>
                      <label class="space-y-2 text-sm font-medium text-foreground">
                        <span>Telefon raqami</span>
                        <Input
                          v-model="member.phone"
                          placeholder="+998 XX XXX XX XX"
                        />
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
                  {{ editingId ? 'Yangilash' : 'Saqlash' }}
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
