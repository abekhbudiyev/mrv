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
        'fixed inset-y-3 left-4 z-40 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#d7e4d5] bg-[#edf5ec] shadow-[0_24px_60px_rgba(15,20,17,0.18)] transition-[width,transform] duration-300 ease-out lg:translate-x-0 lg:border-border lg:bg-sidebar lg:shadow-none',
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <slot name="sidebar" />
    </aside>

    <div
      :class="[
        'flex min-h-screen flex-col overflow-visible xl:h-screen xl:overflow-hidden',
        showSidebar ? (sidebarCollapsed ? 'lg:pl-[6.25rem]' : 'lg:pl-[18.75rem]') : '',
      ]"
    >
      <header class="sticky top-3 z-20 px-4 lg:px-5">
        <div class="rounded-2xl border border-border bg-card/95 backdrop-blur">
          <slot name="header" />
        </div>
      </header>

      <main class="min-h-0 flex-1 overflow-visible pt-1 xl:overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
