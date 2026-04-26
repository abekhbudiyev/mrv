<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import logoMark from '@/assets/logo-mark.svg'
import { appModules } from '@/features/apps/registry/apps'
import { iptkMenu } from '@/features/iptk/config'
import { muruvvatMenu } from '@/features/muruvvat/config'
import { useAuthStore } from '@/stores/auth'
import type { MuruvvatMenuItem } from '@/features/muruvvat/types'
import { cn } from '@/shared/lib/utils'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggleCollapse: []
}>()

const route = useRoute()
const authStore = useAuthStore()
const modules = computed(() => appModules.filter((module) => (
  module.enabled && authStore.hasPermission(module.permission)
)))
const activeModuleKey = computed(() => route.meta.moduleKey ?? null)
const openSections = ref<Record<string, boolean>>({})
const brandHomeRoute = computed(() => {
  if (typeof activeModuleKey.value === 'string') {
    const activeModule = modules.value.find((module) => module.id === activeModuleKey.value)

    if (activeModule) {
      return activeModule.route
    }
  }

  return '/apps'
})

const currentModuleLabel = computed(() => {
  if (route.path === '/apps') {
    return 'Modullar'
  }

  if (typeof route.meta.moduleTitle === 'string') {
    return route.meta.moduleTitle
  }

  return String(route.meta.title ?? 'Modul')
})

const moduleNavigation = computed<MuruvvatMenuItem[]>(() => {
  if (activeModuleKey.value === 'iptk') {
    return iptkMenu
  }

  if (activeModuleKey.value === 'muruvvat') {
    return muruvvatMenu
  }

  return []
})

function isActive(path: string) {
  return route.path === path
}

function isItemActive(item: MuruvvatMenuItem): boolean {
  if (item.route && route.path === item.route) {
    return true
  }

  return item.children?.some((child) => isItemActive(child)) ?? false
}

function syncOpenSections() {
  const nextState: Record<string, boolean> = {}

  for (const item of moduleNavigation.value) {
    if (item.children?.length) {
      nextState[item.id] = isItemActive(item)
    }
  }

  openSections.value = nextState
}

function toggleSection(sectionId: string) {
  openSections.value = {
    ...Object.fromEntries(Object.keys(openSections.value).map((key) => [key, false])),
    [sectionId]: !openSections.value[sectionId],
  }
}

watch(() => route.path, syncOpenSections, { immediate: true })
</script>

<template>
  <div class="flex h-full flex-col">
    <RouterLink
      :to="brandHomeRoute"
      :class="cn(
        'flex h-16 items-center border-b border-border',
        collapsed ? 'justify-center px-3' : 'gap-3 px-5',
      )"
    >
      <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card p-1">
        <img
          :src="logoMark"
          alt="IHMA logo"
          class="h-full w-full object-contain"
        />
      </div>
      <div
        v-if="!collapsed"
        class="min-w-0 flex-1"
      >
        <p class="truncate text-sm font-semibold tracking-wide text-sidebar-foreground">
          IHMA
        </p>
        <p class="truncate text-xs text-muted-foreground">
          {{ currentModuleLabel }}
        </p>
      </div>
    </RouterLink>

    <div :class="cn('flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')">
      <div
        v-if="moduleNavigation.length"
        class="space-y-1"
      >
        <p
          v-if="!collapsed"
          class="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          {{ currentModuleLabel }}
        </p>

        <template
          v-for="item in moduleNavigation"
          :key="item.id"
        >
          <RouterLink
            v-if="item.route"
            :to="item.route"
            :class="cn(
              'flex items-center gap-3 rounded-md text-sm transition-colors duration-200 ease-out',
              collapsed ? 'mx-auto h-10 w-10 justify-center p-0' : 'px-3 py-2',
              isItemActive(item)
                ? 'border border-primary/35 bg-primary/12 text-foreground'
                : 'text-sidebar-foreground hover:bg-accent hover:text-foreground',
            )"
            :title="collapsed ? item.title : undefined"
          >
            <component
              :is="item.icon"
              class="h-4 w-4"
            />
            <span
              v-if="!collapsed"
              class="truncate"
            >
              {{ item.title }}
            </span>
          </RouterLink>

          <div v-else>
            <button
              type="button"
              :class="cn(
                'flex items-center gap-3 rounded-md text-sm transition-colors duration-200 ease-out hover:bg-accent/80',
                collapsed ? 'mx-auto h-10 w-10 justify-center p-0' : 'w-full px-3 py-2',
                isItemActive(item) ? 'bg-primary/10 text-foreground' : 'text-sidebar-foreground',
              )"
              :title="collapsed ? item.title : undefined"
              @click="toggleSection(item.id)"
            >
              <component
                :is="item.icon"
                class="h-4 w-4"
              />
              <span
                v-if="!collapsed"
                class="truncate font-medium"
              >
                {{ item.title }}
              </span>
              <ChevronDown
                v-if="!collapsed"
                :class="cn(
                  'ml-auto h-4 w-4 transition-transform duration-200 ease-out',
                  openSections[item.id] ? 'rotate-180' : '',
                )"
              />
            </button>

            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="max-h-0 translate-y-[-2px] opacity-0"
              enter-to-class="max-h-96 translate-y-0 opacity-100"
              leave-active-class="transition-all duration-220 ease-out"
              leave-from-class="max-h-96 translate-y-0 opacity-100"
              leave-to-class="max-h-0 translate-y-[-2px] opacity-0"
            >
              <div
                v-if="!collapsed && item.children?.length && openSections[item.id]"
                class="ml-7 mt-1 space-y-1 overflow-hidden"
              >
                <RouterLink
                  v-for="child in item.children"
                  :key="child.id"
                  :to="child.route ?? '/apps'"
                  :class="cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200 ease-out',
                    isItemActive(child)
                      ? 'border-l-2 border-primary bg-primary/10 text-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )"
                >
                  <span class="truncate">{{ child.title }}</span>
                </RouterLink>
              </div>
            </Transition>
          </div>
        </template>
      </div>

      <div
        v-else
        class="space-y-1"
      >
        <p
          v-if="!collapsed"
          class="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Modullar
        </p>

        <RouterLink
          v-for="module in modules"
          :key="module.id"
          :to="module.route"
          :class="cn(
            'flex items-center gap-3 rounded-md text-sm transition-colors duration-200 ease-out',
            collapsed ? 'mx-auto h-10 w-10 justify-center p-0' : 'px-3 py-2',
            isActive(module.route)
              ? 'border border-primary/35 bg-primary/12 text-foreground'
              : 'text-sidebar-foreground hover:bg-accent hover:text-foreground',
          )"
          :title="collapsed ? module.title : undefined"
        >
          <component
            :is="module.icon"
            class="h-4 w-4"
          />
          <span
            v-if="!collapsed"
            class="truncate"
          >
            {{ module.title }}
          </span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
