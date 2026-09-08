<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRight, BedDouble, BookOpen, Check, ClipboardList, HeartHandshake, MapPin, Search, UsersRound, X } from 'lucide-vue-next'
import { REGION_LABELS, SERVICE_LABELS, STATUS_LABELS } from '../domain'
import { statusTone } from '../presenters'
import { usePalliativeStore } from '../store'
import type { AssessmentInput, CareTaskInput, CaseStatus, EpisodeInput, RegionCode, ServiceType, VisitInput } from '../types'

type TabKey = 'regions' | 'services' | 'statuses' | 'resources'
type ReferenceEntry = { code: string; title: string; meaning: string }
const store = usePalliativeStore()
const activeTab = ref<TabKey>('regions')
const query = ref('')
const normalize = (value: string) => value.toLocaleLowerCase().replace(/[‘’ʻʼ']/g, '').trim()
const matches = (...values: string[]) => !query.value.trim() || normalize(values.join(' ')).includes(normalize(query.value))

const regions = (Object.entries(REGION_LABELS) as [RegionCode, string][]).map(([code, title]) => ({ code, title }))
const serviceDescriptions: Record<ServiceType, string> = {
  INPATIENT: 'Markazda joylashtirish, parvarish va individual yordam.',
  MOBILE: 'Uy sharoitidagi yordam, brigada tashriflari va masofaviy maslahat.',
}
const assessmentTypes: Record<AssessmentInput['type'], Omit<ReferenceEntry, 'code'>> = {
  PAPAS: { title: 'PaPaS baholashi', meaning: 'Qabul oldidan shifokor tasdiqlagan ehtiyoj bahosi.' },
  HOME: { title: 'Uyda yordam ehtiyoji', meaning: 'Mobil yordam va haftalik uy tashriflarini rejalash uchun alohida baho.' },
}
const careTypes: Record<CareTaskInput['category'], Omit<ReferenceEntry, 'code'>> = {
  MEDICAL: { title: 'Tibbiy yordam', meaning: 'Vakolatli shifokor belgilagan tibbiy xizmat va kuzatuv.' },
  NURSING: { title: 'Parvarish', meaning: 'Hamshiralik va kundalik parvarishga oid yordam.' },
  PSYCHOLOGICAL: { title: 'Psixologik yordam', meaning: 'Bola yoki oilani psixologik qo‘llab-quvvatlash.' },
  SOCIAL: { title: 'Ijtimoiy xizmat', meaning: 'Bola va oilaning ijtimoiy ehtiyojlariga ko‘maklashish.' },
  FAMILY: { title: 'Oilani o‘qitish / qo‘llab-quvvatlash', meaning: 'Vakilga parvarishni tushuntirish va oilaga ko‘mak.' },
}
const admissionTypes: Record<EpisodeInput['admissionType'], Omit<ReferenceEntry, 'code'>> = {
  TEMPORARY: { title: 'Vaqtinchalik joylashtirish', meaning: 'Boshlanishi va rejalashtirilgan yakuni belgilangan statsionar davr.' },
  TERMINAL: { title: 'Muddatsiz joylashtirish', meaning: 'Klinik xulosa va konsilium qarori bilan alohida qayd etiladigan yordam.' },
}
const visitTypes: Record<VisitInput['type'], Omit<ReferenceEntry, 'code'>> = {
  HOME: { title: 'Uyga tashrif', meaning: 'Brigadaning bola yoki oila yashash joyiga tashrifi.' },
  REMOTE: { title: 'Masofaviy maslahat', meaning: 'Masofadan ko‘rsatilgan maslahat; uyga tashrifdan alohida qayd etiladi.' },
}
const entries = (values: Record<string, Omit<ReferenceEntry, 'code'>>): ReferenceEntry[] => Object.entries(values).map(([code, item]) => ({ code, ...item }))
const serviceGroups = [
  { key: 'service', title: 'Yordam shakllari', note: 'Markaz konsiliumi belgilagan xizmat yo‘nalishi.', items: (Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([code, title]) => ({ code, title, meaning: serviceDescriptions[code] })) },
  { key: 'assessment', title: 'Baholash turlari', note: 'PaPaS va uy ehtiyoji bir-birining o‘rniga qo‘llanmaydi.', items: entries(assessmentTypes) },
  { key: 'care', title: 'Individual reja yo‘nalishlari', note: 'Har bir vazifa bola yoki oilaga yo‘naltiriladi.', items: entries(careTypes) },
  { key: 'admission', title: 'Statsionar joylashtirish turlari', note: 'Muddat va uzaytirish qarori xizmat epizodida yuritiladi.', items: entries(admissionTypes) },
  { key: 'visit', title: 'Tashrif va maslahat turlari', note: 'Rejalashtirish va amaldagi natija alohida qayd etiladi.', items: entries(visitTypes) },
]

const statusDescriptions: Record<CaseStatus, { stage: string; meaning: string }> = {
  INTAKE: { stage: 'Murojaat', meaning: 'Murojaat ro‘yxatga olingan, dastlabki baholash kutilmoqda.' },
  ASSESSMENT: { stage: 'Baholash', meaning: 'Ko‘rik va baholash jarayoni davom etmoqda; tasdiqlangan natija kutilmoqda.' },
  OBSERVATION: { stage: 'Baholash', meaning: 'Poliklinika kuzatuvi davom etadi; zaruratda qayta baholanadi.' },
  REFERRAL: { stage: 'Yo‘llanma', meaning: 'Yo‘llanma va ilovalar tayyorlanmoqda yoki yetishmagan ma’lumot to‘ldirilmoqda.' },
  CONSILIUM: { stage: 'Qaror', meaning: 'Ish Markaz konsiliumining alohida qabul qarorini kutmoqda.' },
  APPROVED: { stage: 'Qaror', meaning: 'Qabul tasdiqlangan; o‘rin yoki brigada biriktirilib, xizmat hali boshlanishi kerak.' },
  PAUSED: { stage: 'Qaror', meaning: 'Boshqa tibbiy yordam yoki qayta ko‘rish kutilmoqda; yakuniy rad etish emas.' },
  REJECTED: { stage: 'Qaror', meaning: 'Markaz qabulni asosli qaror bilan rad etgan; qaror va keyingi yordam qaydlari saqlanadi.' },
  INPATIENT: { stage: 'Xizmat', meaning: 'Statsionar yordam epizodi faol, o‘rin va individual reja yuritilmoqda.' },
  MOBILE: { stage: 'Xizmat', meaning: 'Mobil yordam epizodi faol, brigada va uy tashriflari rejasi yuritilmoqda.' },
  FOLLOW_UP: { stage: 'Keyingi yordam', meaning: 'Klinik xizmat yakunlangan; topshirish yoki oilaviy shifokor kuzatuvi davom etadi.' },
  BEREAVEMENT: { stage: 'Keyingi yordam', meaning: 'Bola vafotidan keyin oilaga alohida yordam rejasi faol.' },
  CLOSED: { stage: 'Yakun', meaning: 'Oilaviy yordam yakunlangan; bajarilgan ishlar va hujjatlar tarixi saqlanadi.' },
}
const statuses = (Object.entries(STATUS_LABELS) as [CaseStatus, string][]).map(([code, title]) => ({ code, title, ...statusDescriptions[code] }))
const tabs = computed(() => [
  { key: 'regions' as const, title: 'Hududlar', icon: MapPin, count: regions.length },
  { key: 'services' as const, title: 'Xizmat turlari', icon: HeartHandshake, count: serviceGroups.reduce((total, group) => total + group.items.length, 0) },
  { key: 'statuses' as const, title: 'Ish holatlari', icon: ClipboardList, count: statuses.length },
  { key: 'resources' as const, title: 'Brigada va o‘rinlar', icon: UsersRound, count: store.teams.length + store.beds.length },
])
const filteredRegions = computed(() => regions.filter(item => matches(item.title, item.code)))
const filteredGroups = computed(() => serviceGroups.map(group => ({ ...group, items: group.items.filter(item => matches(group.title, item.title, item.meaning)) })).filter(group => group.items.length))
const filteredStatuses = computed(() => statuses.filter(item => matches(item.title, item.stage, item.meaning)))
const filteredTeams = computed(() => store.teams.filter(team => matches(team.name, team.vehicle, ...team.members, ...team.regions.map(region => REGION_LABELS[region]))))
const filteredBeds = computed(() => store.beds.filter(bed => matches(bed.name, bed.room, bed.available ? 'Foydalanishga tayyor' : 'Foydalanishga tayyor emas')))
const resultCount = computed(() => activeTab.value === 'regions' ? filteredRegions.value.length : activeTab.value === 'services' ? filteredGroups.value.reduce((sum, group) => sum + group.items.length, 0) : activeTab.value === 'statuses' ? filteredStatuses.value.length : filteredTeams.value.length + filteredBeds.value.length)
const selectedTab = computed(() => tabs.value.find(tab => tab.key === activeTab.value)!)

function selectTab(key: TabKey) { activeTab.value = key; query.value = '' }
function moveTab(event: KeyboardEvent, index: number) {
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % tabs.value.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.value.length) % tabs.value.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = tabs.value.length - 1
  else return
  event.preventDefault()
  const key = tabs.value[next]!.key
  selectTab(key)
  const button = event.currentTarget as HTMLButtonElement
  button.parentElement?.querySelector<HTMLButtonElement>(`[data-tab="${key}"]`)?.focus()
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1.5" role="tablist" aria-label="Ma’lumotnoma bo‘limlari">
      <button v-for="(tab, index) in tabs" :id="`reference-tab-${tab.key}`" :key="tab.key" type="button" role="tab" :data-tab="tab.key" :aria-selected="activeTab === tab.key" :aria-controls="`reference-panel-${tab.key}`" :tabindex="activeTab === tab.key ? 0 : -1" :class="['flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-1 sm:justify-center', activeTab === tab.key ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground']" @click="selectTab(tab.key)" @keydown="moveTab($event, index)">
        <component :is="tab.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
        {{ tab.title }}
        <span class="rounded-md bg-muted px-1.5 py-0.5 text-[11px] tabular-nums text-muted-foreground">{{ tab.count }}</span>
      </button>
    </div>

    <section :id="`reference-panel-${activeTab}`" role="tabpanel" :aria-labelledby="`reference-tab-${activeTab}`" class="space-y-5" tabindex="0">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <label class="relative block w-full sm:max-w-sm">
          <span class="sr-only">{{ selectedTab.title }} bo‘limidan qidirish</span>
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input v-model="query" type="search" class="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" :placeholder="`${selectedTab.title}: nom yoki mazmun…`" />
          <button v-if="query" type="button" aria-label="Qidiruvni tozalash" class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" @click="query = ''"><X class="h-4 w-4" /></button>
        </label>
        <p class="text-xs text-muted-foreground" role="status">{{ resultCount }} / {{ selectedTab.count }} ta yozuv</p>
      </div>

      <div v-if="!resultCount" class="rounded-xl border border-dashed border-border bg-card px-5 py-12 text-center">
        <Search class="mx-auto h-7 w-7 text-muted-foreground" aria-hidden="true" />
        <p class="mt-3 text-sm font-medium">Mos yozuv topilmadi</p>
        <p class="mt-1 text-xs text-muted-foreground">Qidiruv so‘zini qisqartiring yoki boshqa bo‘limni tanlang.</p>
        <button type="button" class="mt-4 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" @click="query = ''">Qidiruvni tozalash</button>
      </div>

      <template v-else-if="activeTab === 'regions'">
        <p class="text-sm text-muted-foreground">Modulda murojaat va mobil yordam uchun belgilangan to‘rtta viloyat.</p>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article v-for="region in filteredRegions" :key="region.code" class="rounded-xl border border-border bg-card p-5">
            <div class="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><MapPin class="h-4 w-4" aria-hidden="true" /></div>
            <h2 class="font-semibold">{{ region.title }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">Viloyat</p>
          </article>
        </div>
      </template>

      <div v-else-if="activeTab === 'services'" class="grid items-start gap-4 lg:grid-cols-2">
        <section v-for="group in filteredGroups" :key="group.key" class="overflow-hidden rounded-xl border border-border bg-card">
          <header class="border-b border-border px-5 py-4"><h2 class="text-sm font-semibold">{{ group.title }}</h2><p class="mt-1 text-xs leading-5 text-muted-foreground">{{ group.note }}</p></header>
          <dl class="divide-y divide-border">
            <div v-for="item in group.items" :key="item.code" class="px-5 py-4"><dt class="text-sm font-medium">{{ item.title }}</dt><dd class="mt-1 text-sm leading-6 text-muted-foreground">{{ item.meaning }}</dd></div>
          </dl>
        </section>
      </div>

      <section v-else-if="activeTab === 'statuses'" class="overflow-hidden rounded-xl border border-border bg-card">
        <header class="border-b border-border px-5 py-4"><h2 class="text-sm font-semibold">Bola va oila ishining holatlari</h2><p class="mt-1 text-xs leading-5 text-muted-foreground">Holat ishning qaysi bosqichdaligini bildiradi; xizmat natijasi kartada alohida qayd etiladi.</p></header>
        <div class="divide-y divide-border">
          <article v-for="item in filteredStatuses" :key="item.code" class="grid gap-2 px-5 py-4 md:grid-cols-[200px_1fr] md:gap-5">
            <div><span :class="['inline-flex rounded-md px-2 py-1 text-xs font-medium', statusTone(item.code)]">{{ item.title }}</span><p class="mt-1.5 text-[11px] text-muted-foreground">{{ item.stage }}</p></div>
            <p class="text-sm leading-6 text-muted-foreground">{{ item.meaning }}</p>
          </article>
        </div>
      </section>

      <template v-else-if="activeTab === 'resources'">
        <div class="flex items-start gap-2.5 rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs leading-5 text-muted-foreground"><BookOpen class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p>Brigadalar va o‘rinlar — prototipdagi demo resurslar. Bu yerda tarkib, xizmat hududi va foydalanishga tayyorlik ko‘rsatiladi.</p></div>
        <section v-if="filteredTeams.length" class="space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2"><h2 class="text-sm font-semibold">Mobil brigadalar</h2><RouterLink to="/apps/palliative-care/mobile" class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Tashriflar jadvali<ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" /></RouterLink></div>
          <div class="grid gap-4 lg:grid-cols-2">
            <article v-for="team in filteredTeams" :key="team.id" class="rounded-xl border border-border bg-card p-5">
              <div class="flex items-start gap-3"><span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><UsersRound class="h-4 w-4" aria-hidden="true" /></span><div><h3 class="text-sm font-semibold">{{ team.name }}</h3><p class="mt-1 text-xs text-muted-foreground">{{ team.vehicle }}</p></div></div>
              <div class="mt-4 flex flex-wrap gap-1.5"><span v-for="region in team.regions" :key="region" class="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{{ REGION_LABELS[region] }}</span></div>
              <ul class="mt-4 space-y-2 border-t border-border pt-4"><li v-for="member in team.members" :key="member" class="flex items-start gap-2 text-sm text-muted-foreground"><Check class="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />{{ member }}</li></ul>
            </article>
          </div>
        </section>
        <section v-if="filteredBeds.length" class="overflow-hidden rounded-xl border border-border bg-card">
          <header class="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4"><div><h2 class="text-sm font-semibold">Statsionar o‘rinlar</h2><p class="mt-1 text-xs text-muted-foreground">Xona va foydalanishga tayyorlik. Bandlik statsionar bo‘limida yuritiladi.</p></div><RouterLink to="/apps/palliative-care/inpatient" class="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">O‘rinlar bandligi<ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" /></RouterLink></header>
          <div class="divide-y divide-border">
            <article v-for="bed in filteredBeds" :key="bed.id" class="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"><div class="flex items-center gap-3"><BedDouble class="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><div><h3 class="text-sm font-medium">{{ bed.name }}</h3><p class="mt-0.5 text-xs text-muted-foreground">{{ bed.room }}</p></div></div><span :class="['rounded-md px-2 py-1 text-xs', bed.available ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200' : 'bg-muted text-muted-foreground']">{{ bed.available ? 'Foydalanishga tayyor' : 'Foydalanishga tayyor emas' }}</span></article>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>
