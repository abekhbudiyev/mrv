<script setup lang="ts">
import { computed } from 'vue'
import { getAppModule } from '@/features/apps/registry/apps'
import PageContainer from './PageContainer.vue'
import PageHeader from './PageHeader.vue'
import SectionBlock from './SectionBlock.vue'
import EmptyState from './EmptyState.vue'

const props = defineProps<{
  moduleId: string
}>()

const moduleItem = computed(() => getAppModule(props.moduleId))
</script>

<template>
  <PageContainer v-if="moduleItem">
    <PageHeader
      :title="moduleItem.title"
      :description="moduleItem.description"
    />

    <SectionBlock
      title="Asosiy ish maydoni"
      description="Kelajakdagi filtrlar, jadvallar, forma bloklari va amallar shu hududga bosqichma-bosqich qo‘shiladi."
    >
      <EmptyState
        title="Content will be added here later"
        description="This module is prepared for future implementation."
      />
    </SectionBlock>

    <SectionBlock
      title="Qo‘shimcha bo‘lim"
      description="Bu joy ikkilamchi panel, detal ko‘rinishi yoki yordamchi konfiguratsiyalar uchun saqlab qo‘yilgan."
    >
      <div class="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        Placeholder for future filters, tables, forms, or action panels.
      </div>
    </SectionBlock>
  </PageContainer>
</template>
