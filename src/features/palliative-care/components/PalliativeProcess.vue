<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { stateTones } from '../presenters'
import {
  ArrowRight,
  BedDouble,
  Check,
  CircleX,
  PauseCircle,
  X,
  ClipboardCheck,
  FileHeart,
  GitBranch,
  HeartHandshake,
  House,
  RefreshCw,
  Stethoscope,
  UsersRound,
} from 'lucide-vue-next'

const steps = [
  {
    number: '01',
    title: 'Murojaat va baholash',
    role: 'Poliklinika · oilaviy shifokor',
    description: 'Qonuniy vakil murojaat qiladi. Shifokor tibbiy tekshiruv va PaPaS baholash natijasini qayd etadi.',
    result: 'Kuzatuv yoki vakil tanlagan muassasaga yo‘naltirish',
    note: 'Baholash uchun 3 ish kuni',
    icon: Stethoscope,
    to: '/apps/palliative-care/cases',
  },
  {
    number: '02',
    title: 'Tibbiy asos va yo‘llanma',
    role: 'Vakolatli muassasa konsiliumi',
    description: 'Tibbiy hujjatlar ko‘riladi, palliativ yordamga ehtiyoj va xizmat shakli belgilanadi. Ko‘chirma va baholash yo‘llanmaga biriktiriladi.',
    result: 'Klinik xulosa va hujjatlari to‘liq yo‘llanma',
    note: 'Birinchi konsilium',
    icon: FileHeart,
    to: '/apps/palliative-care/cases',
  },
  {
    number: '03',
    title: 'Markazning qabul qarori',
    role: 'Shifokor · psixolog · ijtimoiy xodim',
    description: 'Markaz konsiliumi qabul mezonlari va xavfsiz yordam imkoniyatini ko‘rib, alohida qaror qabul qiladi.',
    result: 'Qabul, vaqtincha to‘xtatish yoki asosli rad etish',
    note: 'Ikkinchi, mustaqil konsilium',
    icon: UsersRound,
    to: '/apps/palliative-care/consilium',
  },
  {
    number: '04',
    title: 'Yordamni tashkil etish',
    role: 'Markaz xodimlari · bosh hamshira · brigada',
    description: 'Statsionar o‘rin yoki uyda yordam belgilanadi. Individual rejada xizmat, ijrochi, muddat va zarur jihozlar ko‘rsatiladi.',
    result: 'Mas’uli va muddati belgilangan yordam rejasi',
    note: 'Statsionar yoki mobil yordam',
    icon: HeartHandshake,
    to: '/apps/palliative-care/mobile',
  },
  {
    number: '05',
    title: 'Yordamni amalda ko‘rsatish',
    role: 'Davolovchi jamoa · mobil brigada',
    description: 'Rejadagi xizmat va tashriflar bajariladi. Bola va oilaning holati, ko‘rsatilgan yordam va keyingi ehtiyojlar yoziladi.',
    result: 'Bajarilgan xizmat va uning natijasi',
    note: 'Holat o‘zgarsa, reja qayta ko‘riladi',
    icon: ClipboardCheck,
    to: '/apps/palliative-care/mobile',
  },
  {
    number: '06',
    title: 'Keyingi kuzatuv va oila',
    role: 'Oilaviy shifokor · psixolog · brigada',
    description: 'Bola oilaviy shifokorga topshiriladi, zaruratda qayta yo‘naltiriladi. Vafotdan keyingi oilaviy yordam alohida davom etishi mumkin.',
    result: 'Keyingi yordam va uni davom ettiradigan mas’ul',
    note: 'Oilaga yordam — uch oygacha',
    icon: RefreshCw,
    to: '/apps/palliative-care/cases',
  },
]

const exceptions = [
  {
    title: 'PaPaS 14 yoki undan past',
    text: 'Poliklinikadagi kuzatuv va davolash davom etadi. 15 yoki undan yuqori ballning o‘zi Markazga qabul qilish uchun yetarli emas.',
  },
  {
    title: 'O‘rin yo‘q yoki boshqa yordam zarur',
    text: 'O‘rin bo‘lmasa, mezonlar va rozilik bilan mobil yordam konsiliumda ko‘riladi. Boshqa tibbiy yordam zarur bo‘lsa, vaqtincha to‘xtatish va qayta ko‘rish saqlanadi.',
  },
  {
    title: 'Bola va oilaning yordam muddatlari',
    text: 'Statsionarda 18 yoshga to‘lish yangi qabuldan farqlanadi. Bola bo‘yicha xizmat tugashi oilaning psixologik yordam rejasini avtomatik yopmaydi.',
  },
]
</script>

<template>
  <div class="space-y-6">
    <section aria-labelledby="palliative-process-flow">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="palliative-process-flow" class="text-lg font-semibold text-foreground">Yordamning olti bosqichi</h2>
          <p class="mt-1 text-sm text-muted-foreground">Har bir topshirishda bola kartasi, hujjatlar va keyingi mas’ul saqlanadi.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3"><a href="/guides/316-son-buyruq-31-07-2026.pdf#page=4" target="_blank" rel="noopener" class="text-xs text-primary hover:underline">316-son buyruq · 17–34-bandlar</a><RouterLink to="/apps/palliative-care/guides?topic=overview&view=flowchart&flow=detailed" class="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"><GitBranch class="h-4 w-4" />Batafsil jarayon sxemasi</RouterLink></div>
      </div>
      <div class="mb-5 flex flex-wrap gap-2" aria-label="Qaror va harakat ranglari">
        <span :class="['inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium', stateTones.success]"><Check class="h-4 w-4" />Tasdiqlash / bajarilgan</span>
        <span :class="['inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium', stateTones.danger]"><CircleX class="h-4 w-4" />Rad etish</span>
        <span :class="['inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium', stateTones.warning]"><PauseCircle class="h-4 w-4" />Kutish / qayta ko‘rish</span>
        <span :class="['inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium', stateTones.neutral]"><X class="h-4 w-4" />Bekor qilish / yopish</span>
      </div>
      <ol class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <li v-for="step in steps" :key="step.number" class="flex flex-col rounded-xl border border-border bg-card p-5">
          <div class="flex items-center justify-between">
            <span :class="['flex h-10 w-10 items-center justify-center rounded-xl border', step.number === '05' ? stateTones.success : step.number === '03' ? stateTones.warning : step.number === '06' ? stateTones.family : stateTones.info]">
              <component :is="step.icon" class="h-5 w-5" aria-hidden="true" />
            </span>
            <span class="text-3xl font-light tabular-nums text-slate-300" aria-hidden="true">{{ step.number }}</span>
          </div>
          <h3 class="mt-4 text-base font-semibold text-foreground">{{ step.title }}</h3>
          <p class="mt-1 text-xs font-medium leading-5 text-emerald-700">{{ step.role }}</p>
          <p class="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{{ step.description }}</p>
          <div :class="['my-4 flex items-start gap-2 rounded-lg border px-3 py-3', step.number === '05' ? stateTones.success : stateTones.info]">
            <component :is="step.number === '05' ? Check : ArrowRight" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p class="text-xs font-medium leading-5 text-foreground">{{ step.result }}</p>
          </div>
          <div class="flex items-center justify-between gap-2 border-t border-border pt-3">
            <p class="text-xs leading-5 text-muted-foreground">{{ step.note }}</p>
            <RouterLink
              :to="step.to"
              :aria-label="`${step.title} bo‘limiga o‘tish`"
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </RouterLink>
          </div>
        </li>
      </ol>
    </section>

    <section class="grid gap-4 lg:grid-cols-2" aria-label="Yordam shakllari">
      <RouterLink to="/apps/palliative-care/inpatient" class="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <BedDouble class="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
        <div>
          <h3 class="font-semibold text-foreground">Markazda — statsionar yordam</h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">O‘rin va parvarish, yotish muddati, uzaytirish qarori va chiqarishdan keyingi kuzatuv bir-biriga bog‘lanadi.</p>
        </div>
        <ArrowRight class="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-700" aria-hidden="true" />
      </RouterLink>
      <RouterLink to="/apps/palliative-care/mobile" class="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition hover:border-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600">
        <House class="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
        <div>
          <h3 class="font-semibold text-foreground">Uyda — mobil yordam</h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">Uy ehtiyoji bahosi, individual reja, brigada tashrifi, maslahat va zarur jihozlar bola va oilaning ehtiyojiga bog‘lanadi.</p>
        </div>
        <ArrowRight class="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-emerald-700" aria-hidden="true" />
      </RouterLink>
    </section>

    <section class="rounded-xl border border-border bg-card p-5 sm:p-6" aria-labelledby="palliative-process-differences">
      <h2 id="palliative-process-differences" class="text-base font-semibold text-foreground">Qaror va baholashlar alohida yuritiladi</h2>
      <div class="mt-4 grid gap-6 lg:grid-cols-2">
        <div class="border-l-2 border-emerald-500 pl-4">
          <h3 class="text-sm font-semibold text-foreground">Ikki konsilium — ikki vazifa</h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">Yo‘llanma beruvchi muassasa tibbiy asos va xizmat yo‘nalishini belgilaydi. Markaz konsiliumi qabulni alohida ko‘rib chiqadi. Birinchi xulosa Markaz qarorini almashtirmaydi.</p>
        </div>
        <div class="border-l-2 border-sky-500 pl-4">
          <h3 class="text-sm font-semibold text-foreground">PaPaS va uyda yordam bahosi</h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">PaPaS qabul oldi baholashda qo‘llanadi. Uyda yordamga muhtojlik bahosi tashriflar sonini belgilashga xizmat qiladi. Ular alohida qayd etiladi; tasdiqlanmagan savollar yoki formulalar hisoblanmaydi.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="palliative-process-exceptions">
      <h2 id="palliative-process-exceptions" class="mb-4 text-base font-semibold text-foreground">Asosiy oqimdan farq qiladigan holatlar</h2>
      <div class="grid gap-4 lg:grid-cols-3">
        <article v-for="exception in exceptions" :key="exception.title" :class="['rounded-xl border p-5', stateTones.warning]">
          <h3 class="text-sm font-semibold text-foreground">{{ exception.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ exception.text }}</p>
        </article>
      </div>
    </section>

    <footer class="rounded-xl border border-border bg-muted px-5 py-4 text-xs leading-6 text-muted-foreground">
      <p><span class="font-semibold text-foreground">Kelishiladigan qoidalar.</span> 24-banddagi matniy nomuvofiqlik, tasdiqlangan baholash metodikalari va 14/28 kunni hisoblash tafsilotlari avtomatik klinik qarorga aylantirilmagan.</p>
    </footer>
  </div>
</template>
