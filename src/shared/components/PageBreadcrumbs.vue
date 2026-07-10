<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  items: string[]
}>()
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex min-w-0 items-center gap-2 overflow-hidden text-xs text-muted-foreground"
  >
    <template
      v-for="(item, index) in items"
      :key="`${item}-${index}`"
    >
      <span :class="index === items.length - 1 ? 'truncate font-medium text-foreground' : 'truncate'">
        {{ item }}
      </span>
      <ChevronRight
        v-if="index < items.length - 1"
        class="h-3 w-3 shrink-0 opacity-60"
      />
    </template>
  </nav>
</template>
