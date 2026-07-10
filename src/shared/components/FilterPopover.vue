<script setup lang="ts">
import { Filter, X } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref, type StyleValue } from 'vue'
import { Button } from '@/shared/ui/shadcn/button'
import { cn } from '@/shared/lib/utils'

const props = withDefaults(defineProps<{
  open: boolean
  activeCount?: number
  title?: string
  buttonLabel?: string
  closeLabel?: string
  wrapperClass?: string
  panelClass?: string
  contentClass?: string
  contentStyle?: StyleValue
}>(), {
  activeCount: 0,
  title: 'Filterlar',
  buttonLabel: 'Filter',
  closeLabel: 'Filterni yopish',
  wrapperClass: '',
  panelClass: '',
  contentClass: '',
  contentStyle: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
const rootElement = ref<HTMLElement | null>(null)

const overlayClass = 'fixed inset-0 z-40 bg-background/40 xl:hidden'
const panelClass = 'fixed inset-x-3 top-24 z-50 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-xl outline-none xl:absolute xl:left-auto xl:right-0 xl:top-[calc(100%+0.5rem)] xl:w-[22rem] xl:max-h-[min(34rem,calc(100vh-10rem))] xl:p-3.5 xl:origin-top-right'

function setOpen(nextOpen: boolean) {
  emit('update:open', nextOpen)
}

function toggleOpen() {
  setOpen(!props.open)
}

function handleOutsidePointerDown(event: PointerEvent) {
  if (!props.open || rootElement.value?.contains(event.target as Node)) {
    return
  }

  setOpen(false)
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    setOpen(false)
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsidePointerDown, true)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleOutsidePointerDown, true)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div ref="rootElement" :class="cn('relative', wrapperClass)">
    <div
      v-if="open"
      :class="overlayClass"
      @click="setOpen(false)"
    />

    <Button
      variant="outline"
      :class="open ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
      :aria-expanded="open"
      @click="toggleOpen"
    >
      <span
        v-if="activeCount > 0"
        class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
      >
        {{ activeCount }}
      </span>
      <Filter
        v-else
        class="h-4 w-4"
      />
      <span>{{ buttonLabel }}</span>
    </Button>

    <div
      v-if="open"
      :class="cn(panelClass, props.panelClass)"
    >
      <div
        :class="cn('flex flex-col gap-3', contentClass)"
        :style="contentStyle"
      >
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm font-semibold text-foreground">
            {{ title }}
          </p>

          <Button
            variant="ghost"
            size="sm"
            class="h-8 w-8 p-0"
            :aria-label="closeLabel"
            @click="setOpen(false)"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>

        <slot />

        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
