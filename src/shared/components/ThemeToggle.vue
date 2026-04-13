<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/shared/ui/shadcn/button'
import { useTheme } from '@/shared/composables/use-theme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <Button
    variant="outline"
    size="icon"
    aria-label="Mavzuni almashtirish"
    @click="toggleTheme"
  >
    <Sun
      v-if="isDark"
      class="h-4 w-4"
    />
    <Moon
      v-else
      class="h-4 w-4"
    />
  </Button>
</template>
