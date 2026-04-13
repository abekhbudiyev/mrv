<script setup lang="ts">
import { Card, CardContent } from '@/shared/ui/shadcn/card'

withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Kontent keyinroq qo‘shiladi',
  description: 'Bu modul kelajakdagi implementatsiya uchun tayyorlab qo‘yilgan.',
})
</script>

<template>
  <Card class="border-dashed">
    <CardContent class="flex min-h-36 flex-col justify-center gap-2 pt-5">
      <h3 class="text-sm font-semibold text-foreground">
        {{ title }}
      </h3>
      <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
        {{ description }}
      </p>
    </CardContent>
  </Card>
</template>
