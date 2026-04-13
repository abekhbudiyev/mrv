import type { Component } from 'vue'

export interface MuruvvatMenuItem {
  id: string
  title: string
  route?: string
  icon?: Component
  children?: MuruvvatMenuItem[]
}

export interface MuruvvatPageDefinition {
  key: string
  title: string
  description: string
  route: string
  breadcrumb: string[]
  sectionTitle?: string
  sectionDescription?: string
}
