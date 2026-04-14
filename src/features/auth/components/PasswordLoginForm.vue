<script setup lang="ts">
import { ArrowRight, Eye, EyeOff } from 'lucide-vue-next'
import type { LoginFormErrors } from '../types'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

const username = defineModel<string>('username', { default: '' })
const password = defineModel<string>('password', { default: '' })
const remember = defineModel<boolean>('remember', { default: false })

defineProps<{
  errors: LoginFormErrors
  isSubmitting: boolean
  isPasswordVisible: boolean
}>()

const emit = defineEmits<{
  submit: []
  togglePasswordVisibility: []
  forgotPassword: []
  clearError: [field: keyof LoginFormErrors]
}>()
</script>

<template>
  <form
    class="space-y-4"
    @submit.prevent="emit('submit')"
  >
    <div class="space-y-2">
      <Label
        for="username"
        class="text-sm font-medium text-foreground"
      >
        Login
      </Label>
      <Input
        id="username"
        v-model="username"
        autocomplete="username"
        placeholder="Loginni kiriting"
        class="h-[3.25rem] rounded-[1.05rem] border-border/80 bg-white px-5 text-[15px] shadow-none placeholder:text-muted-foreground/70"
        :aria-invalid="Boolean(errors.username)"
        @update:model-value="emit('clearError', 'username')"
      />
      <p
        v-if="errors.username"
        class="text-sm text-destructive"
      >
        {{ errors.username }}
      </p>
    </div>

    <div class="space-y-2">
      <Label
        for="password"
        class="text-sm font-medium text-foreground"
      >
        Parol
      </Label>
      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="isPasswordVisible ? 'text' : 'password'"
          autocomplete="current-password"
          placeholder="Parolni kiriting"
          class="h-[3.25rem] rounded-[1.05rem] border-border/80 bg-white px-5 pr-12 text-[15px] shadow-none placeholder:text-muted-foreground/70"
          :aria-invalid="Boolean(errors.password)"
          @update:model-value="emit('clearError', 'password')"
        />
        <button
          type="button"
          class="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors duration-200 ease-out hover:bg-secondary/70 hover:text-foreground"
          :aria-label="isPasswordVisible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'"
          @click="emit('togglePasswordVisibility')"
        >
          <EyeOff
            v-if="isPasswordVisible"
            class="h-[1.125rem] w-[1.125rem]"
          />
          <Eye
            v-else
            class="h-[1.125rem] w-[1.125rem]"
          />
        </button>
      </div>
      <p
        v-if="errors.password"
        class="text-sm text-destructive"
      >
        {{ errors.password }}
      </p>
    </div>

    <div class="flex items-center justify-between gap-4 text-sm">
      <label class="flex items-center gap-2.5 text-muted-foreground">
        <input
          v-model="remember"
          type="checkbox"
          class="h-[1.125rem] w-[1.125rem] rounded border-border text-primary accent-primary"
        >
        <span>Meni eslab qolish</span>
      </label>

      <button
        type="button"
        class="font-medium text-primary transition-colors duration-200 ease-out hover:text-primary-hover"
        @click="emit('forgotPassword')"
      >
        Parolni unutdingizmi?
      </button>
    </div>

    <p
      v-if="errors.form"
      class="rounded-[1rem] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
    >
      {{ errors.form }}
    </p>

    <Button
      type="submit"
      class="h-[3.25rem] w-full rounded-[1.05rem] text-base font-semibold shadow-sm"
      :disabled="isSubmitting"
    >
      <span>{{ isSubmitting ? 'Kirilmoqda' : 'Kirish' }}</span>
      <ArrowRight class="h-[1.125rem] w-[1.125rem]" />
    </Button>
  </form>
</template>
