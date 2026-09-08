<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock3,
  FileHeart,
  Filter,
  FolderKanban,
  GitBranch,
  HeartHandshake,
  History,
  Layers3,
  ListChecks,
  Network,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Waypoints,
  Workflow,
} from 'lucide-vue-next'
import {
  appealStatusDefinitions,
  casePhaseDefinitions,
  caseTypeDefinitions,
  demoCases,
  intakeChannelDefinitions,
  planStatusDefinitions,
  processSteps,
  referralStatusDefinitions,
  serviceRouteDefinitions,
} from '@/features/ptpk/demo-data'
import type {
  AppealStatus,
  CasePhase,
  CasePriority,
  CaseTypeCode,
  IntakeChannelCode,
  PTPKCase,
  ReferralStatus,
  ServiceRouteCode,
} from '@/features/ptpk/types'
import PageContainer from '@/shared/components/PageContainer.vue'
import StatusTabs from '@/shared/components/StatusTabs.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

const props = withDefaults(defineProps<{
  pageKey: string
  caseId?: string
}>(), {
  caseId: '',
})

const router = useRouter()
const cases = ref<PTPKCase[]>(JSON.parse(JSON.stringify(demoCases)) as PTPKCase[])
const searchQuery = ref('')
const phaseFilter = ref<'ALL' | CasePhase>('ALL')
const priorityFilter = ref<'ALL' | CasePriority>('ALL')
const referralFilter = ref<'ALL' | ReferralStatus>('ALL')
const showSignalForm = ref(false)
const detailTab = ref('overview')
const referenceTab = ref<'cases' | 'services' | 'statuses'>('cases')
const feedback = ref('')

const signalForm = reactive<{
  childName: string
  caseType: CaseTypeCode
  channel: IntakeChannelCode
  summary: string
}>({
  childName: '',
  caseType: 'C1',
  channel: 'FAMILY',
  summary: '',
})

const phaseMap = computed(() => new Map(casePhaseDefinitions.map((item) => [item.code, item])))
const planStatusMap = computed(() => new Map(planStatusDefinitions.map((item) => [item.code, item])))
const referralStatusMap = computed(() => new Map(referralStatusDefinitions.map((item) => [item.code, item])))
const appealStatusMap = computed(() => new Map(appealStatusDefinitions.map((item) => [item.code, item])))
const caseTypeMap = computed(() => new Map(caseTypeDefinitions.map((item) => [item.code, item])))
const serviceMap = computed(() => new Map(serviceRouteDefinitions.map((item) => [item.code, item])))
const channelMap = computed(() => new Map(intakeChannelDefinitions.map((item) => [item.code, item])))

const allReferrals = computed(() => cases.value.flatMap((caseItem) => (
  caseItem.plan.referrals.map((referral) => ({ caseItem, referral }))
)))

const currentCase = computed(() => cases.value.find((caseItem) => (
  caseItem.id === props.caseId || caseItem.displayId === props.caseId
)) ?? cases.value[0])

const filteredCases = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('uz')

  return cases.value.filter((caseItem) => {
    const matchesQuery = !query || [
      caseItem.displayId,
      caseItem.child.fullName,
      caseItem.child.pinfl,
      caseItem.child.district,
      caseItem.owner,
    ].some((value) => value.toLocaleLowerCase('uz').includes(query))
    const matchesPhase = phaseFilter.value === 'ALL' || caseItem.phase === phaseFilter.value
    const matchesPriority = priorityFilter.value === 'ALL' || caseItem.priority === priorityFilter.value

    return matchesQuery && matchesPhase && matchesPriority
  })
})

const filteredReferrals = computed(() => allReferrals.value.filter(({ referral }) => (
  referralFilter.value === 'ALL' || referral.status === referralFilter.value
)))

const phaseTabs = computed(() => [
  { label: 'Barchasi', value: 'all', count: cases.value.length, dotClass: 'bg-slate-500' },
  ...casePhaseDefinitions
    .map((phase) => ({
      label: phase.title,
      value: phase.code,
      count: cases.value.filter((caseItem) => caseItem.phase === phase.code).length,
      dotClass: toneDotClass(phase.tone),
    }))
    .filter((tab) => tab.count > 0),
])

const openCases = computed(() => cases.value.filter((caseItem) => caseItem.phase !== 'CLOSED'))
const urgentCases = computed(() => cases.value.filter((caseItem) => caseItem.flags.urgent || caseItem.flags.overdue))
const waitingReferrals = computed(() => allReferrals.value.filter(({ referral }) => referral.status === 'WAITLISTED'))
const startedReferrals = computed(() => allReferrals.value.filter(({ referral }) => ['STARTED', 'COMPLETED'].includes(referral.status)))
const startedRate = computed(() => {
  if (!allReferrals.value.length) return 0
  return Math.round((startedReferrals.value.length / allReferrals.value.length) * 100)
})

const dashboardMetrics = computed(() => [
  { label: 'Ochiq case', value: String(openCases.value.length), detail: `${cases.value.filter((item) => item.flags.currentlyUnserved).length} bola hozircha xizmatga jalb etilmagan`, icon: FolderKanban, tone: 'text-sky-700 bg-sky-500/10 dark:text-sky-300' },
  { label: 'Urgent / SLA xavfi', value: String(urgentCases.value.length), detail: 'inson qarori va tezkor himoya talab etadi', icon: AlertTriangle, tone: 'text-rose-700 bg-rose-500/10 dark:text-rose-300' },
  { label: 'Birinchi yordamgacha', value: '3,2 kun', detail: 'demo median, signal sanasidan boshlab', icon: Clock3, tone: 'text-violet-700 bg-violet-500/10 dark:text-violet-300' },
  { label: 'Xizmatni kutmoqda', value: String(waitingReferrals.value.length), detail: 'navbat ehtiyojni bekor qilmaydi', icon: CalendarClock, tone: 'text-amber-700 bg-amber-500/10 dark:text-amber-300' },
  { label: 'STARTED ulushi', value: `${startedRate.value}%`, detail: 'yo‘llanma emas, amaldagi xizmat natijasi', icon: BadgeCheck, tone: 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-300' },
  { label: '30/90 kun barqaror', value: '78%', detail: 'xizmat davomiyligi bo‘yicha demo ko‘rsatkich', icon: Activity, tone: 'text-teal-700 bg-teal-500/10 dark:text-teal-300' },
])

const funnelSteps = computed(() => {
  const progressedBeyond = (phases: CasePhase[]) => cases.value.filter((item) => phases.includes(item.phase)).length
  return [
    { label: 'Signal', value: cases.value.length },
    { label: 'Triage yakunlangan', value: progressedBeyond(['ASSESSMENT', 'PLAN_DEVELOPMENT', 'AUTHORIZATION', 'SERVICE_COORDINATION', 'MONITORING', 'REVIEW', 'CLOSED']) },
    { label: 'Reja', value: cases.value.filter((item) => item.plan.status !== 'NOT_STARTED').length },
    { label: 'Provider qabul qilgan', value: cases.value.filter((item) => item.plan.referrals.some((referral) => ['PROVIDER_ACCEPTED', 'SCHEDULED', 'STARTED', 'COMPLETED'].includes(referral.status))).length },
    { label: 'Xizmat boshlangan', value: cases.value.filter((item) => item.plan.referrals.some((referral) => ['STARTED', 'COMPLETED'].includes(referral.status))).length },
  ]
})

const operationalQueue = computed(() => [...openCases.value]
  .sort((left, right) => priorityRank(right.priority) - priorityRank(left.priority))
  .slice(0, 5))

const caseTypeDistribution = computed(() => caseTypeDefinitions.map((definition) => ({
  ...definition,
  count: cases.value.filter((item) => item.type === definition.code).length,
})))
const maxCaseTypeCount = computed(() => Math.max(...caseTypeDistribution.value.map((item) => item.count), 1))

const triageCases = computed(() => cases.value.filter((caseItem) => (
  ['SIGNAL_RECEIVED', 'IDENTITY_CHECK', 'TRIAGE', 'ASSESSMENT'].includes(caseItem.phase)
)))

const reviewCases = computed(() => cases.value.filter((caseItem) => (
  caseItem.phase === 'REVIEW' || caseItem.type === 'C4' || caseItem.type === 'C5' || caseItem.type === 'C9' || Boolean(caseItem.appeal && caseItem.appeal.status !== 'NONE')
)))

const detailTabs = [
  { value: 'overview', label: 'Umumiy' },
  { value: 'assessment', label: 'Baholash' },
  { value: 'plan', label: 'Reja' },
  { value: 'referrals', label: 'Yo‘naltirishlar' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'history', label: 'Tarix' },
]

const phaseOrder: CasePhase[] = [
  'SIGNAL_RECEIVED',
  'IDENTITY_CHECK',
  'TRIAGE',
  'ASSESSMENT',
  'PLAN_DEVELOPMENT',
  'AUTHORIZATION',
  'SERVICE_COORDINATION',
  'MONITORING',
  'REVIEW',
  'CLOSED',
]

const referralNextStatus: Partial<Record<ReferralStatus, ReferralStatus>> = {
  DRAFT: 'READY_TO_REFER',
  READY_TO_REFER: 'REFERRED',
  REFERRED: 'MATCHING',
  MATCHING: 'PROVIDER_ACCEPTED',
  WAITLISTED: 'MATCHING',
  PROVIDER_ACCEPTED: 'SCHEDULED',
  PROVIDER_DECLINED: 'MATCHING',
  SCHEDULED: 'STARTED',
  STARTED: 'COMPLETED',
  PAUSED: 'STARTED',
}

const appealNextStatus: Partial<Record<AppealStatus, AppealStatus>> = {
  SUBMITTED: 'ADMISSIBILITY_CHECK',
  ADMISSIBILITY_CHECK: 'UNDER_REVIEW',
  UNDER_REVIEW: 'DECISION_MADE',
  DECISION_MADE: 'IMPLEMENTATION_PENDING',
  IMPLEMENTATION_PENDING: 'IMPLEMENTED',
  IMPLEMENTED: 'CLOSED',
}

const delayReasons = [
  { label: 'Provider sig‘imi', value: 8, tone: 'bg-rose-500' },
  { label: 'Mutaxassis yetishmasligi', value: 6, tone: 'bg-amber-500' },
  { label: 'Transport / kirish imkoniyati', value: 5, tone: 'bg-violet-500' },
  { label: 'Oila bilan aloqa', value: 3, tone: 'bg-sky-500' },
  { label: 'Hujjat yoki integratsiya', value: 2, tone: 'bg-slate-500' },
]

function phaseLabel(value: CasePhase) {
  return phaseMap.value.get(value)?.title ?? value
}

function planStatusLabel(value: PTPKCase['plan']['status']) {
  return planStatusMap.value.get(value)?.title ?? value
}

function referralStatusLabel(value: ReferralStatus) {
  return referralStatusMap.value.get(value)?.title ?? value
}

function appealStatusLabel(value: AppealStatus) {
  return appealStatusMap.value.get(value)?.title ?? value
}

function caseTypeLabel(value: CaseTypeCode) {
  return caseTypeMap.value.get(value)?.title ?? value
}

function serviceLabel(value: ServiceRouteCode) {
  return serviceMap.value.get(value)?.title ?? value
}

function channelLabel(value: IntakeChannelCode) {
  return channelMap.value.get(value)?.title ?? value
}

function toneClass(tone?: string) {
  const classes: Record<string, string> = {
    neutral: 'border-border bg-muted text-foreground',
    info: 'border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300',
    warning: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    danger: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    purple: 'border-violet-500/25 bg-violet-500/10 text-violet-700 dark:text-violet-300',
  }
  return classes[tone ?? 'neutral'] ?? classes.neutral
}

function toneDotClass(tone?: string) {
  const classes: Record<string, string> = {
    neutral: 'bg-slate-500',
    info: 'bg-sky-500',
    warning: 'bg-amber-500',
    success: 'bg-emerald-500',
    danger: 'bg-rose-500',
    purple: 'bg-violet-500',
  }
  return classes[tone ?? 'neutral'] ?? classes.neutral
}

function phaseTone(value: CasePhase) {
  return toneClass(phaseMap.value.get(value)?.tone)
}

function planTone(value: PTPKCase['plan']['status']) {
  return toneClass(planStatusMap.value.get(value)?.tone)
}

function referralTone(value: ReferralStatus) {
  return toneClass(referralStatusMap.value.get(value)?.tone)
}

function appealTone(value: AppealStatus) {
  return toneClass(appealStatusMap.value.get(value)?.tone)
}

function priorityLabel(value: CasePriority) {
  return ({ ROUTINE: 'Oddiy', PRIORITY: 'Ustuvor', URGENT: 'Shoshilinch' } as const)[value]
}

function priorityClass(value: CasePriority) {
  return value === 'URGENT'
    ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
    : value === 'PRIORITY'
      ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
      : 'border-border bg-muted text-muted-foreground'
}

function priorityRank(value: CasePriority) {
  return ({ ROUTINE: 1, PRIORITY: 2, URGENT: 3 } as const)[value]
}

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function ageFromBirthDate(value: string) {
  const birthDate = new Date(value)
  const now = new Date('2026-08-29')
  let age = now.getFullYear() - birthDate.getFullYear()
  if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) age -= 1
  return Math.max(age, 0)
}

function maskPinfl(value: string) {
  if (value.includes('•')) return value
  return value.length >= 8 ? `${value.slice(0, 5)}••••••${value.slice(-3)}` : value
}

function educationLabel(value: PTPKCase['child']['educationEngagement']) {
  return ({
    NOT_ENGAGED: 'Ta’limga jalb etilmagan',
    PRESCHOOL: 'Maktabgacha ta’limda',
    SCHOOL: 'Maktabda',
    HOME_EDUCATION: 'Uyda ta’limda',
    GRADUATED: 'Ta’limni tugatgan',
  } as const)[value]
}

function domainLabel(value: PTPKCase['needs'][number]['domain']) {
  return ({
    LEARNING: 'O‘rganish',
    COMMUNICATION: 'Kommunikatsiya',
    MOBILITY: 'Harakatlanish',
    SELF_CARE: 'O‘ziga xizmat',
    BEHAVIOUR: 'Xulq-atvor va hissiyot',
    HEALTH: 'Sog‘liq',
    SAFETY: 'Xavfsizlik',
    FAMILY_ACCESS: 'Oila va kirish imkoniyati',
  } as const)[value]
}

function severityClass(value: PTPKCase['needs'][number]['severity']) {
  return value === 'CRITICAL'
    ? 'bg-rose-500'
    : value === 'HIGH'
      ? 'bg-amber-500'
      : value === 'MEDIUM'
        ? 'bg-sky-500'
        : 'bg-emerald-500'
}

function selectPhase(value: string) {
  phaseFilter.value = value === 'all' ? 'ALL' : value as CasePhase
}

function selectDetailTab(value: string) {
  detailTab.value = value
}

function selectReferenceTab(value: string) {
  referenceTab.value = value as typeof referenceTab.value
}

function notify(message: string) {
  feedback.value = message
  window.setTimeout(() => {
    if (feedback.value === message) feedback.value = ''
  }, 3500)
}

function resetSignalForm() {
  signalForm.childName = ''
  signalForm.caseType = 'C1'
  signalForm.channel = 'FAMILY'
  signalForm.summary = ''
}

async function createSignal() {
  if (!signalForm.childName.trim() || !signalForm.summary.trim()) {
    notify('Bola F.I.Sh. va signal mazmunini kiriting.')
    return
  }

  const serial = cases.value.length + 1
  const now = new Date().toISOString()
  const id = `ptpk-${Date.now()}`
  const createdCase: PTPKCase = {
    id,
    displayId: `PTPK-2026-${String(serial).padStart(3, '0')}`,
    type: signalForm.caseType,
    intakeChannel: signalForm.channel,
    priority: signalForm.caseType === 'C7' ? 'URGENT' : 'ROUTINE',
    phase: 'SIGNAL_RECEIVED',
    child: {
      id: `child-${Date.now()}`,
      fullName: signalForm.childName.trim(),
      birthDate: '2020-05-12',
      pinfl: '62005•••••••••',
      gender: 'FEMALE',
      district: 'Aniqlashtirilmoqda',
      representativeName: 'Aniqlashtirilmoqda',
      representativePhone: '+998 •• ••• •• ••',
      educationEngagement: 'NOT_ENGAGED',
    },
    signalSummary: signalForm.summary.trim(),
    needs: [],
    consentStatus: 'PENDING',
    assignedTeam: 'Triage navbati',
    owner: 'Tayinlanmagan',
    createdAt: now,
    updatedAt: now,
    dueAt: new Date(Date.now() + (signalForm.caseType === 'C7' ? 4 : 72) * 60 * 60 * 1000).toISOString(),
    nextAction: signalForm.caseType === 'C7' ? 'Xavfsizlikni tezkor tekshirish' : 'Shaxsni aniqlash va dublikatni tekshirish',
    flags: {
      urgent: signalForm.caseType === 'C7',
      safeguarding: signalForm.caseType === 'C7',
      currentlyUnserved: signalForm.caseType === 'C1',
      overdue: false,
    },
    plan: {
      id: `plan-${Date.now()}`,
      version: 1,
      status: 'NOT_STARTED',
      goals: [],
      owner: 'Tayinlanmagan',
      referrals: [],
    },
    timeline: [{
      id: `event-${Date.now()}`,
      at: now,
      kind: 'SIGNAL',
      title: 'Signal qabul qilindi',
      description: signalForm.summary.trim(),
      actor: channelLabel(signalForm.channel),
    }],
  }

  cases.value.unshift(createdCase)
  showSignalForm.value = false
  resetSignalForm()
  notify(`${createdCase.displayId} yaratildi. Bu hali avtomatik xulosa emas.`)
  await router.push(`/apps/ptpk/cases/${createdCase.id}`)
}

function advanceCase(caseItem: PTPKCase) {
  const currentIndex = phaseOrder.indexOf(caseItem.phase)
  const nextPhase = phaseOrder[currentIndex + 1]

  if (!nextPhase || nextPhase === 'CLOSED') {
    notify('Case’ni yopish alohida inson tasdig‘i va xizmat natijasi tekshiruvini talab qiladi.')
    return
  }

  caseItem.phase = nextPhase
  caseItem.updatedAt = new Date().toISOString()
  caseItem.nextAction = nextPhase === 'ASSESSMENT'
    ? 'Funksional domenlar bo‘yicha maqsadli baholash'
    : nextPhase === 'PLAN_DEVELOPMENT'
      ? 'Oila bilan integratsiyalashgan rejani tuzish'
      : 'Bosqich vazifalarini yakunlash'
  notify(`${caseItem.displayId}: ${phaseLabel(nextPhase)} bosqichiga o‘tkazildi.`)
}

function advanceReferral(caseItem: PTPKCase, referralId: string) {
  const referral = caseItem.plan.referrals.find((item) => item.id === referralId)
  if (!referral) return
  const nextStatus = referralNextStatus[referral.status]

  if (!nextStatus) {
    notify('Bu yo‘naltirish uchun keyingi demo amali mavjud emas.')
    return
  }

  referral.status = nextStatus
  referral.updatedAt = new Date().toISOString()
  if (nextStatus === 'STARTED') {
    referral.actualStartDate = new Date().toISOString().slice(0, 10)
    caseItem.plan.status = 'ACTIVE'
  }
  const substantiveReferrals = caseItem.plan.referrals.filter((item) => !item.isTemporary)
  if (substantiveReferrals.length && substantiveReferrals.every((item) => ['STARTED', 'COMPLETED'].includes(item.status))) {
    caseItem.phase = 'MONITORING'
    caseItem.nextAction = '30 kunlik natija monitoringi'
  }
  notify(`${referral.serviceName}: ${referralStatusLabel(nextStatus)}.`)
}

function advanceAppeal(caseItem: PTPKCase) {
  if (!caseItem.appeal) return
  const nextStatus = appealNextStatus[caseItem.appeal.status]
  if (!nextStatus) {
    notify('Apellyatsiya bo‘yicha keyingi demo amali mavjud emas.')
    return
  }
  caseItem.appeal.status = nextStatus
  notify(`Apellyatsiya: ${appealStatusLabel(nextStatus)}. Amaldagi xavfsiz xizmatlar davom etadi.`)
}

function nextReferralAction(status: ReferralStatus) {
  return status === 'WAITLISTED'
    ? 'Muqobil provider izlash'
    : status === 'SCHEDULED'
      ? 'Boshlanganini tasdiqlash'
      : status === 'STARTED'
        ? 'Yakunlashni qayd etish'
        : 'Keyingi holat'
}
</script>

<template>
  <PageContainer>
    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-0.5">
      <div class="flex justify-end">
        <div class="flex shrink-0 flex-wrap items-center gap-2">
          <span class="inline-flex h-7 items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/10 px-2.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
            <Sparkles class="h-3.5 w-3.5" />
            PTPK 2.0 · TARGET MODEL · DEMO
          </span>
          <Button
            v-if="pageKey === 'dashboard' || pageKey === 'cases'"
            size="sm"
            @click="showSignalForm = !showSignalForm"
          >
            <Plus class="h-3.5 w-3.5" />
            Yangi signal
          </Button>
        </div>
      </div>

      <div
        class="sr-only"
        role="status"
        aria-live="polite"
      >
        {{ feedback }}
      </div>
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="-translate-y-2 opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="feedback"
          class="fixed right-4 top-16 z-[120] flex max-w-sm items-start gap-2 rounded-lg border border-primary/25 bg-popover px-3 py-2.5 text-sm text-foreground shadow-xl"
        >
          <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{{ feedback }}</span>
        </div>
      </Transition>

      <div
        v-if="showSignalForm"
        class="rounded-xl border border-primary/25 bg-primary/[0.035] p-4"
      >
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-sm font-semibold text-foreground">Yangi signalni ro‘yxatga olish</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">Signal dublikat, huquqiy asos va triage tekshiruvidan keyingina rasmiy case sifatida yuradi.</p>
          </div>
          <span class="mt-2 text-xs font-medium text-muted-foreground sm:mt-0">1-qadam / Intake</span>
        </div>
        <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label class="grid gap-1.5 text-xs font-medium text-foreground">
            Bola F.I.Sh.
            <Input v-model="signalForm.childName" placeholder="Masalan: Dilnoza A." />
          </label>
          <label class="grid gap-1.5 text-xs font-medium text-foreground">
            Kirish holati
            <select v-model="signalForm.caseType" class="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/35">
              <option v-for="item in caseTypeDefinitions" :key="item.code" :value="item.code">{{ item.code }} · {{ item.title }}</option>
            </select>
          </label>
          <label class="grid gap-1.5 text-xs font-medium text-foreground">
            Signal kanali
            <select v-model="signalForm.channel" class="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/35">
              <option v-for="item in intakeChannelDefinitions" :key="item.code" :value="item.code">{{ item.title }}</option>
            </select>
          </label>
          <label class="grid gap-1.5 text-xs font-medium text-foreground">
            Signal mazmuni
            <Input v-model="signalForm.summary" placeholder="Kuzatilgan ehtiyoj yoki hodisa" />
          </label>
        </div>
        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <Button variant="ghost" size="sm" @click="showSignalForm = false">Bekor qilish</Button>
          <Button size="sm" @click="createSignal">Signalni saqlash <ArrowRight class="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      <template v-if="pageKey === 'dashboard'">
        <div class="flex flex-col gap-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.055] px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-start gap-3">
            <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-300" />
            <div>
              <p class="text-sm font-semibold text-foreground">Komissiya xulosasidan — bolaga mos xizmatlar paketigacha</p>
              <p class="mt-0.5 text-xs leading-5 text-muted-foreground">Tizim tavsiya, marshrut va SLA’ni hisoblaydi. Salbiy, shoshilinch va yuqori ta’sirli qarorni mas’ul mutaxassis tasdiqlaydi; xizmat quvvati yo‘qligi ehtiyoj yo‘q degani emas.</p>
            </div>
          </div>
          <a href="https://lex.uz/docs/-6779571" target="_blank" rel="noreferrer" class="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-sky-700 underline-offset-4 hover:underline dark:text-sky-300">
            Amaldagi normativ asos <ChevronRight class="h-3.5 w-3.5" />
          </a>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <div v-for="metric in dashboardMetrics" :key="metric.label" class="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-medium text-muted-foreground">{{ metric.label }}</p>
                <p class="mt-2 text-2xl font-semibold tracking-tight text-foreground">{{ metric.value }}</p>
              </div>
              <span :class="['inline-flex h-8 w-8 items-center justify-center rounded-lg', metric.tone]">
                <component :is="metric.icon" class="h-4 w-4" />
              </span>
            </div>
            <p class="mt-2 text-[0.72rem] leading-4 text-muted-foreground">{{ metric.detail }}</p>
          </div>
        </div>

        <section class="rounded-xl border border-border bg-card p-4">
          <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-sm font-semibold text-foreground">Signal → amaldagi xizmat konversiyasi</h2>
              <p class="mt-0.5 text-xs text-muted-foreground">Markaziy natija xulosa chiqarilishi emas, bola xizmatni real boshlaganidir.</p>
            </div>
            <RouterLink to="/apps/ptpk/process" class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline sm:mt-0">Jarayonni ochish <ArrowRight class="h-3.5 w-3.5" /></RouterLink>
          </div>
          <div class="mt-4 grid gap-2 md:grid-cols-5">
            <div v-for="(step, index) in funnelSteps" :key="step.label" class="relative rounded-lg border border-border bg-muted/35 p-3">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-medium text-muted-foreground">{{ step.label }}</span>
                <span class="text-lg font-semibold text-foreground">{{ step.value }}</span>
              </div>
              <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div class="h-full rounded-full bg-primary" :style="{ width: `${Math.max(8, (step.value / Math.max(funnelSteps[0]?.value ?? 1, 1)) * 100)}%` }" />
              </div>
              <ArrowRight v-if="index < funnelSteps.length - 1" class="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground md:block" />
            </div>
          </div>
        </section>

        <div class="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <section class="rounded-xl border border-border bg-card">
            <div class="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 class="text-sm font-semibold text-foreground">Operativ navbat</h2>
                <p class="mt-0.5 text-xs text-muted-foreground">SLA va xavf bo‘yicha ustuvor case’lar</p>
              </div>
              <RouterLink to="/apps/ptpk/cases" class="text-xs font-semibold text-primary hover:underline">Barchasi</RouterLink>
            </div>
            <div class="divide-y divide-border">
              <RouterLink v-for="caseItem in operationalQueue" :key="caseItem.id" :to="`/apps/ptpk/cases/${caseItem.id}`" class="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/45">
                <span :class="['mt-0.5 inline-flex min-w-9 justify-center rounded-md border px-1.5 py-0.5 text-[0.7rem] font-bold', priorityClass(caseItem.priority)]">{{ caseItem.type }}</span>
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="truncate text-sm font-semibold text-foreground">{{ caseItem.child.fullName }}</span>
                    <span :class="['rounded-md border px-1.5 py-0.5 text-[0.68rem] font-medium', phaseTone(caseItem.phase)]">{{ phaseLabel(caseItem.phase) }}</span>
                  </div>
                  <p class="mt-1 line-clamp-1 text-xs text-muted-foreground">{{ caseItem.nextAction }}</p>
                </div>
                <div class="shrink-0 text-right">
                  <p class="text-xs font-medium text-foreground">{{ caseItem.displayId }}</p>
                  <p class="mt-1 text-[0.68rem] text-muted-foreground">{{ formatDate(caseItem.dueAt) }}</p>
                </div>
              </RouterLink>
            </div>
          </section>

          <section class="rounded-xl border border-border bg-card p-4">
            <div class="flex items-center gap-2">
              <GitBranch class="h-4 w-4 text-primary" />
              <h2 class="text-sm font-semibold text-foreground">Kirish holatlari · C1–C9</h2>
            </div>
            <div class="mt-4 grid gap-2">
              <div v-for="item in caseTypeDistribution" :key="item.code" class="grid grid-cols-[2.25rem_minmax(0,1fr)_1.5rem] items-center gap-2">
                <span class="rounded border border-border bg-muted px-1 py-0.5 text-center text-[0.68rem] font-bold text-foreground">{{ item.code }}</span>
                <div class="min-w-0">
                  <div class="flex items-center justify-between gap-2 text-xs">
                    <span class="truncate text-muted-foreground">{{ item.title }}</span>
                  </div>
                  <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div class="h-full rounded-full bg-primary" :style="{ width: `${(item.count / maxCaseTypeCount) * 100}%` }" /></div>
                </div>
                <span class="text-right text-xs font-semibold text-foreground">{{ item.count }}</span>
              </div>
            </div>
          </section>
        </div>

        <div class="grid gap-4 lg:grid-cols-3">
          <section class="rounded-xl border border-border bg-card p-4 lg:col-span-2">
            <div class="flex items-center gap-2"><Network class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Parallel xizmatlar holati</h2></div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <div v-for="service in serviceRouteDefinitions.slice(0, 6)" :key="service.code" class="rounded-lg border border-border p-3">
                <div class="flex items-start justify-between gap-2">
                  <div><span class="text-[0.68rem] font-bold text-primary">{{ service.code }}</span><p class="mt-0.5 text-xs font-semibold text-foreground">{{ service.title }}</p></div>
                  <span class="text-lg font-semibold text-foreground">{{ allReferrals.filter(({ referral }) => referral.serviceCode === service.code).length }}</span>
                </div>
                <div class="mt-3 flex h-1.5 overflow-hidden rounded-full bg-muted">
                  <span class="bg-emerald-500" :style="{ width: `${Math.max(0, allReferrals.filter(({ referral }) => referral.serviceCode === service.code && ['STARTED', 'COMPLETED'].includes(referral.status)).length * 28)}%` }" />
                  <span class="bg-amber-500" :style="{ width: `${Math.max(0, allReferrals.filter(({ referral }) => referral.serviceCode === service.code && ['WAITLISTED', 'SCHEDULED'].includes(referral.status)).length * 24)}%` }" />
                  <span class="bg-sky-500" :style="{ width: `${Math.max(0, allReferrals.filter(({ referral }) => referral.serviceCode === service.code && ['REFERRED', 'MATCHING', 'PROVIDER_ACCEPTED'].includes(referral.status)).length * 20)}%` }" />
                </div>
              </div>
            </div>
          </section>
          <section class="rounded-xl border border-primary/20 bg-primary/[0.035] p-4">
            <div class="flex items-center gap-2"><ShieldCheck class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">O‘zgarmas guardrail’lar</h2></div>
            <ul class="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground">
              <li class="flex gap-2"><CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Tizim avtomatik rad etmaydi.</li>
              <li class="flex gap-2"><CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Bir reja bir nechta xizmatni parallel yuritadi.</li>
              <li class="flex gap-2"><CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Navbat yoki hujjat yetishmasligi case’ni yopmaydi.</li>
              <li class="flex gap-2"><CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />Review/apellyatsiya xavfsiz xizmatni to‘xtatmaydi.</li>
            </ul>
          </section>
        </div>
      </template>

      <template v-else-if="pageKey === 'cases'">
        <section class="rounded-xl border border-border bg-card p-4">
          <div class="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_13rem_13rem]">
            <label class="grid gap-1.5 text-xs font-medium text-foreground">
              Case yoki bola bo‘yicha qidiruv
              <div class="relative"><Search class="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" /><Input v-model="searchQuery" class="pl-8" placeholder="ID, F.I.Sh., JSHSHIR, hudud..." /></div>
            </label>
            <label class="grid gap-1.5 text-xs font-medium text-foreground">Ustuvorlik
              <select v-model="priorityFilter" class="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/35"><option value="ALL">Barchasi</option><option value="URGENT">Shoshilinch</option><option value="PRIORITY">Ustuvor</option><option value="ROUTINE">Oddiy</option></select>
            </label>
            <div class="flex items-end"><Button variant="outline" class="w-full" @click="searchQuery = ''; phaseFilter = 'ALL'; priorityFilter = 'ALL'"><Filter class="h-3.5 w-3.5" />Filtrlarni tozalash</Button></div>
          </div>
          <div class="mt-4"><StatusTabs :tabs="phaseTabs" :selected-values="phaseFilter === 'ALL' ? [] : [phaseFilter]" @select="selectPhase" /></div>
        </section>

        <section class="min-h-0 overflow-hidden rounded-xl border border-border bg-card">
          <div class="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 class="text-sm font-semibold text-foreground">Yagona case registri</h2><p class="mt-0.5 text-xs text-muted-foreground">{{ filteredCases.length }} ta yozuv · case turi alohida modul emas, routing konfiguratsiyasidir</p></div></div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[1120px] text-left text-xs">
              <thead class="bg-muted/55 text-muted-foreground"><tr><th class="px-4 py-2.5 font-medium">Case / sana</th><th class="px-3 py-2.5 font-medium">Bola</th><th class="px-3 py-2.5 font-medium">Kirish holati</th><th class="px-3 py-2.5 font-medium">Kanal / hudud</th><th class="px-3 py-2.5 font-medium">Case bosqichi</th><th class="px-3 py-2.5 font-medium">SLA</th><th class="px-3 py-2.5 font-medium">Case-manager</th><th class="px-4 py-2.5 font-medium">Keyingi amal</th></tr></thead>
              <tbody class="divide-y divide-border">
                <tr v-for="caseItem in filteredCases" :key="caseItem.id" class="transition-colors hover:bg-muted/35">
                  <td class="px-4 py-3"><RouterLink :to="`/apps/ptpk/cases/${caseItem.id}`" class="font-semibold text-primary hover:underline">{{ caseItem.displayId }}</RouterLink><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ formatDate(caseItem.createdAt) }}</p></td>
                  <td class="px-3 py-3"><p class="font-semibold text-foreground">{{ caseItem.child.fullName }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ ageFromBirthDate(caseItem.child.birthDate) }} yosh · {{ maskPinfl(caseItem.child.pinfl) }}</p></td>
                  <td class="px-3 py-3"><div class="flex items-start gap-2"><span class="rounded-md border border-border bg-muted px-1.5 py-0.5 font-bold text-foreground">{{ caseItem.type }}</span><span class="max-w-44 leading-4 text-muted-foreground">{{ caseTypeLabel(caseItem.type) }}</span></div></td>
                  <td class="px-3 py-3"><p class="font-medium text-foreground">{{ channelLabel(caseItem.intakeChannel) }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ caseItem.child.district }}</p></td>
                  <td class="px-3 py-3"><span :class="['inline-flex rounded-md border px-2 py-1 text-[0.7rem] font-semibold', phaseTone(caseItem.phase)]">{{ phaseLabel(caseItem.phase) }}</span></td>
                  <td class="px-3 py-3"><span :class="['inline-flex rounded-md border px-2 py-1 text-[0.7rem] font-semibold', priorityClass(caseItem.priority)]">{{ priorityLabel(caseItem.priority) }}</span><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ formatDate(caseItem.dueAt) }}</p></td>
                  <td class="px-3 py-3"><p class="font-medium text-foreground">{{ caseItem.owner }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ caseItem.assignedTeam }}</p></td>
                  <td class="px-4 py-3"><RouterLink :to="`/apps/ptpk/cases/${caseItem.id}`" class="inline-flex max-w-56 items-center gap-1 font-medium text-foreground hover:text-primary"><span class="line-clamp-2">{{ caseItem.nextAction }}</span><ChevronRight class="h-3.5 w-3.5 shrink-0" /></RouterLink></td>
                </tr>
                <tr v-if="!filteredCases.length"><td colspan="8" class="px-4 py-10 text-center text-sm text-muted-foreground">Qidiruv va filtrga mos case topilmadi.</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <template v-else-if="pageKey === 'case-detail'">
        <template v-if="currentCase">
          <section class="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 items-start gap-3">
                <span class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">{{ currentCase.type }}</span>
                <div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h2 class="text-lg font-semibold text-foreground">{{ currentCase.child.fullName }}</h2><span class="rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[0.65rem] font-bold text-violet-700 dark:text-violet-300">DEMO</span></div><p class="mt-1 text-xs text-muted-foreground">{{ currentCase.displayId }} · {{ ageFromBirthDate(currentCase.child.birthDate) }} yosh · {{ currentCase.child.district }} · {{ caseTypeLabel(currentCase.type) }}</p></div>
              </div>
              <div class="flex flex-wrap gap-2"><span :class="['rounded-md border px-2 py-1 text-xs font-semibold', priorityClass(currentCase.priority)]">{{ priorityLabel(currentCase.priority) }}</span><span :class="['rounded-md border px-2 py-1 text-xs font-semibold', phaseTone(currentCase.phase)]">{{ phaseLabel(currentCase.phase) }}</span><Button variant="outline" size="sm" @click="router.push('/apps/ptpk/cases')">Reyestrga qaytish</Button></div>
            </div>
            <div class="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-5">
              <div><p class="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">Case-manager</p><p class="mt-1 text-xs font-semibold text-foreground">{{ currentCase.owner }}</p></div>
              <div><p class="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">Reja</p><p class="mt-1 text-xs font-semibold text-foreground">v{{ currentCase.plan.version }} · {{ planStatusLabel(currentCase.plan.status) }}</p></div>
              <div><p class="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">SLA</p><p class="mt-1 text-xs font-semibold text-foreground">{{ formatDate(currentCase.dueAt) }}</p></div>
              <div class="sm:col-span-2"><p class="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">Keyingi amal</p><p class="mt-1 text-xs font-semibold text-primary">{{ currentCase.nextAction }}</p></div>
            </div>
          </section>

          <nav class="max-w-full overflow-x-auto rounded-lg border border-border bg-card" aria-label="Case bo‘limlari"><div class="flex min-w-max"><button v-for="tab in detailTabs" :key="tab.value" type="button" :aria-pressed="detailTab === tab.value" :class="['border-r border-border px-3 py-2 text-xs font-semibold last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50', detailTab === tab.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground']" @click="selectDetailTab(tab.value)">{{ tab.label }}</button></div></nav>

          <div v-if="detailTab === 'overview'" class="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)]">
            <div class="grid gap-4">
              <section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><FileHeart class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Signal va bola holati</h2></div><p class="mt-3 text-sm leading-6 text-foreground">{{ currentCase.signalSummary }}</p><div class="mt-4 grid gap-3 sm:grid-cols-2"><div class="rounded-lg bg-muted/55 p-3"><p class="text-[0.68rem] uppercase text-muted-foreground">Ta’lim holati</p><p class="mt-1 text-xs font-semibold text-foreground">{{ educationLabel(currentCase.child.educationEngagement) }}</p></div><div class="rounded-lg bg-muted/55 p-3"><p class="text-[0.68rem] uppercase text-muted-foreground">Rozilik / huquqiy asos</p><p class="mt-1 text-xs font-semibold text-foreground">{{ currentCase.consentStatus }}</p></div></div></section>
              <section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center justify-between"><div class="flex items-center gap-2"><CircleGauge class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Funksional ehtiyojlar</h2></div><span class="text-xs text-muted-foreground">{{ currentCase.needs.length }} domen</span></div><div class="mt-4 grid gap-3 sm:grid-cols-2"><div v-for="need in currentCase.needs" :key="need.id" class="rounded-lg border border-border p-3"><div class="flex items-center justify-between gap-2"><p class="text-xs font-semibold text-foreground">{{ domainLabel(need.domain) }}</p><span :class="['h-2 w-2 rounded-full', severityClass(need.severity)]" /></div><p class="mt-2 text-xs leading-5 text-muted-foreground">{{ need.summary }}</p><p class="mt-2 text-[0.68rem] font-medium text-muted-foreground">{{ need.assessed ? 'Baholangan' : 'Baholash rejalashtirilgan' }}</p></div><div v-if="!currentCase.needs.length" class="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground sm:col-span-2">Domenlar triage va maqsadli baholashdan keyin qo‘shiladi.</div></div></section>
            </div>
            <aside class="grid content-start gap-4">
              <section class="rounded-xl border border-primary/20 bg-primary/[0.035] p-4"><div class="flex items-center gap-2"><ListChecks class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Ish kartasi</h2></div><dl class="mt-3 grid gap-3 text-xs"><div><dt class="text-muted-foreground">Mas’ul jamoa</dt><dd class="mt-1 font-semibold text-foreground">{{ currentCase.assignedTeam }}</dd></div><div><dt class="text-muted-foreground">Kanal</dt><dd class="mt-1 font-semibold text-foreground">{{ channelLabel(currentCase.intakeChannel) }}</dd></div><div><dt class="text-muted-foreground">Yangilangan</dt><dd class="mt-1 font-semibold text-foreground">{{ formatDate(currentCase.updatedAt) }}</dd></div></dl><Button class="mt-4 w-full" size="sm" @click="advanceCase(currentCase)">Bosqichni yakunlash <ArrowRight class="h-3.5 w-3.5" /></Button></section>
              <section v-if="currentCase.appeal" class="rounded-xl border border-violet-500/25 bg-violet-500/[0.045] p-4"><div class="flex items-center gap-2"><RefreshCcw class="h-4 w-4 text-violet-600" /><h2 class="text-sm font-semibold text-foreground">Apellyatsiya</h2></div><span :class="['mt-3 inline-flex rounded-md border px-2 py-1 text-xs font-semibold', appealTone(currentCase.appeal.status)]">{{ appealStatusLabel(currentCase.appeal.status) }}</span><p class="mt-3 text-xs leading-5 text-muted-foreground">{{ currentCase.appeal.subject }}</p><p class="mt-2 text-[0.68rem] font-semibold text-emerald-700 dark:text-emerald-300">✓ Amaldagi xavfsiz xizmatlar davom etadi</p></section>
            </aside>
          </div>

          <section v-else-if="detailTab === 'assessment'" class="rounded-xl border border-border bg-card p-4"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="text-sm font-semibold text-foreground">Maqsadli funksional baholash</h2><p class="mt-1 text-xs text-muted-foreground">Tashxisning o‘zi marshrut emas; faqat bolaning hayot faoliyatiga ta’sir qilgan domenlar baholanadi.</p></div><Button variant="outline" size="sm"><Plus class="h-3.5 w-3.5" />Domen qo‘shish</Button></div><div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3"><div v-for="need in currentCase.needs" :key="need.id" class="rounded-lg border border-border p-4"><div class="flex items-center justify-between"><span class="text-xs font-semibold text-foreground">{{ domainLabel(need.domain) }}</span><span :class="['rounded-md px-2 py-0.5 text-[0.68rem] font-semibold text-white', severityClass(need.severity)]">{{ need.severity }}</span></div><p class="mt-3 text-xs leading-5 text-muted-foreground">{{ need.summary }}</p><div class="mt-3 flex items-center gap-1 text-[0.68rem] font-medium text-primary"><UserRoundCheck class="h-3.5 w-3.5" />Mutaxassis qaydi · {{ need.assessed ? 'tayyor' : 'kutilmoqda' }}</div></div></div></section>

          <section v-else-if="detailTab === 'plan'" class="rounded-xl border border-border bg-card p-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div class="flex items-center gap-2"><Layers3 class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Integratsiyalashgan reja · v{{ currentCase.plan.version }}</h2></div><p class="mt-1 text-xs text-muted-foreground">Bitta bola, bitta outcome reja, bir nechta parallel xizmat liniyasi.</p></div><span :class="['inline-flex self-start rounded-md border px-2 py-1 text-xs font-semibold', planTone(currentCase.plan.status)]">{{ planStatusLabel(currentCase.plan.status) }}</span></div><div class="mt-4 grid gap-4 lg:grid-cols-2"><div><h3 class="text-xs font-semibold text-foreground">Oila bilan kelishilgan maqsadlar</h3><ul class="mt-3 grid gap-2"><li v-for="goal in currentCase.plan.goals" :key="goal" class="flex gap-2 rounded-lg bg-muted/45 p-3 text-xs leading-5 text-foreground"><CheckCircle2 class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />{{ goal }}</li><li v-if="!currentCase.plan.goals.length" class="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">Reja maqsadlari hali kiritilmagan.</li></ul></div><div><h3 class="text-xs font-semibold text-foreground">Reja nazorati</h3><dl class="mt-3 grid grid-cols-2 gap-3 text-xs"><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Reja egasi</dt><dd class="mt-1 font-semibold text-foreground">{{ currentCase.plan.owner }}</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Review sanasi</dt><dd class="mt-1 font-semibold text-foreground">{{ formatDate(currentCase.plan.reviewDate) }}</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Oila review</dt><dd class="mt-1 font-semibold text-foreground">{{ formatDate(currentCase.plan.familyReviewedAt) }}</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Xizmat liniyasi</dt><dd class="mt-1 font-semibold text-foreground">{{ currentCase.plan.referrals.length }}</dd></div></dl></div></div></section>

          <section v-else-if="detailTab === 'referrals'" class="overflow-hidden rounded-xl border border-border bg-card"><div class="border-b border-border px-4 py-3"><h2 class="text-sm font-semibold text-foreground">Parallel xizmat yo‘naltirishlari</h2><p class="mt-1 text-xs text-muted-foreground">Har bir yo‘naltirish mustaqil statusda yuradi; bittasidagi navbat boshqasini to‘xtatmaydi.</p></div><div class="overflow-x-auto"><table class="w-full min-w-[900px] text-left text-xs"><thead class="bg-muted/55 text-muted-foreground"><tr><th class="px-4 py-2.5 font-medium">Xizmat</th><th class="px-3 py-2.5 font-medium">Provider</th><th class="px-3 py-2.5 font-medium">Holat</th><th class="px-3 py-2.5 font-medium">Maqsad sana</th><th class="px-3 py-2.5 font-medium">Mas’ul</th><th class="px-4 py-2.5 font-medium">Demo amal</th></tr></thead><tbody class="divide-y divide-border"><tr v-for="referral in currentCase.plan.referrals" :key="referral.id"><td class="px-4 py-3"><div class="flex items-start gap-2"><span class="rounded border border-border bg-muted px-1.5 py-0.5 font-bold text-primary">{{ referral.serviceCode }}</span><div><p class="font-semibold text-foreground">{{ referral.serviceName }}</p><p v-if="referral.isTemporary" class="mt-1 text-[0.68rem] text-violet-600">Vaqtinchalik yordam</p></div></div></td><td class="px-3 py-3"><p class="font-medium text-foreground">{{ referral.providerName || 'Provider qidirilmoqda' }}</p><p v-if="referral.capacityNote" class="mt-1 max-w-56 text-[0.68rem] text-muted-foreground">{{ referral.capacityNote }}</p></td><td class="px-3 py-3"><span :class="['rounded-md border px-2 py-1 text-[0.7rem] font-semibold', referralTone(referral.status)]">{{ referralStatusLabel(referral.status) }}</span></td><td class="px-3 py-3 text-foreground">{{ formatDate(referral.targetStartDate) }}</td><td class="px-3 py-3 text-foreground">{{ referral.owner }}</td><td class="px-4 py-3"><Button variant="outline" size="sm" :disabled="!referralNextStatus[referral.status]" @click="advanceReferral(currentCase, referral.id)">{{ nextReferralAction(referral.status) }}</Button></td></tr><tr v-if="!currentCase.plan.referrals.length"><td colspan="6" class="px-4 py-10 text-center text-muted-foreground">Xizmat liniyalari reja tasdiqlangach shakllanadi.</td></tr></tbody></table></div></section>

          <section v-else-if="detailTab === 'monitoring'" class="grid gap-4 lg:grid-cols-3"><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">Boshlangan xizmatlar</p><p class="mt-2 text-3xl font-semibold text-foreground">{{ currentCase.plan.referrals.filter((item) => ['STARTED', 'COMPLETED'].includes(item.status)).length }}</p><p class="mt-2 text-xs text-muted-foreground">STARTED/COMPLETED dalili mavjud</p></div><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">Navbatda</p><p class="mt-2 text-3xl font-semibold text-amber-600">{{ currentCase.plan.referrals.filter((item) => item.status === 'WAITLISTED').length }}</p><p class="mt-2 text-xs text-muted-foreground">muqobil provider va vaqtinchalik yordam talab etadi</p></div><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">Keyingi outcome review</p><p class="mt-2 text-lg font-semibold text-foreground">{{ formatDate(currentCase.plan.reviewDate) }}</p><p class="mt-2 text-xs text-muted-foreground">30/90 kunlik barqarorlik tekshiruvi</p></div><div class="rounded-xl border border-amber-500/20 bg-amber-500/[0.045] p-4 lg:col-span-3"><div class="flex gap-2"><AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><p class="text-xs leading-5 text-muted-foreground"><strong class="text-foreground">Yopish qoidasi:</strong> xulosa yoki yo‘llanma yaratildi degani case yakunlandi degani emas. Xizmat amalda boshlanganligi, natija va xavfsiz transition tasdiqlanmaguncha case ochiq qoladi.</p></div></div></section>

          <section v-else class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><History class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Audit tarixi</h2></div><div class="relative mt-4 grid gap-0 pl-3"><div class="absolute bottom-2 left-[1.08rem] top-2 w-px bg-border" /><div v-for="event in currentCase.timeline" :key="event.id" class="relative grid grid-cols-[1rem_minmax(0,1fr)] gap-3 pb-5"><span class="relative z-10 mt-1 h-3 w-3 rounded-full border-2 border-background bg-primary ring-1 ring-primary/30" /><div><div class="flex flex-wrap items-center gap-x-2 gap-y-1"><p class="text-xs font-semibold text-foreground">{{ event.title }}</p><span class="text-[0.68rem] text-muted-foreground">{{ formatDate(event.at) }} · {{ event.actor }}</span></div><p class="mt-1 text-xs leading-5 text-muted-foreground">{{ event.description }}</p></div></div></div></section>
        </template>
      </template>

      <template v-else-if="pageKey === 'triage'">
        <div class="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.55fr)]">
          <section class="grid content-start gap-3">
            <div v-for="caseItem in triageCases" :key="caseItem.id" class="rounded-xl border border-border bg-card p-4">
              <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="flex items-start gap-3"><span :class="['rounded-md border px-2 py-1 text-xs font-bold', priorityClass(caseItem.priority)]">{{ caseItem.type }}</span><div><RouterLink :to="`/apps/ptpk/cases/${caseItem.id}`" class="text-sm font-semibold text-foreground hover:text-primary">{{ caseItem.child.fullName }} · {{ caseItem.displayId }}</RouterLink><p class="mt-1 text-xs text-muted-foreground">{{ caseTypeLabel(caseItem.type) }} · {{ channelLabel(caseItem.intakeChannel) }}</p></div></div><span :class="['self-start rounded-md border px-2 py-1 text-xs font-semibold', phaseTone(caseItem.phase)]">{{ phaseLabel(caseItem.phase) }}</span></div>
              <p class="mt-3 rounded-lg bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">{{ caseItem.signalSummary }}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2"><span v-if="caseItem.flags.safeguarding" class="rounded-md border border-rose-500/25 bg-rose-500/10 px-2 py-1 text-[0.68rem] font-semibold text-rose-700 dark:text-rose-300">Himoya xavfi</span><span v-if="caseItem.flags.currentlyUnserved" class="rounded-md border border-sky-500/25 bg-sky-500/10 px-2 py-1 text-[0.68rem] font-semibold text-sky-700 dark:text-sky-300">Xizmatga jalb etilmagan</span><span class="text-[0.68rem] text-muted-foreground">Keyingi amal: {{ caseItem.nextAction }}</span><Button class="ml-auto" size="sm" @click="advanceCase(caseItem)">Bosqichni yakunlash <ArrowRight class="h-3.5 w-3.5" /></Button></div>
            </div>
          </section>
          <aside class="grid content-start gap-4">
            <section class="rounded-xl border border-rose-500/20 bg-rose-500/[0.045] p-4"><div class="flex items-center gap-2"><AlertTriangle class="h-4 w-4 text-rose-600" /><h2 class="text-sm font-semibold text-foreground">C7 urgent yo‘li</h2></div><ol class="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground"><li><strong class="text-foreground">1.</strong> Darhol xavfsizlik va hayotiy xavfni tekshirish</li><li><strong class="text-foreground">2.</strong> Vaqtinchalik himoya/stabilizatsiya</li><li><strong class="text-foreground">3.</strong> Inson tomonidan gate tasdig‘i</li><li><strong class="text-foreground">4.</strong> Holat barqarorlashgach funksional baholash</li></ol></section>
            <section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><Workflow class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Triage qaror daraxti</h2></div><ul class="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground"><li>Urgent / himoya → tezkor lane</li><li>C9 → mustaqil apellyatsiya review</li><li>C8 → bolani qayta baholamasdan ijro muammosi</li><li>C6 → xavfsiz handover va qabul tasdig‘i</li><li>C1/C2/C3 → to‘liq yoki delta baholash</li></ul><RouterLink to="/apps/ptpk/process" class="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">To‘liq jarayon <ArrowRight class="h-3.5 w-3.5" /></RouterLink></section>
          </aside>
        </div>
      </template>

      <template v-else-if="pageKey === 'referrals'">
        <div class="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.045] p-4 lg:flex-row lg:items-center lg:justify-between"><div class="flex items-start gap-2"><AlertTriangle class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><div><p class="text-sm font-semibold text-foreground">Quvvat yetishmasligi — ehtiyoj rad etildi degani emas</p><p class="mt-1 text-xs text-muted-foreground">WAITLISTED bo‘lsa muqobil provider, vaqtinchalik yordam va eskalatsiya bir vaqtda ochiladi.</p></div></div><label class="flex shrink-0 items-center gap-2 text-xs font-medium text-foreground">Status<select v-model="referralFilter" class="h-8 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/35"><option value="ALL">Barchasi</option><option v-for="status in referralStatusDefinitions" :key="status.code" :value="status.code">{{ status.title }}</option></select></label></div>
        <section class="overflow-hidden rounded-xl border border-border bg-card"><div class="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 class="text-sm font-semibold text-foreground">Barcha xizmat yo‘naltirishlari</h2><p class="mt-1 text-xs text-muted-foreground">{{ filteredReferrals.length }} ta xizmat liniyasi · case statusidan mustaqil</p></div><Network class="h-5 w-5 text-primary" /></div><div class="overflow-x-auto"><table class="w-full min-w-[1080px] text-left text-xs"><thead class="bg-muted/55 text-muted-foreground"><tr><th class="px-4 py-2.5 font-medium">Case / bola</th><th class="px-3 py-2.5 font-medium">Xizmat</th><th class="px-3 py-2.5 font-medium">Provider</th><th class="px-3 py-2.5 font-medium">Referral status</th><th class="px-3 py-2.5 font-medium">Kutish / start</th><th class="px-3 py-2.5 font-medium">Case bosqichi</th><th class="px-4 py-2.5 font-medium">Demo amal</th></tr></thead><tbody class="divide-y divide-border"><tr v-for="row in filteredReferrals" :key="row.referral.id" class="hover:bg-muted/35"><td class="px-4 py-3"><RouterLink :to="`/apps/ptpk/cases/${row.caseItem.id}`" class="font-semibold text-primary hover:underline">{{ row.caseItem.displayId }}</RouterLink><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ row.caseItem.child.fullName }}</p></td><td class="px-3 py-3"><div class="flex items-start gap-2"><span class="rounded border border-border bg-muted px-1.5 py-0.5 font-bold text-primary">{{ row.referral.serviceCode }}</span><div><p class="font-semibold text-foreground">{{ row.referral.serviceName }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ serviceLabel(row.referral.serviceCode) }}</p></div></div></td><td class="px-3 py-3"><p class="font-medium text-foreground">{{ row.referral.providerName || 'Moslashtirilmoqda' }}</p><p v-if="row.referral.capacityNote" class="mt-1 max-w-52 text-[0.68rem] text-amber-700 dark:text-amber-300">{{ row.referral.capacityNote }}</p></td><td class="px-3 py-3"><span :class="['rounded-md border px-2 py-1 text-[0.7rem] font-semibold', referralTone(row.referral.status)]">{{ referralStatusLabel(row.referral.status) }}</span></td><td class="px-3 py-3"><p class="font-medium text-foreground">{{ row.referral.waitingDays ? `${row.referral.waitingDays} kun` : formatDate(row.referral.actualStartDate || row.referral.targetStartDate) }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">Maqsad: {{ formatDate(row.referral.targetStartDate) }}</p></td><td class="px-3 py-3"><span :class="['rounded-md border px-2 py-1 text-[0.7rem] font-semibold', phaseTone(row.caseItem.phase)]">{{ phaseLabel(row.caseItem.phase) }}</span></td><td class="px-4 py-3"><Button variant="outline" size="sm" :disabled="!referralNextStatus[row.referral.status]" @click="advanceReferral(row.caseItem, row.referral.id)">{{ nextReferralAction(row.referral.status) }}</Button></td></tr></tbody></table></div></section>
      </template>

      <template v-else-if="pageKey === 'reviews'">
        <div class="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
          <section class="grid content-start gap-3"><article v-for="caseItem in reviewCases" :key="caseItem.id" class="rounded-xl border border-border bg-card p-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><div class="flex flex-wrap items-center gap-2"><RouterLink :to="`/apps/ptpk/cases/${caseItem.id}`" class="text-sm font-semibold text-foreground hover:text-primary">{{ caseItem.child.fullName }}</RouterLink><span class="rounded border border-border bg-muted px-1.5 py-0.5 text-[0.68rem] font-bold">{{ caseItem.type }}</span><span v-if="caseItem.appeal" :class="['rounded-md border px-2 py-0.5 text-[0.68rem] font-semibold', appealTone(caseItem.appeal.status)]">{{ appealStatusLabel(caseItem.appeal.status) }}</span></div><p class="mt-1 text-xs text-muted-foreground">{{ caseItem.displayId }} · {{ caseTypeLabel(caseItem.type) }}</p></div><span :class="['self-start rounded-md border px-2 py-1 text-xs font-semibold', phaseTone(caseItem.phase)]">{{ phaseLabel(caseItem.phase) }}</span></div><div class="mt-4 grid gap-3 sm:grid-cols-3"><div class="rounded-lg bg-muted/45 p-3"><p class="text-[0.68rem] text-muted-foreground">Reja</p><p class="mt-1 text-xs font-semibold text-foreground">v{{ caseItem.plan.version }} · {{ planStatusLabel(caseItem.plan.status) }}</p></div><div class="rounded-lg bg-muted/45 p-3"><p class="text-[0.68rem] text-muted-foreground">Davom etayotgan xizmat</p><p class="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{{ caseItem.plan.referrals.filter((item) => item.status === 'STARTED').length }} ta · uzilmaydi</p></div><div class="rounded-lg bg-muted/45 p-3"><p class="text-[0.68rem] text-muted-foreground">Muddat</p><p class="mt-1 text-xs font-semibold text-foreground">{{ formatDate(caseItem.appeal?.dueAt || caseItem.dueAt) }}</p></div></div><div class="mt-3 flex justify-end"><Button v-if="caseItem.appeal" size="sm" variant="outline" @click="advanceAppeal(caseItem)">Review bosqichini yangilash <ArrowRight class="h-3.5 w-3.5" /></Button><Button v-else size="sm" variant="outline" @click="advanceCase(caseItem)">Rejani qayta ko‘rib chiqish</Button></div></article></section>
          <aside class="grid content-start gap-4"><section class="rounded-xl border border-violet-500/20 bg-violet-500/[0.045] p-4"><div class="flex items-center gap-2"><UserRoundCheck class="h-4 w-4 text-violet-600" /><h2 class="text-sm font-semibold text-foreground">Inson qarori gate’i</h2></div><ul class="mt-3 grid gap-2 text-xs leading-5 text-muted-foreground"><li>✓ Bola va oila fikri qayd etilgan</li><li>✓ Qaror sababi va dalillar ko‘rinadi</li><li>✓ Alternativalar taqqoslangan</li><li>✓ Manfaatlar to‘qnashuvi tekshirilgan</li><li>✓ Ikkinchi ko‘rib chiqish / imzolar</li></ul></section><section class="rounded-xl border border-border bg-card p-4"><h2 class="text-sm font-semibold text-foreground">Apellyatsiya holat mashinasi</h2><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="status in appealStatusDefinitions.filter((item) => item.code !== 'NONE')" :key="status.code" :class="['rounded-md border px-2 py-1 text-[0.68rem] font-semibold', toneClass(status.tone)]">{{ status.title }}</span></div><p class="mt-3 text-xs leading-5 text-muted-foreground">Apellyatsiya operational case’ni almashtirmaydi va xavfsiz xizmatni avtomatik to‘xtatmaydi.</p></section></aside>
        </div>
      </template>

      <template v-else-if="pageKey === 'monitoring'">
        <div class="grid gap-3 sm:grid-cols-3"><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">WAITLISTED</p><p class="mt-2 text-3xl font-semibold text-amber-600">{{ waitingReferrals.length }}</p><p class="mt-1 text-xs text-muted-foreground">eskalatsiya talab etadi</p></div><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">STARTED / COMPLETED</p><p class="mt-2 text-3xl font-semibold text-emerald-600">{{ startedReferrals.length }}</p><p class="mt-1 text-xs text-muted-foreground">real xizmat dalili bor</p></div><div class="rounded-xl border border-border bg-card p-4"><p class="text-xs text-muted-foreground">SLA xavfida</p><p class="mt-2 text-3xl font-semibold text-rose-600">{{ urgentCases.length }}</p><p class="mt-1 text-xs text-muted-foreground">operator navbatida</p></div></div>
        <div class="grid gap-4 xl:grid-cols-2"><section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><Activity class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Kechikish sabablari</h2></div><div class="mt-4 grid gap-3"><div v-for="reason in delayReasons" :key="reason.label"><div class="flex items-center justify-between text-xs"><span class="text-muted-foreground">{{ reason.label }}</span><span class="font-semibold text-foreground">{{ reason.value }}</span></div><div class="mt-1.5 h-2 overflow-hidden rounded-full bg-muted"><div :class="['h-full rounded-full', reason.tone]" :style="{ width: `${(reason.value / 8) * 100}%` }" /></div></div></div></section><section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><HeartHandshake class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Navbatdagi xizmatlar</h2></div><div class="mt-3 divide-y divide-border"><div v-for="row in waitingReferrals" :key="row.referral.id" class="flex items-start gap-3 py-3"><span class="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[0.68rem] font-bold text-amber-700 dark:text-amber-300">{{ row.referral.serviceCode }}</span><div class="min-w-0 flex-1"><RouterLink :to="`/apps/ptpk/cases/${row.caseItem.id}`" class="text-xs font-semibold text-foreground hover:text-primary">{{ row.caseItem.child.fullName }} · {{ row.referral.serviceName }}</RouterLink><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ row.referral.capacityNote || 'Muqobil provider qidirilmoqda' }}</p></div><span class="shrink-0 text-xs font-semibold text-amber-700 dark:text-amber-300">{{ row.referral.waitingDays ?? 0 }} kun</span></div></div></section></div>
        <section class="overflow-hidden rounded-xl border border-border bg-card"><div class="border-b border-border px-4 py-3"><h2 class="text-sm font-semibold text-foreground">30/90 kunlik outcome nazorati</h2><p class="mt-1 text-xs text-muted-foreground">Case’ni yopishdan oldin xizmatning barqarorligi va bola/oila natijasi tekshiriladi.</p></div><div class="overflow-x-auto"><table class="w-full min-w-[760px] text-left text-xs"><thead class="bg-muted/55 text-muted-foreground"><tr><th class="px-4 py-2.5 font-medium">Bola / case</th><th class="px-3 py-2.5 font-medium">Boshlangan xizmatlar</th><th class="px-3 py-2.5 font-medium">Reja review</th><th class="px-3 py-2.5 font-medium">Barqarorlik</th><th class="px-4 py-2.5 font-medium">Keyingi amal</th></tr></thead><tbody class="divide-y divide-border"><tr v-for="caseItem in cases.filter((item) => item.phase === 'MONITORING' || item.plan.referrals.some((referral) => referral.status === 'STARTED'))" :key="caseItem.id"><td class="px-4 py-3"><RouterLink :to="`/apps/ptpk/cases/${caseItem.id}`" class="font-semibold text-primary hover:underline">{{ caseItem.child.fullName }}</RouterLink><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ caseItem.displayId }}</p></td><td class="px-3 py-3 font-semibold text-foreground">{{ caseItem.plan.referrals.filter((item) => item.status === 'STARTED').length }} ta</td><td class="px-3 py-3 text-foreground">{{ formatDate(caseItem.plan.reviewDate) }}</td><td class="px-3 py-3"><span class="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[0.68rem] font-semibold text-emerald-700 dark:text-emerald-300">Nazoratda</span></td><td class="px-4 py-3 text-muted-foreground">{{ caseItem.nextAction }}</td></tr></tbody></table></div></section>
      </template>

      <template v-else-if="pageKey === 'process'">
        <section class="rounded-xl border border-border bg-card p-4"><div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><h2 class="text-sm font-semibold text-foreground">8 ta kirish kanali</h2><p class="mt-1 text-xs text-muted-foreground">Kanal — signal manbasi. C1–C9 esa case’ning biznes holati; ular bir-biridan alohida maydon.</p></div><span class="mt-2 text-xs font-semibold text-primary sm:mt-0">Signal ≠ avtomatik case</span></div><div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><div v-for="channel in intakeChannelDefinitions" :key="channel.code" class="rounded-lg border border-border bg-muted/35 p-3"><p class="text-xs font-semibold text-foreground">{{ channel.title }}</p><p class="mt-1 text-[0.7rem] leading-4 text-muted-foreground">{{ channel.description }}</p></div></div><p class="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/[0.045] p-3 text-[0.72rem] leading-5 text-muted-foreground"><strong class="text-foreground">Huquqiy gate:</strong> ta’lim, tibbiyot va boshqa tashkilotlar signal yuborishi mumkin; 1–18 yoshdagi bola bo‘yicha rasmiy ish qonuniy vakil roziligi yoki boshqa qonuniy asos qayd etilgach davom etadi.</p></section>
        <section class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><Waypoints class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Target biznes jarayon</h2></div><div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3"><article v-for="step in processSteps" :key="step.key" class="relative rounded-lg border border-border p-4"><span class="absolute right-3 top-3 text-2xl font-semibold text-muted/80">{{ String(step.order).padStart(2, '0') }}</span><h3 class="pr-10 text-xs font-semibold text-foreground">{{ step.title }}</h3><p class="mt-2 text-xs leading-5 text-muted-foreground">{{ step.description }}</p><div class="mt-3 border-t border-border pt-3"><p class="text-[0.68rem] font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">Avtomatlashtiriladi</p><p class="mt-1 text-[0.7rem] leading-4 text-muted-foreground">{{ step.automatedChecks.join(' · ') }}</p><p class="mt-2 text-[0.68rem] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Inson qarori</p><p class="mt-1 text-[0.7rem] leading-4 text-muted-foreground">{{ step.humanDecision }}</p></div></article></div></section>
        <section class="overflow-hidden rounded-xl border border-border bg-card"><div class="border-b border-border px-4 py-3"><h2 class="text-sm font-semibold text-foreground">C1–C9 routing matritsasi</h2><p class="mt-1 text-xs text-muted-foreground">Yagona workflow, konfiguratsiya bilan farqlanadigan boshlang‘ich yo‘l.</p></div><div class="overflow-x-auto"><table class="w-full min-w-[820px] text-left text-xs"><thead class="bg-muted/55 text-muted-foreground"><tr><th class="px-4 py-2.5 font-medium">Case</th><th class="px-3 py-2.5 font-medium">Kirish holati</th><th class="px-3 py-2.5 font-medium">Lane</th><th class="px-4 py-2.5 font-medium">Birinchi amal</th></tr></thead><tbody class="divide-y divide-border"><tr v-for="item in caseTypeDefinitions" :key="item.code"><td class="px-4 py-3"><span class="rounded-md border border-border bg-muted px-2 py-1 font-bold text-foreground">{{ item.code }}</span></td><td class="px-3 py-3"><p class="font-semibold text-foreground">{{ item.title }}</p><p class="mt-1 text-[0.68rem] text-muted-foreground">{{ item.description }}</p></td><td class="px-3 py-3"><span class="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[0.68rem] font-semibold text-sky-700 dark:text-sky-300">{{ item.routeHint }}</span></td><td class="px-4 py-3 text-muted-foreground">{{ item.firstAction }}</td></tr></tbody></table></div></section>
        <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-4"><section class="rounded-xl border border-border bg-card p-4"><h2 class="text-xs font-semibold text-foreground">CasePhase</h2><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="item in casePhaseDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></section><section class="rounded-xl border border-border bg-card p-4"><h2 class="text-xs font-semibold text-foreground">PlanStatus</h2><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="item in planStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></section><section class="rounded-xl border border-border bg-card p-4"><h2 class="text-xs font-semibold text-foreground">ReferralStatus</h2><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="item in referralStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></section><section class="rounded-xl border border-border bg-card p-4"><h2 class="text-xs font-semibold text-foreground">AppealStatus</h2><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="item in appealStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></section></div>
      </template>

      <template v-else-if="pageKey === 'references'">
        <div class="flex max-w-full overflow-x-auto rounded-lg border border-border bg-card"><button v-for="tab in [{ value: 'cases', label: 'C1–C9 case turlari' }, { value: 'services', label: 'S0–S6 xizmat yo‘nalishlari' }, { value: 'statuses', label: 'Holatlar va siyosatlar' }]" :key="tab.value" type="button" :class="['min-w-max border-r border-border px-3 py-2 text-xs font-semibold last:border-r-0', referenceTab === tab.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted']" @click="selectReferenceTab(tab.value)">{{ tab.label }}</button></div>
        <section v-if="referenceTab === 'cases'" class="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><article v-for="item in caseTypeDefinitions" :key="item.code" class="rounded-xl border border-border bg-card p-4"><div class="flex items-start justify-between gap-3"><span class="rounded-md border border-border bg-muted px-2 py-1 text-xs font-bold text-foreground">{{ item.code }}</span><span class="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[0.68rem] font-semibold text-sky-700 dark:text-sky-300">{{ item.routeHint }}</span></div><h2 class="mt-3 text-sm font-semibold text-foreground">{{ item.title }}</h2><p class="mt-2 text-xs leading-5 text-muted-foreground">{{ item.description }}</p><div class="mt-3 border-t border-border pt-3"><p class="text-[0.68rem] font-semibold uppercase text-muted-foreground">Birinchi amal</p><p class="mt-1 text-xs leading-5 text-foreground">{{ item.firstAction }}</p></div></article></section>
        <section v-else-if="referenceTab === 'services'" class="grid gap-3 md:grid-cols-2 xl:grid-cols-3"><article v-for="item in serviceRouteDefinitions" :key="item.code" class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-3"><span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{{ item.code }}</span><h2 class="text-sm font-semibold text-foreground">{{ item.title }}</h2></div><p class="mt-3 text-xs leading-5 text-muted-foreground">{{ item.description }}</p><div class="mt-3 flex flex-wrap gap-1.5"><span v-for="example in item.examples" :key="example" class="rounded-md bg-muted px-2 py-1 text-[0.68rem] text-muted-foreground">{{ example }}</span></div><p v-if="item.code === 'S6'" class="mt-3 rounded-lg border border-violet-500/20 bg-violet-500/[0.045] p-2 text-[0.7rem] leading-4 text-violet-700 dark:text-violet-300">S6 — alohida yakka xizmat emas; S1–S5 liniyalaridan tuzilgan muvofiqlashtirilgan paket.</p></article></section>
        <section v-else class="grid gap-4 xl:grid-cols-2"><div class="rounded-xl border border-border bg-card p-4"><div class="flex items-center gap-2"><BookOpenCheck class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Versiyalangan siyosat</h2></div><dl class="mt-4 grid gap-3 text-xs sm:grid-cols-2"><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Policy code</dt><dd class="mt-1 font-mono font-semibold text-foreground">PTPK-TARGET-2026.1</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Amal sanasi</dt><dd class="mt-1 font-semibold text-foreground">Pilot tasdig‘idan keyin</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Qaror engine</dt><dd class="mt-1 font-semibold text-foreground">Tavsiya + human-in-the-loop</dd></div><div class="rounded-lg bg-muted/45 p-3"><dt class="text-muted-foreground">Qaror vakolati</dt><dd class="mt-1 font-semibold text-foreground">PTPK · IPTK alohida handoff</dd></div></dl></div><div class="rounded-xl border border-primary/20 bg-primary/[0.035] p-4"><h2 class="text-sm font-semibold text-foreground">Yopib bo‘lmaydigan holatlar</h2><div class="mt-3 flex flex-wrap gap-2"><span v-for="rule in ['WAITLISTED', 'PROVIDER DECLINED', 'Hujjat yetishmaydi', 'Integratsiya xatosi', 'Oila bilan aloqa yo‘q', 'Transfer jarayonida']" :key="rule" class="rounded-md border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[0.68rem] font-semibold text-amber-700 dark:text-amber-300">{{ rule }}</span></div><p class="mt-3 text-xs leading-5 text-muted-foreground">Bu holatlar case’ni yopish sababi emas. Tizim blok sababini, mas’ulni, SLA’ni va keyingi eskalatsiyani yaratadi.</p></div><div class="rounded-xl border border-border bg-card p-4 xl:col-span-2"><div class="flex items-center gap-2"><ShieldCheck class="h-4 w-4 text-primary" /><h2 class="text-sm font-semibold text-foreground">Normativ artefaktlar va target operatsion qatlam</h2></div><div class="mt-4 grid gap-4 lg:grid-cols-2"><div><p class="text-xs font-semibold text-foreground">Huquqiy hujjat qatlamida saqlanadi</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="term in ['PTPK', 'qonuniy vakil', 'so‘rovnoma', 'shaxsiy hujjatlar yig‘majildi', 'kompleks tekshiruv', 'PTPK yig‘ilishi', 'bayonnoma', 'xulosa', 'yo‘naltirish', 'qayta tekshiruv']" :key="term" class="rounded-md border border-border bg-muted px-2 py-1 text-[0.68rem] font-medium text-foreground">{{ term }}</span></div></div><div><p class="text-xs font-semibold text-foreground">Target operatsion qatlam qo‘shadi</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="term in ['8 kanalli signal', 'funksional ehtiyoj', 'bola va oila maqsadi', 'integratsiyalashgan reja', 'parallel referral', 'provider matching', 'STARTED dalili', '30/90 kun outcome', 'mustaqil review']" :key="term" class="rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[0.68rem] font-medium text-sky-700 dark:text-sky-300">{{ term }}</span></div></div></div></div><div class="rounded-xl border border-border bg-card p-4 xl:col-span-2"><h2 class="text-sm font-semibold text-foreground">Status kataloglari</h2><div class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><div><p class="text-xs font-semibold text-foreground">Case</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="item in casePhaseDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></div><div><p class="text-xs font-semibold text-foreground">Reja</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="item in planStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></div><div><p class="text-xs font-semibold text-foreground">Yo‘naltirish</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="item in referralStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></div><div><p class="text-xs font-semibold text-foreground">Apellyatsiya</p><div class="mt-2 flex flex-wrap gap-1.5"><span v-for="item in appealStatusDefinitions" :key="item.code" :class="['rounded-md border px-2 py-1 text-[0.65rem] font-semibold', toneClass(item.tone)]">{{ item.title }}</span></div></div></div></div></section>
      </template>
    </div>
  </PageContainer>
</template>
