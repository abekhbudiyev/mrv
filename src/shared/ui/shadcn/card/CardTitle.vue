<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <h3 :class="cn('text-base font-semibold tracking-tight text-card-foreground', $props.class)">
    <slot />
  </h3>
</template>
