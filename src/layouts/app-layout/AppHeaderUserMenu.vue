<script setup lang="ts">
import { computed } from 'vue'
import { LogOut, UserRound } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/shared/ui/shadcn/button'

const authStore = useAuthStore()
const router = useRouter()

const userLabel = computed(() => authStore.currentUser?.fullName ?? 'Operator')
const userRole = computed(() => authStore.currentUser?.role ?? 'Foydalanuvchi')

async function handleLogout() {
  authStore.logout()
  await router.replace('/login')
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        class="justify-between gap-3 px-3"
      >
        <div class="flex items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
            <UserRound class="h-4 w-4" />
          </div>
          <div class="hidden text-left sm:block">
            <div class="text-sm font-medium">
              {{ userLabel }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ userRole }}
            </div>
          </div>
        </div>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        align="end"
        :side-offset="8"
        class="z-50 min-w-56 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
      >
        <DropdownMenuLabel class="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Profil maydoni
        </DropdownMenuLabel>
        <DropdownMenuItem class="rounded-sm px-2 py-2 text-sm text-muted-foreground outline-none">
          Profil ma'lumotlari keyinroq qo‘shiladi
        </DropdownMenuItem>
        <DropdownMenuItem class="rounded-sm px-2 py-2 text-sm text-muted-foreground outline-none">
          Ruxsatlar va rollar integratsiyasi rejalashtirilgan
        </DropdownMenuItem>
        <DropdownMenuSeparator class="my-1 h-px bg-border" />
        <DropdownMenuItem
          class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
          @select.prevent="handleLogout"
        >
          <LogOut class="h-4 w-4" />
          <span>Chiqish</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
