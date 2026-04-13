<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { APP_TITLE, DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import { Label } from '@/shared/ui/shadcn/label'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive({
  username: '',
  password: '',
})

const isSubmitting = ref(false)

function validate() {
  errors.username = form.username.trim() ? '' : 'Login majburiy.'
  errors.password = form.password.trim() ? '' : 'Parol majburiy.'

  return !errors.username && !errors.password
}

async function handleSubmit() {
  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    await authStore.login({
      username: form.username,
      password: form.password,
    })

    const redirect = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : DEFAULT_AUTH_REDIRECT

    await router.replace(redirect)
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4 py-10">
    <div class="w-full max-w-md">
      <Card>
        <CardHeader class="space-y-2">
          <CardTitle class="text-xl">
            {{ APP_TITLE }}
          </CardTitle>
          <CardDescription class="leading-6">
            Ichki foydalanuvchilar uchun minimal kirish sahifasi. Bu starter skeletda autentifikatsiya mock holatda ishlaydi.
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-5">
          <form
            class="space-y-4"
            @submit.prevent="handleSubmit"
          >
            <div class="space-y-2">
              <Label for="username">Login</Label>
              <Input
                id="username"
                v-model="form.username"
                autocomplete="username"
                placeholder="Loginni kiriting"
              />
              <p
                v-if="errors.username"
                class="text-xs text-destructive"
              >
                {{ errors.username }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="password">Parol</Label>
              <Input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                placeholder="Parolni kiriting"
              />
              <p
                v-if="errors.password"
                class="text-xs text-destructive"
              >
                {{ errors.password }}
              </p>
            </div>

            <Button
              type="submit"
              class="w-full"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Kirilmoqda...' : 'Tizimga kirish' }}
            </Button>
          </form>

          <div class="rounded-md border border-dashed border-border bg-muted/30 px-4 py-3 text-sm leading-6 text-muted-foreground">
            Starter rejimida istalgan bo‘sh bo‘lmagan login va parol bilan tizimga kirish mumkin.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
