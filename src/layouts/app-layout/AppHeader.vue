<script setup lang="ts">
import { computed } from 'vue'
import { LayoutGrid, Menu, PanelLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/shared/composables/use-page-meta'
import { Button } from '@/shared/ui/shadcn/button'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import PageBreadcrumbs from '@/shared/components/PageBreadcrumbs.vue'
import AppHeaderLanguageMenu from './AppHeaderLanguageMenu.vue'
import AppHeaderUserMenu from './AppHeaderUserMenu.vue'

withDefaults(defineProps<{
  showSidebar?: boolean
  sidebarCollapsed?: boolean
}>(), {
  showSidebar: true,
  sidebarCollapsed: false,
})

defineEmits<{
  toggleSidebar: []
  toggleSidebarCollapse: []
}>()

const { title, breadcrumbs } = usePageMeta()
const currentTitle = computed(() => title.value || 'Ishchi maydon')
</script>

<template>
  <div class="flex h-14 items-center justify-between gap-2 px-4 sm:gap-3">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <Button
        v-if="showSidebar"
        variant="ghost"
        size="icon"
        class="hidden lg:inline-flex"
        aria-label="Yon menyuni yig'ish yoki ochish"
        title="Yon menyuni yig'ish yoki ochish"
        @click="$emit('toggleSidebarCollapse')"
      >
        <PanelLeft class="h-5 w-5" />
      </Button>

      <Button
        v-if="showSidebar"
        variant="ghost"
        size="icon"
        class="shrink-0 lg:hidden"
        aria-label="Yon menyuni ochish"
        @click="$emit('toggleSidebar')"
      >
        <Menu class="h-5 w-5" />
      </Button>

      <div class="min-w-0 flex-1">
        <PageBreadcrumbs
          v-if="breadcrumbs.length"
          class="hidden sm:flex"
          :items="breadcrumbs"
        />
        <h1 :class="['truncate text-sm font-semibold text-foreground', breadcrumbs.length ? 'sm:hidden' : '']">
          {{ currentTitle }}
        </h1>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-1">
      <RouterLink
        to="/apps"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-muted-foreground outline-none transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Ilovalar"
        title="Ilovalar"
      >
        <LayoutGrid class="h-4 w-4" />
      </RouterLink>
      <AppHeaderLanguageMenu />
      <ThemeToggle />
      <AppHeaderUserMenu />
    </div>
  </div>
</template>
