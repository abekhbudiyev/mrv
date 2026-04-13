<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex items-center gap-2 text-xs text-muted-foreground"
  >
    <template
      v-for="(item, index) in items"
      :key="`${item}-${index}`"
    >
      <span>{{ item }}</span>
      <span v-if="index < items.length - 1">/</span>
    </template>
  </nav>
</template>
