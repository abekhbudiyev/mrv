import type { Component } from 'vue'
import type { PermissionKey } from '@/core/types/permissions'

export interface AppModule {
  id: string
  title: string
  description: string
  route: string
  icon: Component
  enabled: boolean
  permission?: PermissionKey
  hasInternalNavigation?: boolean
}
