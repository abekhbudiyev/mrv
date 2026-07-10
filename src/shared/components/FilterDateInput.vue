<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { CalendarDays, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  placeholder?: string
}>(), {
  placeholder: 'dd.mm.yyyy',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isOpen = ref(false)
const calendarMonth = ref(getMonthFromValue(props.modelValue))
const rootElement = ref<HTMLElement | null>(null)
const outsideListenerOptions = { capture: true }

const monthNames = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
]
const calendarWeekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

const calendarMonthLabel = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')

  if (!year || !month) {
    return ''
  }

  return `${monthNames[Number(month) - 1] ?? ''} ${year}`.trim()
})

const calendarDays = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return []
  }

  const year = Number(yearString)
  const monthIndex = Number(monthString) - 1
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const days: Array<{ key: string, label: string, value: string, isCurrentMonth: boolean }> = []

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push({
      key: `empty-start-${index}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayValue = String(day).padStart(2, '0')
    days.push({
      key: `${yearString}-${monthString}-${dayValue}`,
      label: String(day),
      value: `${yearString}-${monthString}-${dayValue}`,
      isCurrentMonth: true,
    })
  }

  while (days.length % 7 !== 0) {
    days.push({
      key: `empty-end-${days.length}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  return days
})

function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

function parseDisplayDateToIso(value: string) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (isoMatch) {
    return value
  }

  const displayMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)

  if (!displayMatch) {
    return ''
  }

  const [, day, month, year] = displayMatch
  const isoDate = `${year}-${month}-${day}`
  const date = new Date(`${isoDate}T00:00:00`)

  if (
    Number.isNaN(date.getTime())
    || date.getFullYear() !== Number(year)
    || date.getMonth() + 1 !== Number(month)
    || date.getDate() !== Number(day)
  ) {
    return ''
  }

  return isoDate
}

function formatIsoDateForInput(value: string) {
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!isoMatch) {
    return value
  }

  return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}`
}

function normalizeInputValue(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 8),
  ].filter(Boolean)

  return parts.join('.')
}

function getMonthFromValue(value: string) {
  return (parseDisplayDateToIso(value) || getTodayIso()).slice(0, 7)
}

function openCalendar() {
  calendarMonth.value = getMonthFromValue(props.modelValue)
  isOpen.value = true
}

function toggleCalendar() {
  if (isOpen.value) {
    isOpen.value = false
    return
  }

  openCalendar()
}

function handleOutsidePointerDown(event: PointerEvent | MouseEvent | TouchEvent) {
  if (!isOpen.value) {
    return
  }

  const root = rootElement.value
  const eventPath = event.composedPath()

  if (root && eventPath.includes(root)) {
    return
  }

  isOpen.value = false
}

function shiftCalendarMonth(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString), Number(monthString) - 1 + direction, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shiftCalendarYear(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString) + direction, Number(monthString) - 1, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectCalendarDate(value: string) {
  emit('update:modelValue', formatIsoDateForInput(value))
  isOpen.value = false
}

function handleInputValueChange(value: string | number) {
  emit('update:modelValue', normalizeInputValue(String(value)))
}

function preventDateNonDigitBeforeInput(event: InputEvent) {
  if (!event.data) {
    return
  }

  if (/\D/.test(event.data)) {
    event.preventDefault()
  }
}

function handleDatePaste(event: ClipboardEvent) {
  const clipboardText = event.clipboardData?.getData('text') ?? ''
  emit('update:modelValue', normalizeInputValue(clipboardText))
}

function preventDateNonDigitKeydown(event: KeyboardEvent) {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
    return
  }

  const input = event.target as HTMLInputElement | null
  const currentDigits = input?.value.replace(/\D/g, '') ?? ''
  const selectionStart = input?.selectionStart ?? currentDigits.length
  const selectionEnd = input?.selectionEnd ?? selectionStart
  const selectedDigits = input?.value.slice(selectionStart, selectionEnd).replace(/\D/g, '').length ?? 0

  if (currentDigits.length - selectedDigits >= 8) {
    event.preventDefault()
  }
}

function isCalendarDateSelected(value: string) {
  return parseDisplayDateToIso(props.modelValue) === value
}

onMounted(() => {
  window.addEventListener('pointerdown', handleOutsidePointerDown, outsideListenerOptions)
  window.addEventListener('mousedown', handleOutsidePointerDown, outsideListenerOptions)
  window.addEventListener('touchstart', handleOutsidePointerDown, outsideListenerOptions)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', handleOutsidePointerDown, outsideListenerOptions)
  window.removeEventListener('mousedown', handleOutsidePointerDown, outsideListenerOptions)
  window.removeEventListener('touchstart', handleOutsidePointerDown, outsideListenerOptions)
})
</script>

<template>
  <div ref="rootElement" class="space-y-2 text-sm xl:relative xl:space-y-0">
    <span class="font-medium text-foreground">{{ label }}</span>

    <div class="relative space-y-2 xl:mt-2 xl:space-y-0">
      <div class="relative">
        <Input
          :model-value="modelValue"
          class="h-10 pr-10"
          :aria-label="label"
          inputmode="numeric"
          maxlength="10"
          :placeholder="placeholder"
          @focus="openCalendar"
          @click="openCalendar"
          @beforeinput="preventDateNonDigitBeforeInput"
          @paste.prevent="handleDatePaste"
          @keydown="preventDateNonDigitKeydown"
          @update:model-value="handleInputValueChange"
        />
        <button
          type="button"
          class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
          :aria-label="`${label} kalendarini ochish`"
          @click="toggleCalendar"
        >
          <CalendarDays class="h-4 w-4" />
        </button>
      </div>

      <div
        v-if="isOpen"
        class="rounded-lg border border-border bg-background p-3 shadow-sm xl:absolute xl:left-0 xl:right-0 xl:top-[calc(100%+0.5rem)] xl:z-20"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              aria-label="Oldingi yil"
              @click="shiftCalendarYear(-1)"
            >
              <ChevronsLeft class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              aria-label="Oldingi oy"
              @click="shiftCalendarMonth(-1)"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
          </div>

          <p class="text-sm font-medium text-foreground">
            {{ calendarMonthLabel }}
          </p>

          <div class="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              aria-label="Keyingi oy"
              @click="shiftCalendarMonth(1)"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0"
              aria-label="Keyingi yil"
              @click="shiftCalendarYear(1)"
            >
              <ChevronsRight class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          <span
            v-for="weekday in calendarWeekdays"
            :key="weekday"
            class="py-1"
          >
            {{ weekday }}
          </span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="day in calendarDays"
            :key="day.key"
            type="button"
            class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
            :class="day.isCurrentMonth
              ? isCalendarDateSelected(day.value)
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
              : 'pointer-events-none opacity-0'"
            :disabled="!day.isCurrentMonth"
            @click="selectCalendarDate(day.value)"
          >
            {{ day.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
