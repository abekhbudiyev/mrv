import { computed, ref } from 'vue'
import { STORAGE_KEYS } from '@/core/constants/storage'

export type ThemeMode = 'light' | 'dark'

const theme = ref<ThemeMode>('light')
let isThemeInitialized = false

function applyTheme(nextTheme: ThemeMode) {
  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
}

export function initializeTheme() {
  if (isThemeInitialized) {
    applyTheme(theme.value)
    return
  }

  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme)

  if (storedTheme === 'light' || storedTheme === 'dark') {
    theme.value = storedTheme
  }

  applyTheme(theme.value)
  isThemeInitialized = true
}

export function useTheme() {
  function setTheme(nextTheme: ThemeMode) {
    theme.value = nextTheme
    localStorage.setItem(STORAGE_KEYS.theme, nextTheme)
    applyTheme(nextTheme)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  return {
    theme: computed(() => theme.value),
    isDark: computed(() => theme.value === 'dark'),
    setTheme,
    toggleTheme,
  }
}
