<script setup lang="ts">
import { computed } from 'vue'
import { appModules } from '@/features/apps/registry/apps'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/shared/components/AppCard.vue'

const authStore = useAuthStore()
const modules = computed(() => appModules.filter((module) => module.enabled))
</script>

<template>
  <div class="h-full min-h-0 overflow-y-auto" aria-label="Ilovalar ro‘yxati" tabindex="0">
    <div class="grid auto-rows-fr gap-4 p-4 lg:p-6 md:grid-cols-2 xl:grid-cols-4">
      <AppCard
        v-for="app in modules"
        :key="app.id"
        :app="app"
        :allowed="authStore.hasPermission(app.permission)"
      />
    </div>
  </div>
</template>
