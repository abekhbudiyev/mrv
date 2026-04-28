<script setup lang="ts">
import { useI18n } from '@/shared/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'

defineProps<{
  title: string
  description?: string
  class?: string
  contentClass?: string
}>()

const { t } = useI18n()
</script>

<template>
  <Card :class="$props.class">
    <CardHeader
      v-if="title || description"
      class="pb-3"
    >
      <CardTitle v-if="title">
        {{ t(title) }}
      </CardTitle>
      <p
        v-if="description"
        class="text-sm text-muted-foreground"
      >
        {{ t(description) }}
      </p>
    </CardHeader>
    <CardContent :class="contentClass || 'space-y-4'">
      <slot />
    </CardContent>
  </Card>
</template>
