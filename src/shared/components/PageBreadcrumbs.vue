<script setup lang="ts">
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
      <span class="truncate">{{ item }}</span>
      <span
        v-if="index < items.length - 1"
        class="shrink-0"
      >/</span>
    </template>
  </nav>
</template>
