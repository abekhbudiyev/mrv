<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Clock3, HeartHandshake, Layers3, List, Plus, RotateCcw, Search, UsersRound, X } from 'lucide-vue-next'
import { usePalliativeStore } from '../store'
import { activeEpisode, ageOn, formatDate, REGION_LABELS, STATUS_LABELS, today } from '../domain'
import { initials, nextStep, statusTone } from '../presenters'
import type { ActionResult, CaseStatus, RegionCode } from '../types'
import PalliativeCaseForms from '../components/PalliativeCaseForms.vue'
import type { CaseFormKind } from '../components/PalliativeCaseForms.vue'
import PalliativeCaseWorkspace from '../components/PalliativeCaseWorkspace.vue'
import PalliativeOperations from '../components/PalliativeOperations.vue'
import PalliativeProcess from '../components/PalliativeProcess.vue'
import PalliativeDemoScenarios from '../components/PalliativeDemoScenarios.vue'

const PalliativeGuides = defineAsyncComponent(() => import('../components/PalliativeGuides.vue'))
const PalliativeReferences = defineAsyncComponent(() => import('../components/PalliativeReferences.vue'))

const props = withDefaults(defineProps<{ pageKey: string; caseId?: string }>(), { caseId: '' })
const store = usePalliativeStore()
const router = useRouter()
const route = useRoute()
const search = ref('')
const status = ref<CaseStatus | ''>('')
const region = ref<RegionCode | ''>('')
const formKind = ref<CaseFormKind>('')
const formCaseId = ref('')
const taskId = ref('')
const feedback = ref('')
const feedbackError = ref(false)
const resetting = ref(false)
const scenarioResetVersion = ref(0)
const casesView = computed(() => route.query.view === 'scenarios' ? 'scenarios' : 'registry')
const isScenarioView = computed(() => props.pageKey === 'cases' && casesView.value === 'scenarios')
const current = computed(() => store.getCase(props.caseId))
const guideTopic = computed(() => {
  if (props.pageKey === 'case-detail') {
    const item = current.value
    if (!item) return 'overview'
    if (item.familySupport || ['FOLLOW_UP', 'BEREAVEMENT', 'CLOSED'].includes(item.status)) return 'follow-up'
    if (['INTAKE', 'ASSESSMENT', 'OBSERVATION'].includes(item.status)) return 'intake'
    if (item.status === 'REFERRAL') return 'referral'
    if (['CONSILIUM', 'PAUSED', 'REJECTED'].includes(item.status)) return 'consilium'
    if (item.status === 'APPROVED') return (item.decisions.slice(-1)[0]?.service ?? item.requestedService) === 'MOBILE' ? 'mobile' : 'inpatient'
    return item.status === 'INPATIENT' ? 'inpatient' : item.status === 'MOBILE' ? 'mobile' : 'overview'
  }
  if (props.pageKey === 'cases') return 'intake'
  return ['consilium', 'inpatient', 'mobile', 'equipment', 'reports'].includes(props.pageKey) ? props.pageKey : 'overview'
})
const guideRoute = computed(() => ({ path: '/apps/palliative-care/guides', query: { topic: guideTopic.value } }))
const operationKey = computed(() => ['inpatient', 'mobile', 'equipment', 'reports'].includes(props.pageKey) ? props.pageKey as 'inpatient' | 'mobile' | 'equipment' | 'reports' : null)
const todayVisits = computed(() => store.visits.filter(v => v.scheduledAt.slice(0, 10) === today()).sort((a,b) => a.scheduledAt.localeCompare(b.scheduledAt)))
const pendingStatuses: CaseStatus[] = ['INTAKE', 'ASSESSMENT', 'REFERRAL', 'CONSILIUM', 'APPROVED', 'PAUSED']
const pending = computed(() => store.cases.filter(c => pendingStatuses.includes(c.status)).sort((a,b) => (a.urgency === 'PRIORITY' ? -1 : 1) - (b.urgency === 'PRIORITY' ? -1 : 1) || a.createdAt.localeCompare(b.createdAt)))
const allTasks = computed(() => store.cases.flatMap(c => c.careTasks).filter(task => task.status !== 'CANCELLED'))
const taskRate = computed(() => allTasks.value.length ? Math.round(allTasks.value.filter(t => t.status === 'DONE').length / allTasks.value.length * 100) : 0)
const metrics = computed(() => [
  { label: 'Yordam olayotgan bolalar', value: store.cases.filter(c => activeEpisode(c)).length, detail: `${store.cases.filter(c => c.status === 'INPATIENT').length} statsionar · ${store.cases.filter(c => c.status === 'MOBILE').length} mobil`, icon: HeartHandshake, route: 'cases', color: 'emerald' },
  { label: 'Keyingi harakat kutilmoqda', value: pending.value.length, detail: `${store.cases.filter(c => c.status === 'CONSILIUM').length} ta ish Markaz konsiliumida`, icon: Clock3, route: 'cases?pending=1', color: 'amber' },
  { label: 'Bugungi tashrif va maslahat', value: todayVisits.value.length, detail: `${todayVisits.value.filter(v => v.status === 'COMPLETED').length} bajarilgan · ${todayVisits.value.filter(v => ['PLANNED', 'IN_PROGRESS'].includes(v.status)).length} kutilmoqda`, icon: CalendarDays, route: 'mobile', color: 'blue' },
  { label: 'Individual reja bajarilishi', value: `${taskRate.value}%`, detail: `${allTasks.value.filter(t => t.status === 'DONE').length} / ${allTasks.value.length} yordam vazifasi`, icon: CheckCircle2, route: 'reports', color: 'violet' },
])
const stages: { title: string; statuses: CaseStatus[]; detail: string }[] = [
  { title: 'Aniqlash', statuses: ['INTAKE', 'ASSESSMENT', 'OBSERVATION'], detail: 'Poliklinika' },
  { title: 'Yo‘llanma', statuses: ['REFERRAL'], detail: 'Tibbiy muassasa' },
  { title: 'Konsilium', statuses: ['CONSILIUM', 'PAUSED', 'REJECTED'], detail: 'Markaz' },
  { title: 'Tashkil etish', statuses: ['APPROVED'], detail: 'O‘rin yoki brigada' },
  { title: 'Yordam', statuses: ['INPATIENT', 'MOBILE'], detail: 'Individual reja' },
  { title: 'Kuzatuv', statuses: ['FOLLOW_UP', 'BEREAVEMENT', 'CLOSED'], detail: 'Bola va oila' },
]
const filteredCases = computed(() => {
  const q = search.value.trim().toLocaleLowerCase()
  return store.cases.filter(c => {
    if (props.pageKey === 'consilium' && !['CONSILIUM', 'PAUSED', 'APPROVED', 'REJECTED'].includes(c.status)) return false
    if (route.query.pending === '1' && !pendingStatuses.includes(c.status)) return false
    const stage = Number(route.query.stage)
    if (route.query.stage !== undefined && stages[stage] && !stages[stage]!.statuses.includes(c.status)) return false
    return (!status.value || c.status === status.value) && (!region.value || c.region === region.value) && (!q || [c.childName,c.number,c.guardianName,c.district,c.familyDoctor,c.pinfl ?? '',c.demoScenario?.code ?? '',c.demoScenario?.title ?? '',c.demoScenario?.summary ?? '',...(c.demoScenario?.checkpoints ?? [])].join(' ').toLocaleLowerCase().includes(q))
  })
})
watch(() => props.pageKey, () => { search.value = ''; status.value = ''; region.value = ''; formKind.value = ''; feedback.value = '' })
function openCase(id: string) { router.push(`/apps/palliative-care/cases/${id}`) }
function openForm(kind: CaseFormKind, selectedTask?: string) { formKind.value = kind; formCaseId.value = props.caseId; taskId.value = selectedTask ?? '' }
function showFeedback(message: string, error = false) { feedback.value = message; feedbackError.value = error }
function saved(result: ActionResult, kind: CaseFormKind) {
  formKind.value = ''
  showFeedback(kind === 'decision' ? 'Konsilium qarori saqlandi. Keyingi qadam yangilandi.' : kind === 'referral' ? 'Yo‘llanma saqlandi. To‘liqligini tekshirib, konsiliumga yuborishingiz mumkin.' : 'Ma’lumot saqlandi.')
  if (kind === 'new' && result.id) openCase(result.id)
}
function clearFilters() { search.value = ''; status.value = ''; region.value = ''; scenarioResetVersion.value++; router.replace({ path: route.path, query: isScenarioView.value ? { view: 'scenarios' } : {} }) }
function setCasesView(view: 'registry' | 'scenarios') { router.replace({ path: route.path, query: { ...route.query, view: view === 'scenarios' ? 'scenarios' : undefined } }) }
async function restartDemo() {
  resetting.value = true
  try {
    store.resetDemo()
    formKind.value = ''; formCaseId.value = ''; taskId.value = ''; search.value = ''; status.value = ''; region.value = ''
    await router.push('/apps/palliative-care')
    await nextTick()
    showFeedback('Demo qayta boshlandi. Barcha namunaviy bolalar, xizmatlar va ssenariylar boshlang‘ich holatga qaytdi.')
  } finally { resetting.value = false }
}
</script>

<template>
  <div class="pc-module h-full min-h-0 overflow-y-auto bg-muted/30">
    <div class="mx-auto max-w-[1600px] space-y-5 p-4 pb-12 lg:p-6 xl:p-7">
      <header class="flex flex-wrap items-center justify-between gap-3">
        <span class="rounded-md bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-700 dark:text-amber-300" title="Namunaviy ma’lumotlar. Sahifa yangilanganda boshlang‘ich holat tiklanadi.">Demo</span>
        <div class="flex flex-wrap items-center gap-2">
          <RouterLink v-if="!['guides','process'].includes(pageKey)" :to="guideRoute" class="pc-btn !p-2" aria-label="Qo‘llanma" title="Qo‘llanma"><BookOpen class="h-4 w-4" aria-hidden="true" /></RouterLink>
          <button class="pc-btn !p-2" aria-label="Demoni qayta boshlash" title="Demoni qayta boshlash" :disabled="resetting" @click="restartDemo"><RotateCcw class="h-4 w-4" :class="resetting ? 'animate-spin' : ''" aria-hidden="true" /></button>
          <RouterLink v-if="pageKey === 'dashboard'" to="/apps/palliative-care/cases?view=scenarios" class="pc-btn"><Layers3 class="h-4 w-4" />Demo misollar</RouterLink>
          <button v-if="['dashboard','cases'].includes(pageKey)" class="pc-btn pc-primary" @click="openForm('new')"><Plus class="h-4 w-4" />Yangi bola kartasi</button>
        </div>
      </header>
      <div v-if="feedback" :role="feedbackError ? 'alert' : 'status'" :class="['flex items-start justify-between gap-3 rounded-xl border p-4 text-sm', feedbackError ? 'border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200' : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200']"><span>{{ feedback }}</span><button aria-label="Xabarni yopish" @click="feedback = ''"><X class="h-4 w-4" /></button></div>

      <template v-if="pageKey === 'dashboard'">
        <section aria-label="Asosiy ko‘rsatkichlar" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><RouterLink v-for="metric in metrics" :key="metric.label" :to="`/apps/palliative-care/${metric.route}`" class="pc-metric group"><div class="flex items-start justify-between gap-3"><p class="max-w-[190px] text-sm font-medium leading-5 text-muted-foreground">{{ metric.label }}</p><component :is="metric.icon" class="h-5 w-5 shrink-0 text-primary/70" /></div><p class="mt-5 text-[34px] font-semibold leading-none tracking-tight">{{ metric.value }}</p><div class="mt-4 flex items-center justify-between gap-2"><p class="text-xs text-muted-foreground">{{ metric.detail }}</p><ArrowRight class="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" /></div></RouterLink></section>
        <section class="pc-panel !p-0"><div class="flex flex-wrap items-center justify-between gap-2 px-5 pb-3 pt-5"><h2 class="text-sm font-semibold">Jarayon bosqichlari</h2><RouterLink to="/apps/palliative-care/process" class="text-xs font-medium text-primary">Jarayon sxemasi →</RouterLink></div><div class="grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl bg-border sm:grid-cols-3 xl:grid-cols-6"><RouterLink v-for="(stage, index) in stages" :key="stage.title" :to="{ path: '/apps/palliative-care/cases', query: { stage: index } }" class="group flex items-center gap-3 bg-card p-4 hover:bg-muted/60"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-primary">{{ index + 1 }}</span><div class="min-w-0 flex-1"><p class="text-[13px] font-medium">{{ stage.title }}<span class="ml-1.5 text-primary">{{ store.cases.filter(c => stage.statuses.includes(c.status)).length }}</span></p><p class="mt-1 truncate text-[11px] text-muted-foreground">{{ stage.detail }}</p></div><ChevronRight v-if="index < 5" class="hidden h-3 w-3 shrink-0 text-muted-foreground 2xl:block" /></RouterLink></div></section>
        <div class="grid gap-5 xl:grid-cols-3">
          <section class="pc-panel !p-0 xl:col-span-2"><div class="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5"><div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-amber-500" /><h2 class="text-base font-semibold">E’tibor talab qiladigan ishlar</h2><span class="rounded-md bg-muted px-2 py-0.5 text-xs">{{ pending.length }}</span></div><RouterLink to="/apps/palliative-care/cases" class="text-xs font-medium text-primary">Barcha bolalar →</RouterLink></div>
            <div v-if="!pending.length" class="px-6 py-12 text-center text-sm text-muted-foreground">Hozir kutilayotgan harakatlar yo‘q.</div>
            <button v-for="item in pending.slice(0, 5)" :key="item.id" class="flex w-full items-start gap-3 border-b border-border p-5 text-left last:border-b-0 hover:bg-muted/40" @click="openCase(item.id)"><div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">{{ initials(item.childName) }}</div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><span class="text-sm font-semibold">{{ item.childName }}</span><span :class="['rounded-full px-2 py-0.5 text-[10px] font-medium', statusTone(item.status)]">{{ STATUS_LABELS[item.status] }}</span></div><p class="mt-1 text-sm">{{ nextStep(item).title }}</p><p class="mt-1 text-xs text-muted-foreground">{{ nextStep(item).owner }} · {{ REGION_LABELS[item.region] }}</p></div><ArrowRight class="mt-3 h-4 w-4 shrink-0 text-muted-foreground" /></button>
          </section>
          <aside class="space-y-5"><section class="pc-panel"><div class="flex items-center justify-between"><h2 class="text-base font-semibold">Bugungi tashriflar</h2><CalendarDays class="h-4 w-4 text-muted-foreground" /></div><p class="mt-1 text-xs text-muted-foreground">{{ formatDate(today()) }}</p><div v-for="visit in todayVisits.slice(0, 4)" :key="visit.id" class="mt-5 flex items-start gap-3"><div class="w-12 shrink-0 rounded-lg bg-muted py-2 text-center text-xs font-semibold">{{ visit.scheduledAt.slice(11, 16) }}</div><div class="min-w-0"><button class="text-left text-sm font-medium hover:text-primary" @click="openCase(visit.caseId)">{{ store.getCase(visit.caseId)?.childName ?? 'Bola kartasi' }}</button><p class="mt-1 text-xs text-muted-foreground">{{ visit.type === 'HOME' ? 'Uyga tashrif' : 'Masofaviy maslahat' }} · {{ visit.status === 'COMPLETED' ? 'Bajarilgan' : visit.status === 'IN_PROGRESS' ? 'Jarayonda' : visit.status === 'CANCELLED' ? 'Bekor qilingan' : 'Rejalashtirilgan' }}</p></div></div><p v-if="!todayVisits.length" class="py-8 text-sm text-muted-foreground">Bugun uchun tashrif belgilanmagan.</p><RouterLink to="/apps/palliative-care/mobile" class="pc-btn mt-5 w-full justify-center">Brigadalar jadvali<ArrowRight class="h-4 w-4" /></RouterLink></section>
            <section class="rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/20"><HeartHandshake class="mb-3 h-6 w-6 text-primary" /><h2 class="font-semibold">Oilaga keyingi yordam</h2><p class="mt-2 text-sm leading-6 text-muted-foreground">{{ store.cases.filter(c => c.familySupport?.status === 'ACTIVE').length }} oilaga yordam ko‘rsatilmoqda.</p><RouterLink :to="{ path: '/apps/palliative-care/cases', query: { stage: 5 } }" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Kuzatuvdagi ishlar<ArrowRight class="h-4 w-4" /></RouterLink></section>
          </aside>
        </div>
      </template>

      <template v-else-if="pageKey === 'cases' || pageKey === 'consilium'">
        <div v-if="pageKey === 'cases'" class="flex flex-wrap gap-2" role="group" aria-label="Bolalar ro‘yxati ko‘rinishi">
          <button :aria-pressed="casesView === 'registry'" :class="['pc-btn', casesView === 'registry' ? 'pc-primary' : '']" @click="setCasesView('registry')"><List class="h-4 w-4" aria-hidden="true" />Bolalar reyestri<span class="ml-1 opacity-70">{{ store.cases.length }}</span></button>
          <button :aria-pressed="casesView === 'scenarios'" :class="['pc-btn', casesView === 'scenarios' ? 'pc-primary' : '']" @click="setCasesView('scenarios')"><Layers3 class="h-4 w-4" aria-hidden="true" />Demo ssenariylar<span class="ml-1 opacity-70">{{ store.cases.filter(item => item.demoScenario).length }}</span></button>
        </div>
        <section class="pc-panel !p-0"><div class="flex flex-wrap items-center gap-3 border-b border-border p-4"><label class="relative min-w-[200px] flex-1"><Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input v-model="search" type="search" aria-label="Bola, karta yoki demo ssenariy bo‘yicha qidirish" :placeholder="isScenarioView ? 'Ssenariy, bola yoki sinov qadami…' : 'Bola, vakil yoki karta raqami…'" class="pc-input w-full !pl-10"></label><select v-model="region" aria-label="Viloyat bo‘yicha filtr" class="pc-input"><option value="">Barcha viloyatlar</option><option v-for="(label, code) in REGION_LABELS" :key="code" :value="code">{{ label }}</option></select><select v-model="status" aria-label="Holat bo‘yicha filtr" class="pc-input"><option value="">Barcha holatlar</option><option v-for="(label, code) in STATUS_LABELS" :key="code" :value="code">{{ label }}</option></select><button v-if="search || region || status || route.query.stage !== undefined || route.query.pending === '1'" class="pc-btn" @click="clearFilters"><X class="h-4 w-4" />Tozalash</button></div>
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3"><p class="text-xs text-muted-foreground">{{ isScenarioView ? filteredCases.filter(item => item.demoScenario).length : filteredCases.length }} {{ isScenarioView ? 'ta demo ssenariy' : 'ta bola kartasi' }}<span v-if="route.query.stage !== undefined"> · {{ stages[Number(route.query.stage)]?.title }}</span><span v-if="route.query.pending === '1'"> · Keyingi harakat kutilmoqda</span></p></div>
          <div v-if="isScenarioView" class="p-4 sm:p-5"><PalliativeDemoScenarios :key="scenarioResetVersion" :cases="filteredCases" @open-case="openCase" /></div>
          <template v-else>
          <div class="overflow-x-auto"><table class="pc-table w-full"><thead><tr><th>Bola / karta</th><th>Jarayon holati</th><th>Keyingi harakat va mas’ul</th><th>Hudud</th><th><span class="sr-only">Amal</span></th></tr></thead><tbody><tr v-for="item in filteredCases" :key="item.id"><td><button class="flex items-center gap-3 text-left" @click="openCase(item.id)"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-muted-foreground">{{ initials(item.childName) }}</span><span><span class="block font-semibold hover:text-primary">{{ item.childName }}</span><span class="mt-1 block text-xs text-muted-foreground">{{ item.number }} · {{ ageOn(item.birthDate) }} yosh</span></span></button></td><td><span :class="['inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium', statusTone(item.status)]">{{ STATUS_LABELS[item.status] }}</span></td><td><p class="max-w-[270px] text-[13px] font-medium">{{ nextStep(item).title }}</p><p class="mt-1 max-w-[270px] text-xs text-muted-foreground">{{ nextStep(item).owner }}</p></td><td><p class="text-[13px]">{{ REGION_LABELS[item.region] }}</p><p class="mt-1 text-xs text-muted-foreground">{{ item.district }}</p></td><td><button :aria-label="`${item.childName} kartasini ochish`" class="pc-btn !p-2" @click="openCase(item.id)"><ArrowRight class="h-4 w-4" /></button></td></tr></tbody></table></div>
          <div v-if="!filteredCases.length" class="px-5 py-16 text-center"><UsersRound class="mx-auto h-9 w-9 text-muted-foreground/50" /><p class="mt-3 font-medium">Mos bola kartasi topilmadi</p><p class="mt-2 text-sm text-muted-foreground">Qidiruv yoki filtrlarni o‘zgartiring.</p><button class="pc-btn mt-5" @click="clearFilters">Filtrlarni tozalash</button></div>
          </template>
        </section>
      </template>

      <template v-else-if="pageKey === 'case-detail'"><PalliativeCaseWorkspace v-if="current" :item="current" @form="openForm" @feedback="showFeedback" /><section v-else class="pc-panel py-16 text-center"><h1 class="text-xl font-semibold">Bola kartasi topilmadi</h1><p class="mt-2 text-sm text-muted-foreground">Manzilni tekshiring yoki reyestrdan kerakli kartani tanlang.</p><RouterLink to="/apps/palliative-care/cases" class="pc-btn mt-5">Bolalar reyestriga qaytish</RouterLink></section></template>
      <PalliativeOperations v-else-if="operationKey" :page-key="operationKey" @open-case="openCase" />
      <PalliativeGuides v-else-if="pageKey === 'guides'" />
      <PalliativeReferences v-else-if="pageKey === 'references'" />
      <PalliativeProcess v-else-if="pageKey === 'process'" />
    </div>
    <PalliativeCaseForms :kind="formKind" :case-id="formCaseId" :task-id="taskId" @close="formKind = ''" @done="saved" />
  </div>
</template>

<style scoped>
.pc-panel, .pc-metric { border: 1px solid var(--border); border-radius: 14px; background: var(--card); padding: 22px; }
.pc-metric { transition: box-shadow .2s,border-color .2s; }
.pc-metric:hover { border-color: color-mix(in srgb,var(--primary) 30%,var(--border)); box-shadow: 0 4px 16px #12332806; }
.pc-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; font-size: 13px; font-weight: 500; background: var(--card); }
.pc-btn:hover { background: var(--muted); }
.pc-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.pc-primary { color: var(--primary-foreground); background: var(--primary); border-color: var(--primary); }
.pc-primary:hover { background: var(--primary-hover); }
.pc-input { min-width: 0; border: 1px solid var(--input); border-radius: 8px; padding: 10px 12px; background: var(--card); font-size: 13px; outline: none; }
.pc-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb,var(--primary) 12%,transparent); }
.pc-table { min-width: 840px; text-align: left; }
.pc-table th { padding: 13px 20px; background: color-mix(in srgb,var(--muted) 55%,var(--card)); color: var(--muted-foreground); font-size: 11px; font-weight: 500; }
.pc-table td { padding: 18px 20px; border-top: 1px solid var(--border); font-size: 13px; vertical-align: middle; }
.pc-table tbody tr:hover { background: color-mix(in srgb,var(--muted) 40%,var(--card)); }
@media (max-width: 600px) { .pc-module { height: auto; overflow: visible; } .pc-metric { padding: 18px; } }
</style>
