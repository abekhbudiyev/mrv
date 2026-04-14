<script setup lang="ts">
import { computed } from 'vue'
import { appModules } from '@/features/apps/registry/apps'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import AppCard from '@/shared/components/AppCard.vue'

const modules = computed(() => appModules.filter((module) => module.enabled))
</script>

<template>
  <PageContainer>
    <PageHeader
      title="Ilovalar"
      description="Bu sahifa faqat tizim modullariga kirish nuqtasi sifatida ishlaydi. Har bir modul o‘zining ichki dashboard, hujjatlar, hisobotlar va boshqa sahifalari bilan keyinchalik alohida kengaytiriladi."
    />

    <SectionBlock
      class="xl:min-h-0 xl:flex-1"
      content-class="space-y-4 xl:h-full"
      title="Modullar"
      description="Modul tanlangandan keyin uning ichki navigatsiyasi va alohida sahifalari o‘sha modul konteksida ishlaydi."
    >
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AppCard
          v-for="app in modules"
          :key="app.id"
          :app="app"
        />
      </div>
    </SectionBlock>
  </PageContainer>
</template>
