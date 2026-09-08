<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{ open: boolean; title: string; description?: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>()
const headingId = `palliative-dialog-${Math.random().toString(36).slice(2)}`
watch(() => props.open, async (open) => {
  await nextTick()
  if (open && !dialog.value?.open) dialog.value?.showModal()
  if (!open && dialog.value?.open) dialog.value.close()
}, { immediate: true })
onBeforeUnmount(() => dialog.value?.close())
</script>

<template>
  <dialog ref="dialog" :aria-labelledby="headingId" class="pc-dialog" @cancel.prevent="emit('close')" @click="(event) => event.target === dialog && emit('close')">
    <section class="pc-dialog-surface">
      <header class="flex items-start justify-between gap-4 border-b border-border p-5 sm:px-7">
        <div><h2 :id="headingId" class="text-lg font-semibold">{{ title }}</h2><p v-if="description" class="mt-1 text-sm leading-6 text-muted-foreground">{{ description }}</p></div>
        <button type="button" aria-label="Oynani yopish" class="rounded-lg p-2 text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary" @click="emit('close')"><X class="h-5 w-5" /></button>
      </header>
      <div class="p-5 sm:p-7"><slot /></div>
    </section>
  </dialog>
</template>

<style scoped>
.pc-dialog { margin: auto; padding: 0; border: 1px solid var(--border); border-radius: 18px; width: min(760px, calc(100vw - 24px)); max-height: calc(100dvh - 32px); color: var(--foreground); background: var(--card); overflow: auto; box-shadow: 0 28px 100px #0003; }
.pc-dialog::backdrop { background: #142e2c70; backdrop-filter: blur(3px); }
.pc-dialog-surface { min-width: 0; }
</style>
