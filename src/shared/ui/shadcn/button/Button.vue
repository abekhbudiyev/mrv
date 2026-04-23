<script setup lang="ts">
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from '@/shared/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out outline-none active:scale-[0.98] active:translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:bg-primary-hover active:shadow-inner',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-muted active:bg-accent active:shadow-inner',
        outline: 'border border-border bg-background hover:border-primary/35 hover:bg-accent hover:text-foreground active:border-primary/45 active:bg-accent active:shadow-inner',
        ghost: 'hover:bg-muted hover:text-foreground active:bg-accent active:shadow-inner',
        destructive: 'bg-destructive text-white shadow-sm hover:opacity-90 active:opacity-100 active:shadow-inner',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-5',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  class: '',
})

const classes = computed(() => cn(buttonVariants({
  variant: props.variant,
  size: props.size,
}), props.class))
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </button>
</template>
