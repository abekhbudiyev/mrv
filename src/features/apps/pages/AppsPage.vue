<script setup lang="ts">
import { computed } from 'vue'
import { appModules } from '@/features/apps/registry/apps'
import { useAuthStore } from '@/stores/auth'
import PageContainer from '@/shared/components/PageContainer.vue'
import AppCard from '@/shared/components/AppCard.vue'

const authStore = useAuthStore()
const modules = computed(() => appModules.filter((module) => (
  module.enabled && authStore.hasPermission(module.permission)
)))
</script>

<template>
  <PageContainer>
    <div class="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
      <AppCard
        v-for="app in modules"
        :key="app.id"
        :app="app"
      />
    </div>
  </PageContainer>
</template>
