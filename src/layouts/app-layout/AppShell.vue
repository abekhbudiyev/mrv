<script setup lang="ts">
defineProps<{
  sidebarOpen: boolean
  showSidebar: boolean
  sidebarCollapsed: boolean
}>()

defineEmits<{
  closeSidebar: []
}>()
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-background text-foreground xl:h-screen xl:overflow-hidden">
    <div
      v-if="showSidebar && sidebarOpen"
      class="fixed inset-0 z-30 bg-black/30 lg:hidden"
      @click="$emit('closeSidebar')"
    />

    <aside
      v-if="showSidebar"
      :class="[
        'fixed inset-y-3 left-3 z-40 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-border bg-sidebar transition-[width,transform] duration-200 lg:translate-x-0',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <slot name="sidebar" />
    </aside>

    <div
      :class="[
        'flex min-h-screen flex-col overflow-visible xl:h-screen xl:overflow-hidden',
        showSidebar ? (sidebarCollapsed ? 'lg:pl-[6.75rem]' : 'lg:pl-[19.25rem]') : '',
      ]"
    >
      <header class="sticky top-3 z-20 px-5 lg:px-6">
        <div class="rounded-2xl border border-border bg-card/95 backdrop-blur">
          <slot name="header" />
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-visible pt-2 xl:overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
