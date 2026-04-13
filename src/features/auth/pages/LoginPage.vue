<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff } from 'lucide-vue-next'
import logoMark from '@/assets/logo-mark.svg'
import oneIdIcon from '@/assets/oneid-icon.svg'
import eImzoLogo from '@/assets/e-imzo-logo.png'
import { DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

type AuthMethod = 'password' | 'oneid' | 'eimzo'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const errors = reactive({
  username: '',
  password: '',
})

const selectedMethod = ref<AuthMethod>('password')
const isPasswordVisible = ref(false)
const isSubmitting = ref(false)

function clearFormErrors() {
  errors.username = ''
  errors.password = ''
}

function validate() {
  clearFormErrors()
  errors.username = form.username.trim() ? '' : 'Login majburiy.'
  errors.password = form.password.trim() ? '' : 'Parol majburiy.'

  return !errors.username && !errors.password
}

async function finalizeLogin(username: string, password: string) {
  await authStore.login({
    username,
    password,
  })

  const redirect = typeof route.query.redirect === 'string'
    ? route.query.redirect
    : DEFAULT_AUTH_REDIRECT

  await router.replace(redirect)
}

async function handleSubmit() {
  selectedMethod.value = 'password'

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    await finalizeLogin(form.username, form.password)
  }
  finally {
    isSubmitting.value = false
  }
}

async function loginWithProvider(provider: 'oneid' | 'eimzo') {
  isSubmitting.value = true
  clearFormErrors()
  selectedMethod.value = provider

  const username = provider === 'oneid' ? 'oneid.operator' : 'eimzo.operator'

  try {
    await finalizeLogin(username, provider)
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f4f8f4] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
      <Card class="w-full rounded-[1.75rem] border border-border/70 bg-white shadow-[0_20px_60px_rgba(48,68,47,0.10)]">
        <CardContent class="space-y-6 p-5 sm:p-6">
          <div class="flex items-center gap-3">
            <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] border border-border/80 bg-[#eef6ec] p-2 shadow-sm">
              <img
                :src="logoMark"
                alt="IHMA"
                class="h-full w-full object-contain"
              />
            </div>

            <div class="space-y-0.5">
              <p class="text-lg font-semibold text-foreground sm:text-xl">
                IHMA axborot tizimi
              </p>
              <p class="text-sm text-muted-foreground sm:text-base">
                Tizimga kirish
              </p>
            </div>
          </div>

          <form
            class="space-y-4"
            @submit.prevent="handleSubmit"
          >
            <div class="space-y-2">
              <Label
                for="username"
                class="text-base font-semibold text-foreground"
              >
                Login
              </Label>
              <Input
                id="username"
                v-model="form.username"
                autocomplete="username"
                placeholder="Loginni kiriting"
                class="h-14 rounded-[1.2rem] border-border/80 bg-white px-5 text-xl shadow-none placeholder:text-muted-foreground/75"
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
                class="text-base font-semibold text-foreground"
              >
                Parol
              </Label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="form.password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Parolni kiriting"
                  class="h-14 rounded-[1.2rem] border-border/80 bg-white px-5 pr-14 text-xl shadow-none placeholder:text-muted-foreground/75"
                />
                <button
                  type="button"
                  class="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/80 hover:text-foreground"
                  :aria-label="isPasswordVisible ? 'Parolni yashirish' : 'Parolni ko‘rsatish'"
                  @click="isPasswordVisible = !isPasswordVisible"
                >
                  <EyeOff
                    v-if="isPasswordVisible"
                    class="h-4.5 w-4.5"
                  />
                  <Eye
                    v-else
                    class="h-4.5 w-4.5"
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

            <div class="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label class="flex items-center gap-2.5 text-muted-foreground">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4.5 w-4.5 rounded border-border text-primary accent-primary focus:ring-primary"
                >
                <span>Meni eslab qolish</span>
              </label>

              <button
                type="button"
                class="text-left font-medium text-primary transition-colors hover:text-primary/80 sm:text-right"
              >
                Parolni unutdingizmi?
              </button>
            </div>

            <Button
              type="submit"
              class="h-14 w-full rounded-[1.2rem] text-xl font-semibold shadow-sm"
              :disabled="isSubmitting"
            >
              <span>{{ isSubmitting && selectedMethod === 'password' ? 'Kirilmoqda' : 'Kirish' }}</span>
              <ArrowRight class="h-5 w-5" />
            </Button>
          </form>

          <div class="flex items-center gap-3 py-1 text-sm text-muted-foreground">
            <div class="h-px flex-1 bg-border/80" />
            <span>yoki boshqa usul bilan</span>
            <div class="h-px flex-1 bg-border/80" />
          </div>

          <div class="grid gap-3">
            <button
              type="button"
              class="flex items-center gap-3 rounded-[1.2rem] border border-border/80 bg-white px-4 py-3 text-left transition-all hover:border-primary/35 hover:bg-[#f7fbf6]"
              :class="selectedMethod === 'oneid' ? 'border-primary/50 bg-[#f3f8f2] ring-2 ring-primary/15' : ''"
              :disabled="isSubmitting"
              @click="loginWithProvider('oneid')"
            >
              <div class="flex h-14 w-24 items-center justify-center overflow-hidden rounded-[0.9rem] bg-[#4b2bc8] px-3">
                <img
                  :src="oneIdIcon"
                  alt="OneID"
                  class="h-7 w-7 object-contain brightness-0 invert"
                />
              </div>

              <div class="space-y-0.5">
                <p class="text-base font-semibold text-foreground">
                  OneID orqali kirish
                </p>
                <p class="text-sm leading-snug text-muted-foreground">
                  Yagona identifikatsiya tizimi bilan kirish
                </p>
              </div>
            </button>

            <button
              type="button"
              class="flex items-center gap-3 rounded-[1.2rem] border border-border/80 bg-white px-4 py-3 text-left transition-all hover:border-primary/35 hover:bg-[#f7fbf6]"
              :class="selectedMethod === 'eimzo' ? 'border-primary/50 bg-[#f3f8f2] ring-2 ring-primary/15' : ''"
              :disabled="isSubmitting"
              @click="loginWithProvider('eimzo')"
            >
              <div class="flex h-14 w-24 items-center justify-center overflow-hidden rounded-[0.9rem] bg-[#f4f8f2] px-3 ring-1 ring-border/70">
                <img
                  :src="eImzoLogo"
                  alt="E-IMZO"
                  class="h-5 w-auto object-contain"
                />
              </div>

              <div class="space-y-0.5">
                <p class="text-base font-semibold text-foreground">
                  E-IMZO orqali kirish
                </p>
                <p class="text-sm leading-snug text-muted-foreground">
                  Elektron raqamli imzo bilan kirish
                </p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
