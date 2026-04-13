<script setup lang="ts">
import { cn } from '@/shared/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div :class="cn('p-5 pt-0', $props.class)">
    <slot />
  </div>
</template>
