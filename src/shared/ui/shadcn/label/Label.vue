<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  for?: string
  class?: string
}>()
</script>

<template>
  <label
    :for="for"
    :class="cn('text-sm font-medium text-foreground', $props.class)"
  >
    <slot />
  </label>
</template>
