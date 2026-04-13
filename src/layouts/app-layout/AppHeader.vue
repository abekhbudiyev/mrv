<script setup lang="ts">
import { computed } from 'vue'
import { LayoutGrid, Menu, PanelLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { usePageMeta } from '@/shared/composables/use-page-meta'
import { Button } from '@/shared/ui/shadcn/button'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import PageBreadcrumbs from '@/shared/components/PageBreadcrumbs.vue'
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
  <div class="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-5 lg:px-6">
    <div class="flex min-w-0 flex-1 items-center gap-3">
      <Button
        v-if="showSidebar"
        variant="ghost"
        size="icon"
        class="hidden lg:inline-flex"
        @click="$emit('toggleSidebarCollapse')"
      >
        <PanelLeft class="h-5 w-5" />
      </Button>

      <Button
        v-if="showSidebar"
        variant="ghost"
        size="icon"
        class="shrink-0 lg:hidden"
        @click="$emit('toggleSidebar')"
      >
        <Menu class="h-5 w-5" />
      </Button>

      <div class="min-w-0 flex-1">
        <PageBreadcrumbs
          v-if="breadcrumbs.length"
          :items="breadcrumbs"
        />
        <h1 class="truncate text-[15px] font-semibold text-foreground">
          {{ currentTitle }}
        </h1>
      </div>
    </div>

    <div class="flex shrink-0 items-center gap-2 self-start sm:self-center">
      <RouterLink to="/apps">
        <Button
          variant="outline"
          size="icon"
          class="h-10 w-10"
        >
          <LayoutGrid class="h-4 w-4" />
        </Button>
      </RouterLink>
      <ThemeToggle />
      <AppHeaderUserMenu />
    </div>
  </div>
</template>
