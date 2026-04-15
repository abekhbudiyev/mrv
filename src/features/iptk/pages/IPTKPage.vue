<script setup lang="ts">
import { computed } from 'vue'
import { FileCheck2 } from 'lucide-vue-next'
import { getIPTKPage } from '@/features/iptk/config'
import EmptyState from '@/shared/components/EmptyState.vue'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'

const props = defineProps<{
  pageKey: string
}>()

const page = computed(() => getIPTKPage(props.pageKey))
</script>

<template>
  <PageContainer v-if="page">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <SectionBlock
      :title="page.sectionTitle ?? page.title"
      :description="page.sectionDescription"
      icon-bg-class="bg-primary/10"
      icon-border-class="border-primary/20"
    >
      <template #icon>
        <FileCheck2 class="h-5 w-5 text-primary" />
      </template>

      <EmptyState
        title="Content will be added here later"
        description="This module is prepared for future implementation."
      />
    </SectionBlock>
  </PageContainer>
</template>
