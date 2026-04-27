<script setup lang="ts">
import { ref } from 'vue'
import { Check, Languages } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { Button } from '@/shared/ui/shadcn/button'

const languages = [
  "O'zbek",
  'Ўзбек',
  'Рус',
  'English',
]

const selectedLanguage = ref(languages[0])
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        size="icon"
        class="h-10 w-10"
        aria-label="Til tanlash"
      >
        <Languages class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="8"
        class="z-50 min-w-36 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
      >
        <DropdownMenuItem
          v-for="language in languages"
          :key="language"
          class="flex cursor-pointer items-center justify-between gap-3 rounded-sm px-2 py-2 text-sm outline-none transition-colors duration-200 ease-out hover:bg-muted"
          @select="selectedLanguage = language"
        >
          <span>{{ language }}</span>
          <Check
            v-if="selectedLanguage === language"
            class="h-4 w-4 text-primary"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
