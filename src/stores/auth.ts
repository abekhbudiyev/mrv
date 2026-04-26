import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CurrentUser, LoginPayload } from '@/core/types/auth'
import type { PermissionKey } from '@/core/types/permissions'
import { STORAGE_KEYS } from '@/core/constants/storage'

const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'aBekhbudiyev.2003'

const mockPermissions: PermissionKey[] = [
  'apps.view',
  'iptk.view',
  'dashboard.view',
  'citizens.view',
  'applications.view',
  'benefits.view',
  'payments.view',
  'documents.view',
  'monitoring.view',
  'reports.view',
  'settings.view',
  'users.view',
  'muruvvat.view',
]

function buildMockUser(username: string): CurrentUser {
  const normalized = username.trim()

  return {
    id: 'mock-user',
    username: normalized,
    fullName: normalized,
    role: 'Ichki operator',
    permissions: mockPermissions,
  }
}

function normalizePersistedSession(user: CurrentUser): CurrentUser {
  if (user.id !== 'mock-user') {
    return user
  }

  return {
    ...user,
    permissions: Array.from(new Set([
      ...(user.permissions ?? []),
      ...mockPermissions,
    ])),
  }
}

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
    storage.setItem(STORAGE_KEYS.authSession, JSON.stringify(currentUser.value))
  }

  function restoreSession() {
    const session = localStorage.getItem(STORAGE_KEYS.authSession)
      ?? sessionStorage.getItem(STORAGE_KEYS.authSession)

    if (!session) {
      currentUser.value = null
      return
    }

    try {
      currentUser.value = normalizePersistedSession(JSON.parse(session) as CurrentUser)
    }
    catch {
      currentUser.value = null
      clearPersistedSession()
    }
  }

  async function login(payload: LoginPayload) {
    const username = payload.username.trim()
    const password = payload.password.trim()

    if (username !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      throw new Error('Login yoki parol noto‘g‘ri.')
    }

    currentUser.value = buildMockUser(username)
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
