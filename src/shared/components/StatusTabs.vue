<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'
import { useI18n } from '@/shared/i18n'

export type StatusTabItem = {
  label: string
  value: string
  count: number
  dotClass?: string
  badgeClass?: string
}

const props = withDefaults(defineProps<{
  tabs: StatusTabItem[]
  selectedValues?: string[]
  allValue?: string
  itemKeyPrefix?: string
}>(), {
  selectedValues: () => [],
  allValue: 'all',
  itemKeyPrefix: 'status-tab',
})

const emit = defineEmits<{
  select: [value: string]
}>()

const { t } = useI18n()

const selectedValues = computed(() => props.selectedValues ?? [])

function isActive(value: string) {
  return value === props.allValue
    ? selectedValues.value.length === 0
    : selectedValues.value.includes(value)
}

function handleSelect(event: MouseEvent, value: string) {
  const target = event.currentTarget as HTMLElement | null

  emit('select', value)

  window.setTimeout(() => {
    target?.blur()
  }, 0)
}
</script>

<template>
  <div class="-mt-1 max-w-full min-w-0 overflow-x-auto">
    <div class="inline-flex min-w-max items-center justify-start gap-1 rounded-2xl border border-border bg-card p-1 text-muted-foreground">
      <button
        v-for="tab in tabs"
        :key="`${itemKeyPrefix}-${tab.value}`"
        type="button"
        :aria-pressed="isActive(tab.value)"
        :class="cn(
          'group inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-transparent bg-transparent px-3.5 py-1 text-sm font-medium text-muted-foreground outline-none transition-[color,background-color,border-color,box-shadow,transform] duration-150 ease-out hover:border-primary/40 hover:bg-background hover:text-foreground active:translate-y-px active:border-primary/60 active:bg-primary/10 active:text-foreground active:ring-2 active:ring-primary/20 focus:border-primary/60 focus:bg-background focus:text-foreground focus:ring-2 focus:ring-primary/25 focus-visible:border-primary/60 focus-visible:bg-background focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-50',
          isActive(tab.value) ? 'border-primary/60 bg-background text-foreground ring-2 ring-primary/25' : '',
        )"
        @click="handleSelect($event, tab.value)"
      >
        <span
          :class="cn(
            'h-2 w-2 shrink-0 rounded-full',
            tab.dotClass,
            isActive(tab.value) ? 'opacity-100' : 'opacity-55 group-hover:opacity-100 group-focus:opacity-100',
          )"
        />
        <span class="whitespace-nowrap group-hover:text-foreground group-focus:text-foreground">{{ t(tab.label) }}</span>
        <span
          :class="cn(
            'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold transition-colors duration-150 group-hover:bg-primary/10 group-hover:text-foreground group-focus:bg-primary/10 group-focus:text-foreground',
            isActive(tab.value) ? tab.badgeClass : 'bg-muted text-muted-foreground',
          )"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>
