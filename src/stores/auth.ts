import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CurrentUser, LoginPayload } from '@/core/types/auth'
import type { PermissionKey } from '@/core/types/permissions'
import { STORAGE_KEYS } from '@/core/constants/storage'
import { authenticateDemoModule, createDemoSession, createDemoUser, DEMO_ADMIN_ID, resolveDemoSession } from '@/features/auth/data/demo-accounts'

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'aBekhbudiyev.2003'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function clearPersistedSession() {
    localStorage.removeItem(STORAGE_KEYS.authSession)
    sessionStorage.removeItem(STORAGE_KEYS.authSession)
  }

  function persistSession(remember = true) {
    if (!currentUser.value) {
      clearPersistedSession()
      return
    }

    clearPersistedSession()

    const storage = remember ? localStorage : sessionStorage
    storage.setItem(STORAGE_KEYS.authSession, JSON.stringify(createDemoSession(currentUser.value)))
  }

  function restoreSession() {
    const session = localStorage.getItem(STORAGE_KEYS.authSession)
      ?? sessionStorage.getItem(STORAGE_KEYS.authSession)

    if (!session) {
      currentUser.value = null
      return
    }

    try {
      currentUser.value = resolveDemoSession(JSON.parse(session))
      if (!currentUser.value) clearPersistedSession()
    }
    catch {
      currentUser.value = null
      clearPersistedSession()
    }
  }

  async function login(payload: LoginPayload) {
    const username = payload.username.trim()
    const password = payload.password
    const user = username === DEMO_USERNAME && password === DEMO_PASSWORD
      ? createDemoUser(DEMO_ADMIN_ID)
      : authenticateDemoModule(username, password)

    if (!user) {
      throw new Error('Login yoki parol noto‘g‘ri.')
    }

    currentUser.value = user
    persistSession(payload.remember ?? true)
  }

  function logout() {
    currentUser.value = null
    persistSession()
  }

  function hasPermission(permission?: PermissionKey) {
    if (!permission) {
      return true
    }

    return currentUser.value?.permissions.includes(permission) ?? false
  }

  return {
    currentUser,
    isAuthenticated,
    hasPermission,
    login,
    logout,
    restoreSession,
  }
})
