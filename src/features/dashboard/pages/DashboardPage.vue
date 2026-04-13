<script setup lang="ts">
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
</script>

<template>
  <PageContainer>
    <PageHeader
      title="Dashboard"
      description="Umumiy ko‘rsatkichlar, tezkor bloklar va kuzatuv panellari uchun boshlang‘ich sahifa."
    />

    <SectionBlock
      title="Asosiy ko‘rsatkichlar"
      description="KPI kartalari, qisqa statistika va tezkor indikatorlar keyingi bosqichda qo‘shiladi."
    >
      <EmptyState />
    </SectionBlock>

    <SectionBlock
      title="Qo‘shimcha panel"
      description="Bu joy ogohlantirishlar, holatlar yoki operativ ish navbatlari uchun saqlangan."
    >
      <div class="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        This module is prepared for future implementation.
      </div>
    </SectionBlock>
  </PageContainer>
</template>
