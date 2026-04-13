<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { Check, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Download, Ellipsis, Eye, FilePenLine, Filter, Plus, Search, Trash2, X } from 'lucide-vue-next'
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
const isTableLoading = ref(true)
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

  if (!query) {
    return applicationRows.value
  }

  return applicationRows.value.filter((row) => {
    return [
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
  })
})

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
              <Button
                variant="outline"
                class="gap-2"
              >
                <Filter class="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button
                variant="outline"
                class="gap-2"
              >
                <Download class="h-4 w-4" />
                <span>Yuklab olish</span>
              </Button>
            </div>
          </div>

          <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-visible rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1 xl:overflow-hidden">
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
                      @click="clearSearch"
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

                          <DropdownMenuRoot>
                            <DropdownMenuTrigger as-child>
                              <Button
                                variant="outline"
                                size="sm"
                                class="h-8 w-8 rounded-md p-0"
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

              <div class="hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-visible [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
                <table class="min-w-[1100px] border-separate border-spacing-0 text-sm xl:min-w-full">
                  <thead class="sticky top-0 z-10 bg-muted/95 text-left text-muted-foreground backdrop-blur">
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
                          @click="clearSearch"
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
                        <DropdownMenuRoot>
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              class="h-8 w-8 rounded-md p-0"
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
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          class="h-8 gap-1.5 px-2.5 text-sm"
                        >
                          <span>{{ selectedRowsPerPage }}</span>
                          <ChevronRight class="h-4 w-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          align="start"
                          :side-offset="6"
                          class="z-50 min-w-20 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            v-for="option in rowsPerPageOptions"
                            :key="option"
                            class="cursor-pointer rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
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

                <div class="inline-flex w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-1 min-[480px]:w-auto min-[480px]:justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 rounded-md p-0"
                    :disabled="isTableLoading || currentPage === 1"
                    @click="goToPage(1)"
                  >
                    <ChevronsLeft class="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 rounded-md p-0"
                    :disabled="isTableLoading || currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                  >
                    <ChevronLeft class="h-5 w-5" />
                  </Button>
                  <div class="mx-1 min-w-14 text-center text-sm font-semibold text-foreground">
                    {{ currentPageSummary }}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 rounded-md p-0"
                    :disabled="isTableLoading || currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                  >
                    <ChevronRight class="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-8 w-8 rounded-md p-0"
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

