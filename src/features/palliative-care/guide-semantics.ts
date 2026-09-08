import type { GuideTone } from './guides-types'

export const guideToneLabels: Record<GuideTone, string> = {
  success: 'Tasdiqlash / bajarilgan',
  rejected: 'Rad etish / cheklov',
  cancelled: 'Bekor qilish',
  waiting: 'Kutish / qayta ko‘rish',
  action: 'Oddiy amal',
}

export const guideToneClasses: Record<GuideTone, string> = {
  success: 'border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:border-emerald-400/50 dark:bg-emerald-950 dark:text-emerald-200',
  rejected: 'border-red-600/40 bg-red-50 text-red-800 dark:border-red-400/50 dark:bg-red-950 dark:text-red-200',
  cancelled: 'border-slate-500/40 bg-slate-100 text-slate-600 dark:border-slate-400/50 dark:bg-slate-800 dark:text-slate-200',
  waiting: 'border-amber-600/40 bg-amber-50 text-amber-800 dark:border-amber-400/50 dark:bg-amber-950 dark:text-amber-200',
  action: 'border-blue-500/40 bg-blue-50 text-blue-800 dark:border-blue-400/50 dark:bg-blue-950 dark:text-blue-200',
}

const light: Record<GuideTone, [string, string, string]> = {
  success: ['#ecfdf5', '#065f46', '#059669'],
  rejected: ['#fef2f2', '#991b1b', '#dc2626'],
  cancelled: ['#f1f5f9', '#475569', '#64748b'],
  waiting: ['#fffbeb', '#92400e', '#d97706'],
  action: ['#eff6ff', '#1e40af', '#3b82f6'],
}
const dark: Record<GuideTone, [string, string, string]> = {
  success: ['#064e3b', '#a7f3d0', '#34d399'],
  rejected: ['#450a0a', '#fecaca', '#f87171'],
  cancelled: ['#1e293b', '#cbd5e1', '#94a3b8'],
  waiting: ['#451a03', '#fde68a', '#fbbf24'],
  action: ['#172554', '#bfdbfe', '#60a5fa'],
}

// Node classes are authored explicitly beside each diagram, never inferred from labels.
// Palette definitions travel with exported Mermaid sources; the renderer replaces only
// these known definitions to match its theme and embeds the result in exported SVGs.
export function withGuideSemanticPalette(definition: string, isDark = false): string {
  const source = definition.replace(/^\s*classDef guide_(?:action|success|rejected|cancelled|waiting)\s+[^\n]*$/gm, '').trimEnd()
  const palette = isDark ? dark : light
  const styles = (Object.keys(palette) as GuideTone[]).map(tone => {
    const [fill, color, stroke] = palette[tone]
    const dash = tone === 'cancelled' ? ',stroke-dasharray:5 3' : ''
    return `classDef guide_${tone} fill:${fill},color:${color},stroke:${stroke},stroke-width:2px${dash};`
  })
  return `${source}\n${styles.join('\n')}`
}
