import type { Component } from 'vue'

export type AuthMethod = 'password' | 'oneid' | 'eimzo'

export interface LoginFormState {
  username: string
  password: string
  remember: boolean
}

export interface LoginFormErrors {
  username: string
  password: string
  form: string
}

export interface AuthMethodOption {
  key: AuthMethod
  title: string
  description: string
  helper: string
  badge: string
  accent: 'forest' | 'violet' | 'amber'
  icon?: Component
  imageSrc?: string
  imageAlt?: string
}
