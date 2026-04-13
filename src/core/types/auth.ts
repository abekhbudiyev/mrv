import type { PermissionKey } from './permissions'

export interface CurrentUser {
  id: string
  username: string
  fullName: string
  role: string
  permissions: PermissionKey[]
}

export interface LoginPayload {
  username: string
  password: string
}
