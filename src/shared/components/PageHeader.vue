<script setup lang="ts">
import { useI18n } from '@/shared/i18n'

withDefaults(defineProps<{
  title: string
  description?: string
  showTitle?: boolean
}>(), {
  showTitle: false,
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1
      v-if="showTitle"
      class="text-xl font-semibold tracking-tight text-foreground"
    >
      {{ t(title) }}
    </h1>
    <p
      v-if="description"
      class="max-w-4xl text-sm leading-6 text-muted-foreground"
    >
      {{ t(description) }}
    </p>
  </div>
</template>
