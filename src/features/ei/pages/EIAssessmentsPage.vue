<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Baby,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ClipboardCheck,
  Clock3,
  Download,
  FileCheck2,
  FileQuestion,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  X,
} from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import {
  answerOptions,
  assessmentChildren,
  assessmentQuestionBank,
  assessmentRecords,
  calculateDomainResults,
  createAssessmentRecord,
  domainCatalog,
  formatAge,
  getAssessmentChild,
  getAssessmentProgress,
  getAssessmentRecord,
  getChronologicalAgeMonths,
  getContradictionIssues,
  getCorrectedAgeMonths,
  getSuggestedGoals,
  instrumentCatalog,
  isInstrumentAgeAppropriate,
  persistAssessments,
  recommendInstrument,
  updateAssessmentRecord,
  type AssessmentAnswer,
  type AssessmentInstrument,
  type AssessmentRecord,
  type AssessmentStatus,
  type DevelopmentDomain,
} from '@/features/ei/assessment-data'
import { createAssessmentPlanRecord } from '@/features/ei/assessment-plan-data'
import {
  normalizeQuestionnaireTranslations,
  type QuestionnaireLanguage,
} from '@/features/ei/questionnaire-languages'
import {
  eiProductionRecords,
  type EiProductionRecord,
} from '@/features/ei/production-pages'
import FilterPopover from '@/shared/components/FilterPopover.vue'
import FilterSelect from '@/shared/components/FilterSelect.vue'
import PageContainer from '@/shared/components/PageContainer.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import StatusTabs from '@/shared/components/StatusTabs.vue'
import { useI18n } from '@/shared/i18n'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'
import { cn } from '@/shared/lib/utils'

const props = withDefaults(defineProps<{
  mode?: 'list' | 'view' | 'edit'
}>(), {
  mode: 'list',
})

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const searchQuery = ref('')
const statusFilter = ref('')
const instrumentFilter = ref('')
const regionFilter = ref('')
const isFilterOpen = ref(false)
const rowsPerPageOptions = [20, 50, 100]
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const isRowsPerPageOpen = ref(false)
const isCreateOpen = ref(false)
const createChildId = ref('')
const createDate = ref(new Date().toLocaleDateString('en-CA'))
const createInformant = ref('Onasi')
const createInstrument = ref<AssessmentInstrument>('KID')
const createTemplateId = ref('')
const createError = ref('')
const currentQuestionIndex = ref(0)
const saveState = ref<'saved' | 'saving'>('saved')
const validationMessage = ref('')
const isFinishDialogOpen = ref(false)
const isPlanBuilderOpen = ref(false)
const planNotice = ref('')
const goalSuggestions = ref<ReturnType<typeof getSuggestedGoals>>([])

type AssessmentTemplate = {
  id: string
  instrument: AssessmentInstrument
  shortName: string
  fullName: string
  ageRange: string
  documentNumber: string
}

function resolveTemplateInstrument(record: EiProductionRecord): AssessmentInstrument | null {
  const instrumentCode = String(record.instrumentCode ?? record.shortName ?? '')
    .trim()
    .toUpperCase()

  if (instrumentCode === 'KID') {
    return 'KID'
  }

  if (instrumentCode === 'RCDI' || instrumentCode === 'RCDI-2000') {
    return 'RCDI-2000'
  }

  return null
}

const questionnaireLanguage = computed<QuestionnaireLanguage>(() => {
  if (locale.value === 'ru') {
    return 'ru'
  }

  if (locale.value === 'en') {
    return 'en'
  }

  return 'uzLatn'
})

function getLocalizedValue(
  translations: unknown,
  fallback: Partial<Record<QuestionnaireLanguage, string>>,
) {
  const normalized = normalizeQuestionnaireTranslations(translations, fallback)

  return normalized[questionnaireLanguage.value]
    || normalized.uzLatn
    || normalized.ru
    || Object.values(normalized).find(Boolean)
    || '—'
}

function mapAssessmentTemplate(record: EiProductionRecord): AssessmentTemplate | null {
  const instrument = resolveTemplateInstrument(record)

  if (!instrument) {
    return null
  }

  const shortName = String(record.shortName ?? instrument)
  const fullName = String(record.fullName ?? instrumentCatalog[instrument].title)

  return {
    id: String(record.id),
    instrument,
    shortName: getLocalizedValue(record.shortNameTranslations, { uzLatn: shortName }),
    fullName: getLocalizedValue(record.nameTranslations, { uzLatn: fullName }),
    ageRange: String(record.ageRange ?? instrumentCatalog[instrument].ageRange),
    documentNumber: String(record.docNumber ?? ''),
  }
}

const assessmentTemplates = computed(() => (
  (eiProductionRecords.questionnaires ?? [])
    .map(mapAssessmentTemplate)
    .filter((template): template is AssessmentTemplate => Boolean(template))
))
const activeAssessmentTemplates = computed(() => (
  (eiProductionRecords.questionnaires ?? [])
    .filter((record) => String(record.status ?? record.state ?? '') === 'Faol')
    .map(mapAssessmentTemplate)
    .filter((template): template is AssessmentTemplate => Boolean(template))
))
const statusOptions: Array<{ value: '' | AssessmentStatus, label: string }> = [
  { value: '', label: 'Barchasi' },
  { value: 'Boshlanmagan', label: 'Boshlanmagan' },
  { value: 'Jarayonda', label: 'Jarayonda' },
  { value: 'Tekshiruv kerak', label: 'Tekshiruv kerak' },
  { value: 'Yakunlangan', label: 'Yakunlangan' },
]

const selectedRecordId = computed(() => String(route.params.id ?? ''))
const selectedRecord = computed(() => getAssessmentRecord(selectedRecordId.value))
const selectedTemplate = computed(() => {
  if (!selectedRecord.value) {
    return undefined
  }

  return assessmentTemplates.value.find(
    (template) => template.id === selectedRecord.value?.questionnaireTemplateId,
  ) ?? assessmentTemplates.value.find(
    (template) => template.instrument === selectedRecord.value?.instrument,
  )
})
const selectedChild = computed(() => (
  selectedRecord.value ? getAssessmentChild(selectedRecord.value.childId) : undefined
))
const selectedQuestions = computed(() => (
  selectedRecord.value ? assessmentQuestionBank[selectedRecord.value.instrument] : []
))
const currentQuestion = computed(() => selectedQuestions.value[currentQuestionIndex.value])
const currentQuestionText = computed(() => {
  if (!currentQuestion.value) {
    return ''
  }

  return getLocalizedValue(currentQuestion.value.translations, {
    ru: currentQuestion.value.text,
  })
})
const localizedAnswerOptions = computed(() => (
  answerOptions.map((option) => ({
    ...option,
    ...option.translations[questionnaireLanguage.value],
  }))
))
const selectedProgress = computed(() => (
  selectedRecord.value
    ? getAssessmentProgress(selectedRecord.value)
    : { answered: 0, total: 0, percent: 0 }
))
const selectedResults = computed(() => (
  selectedRecord.value ? calculateDomainResults(selectedRecord.value) : []
))
const selectedQualityIssues = computed(() => (
  selectedRecord.value
    ? [...new Set([...selectedRecord.value.qualityIssues, ...getContradictionIssues(selectedRecord.value)])]
    : []
))
const selectedReferenceAge = computed(() => {
  if (!selectedRecord.value || !selectedChild.value) {
    return 0
  }

  return getCorrectedAgeMonths(
    selectedChild.value.birthDate,
    selectedRecord.value.assessmentDate,
    selectedChild.value.gestationalWeek,
  )
})
const selectedChronologicalAge = computed(() => {
  if (!selectedRecord.value || !selectedChild.value) {
    return 0
  }

  return getChronologicalAgeMonths(
    selectedChild.value.birthDate,
    selectedRecord.value.assessmentDate,
  )
})
const currentDomain = computed(() => currentQuestion.value?.domain)
const activeFilterCount = computed(() => (
  [instrumentFilter.value, regionFilter.value].filter(Boolean).length
))
const regionOptions = computed(() => (
  [...new Set(assessmentChildren.map((child) => child.region))].sort()
))
const filteredRecords = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('uz-UZ')

  return assessmentRecords.filter((record) => {
    const child = getAssessmentChild(record.childId)
    const searchableText = [
      record.id,
      record.instrument,
      record.assessor,
      child?.fullName,
      child?.pinfl,
      child?.applicationNumber,
      child?.region,
      child?.district,
    ].join(' ').toLocaleLowerCase('uz-UZ')

    return (!query || searchableText.includes(query))
      && (!statusFilter.value || record.status === statusFilter.value)
      && (!instrumentFilter.value || record.instrument === instrumentFilter.value)
      && (!regionFilter.value || child?.region === regionFilter.value)
  })
})
const assessmentStatusTabs = computed(() => [
  {
    label: 'Barchasi',
    value: 'all',
    count: assessmentRecords.length,
  },
  ...statusOptions.slice(1).map((status) => ({
    label: status.label,
    value: status.value,
    count: statusCount(status.value),
  })),
])
const selectedAssessmentStatuses = computed(() => (
  statusFilter.value ? [statusFilter.value] : []
))
const totalPages = computed(() => (
  Math.max(1, Math.ceil(filteredRecords.value.length / selectedRowsPerPage.value))
))
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * selectedRowsPerPage.value

  return filteredRecords.value.slice(start, start + selectedRowsPerPage.value)
})
const paginationSummary = computed(() => {
  if (!filteredRecords.value.length) {
    return '0 / 0'
  }

  const start = (currentPage.value - 1) * selectedRowsPerPage.value + 1
  const end = Math.min(currentPage.value * selectedRowsPerPage.value, filteredRecords.value.length)

  return `${start}-${end} / ${filteredRecords.value.length}`
})
const currentPageSummary = computed(() => `${currentPage.value}/${totalPages.value}`)
const createChild = computed(() => getAssessmentChild(createChildId.value))
const createChronologicalAge = computed(() => {
  if (!createChild.value) {
    return 0
  }

  return getChronologicalAgeMonths(createChild.value.birthDate, createDate.value)
})
const createCorrectedAge = computed(() => {
  if (!createChild.value) {
    return 0
  }

  return getCorrectedAgeMonths(
    createChild.value.birthDate,
    createDate.value,
    createChild.value.gestationalWeek,
  )
})
const recommendedInstrument = computed(() => recommendInstrument(createCorrectedAge.value))
const selectedCreateTemplate = computed(() => (
  activeAssessmentTemplates.value.find(
    (template) => template.id === createTemplateId.value,
  )
))
const instrumentAgeWarning = computed(() => {
  if (!activeAssessmentTemplates.value.length) {
    return 'Faol KID yoki RCDI so‘rovnoma shabloni topilmadi.'
  }

  if (!createChild.value) {
    return ''
  }

  if (createCorrectedAge.value < 2 || createCorrectedAge.value > 42) {
    return 'Bolaning yoshi KID va RCDI-2000 baholash diapazonidan tashqarida.'
  }

  if (!isInstrumentAgeAppropriate(createInstrument.value, createCorrectedAge.value)) {
    return `${formatAge(createCorrectedAge.value)} yosh uchun ${recommendedInstrument.value} tavsiya etiladi.`
  }

  if (createCorrectedAge.value >= 14 && createCorrectedAge.value <= 16) {
    return '14–16 oy oralig‘ida mutaxassis vaziyatga qarab KID yoki RCDI-2000 ni tanlashi mumkin.'
  }

  return ''
})
const canCreateAssessment = computed(() => (
  Boolean(createChild.value)
  && Boolean(createDate.value)
  && Boolean(createInformant.value)
  && Boolean(selectedCreateTemplate.value)
  && createCorrectedAge.value >= 2
  && createCorrectedAge.value <= 42
  && isInstrumentAgeAppropriate(createInstrument.value, createCorrectedAge.value)
))
const unansweredCount = computed(() => {
  if (!selectedRecord.value) {
    return 0
  }

  return selectedQuestions.value.filter((question) => (
    selectedRecord.value?.answers[question.id] === undefined
  )).length
})
const currentDomainPosition = computed(() => {
  if (!currentQuestion.value) {
    return { index: 0, total: 0 }
  }

  const domainQuestions = selectedQuestions.value.filter((question) => (
    question.domain === currentQuestion.value?.domain
  ))
  return {
    index: domainQuestions.findIndex((question) => question.id === currentQuestion.value?.id) + 1,
    total: domainQuestions.length,
  }
})
const weakestResults = computed(() => (
  [...selectedResults.value].sort((left, right) => left.score - right.score).slice(0, 3)
))
const strongestResult = computed(() => (
  [...selectedResults.value].sort((left, right) => right.score - left.score)[0]
))
const selectedOverallScore = computed(() => {
  if (!selectedResults.value.length) {
    return 0
  }

  return Math.round(
    selectedResults.value.reduce((total, result) => total + result.score, 0)
    / selectedResults.value.length,
  )
})
const selectedLevelSummary = computed(() => ({
  ageAppropriate: selectedResults.value.filter((result) => result.level === 'Yoshiga mos').length,
  watch: selectedResults.value.filter((result) => result.level === 'Kuzatuv').length,
  priority: selectedResults.value.filter((result) => result.level === 'Ustuvor').length,
}))
const selectedNextReviewDate = computed(() => {
  if (!selectedRecord.value) {
    return '—'
  }

  const nextDate = new Date(`${selectedRecord.value.assessmentDate}T12:00:00`)
  nextDate.setMonth(nextDate.getMonth() + 3)
  return formatDate(nextDate.toLocaleDateString('en-CA'))
})
const selectedGoalCount = computed(() => goalSuggestions.value.filter((goal) => goal.selected).length)

watch([searchQuery, statusFilter, instrumentFilter, regionFilter], () => {
  currentPage.value = 1
})

watch(filteredRecords, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

watch([createChildId, createDate, activeAssessmentTemplates], () => {
  if (!createChild.value) {
    return
  }

  const recommendedTemplate = activeAssessmentTemplates.value.find(
    (template) => template.instrument === recommendedInstrument.value,
  )
  const ageAppropriateTemplate = activeAssessmentTemplates.value.find(
    (template) => isInstrumentAgeAppropriate(
      template.instrument,
      createCorrectedAge.value,
    ),
  )

  if (recommendedTemplate ?? ageAppropriateTemplate) {
    const template = (recommendedTemplate ?? ageAppropriateTemplate)!
    createTemplateId.value = template.id
    createInstrument.value = template.instrument
  }

  createError.value = ''
})

watch(selectedRecord, (record) => {
  if (!record) {
    currentQuestionIndex.value = 0
    goalSuggestions.value = []
    return
  }

  const firstUnanswered = assessmentQuestionBank[record.instrument]
    .findIndex((question) => record.answers[question.id] === undefined)
  currentQuestionIndex.value = props.mode === 'edit' && firstUnanswered >= 0 ? firstUnanswered : 0
  goalSuggestions.value = getSuggestedGoals(record)
  validationMessage.value = ''
  planNotice.value = ''
}, { immediate: true })

function formatDate(value: string) {
  if (!value) {
    return '—'
  }

  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

function statusClasses(status: AssessmentStatus) {
  return {
    Boshlanmagan: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
    Jarayonda: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300',
    'Tekshiruv kerak': 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    Yakunlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  }[status]
}

function levelClasses(level: 'Yoshiga mos' | 'Kuzatuv' | 'Ustuvor') {
  return {
    'Yoshiga mos': 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    Kuzatuv: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    Ustuvor: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300',
  }[level]
}

function answerClasses(answer: AssessmentAnswer, selected?: AssessmentAnswer) {
  if (answer === selected) {
    return answer === 3
      ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/15 dark:bg-amber-950/35'
      : 'border-primary bg-primary/[0.06] ring-2 ring-primary/15'
  }

  return 'border-border bg-background hover:border-primary/45 hover:bg-muted/35'
}

function childAgeForRecord(record: AssessmentRecord) {
  const child = getAssessmentChild(record.childId)

  if (!child) {
    return '—'
  }

  return formatAge(getCorrectedAgeMonths(
    child.birthDate,
    record.assessmentDate,
    child.gestationalWeek,
  ))
}

function childChronologicalAgeForRecord(record: AssessmentRecord) {
  const child = getAssessmentChild(record.childId)

  if (!child) {
    return '—'
  }

  return formatAge(getChronologicalAgeMonths(
    child.birthDate,
    record.assessmentDate,
  ))
}

function recordResult(record: AssessmentRecord) {
  if (!['Yakunlangan', 'Tekshiruv kerak'].includes(record.status)) {
    return undefined
  }

  return [...calculateDomainResults(record)].sort((left, right) => left.score - right.score)[0]
}

function recordAverageScore(record: AssessmentRecord) {
  if (!['Yakunlangan', 'Tekshiruv kerak'].includes(record.status)) {
    return undefined
  }

  const results = calculateDomainResults(record)
  return results.length
    ? Math.round(results.reduce((total, result) => total + result.score, 0) / results.length)
    : undefined
}

function statusCount(status: '' | AssessmentStatus) {
  return status
    ? assessmentRecords.filter((record) => record.status === status).length
    : assessmentRecords.length
}

function handleAssessmentStatusSelect(value: string) {
  if (value === 'all') {
    statusFilter.value = ''
  }
  else {
    statusFilter.value = statusFilter.value === value ? '' : value as AssessmentStatus
  }

  currentPage.value = 1
}

function setRowsPerPageOpen(isOpen: boolean) {
  isRowsPerPageOpen.value = isOpen
}

function setRowsPerPage(value: number) {
  selectedRowsPerPage.value = value
  currentPage.value = 1
}

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
}

function domainProgress(domain: DevelopmentDomain) {
  if (!selectedRecord.value) {
    return { answered: 0, total: 0, percent: 0 }
  }

  const questions = selectedQuestions.value.filter((question) => question.domain === domain)
  const answered = questions.filter((question) => (
    selectedRecord.value?.answers[question.id] !== undefined
  )).length

  return {
    answered,
    total: questions.length,
    percent: questions.length ? Math.round(answered / questions.length * 100) : 0,
  }
}

function clearFilters() {
  instrumentFilter.value = ''
  regionFilter.value = ''
  isFilterOpen.value = false
}

function resetList() {
  searchQuery.value = ''
  statusFilter.value = ''
  clearFilters()
}

function openCreateDialog() {
  const initialTemplate = activeAssessmentTemplates.value[0]

  createChildId.value = ''
  createDate.value = new Date().toLocaleDateString('en-CA')
  createInformant.value = 'Onasi'
  createTemplateId.value = initialTemplate?.id ?? ''
  createInstrument.value = initialTemplate?.instrument ?? 'KID'
  createError.value = ''
  isCreateOpen.value = true
}

function selectCreateTemplate(template: AssessmentTemplate) {
  createTemplateId.value = template.id
  createInstrument.value = template.instrument
  createError.value = ''
}

function closeCreateDialog() {
  isCreateOpen.value = false
  createError.value = ''
}

function startAssessment() {
  if (!canCreateAssessment.value) {
    createError.value = activeAssessmentTemplates.value.length
      ? 'Bola, baholash sanasi va respondent ma’lumotlarini tekshiring.'
      : 'Sessiya yaratish uchun avval kamida bitta shablonni faol qiling.'
    return
  }

  const record = createAssessmentRecord({
    childId: createChildId.value,
    instrument: createInstrument.value,
    questionnaireTemplateId: selectedCreateTemplate.value!.id,
    assessmentDate: createDate.value,
    informant: createInformant.value,
  })
  closeCreateDialog()
  router.push(`/apps/ei/service/surveys/${record.id}/edit`)
}

function openRecord(record: AssessmentRecord) {
  const target = ['Yakunlangan', 'Tekshiruv kerak'].includes(record.status)
    ? `/apps/ei/service/surveys/${record.id}`
    : `/apps/ei/service/surveys/${record.id}/edit`
  router.push(target)
}

function recordActionLabel(record: AssessmentRecord) {
  if (record.status === 'Yakunlangan') {
    return 'Natijani ko‘rish'
  }

  if (record.status === 'Tekshiruv kerak') {
    return 'Tekshirish'
  }

  return record.status === 'Boshlanmagan' ? 'Boshlash' : 'Davom etish'
}

function backToList() {
  router.push('/apps/ei/service/surveys')
}

function downloadCsv() {
  const rows = filteredRecords.value.map((record) => {
    const child = getAssessmentChild(record.childId)
    const progress = getAssessmentProgress(record)
    const result = recordResult(record)
    return [
      record.id,
      formatDate(record.assessmentDate),
      child?.fullName ?? '',
      child?.pinfl ?? '',
      record.instrument,
      childChronologicalAgeForRecord(record),
      childAgeForRecord(record),
      `${progress.answered}/${progress.total}`,
      result ? `${result.label} (${recordAverageScore(record)}%)` : '',
      record.status,
    ]
  })
  const header = ['Hujjat ID', 'Sana', 'Xizmatdan foydalanuvchi', 'JSHSHIR', 'So‘rovnoma', 'Xronologik yosh', 'Tuzatilgan yosh', 'Jarayon', 'Natija', 'Holat']
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ei-baholashlar-${createDate.value}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

function selectDomain(domain: DevelopmentDomain) {
  const index = selectedQuestions.value.findIndex((question) => question.domain === domain)

  if (index >= 0) {
    currentQuestionIndex.value = index
    validationMessage.value = ''
  }
}

function selectAnswer(answer: AssessmentAnswer) {
  if (!selectedRecord.value || !currentQuestion.value) {
    return
  }

  saveState.value = 'saving'
  selectedRecord.value.answers[currentQuestion.value.id] = answer
  selectedRecord.value.status = 'Jarayonda'
  selectedRecord.value.qualityIssues = getContradictionIssues(selectedRecord.value)
  persistAssessments()
  validationMessage.value = ''

  window.setTimeout(() => {
    saveState.value = 'saved'
  }, 350)
}

function goToPreviousQuestion() {
  currentQuestionIndex.value = Math.max(0, currentQuestionIndex.value - 1)
  validationMessage.value = ''
}

function goToNextQuestion() {
  currentQuestionIndex.value = Math.min(
    selectedQuestions.value.length - 1,
    currentQuestionIndex.value + 1,
  )
  validationMessage.value = ''
}

function goToNextUnanswered() {
  if (!selectedRecord.value) {
    return
  }

  const start = currentQuestionIndex.value + 1
  const nextIndex = selectedQuestions.value.findIndex((question, index) => (
    index >= start && selectedRecord.value?.answers[question.id] === undefined
  ))
  const fallbackIndex = selectedQuestions.value.findIndex((question) => (
    selectedRecord.value?.answers[question.id] === undefined
  ))
  const targetIndex = nextIndex >= 0 ? nextIndex : fallbackIndex

  if (targetIndex >= 0) {
    currentQuestionIndex.value = targetIndex
  }
}

function saveAndExit() {
  if (!selectedRecord.value) {
    return
  }

  const issues = getContradictionIssues(selectedRecord.value)
  const nextStatus = selectedRecord.value.status === 'Tekshiruv kerak' && issues.length
    ? 'Tekshiruv kerak'
    : selectedProgress.value.answered ? 'Jarayonda' : 'Boshlanmagan'
  updateAssessmentRecord(selectedRecord.value.id, {
    status: nextStatus,
    qualityIssues: issues,
  })
  backToList()
}

function requestFinish() {
  if (unansweredCount.value > 0) {
    validationMessage.value = `${unansweredCount.value} ta savol javobsiz qoldi. Yakunlashdan oldin ularni to‘ldiring.`
    goToNextUnanswered()
    return
  }

  isFinishDialogOpen.value = true
}

function finalizeAssessment() {
  if (!selectedRecord.value) {
    return
  }

  const issues = getContradictionIssues(selectedRecord.value)
  updateAssessmentRecord(selectedRecord.value.id, {
    status: issues.length ? 'Tekshiruv kerak' : 'Yakunlangan',
    completedAt: new Date().toISOString(),
    qualityIssues: issues,
  })
  isFinishDialogOpen.value = false
  router.push(`/apps/ei/service/surveys/${selectedRecord.value.id}`)
}

function openPlanBuilder() {
  if (!selectedRecord.value) {
    return
  }

  goalSuggestions.value = getSuggestedGoals(selectedRecord.value)
  isPlanBuilderOpen.value = true
}

function createIndividualPlan() {
  if (!selectedRecord.value || !selectedGoalCount.value) {
    return
  }

  const selectedGoals = goalSuggestions.value.filter((goal) => goal.selected)
  createAssessmentPlanRecord(selectedRecord.value, selectedGoals)
  updateAssessmentRecord(selectedRecord.value.id, { planCreated: true })
  isPlanBuilderOpen.value = false
  planNotice.value = `${selectedGoals.length} ta maqsad individual rivojlanish rejasi qoralamasiga qo‘shildi.`
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') {
    return
  }

  if (isPlanBuilderOpen.value) {
    isPlanBuilderOpen.value = false
  }
  else if (isFinishDialogOpen.value) {
    isFinishDialogOpen.value = false
  }
  else if (isCreateOpen.value) {
    closeCreateDialog()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleGlobalKeydown))
</script>

<template>
  <PageContainer :class="mode === 'list' ? undefined : 'xl:overflow-y-auto xl:overscroll-contain'">
    <SectionBlock
      v-if="mode === 'list'"
      class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible"
      content-class="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-3 overflow-visible p-0"
      title=""
      description=""
    >
      <div class="flex flex-col gap-3">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input v-model="searchQuery" class="pl-9" placeholder="Bola, JSHSHIR yoki baholash raqami" />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <FilterPopover
              v-model:open="isFilterOpen"
              :active-count="activeFilterCount"
              panel-class="xl:w-80"
            >
              <FilterSelect
                v-model="instrumentFilter"
                label="Instrument"
                :options="['KID', 'RCDI-2000']"
                :searchable="false"
              />
              <FilterSelect
                v-model="regionFilter"
                label="Hudud"
                :options="regionOptions"
              />
              <template #footer>
                <div class="flex justify-end gap-2 border-t border-border pt-3">
                  <Button variant="outline" size="sm" :disabled="!activeFilterCount" @click="clearFilters">
                    Tozalash
                  </Button>
                  <Button size="sm" @click="isFilterOpen = false">Qo‘llash</Button>
                </div>
              </template>
            </FilterPopover>
            <Button variant="outline" size="sm" class="h-7 gap-1.5" :disabled="!filteredRecords.length" @click="downloadCsv">
              <Download class="h-4 w-4" />
              <span>Yuklab olish</span>
            </Button>
            <Button size="sm" class="h-7 gap-1.5" @click="openCreateDialog">
              <Plus class="h-4 w-4" />
              <span>Yangi baholash</span>
            </Button>
          </div>
        </div>
      </div>

      <StatusTabs
        :tabs="assessmentStatusTabs"
        :selected-values="selectedAssessmentStatuses"
        :show-indicator="false"
        item-key-prefix="ei-assessment-status"
        @select="handleAssessmentStatusSelect"
      />

      <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
        <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
          <div class="grid gap-3 p-3 lg:hidden">
            <article
              v-for="record in paginatedRecords"
              :key="record.id"
              class="rounded-lg border border-border bg-background p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="truncate text-sm font-semibold">{{ record.id }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{{ formatDate(record.assessmentDate) }}</p>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                  <span :class="cn('rounded-full border px-2 py-1 text-[11px] font-medium', statusClasses(record.status))">
                    {{ record.status }}
                  </span>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger as-child>
                      <Button variant="outline" size="sm" class="h-8 w-8 rounded-md p-0" aria-label="Amallar">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent
                        side="bottom"
                        align="end"
                        :side-offset="6"
                        class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                      >
                        <DropdownMenuItem
                          class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                          @select.prevent="openRecord(record)"
                        >
                          <ArrowRight class="h-4 w-4" />
                          <span>{{ recordActionLabel(record) }}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </div>
              </div>
              <div class="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p class="text-muted-foreground">Xizmatdan foydalanuvchi</p>
                  <p class="mt-1 truncate font-medium">{{ getAssessmentChild(record.childId)?.fullName }}</p>
                  <p class="mt-0.5 truncate text-[11px] text-muted-foreground">JSHSHIR: {{ getAssessmentChild(record.childId)?.pinfl }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">So‘rovnoma</p>
                  <p class="mt-1 font-medium">{{ record.instrument }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Xronologik yosh</p>
                  <p class="mt-1 font-medium">{{ childChronologicalAgeForRecord(record) }}</p>
                </div>
                <div>
                  <p class="text-muted-foreground">Tuzatilgan yosh</p>
                  <p class="mt-1 font-medium">{{ childAgeForRecord(record) }}</p>
                </div>
              </div>
              <div class="mt-3">
                <div class="mb-1.5 flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">Javoblar</span>
                  <span class="font-medium">{{ getAssessmentProgress(record).answered }}/{{ getAssessmentProgress(record).total }}</span>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div class="h-full rounded-full bg-primary" :style="{ width: `${getAssessmentProgress(record).percent}%` }" />
                </div>
              </div>
              <div v-if="recordResult(record)" class="mt-3 flex items-center justify-between rounded-lg bg-muted/45 px-3 py-2 text-xs">
                <span>
                  <span class="text-muted-foreground">Ustuvor soha:</span>
                  <strong class="ml-1">{{ recordResult(record)?.shortLabel }}</strong>
                </span>
                <strong>Umumiy {{ recordAverageScore(record) }}%</strong>
              </div>
            </article>

            <div v-if="!filteredRecords.length" class="py-12 text-center">
              <FileQuestion class="mx-auto h-8 w-8 text-muted-foreground/50" />
              <p class="mt-3 text-sm font-medium">Baholash topilmadi</p>
              <Button variant="ghost" size="sm" class="mt-2" @click="resetList">Filterlarni tiklash</Button>
            </div>
          </div>

          <div class="hidden min-h-0 flex-1 overflow-auto lg:block">
            <table class="w-full min-w-[76rem] text-sm">
              <thead class="sticky top-0 z-10 bg-muted/75 text-xs font-semibold text-muted-foreground backdrop-blur">
                <tr>
                  <th class="border-b border-border px-4 py-2.5 text-left">Hujjat</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">Xizmatdan foydalanuvchi</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">So‘rovnoma</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">Yosh</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">Jarayon</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">Natija</th>
                  <th class="border-b border-border px-4 py-2.5 text-left">Holat</th>
                  <th class="border-b border-border px-4 py-2.5 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="record in paginatedRecords"
                  :key="record.id"
                  class="border-b border-border last:border-b-0 hover:bg-muted/25"
                >
                  <td class="px-4 py-3 align-top">
                    <p class="font-semibold">{{ record.id }}</p>
                    <p class="mt-1 text-xs text-muted-foreground">{{ formatDate(record.assessmentDate) }}</p>
                  </td>
                  <td class="max-w-72 px-4 py-3 align-top">
                    <p class="truncate font-semibold">{{ getAssessmentChild(record.childId)?.fullName }}</p>
                    <p class="mt-1 truncate text-xs text-muted-foreground">
                      JSHSHIR: {{ getAssessmentChild(record.childId)?.pinfl }}
                    </p>
                  </td>
                  <td class="px-4 py-3 align-top">
                    <p class="font-medium">{{ record.instrument }}</p>
                  </td>
                  <td class="px-4 py-3 align-top">
                    <p class="font-medium">Xronologik: {{ childChronologicalAgeForRecord(record) }}</p>
                    <p class="mt-1 text-xs text-muted-foreground">Tuzatilgan: {{ childAgeForRecord(record) }}</p>
                  </td>
                  <td class="min-w-40 px-4 py-3 align-top">
                    <div class="mb-1.5 flex items-center justify-between text-xs">
                      <span>{{ getAssessmentProgress(record).answered }}/{{ getAssessmentProgress(record).total }}</span>
                      <span class="text-muted-foreground">{{ getAssessmentProgress(record).percent }}%</span>
                    </div>
                    <div class="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        :class="cn('h-full rounded-full', record.status === 'Tekshiruv kerak' ? 'bg-amber-500' : 'bg-primary')"
                        :style="{ width: `${getAssessmentProgress(record).percent}%` }"
                      />
                    </div>
                  </td>
                  <td class="px-4 py-3 align-top">
                    <template v-if="recordResult(record)">
                      <p class="font-medium">{{ recordResult(record)?.label }}</p>
                      <p class="mt-1 text-xs text-muted-foreground">
                        Umumiy {{ recordAverageScore(record) }}% · sohada {{ recordResult(record)?.score }}%
                      </p>
                    </template>
                    <span v-else class="text-muted-foreground">—</span>
                  </td>
                  <td class="px-4 py-3 align-top">
                    <span :class="cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-medium', statusClasses(record.status))">
                      {{ record.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 align-top">
                    <div class="flex justify-center">
                      <DropdownMenuRoot>
                        <DropdownMenuTrigger as-child>
                          <Button variant="outline" size="sm" class="h-8 w-8 rounded-md p-0" aria-label="Amallar">
                            <MoreHorizontal class="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuContent
                            side="bottom"
                            align="end"
                            :side-offset="6"
                            class="z-50 min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                          >
                            <DropdownMenuItem
                              class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                              @select.prevent="openRecord(record)"
                            >
                              <ArrowRight class="h-4 w-4" />
                              <span>{{ recordActionLabel(record) }}</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenuPortal>
                      </DropdownMenuRoot>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredRecords.length">
                  <td colspan="8" class="px-6 py-16 text-center">
                    <FileQuestion class="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p class="mt-3 text-sm font-medium">Baholash topilmadi</p>
                    <Button variant="ghost" size="sm" class="mt-2" @click="resetList">Filterlarni tiklash</Button>
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
                class="h-7 w-7 rounded-md p-0"
                :disabled="currentPage === 1"
                aria-label="Birinchi sahifa"
                @click="goToPage(1)"
              >
                <ChevronsLeft class="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0"
                :disabled="currentPage === 1"
                aria-label="Oldingi sahifa"
                @click="goToPage(currentPage - 1)"
              >
                <ChevronLeft class="h-5 w-5" />
              </Button>
              <div class="mx-1 flex h-7 min-w-14 items-center justify-center text-sm font-semibold text-foreground">
                {{ currentPageSummary }}
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0"
                :disabled="currentPage === totalPages"
                aria-label="Keyingi sahifa"
                @click="goToPage(currentPage + 1)"
              >
                <ChevronRight class="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 rounded-md p-0"
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

    <template v-else-if="mode === 'edit'">
      <template v-if="selectedRecord && selectedChild && currentQuestion">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" class="shrink-0" aria-label="Ro‘yxatga qaytish" @click="saveAndExit">
              <ArrowLeft class="h-4 w-4" />
            </Button>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="truncate text-lg font-semibold">{{ selectedChild.fullName }}</h1>
                <span class="rounded-full border border-primary/25 bg-primary/[0.06] px-2 py-0.5 text-xs font-semibold text-primary">
                  {{ selectedTemplate?.shortName ?? selectedRecord.instrument }}
                </span>
              </div>
              <p class="mt-1 truncate text-xs text-muted-foreground">
                {{ selectedRecord.id }} · {{ formatAge(selectedReferenceAge) }} · respondent: {{ selectedRecord.informant }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-end sm:self-auto">
            <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Save class="h-3.5 w-3.5" />
              {{ saveState === 'saving' ? 'Saqlanmoqda…' : 'Avtomatik saqlandi' }}
            </span>
            <Button variant="outline" size="sm" @click="saveAndExit">Chiqish</Button>
          </div>
        </div>

        <Card>
          <CardContent class="p-3.5">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div class="flex flex-1 items-center gap-3">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Baby class="h-4 w-4" />
                </div>
                <div class="grid flex-1 gap-x-6 gap-y-1 text-xs sm:grid-cols-3">
                  <div>
                    <span class="text-muted-foreground">Tug‘ilgan sana</span>
                    <p class="mt-0.5 font-medium">{{ formatDate(selectedChild.birthDate) }}</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Xronologik yosh</span>
                    <p class="mt-0.5 font-medium">{{ formatAge(selectedChronologicalAge) }}</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Tuzatilgan yosh</span>
                    <p class="mt-0.5 font-medium">
                      {{ formatAge(selectedReferenceAge) }}
                      <span v-if="selectedChild.gestationalWeek < 37" class="ml-1 text-amber-600">({{ selectedChild.gestationalWeek }} hafta)</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="min-w-52">
                <div class="mb-1.5 flex items-center justify-between text-xs">
                  <span class="text-muted-foreground">Umumiy jarayon</span>
                  <strong>{{ selectedProgress.answered }}/{{ selectedProgress.total }}</strong>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-muted">
                  <div class="h-full rounded-full bg-primary transition-all" :style="{ width: `${selectedProgress.percent}%` }" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div class="grid min-h-0 flex-1 gap-3 xl:min-h-[40rem] xl:flex-none xl:grid-cols-[14.5rem_minmax(0,1fr)_16rem]">
          <Card class="min-h-0">
            <CardContent class="h-full p-2.5">
              <div class="mb-2 flex items-center justify-between px-1.5">
                <p class="text-xs font-semibold uppercase text-muted-foreground">Rivojlanish sohalari</p>
                <span class="text-[11px] text-muted-foreground">{{ instrumentCatalog[selectedRecord.instrument].domains.length }}</span>
              </div>
              <div class="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-y-auto">
                <button
                  v-for="domain in instrumentCatalog[selectedRecord.instrument].domains"
                  :key="domain"
                  type="button"
                  :class="cn(
                    'min-w-44 rounded-lg border p-2.5 text-left transition-colors xl:min-w-0',
                    currentDomain === domain
                      ? 'border-primary/35 bg-primary/[0.07]'
                      : 'border-transparent hover:border-border hover:bg-muted/35',
                  )"
                  @click="selectDomain(domain)"
                >
                  <div class="flex items-center justify-between gap-2">
                    <span class="whitespace-normal text-xs font-medium leading-4">{{ domainCatalog[domain].shortLabel }}</span>
                    <CheckCircle2
                      v-if="domainProgress(domain).percent === 100"
                      class="h-3.5 w-3.5 shrink-0 text-emerald-600"
                    />
                    <span v-else class="text-[11px] text-muted-foreground">
                      {{ domainProgress(domain).answered }}/{{ domainProgress(domain).total }}
                    </span>
                  </div>
                  <div class="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      class="h-full rounded-full bg-primary"
                      :style="{ width: `${domainProgress(domain).percent}%` }"
                    />
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card class="min-h-[26rem] min-w-0">
            <CardContent class="flex h-full min-h-0 flex-col p-4 sm:p-5">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      {{ domainCatalog[currentQuestion.domain].label }}
                    </span>
                    <span class="inline-flex rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      Rasmiy savol №{{ currentQuestion.sourceNumber }}
                    </span>
                  </div>
                  <p class="mt-2 text-xs text-muted-foreground">
                    Sohada {{ currentDomainPosition.index }} / {{ currentDomainPosition.total }}
                  </p>
                </div>
                <span class="shrink-0 text-xs font-medium text-muted-foreground">
                  Jami {{ currentQuestionIndex + 1 }} / {{ selectedQuestions.length }}
                </span>
              </div>

              <div class="flex flex-1 flex-col justify-center py-5">
                <h2 class="max-w-none whitespace-normal break-words text-xl font-semibold leading-8 text-foreground">
                  {{ currentQuestionText }}
                </h2>
                <p class="mt-2 text-sm text-muted-foreground">
                  Respondentning kundalik kuzatuviga eng mos javobni belgilang.
                </p>

                <div class="mt-5 grid gap-2.5">
                  <button
                    v-for="option in localizedAnswerOptions"
                    :key="option.value"
                    type="button"
                    :class="cn(
                      'flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all',
                      answerClasses(option.value, selectedRecord.answers[currentQuestion.id]),
                    )"
                    @click="selectAnswer(option.value)"
                  >
                    <span
                      :class="cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                        selectedRecord.answers[currentQuestion.id] === option.value
                          ? option.value === 3
                            ? 'border-amber-500 bg-amber-500 text-white'
                            : 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground',
                      )"
                    >
                      <Check v-if="selectedRecord.answers[currentQuestion.id] === option.value" class="h-4 w-4" />
                      <span v-else>{{ option.value }}</span>
                    </span>
                    <span class="min-w-0">
                      <span class="block text-sm font-semibold">{{ option.title }}</span>
                      <span class="mt-0.5 block text-xs text-muted-foreground">{{ option.description }}</span>
                    </span>
                  </button>
                </div>
              </div>

              <div class="flex flex-col-reverse gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  class="gap-2"
                  :disabled="unansweredCount === 0"
                  @click="goToNextUnanswered"
                >
                  <MoreHorizontal class="h-4 w-4" />
                  Keyingi javobsiz
                </Button>
                <div class="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    :disabled="currentQuestionIndex === 0"
                    @click="goToPreviousQuestion"
                  >
                    <ChevronLeft class="h-4 w-4" />
                    Oldingi
                  </Button>
                  <Button
                    size="sm"
                    :disabled="currentQuestionIndex === selectedQuestions.length - 1"
                    @click="goToNextQuestion"
                  >
                    Keyingi
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div class="grid content-start gap-3">
            <Card>
              <CardContent class="p-3.5">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="h-4 w-4 text-primary" />
                  <p class="text-sm font-semibold">Sifat nazorati</p>
                </div>
                <div class="mt-3 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Javobsiz</span>
                    <strong :class="unansweredCount ? 'text-amber-600' : 'text-emerald-600'">{{ unansweredCount }}</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Qarama-qarshi javob</span>
                    <strong :class="selectedQualityIssues.length ? 'text-amber-600' : 'text-emerald-600'">{{ selectedQualityIssues.length }}</strong>
                  </div>
                </div>
                <div
                  v-if="selectedQualityIssues.length"
                  class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-5 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  {{ selectedQualityIssues[0] }}
                </div>
                <div v-else class="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle2 class="h-4 w-4 shrink-0" />
                  Javoblar mantiqiy nazoratdan o‘tmoqda.
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-3.5">
                <p class="text-sm font-semibold">Yakunlash</p>
                <p class="mt-1.5 text-xs leading-5 text-muted-foreground">
                  Barcha savollar to‘ldirilgach rivojlanish profili avtomatik hisoblanadi.
                </p>
                <p v-if="validationMessage" class="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                  {{ validationMessage }}
                </p>
                <Button class="mt-3 w-full gap-2" @click="requestFinish">
                  <FileCheck2 class="h-4 w-4" />
                  Baholashni yakunlash
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </template>

      <Card v-else>
        <CardContent class="flex min-h-64 flex-col items-center justify-center p-6 text-center">
          <AlertCircle class="h-8 w-8 text-muted-foreground/60" />
          <p class="mt-3 font-semibold">Baholash topilmadi</p>
          <Button variant="outline" size="sm" class="mt-4" @click="backToList">Ro‘yxatga qaytish</Button>
        </CardContent>
      </Card>
    </template>

    <template v-else>
      <template v-if="selectedRecord && selectedChild">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex min-w-0 items-center gap-3">
            <Button variant="outline" size="icon" class="shrink-0" aria-label="Ro‘yxatga qaytish" @click="backToList">
              <ArrowLeft class="h-4 w-4" />
            </Button>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-lg font-semibold">Rivojlanish profili</h1>
                <span :class="cn('rounded-full border px-2 py-0.5 text-xs font-medium', statusClasses(selectedRecord.status))">
                  {{ selectedRecord.status }}
                </span>
              </div>
              <p class="mt-1 truncate text-xs text-muted-foreground">
                {{ selectedChild.fullName }} · {{ selectedRecord.id }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 self-end sm:self-auto">
            <Button
              v-if="selectedRecord.status === 'Tekshiruv kerak'"
              variant="outline"
              size="sm"
              class="gap-2"
              @click="router.push(`/apps/ei/service/surveys/${selectedRecord.id}/edit`)"
            >
              <AlertCircle class="h-4 w-4" />
              Javoblarni tekshirish
            </Button>
            <Button
              v-if="selectedRecord.planCreated"
              variant="outline"
              size="sm"
              class="gap-2"
              @click="router.push('/apps/ei/service/plans')"
            >
              <Target class="h-4 w-4" />
              Rejani ko‘rish
            </Button>
            <Button v-else size="sm" class="gap-2" @click="openPlanBuilder">
              <Sparkles class="h-4 w-4" />
              Reja qoralamasini yaratish
            </Button>
          </div>
        </div>

        <div
          v-if="planNotice"
          class="flex items-start justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-200"
        >
          <span class="flex items-center gap-2">
            <CheckCircle2 class="h-4 w-4 shrink-0" />
            {{ planNotice }}
          </span>
          <button type="button" aria-label="Xabarni yopish" @click="planNotice = ''">
            <X class="h-4 w-4" />
          </button>
        </div>

        <div
          v-if="selectedQualityIssues.length"
          class="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/40"
        >
          <AlertCircle class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p class="text-sm font-semibold text-amber-900 dark:text-amber-100">Natijani tasdiqlashdan oldin tekshiruv kerak</p>
            <p class="mt-1 text-xs leading-5 text-amber-800 dark:text-amber-200">{{ selectedQualityIssues[0] }}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent class="flex items-center gap-3 p-3.5">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRound class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Instrument</p>
                <p class="mt-0.5 font-semibold">{{ selectedTemplate?.shortName ?? selectedRecord.instrument }}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="flex items-center gap-3 p-3.5">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300">
                <CalendarDays class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Baholash sanasi</p>
                <p class="mt-0.5 font-semibold">{{ formatDate(selectedRecord.assessmentDate) }}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="flex items-center gap-3 p-3.5">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300">
                <Clock3 class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Xronologik yosh</p>
                <p class="mt-0.5 font-semibold">{{ formatAge(selectedChronologicalAge) }}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="flex items-center gap-3 p-3.5">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Baby class="h-4 w-4" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">Tuzatilgan yosh</p>
                <p class="mt-0.5 font-semibold">{{ formatAge(selectedReferenceAge) }}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card class="border-primary/20 bg-primary/[0.025]">
          <CardContent class="grid gap-4 p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(10rem,0.45fr)_minmax(12rem,0.55fr)] lg:items-center">
            <div>
              <div class="flex items-center gap-2">
                <ClipboardCheck class="h-4 w-4 text-primary" />
                <h2 class="text-sm font-semibold">Baholash xulosasi</h2>
              </div>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                Eng barqaror soha — <strong class="text-foreground">{{ strongestResult?.label }}</strong>;
                birinchi navbatda <strong class="text-foreground">{{ weakestResults[0]?.label }}</strong> sohasini
                individual reja maqsadlariga kiritish tavsiya etiladi.
              </p>
              <div class="mt-2.5 flex flex-wrap gap-2 text-[11px]">
                <span class="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                  Yoshiga mos: {{ selectedLevelSummary.ageAppropriate }} soha
                </span>
                <span class="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  Kuzatuv: {{ selectedLevelSummary.watch }} soha
                </span>
                <span class="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                  Ustuvor: {{ selectedLevelSummary.priority }} soha
                </span>
              </div>
            </div>

            <div class="rounded-xl border border-border bg-background p-3.5">
              <p class="text-xs text-muted-foreground">Umumiy ko‘rsatkich</p>
              <p class="mt-1 text-2xl font-semibold text-primary">{{ selectedOverallScore }}%</p>
              <p class="mt-1 text-[11px] text-muted-foreground">Barcha sohalar o‘rtachasi</p>
            </div>

            <div class="rounded-xl border border-border bg-background p-3.5">
              <p class="text-xs text-muted-foreground">Keyingi qayta baholash</p>
              <p class="mt-1 text-base font-semibold">{{ selectedNextReviewDate }}</p>
              <p class="mt-1 text-[11px] text-muted-foreground">3 oylik kuzatuv davridan keyin</p>
            </div>
          </CardContent>
        </Card>

        <div class="grid min-h-0 flex-1 gap-3 xl:min-h-[42rem] xl:flex-none xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.7fr)]">
          <Card class="min-h-0">
            <CardContent class="h-full overflow-y-auto p-4">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 class="text-sm font-semibold">Rivojlanish sohalari profili</h2>
                  <p class="mt-1 text-xs text-muted-foreground">Rivojlanish yoshi tuzatilgan yosh bilan solishtirilgan.</p>
                </div>
                <div class="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground sm:mt-0">
                  <span class="flex items-center gap-1.5"><i class="h-2 w-2 rounded-full bg-primary" /> Rivojlanish yoshi</span>
                  <span class="flex items-center gap-1.5"><i class="h-3 w-px bg-foreground" /> Tuzatilgan yosh</span>
                </div>
              </div>

              <div class="mt-4 space-y-4">
                <div
                  v-for="result in selectedResults"
                  :key="result.domain"
                  class="rounded-xl border border-border p-3.5"
                >
                  <div class="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p class="text-sm font-semibold">{{ result.label }}</p>
                      <p class="mt-1 text-xs text-muted-foreground">
                        {{ result.achieved }}/{{ result.total }} faol ko‘nikma · {{ result.score }}%
                      </p>
                    </div>
                    <span :class="cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', levelClasses(result.level))">
                      {{ result.level }}
                    </span>
                  </div>

                  <div class="mt-3">
                    <div class="relative h-2.5 overflow-visible rounded-full bg-muted">
                      <div
                        class="h-full rounded-full bg-primary"
                        :style="{ width: `${Math.min(100, result.developmentAgeMonths / instrumentCatalog[selectedRecord.instrument].maxAgeMonths * 100)}%` }"
                      />
                      <span
                        class="absolute -top-1 h-4 w-px bg-foreground"
                        :style="{ left: `${Math.min(100, result.referenceAgeMonths / instrumentCatalog[selectedRecord.instrument].maxAgeMonths * 100)}%` }"
                      />
                    </div>
                    <div class="mt-2 flex items-center justify-between text-xs">
                      <span class="font-medium text-primary">{{ formatAge(result.developmentAgeMonths) }}</span>
                      <span class="text-muted-foreground">
                        {{ result.delayMonths ? `${result.delayMonths} oy farq` : 'Yoshiga mos' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 rounded-lg bg-muted/45 px-3.5 py-3 text-xs leading-5 text-muted-foreground">
                Ushbu profil klinik tashxis emas. Natija mutaxassis kuzatuvi, oila bilan suhbat va boshqa baholash ma’lumotlari bilan birga talqin qilinadi.
              </div>
            </CardContent>
          </Card>

          <div class="grid min-h-0 content-start gap-3 overflow-y-auto">
            <Card>
              <CardContent class="p-4">
                <div class="flex items-center gap-2">
                  <Target class="h-4 w-4 text-primary" />
                  <h2 class="text-sm font-semibold">Ustuvor yo‘nalishlar</h2>
                </div>
                <div class="mt-3 space-y-2">
                  <div
                    v-for="(result, index) in weakestResults"
                    :key="result.domain"
                    class="flex items-center gap-3 rounded-lg border border-border p-2.5"
                  >
                    <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{{ index + 1 }}</span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-xs font-medium">{{ result.label }}</p>
                      <p class="mt-0.5 text-[11px] text-muted-foreground">{{ result.score }}% · {{ formatAge(result.developmentAgeMonths) }}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent class="p-4">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="h-4 w-4 text-primary" />
                  <h2 class="text-sm font-semibold">Baholash sifati</h2>
                </div>
                <div class="mt-3 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">To‘ldirilgan</span>
                    <strong>{{ selectedProgress.percent }}%</strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Mantiqiy ogohlantirish</span>
                    <strong :class="selectedQualityIssues.length ? 'text-amber-600' : 'text-emerald-600'">
                      {{ selectedQualityIssues.length }}
                    </strong>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">Respondent</span>
                    <strong>{{ selectedRecord.informant }}</strong>
                  </div>
                  <div class="border-t border-border pt-2">
                    <span class="text-muted-foreground">Mutaxassis</span>
                    <p class="mt-1 font-medium">{{ selectedRecord.assessor }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card class="border-primary/25 bg-primary/[0.035]">
              <CardContent class="p-4">
                <div class="flex items-center gap-2">
                  <Sparkles class="h-4 w-4 text-primary" />
                  <h2 class="text-sm font-semibold">Keyingi qadam</h2>
                </div>
                <p class="mt-2 text-xs leading-5 text-muted-foreground">
                  Ustuvor sohalar asosida individual reja uchun tahrirlanadigan maqsadlar tayyorlanadi.
                </p>
                <Button
                  v-if="!selectedRecord.planCreated"
                  class="mt-3 w-full gap-2"
                  :disabled="selectedRecord.status === 'Tekshiruv kerak'"
                  @click="openPlanBuilder"
                >
                  <Target class="h-4 w-4" />
                  Reja qoralamasini yaratish
                </Button>
                <Button v-else variant="outline" class="mt-3 w-full gap-2" @click="router.push('/apps/ei/service/plans')">
                  <CheckCircle2 class="h-4 w-4 text-emerald-600" />
                  Rejani ko‘rish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </template>

      <Card v-else>
        <CardContent class="flex min-h-64 flex-col items-center justify-center p-6 text-center">
          <AlertCircle class="h-8 w-8 text-muted-foreground/60" />
          <p class="mt-3 font-semibold">Baholash topilmadi</p>
          <Button variant="outline" size="sm" class="mt-4" @click="backToList">Ro‘yxatga qaytish</Button>
        </CardContent>
      </Card>
    </template>
  </PageContainer>

  <div
    v-if="isCreateOpen"
    class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/45 p-3 dark:bg-black/65"
    role="dialog"
    aria-modal="true"
    @click.self="closeCreateDialog"
  >
    <div class="my-auto w-full max-w-2xl rounded-2xl bg-card shadow-2xl ring-1 ring-foreground/10">
      <div class="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 class="text-base font-semibold">Yangi baholash</h2>
          <p class="mt-1 text-xs text-muted-foreground">Bola va respondentni tanlang, tizim yoshga mos instrumentni tavsiya qiladi.</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Yopish" @click="closeCreateDialog">
          <X class="h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-4 p-5">
        <div class="space-y-2">
          <Label for="assessment-child">Bola</Label>
          <select
            id="assessment-child"
            v-model="createChildId"
            class="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            <option value="" disabled>Ro‘yxatdan bolani tanlang</option>
            <option v-for="child in assessmentChildren" :key="child.id" :value="child.id">
              {{ child.fullName }} · {{ child.applicationNumber }}
            </option>
          </select>
        </div>

        <div v-if="createChild" class="rounded-xl border border-border bg-muted/25 p-3.5">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p class="text-sm font-semibold">{{ createChild.fullName }}</p>
              <p class="mt-1 text-xs text-muted-foreground">{{ createChild.pinfl }} · {{ createChild.region }}, {{ createChild.district }}</p>
            </div>
            <span class="self-start rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium">
              {{ createChild.gestationalWeek }} haftada tug‘ilgan
            </span>
          </div>
          <div class="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
            <div>
              <span class="text-muted-foreground">Tug‘ilgan sana</span>
              <p class="mt-1 font-medium">{{ formatDate(createChild.birthDate) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Xronologik yosh</span>
              <p class="mt-1 font-medium">{{ formatAge(createChronologicalAge) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Tuzatilgan yosh</span>
              <p class="mt-1 font-medium">{{ formatAge(createCorrectedAge) }}</p>
            </div>
            <div>
              <span class="text-muted-foreground">Vakil</span>
              <p class="mt-1 truncate font-medium">{{ createChild.guardian }}</p>
            </div>
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <Label for="assessment-date">Baholash sanasi</Label>
            <Input id="assessment-date" v-model="createDate" type="date" :clearable="false" />
          </div>
          <div class="space-y-2">
            <Label for="assessment-informant">Respondent</Label>
            <select
              id="assessment-informant"
              v-model="createInformant"
              class="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              <option>Onasi</option>
              <option>Otasi</option>
              <option>Buvisi</option>
              <option>Bobosi</option>
              <option>Qonuniy vakili</option>
            </select>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Baholash instrumenti</Label>
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="template in activeAssessmentTemplates"
              :key="template.id"
              type="button"
              :disabled="Boolean(createChild) && !isInstrumentAgeAppropriate(template.instrument, createCorrectedAge)"
              :class="cn(
                'rounded-xl border p-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45',
                createTemplateId === template.id
                  ? 'border-primary bg-primary/[0.06] ring-2 ring-primary/15'
                  : 'border-border hover:border-primary/35',
              )"
              @click="selectCreateTemplate(template)"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold">{{ template.shortName }}</span>
                <span
                  v-if="createChild && recommendedInstrument === template.instrument"
                  class="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
                >
                  Tavsiya
                </span>
              </div>
              <p class="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {{ template.fullName }}
              </p>
              <p class="mt-1 text-xs text-muted-foreground">
                {{ template.ageRange }} · {{ instrumentCatalog[template.instrument].domains.length }} soha
              </p>
            </button>
            <p
              v-if="!activeAssessmentTemplates.length"
              class="sm:col-span-2 rounded-xl border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground"
            >
              Faol so‘rovnoma shabloni mavjud emas.
            </p>
          </div>
          <p
            v-if="instrumentAgeWarning"
            :class="cn(
              'flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs leading-5',
              createCorrectedAge < 2 || createCorrectedAge > 42
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
            )"
          >
            <AlertCircle class="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {{ instrumentAgeWarning }}
          </p>
        </div>

        <p v-if="createError" class="text-xs font-medium text-rose-600">{{ createError }}</p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
        <Button variant="outline" @click="closeCreateDialog">Bekor qilish</Button>
        <Button class="gap-2" :disabled="!canCreateAssessment" @click="startAssessment">
          Baholashni boshlash
          <ArrowRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>

  <div
    v-if="isFinishDialogOpen"
    class="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-4 dark:bg-black/65"
    role="dialog"
    aria-modal="true"
    @click.self="isFinishDialogOpen = false"
  >
    <div class="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl ring-1 ring-foreground/10">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ClipboardCheck class="h-5 w-5" />
      </div>
      <h2 class="mt-4 text-base font-semibold">Baholashni yakunlaysizmi?</h2>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        Javoblar asosida rivojlanish profili hisoblanadi. Qarama-qarshi javoblar bo‘lsa natija tekshiruvga yuboriladi.
      </p>
      <div class="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
        <span>To‘ldirilgan savollar</span>
        <strong>{{ selectedProgress.answered }} / {{ selectedProgress.total }}</strong>
      </div>
      <div class="mt-5 flex justify-end gap-2">
        <Button variant="outline" @click="isFinishDialogOpen = false">Bekor qilish</Button>
        <Button class="gap-2" @click="finalizeAssessment">
          <Check class="h-4 w-4" />
          Yakunlash
        </Button>
      </div>
    </div>
  </div>

  <div
    v-if="isPlanBuilderOpen && selectedRecord"
    class="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/45 p-3 dark:bg-black/65"
    role="dialog"
    aria-modal="true"
    @click.self="isPlanBuilderOpen = false"
  >
    <div class="my-auto w-full max-w-2xl rounded-2xl bg-card shadow-2xl ring-1 ring-foreground/10">
      <div class="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <div class="flex items-center gap-2">
            <Sparkles class="h-4 w-4 text-primary" />
            <h2 class="text-base font-semibold">Individual reja qoralamasi</h2>
          </div>
          <p class="mt-1 text-xs text-muted-foreground">Natijasi eng past sohalardan boshlang‘ich maqsadlar taklif qilindi.</p>
        </div>
        <Button variant="ghost" size="icon" aria-label="Yopish" @click="isPlanBuilderOpen = false">
          <X class="h-4 w-4" />
        </Button>
      </div>

      <div class="space-y-3 p-5">
        <label
          v-for="goal in goalSuggestions"
          :key="goal.id"
          :class="cn(
            'flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
            goal.selected ? 'border-primary/35 bg-primary/[0.045]' : 'border-border hover:bg-muted/25',
          )"
        >
          <input v-model="goal.selected" type="checkbox" class="mt-1 h-4 w-4 accent-[var(--primary)]">
          <span class="min-w-0 flex-1">
            <span class="block text-xs font-semibold text-primary">{{ goal.domainLabel }}</span>
            <span class="mt-1 block text-sm font-medium leading-6">{{ goal.title }}</span>
            <span class="mt-1.5 inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{{ goal.duration }}</span>
          </span>
        </label>
        <p class="rounded-lg bg-muted/45 px-3 py-2.5 text-xs leading-5 text-muted-foreground">
          Maqsadlar reja sahifasida mutaxassis va oila bilan kelishilgan holda aniqlashtiriladi; tizim ularni avtomatik tasdiqlamaydi.
        </p>
      </div>

      <div class="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <span class="text-xs text-muted-foreground">{{ selectedGoalCount }} ta maqsad tanlandi</span>
        <div class="flex gap-2">
          <Button variant="outline" @click="isPlanBuilderOpen = false">Bekor qilish</Button>
          <Button class="gap-2" :disabled="!selectedGoalCount" @click="createIndividualPlan">
            <Target class="h-4 w-4" />
            Rejaga qo‘shish
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
