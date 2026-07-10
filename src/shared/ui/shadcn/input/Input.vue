<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/shared/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface InputProps {
  modelValue?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  class?: string
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  autocomplete: 'off',
  disabled: false,
  readonly: false,
  clearable: true,
  class: '',
})
const attrs = useAttrs()
const inputElement = ref<HTMLInputElement | null>(null)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const canShowClearButton = computed(() => {
  return props.clearable
    && Boolean(props.modelValue)
    && !props.disabled
    && !props.readonly
    && !['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'].includes(props.type)
})

const classes = computed(() =>
  cn(
    'flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out placeholder:text-muted-foreground hover:border-ring focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:bg-muted/60 disabled:opacity-60',
    props.class,
    props.clearable && !['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'].includes(props.type) ? 'pr-8' : '',
  ),
)

function clearInput() {
  emit('update:modelValue', '')
}

function focus() {
  inputElement.value?.focus()
}

defineExpose({
  focus,
})
</script>

<template>
  <div class="relative w-full">
    <input
      ref="inputElement"
      v-bind="attrs"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :readonly="readonly"
      :class="classes"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <button
      v-if="canShowClearButton"
      type="button"
      class="absolute right-2 top-1/2 inline-flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="Tozalash"
      @click.stop="clearInput"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
