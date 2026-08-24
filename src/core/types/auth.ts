import type { PermissionKey } from './permissions'

export interface CurrentUser {
  id: string
  username: string
  fullName: string
  role: string
  permissions: PermissionKey[]
  organizationId?: string
  signatureRef?: string
}

export interface LoginPayload {
  username: string
  password: string
  remember?: boolean
}
