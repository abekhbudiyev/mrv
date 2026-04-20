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
  fullName: string
  position: string
  organization: string
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
  Jarayonda: 'border-amber-200 bg-amber-50 text-amber-700',
  Tasdiqlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  'Rad etilgan': 'border-rose-200 bg-rose-50 text-rose-700',
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
        fullName: "Rasulov Sherzod G'ayratovich",
        position: 'Psixiatr',
        organization: 'Ruhiy salomatlik markazi',
      },
      {
        id: crypto.randomUUID(),
        fullName: 'Bozorova Nilufar Sodiq qizi',
        position: 'Nevropatolog',
        organization: "Hududiy sog'liqni saqlash boshqarmasi",
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
        fullName: 'Yusupov Odilbek Akbarovich',
        position: 'Psixolog',
        organization: 'Hududiy IPTK',
      },
      {
        id: crypto.randomUUID(),
        fullName: 'Eshonqulova Shahlo Islom qizi',
        position: 'Ijtimoiy xodim',
        organization: 'Inson markazi',
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
        fullName: 'Meliqulov Doston Otabekovich',
        position: 'Psixiatr',
        organization: "Viloyat ruhiy salomatlik markazi",
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
const formChair = ref('')
const formDeputyChair = ref('')
const formSecretary = ref('')
const formMembers = ref<CommissionMemberDraft[]>([createEmptyMember()])

function createEmptyMember(): CommissionMemberDraft {
  return {
    id: crypto.randomUUID(),
    fullName: '',
    position: '',
    organization: '',
  }
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
  formMembers.value.filter((member) => member.fullName.trim() || member.position.trim() || member.organization.trim())
)

const formError = computed(() => {
  if (!formRegion.value) return 'Viloyat tanlanishi kerak.'
  if (!formChair.value.trim()) return 'Komissiya raisi kiritilishi kerak.'
  if (!formDeputyChair.value.trim()) return "Rais o'rinbosari kiritilishi kerak."
  if (!formSecretary.value.trim()) return 'Kotib kiritilishi kerak.'
  if (normalizedMembers.value.length === 0) return "Kamida bitta a'zo kiritilishi kerak."

  const invalidMember = normalizedMembers.value.some((member) =>
    !member.fullName.trim() || !member.position.trim() || !member.organization.trim()
  )

  if (invalidMember) {
    return "Har bir a'zo uchun F.I.O., lavozim va tashkilot to'liq kiritilishi kerak."
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
      tone: 'border-slate-200 bg-background',
      badge: 'bg-slate-500',
    },
    {
      id: 'in-progress',
      title: 'Jarayonda',
      value: commissionStats.value.inProgress,
      share: buildShare(commissionStats.value.inProgress),
      tone: 'border-amber-200 bg-amber-50',
      badge: 'bg-amber-500',
    },
    {
      id: 'approved',
      title: 'Tasdiqlangan',
      value: commissionStats.value.approved,
      share: buildShare(commissionStats.value.approved),
      tone: 'border-emerald-200 bg-emerald-50',
      badge: 'bg-emerald-500',
    },
    {
      id: 'rejected',
      title: 'Rad etilgan',
      value: commissionStats.value.rejected,
      share: buildShare(commissionStats.value.rejected),
      tone: 'border-rose-200 bg-rose-50',
      badge: 'bg-rose-500',
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

function pushFeedback(type: 'success' | 'error' | 'info', message: string) {
  feedback.value = { type, message }
}

function resetForm() {
  editingId.value = null
  formRegion.value = ''
  formChair.value = ''
  formDeputyChair.value = ''
  formSecretary.value = ''
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
    chair: formChair.value.trim(),
    deputyChair: formDeputyChair.value.trim(),
    secretary: formSecretary.value.trim(),
    members: normalizedMembers.value.map((member) => ({
      ...member,
      fullName: member.fullName.trim(),
      position: member.position.trim(),
      organization: member.organization.trim(),
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
  formChair.value = record.chair
  formDeputyChair.value = record.deputyChair
  formSecretary.value = record.secretary
  formMembers.value = record.members.map((member) => ({ ...member }))
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
  appliedStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  appliedRegionFilter.value = 'all'
  isFilterOpen.value = false
  openFilterField.value = null
  currentPage.value = 1
}

function resetSearchAndFilters() {
  searchQuery.value = ''
  clearFilters()
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
          feedback.type === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
          feedback.type === 'error' && 'border-rose-200 bg-rose-50 text-rose-700',
          feedback.type === 'info' && 'border-sky-200 bg-sky-50 text-sky-700',
        )"
      >
        {{ feedback.message }}
      </div>

      <div class="rounded-2xl border border-border bg-card p-5">
        <div class="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <div class="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
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
                <Button
                  variant="outline"
                  :class="isFilterOpen ? 'border-ring bg-accent/40 ring-2 ring-ring/20' : ''"
                  @click="isFilterOpen = !isFilterOpen"
                >
                  <Filter class="h-4 w-4" />
                  Filter
                </Button>

                <div
                  v-if="isFilterOpen"
                  class="absolute right-0 top-[calc(100%+0.4rem)] z-20 w-80 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl"
                >
                  <div class="flex flex-col gap-3 p-4">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-semibold text-foreground">Filterlar</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        @click="isFilterOpen = false"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <label class="space-y-2 text-sm relative">
                      <span class="font-medium text-foreground">Status</span>
                      <Button
                        variant="outline"
                        class="h-9 w-full justify-between px-3 text-sm font-normal"
                        @click="toggleFilterField('status')"
                      >
                        <span>{{ draftStatusFilter === 'all' ? 'Barchasi' : draftStatusFilter }}</span>
                        <ChevronDown class="h-4 w-4" />
                      </Button>
                      <div
                        v-if="openFilterField === 'status'"
                        class="absolute left-0 top-[calc(100%+0.45rem)] z-10 w-full rounded-xl border border-border bg-popover p-1 shadow-lg"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          @click="selectStatusFilter('all')"
                        >
                          <span>Barchasi</span>
                        </button>
                        <button
                          v-for="status in ['Jarayonda', 'Tasdiqlangan', 'Rad etilgan']"
                          :key="status"
                          type="button"
                          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          @click="selectStatusFilter(status as CommissionStatus)"
                        >
                          <span>{{ status }}</span>
                        </button>
                      </div>
                    </label>

                    <label class="space-y-2 text-sm relative">
                      <span class="font-medium text-foreground">Hudud</span>
                      <Button
                        variant="outline"
                        class="h-9 w-full justify-between px-3 text-sm font-normal"
                        @click="toggleFilterField('region')"
                      >
                        <span class="truncate">{{ draftRegionFilter === 'all' ? 'Barchasi' : draftRegionFilter }}</span>
                        <ChevronDown class="h-4 w-4" />
                      </Button>
                      <div
                        v-if="openFilterField === 'region'"
                        class="absolute left-0 top-[calc(100%+0.45rem)] z-10 w-full rounded-xl border border-border bg-popover p-1 shadow-lg"
                      >
                        <button
                          type="button"
                          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          @click="selectRegionFilter('all')"
                        >
                          <span>Barchasi</span>
                        </button>
                        <button
                          v-for="region in regionOptions"
                          :key="region"
                          type="button"
                          class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          @click="selectRegionFilter(region)"
                        >
                          <span class="truncate">{{ region }}</span>
                        </button>
                      </div>
                    </label>

                    <div class="flex items-center justify-end gap-3 border-t border-border pt-3">
                      <Button
                        variant="outline"
                        @click="clearFilters"
                      >
                        Tozalash
                      </Button>
                      <Button @click="applyFilters">
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
                      <p class="mt-1 text-xs text-muted-foreground">
                        {{ workflowStageLabels[record.workflowStage] }}
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
              <p class="mt-1 text-sm text-muted-foreground">
                Kotib komissiya raisi, rais o'rinbosari, kotib va a'zolar tarkibini shakllantiradi.
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
            <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label class="space-y-2 text-sm font-medium text-foreground">
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

              <label class="space-y-2 text-sm font-medium text-foreground">
                <span>Komissiya raisi</span>
                <Input
                  v-model="formChair"
                  placeholder="F.I.O. kiriting"
                />
              </label>

              <label class="space-y-2 text-sm font-medium text-foreground">
                <span>Rais o'rinbosari</span>
                <Input
                  v-model="formDeputyChair"
                  placeholder="F.I.O. kiriting"
                />
              </label>

              <label class="space-y-2 text-sm font-medium text-foreground">
                <span>Kotib</span>
                <Input
                  v-model="formSecretary"
                  placeholder="F.I.O. kiriting"
                />
              </label>
            </div>

            <div class="space-y-4 rounded-3xl border border-dashed border-border/70 bg-muted/20 p-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-foreground">
                    Komissiya a'zolari
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    Bir nechta mutaxassis qo'shiladi.
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

                  <div class="grid gap-3 lg:grid-cols-3">
                    <label class="space-y-2 text-sm font-medium text-foreground">
                      <span>F.I.O.</span>
                      <Input
                        v-model="member.fullName"
                        placeholder="To'liq ism kiriting"
                      />
                    </label>

                    <label class="space-y-2 text-sm font-medium text-foreground">
                      <span>Lavozim</span>
                      <Input
                        v-model="member.position"
                        placeholder="Masalan, psixiatr"
                      />
                    </label>

                    <label class="space-y-2 text-sm font-medium text-foreground">
                      <span>Tashkilot</span>
                      <Input
                        v-model="member.organization"
                        placeholder="Muassasa nomi"
                      />
                    </label>
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
                Saqlangandan keyin hujjat ro'yxatda paydo bo'ladi va kotib uni tasdiqlashga yuborishi mumkin.
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
