<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, ChevronDown, Search } from 'lucide-vue-next'
import { Input } from '@/shared/ui/shadcn/input'
import { cn } from '@/shared/lib/utils'

const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  options: string[]
  allLabel?: string
  searchPlaceholder?: string
  disabled?: boolean
  searchable?: boolean
}>(), {
  allLabel: 'Barchasi',
  searchPlaceholder: 'Qidirish',
  disabled: false,
  searchable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<InstanceType<typeof Input> | null>(null)
const rootElement = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => props.modelValue || props.allLabel)
const filteredOptions = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('uz-UZ')

  if (!query) {
    return props.options
  }

  return props.options.filter((option) => option.toLocaleLowerCase('uz-UZ').includes(query))
})

watch(() => props.disabled, (disabled) => {
  if (disabled) {
    isOpen.value = false
  }
})

watch(isOpen, async (open) => {
  if (!open || !props.searchable) {
    return
  }

  await nextTick()
  searchInputRef.value?.focus()
})

function toggleOpen() {
  if (props.disabled) {
    return
  }

  isOpen.value = !isOpen.value
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  isOpen.value = false
  searchQuery.value = ''
}

function closeSelect() {
  isOpen.value = false
  searchQuery.value = ''
}

function handleOutsidePointerDown(event: PointerEvent) {
  if (!isOpen.value || rootElement.value?.contains(event.target as Node)) {
    return
  }

  closeSelect()
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeSelect()
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
  <div ref="rootElement" class="space-y-2 text-sm xl:relative xl:space-y-0">
    <span class="font-medium text-foreground">{{ label }}</span>

    <div class="space-y-2 xl:mt-2 xl:space-y-0">
      <button
        type="button"
        :disabled="disabled"
        :aria-label="label"
        :aria-expanded="isOpen"
        :class="[
          'flex h-8 w-full items-center justify-between rounded-lg border bg-background px-2.5 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50',
          isOpen
            ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
            : 'border-input hover:border-ring',
        ]"
        @click="toggleOpen"
      >
        <span class="truncate">{{ selectedLabel }}</span>
        <ChevronDown
          :class="cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
            isOpen ? 'rotate-180' : '',
          )"
        />
      </button>

      <div
        v-if="isOpen"
        class="overflow-hidden rounded-md border border-border bg-background p-1 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
      >
        <div
          v-if="searchable"
          class="mb-1"
        >
          <div class="relative">
            <Search class="pointer-events-none absolute z-10 left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref="searchInputRef"
              v-model="searchQuery"
              class="h-8 pl-8 text-xs"
              :placeholder="searchPlaceholder"
              @click.stop
              @keydown.stop
            />
          </div>
        </div>

        <div class="max-h-52 overflow-y-auto pr-1">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
            @click.stop.prevent="selectOption('')"
          >
            <span>{{ allLabel }}</span>
            <Check
              v-if="!modelValue"
              class="h-4 w-4 text-primary"
            />
          </button>

          <button
            v-for="option in filteredOptions"
            :key="option"
            type="button"
            class="flex w-full items-center justify-between rounded-sm px-3 py-1.5 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
            @click.stop.prevent="selectOption(option)"
          >
            <span>{{ option }}</span>
            <Check
              v-if="modelValue === option"
              class="h-4 w-4 text-primary"
            />
          </button>

          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-2 text-sm text-muted-foreground"
          >
            Ma'lumot topilmadi
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
