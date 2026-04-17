import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DEFAULT_AUTH_REDIRECT } from '@/core/constants/app'
import { useAuthStore } from '@/stores/auth'
import type { AuthMethod, LoginFormErrors, LoginFormState } from '../types'

const providerCredentials: Record<Exclude<AuthMethod, 'password'>, { username: string, password: string }> = {
  oneid: {
    username: 'admin',
    password: 'aBekhbudiyev.2003',
  },
  eimzo: {
    username: 'admin',
    password: 'aBekhbudiyev.2003',
  },
}

export function useLoginFlow() {
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()

  const form = reactive<LoginFormState>({
    username: '',
    password: '',
    remember: false,
  })

  const errors = reactive<LoginFormErrors>({
    username: '',
    password: '',
    form: '',
  })

  const selectedMethod = ref<AuthMethod>('password')
  const isPasswordVisible = ref(false)
  const isSubmitting = ref(false)

  const selectedProvider = computed(() =>
    selectedMethod.value === 'password' ? null : selectedMethod.value,
  )

  function clearErrors() {
    errors.username = ''
    errors.password = ''
    errors.form = ''
  }

  function clearError(field: keyof LoginFormErrors) {
    errors[field] = ''
  }

  function selectMethod(method: AuthMethod) {
    selectedMethod.value = method
    errors.form = ''

    if (method !== 'password') {
      errors.username = ''
      errors.password = ''
    }
  }

  function togglePasswordVisibility() {
    isPasswordVisible.value = !isPasswordVisible.value
  }

  function resolveRedirectTarget() {
    return typeof route.query.redirect === 'string'
      ? route.query.redirect
      : DEFAULT_AUTH_REDIRECT
  }

  function validatePasswordForm() {
    clearErrors()

    errors.username = form.username.trim() ? '' : 'Login majburiy.'
    errors.password = form.password.trim() ? '' : 'Parol majburiy.'

    return !errors.username && !errors.password
  }

  async function finalizeLogin(username: string, password: string, remember = true) {
    await authStore.login({
      username,
      password,
      remember,
    })

    await router.replace(resolveRedirectTarget())
  }

  async function submitPassword() {
    selectMethod('password')

    if (!validatePasswordForm()) {
      errors.form = 'Davom etish uchun login va parolni to‘ldiring.'
      return
    }

    isSubmitting.value = true

    try {
      await finalizeLogin(form.username, form.password, form.remember)
    }
    catch (error) {
      errors.form = error instanceof Error ? error.message : 'Kirishda xatolik yuz berdi.'
    }
    finally {
      isSubmitting.value = false
    }
  }

  async function submitProviderLogin(provider = selectedProvider.value) {
    if (!provider) {
      return
    }

    isSubmitting.value = true
    clearErrors()
    selectedMethod.value = provider

    try {
      const credentials = providerCredentials[provider]
      await finalizeLogin(credentials.username, credentials.password, true)
    }
    catch (error) {
      errors.form = error instanceof Error ? error.message : 'Kirishda xatolik yuz berdi.'
    }
    finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    selectedMethod,
    selectedProvider,
    isPasswordVisible,
    isSubmitting,
    clearError,
    selectMethod,
    submitPassword,
    submitProviderLogin,
    togglePasswordVisibility,
  }
}
