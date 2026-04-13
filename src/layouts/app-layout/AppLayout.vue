<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { STORAGE_KEYS } from '@/core/constants/storage'
import AppShell from './AppShell.vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const LAPTOP_SIDEBAR_COLLAPSE_WIDTH = 1440

const route = useRoute()
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
const showSidebar = computed(() => route.path !== '/apps')

const storedSidebarCollapsed = localStorage.getItem(STORAGE_KEYS.sidebarCollapsed)
const hasStoredSidebarPreference = storedSidebarCollapsed === 'true' || storedSidebarCollapsed === 'false'

if (storedSidebarCollapsed === 'true') {
  sidebarCollapsed.value = true
}

onMounted(() => {
  if (!hasStoredSidebarPreference) {
    sidebarCollapsed.value = window.innerWidth < LAPTOP_SIDEBAR_COLLAPSE_WIDTH
  }
})

function toggleSidebar() {
  if (!showSidebar.value) {
    return
  }

  sidebarOpen.value = !sidebarOpen.value
}

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleSidebarCollapse() {
  if (!showSidebar.value) {
    return
  }

  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(sidebarCollapsed.value))
}

watch(showSidebar, (visible) => {
  if (!visible) {
    closeSidebar()
  }
})
</script>

<template>
  <AppShell
    :sidebar-open="sidebarOpen"
    :show-sidebar="showSidebar"
    :sidebar-collapsed="sidebarCollapsed"
    @close-sidebar="closeSidebar"
  >
    <template
      v-if="showSidebar"
      #sidebar
    >
      <AppSidebar
        :collapsed="sidebarCollapsed"
        @toggle-collapse="toggleSidebarCollapse"
      />
    </template>

    <template #header>
      <AppHeader
        :show-sidebar="showSidebar"
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
        @toggle-sidebar-collapse="toggleSidebarCollapse"
      />
    </template>

    <RouterView />
  </AppShell>
</template>
