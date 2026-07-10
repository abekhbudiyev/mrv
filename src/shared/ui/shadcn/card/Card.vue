<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="cn('rounded-lg border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,23,18,0.035)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)]', $props.class)"
  >
    <slot />
  </div>
</template>
