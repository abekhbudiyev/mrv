<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'

interface InputProps {
  modelValue?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  readonly?: boolean
  class?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  autocomplete: 'off',
  disabled: false,
  readonly: false,
  class: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const classes = computed(() =>
  cn(
    'flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    props.class,
  ),
)
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :readonly="readonly"
    :class="classes"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
