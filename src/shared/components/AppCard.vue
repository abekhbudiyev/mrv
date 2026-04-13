<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { AppModule } from '@/features/apps/types'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'

defineProps<{
  app: AppModule
}>()
</script>

<template>
  <Card class="h-full transition-colors hover:border-primary/30 hover:bg-accent/50">
    <CardContent class="flex h-full flex-col gap-4 pt-5">
      <div class="flex items-start gap-3">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60 text-foreground">
          <component
            :is="app.icon"
            class="h-5 w-5"
          />
        </div>
        <div class="min-w-0 space-y-1">
          <h3 class="text-sm font-semibold text-foreground">
            {{ app.title }}
          </h3>
          <p class="text-sm leading-6 text-muted-foreground">
            {{ app.description }}
          </p>
        </div>
      </div>

      <div class="mt-auto">
        <RouterLink :to="app.route">
          <Button
            variant="outline"
            class="w-full justify-center"
          >
            Ochish
          </Button>
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
