<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, Check, ChevronDown, Layers3, Search } from 'lucide-vue-next'
import { REGION_LABELS, STATUS_LABELS } from '../domain'
import { initials, nextStep, statusTone } from '../presenters'
import type { CaseStatus, PalliativeCase } from '../types'

const props = withDefaults(defineProps<{ cases: PalliativeCase[]; compact?: boolean }>(), { compact: false })
const emit = defineEmits<{ 'open-case': [id: string] }>()
const selectedGroup = ref('ALL')
const groups: { key: string; title: string; statuses: CaseStatus[] }[] = [
  { key: 'ASSESSMENT', title: 'Aniqlash va baholash', statuses: ['INTAKE', 'ASSESSMENT', 'OBSERVATION'] },
  { key: 'REFERRAL', title: 'Yo‘llanma', statuses: ['REFERRAL'] },
  { key: 'CONSILIUM', title: 'Konsilium', statuses: ['CONSILIUM', 'PAUSED', 'REJECTED'] },
  { key: 'SETUP', title: 'Yordamni tashkil etish', statuses: ['APPROVED'] },
  { key: 'SERVICE', title: 'Xizmat ko‘rsatish', statuses: ['INPATIENT', 'MOBILE'] },
  { key: 'FOLLOWUP', title: 'Kuzatuv va oila', statuses: ['FOLLOW_UP', 'BEREAVEMENT', 'CLOSED'] },
]
const statusOrder: CaseStatus[] = ['INTAKE', 'ASSESSMENT', 'OBSERVATION', 'REFERRAL', 'CONSILIUM', 'PAUSED', 'REJECTED', 'APPROVED', 'INPATIENT', 'MOBILE', 'FOLLOW_UP', 'BEREAVEMENT', 'CLOSED']
const scenarios = computed(() => props.cases.filter(item => item.demoScenario).sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || Number(a.number.slice(-4)) - Number(b.number.slice(-4))))
const groupTabs = computed(() => [
  { key: 'ALL', title: 'Barchasi', count: scenarios.value.length },
  ...groups.map(group => ({ ...group, count: scenarios.value.filter(item => group.statuses.includes(item.status)).length })),
])
const visibleScenarios = computed(() => {
  if (props.compact) {
    const representatives = groups.map(group => scenarios.value.find(item => group.statuses.includes(item.status))).filter((item): item is PalliativeCase => Boolean(item))
    return [...representatives, ...scenarios.value.filter(item => !representatives.some(chosen => chosen.id === item.id))].slice(0, 6)
  }
  const group = groups.find(item => item.key === selectedGroup.value)
  return group ? scenarios.value.filter(item => group.statuses.includes(item.status)) : scenarios.value
})
</script>

<template>
  <section :class="['demo-explorer', compact ? 'rounded-2xl border border-border bg-card p-5 sm:p-6' : '']" aria-label="Demo ssenariylar">
    <header v-if="compact" class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2.5">
          <Layers3 class="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 class="text-base font-semibold">Demo ssenariylar</h2>
          <span class="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{{ scenarios.length }}</span>
        </div>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {{ compact ? 'Jarayonni turli vaziyatdagi bolalar misolida sinab ko‘ring.' : 'Ssenariy boshlang‘ich vaziyatni tushuntiradi. Kartani ochib amallarni bajaring — joriy holat o‘zgarib boradi.' }}
        </p>
      </div>
      <RouterLink v-if="compact" :to="{ path: '/apps/palliative-care/cases', query: { view: 'scenarios' } }" class="demo-link">
        Barcha ssenariylar<ArrowRight class="h-4 w-4" aria-hidden="true" />
      </RouterLink>
    </header>

    <div v-if="!compact" class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="group" aria-label="Ssenariylarni joriy bosqich bo‘yicha filtrlash">
      <button
        v-for="group in groupTabs"
        :key="group.key"
        :aria-pressed="selectedGroup === group.key"
        :class="['demo-group', selectedGroup === group.key ? 'demo-group-active' : '']"
        @click="selectedGroup = group.key"
      >
        {{ group.title }}<span class="ml-1.5 opacity-70">{{ group.count }}</span>
      </button>
    </div>

    <div class="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="item in visibleScenarios" :key="item.id" class="demo-card">
        <div class="flex items-start justify-between gap-3">
          <span class="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">Misol {{ Number(item.number.slice(-4)) }}</span>
          <span :class="['rounded-full px-2.5 py-1 text-[10px] font-medium', statusTone(item.status)]">{{ STATUS_LABELS[item.status] }}</span>
        </div>
        <button class="demo-title mt-4 text-left" @click="emit('open-case', item.id)">{{ item.demoScenario?.title }}</button>
        <p class="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">{{ item.demoScenario?.summary }}</p>

        <details v-if="!compact && item.demoScenario?.checkpoints.length" class="demo-checkpoints mt-4">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg bg-muted/70 px-3 py-2.5 text-xs font-medium">
            Ko‘rib chiqiladigan amallar
            <ChevronDown class="demo-chevron h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </summary>
          <ol class="space-y-3 px-3 py-4">
            <li v-for="(checkpoint, index) in item.demoScenario.checkpoints" :key="index" class="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground">
              <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[10px] font-semibold text-primary">{{ index + 1 }}</span>
              {{ checkpoint }}
            </li>
          </ol>
        </details>

        <div v-if="!compact" class="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Check class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /><span>Hozirgi qadam: <span class="font-medium text-foreground">{{ nextStep(item).title }}</span></span></div>
        <button class="demo-person mt-5" :aria-label="`${item.childName} — ${item.demoScenario?.title} kartasini ochish`" @click="emit('open-case', item.id)">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">{{ initials(item.childName) }}</span>
          <span class="min-w-0 flex-1"><span class="block text-xs font-semibold leading-5">{{ item.childName }}</span><span class="mt-0.5 block text-[11px] text-muted-foreground">{{ item.number }} · {{ REGION_LABELS[item.region] }}</span></span>
          <ArrowRight class="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </button>
      </article>
    </div>

    <div v-if="!visibleScenarios.length" class="rounded-xl border border-dashed border-border px-5 py-12 text-center">
      <Search class="mx-auto h-7 w-7 text-muted-foreground/60" aria-hidden="true" />
      <p class="mt-3 text-sm font-medium">Bu tanlovga mos ssenariy yo‘q</p>
      <p class="mt-2 text-xs leading-5 text-muted-foreground">Qidiruv, hudud yoki jarayon bosqichini o‘zgartirishingiz mumkin.</p>
      <button v-if="selectedGroup !== 'ALL'" class="demo-link mt-4" @click="selectedGroup = 'ALL'">Barcha bosqichlarni ko‘rish<ArrowRight class="h-4 w-4" aria-hidden="true" /></button>
    </div>
  </section>
</template>

<style scoped>
.demo-card { display:flex; min-width:0; flex-direction:column; border:1px solid var(--border); border-radius:12px; background:var(--card); padding:18px; }
.demo-title { font-size:14px; line-height:22px; font-weight:600; }
.demo-title:hover { color:var(--primary); }
.demo-person { display:flex; align-items:center; gap:10px; border-top:1px solid var(--border); padding-top:15px; text-align:left; }
.demo-person:hover { color:var(--primary); }
.demo-link { display:inline-flex; align-items:center; gap:8px; padding:8px 0; color:var(--primary); font-size:12px; line-height:20px; font-weight:600; }
.demo-group { flex-shrink:0; border:1px solid var(--border); border-radius:8px; background:var(--card); padding:9px 12px; font-size:12px; line-height:20px; color:var(--muted-foreground); }
.demo-group:hover { background:var(--muted); }
.demo-group-active { border-color:color-mix(in srgb,var(--primary) 35%,var(--border)); color:var(--primary); background:color-mix(in srgb,var(--primary) 8%,var(--card)); font-weight:600; }
.demo-checkpoints summary::-webkit-details-marker { display:none; }
.demo-checkpoints[open] .demo-chevron { transform:rotate(180deg); }
.demo-explorer button:focus-visible,.demo-explorer a:focus-visible,.demo-explorer summary:focus-visible { outline:2px solid var(--primary); outline-offset:3px; border-radius:5px; }
</style>
