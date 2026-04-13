import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { CurrentUser, LoginPayload } from '@/core/types/auth'
import type { PermissionKey } from '@/core/types/permissions'
import { STORAGE_KEYS } from '@/core/constants/storage'

const mockPermissions: PermissionKey[] = [
  'apps.view',
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

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<CurrentUser | null>(null)
  const isAuthenticated = computed(() => currentUser.value !== null)

  function persistSession() {
    if (!currentUser.value) {
      localStorage.removeItem(STORAGE_KEYS.authSession)
      return
    }

    localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(currentUser.value))
  }

  function restoreSession() {
    const session = localStorage.getItem(STORAGE_KEYS.authSession)

    if (!session) {
      currentUser.value = null
      return
    }

    try {
      currentUser.value = JSON.parse(session) as CurrentUser
    }
    catch {
      currentUser.value = null
      localStorage.removeItem(STORAGE_KEYS.authSession)
    }
  }

  async function login(payload: LoginPayload) {
    currentUser.value = buildMockUser(payload.username)
    persistSession()
  }

  function logout() {
    currentUser.value = null
    persistSession()
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    restoreSession,
  }
})
