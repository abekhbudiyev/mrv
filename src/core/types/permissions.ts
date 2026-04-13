export type PermissionKey =
  | 'apps.view'
  | 'dashboard.view'
  | 'citizens.view'
  | 'applications.view'
  | 'benefits.view'
  | 'payments.view'
  | 'documents.view'
  | 'monitoring.view'
  | 'reports.view'
  | 'settings.view'
  | 'users.view'
  | 'muruvvat.view'

export interface RoleDefinition {
  id: string
  title: string
  permissions: PermissionKey[]
}
