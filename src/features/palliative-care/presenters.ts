import { activeEpisode, latestAssessment } from './domain'
import type { CaseStatus, PalliativeCase } from './types'

export const stateTones = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200',
  warning: 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200',
  danger: 'border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200',
  neutral: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
  info: 'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200',
  family: 'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700 dark:bg-violet-950/40 dark:text-violet-200',
} as const
export function statusTone(status: CaseStatus) {
  if (status === 'APPROVED') return stateTones.success
  if (['PAUSED', 'CONSILIUM', 'REFERRAL'].includes(status)) return stateTones.warning
  if (status === 'REJECTED') return stateTones.danger
  if (['FOLLOW_UP', 'BEREAVEMENT'].includes(status)) return stateTones.family
  return status === 'CLOSED' ? stateTones.neutral : stateTones.info
}
export function decisionTone(outcome: string) { return outcome === 'APPROVE' ? stateTones.success : outcome === 'REJECT' ? stateTones.danger : stateTones.warning }
export function visitTone(status: string) { return status === 'COMPLETED' ? stateTones.success : status === 'CANCELLED' ? stateTones.neutral : status === 'IN_PROGRESS' ? stateTones.info : stateTones.warning }
export function taskTone(status: string) { return status === 'DONE' ? stateTones.success : status === 'CANCELLED' ? stateTones.neutral : stateTones.warning }
export function initials(name: string) { return name.replace(/Namuna\s*[-—:]?\s*/gi, '').split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('') }
export function medicalIndicationLabel(value: string) {
  const labels: Record<string, string> = {
    NEUROLOGICAL: 'Asab tizimi kasalliklari',
    NEUROMUSCULAR: 'Progressiyalanuvchi nerv-mushak kasalliklari',
    GENETIC: 'Genetik, irsiy va orfan kasalliklar',
    ONCOLOGICAL: 'Onkologik va onkogematologik kasalliklar',
  }
  return labels[value] ?? value
}
export function nextStep(item: PalliativeCase): { title: string; detail: string; owner: string; route?: string } {
  const base = '/apps/palliative-care'
  if (item.familySupport?.status === 'ACTIVE') return { title: 'Oilani qo‘llab-quvvatlash', detail: 'Oila uchun psixologik va ijtimoiy yordam rejasini davom ettirish.', owner: 'Psixolog va ijtimoiy xodim' }
  if (item.status === 'CLOSED') return { title: 'Ish yakunlangan', detail: 'Barcha qaror va xizmatlar tarixi saqlangan.', owner: item.familyDoctor }
  if (item.status === 'FOLLOW_UP') return { title: item.handoffs.length ? 'Keyingi kuzatuvni olib borish' : 'Oilaviy shifokorga topshirish', detail: 'Kuzatuv mas’uli va keyingi ko‘rik sanasini qayd etish.', owner: item.familyDoctor }
  if (activeEpisode(item)) return { title: 'Individual rejani bajarish', detail: 'Belgilangan yordamni ko‘rsatish va natijasini qayd etish.', owner: item.status === 'MOBILE' ? 'Mobil brigada' : 'Markaz mutaxassislari', route: `${base}/${item.status === 'MOBILE' ? 'mobile' : 'inpatient'}` }
  if (item.status === 'APPROVED') {
    const service = item.decisions.slice(-1)[0]?.service ?? item.requestedService
    if (service === 'MOBILE' && !latestAssessment(item, 'HOME')) return { title: 'Uyda yordam ehtiyojini baholash', detail: 'Alohida baholash va haftalik tashriflar sonini qayd etish.', owner: 'Mobil brigada shifokori' }
    return { title: 'Yordamni amalda boshlash', detail: service === 'MOBILE' ? 'Mobil brigadani biriktirish va birinchi tashrifni rejalashtirish.' : 'Bo‘sh o‘rin ajratish va qabul sanasini qayd etish.', owner: service === 'MOBILE' ? 'Bosh hamshira' : 'Markaz qabul xodimi', route: `${base}/${service === 'MOBILE' ? 'mobile' : 'inpatient'}` }
  }
  if (item.status === 'CONSILIUM') return { title: 'Markaz konsiliumida ko‘rib chiqish', detail: 'Qabul mezonlarini ko‘rib, asosli qarorni qayd etish.', owner: 'Markaz konsiliumi' }
  if (item.status === 'PAUSED') return { title: 'Davolashdan keyin qayta ko‘rish', detail: item.decisions.slice(-1)[0]?.destination ?? 'Tegishli tibbiyot muassasasida yordamni davom ettirish.', owner: item.familyDoctor }
  if (item.status === 'REJECTED') return { title: 'Keyingi yordam yo‘lini aniqlash', detail: 'Qaror asosini tushuntirish va mavjud tibbiy kuzatuvni davom ettirish.', owner: item.familyDoctor }
  if (item.status === 'OBSERVATION') return { title: 'Poliklinikada kuzatuv', detail: 'Davolashni davom ettirish; zaruratda shifokor qayta baholaydi.', owner: item.familyDoctor }
  if (latestAssessment(item, 'PAPAS')) return { title: 'Yo‘llanmani tayyorlash va yuborish', detail: 'Vakolatli muassasa xulosasi va barcha zarur hujjatlarni qayd etish.', owner: 'Yo‘llanma beruvchi muassasa' }
  return { title: 'Dastlabki baholashni o‘tkazish', detail: 'Uch ish kuni ichida tibbiy tekshiruv va PaPaS natijasini qayd etish.', owner: item.familyDoctor }
}
