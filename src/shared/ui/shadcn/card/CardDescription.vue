<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <p :class="cn('text-sm text-muted-foreground', $props.class)">
    <slot />
  </p>
</template>
