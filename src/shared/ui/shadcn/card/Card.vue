<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="cn('rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition-shadow hover:shadow-sm', $props.class)"
  >
    <slot />
  </div>
</template>
