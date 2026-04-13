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
  <div class="min-h-screen bg-[#eef4ee] px-4 py-4 sm:px-6 sm:py-6">
    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1440px] items-center justify-center sm:min-h-[calc(100vh-3rem)]">
      <Card class="w-full max-w-[520px] rounded-[2rem] border border-[#e8eee6] bg-white shadow-[0_30px_80px_rgba(41,60,42,0.12)]">
        <CardContent class="space-y-6 p-6 sm:p-8">
          <div class="flex items-center gap-3">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] border border-[#dce8da] bg-[#eef6ec] p-2">
              <img
                :src="logoMark"
                alt="IHMA"
                class="h-full w-full object-contain"
              >
            </div>
            <div class="space-y-0.5">
              <p class="text-lg font-semibold text-foreground">
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

          <div class="flex items-center gap-3 text-sm text-muted-foreground">
            <div class="h-px flex-1 bg-border" />
            <span>yoki boshqa usul bilan</span>
            <div class="h-px flex-1 bg-border" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              class="h-14 justify-center rounded-[1.15rem] px-4"
              :class="selectedMethod === 'oneid' ? 'border-[#4b2bc8]/35 bg-[#f5f1ff]' : ''"
              :disabled="isSubmitting"
              @click="submitProviderLogin('oneid')"
            >
              <span class="flex h-10 w-18 items-center justify-center rounded-[0.9rem] bg-[#4b2bc8]">
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
              class="h-14 justify-center rounded-[1.15rem] px-4"
              :class="selectedMethod === 'eimzo' ? 'border-[#d9c77e]/55 bg-[#fffbec]' : ''"
              :disabled="isSubmitting"
              @click="submitProviderLogin('eimzo')"
            >
              <span class="flex h-10 w-18 items-center justify-center rounded-[0.9rem] bg-[#f6f7ef] ring-1 ring-border/70">
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
