<script setup lang="ts">
import { useI18n } from '@/shared/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { cn } from '@/shared/lib/utils'

defineProps<{
  title: string
  description?: string
  class?: string
  contentClass?: string
}>()

const { t } = useI18n()
</script>

<template>
  <Card
    v-if="title || description"
    :class="$props.class"
  >
    <CardHeader
      v-if="title || description"
      class="pb-2.5"
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
    <CardContent :class="contentClass || 'space-y-3'">
      <slot />
    </CardContent>
  </Card>

  <section
    v-else
    :class="cn('min-w-0', $props.class)"
  >
    <div :class="cn(contentClass || 'space-y-3', '!px-0 !pt-0')">
      <slot />
    </div>
  </section>
</template>
