<script setup lang="ts">
import { Button } from '@/shared/ui/shadcn/button'

type ConfirmDialogTone = 'success' | 'destructive'

interface ConfirmDialogProps {
  open: boolean
  tone?: ConfirmDialogTone
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
}

withDefaults(defineProps<ConfirmDialogProps>(), {
  tone: 'success',
  cancelLabel: 'Bekor qilish',
})

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4 dark:bg-black/60"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-2xl">
      <div class="flex items-start gap-3">
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="text-base font-semibold text-foreground">
            {{ title }}
          </p>
          <p class="mt-2 text-sm leading-6 text-muted-foreground">
            {{ description }}
          </p>
        </div>
      </div>

      <div class="mt-5 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          @click="emit('cancel')"
        >
          {{ cancelLabel }}
        </Button>
        <Button
          :variant="tone === 'success' ? 'default' : 'destructive'"
          @click="emit('confirm')"
        >
          {{ confirmLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>
