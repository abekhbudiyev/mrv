<script setup lang="ts">
import PasswordLoginForm from '../components/PasswordLoginForm.vue'
import { useLoginFlow } from '../composables/useLoginFlow'
import logoMark from '@/assets/logo-mark.svg'
import oneIdIcon from '@/assets/oneid-icon.svg'
import eImzoLogo from '@/assets/e-imzo-logo.png'
import { APP_TITLE } from '@/core/constants/app'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'

const {
  form,
  errors,
  selectedMethod,
  isPasswordVisible,
  isSubmitting,
  clearError,
  submitPassword,
  submitProviderLogin,
  togglePasswordVisibility,
} = useLoginFlow()

function handleForgotPassword() {
  errors.form = 'Parolni tiklash uchun tizim administratoriga murojaat qiling.'
}
</script>

<template>
  <div class="min-h-screen bg-muted/45 px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] items-center justify-center sm:min-h-[calc(100vh-3rem)]">
      <Card class="w-full max-w-[460px] rounded-lg border border-border bg-card shadow-[0_20px_55px_rgba(15,23,18,0.11)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <CardContent class="space-y-6 p-6 sm:p-7">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/7 p-1.5">
              <img
                :src="logoMark"
                alt="IHMA"
                class="h-full w-full object-contain"
              >
            </div>
            <div class="space-y-0.5">
              <p class="text-base font-semibold text-foreground">
                {{ APP_TITLE }}
              </p>
              <p class="text-sm text-muted-foreground">
                Tizimga kirish
              </p>
            </div>
          </div>

          <PasswordLoginForm
            v-model:username="form.username"
            v-model:password="form.password"
            v-model:remember="form.remember"
            :errors="errors"
            :is-submitting="isSubmitting"
            :is-password-visible="isPasswordVisible"
            @submit="submitPassword"
            @toggle-password-visibility="togglePasswordVisibility"
            @forgot-password="handleForgotPassword"
            @clear-error="clearError"
          />

          <div class="flex items-center gap-3 text-xs text-muted-foreground">
            <div class="h-px flex-1 bg-border" />
            <span>yoki boshqa usul bilan</span>
            <div class="h-px flex-1 bg-border" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              class="h-12 justify-center rounded-md px-3 transition-colors duration-150 ease-out"
              :class="selectedMethod === 'oneid' ? 'border-[#4b2bc8]/35 bg-[#f5f1ff]' : ''"
              :disabled="isSubmitting"
              @click="submitProviderLogin('oneid')"
            >
              <span class="flex h-8 w-16 items-center justify-center rounded-md bg-[#4b2bc8]">
                <img
                  :src="oneIdIcon"
                  alt="OneID"
                  class="h-5 w-5 object-contain brightness-0 invert"
                >
              </span>
            </Button>

            <Button
              type="button"
              variant="outline"
              class="h-12 justify-center rounded-md px-3 transition-colors duration-150 ease-out"
              :class="selectedMethod === 'eimzo' ? 'border-[#d9c77e]/55 bg-[#fffbec]' : ''"
              :disabled="isSubmitting"
              @click="submitProviderLogin('eimzo')"
            >
              <span class="flex h-8 w-16 items-center justify-center rounded-md bg-[#f6f7ef] ring-1 ring-border/70">
                <img
                  :src="eImzoLogo"
                  alt="E-IMZO"
                  class="h-[1.375rem] w-auto object-contain"
                >
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
