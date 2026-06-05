<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Home, LockKeyhole, SearchX } from 'lucide-vue-next'
import { Button } from '@/shared/ui/shadcn/button'
import { useI18n } from '@/shared/i18n'

const props = defineProps<{
  status: 403 | 404
}>()

const router = useRouter()
const { t } = useI18n()

const page = computed(() => {
  if (props.status === 403) {
    return {
      eyebrow: '403 · Access denied',
      title: 'Ruxsat cheklangan',
      description: 'Ushbu sahifani ko‘rish uchun sizda yetarli ruxsat mavjud emas.',
      hint: 'Agar bu sahifa sizga kerak bo‘lsa, tizim administratori bilan bog‘laning.',
      icon: LockKeyhole,
      iconClass:
        'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300',
    }
  }

  return {
    eyebrow: '404 · Not found',
    title: 'Sahifa topilmadi',
    description: 'Siz izlayotgan sahifa mavjud emas yoki manzili o‘zgargan.',
    hint: 'Manzilni tekshiring yoki ilovalar sahifasidan kerakli modulni qayta tanlang.',
    icon: SearchX,
    iconClass:
      'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300',
  }
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push('/apps')
}

function goApps() {
  router.push('/apps')
}
</script>

<template>
  <div class="flex min-h-screen min-w-0 max-w-full flex-col overflow-hidden bg-background p-4 sm:p-5 lg:p-6">
    <section
      class="relative flex min-h-[calc(100vh-2rem)] flex-1 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card px-6 py-12 sm:min-h-[calc(100vh-2.5rem)] sm:px-10 lg:min-h-[calc(100vh-3rem)]"
    >
      <div class="relative flex w-full max-w-3xl flex-col items-center text-center">
        <div
          :class="[
            'mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl border',
            page.iconClass,
          ]"
        >
          <component
            :is="page.icon"
            class="h-7 w-7"
          />
        </div>

        <p class="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          {{ page.eyebrow }}
        </p>
        <h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          {{ t(page.title) }}
        </h1>
        <p class="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {{ t(page.description) }}
        </p>
        <p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {{ t(page.hint) }}
        </p>

        <div class="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button
            class="h-11 gap-2"
            @click="goApps"
          >
            <Home class="h-4 w-4" />
            {{ t('Ilovalar') }}
          </Button>
          <Button
            variant="outline"
            class="h-11 gap-2"
            @click="goBack"
          >
            <ArrowLeft class="h-4 w-4" />
            {{ t('Orqaga qaytish') }}
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
