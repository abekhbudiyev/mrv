<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  showTitle?: boolean
}>(), {
  showTitle: false,
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1
      v-if="showTitle"
      class="text-xl font-semibold tracking-tight text-foreground"
    >
      {{ title }}
    </h1>
    <p
      v-if="description"
      class="max-w-4xl text-sm leading-6 text-muted-foreground"
    >
      {{ description }}
    </p>
  </div>
</template>
