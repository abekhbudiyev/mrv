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
  showIndicator?: boolean
}>(), {
  selectedValues: () => [],
  allValue: 'all',
  itemKeyPrefix: 'status-tab',
  showIndicator: true,
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
  <div class="max-w-full min-w-0 overflow-x-auto">
    <div class="inline-flex min-w-max items-center justify-start overflow-hidden rounded-lg border border-border bg-background text-muted-foreground">
      <button
        v-for="tab in tabs"
        :key="`${itemKeyPrefix}-${tab.value}`"
        type="button"
        :aria-pressed="isActive(tab.value)"
        :class="cn(
          'group inline-flex h-7 items-center justify-center gap-1.5 whitespace-nowrap border-r border-border bg-background px-2.5 text-[0.8rem] font-medium text-foreground outline-none transition-colors duration-150 last:border-r-0 hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
          isActive(tab.value) ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : '',
        )"
        @click="handleSelect($event, tab.value)"
      >
        <span
          v-if="showIndicator"
          :class="cn(
            'h-1.5 w-1.5 shrink-0 rounded-full',
            tab.dotClass,
            isActive(tab.value) ? 'opacity-100' : 'opacity-55 group-hover:opacity-100 group-focus:opacity-100',
          )"
        />
        <span class="whitespace-nowrap">{{ t(tab.label) }} ({{ tab.count }})</span>
      </button>
    </div>
  </div>
</template>
