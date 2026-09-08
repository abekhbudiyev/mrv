import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resolveAuthorizedRedirect } from '@/core/guards/auth.guard'
import { useAuthStore } from '@/stores/auth'
import type { DemoModuleAccount } from '../data/demo-accounts'
import type { AuthMethod, LoginFormErrors, LoginFormState } from '../types'

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
    return resolveAuthorizedRedirect(router, authStore.currentUser, route.query.redirect)
  }

  function fillDemoAccount(account: DemoModuleAccount) {
    clearErrors()
    selectedMethod.value = 'password'
    form.username = account.username
    form.password = account.password
    isPasswordVisible.value = false
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

    clearErrors()
    selectedMethod.value = provider
    errors.form = `${provider === 'oneid' ? 'OneID' : 'E-IMZO'} ushbu frontend demoda ulanmagan. Demo hisobni tanlab login va parol orqali kiring.`
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
    fillDemoAccount,
    togglePasswordVisibility,
  }
}
