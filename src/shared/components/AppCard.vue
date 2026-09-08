<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowUpRight, LockKeyhole } from 'lucide-vue-next'
import type { AppModule } from '@/features/apps/types'
import { useI18n } from '@/shared/i18n'
import { Card, CardContent } from '@/shared/ui/shadcn/card'

withDefaults(defineProps<{
  app: AppModule
  allowed?: boolean
}>(), { allowed: true })

const { t } = useI18n()
</script>

<template>
  <component
    :is="allowed ? RouterLink : 'div'"
    :to="allowed ? app.route : undefined"
    :role="allowed ? undefined : 'group'"
    :aria-label="allowed ? undefined : `${t(app.title)}: kirishga ruxsat yo‘q`"
    :aria-disabled="allowed ? undefined : true"
    :class="['block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background', allowed ? 'group' : '']"
  >
    <Card class="h-full transition-[background-color,box-shadow,transform] duration-150 ease-out group-hover:-translate-y-0.5 group-hover:ring-primary/25 group-hover:shadow-[0_8px_24px_rgba(15,23,18,0.07)]">
      <CardContent class="flex h-full flex-col gap-3 p-4">
        <div class="flex items-start gap-3">
          <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1', allowed ? 'bg-primary/10 text-primary ring-primary/15' : 'bg-muted text-muted-foreground ring-border']">
            <component
              :is="app.icon"
              class="h-5 w-5"
            />
          </div>
          <div class="min-w-0 space-y-1">
            <h3 class="text-sm font-semibold text-foreground">
              {{ t(app.title) }}
            </h3>
            <p class="text-sm leading-6 text-muted-foreground">
              {{ t(app.description) }}
            </p>
          </div>
        </div>

        <div :class="['mt-auto flex items-center justify-between border-t border-border pt-4 text-sm font-medium', allowed ? 'text-primary' : 'text-muted-foreground']">
          <span>{{ allowed ? t('Ochish') : 'Kirishga ruxsat yo‘q' }}</span>
          <ArrowUpRight v-if="allowed" class="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <LockKeyhole v-else class="h-4 w-4" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  </component>
</template>
