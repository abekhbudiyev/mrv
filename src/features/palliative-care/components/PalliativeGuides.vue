<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowRight, Ban, BookOpen, Check, CheckSquare, ChevronDown, ChevronRight, CircleCheck, CircleX, Clock3, Download, FileText, GitBranch, HelpCircle, Layers3, ListOrdered, Maximize2, Search, Table2, TextCursorInput, UsersRound, Wrench, X } from 'lucide-vue-next'
import { guideRoles, guideTerms, guideTopics } from '../guides'
import type { GuideFlow, GuideTone, GuideTopic, GuideView } from '../guides-types'
import { guideToneClasses, guideToneLabels } from '../guide-semantics'
import { downloadGuideMarkdown, downloadGuidesMarkdown } from '../guide-exports'
import { usePalliativeStore } from '../store'
import { STATUS_LABELS } from '../domain'
import { statusTone } from '../presenters'
import PalliativeGuideFlowchart from './PalliativeGuideFlowchart.vue'

const route = useRoute()
const router = useRouter()
const store = usePalliativeStore()
const search = ref('')
const role = ref('')
const libraryExpanded = ref(false)
const checked = ref<Record<string, boolean>>({})
const fieldSearch = ref('')
const flowDialog = ref<HTMLDialogElement>()
const expandedFlow = ref(false)
const toneIcons: Record<GuideTone, typeof CircleCheck> = { action: ArrowRight, success: CircleCheck, rejected: CircleX, cancelled: Ban, waiting: Clock3 }
const formats = [
  { id: 'read', title: 'Tushuntirish', icon: BookOpen },
  { id: 'steps', title: 'Qadamlar', icon: ListOrdered },
  { id: 'flowchart', title: 'Flowchart', icon: GitBranch },
  { id: 'fields', title: 'Maydonlar', icon: TextCursorInput },
  { id: 'rules', title: 'Qoidalar jadvali', icon: Table2 },
  { id: 'troubleshooting', title: 'Xatolar va yechimlar', icon: Wrench },
  { id: 'faq', title: 'Savol-javob', icon: HelpCircle },
  { id: 'examples', title: 'Demo misollar', icon: Layers3 },
] as const
const categories = [
  { id: 'start', title: 'Jarayon va qabul' },
  { id: 'care', title: 'Yordamni ko‘rsatish' },
  { id: 'management', title: 'Hisob va foydalanish' },
] as const
const selectedId = computed(() => typeof route.query.topic === 'string' ? route.query.topic : 'overview')
const selected = computed(() => guideTopics.find(topic => topic.id === selectedId.value))
const view = computed<GuideView>(() => formats.some(format => format.id === route.query.view) ? route.query.view as GuideView : 'read')
const normalize = (value: string) => value.toLocaleLowerCase().normalize('NFKC').replace(/[ʻ‘’'`]/g, '')
const searchableText = (topic: GuideTopic) => [topic.title, topic.summary, ...topic.sections.flatMap(section => [section.title, ...section.paragraphs]), ...topic.steps.flatMap(step => [step.title, step.actor, step.action, step.result]), ...topic.rules.flatMap(rule => [rule.condition, rule.action, rule.owner, rule.basis]), ...topic.faq.flatMap(faq => [faq.question, faq.answer]), ...topic.checklist, ...(topic.detail?.prerequisites ?? []), ...(topic.detail?.outcomes ?? []), ...(topic.detail?.fields.flatMap(field => Object.values(field)) ?? []), ...(topic.detail?.troubleshooting.flatMap(issue => [issue.problem, issue.reason, issue.solution]) ?? []), ...(topic.detail?.flows.flatMap(flow => [flow.title, flow.description, ...flow.walkthrough]) ?? [])].join(' ')
const filteredTopics = computed(() => {
  const query = normalize(search.value.trim())
  return guideTopics.filter(topic => (!role.value || topic.roles.includes(role.value)) && (!query || normalize(searchableText(topic)).includes(query)))
})
const examples = computed(() => selected.value ? store.cases.filter(item => selected.value!.scenarioCodes.includes(item.demoScenario?.code ?? '')).sort((a,b) => a.number.localeCompare(b.number)) : [])
const roleNames = computed(() => selected.value?.roles.map(id => guideRoles.find(entry => entry.id === id)?.title).filter(Boolean) ?? [])
const completedChecks = computed(() => selected.value?.checklist.filter((_entry, index) => checked.value[`${selected.value!.id}-${index}`]).length ?? 0)
const sourceFile = '/guides/316-son-buyruq-31-07-2026.pdf'
const flowChoices = computed<GuideFlow[]>(() => selected.value ? [
  ...(selected.value.detail?.flows ?? []),
  { id: 'summary', title: 'Qisqa sxema', description: selected.value.summary, definition: selected.value.flowchart, walkthrough: selected.value.steps.map(step => `${step.actor}: ${step.action} Natija: ${step.result}`) },
] : [])
const selectedFlow = computed(() => flowChoices.value.find(flow => flow.id === route.query.flow) ?? flowChoices.value[0])
const fieldGroups = computed(() => {
  const fields = (selected.value?.detail?.fields ?? []).filter(field => normalize(Object.values(field).join(' ')).includes(normalize(fieldSearch.value.trim())))
  return [...new Set(fields.map(field => field.location))].map(location => ({ location, fields: fields.filter(field => field.location === location) }))
})
const relatedTopics = computed(() => guideTopics.filter(topic => selected.value?.detail?.relatedTopics.includes(topic.id)))
const exportContext = computed(() => ({
  roleLabels: Object.fromEntries(guideRoles.map(entry => [entry.id, entry.title])),
  scenarioLabels: Object.fromEntries(store.cases.filter(item => item.demoScenario).map(item => [item.demoScenario!.code, `${item.demoScenario!.title} — ${item.childName}`])),
  scenarioDetails: Object.fromEntries(store.cases.filter(item => item.demoScenario).map(item => [item.demoScenario!.code, { summary: item.demoScenario!.summary, checkpoints: item.demoScenario!.checkpoints }])),
  baseUrl: window.location.origin,
  topicLabels: Object.fromEntries(guideTopics.map(topic => [topic.id, topic.title])),
  glossary: guideTerms,
  roles: guideRoles,
}))

function chooseTopic(id: string, collapseLibrary = true) {
  if (collapseLibrary) libraryExpanded.value = false
  router.replace({ path: '/apps/palliative-care/guides', query: { ...route.query, topic: id, flow: undefined, view: view.value === 'read' ? undefined : view.value } })
}
function chooseView(id: GuideView) {
  router.replace({ path: route.path, query: { ...route.query, topic: selectedId.value, view: id === 'read' ? undefined : id } })
}
function clearSearch() { search.value = ''; role.value = '' }
function chooseFlow(event: Event) { router.replace({ query: { ...route.query, flow: (event.target as HTMLSelectElement).value } }) }
async function openFlow() { expandedFlow.value = true; await nextTick(); flowDialog.value?.showModal() }
function closeFlow() { flowDialog.value?.close(); expandedFlow.value = false }
watch(selectedId, () => { fieldSearch.value = ''; closeFlow() })
watch(view, closeFlow)
function clearChecklist() {
  selected.value?.checklist.forEach((_item,index) => { delete checked.value[`${selected.value!.id}-${index}`] })
}
watch([search, role], () => {
  if (filteredTopics.value.length && !filteredTopics.value.some(topic => topic.id === selectedId.value)) chooseTopic(filteredTopics.value[0]!.id, false)
})
</script>

<template>
  <div class="guide-center space-y-5">
    <div class="flex flex-wrap justify-end gap-2" aria-label="Qo‘llanma fayllari"><a :href="sourceFile" target="_blank" rel="noopener" class="guide-button"><FileText class="h-4 w-4" />316-son buyruq · PDF</a><button class="guide-button" @click="downloadGuidesMarkdown(guideTopics, exportContext)"><Download class="h-4 w-4" />Barcha qo‘llanmalar (.md)</button></div>

    <div class="grid items-start gap-5 md:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="guide-library min-w-0 rounded-xl border border-border bg-card p-4">
        <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="text-sm font-semibold">Mavzular</h2><span class="text-xs text-muted-foreground" role="status">{{ filteredTopics.length }}</span><button :aria-expanded="libraryExpanded" aria-controls="guide-library-controls" class="inline-flex items-center gap-1.5 text-xs font-medium text-primary md:hidden" @click="libraryExpanded = !libraryExpanded">{{ libraryExpanded ? 'Mavzularni yopish' : 'Mavzuni tanlash' }}<ChevronDown class="h-4 w-4" :class="libraryExpanded ? 'rotate-180' : ''" /></button></div>
        <div id="guide-library-controls" :class="['mt-4', libraryExpanded ? '' : 'hidden md:block']">
        <label class="relative block"><Search class="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input v-model="search" class="guide-input w-full !pl-9" type="search" placeholder="Mavzu yoki savol izlash…" aria-label="Qo‘llanmalardan qidirish"></label>
        <label class="mt-3 block"><span class="mb-1.5 block text-xs font-medium text-muted-foreground">Kim uchun</span><select v-model="role" class="guide-input w-full" aria-label="Qo‘llanmani rol bo‘yicha tanlash"><option value="">Barcha xodimlar</option><option v-for="entry in guideRoles" :key="entry.id" :value="entry.id">{{ entry.title }}</option></select></label>
        <div v-if="search || role" class="mt-3 flex justify-end text-xs"><button class="inline-flex items-center gap-1 font-medium text-primary" @click="clearSearch"><X class="h-3 w-3" />Tozalash</button></div>
        <nav aria-label="Qo‘llanma mavzulari" class="mt-5 space-y-5">
          <template v-for="category in categories" :key="category.id">
            <div v-if="filteredTopics.some(topic => topic.category === category.id)">
              <p class="mb-2 px-2 text-xs font-semibold text-muted-foreground">{{ category.title }}</p>
              <button v-for="topic in filteredTopics.filter(entry => entry.category === category.id)" :key="topic.id" :aria-current="selectedId === topic.id ? 'page' : undefined" :class="['guide-topic', selectedId === topic.id ? 'guide-topic-active' : '']" @click="chooseTopic(topic.id)"><span>{{ topic.title }}</span><ChevronRight class="h-3.5 w-3.5 shrink-0" /></button>
            </div>
          </template>
        </nav>
        <p v-if="!filteredTopics.length" class="py-6 text-sm leading-6 text-muted-foreground">Mos mavzu topilmadi. Boshqa so‘z yoki rolni tanlang.</p>
        <details class="mt-5 border-t border-border pt-4"><summary class="cursor-pointer text-xs font-medium text-primary">Rollar va mas’uliyatlar</summary><dl class="mt-4 space-y-4"><div v-for="entry in guideRoles" :key="entry.id"><dt class="text-xs font-semibold">{{ entry.title }}</dt><dd class="mt-1 text-xs leading-5 text-muted-foreground">{{ entry.description }}</dd></div></dl></details>
        </div>
      </aside>

      <section v-if="selected && filteredTopics.length" class="guide-content min-w-0 space-y-5" :aria-label="selected.title">
        <header class="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div class="flex flex-col items-start justify-between gap-4 sm:flex-row"><div class="min-w-0 flex-1"><h2 class="text-xl font-semibold tracking-tight sm:text-2xl">{{ selected.title }}</h2></div><button class="guide-button" @click="downloadGuideMarkdown(selected, exportContext)"><Download class="h-4 w-4" />Matnni yuklash (.md)</button></div>
          <p class="mt-3 text-sm leading-7 text-muted-foreground">{{ selected.summary }}</p>
          <p class="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><UsersRound class="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{{ roleNames.join(' · ') }}</span></p>
          <div class="mt-5 flex flex-wrap gap-2" role="group" aria-label="Qo‘llanma formati"><button v-for="format in formats" :key="format.id" :aria-pressed="view === format.id" :class="['guide-format', view === format.id ? 'guide-format-active' : '']" @click="chooseView(format.id)"><component :is="format.icon" class="h-4 w-4" />{{ format.title }}</button></div>
        </header>

        <div v-if="view === 'read'" :key="selected.id" class="space-y-5">
          <nav class="guide-surface" aria-label="Mavzu mundarijasi"><h3 class="text-sm font-semibold">Mundarija</h3><ol class="mt-4 grid gap-3 sm:grid-cols-2"><li v-for="(section,index) in selected.sections" :key="section.title"><a :href="`#guide-${selected.id}-${index}`" class="text-sm leading-6 text-primary hover:underline">{{ index + 1 }}. {{ section.title }}</a></li></ol></nav>
          <section v-if="selected.detail?.prerequisites.length" class="guide-surface"><h3 class="text-base font-semibold">Boshlashdan oldin</h3><ul class="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground"><li v-for="item in selected.detail.prerequisites" :key="item">{{ item }}</li></ul></section>
          <article class="guide-surface space-y-8"><section v-for="(section,sectionIndex) in selected.sections" :id="`guide-${selected.id}-${sectionIndex}`" :key="section.title" class="scroll-mt-5"><h3 class="text-base font-semibold">{{ section.title }}</h3><p v-for="(paragraph,index) in section.paragraphs" :key="index" class="mt-3 text-sm leading-7 text-muted-foreground">{{ paragraph }}</p></section></article>
          <section v-if="selected.detail?.outcomes.length" class="guide-surface"><h3 class="text-base font-semibold">Yakunida nima tekshiriladi?</h3><ul class="mt-4 space-y-3"><li v-for="item in selected.detail.outcomes" :key="item" class="flex gap-3 text-sm leading-7"><Check class="mt-1 h-4 w-4 shrink-0 text-primary" /><span>{{ item }}</span></li></ul></section>
          <details class="guide-surface"><summary class="flex cursor-pointer items-center gap-2 text-sm font-semibold"><BookOpen class="h-4 w-4 text-primary" />Atamalar lug‘ati</summary><dl class="mt-5 grid gap-5 sm:grid-cols-2"><div v-for="entry in guideTerms" :key="entry.term"><dt class="text-sm font-semibold">{{ entry.term }}</dt><dd class="mt-2 text-sm leading-6 text-muted-foreground">{{ entry.description }}</dd></div></dl></details>
        </div>

        <div v-else-if="view === 'steps'" :key="selected.id" class="space-y-5">
          <section class="guide-surface" aria-label="Amallar ketma-ketligi"><ol class="space-y-6"><li v-for="(step,index) in selected.steps" :key="step.title" class="flex gap-3 sm:gap-4"><span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">{{ index + 1 }}</span><div class="min-w-0 flex-1 border-b border-border pb-6"><h4 class="text-sm font-semibold">{{ step.title }}</h4><p class="mt-1.5 text-xs font-medium text-primary">{{ step.actor }}</p><p class="mt-3 text-sm leading-7 text-muted-foreground">{{ step.action }}</p><p class="mt-3 flex items-start gap-2 text-sm leading-6"><Check class="mt-1 h-4 w-4 shrink-0 text-primary" /><span><strong class="font-medium">Natija:</strong> {{ step.result }}</span></p><RouterLink v-if="step.route" :to="step.route" class="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-primary">Tegishli bo‘limni ochish<ArrowRight class="h-3.5 w-3.5" /></RouterLink></div></li></ol></section>
          <section class="guide-surface"><div class="flex flex-wrap items-center justify-between gap-3"><h3 class="flex items-center gap-2 text-base font-semibold"><CheckSquare class="h-4 w-4 text-primary" />Tekshiruv ro‘yxati</h3><span class="text-xs text-muted-foreground" role="status">{{ completedChecks }} / {{ selected.checklist.length }} belgilangan</span></div><p class="mt-2 text-xs leading-5 text-muted-foreground">Belgilar bola kartasidagi xizmat natijasini o‘zgartirmaydi.</p><div class="mt-4 space-y-2"><label v-for="(item,index) in selected.checklist" :key="`${selected.id}-${index}`" class="flex cursor-pointer items-start gap-3 rounded-lg p-2 text-sm leading-6 hover:bg-muted/60"><input v-model="checked[`${selected.id}-${index}`]" type="checkbox" class="mt-1 h-4 w-4 shrink-0 accent-emerald-700"><span>{{ item }}</span></label></div><button v-if="completedChecks" class="mt-4 text-xs font-medium text-primary" @click="clearChecklist">Belgilarni tozalash</button></section>
        </div>

        <div v-else-if="view === 'flowchart'" class="space-y-5">
          <template v-if="selectedFlow">
            <div class="guide-surface"><div class="flex flex-wrap items-end justify-between gap-3"><label class="min-w-0 flex-1"><span class="mb-2 block text-xs font-medium text-muted-foreground">Sxema</span><select class="guide-input w-full" :value="selectedFlow.id" aria-label="Jarayon sxemasini tanlash" @change="chooseFlow"><option v-for="flow in flowChoices" :key="flow.id" :value="flow.id">{{ flow.title }}</option></select></label><button class="guide-button" @click="openFlow"><Maximize2 class="h-4 w-4" />Katta oynada ochish</button></div><p class="mt-4 text-sm leading-7 text-muted-foreground">{{ selectedFlow.description }}</p><div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground" aria-label="Sxema belgilari"><span>▭ Amal yoki natija</span><span>◇ Shart yoki qaror</span><span>→ Keyingi yo‘nalish</span></div></div>
            <PalliativeGuideFlowchart :key="`${selected.id}-${selectedFlow.id}`" :definition="selectedFlow.definition" :title="`${selected.title} — ${selectedFlow.title}`" :description="selectedFlow.description" />
            <details :key="`explanation-${selected.id}-${selectedFlow.id}`" class="guide-surface" open><summary class="cursor-pointer text-sm font-semibold">Bosqichlar va tarmoqlar izohi</summary><ol class="mt-4 list-decimal space-y-4 pl-5"><li v-for="(explanation,index) in selectedFlow.walkthrough" :key="index" class="text-sm leading-7 text-muted-foreground">{{ explanation }}</li></ol></details>
          </template>
        </div>

        <div v-else-if="view === 'fields'" class="space-y-5">
          <label class="relative block"><Search class="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input v-model="fieldSearch" type="search" aria-label="Maydonlardan qidirish" placeholder="Maydon nomi, sharti yoki namunasi…" class="guide-input w-full !pl-9" /></label>
          <section v-for="group in fieldGroups" :key="group.location" class="guide-surface"><h3 class="border-b border-border pb-4 text-base font-semibold">{{ group.location }}</h3><div class="divide-y divide-border"><article v-for="(field,index) in group.fields" :key="`${field.name}-${index}`" class="py-5 last:pb-0"><div class="flex flex-wrap items-start justify-between gap-2"><h4 class="text-sm font-semibold">{{ field.name }}</h4><span class="rounded-md bg-muted px-2.5 py-1 text-xs leading-5 text-muted-foreground">{{ field.requirement }}</span></div><p class="mt-3 text-sm leading-7 text-muted-foreground">{{ field.meaning }}</p><p class="mt-3 rounded-lg bg-muted/60 px-4 py-3 text-sm leading-6"><strong class="font-medium">Namuna:</strong> {{ field.example }}</p></article></div></section>
          <p v-if="!fieldGroups.length" class="guide-surface text-sm text-muted-foreground">Mos maydon topilmadi. Qidiruv so‘zini o‘zgartiring.</p>
        </div>

        <section v-else-if="view === 'troubleshooting'" :key="selected.id" class="guide-surface" aria-label="Xatolar va ularning yechimlari"><details v-for="(issue,index) in selected.detail?.troubleshooting ?? []" :key="index" :open="index === 0" :data-semantic-tone="issue.tone ?? 'action'" class="border-t border-border py-5 first:border-t-0 first:pt-0"><summary class="cursor-pointer text-sm font-semibold leading-6"><span :class="['mb-2 mr-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium leading-5', guideToneClasses[issue.tone ?? 'action']]"><component :is="toneIcons[issue.tone ?? 'action']" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{{ guideToneLabels[issue.tone ?? 'action'] }}</span><span class="block">{{ issue.problem }}</span></summary><dl class="mt-4 space-y-4 text-sm leading-7"><div><dt class="font-medium">Sabab</dt><dd class="mt-1 text-muted-foreground">{{ issue.reason }}</dd></div><div><dt class="font-medium">Yechim</dt><dd class="mt-1 text-muted-foreground">{{ issue.solution }}</dd></div></dl></details></section>

        <section v-else-if="view === 'rules'" class="guide-surface !p-0"><div class="overflow-x-auto"><table class="guide-table" :aria-label="`${selected.title}: qoidalar`"><thead><tr><th>Holat / shart</th><th>Amal va natija</th><th>Mas’ul</th><th>Asos</th></tr></thead><tbody><tr v-for="(rule,index) in selected.rules" :key="index" :data-semantic-tone="rule.tone ?? 'action'"><th scope="row"><span :class="['mb-3 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium leading-5', guideToneClasses[rule.tone ?? 'action']]"><component :is="toneIcons[rule.tone ?? 'action']" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{{ guideToneLabels[rule.tone ?? 'action'] }}</span><span class="block">{{ rule.condition }}</span></th><td>{{ rule.action }}</td><td>{{ rule.owner }}</td><td>{{ rule.basis }}</td></tr></tbody></table></div></section>

        <section v-else-if="view === 'faq'" :key="selected.id" class="guide-surface" aria-label="Savollar va javoblar"><details v-for="(faq,index) in selected.faq" :key="faq.question" :open="index === 0" class="border-t border-border py-4 first:border-t-0 first:pt-0"><summary class="cursor-pointer pr-3 text-sm font-semibold leading-6">{{ faq.question }}</summary><p class="mt-3 text-sm leading-7 text-muted-foreground">{{ faq.answer }}</p></details></section>

        <section v-else class="guide-surface" aria-label="Mavzuga oid demo misollar"><div class="flex justify-end"><RouterLink to="/apps/palliative-care/cases?view=scenarios" class="inline-flex items-center gap-2 text-xs font-semibold text-primary">Barcha ssenariylar<ArrowRight class="h-3.5 w-3.5" /></RouterLink></div><div class="mt-5 grid gap-4 xl:grid-cols-2"><article v-for="item in examples" :key="item.id" class="min-w-0 rounded-xl border border-border p-4"><div class="flex flex-wrap items-center justify-between gap-2"><span class="text-xs text-muted-foreground">Misol {{ Number(item.number.slice(-4)) }}</span><span :class="['rounded-full px-2.5 py-1 text-xs font-medium', statusTone(item.status)]">{{ STATUS_LABELS[item.status] }}</span></div><h4 class="mt-3 text-sm font-semibold">{{ item.demoScenario?.title }}</h4><p class="mt-2 text-sm leading-6 text-muted-foreground">{{ item.demoScenario?.summary }}</p><details v-if="item.demoScenario?.checkpoints.length" class="mt-4 rounded-lg bg-muted/50 p-3"><summary class="cursor-pointer text-xs font-semibold">Ushbu misolda tekshiring</summary><ol class="mt-3 list-decimal space-y-3 pl-4 text-xs leading-6 text-muted-foreground"><li v-for="checkpoint in item.demoScenario.checkpoints" :key="checkpoint">{{ checkpoint }}</li></ol></details><RouterLink :to="`/apps/palliative-care/cases/${item.id}`" class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">{{ item.childName }}<ArrowRight class="h-4 w-4" /></RouterLink></article></div><p v-if="!examples.length" class="mt-5 text-sm text-muted-foreground">Bu mavzu umumiy foydalanish tartibini tushuntiradi. Barcha ssenariylar orqali amallarni sinashingiz mumkin.</p></section>

        <nav v-if="relatedTopics.length" class="guide-surface" aria-label="Bog‘liq qo‘llanmalar"><h3 class="text-sm font-semibold">Keyingi yoki bog‘liq mavzular</h3><div class="mt-4 flex flex-wrap gap-2"><button v-for="topic in relatedTopics" :key="topic.id" class="guide-button text-primary" @click="clearSearch(); chooseTopic(topic.id)">{{ topic.title }}<ArrowRight class="h-3.5 w-3.5" /></button></div></nav>
        <footer class="rounded-xl border border-border bg-card p-5"><h3 class="text-xs font-semibold text-muted-foreground">Manbalar</h3><ul class="mt-3 space-y-2"><li v-for="(source,index) in selected.sources" :key="index" class="text-xs leading-6"><a v-if="source.page" :href="`${sourceFile}#page=${source.page}`" target="_blank" rel="noopener" class="inline-flex items-start gap-2 text-primary hover:underline"><FileText class="mt-1 h-3.5 w-3.5 shrink-0" />{{ source.label }} · PDF {{ source.page }}-bet</a><span v-else class="text-muted-foreground">{{ source.label }}</span></li></ul></footer>
      </section>

      <section v-else class="guide-surface py-14 text-center"><Search class="mx-auto h-8 w-8 text-muted-foreground" /><h2 class="mt-4 text-lg font-semibold">{{ selected ? 'Qidiruvga mos qo‘llanma topilmadi' : 'Qo‘llanma mavzusi topilmadi' }}</h2><p class="mt-2 text-sm leading-6 text-muted-foreground">{{ selected ? 'Qidiruvni yoki rol filtrini o‘zgartiring.' : 'Mavzular ro‘yxatidan tanlang.' }}</p><button class="guide-button mt-5" @click="clearSearch(); chooseTopic('overview')">Umumiy jarayonni ochish</button></section>
    </div>
    <dialog ref="flowDialog" class="guide-flow-dialog" :aria-label="selectedFlow?.title" @cancel.prevent="closeFlow" @click="event => event.target === flowDialog && closeFlow()"><template v-if="expandedFlow && selectedFlow && selected"><header class="flex items-start justify-between gap-4 border-b border-border p-4"><div><h2 class="font-semibold">{{ selectedFlow.title }}</h2><p class="mt-1 text-xs text-muted-foreground">{{ selected.title }}</p></div><button class="guide-button !p-2" aria-label="Katta sxemani yopish" @click="closeFlow"><X class="h-5 w-5" /></button></header><div class="p-3"><PalliativeGuideFlowchart :definition="selectedFlow.definition" :title="`${selected.title} — ${selectedFlow.title}`" :description="selectedFlow.description" /></div></template></dialog>
  </div>
</template>

<style scoped>
.guide-surface{border:1px solid var(--border);border-radius:12px;background:var(--card);padding:24px;}
.guide-flow-dialog{margin:auto;padding:0;width:min(1600px,calc(100vw - 24px));height:calc(100dvh - 24px);max-width:none;max-height:calc(100dvh - 24px);overflow:auto;border:1px solid var(--border);border-radius:14px;background:var(--card);color:var(--foreground);}
.guide-flow-dialog[open]{display:flex;flex-direction:column;}
.guide-flow-dialog>header{flex-shrink:0;}
.guide-flow-dialog>div{display:flex;flex:1;flex-direction:column;min-height:0;}
.guide-flow-dialog :deep(.guide-flowchart){display:flex;flex:1;flex-direction:column;min-height:0;}
.guide-flow-dialog :deep(.guide-flowchart>:not(.flow-viewport)){flex-shrink:0;}
.guide-flow-dialog::backdrop{background:#142e2ca0;backdrop-filter:blur(3px);}
.guide-flow-dialog :deep(.flow-viewport){flex:1;height:auto;max-height:none;min-height:120px;}
.guide-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;flex-shrink:0;border:1px solid var(--border);border-radius:8px;background:var(--card);padding:9px 12px;font-size:12px;line-height:20px;font-weight:500;}
.guide-button:hover{background:var(--muted);}
.guide-input{min-width:0;border:1px solid var(--input);border-radius:8px;background:var(--background);color:var(--foreground);padding:10px 12px;font-size:13px;line-height:20px;}
.guide-topic{display:flex;width:100%;align-items:center;justify-content:space-between;gap:8px;border-radius:8px;padding:10px 9px;text-align:left;font-size:13px;line-height:20px;color:var(--muted-foreground);}
.guide-topic:hover{background:var(--muted);color:var(--foreground);}
.guide-topic-active{background:color-mix(in srgb,var(--primary) 9%,var(--card));color:var(--primary);font-weight:600;}
.guide-format{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:12px;line-height:18px;color:var(--muted-foreground);}
.guide-format:hover{background:var(--muted);}
.guide-format-active{background:var(--primary);border-color:var(--primary);color:var(--primary-foreground);}
.guide-format-active:hover{background:var(--primary-hover);}
.guide-table{width:100%;min-width:590px;border-collapse:collapse;text-align:left;font-size:13px;line-height:1.8;}
.guide-table th,.guide-table td{padding:16px;border-top:1px solid var(--border);vertical-align:top;overflow-wrap:anywhere;}
.guide-table thead{background:var(--muted);font-size:12px;color:var(--muted-foreground);}
.guide-table thead th{font-weight:500;}
.guide-table tbody th{width:23%;font-weight:600;}
.guide-table td:nth-child(2){width:40%;}
.guide-table td:nth-child(3),.guide-table td:nth-child(4){font-size:12px;color:var(--muted-foreground);}
.guide-center button:focus-visible,.guide-center a:focus-visible,.guide-center summary:focus-visible,.guide-center input:focus-visible,.guide-center select:focus-visible{outline:2px solid var(--primary);outline-offset:3px;}
@media(max-width:600px){.guide-surface{padding:18px;}.guide-input{font-size:16px;}.guide-library nav{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;}.guide-library nav>div{min-width:0;margin:0;}.guide-topic{padding:9px 5px;}}
</style>
