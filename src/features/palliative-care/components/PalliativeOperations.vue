<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { ArrowDownToLine, ArrowRight, BedDouble, CalendarDays, Check, CheckCircle2, ClipboardList, Clock3, HeartHandshake, MapPin, Package, Plus, RotateCcw, Search, ShieldCheck, Truck, Users, X } from 'lucide-vue-next'
import PalliativeDialog from './PalliativeDialog.vue'
import { stateTones, visitTone } from '../presenters'
import { usePalliativeStore } from '../store'
import { activeEpisode, addDays, formatDate, inpatientDaysInYear, latestAssessment, REGION_LABELS, suggestedWeeklyVisits, today } from '../domain'
import type { ActionResult, Equipment, PalliativeCase, ServiceEpisode, Visit } from '../types'

const props = defineProps<{ pageKey: 'inpatient' | 'mobile' | 'equipment' | 'reports' }>()
const emit = defineEmits<{ 'open-case': [id: string] }>()
const store = usePalliativeStore()
const modal = ref<'' | 'admit' | 'extend' | 'close' | 'visit' | 'complete-visit' | 'home-assessment' | 'issue' | 'return'>('')
const error = ref('')
const notice = ref('')
const demoFillNotice = ref('')
const csvUrl = ref('')
const csvName = ref('')
onBeforeUnmount(() => { if (csvUrl.value) URL.revokeObjectURL(csvUrl.value) })
const selectedId = ref('')
const selectedEquipmentId = ref('')
const equipmentSearch = ref('')
const equipmentFilter = ref('ALL')
const selectedVisitDate = ref(today())
const visitDateScope = ref<'DAY' | 'ALL'>('DAY')
const teamFilter = ref('ALL')
const visitFilter = ref('ALL')
const selectedCase = computed(() => store.cases.find((item) => item.id === selectedId.value))
const selectedEquipment = computed(() => store.equipment.find((item) => item.id === selectedEquipmentId.value))
const activeInpatients = computed(() => store.cases.filter((item) => activeEpisode(item)?.service === 'INPATIENT'))
const activeMobile = computed(() => store.cases.filter((item) => activeEpisode(item)?.service === 'MOBILE'))
const awaitingInpatient = computed(() => store.cases.filter((item) => item.status === 'APPROVED' && item.decisions.slice(-1)[0]?.service === 'INPATIENT'))
const awaitingMobile = computed(() => store.cases.filter((item) => item.status === 'APPROVED' && item.decisions.slice(-1)[0]?.service === 'MOBILE'))
const visitingCases = computed(() => store.cases.filter((item) => activeEpisode(item)?.service === 'MOBILE' || item.familySupport?.status === 'ACTIVE'))
const equipmentCases = computed(() => store.cases.filter((item) => activeEpisode(item)?.service === 'MOBILE'))
const homeCases = computed(() => store.cases.filter((item) => ['APPROVED', 'MOBILE'].includes(item.status)))
const occupiedBeds = computed(() => new Set(activeInpatients.value.map((item) => activeEpisode(item)?.bedId)))
const freeBeds = computed(() => store.beds.filter((item) => item.available && !occupiedBeds.value.has(item.id)))
const capacity = computed(() => store.beds.filter((item) => item.available).length)
const dueReviews = computed(() => activeInpatients.value.filter((item) => {
  const episode = activeEpisode(item)
  return Boolean(episode?.plannedEndDate && episode.plannedEndDate <= addDays(today(), 2))
}))
const visibleVisits = computed(() => store.visits.filter((item) => (visitDateScope.value === 'ALL' || item.scheduledAt.slice(0, 10) === selectedVisitDate.value) && (teamFilter.value === 'ALL' || item.teamId === teamFilter.value) && (visitFilter.value === 'ALL' || item.status === visitFilter.value)).sort((a, b) => visitDateScope.value === 'DAY' ? a.scheduledAt.localeCompare(b.scheduledAt) : b.scheduledAt.localeCompare(a.scheduledAt)))
const visitsOnDate = computed(() => store.visits.filter((item) => visitDateScope.value === 'ALL' || item.scheduledAt.slice(0, 10) === selectedVisitDate.value))
const filteredEquipment = computed(() => store.equipment.filter((item) => (equipmentFilter.value === 'ALL' || item.status === equipmentFilter.value) && `${item.name} ${item.inventoryNumber} ${caseName(currentAllocation(item)?.caseId)}`.toLocaleLowerCase().includes(equipmentSearch.value.toLocaleLowerCase())))
const availableEquipment = computed(() => store.equipment.filter((item) => item.status === 'AVAILABLE'))
const issuedEquipment = computed(() => store.equipment.filter((item) => item.status === 'ISSUED'))

const admission = reactive({ caseId: '', service: 'INPATIENT' as 'INPATIENT' | 'MOBILE', startDate: today(), plannedEndDate: addDays(today(), 13), bedId: '', teamId: '', admissionType: 'TEMPORARY' as 'TEMPORARY' | 'TERMINAL', decisionNumber: '', decisionReason: '', companion: '' })
const extension = reactive({ plannedEndDate: '', decisionNumber: '', decisionDate: today(), reason: '', adultContinuation: false })
const closure = reactive({ endDate: today(), reason: 'DISCHARGE' as 'DISCHARGE' | 'TRANSFER' | 'DEATH', summary: '', document: '', deathObjection: false, pathologyReferral: '' })
const visit = reactive({ caseId: '', teamId: '', scheduledAt: `${today()}T09:00`, durationMinutes: 60, type: 'HOME' as 'HOME' | 'REMOTE', purpose: '' })
const homeAssessment = reactive({ caseId: '', score: 20, date: today(), assessor: '', methodology: '', document: '', weeklyVisits: 1, overrideReason: '', notes: '' })
const actionNote = ref('')
const agreement = ref('')
const needsMaintenance = ref(false)
const chosenVisit = computed(() => store.visits.find((item) => item.id === selectedId.value))
const modalTitle = computed(() => ({ admit: admission.service === 'INPATIENT' ? 'Statsionarga joylashtirish' : 'Mobil yordamni boshlash', extend: 'Yordam muddatini uzaytirish', close: 'Xizmat epizodini yakunlash', visit: 'Tashrifni rejalashtirish', 'complete-visit': 'Tashrif natijasini qayd etish', 'home-assessment': 'Uyda yordam ehtiyojini baholash', issue: 'Jihozni foydalanishga berish', return: 'Jihozni qaytarib olish', '': '' })[modal.value])
const visitStatusLabels = { PLANNED: 'Rejalashtirilgan', IN_PROGRESS: 'Bajarilmoqda', COMPLETED: 'Bajarilgan', CANCELLED: 'Bekor qilingan' }
const equipmentStatusLabels = { AVAILABLE: 'Mavjud', ISSUED: 'Foydalanishda', MAINTENANCE: 'Texnik xizmatda' }

watch(() => props.pageKey, () => { modal.value = ''; error.value = ''; notice.value = '' })
watch(() => admission.caseId, (id) => {
  const item = store.cases.find((entry) => entry.id === id)
  admission.decisionNumber = item?.decisions.slice(-1)[0]?.number ?? ''
  admission.decisionReason = item?.decisions.slice(-1)[0]?.reason ?? ''
})
watch(() => homeAssessment.score, (score) => { homeAssessment.weeklyVisits = suggestedWeeklyVisits(Number(score)) ?? 1 })

function caseName(id?: string) { return store.cases.find((item) => item.id === id)?.childName ?? '—' }
function caseRecord(id?: string) { return store.cases.find((item) => item.id === id) }
function teamName(id?: string) { return store.teams.find((item) => item.id === id)?.name ?? 'Belgilanmagan' }
function bedName(id?: string) { const bed = store.beds.find((item) => item.id === id); return bed ? `${bed.room} · ${bed.name}` : 'Belgilanmagan' }
function bedOccupant(id: string) { return activeInpatients.value.find((item) => activeEpisode(item)?.bedId === id) }
function currentAllocation(item: Equipment) { return [...item.allocations].reverse().find((entry) => !entry.returnedAt) }
function timeOf(value: string) { return value.slice(11, 16) }
function stayDays(episode?: ServiceEpisode) { if (!episode) return 0; return Math.max(0, Math.floor((new Date(`${episode.endDate ?? today()}T12:00:00`).getTime() - new Date(`${episode.startDate}T12:00:00`).getTime()) / 86400000) + 1) }
function yearDays(item: PalliativeCase) { return inpatientDaysInYear(item, Number(today().slice(0, 4))) }
function reportError(result: ActionResult, success: string) {
  if (!result.ok) { error.value = result.error ?? 'Amal bajarilmadi. Kiritilgan ma’lumotlarni tekshiring.'; return false }
  modal.value = ''; error.value = ''; notice.value = success; return true
}
function prepare(kind: typeof modal.value) { error.value = ''; notice.value = ''; demoFillNotice.value = ''; modal.value = kind }
function openAdmission(service: 'INPATIENT' | 'MOBILE', caseId = '') {
  Object.assign(admission, { caseId: caseId || (service === 'INPATIENT' ? awaitingInpatient.value[0]?.id : awaitingMobile.value[0]?.id) || '', service, startDate: today(), plannedEndDate: service === 'INPATIENT' ? addDays(today(), 13) : '', bedId: freeBeds.value[0]?.id ?? '', teamId: store.teams[0]?.id ?? '', admissionType: 'TEMPORARY', companion: '' })
  const item = caseRecord(admission.caseId)
  admission.decisionNumber = item?.decisions.slice(-1)[0]?.number ?? ''; admission.decisionReason = item?.decisions.slice(-1)[0]?.reason ?? ''
  prepare('admit')
}
function openExtension(item: PalliativeCase) { selectedId.value = item.id; Object.assign(extension, { plannedEndDate: addDays(activeEpisode(item)?.plannedEndDate ?? today(), 7), decisionNumber: '', decisionDate: today(), reason: '', adultContinuation: false }); prepare('extend') }
function openClosure(item: PalliativeCase) { selectedId.value = item.id; Object.assign(closure, { endDate: today(), reason: 'DISCHARGE', summary: '', document: '', deathObjection: false, pathologyReferral: '' }); prepare('close') }
function openVisit() { Object.assign(visit, { caseId: visitingCases.value[0]?.id ?? '', teamId: store.teams[0]?.id ?? '', scheduledAt: `${selectedVisitDate.value}T09:00`, durationMinutes: 60, type: 'HOME', purpose: '' }); prepare('visit') }
function openHomeAssessment(id = '') { Object.assign(homeAssessment, { caseId: id || homeCases.value[0]?.id || '', score: 20, date: today(), assessor: '', methodology: '', document: '', weeklyVisits: 1, overrideReason: '', notes: '' }); prepare('home-assessment') }
function openCompleteVisit(item: Visit) { selectedId.value = item.id; actionNote.value = ''; prepare('complete-visit') }
function startVisit(item: Visit) { error.value = ''; reportError(store.startVisit(item.id), 'Tashrif boshlandi. Yakunda xizmat natijasini qayd eting.') }
function openIssue(item: Equipment) { selectedEquipmentId.value = item.id; selectedId.value = equipmentCases.value[0]?.id ?? ''; agreement.value = ''; prepare('issue') }
function openReturn(item: Equipment) { selectedEquipmentId.value = item.id; actionNote.value = ''; needsMaintenance.value = false; prepare('return') }
function fillDemoOperation() {
  const fillBlank = (current: string, sample: string) => current.trim() ? current : sample
  const caseNumber = selectedCase.value?.number ?? '001'
  switch (modal.value) {
    case 'admit': {
      const item = caseRecord(admission.caseId)
      const decision = item?.decisions.slice(-1)[0]
      admission.decisionNumber = fillBlank(admission.decisionNumber, decision?.number ?? `DEMO-QABUL-${item?.number ?? '001'}`)
      admission.decisionReason = fillBlank(admission.decisionReason, decision?.reason ?? 'Demo konsilium xulosasi: bola va oilaning yordam ehtiyojlari ko‘rib chiqilib, tanlangan xizmat shakli belgilangan.')
      if (admission.service === 'INPATIENT') admission.companion = fillBlank(admission.companion, item ? `${item.guardianName} · ${item.relationship}` : 'Qonuniy vakil (namuna)')
      break
    }
    case 'extend':
      extension.decisionNumber = fillBlank(extension.decisionNumber, `DEMO-UZ-${caseNumber}`)
      extension.reason = fillBlank(extension.reason, 'Demo konsilium xulosasi: parvarish va oila a’zolarini o‘qitish rejasi qayta ko‘rib chiqildi. Yordamni tanlangan sanagacha davom ettirish asosi qayd etildi; muddat me’yorlari alohida tekshiriladi.')
      break
    case 'close': {
      const summary = closure.reason === 'DEATH'
        ? 'Demo vafot qaydi: klinik xizmat epizodi yakunlandi. Qonuniy vakil bilan muloqot o‘tkazildi; oilaga psixologik va ijtimoiy yordam alohida reja bilan davom ettiriladi.'
        : closure.reason === 'TRANSFER'
          ? 'Demo o‘tkazish xulosasi: yordamni boshqa tibbiyot muassasasida davom ettirish yo‘li belgilandi. Xizmat tarixi va keyingi kuzatuvga oid ma’lumotlar topshirish uchun tayyorlandi.'
          : `Demo chiqarish xulosasi: rejalashtirilgan yordam natijalari qayd etildi. Keyingi kuzatuv ${selectedCase.value?.familyDoctor ?? 'oilaviy shifokor'} bilan kelishiladi; parvarish bo‘yicha vakilga maslahat berildi.`
      closure.summary = fillBlank(closure.summary, summary)
      closure.document = fillBlank(closure.document, `DEMO-${closure.reason === 'DEATH' ? 'VAFOT' : closure.reason === 'TRANSFER' ? 'OTKAZISH' : 'EPI'}-${caseNumber} / ${closure.endDate}`)
      if (closure.reason === 'DEATH' && closure.deathObjection) closure.pathologyReferral = fillBlank(closure.pathologyReferral, 'Demo yo‘llash qaydi: vakil e’tirozi sababli Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasining Patologoanatomiya va murdalarni saqlash bo‘limiga hujjatlar tayyorlandi.')
      break
    }
    case 'visit': {
      const item = caseRecord(visit.caseId)
      const task = item?.careTasks.find((entry) => entry.status === 'PLANNED')
      const purpose = item?.familySupport?.status === 'ACTIVE'
        ? 'Oilaga psixologik yordam: yaqinlar bilan suhbat va keyingi qo‘llab-quvvatlash ehtiyojlarini ko‘rish (demo).'
        : visit.type === 'REMOTE'
          ? 'Qonuniy vakil bilan masofaviy maslahat: parvarish bo‘yicha savollar va keyingi uy tashrifiga tayyorgarlik (demo).'
          : `${task?.title ?? 'Uy sharoitidagi parvarish va oilaning yordam ehtiyojlarini ko‘rish'} — individual reja bo‘yicha demo tashrif.`
      visit.purpose = fillBlank(visit.purpose, purpose)
      break
    }
    case 'home-assessment': {
      const item = caseRecord(homeAssessment.caseId)
      homeAssessment.assessor = fillBlank(homeAssessment.assessor, 'Mobil brigada shifokori (namuna)')
      homeAssessment.methodology = fillBlank(homeAssessment.methodology, 'Uy ehtiyojlari: tayyor bahoni qayd etish — demo namuna')
      homeAssessment.document = fillBlank(homeAssessment.document, `DEMO-UY-BH-${item?.number ?? '001'} / ${homeAssessment.date}`)
      homeAssessment.notes = fillBlank(homeAssessment.notes, 'Demo qayd: vakil bilan suhbatda uy parvarishi, jihozlar va oila a’zolarining yordamga ehtiyoji ko‘rib chiqilgan. Kiritilgan ball shartli tayyor natijani ifodalaydi.')
      if (Number(homeAssessment.weeklyVisits) !== suggestedWeeklyVisits(Number(homeAssessment.score))) homeAssessment.overrideReason = fillBlank(homeAssessment.overrideReason, `DEMO-MK-UY-${item?.number ?? '001'} / ${homeAssessment.date}: konsilium oilaning joriy ehtiyojlarini ko‘rib, haftasiga ${homeAssessment.weeklyVisits} ta uy tashrifini belgilagan (namuna).`)
      break
    }
    case 'complete-visit':
      actionNote.value = fillBlank(actionNote.value, chosenVisit.value?.target === 'FAMILY'
        ? 'Demo natija: oila a’zolari bilan psixologik qo‘llab-quvvatlash suhbati o‘tkazildi. Keyingi uchrashuv ehtiyoji muhokama qilindi va oilaviy reja uchun qayd tayyorlandi.'
        : 'Demo natija: individual rejadagi maslahat va parvarish bo‘yicha tushuntirish bajarildi. Vakilning savollari ko‘rib chiqildi; keyingi kuzatuv ehtiyojlari qayd etildi.')
      break
    case 'issue':
      agreement.value = fillBlank(agreement.value, `DEMO-SH-${selectedEquipment.value?.inventoryNumber ?? '001'} / ${today()} · ${selectedCase.value?.guardianName ?? 'qonuniy vakil'} bilan bepul foydalanish`)
      break
    case 'return':
      actionNote.value = fillBlank(actionNote.value, needsMaintenance.value
        ? `DEMO-QAYT-${selectedEquipment.value?.inventoryNumber ?? '001'} / ${today()}: jihoz qaytarildi. Texnik ko‘rik va ta’mirga ehtiyoj qayd etildi; qayta berish texnik xizmatdan keyin ko‘rib chiqiladi.`
        : `DEMO-QAYT-${selectedEquipment.value?.inventoryNumber ?? '001'} / ${today()}: jihoz komplekti va tashqi holati ko‘rildi. Qabul qilish dalolatnomasi hamda foydalanish natijasi qayd etildi (namuna).`)
      break
  }
  error.value = ''
  demoFillNotice.value = 'Bo‘sh matn maydonlariga demo namuna qo‘yildi. Sana, tanlov va tasdiqlarni tekshirib, amalni alohida saqlashingiz mumkin.'
}
function submit() {
  error.value = ''
  try {
    switch (modal.value) {
      case 'admit': reportError(store.startEpisode(admission.caseId, { ...admission, plannedEndDate: admission.admissionType === 'TERMINAL' ? undefined : admission.plannedEndDate || undefined, bedId: admission.service === 'INPATIENT' ? admission.bedId : undefined, teamId: admission.service === 'MOBILE' ? admission.teamId : undefined }), 'Yordam boshlandi. Bola kartasidagi xizmat tarixi yangilandi.'); break
      case 'extend': reportError(store.extendEpisode(selectedId.value, { ...extension }), 'Konsilium qarori va yangi muddat saqlandi.'); break
      case 'close': reportError(store.closeEpisode(selectedId.value, { ...closure }), closure.reason === 'DEATH' ? 'Epizod yakunlandi. Oila uchun keyingi yordam bola kartasida yuritiladi.' : 'Epizod yakunlandi. Bola kartasida oilaviy shifokorga topshirishni qayd etishingiz mumkin.'); break
      case 'visit': reportError(store.scheduleVisit({ ...visit, durationMinutes: Number(visit.durationMinutes) }), 'Tashrif brigada jadvaliga qo‘shildi.'); break
      case 'complete-visit': reportError(store.completeVisit(selectedId.value, actionNote.value), 'Tashrif bajarildi. Xizmat natijasi tarixda saqlandi.'); break
      case 'home-assessment': reportError(store.recordAssessment(homeAssessment.caseId, { type: 'HOME', score: Number(homeAssessment.score), date: homeAssessment.date, assessor: homeAssessment.assessor, methodology: homeAssessment.methodology, document: homeAssessment.document, weeklyVisits: Number(homeAssessment.weeklyVisits), overrideReason: homeAssessment.overrideReason, notes: homeAssessment.notes }), 'Uyda yordam bahosi va haftalik tashrif rejasi saqlandi.'); break
      case 'issue': reportError(store.issueEquipment(selectedEquipmentId.value, selectedId.value, agreement.value), 'Jihoz bola ishiga biriktirildi. Berish tarixi saqlandi.'); break
      case 'return': reportError(store.returnEquipment(selectedEquipmentId.value, actionNote.value, needsMaintenance.value), needsMaintenance.value ? 'Jihoz qaytarildi va texnik xizmatga ajratildi.' : 'Jihoz qaytarildi. Foydalanish tarixi saqlandi.'); break
    }
  } catch { error.value = 'Amal bajarilmadi. Ma’lumotlarni tekshirib, qayta urinib ko‘ring.' }
}

const reportPeriod = ref<'MONTH' | 'QUARTER' | 'YEAR'>('MONTH')
const reportMonth = ref(today().slice(0, 7))
const reportYear = ref(Number(today().slice(0, 4)))
const reportQuarter = ref(Math.floor((Number(today().slice(5, 7)) - 1) / 3) + 1)
const reportRange = computed(() => {
  const year = reportPeriod.value === 'MONTH' ? Number(reportMonth.value.slice(0, 4)) : Number(reportYear.value)
  const month = reportPeriod.value === 'MONTH' ? Number(reportMonth.value.slice(5, 7)) - 1 : reportPeriod.value === 'QUARTER' ? (Number(reportQuarter.value) - 1) * 3 : 0
  const span = reportPeriod.value === 'MONTH' ? 1 : reportPeriod.value === 'QUARTER' ? 3 : 12
  const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return { start: iso(new Date(year, month, 1)), end: iso(new Date(year, month + span, 0)) }
})
function inPeriod(date?: string) { const key = date && date.length > 10 ? today(new Date(date)) : date; return Boolean(key && key >= reportRange.value.start && key <= reportRange.value.end) }
type ReportRow = { date: string; kind: string; code: string; caseId: string; child: string; region: string; status: string; tone: string; detail: string }
const reportRows = computed<ReportRow[]>(() => {
  const rows: ReportRow[] = []
  const push = (item: PalliativeCase, data: Omit<ReportRow, 'child' | 'region' | 'caseId'>) => { if (inPeriod(data.date)) rows.push({ ...data, child: item.childName, region: REGION_LABELS[item.region], caseId: item.id }) }
  for (const item of store.cases) {
    const submittedReferrals = new Map([...(item.referralHistory ?? []), ...(item.referral ? [item.referral] : [])].filter((referral) => referral.status === 'SUBMITTED').map((referral) => [referral.id, referral]))
    for (const referral of submittedReferrals.values()) push(item, { date: referral.date, kind: 'Yo‘llanma', code: referral.number, status: 'Yuborilgan', tone: stateTones.info, detail: referral.organization })
    for (const episode of item.episodes) push(item, { date: episode.startDate, kind: episode.service === 'INPATIENT' ? 'Statsionar epizod' : 'Mobil epizod', code: item.number, status: episode.status === 'ACTIVE' ? 'Faol' : 'Yakunlangan', tone: episode.status === 'ACTIVE' ? stateTones.info : stateTones.neutral, detail: episode.service === 'INPATIENT' ? bedName(episode.bedId) : teamName(episode.teamId) })
  }
  for (const item of store.visits) { const person = caseRecord(item.caseId); if (person) push(person, { date: item.scheduledAt, kind: `${item.target === 'FAMILY' ? 'Oilaga yordam · ' : ''}${item.type === 'HOME' ? 'Uyga tashrif' : 'Masofaviy maslahat'}`, code: person.number, status: visitStatusLabels[item.status], tone: visitTone(item.status), detail: `${teamName(item.teamId)} · ${item.purpose}` }) }
  for (const item of store.equipment) for (const allocation of item.allocations) { const person = caseRecord(allocation.caseId); if (person) push(person, { date: allocation.issuedAt, kind: 'Jihoz berish', code: item.inventoryNumber, status: allocation.returnedAt ? 'Qaytarilgan' : 'Foydalanishda', tone: allocation.returnedAt ? stateTones.success : stateTones.info, detail: `${item.name} · ${allocation.agreement}` }) }
  return rows.sort((a, b) => b.date.localeCompare(a.date))
})
const periodEpisodes = computed(() => store.cases.flatMap((item) => item.episodes.filter((episode) => inPeriod(episode.startDate)).map((episode) => ({ caseId: item.id, episode }))))
const completedPeriodVisits = computed(() => store.visits.filter((item) => item.status === 'COMPLETED' && inPeriod(item.completedAt ?? item.scheduledAt)))
const recipients = computed(() => new Set([
  ...store.cases.filter((item) => item.episodes.some((episode) => episode.startDate <= reportRange.value.end && (episode.endDate ?? today()) >= reportRange.value.start)).map((item) => item.id),
  ...completedPeriodVisits.value.filter((item) => item.target !== 'FAMILY').map((item) => item.caseId),
]))
const supportedFamilies = computed(() => new Set(completedPeriodVisits.value.filter((item) => item.target === 'FAMILY').map((item) => item.caseId)))
const regionReport = computed(() => Object.entries(REGION_LABELS).map(([code, label]) => {
  const regionCases = store.cases.filter((item) => item.region === code)
  const ids = new Set(regionCases.map((item) => item.id))
  return { code, label, children: regionCases.filter((item) => recipients.value.has(item.id)).length, families: regionCases.filter((item) => supportedFamilies.value.has(item.id)).length, episodes: periodEpisodes.value.filter((item) => ids.has(item.caseId)).length, home: completedPeriodVisits.value.filter((item) => ids.has(item.caseId) && item.type === 'HOME').length, remote: completedPeriodVisits.value.filter((item) => ids.has(item.caseId) && item.type === 'REMOTE').length }
}))
function exportCsv() {
  const safe = (value: unknown) => { let cell = String(value ?? ''); if (/^[\s]*[=+\-@\t\r]/.test(cell)) cell = `'${cell}`; return `"${cell.replace(/"/g, '""')}"` }
  const rows = [['Sana', 'Amal', 'Raqam', 'Bola', 'Hudud', 'Holat', 'Tafsilot'], ...reportRows.value.map((row) => [row.date, row.kind, row.code, row.child, row.region, row.status, row.detail])]
  const blob = new Blob(['\uFEFF' + rows.map((row) => row.map(safe).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  if (csvUrl.value) URL.revokeObjectURL(csvUrl.value)
  csvUrl.value = URL.createObjectURL(blob)
  csvName.value = `palliativ-hisobot-${reportRange.value.start}-${reportRange.value.end}.csv`
  const link = document.createElement('a'); link.href = csvUrl.value; link.download = csvName.value; document.body.appendChild(link); link.click(); link.remove()
  notice.value = `${reportRows.value.length} ta qaydli CSV fayl tayyorlandi. Yuklash boshlanmasa, quyidagi havoladan foydalaning.`
}
</script>

<template>
  <div class="operations space-y-6">
    <div v-if="notice" role="status" class="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"><CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0" />{{ notice }}</div>
    <a v-if="csvUrl && pageKey === 'reports'" :href="csvUrl" :download="csvName" class="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"><ArrowDownToLine class="h-4 w-4" />Tayyor CSV faylni yuklab olish</a>
    <div v-if="error && !modal" role="alert" class="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ error }}</div>

    <template v-if="pageKey === 'inpatient'">
      <div class="ops-stats">
        <article class="ops-stat"><span class="ops-stat-label">Band o‘rinlar<BedDouble /></span><strong>{{ activeInpatients.length }}<small> / {{ capacity }}</small></strong><p>{{ freeBeds.length }} ta o‘rin joylashtirish uchun bo‘sh</p></article>
        <article class="ops-stat"><span class="ops-stat-label">Joylashtirish kutilmoqda<ClipboardList /></span><strong>{{ awaitingInpatient.length }}</strong><p>Markaz konsiliumi qabulni ma’qullagan</p></article>
        <article class="ops-stat"><span class="ops-stat-label">Muddat nazorati<Clock3 /></span><strong>{{ dueReviews.length }}</strong><p>Yakun muddati yaqin yoki o‘tgan epizod</p></article>
      </div>
      <section class="ops-panel">
        <header class="ops-panel-header"><div><h2>Statsionar o‘rinlar</h2></div><button class="ops-primary" :disabled="!awaitingInpatient.length || !freeBeds.length" @click="openAdmission('INPATIENT')"><Plus class="h-4 w-4" />Joylashtirish</button></header>
        <div class="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 xl:grid-cols-4">
          <component :is="bedOccupant(bed.id) ? 'button' : 'div'" v-for="bed in store.beds" :key="bed.id" :type="bedOccupant(bed.id) ? 'button' : undefined" :class="['ops-bed', { 'ops-bed-occupied': bedOccupant(bed.id), 'ops-bed-unavailable': !bed.available }]" @click="bedOccupant(bed.id) && emit('open-case', bedOccupant(bed.id)!.id)">
            <div class="flex items-center justify-between gap-2"><BedDouble class="h-5 w-5" /><span class="text-[11px] font-medium">{{ bedOccupant(bed.id) ? 'Band' : bed.available ? 'Bo‘sh' : 'Yopiq' }}</span></div><p class="mt-5 text-xs text-muted-foreground">{{ bed.room }}</p><h3 class="mt-1 text-sm font-semibold">{{ bed.name }}</h3><p class="mt-2 truncate text-xs">{{ bedOccupant(bed.id)?.childName ?? (bed.available ? 'Joylashtirish mumkin' : 'Foydalanishga yopiq') }}</p>
          </component>
        </div>
      </section>
      <div v-if="awaitingInpatient.length" class="ops-queue"><ClipboardList class="h-5 w-5 shrink-0" /><div class="min-w-0 flex-1"><h3 class="font-medium">Qabulga tayyor bolalar</h3><div class="mt-2 flex flex-wrap gap-2"><button v-for="item in awaitingInpatient" :key="item.id" class="ops-pill-button" @click="openAdmission('INPATIENT', item.id)">{{ item.childName }}<ArrowRight class="h-3 w-3" /></button></div></div></div>
      <section class="ops-panel">
        <header class="ops-panel-header"><div><h2>Faol joylashtirishlar <span class="ops-count">{{ activeInpatients.length }}</span></h2></div></header>
        <div v-if="!activeInpatients.length" class="ops-empty"><BedDouble /><h3>Faol joylashtirish yo‘q</h3><p>Qabul qaroridan keyin bolani bo‘sh o‘ringa joylashtirishingiz mumkin.</p></div>
        <div v-else class="divide-y divide-border">
          <article v-for="item in activeInpatients" :key="item.id" class="p-5">
            <div class="flex flex-wrap items-start justify-between gap-4"><div class="flex items-start gap-3"><div class="ops-avatar">{{ item.childName.charAt(0) }}</div><div><button class="ops-name" @click="emit('open-case', item.id)">{{ item.childName }}<ArrowRight class="h-3.5 w-3.5" /></button><p class="mt-1 text-xs text-muted-foreground">{{ item.number }} · {{ bedName(activeEpisode(item)?.bedId) }}</p><p class="mt-2 text-sm text-muted-foreground">{{ activeEpisode(item)?.companion ? `Hamroh: ${activeEpisode(item)?.companion}` : 'Hamroh qayd etilmagan' }}</p></div></div><span :class="['ops-badge', activeEpisode(item)?.admissionType === 'TERMINAL' ? 'ops-badge-purple' : 'ops-badge-green']">{{ activeEpisode(item)?.admissionType === 'TERMINAL' ? 'Muddatsiz yordam' : 'Vaqtinchalik yordam' }}</span></div>
            <div class="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]"><div class="ops-info"><span>Yordam davri</span><strong>{{ formatDate(activeEpisode(item)!.startDate) }} → {{ activeEpisode(item)?.plannedEndDate ? formatDate(activeEpisode(item)!.plannedEndDate!) : 'Klinik qarorga ko‘ra' }}</strong></div><div class="ops-info"><span>{{ today().slice(0, 4) }}-yildagi vaqtinchalik statsionar kunlar</span><strong>{{ yearDays(item) }} kun <span class="font-normal text-muted-foreground">· joriy epizod {{ stayDays(activeEpisode(item)) }} kun</span></strong></div><div class="flex flex-wrap items-end gap-2"><button class="ops-secondary" @click="openExtension(item)">Muddatni uzaytirish</button><button class="ops-secondary" @click="openClosure(item)">Yakunlash</button></div></div>
            <p v-if="activeEpisode(item)?.plannedEndDate && activeEpisode(item)!.plannedEndDate! <= addDays(today(), 2)" class="mt-3 text-xs text-amber-700 dark:text-amber-300">Muddatni ko‘rib chiqish kerak. Xizmat avtomatik yakunlanmaydi.</p>
          </article>
        </div>
      </section>
      <p class="ops-footnote"><ShieldCheck class="h-4 w-4 shrink-0" />14/28 kunlik me’yorlar bo‘yicha nazorat mavjud. Kun hisoblash tafsilotlari prototipdagi ishchi talqin sifatida qo‘llanadi; klinik qaror konsiliumda qoladi.</p>
    </template>

    <template v-else-if="pageKey === 'mobile'">
      <div class="ops-stats">
        <article class="ops-stat"><span class="ops-stat-label">Mobil yordamdagi bolalar<HeartHandshake /></span><strong>{{ activeMobile.length }}</strong><p>Faol xizmat epizodi bor ishlar</p></article>
        <article class="ops-stat"><span class="ops-stat-label">{{ visitDateScope === 'DAY' ? 'Tanlangan kundagi tashriflar' : 'Barcha demo tashriflari' }}<CalendarDays /></span><strong>{{ visitsOnDate.filter(item => item.status !== 'CANCELLED').length }}</strong><p>{{ visitsOnDate.filter(item => item.status === 'COMPLETED').length }} ta xizmat bajarilgan</p></article>
        <article class="ops-stat"><span class="ops-stat-label">Mobil brigadalar<Truck /></span><strong>{{ store.teams.length }}</strong><p>Shifokor, hamshira, psixolog va ijtimoiy xodim</p></article>
      </div>
      <div class="grid gap-4 xl:grid-cols-2"><article v-for="team in store.teams" :key="team.id" class="ops-panel p-5"><div class="flex items-start justify-between gap-4"><div class="flex items-center gap-3"><div class="ops-avatar"><Truck class="h-5 w-5" /></div><div><h3 class="font-semibold">{{ team.name }}</h3><p class="mt-1 text-xs text-muted-foreground">{{ team.vehicle }}</p></div></div><span class="ops-badge ops-badge-neutral">{{ visitsOnDate.filter(item => item.teamId === team.id && item.status !== 'CANCELLED').length }} ta tashrif</span></div><div class="mt-5 flex flex-wrap gap-1.5"><span v-for="region in team.regions" :key="region" class="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{{ REGION_LABELS[region] }}</span></div><p class="mt-3 text-xs leading-5 text-muted-foreground">{{ team.members.join(' · ') }}</p></article></div>
      <div v-if="awaitingMobile.length" class="ops-queue"><ClipboardList class="h-5 w-5 shrink-0" /><div><h3 class="font-medium">Mobil yordam boshlanishi kutilmoqda</h3><div class="mt-2 flex flex-wrap gap-2"><button v-for="item in awaitingMobile" :key="item.id" class="ops-pill-button" @click="openAdmission('MOBILE', item.id)">{{ item.childName }}<ArrowRight class="h-3 w-3" /></button></div></div></div>
      <section class="ops-panel">
        <header class="ops-panel-header"><div><h2>Tashriflar jadvali</h2></div><button class="ops-primary" :disabled="!visitingCases.length" @click="openVisit"><Plus class="h-4 w-4" />Tashrif rejalashtirish</button></header>
        <div class="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4"><label class="ops-inline-field"><CalendarDays class="h-4 w-4" /><input v-model="selectedVisitDate" type="date" :disabled="visitDateScope === 'ALL'" aria-label="Tashrif sanasi" class="bg-transparent text-sm outline-none" /></label><select v-model="visitDateScope" class="ops-select w-auto" aria-label="Tashrif davri"><option value="DAY">Tanlangan sana</option><option value="ALL">Barcha sanalar</option></select><select v-model="teamFilter" class="ops-select w-auto" aria-label="Brigada bo‘yicha saralash"><option value="ALL">Barcha brigadalar</option><option v-for="team in store.teams" :key="team.id" :value="team.id">{{ team.name }}</option></select><select v-model="visitFilter" class="ops-select w-auto" aria-label="Tashrif holati"><option value="ALL">Barcha holatlar</option><option v-for="(label, key) in visitStatusLabels" :key="key" :value="key">{{ label }}</option></select><span class="ml-auto text-xs text-muted-foreground">{{ visibleVisits.length }} ta qayd</span></div>
        <div v-if="!visibleVisits.length" class="ops-empty"><CalendarDays /><h3>Tanlangan filtrlar bo‘yicha tashrif topilmadi</h3><p>Sana, brigada yoki holat filtrini o‘zgartiring; yangi tashrif ham rejalashtirishingiz mumkin.</p></div>
        <div v-else class="divide-y divide-border"><article v-for="item in visibleVisits" :key="item.id" class="flex flex-col gap-4 p-5 sm:flex-row"><div class="w-20 shrink-0"><p v-if="visitDateScope === 'ALL'" class="mb-1 text-[10px] font-medium text-muted-foreground">{{ formatDate(item.scheduledAt) }}</p><strong class="text-base">{{ timeOf(item.scheduledAt) }}</strong><p class="mt-1 text-xs text-muted-foreground">{{ item.durationMinutes }} daqiqa</p></div><div class="min-w-0 flex-1"><div class="flex flex-wrap items-center gap-2"><button class="ops-name" @click="emit('open-case', item.caseId)">{{ caseName(item.caseId) }}<ArrowRight class="h-3 w-3" /></button><span :class="['ops-badge', visitTone(item.status)]">{{ visitStatusLabels[item.status] }}</span><span class="text-xs text-muted-foreground">{{ item.target === 'FAMILY' ? 'Oilaga yordam · ' : '' }}{{ item.type === 'HOME' ? 'Uyga tashrif' : 'Masofaviy maslahat' }}</span></div><p class="mt-2 text-sm">{{ item.purpose }}</p><p class="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground"><MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0" />{{ caseRecord(item.caseId)?.address }}</p><p class="mt-1 text-xs text-muted-foreground">{{ teamName(item.teamId) }}</p><p v-if="item.note" class="mt-3 rounded-lg bg-muted p-3 text-xs leading-5"><span class="font-medium">{{ item.status === 'CANCELLED' ? 'Bekor qilish asosi:' : 'Natija:' }}</span> {{ item.note }}</p></div><div class="flex shrink-0 items-start gap-2"><button v-if="item.status === 'PLANNED'" class="ops-secondary" @click="startVisit(item)">Boshlash<ArrowRight class="h-3.5 w-3.5" /></button><button v-if="item.status === 'IN_PROGRESS'" class="ops-primary !bg-emerald-700 !border-emerald-700" @click="openCompleteVisit(item)"><Check class="h-4 w-4" />Natijani qayd etish</button><CheckCircle2 v-if="item.status === 'COMPLETED'" class="h-5 w-5 text-emerald-600" /></div></article></div>
      </section>
      <section class="ops-panel"><header class="ops-panel-header"><div><h2>Bolalar va yordam rejasi</h2><p>PaPaS natijasi uyda yordam ehtiyoji bahosidan alohida yuritiladi.</p></div><button class="ops-secondary" :disabled="!homeCases.length" @click="openHomeAssessment()"><Plus class="h-4 w-4" />Ehtiyoj bahosi</button></header><div v-if="!activeMobile.length" class="ops-empty"><HeartHandshake /><h3>Faol mobil yordam yo‘q</h3><p>Markaz konsiliumi qaroridan keyin mobil xizmatni boshlang.</p></div><div v-else class="divide-y divide-border"><article v-for="item in activeMobile" :key="item.id" class="flex flex-wrap items-center justify-between gap-4 p-5"><div><button class="ops-name" @click="emit('open-case', item.id)">{{ item.childName }}<ArrowRight class="h-3 w-3" /></button><p class="mt-1 text-xs text-muted-foreground">{{ REGION_LABELS[item.region] }} · {{ teamName(activeEpisode(item)?.teamId) }}</p></div><div class="text-sm"><template v-if="latestAssessment(item, 'HOME')"><strong>{{ latestAssessment(item, 'HOME')!.score }} ball</strong><span class="text-muted-foreground"> · haftasiga {{ latestAssessment(item, 'HOME')!.weeklyVisits ?? latestAssessment(item, 'HOME')!.suggestedVisits ?? '—' }} ta uyga tashrif</span><p v-if="latestAssessment(item, 'HOME')!.overrideReason" class="mt-1 text-xs text-amber-700">Konsilium belgilagan chastota</p></template><span v-else class="text-amber-700">Uyda yordam bahosi kiritilmagan</span></div><div class="flex gap-2"><button class="ops-secondary" @click="openHomeAssessment(item.id)">Baholash</button><button class="ops-secondary" @click="openClosure(item)">Yakunlash</button></div></article></div></section>
    </template>

    <template v-else-if="pageKey === 'equipment'">
      <div class="ops-stats"><article class="ops-stat"><span class="ops-stat-label">Jihozlar jami<Package /></span><strong>{{ store.equipment.length }}</strong><p>Har bir inventar birligi alohida hisobda</p></article><article class="ops-stat"><span class="ops-stat-label">Berishga tayyor<CheckCircle2 /></span><strong>{{ availableEquipment.length }}</strong><p>Markazda mavjud va foydalanishga tayyor</p></article><article class="ops-stat"><span class="ops-stat-label">Oilalar foydalanishida<HeartHandshake /></span><strong>{{ issuedEquipment.length }}</strong><p>Bepul foydalanish shartnomasi asosida</p></article></div>
      <section class="ops-panel"><header class="ops-panel-header"><div><h2>Jihozlar hisobi</h2></div><span class="ops-badge ops-badge-green">Bepul foydalanish</span></header><div class="flex flex-wrap gap-3 border-b border-border px-5 py-4"><label class="ops-search"><Search class="h-4 w-4 text-muted-foreground" /><input v-model="equipmentSearch" aria-label="Jihoz qidirish" placeholder="Jihoz, inventar raqami yoki bola…" /></label><select v-model="equipmentFilter" class="ops-select w-auto" aria-label="Jihoz holati bo‘yicha saralash"><option value="ALL">Barcha holatlar</option><option v-for="(label, key) in equipmentStatusLabels" :key="key" :value="key">{{ label }}</option></select></div><div v-if="!filteredEquipment.length" class="ops-empty"><Package /><h3>Jihoz topilmadi</h3><p>Qidiruv so‘zi yoki holat filtrini o‘zgartiring.</p></div><div v-else class="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3"><article v-for="item in filteredEquipment" :key="item.id" class="rounded-xl border border-border p-4"><div class="flex items-center justify-between gap-3"><div class="ops-avatar"><Package class="h-5 w-5" /></div><span :class="['ops-badge', item.status === 'AVAILABLE' ? stateTones.success : item.status === 'ISSUED' ? stateTones.info : stateTones.warning]">{{ equipmentStatusLabels[item.status] }}</span></div><h3 class="mt-4 font-semibold">{{ item.name }}</h3><p class="mt-1 font-mono text-xs text-muted-foreground">{{ item.inventoryNumber }}</p><p class="mt-3 text-xs text-muted-foreground">Holati: {{ item.condition }}</p><div v-if="currentAllocation(item)" class="mt-4 rounded-lg bg-muted p-3"><button class="ops-name text-xs" @click="emit('open-case', currentAllocation(item)!.caseId)">{{ caseName(currentAllocation(item)!.caseId) }}<ArrowRight class="h-3 w-3" /></button><p class="mt-2 text-xs text-muted-foreground">{{ currentAllocation(item)!.agreement }}</p><p class="mt-1 text-xs text-muted-foreground">Berilgan: {{ formatDate(currentAllocation(item)!.issuedAt) }}</p></div><div v-else class="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">{{ item.allocations.length ? `Avvalgi foydalanishlar: ${item.allocations.length} ta` : 'Hali foydalanishga berilmagan' }}</div><button v-if="item.status === 'AVAILABLE'" class="ops-secondary mt-4 w-full justify-center" :disabled="!equipmentCases.length" @click="openIssue(item)"><Plus class="h-3.5 w-3.5" />Foydalanishga berish</button><button v-else-if="item.status === 'ISSUED'" class="ops-secondary mt-4 w-full justify-center" @click="openReturn(item)"><RotateCcw class="h-3.5 w-3.5" />Qaytarib olish</button><p v-else class="mt-4 text-center text-xs text-muted-foreground">Texnik xizmat yakunini kutmoqda</p></article></div></section>
      <section v-if="store.equipment.some(item => item.allocations.length)" class="ops-panel"><header class="ops-panel-header"><div><h2>Berish va qaytarish tarixi</h2></div></header><div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>Jihoz</th><th>Bola / oila</th><th>Shartnoma</th><th>Berilgan</th><th>Qaytarilgan</th><th>Qabul qilish qaydi</th></tr></thead><tbody><template v-for="item in store.equipment" :key="item.id"><tr v-for="allocation in item.allocations" :key="allocation.id"><td><strong>{{ item.name }}</strong><small>{{ item.inventoryNumber }}</small></td><td><button class="ops-name text-xs" @click="emit('open-case', allocation.caseId)">{{ caseName(allocation.caseId) }}</button></td><td>{{ allocation.agreement }}</td><td>{{ formatDate(allocation.issuedAt) }}</td><td>{{ allocation.returnedAt ? formatDate(allocation.returnedAt) : 'Foydalanishda' }}</td><td>{{ allocation.returnNote ?? '—' }}</td></tr></template></tbody></table></div></section>
    </template>

    <template v-else-if="pageKey === 'reports'">
      <section class="ops-panel"><header class="ops-panel-header"><div><h2>Hisobot davri</h2></div><button class="ops-primary" :disabled="!reportRows.length" @click="exportCsv"><ArrowDownToLine class="h-4 w-4" />CSV yuklash</button></header><div class="flex flex-wrap items-center gap-3 p-5"><div class="flex rounded-lg bg-muted p-1"><button v-for="option in [{ id: 'MONTH', label: 'Oylik' }, { id: 'QUARTER', label: 'Choraklik' }, { id: 'YEAR', label: 'Yillik' }]" :key="option.id" :class="['rounded-md px-4 py-2 text-sm', reportPeriod === option.id ? 'bg-card font-medium shadow-sm' : 'text-muted-foreground']" @click="reportPeriod = option.id as typeof reportPeriod">{{ option.label }}</button></div><input v-if="reportPeriod === 'MONTH'" v-model="reportMonth" class="ops-select w-auto" type="month" aria-label="Hisobot oyi" /><template v-else><input v-model="reportYear" class="ops-select max-w-28" type="number" min="2026" max="2100" aria-label="Hisobot yili" /><select v-if="reportPeriod === 'QUARTER'" v-model="reportQuarter" class="ops-select w-auto" aria-label="Hisobot choragi"><option v-for="quarter in [1, 2, 3, 4]" :key="quarter" :value="quarter">{{ quarter }}-chorak</option></select></template><span class="ml-auto text-xs text-muted-foreground">{{ formatDate(reportRange.start) }} — {{ formatDate(reportRange.end) }}</span></div></section>
      <div class="ops-stats ops-stats-four"><article class="ops-stat"><span class="ops-stat-label">Yordam olgan bolalar<Users /></span><strong>{{ recipients.size }}</strong><p>Takrorlanmaydigan bola ishlari</p></article><article class="ops-stat"><span class="ops-stat-label">Boshlangan epizodlar<HeartHandshake /></span><strong>{{ periodEpisodes.length }}</strong><p>Bir bolada bir necha epizod bo‘lishi mumkin</p></article><article class="ops-stat"><span class="ops-stat-label">Bajarilgan uyga tashriflar<Truck /></span><strong>{{ completedPeriodVisits.filter(item => item.type === 'HOME').length }}</strong><p>Bola va oilaga ko‘rsatilgan xizmatlar</p></article><article class="ops-stat"><span class="ops-stat-label">Masofaviy maslahatlar<CheckCircle2 /></span><strong>{{ completedPeriodVisits.filter(item => item.type === 'REMOTE').length }}</strong><p>Uyga tashrifdan alohida hisob</p></article></div>
      <section class="ops-panel"><header class="ops-panel-header"><div><h2>Hududlar bo‘yicha natijalar</h2><p>Xizmat davri hisobot oralig‘iga to‘g‘ri keladigan bolalar ham qamrab olinadi. Vafotdan keyin yordam olgan oilalar alohida hisoblanadi.</p></div></header><div class="ops-table-wrap"><table class="ops-table"><thead><tr><th>Hudud</th><th>Yordam olgan bolalar</th><th>Yordam olgan oilalar</th><th>Yangi epizodlar</th><th>Uyga tashriflar</th><th>Masofaviy maslahatlar</th></tr></thead><tbody><tr v-for="row in regionReport" :key="row.code"><td><strong>{{ row.label }}</strong></td><td><span class="ops-badge ops-badge-green">{{ row.children }}</span></td><td>{{ row.families }}</td><td>{{ row.episodes }}</td><td>{{ row.home }}</td><td>{{ row.remote }}</td></tr></tbody></table></div></section>
      <section class="ops-panel"><header class="ops-panel-header"><div><h2>Davrdagi qaydlar <span class="ops-count">{{ reportRows.length }}</span></h2><p>CSV faylda quyidagi filtrlangan ro‘yxat yuklanadi. Qayd sanasi va joriy holati ko‘rsatilgan.</p></div></header><div v-if="!reportRows.length" class="ops-empty"><ClipboardList /><h3>Tanlangan davrda qayd yo‘q</h3><p>Boshqa oy, chorak yoki yilni tanlang.</p></div><div v-else class="ops-table-wrap"><table class="ops-table"><thead><tr><th>Sana</th><th>Amal / raqam</th><th>Bola / oila ishi</th><th>Hudud</th><th>Holat</th></tr></thead><tbody><tr v-for="(row, index) in reportRows" :key="`${row.kind}-${row.code}-${index}`"><td>{{ formatDate(row.date) }}</td><td><strong>{{ row.kind }}</strong><small>{{ row.code }}</small></td><td><button class="ops-name text-xs" @click="emit('open-case', row.caseId)">{{ row.child }}</button></td><td>{{ row.region }}</td><td><span :class="['ops-badge border', row.tone]">{{ row.status }}</span></td></tr></tbody></table></div></section>
      <p class="ops-footnote"><ShieldCheck class="h-4 w-4 shrink-0" />Bajarilgan tashriflar yakunlangan sana bo‘yicha hisoblanadi. Qaydlar ro‘yxatida tashrif rejalashtirilgan sana, epizod boshlangan sana va jihoz berilgan sana qo‘llanadi.</p>
    </template>

    <PalliativeDialog :open="Boolean(modal)" :title="modalTitle" :description="modal === 'home-assessment' ? 'Tasdiqlangan uyda yordamga muhtojlik bahosini kiriting. Bu PaPaS baholashi emas.' : undefined" @close="modal = ''; error = ''">
      <form class="space-y-5" @submit.prevent="submit">
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-sky-200/70 bg-sky-50/50 p-3 dark:border-sky-900 dark:bg-sky-950/20"><p class="max-w-sm text-xs leading-5 text-muted-foreground">Sinash uchun bo‘sh izoh va hujjat maydonlarini demo matn bilan to‘ldirishingiz mumkin. Amal avtomatik bajarilmaydi.</p><button type="button" class="ops-secondary shrink-0" @click="fillDemoOperation"><ClipboardList class="h-4 w-4" />Namuna bilan to‘ldirish</button></div>
        <p v-if="demoFillNotice" role="status" class="text-xs leading-5 text-sky-700 dark:text-sky-300">{{ demoFillNotice }}</p>
        <template v-if="modal === 'admit'">
          <label class="ops-field">Bola <select v-model="admission.caseId" required><option value="" disabled>Bolani tanlang</option><option v-for="item in admission.service === 'INPATIENT' ? awaitingInpatient : awaitingMobile" :key="item.id" :value="item.id">{{ item.childName }} · {{ item.number }}</option></select></label>
          <div v-if="admission.caseId" class="ops-form-note">Markaz konsiliumi: {{ caseRecord(admission.caseId)?.decisions.slice(-1)[0]?.number }} · {{ formatDate(caseRecord(admission.caseId)?.decisions.slice(-1)[0]?.date ?? '') }}. Qaror xizmat shakli va boshlash huquqini belgilaydi.</div>
          <div class="ops-form-grid"><label class="ops-field">Boshlanish sanasi<input v-model="admission.startDate" required type="date" /></label><label v-if="admission.service === 'INPATIENT'" class="ops-field">Joylashtirish turi<select v-model="admission.admissionType"><option value="TEMPORARY">Vaqtinchalik</option><option value="TERMINAL">Muddatsiz — klinik xulosa bilan</option></select></label><label v-else class="ops-field">Mobil brigada<select v-model="admission.teamId" required><option v-for="team in store.teams" :key="team.id" :value="team.id">{{ team.name }}</option></select></label></div>
          <div v-if="admission.service === 'INPATIENT'" class="ops-form-grid"><label class="ops-field">Bo‘sh o‘rin<select v-model="admission.bedId" required><option value="" disabled>O‘rinni tanlang</option><option v-for="bed in freeBeds" :key="bed.id" :value="bed.id">{{ bed.room }} · {{ bed.name }}</option></select></label><label v-if="admission.admissionType === 'TEMPORARY'" class="ops-field">Rejalashtirilgan yakun<input v-model="admission.plannedEndDate" type="date" :min="admission.startDate" required /></label></div>
          <label class="ops-field">Konsilium qarori raqami<input v-model="admission.decisionNumber" required placeholder="Masalan, MK-2026/045" /></label><label class="ops-field">Qaror asosi / klinik xulosa<textarea v-model="admission.decisionReason" required rows="3" placeholder="Xizmatni boshlash asosi" /></label><label v-if="admission.service === 'INPATIENT'" class="ops-field">Hamroh (ixtiyoriy)<input v-model="admission.companion" placeholder="F.I.Sh. va qarindoshligi" /></label>
        </template>
        <template v-else-if="modal === 'extend'">
          <div class="ops-form-note"><strong>{{ selectedCase?.childName }}</strong><p class="mt-1">Joriy muddat: {{ activeEpisode(selectedCase!)?.plannedEndDate ? formatDate(activeEpisode(selectedCase!)!.plannedEndDate!) : 'Muddatsiz' }} · Yillik jami: {{ selectedCase ? yearDays(selectedCase) : 0 }} kun.</p></div><div class="ops-form-grid"><label class="ops-field">Yangi yakun sanasi<input v-model="extension.plannedEndDate" required type="date" /></label><label class="ops-field">Konsilium sanasi<input v-model="extension.decisionDate" required type="date" /></label></div><label class="ops-field">Konsilium qarori raqami<input v-model="extension.decisionNumber" required placeholder="Qaror raqami" /></label><label class="ops-field">Uzaytirish asosi<textarea v-model="extension.reason" required rows="3" /></label><label class="ops-checkbox"><input v-model="extension.adultContinuation" type="checkbox" /><span>Xizmat davomida 18 yoshga to‘lgan bola uchun konsilium belgilagan davom ettirish</span></label><p class="text-xs leading-5 text-muted-foreground">Yangi qabul yoshi o‘zgarmaydi. Davom ettirish 21 yoshdan oshmasligi kerak.</p>
        </template>
        <template v-else-if="modal === 'close'">
          <div class="ops-form-note"><strong>{{ selectedCase?.childName }}</strong><p class="mt-1">Yakunlash xizmat epizodini yopadi va o‘rinni bo‘shatadi. Keyingi kuzatuv bola kartasida yuritiladi.</p></div><div class="ops-form-grid"><label class="ops-field">Yakun sanasi<input v-model="closure.endDate" required type="date" :max="today()" /></label><label class="ops-field">Yakunlash sababi<select v-model="closure.reason"><option value="DISCHARGE">Oilaviy shifokor kuzatuviga chiqarish</option><option value="TRANSFER">Boshqa muassasaga o‘tkazish</option><option value="DEATH">Vafot holati</option></select></label></div><label class="ops-field">{{ closure.reason === 'DEATH' ? 'O‘lim epikrizi raqami / hujjat' : 'Chiqarish yoki o‘tkazish hujjati' }}<input v-model="closure.document" required placeholder="Hujjat raqami va sanasi" /></label><label class="ops-field">Yakuniy xulosa va keyingi harakat<textarea v-model="closure.summary" required rows="4" /></label><template v-if="closure.reason === 'DEATH'"><div class="ops-form-note">Bola uchun xizmat yakunlanadi. Oilaga psixologik va ijtimoiy yordam uch oygacha alohida davom etadi.</div><label class="ops-checkbox"><input v-model="closure.deathObjection" type="checkbox" /><span>Qonuniy vakil o‘lim sababiga e’tiroz bildirgan</span></label><label v-if="closure.deathObjection" class="ops-field">Patologoanatomiya bo‘limiga yo‘llash qaydi<textarea v-model="closure.pathologyReferral" required rows="2" placeholder="Samarqand viloyat Bolalar ko‘p tarmoqli shifoxonasiga yo‘llash ma’lumoti" /></label></template>
        </template>
        <template v-else-if="modal === 'visit'">
          <label class="ops-field">Bola / oila<select v-model="visit.caseId" required><option value="" disabled>Bolani tanlang</option><option v-for="item in visitingCases" :key="item.id" :value="item.id">{{ item.childName }}{{ item.familySupport?.status === 'ACTIVE' ? ' · oilaga yordam' : '' }}</option></select></label><div class="ops-form-grid"><label class="ops-field">Sana va vaqt<input v-model="visit.scheduledAt" required type="datetime-local" /></label><label class="ops-field">Davomiylik, daqiqa<input v-model="visit.durationMinutes" type="number" min="15" max="480" step="15" required /></label><label class="ops-field">Brigada<select v-model="visit.teamId" required><option v-for="team in store.teams" :key="team.id" :value="team.id">{{ team.name }}</option></select></label><label class="ops-field">Xizmat turi<select v-model="visit.type"><option value="HOME">Uyga tashrif</option><option value="REMOTE">Masofaviy maslahat</option></select></label></div><label class="ops-field">Tashrif maqsadi<textarea v-model="visit.purpose" required rows="3" placeholder="Individual yordam rejasidagi vazifa" /></label><p class="text-xs leading-5 text-muted-foreground">Brigadaning bir vaqtdagi boshqa tashriflari tekshiriladi. Masofaviy maslahat uyga tashrif o‘rniga hisoblanmaydi.</p>
        </template>
        <template v-else-if="modal === 'complete-visit'"><div class="ops-form-note"><strong>{{ caseName(chosenVisit?.caseId) }}</strong><p class="mt-1">{{ chosenVisit?.purpose }}</p></div><label class="ops-field">Ko‘rsatilgan yordam va natija<textarea v-model="actionNote" required rows="5" placeholder="Bajarilgan ishlar, kuzatuv va keyingi harakatni qayd eting" /></label></template>
        <template v-else-if="modal === 'home-assessment'">
          <label class="ops-field">Bola<select v-model="homeAssessment.caseId" required><option value="" disabled>Bolani tanlang</option><option v-for="item in homeCases" :key="item.id" :value="item.id">{{ item.childName }}</option></select></label><div class="ops-form-grid"><label class="ops-field">Uyda yordam ehtiyoji, ball<input v-model="homeAssessment.score" required type="number" min="0" max="100" step="1" /></label><label class="ops-field">Baholash sanasi<input v-model="homeAssessment.date" required type="date" :max="today()" /></label></div><div class="ops-form-note"><template v-if="suggestedWeeklyVisits(Number(homeAssessment.score))">Nizom bo‘yicha tavsiya: haftasiga <strong>{{ suggestedWeeklyVisits(Number(homeAssessment.score)) }} ta</strong> uyga tashrif.</template><template v-else>15 balldan past natija uchun nizomda tashrif chastotasi belgilanmagan. Konsilium asosi kerak.</template></div><label class="ops-field">Baholagan mutaxassis<input v-model="homeAssessment.assessor" required placeholder="F.I.Sh. va lavozimi" /></label><div class="ops-form-grid"><label class="ops-field">Metodika / versiyasi<input v-model="homeAssessment.methodology" required placeholder="Tasdiqlangan metodika nomi" /></label><label class="ops-field">Baholash hujjati<input v-model="homeAssessment.document" required placeholder="Raqami va sanasi" /></label></div><label class="ops-field">Haftalik uyga tashriflar soni<input v-model="homeAssessment.weeklyVisits" required type="number" min="1" max="7" step="1" /></label><label v-if="Number(homeAssessment.weeklyVisits) !== suggestedWeeklyVisits(Number(homeAssessment.score))" class="ops-field">O‘zgartirish asosi — konsilium raqami, sanasi va sababi<textarea v-model="homeAssessment.overrideReason" required rows="3" /></label><label class="ops-field">Izoh (ixtiyoriy)<textarea v-model="homeAssessment.notes" rows="2" /></label>
        </template>
        <template v-else-if="modal === 'issue'"><div class="ops-form-note"><strong>{{ selectedEquipment?.name }}</strong><p class="mt-1">{{ selectedEquipment?.inventoryNumber }} · {{ selectedEquipment?.condition }}</p></div><label class="ops-field">Bola / qonuniy vakil<select v-model="selectedId" required><option value="" disabled>Bolani tanlang</option><option v-for="item in equipmentCases" :key="item.id" :value="item.id">{{ item.childName }} · {{ item.guardianName }}</option></select></label><label class="ops-field">Bepul foydalanish shartnomasi<input v-model="agreement" required placeholder="Shartnoma raqami va imzolangan sana" /></label><p class="text-xs leading-5 text-muted-foreground">Jihoz tanlangan ishga biriktiriladi. Bir jihoz bir vaqtning o‘zida ikki oilaga berilmaydi.</p></template>
        <template v-else-if="modal === 'return'"><div class="ops-form-note"><strong>{{ selectedEquipment?.name }}</strong><p class="mt-1">{{ selectedEquipment?.inventoryNumber }} · {{ selectedEquipment && caseName(currentAllocation(selectedEquipment)?.caseId) }}</p></div><label class="ops-field">Qaytarilgandagi holat va qabul qilish qaydi<textarea v-model="actionNote" required rows="4" placeholder="Jihozning butligi, ishlash holati va dalolatnoma raqami" /></label><label class="ops-checkbox"><input v-model="needsMaintenance" type="checkbox" /><span>Texnik tekshiruv yoki ta’mir kerak — jihoz qayta foydalanishga berilmaydi</span></label></template>
        <p v-if="error" role="alert" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
        <div class="flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" :class="['ops-secondary', stateTones.neutral]" @click="modal = ''; error = ''"><X class="h-4 w-4" />Bekor qilish</button><button type="submit" :class="['ops-primary', modal === 'close' ? '!bg-slate-700 !border-slate-700 hover:!bg-slate-800' : '!bg-emerald-700 !border-emerald-700 hover:!bg-emerald-800']"><Check class="h-4 w-4" />{{ modal === 'close' ? 'Epizodni yakunlash' : 'Saqlash' }}</button></div>
      </form>
    </PalliativeDialog>
  </div>
</template>

<style scoped>
.operations { min-width: 0; }
.ops-panel { background: var(--card); border: 1px solid var(--border); border-radius: 14px; min-width: 0; overflow: hidden; }
.ops-panel-header { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:16px; padding:20px; border-bottom:1px solid var(--border); }
.ops-panel-header h2 { font-size:15px; line-height:24px; font-weight:600; }
.ops-panel-header p { color:var(--muted-foreground); font-size:12px; margin-top:4px; line-height:20px; }
.ops-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; }
.ops-stat { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px; }
.ops-stat-label { display:flex; justify-content:space-between; align-items:center; gap:10px; color:var(--muted-foreground); font-size:12px; }
.ops-stat-label svg { width:18px; height:18px; color:var(--primary); }
.ops-stat>strong { display:block; margin-top:14px; font-size:30px; line-height:36px; font-weight:650; letter-spacing:-1px; }
.ops-stat>strong small { font-size:17px; color:var(--muted-foreground); font-weight:400; }
.ops-stat>p { margin-top:6px; font-size:11px; line-height:18px; color:var(--muted-foreground); }
.ops-stats-four { grid-template-columns:repeat(4,minmax(0,1fr)); }
.ops-primary,.ops-secondary,.ops-pill-button { display:inline-flex; align-items:center; gap:8px; border-radius:8px; font-size:12px; line-height:20px; padding:9px 13px; font-weight:500; transition:background-color .15s; text-align:left; }
.ops-primary { background:var(--primary); color:var(--primary-foreground); border:1px solid var(--primary); }
.ops-primary:hover { background:var(--primary-hover); }
.ops-secondary { border:1px solid var(--border); background:var(--card); }
.ops-secondary:hover,.ops-pill-button:hover { background:var(--muted); }
.ops-primary:disabled,.ops-secondary:disabled { opacity:.45; cursor:not-allowed; }
button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible { outline:2px solid var(--primary); outline-offset:3px; }
.ops-bed { display:block; text-align:left; border:1px dashed var(--border); border-radius:10px; padding:15px; background:var(--muted); min-width:0; color:var(--muted-foreground); }
.ops-bed-occupied { border:1px solid color-mix(in srgb,var(--primary) 24%,var(--border)); background:color-mix(in srgb,var(--primary) 5%,var(--card)); color:var(--foreground); }
.ops-bed-occupied svg { color:var(--primary); }
.ops-bed-occupied:hover { background:color-mix(in srgb,var(--primary) 9%,var(--card)); }
.ops-bed-unavailable { opacity:.5; }
.ops-avatar { display:flex; width:40px; height:40px; flex-shrink:0; align-items:center; justify-content:center; border-radius:11px; background:color-mix(in srgb,var(--primary) 10%,var(--card)); color:var(--primary); font-weight:600; }
.ops-name { display:inline-flex; align-items:center; gap:6px; text-align:left; font-size:14px; font-weight:600; }
.ops-name:hover { color:var(--primary); text-decoration:underline; text-underline-offset:3px; }
.ops-badge { display:inline-flex; align-items:center; white-space:nowrap; font-size:10px; line-height:17px; font-weight:500; border-radius:5px; padding:3px 7px; }
.ops-badge-green { background:color-mix(in srgb,var(--primary) 11%,var(--card)); color:var(--primary); }
.ops-badge-blue { background:#eff6ff; color:#2563eb; }
.ops-badge-purple { background:#f5f3ff; color:#7c3aed; }
.ops-badge-neutral { background:var(--muted); color:var(--muted-foreground); }
.ops-count { margin-left:5px; color:var(--muted-foreground); font-size:12px; font-weight:400; }
.ops-info>span { display:block; color:var(--muted-foreground); font-size:11px; margin-bottom:5px; }
.ops-info>strong { font-size:12px; font-weight:500; }
.ops-queue { display:flex; gap:12px; background:color-mix(in srgb,var(--primary) 5%,var(--card)); border:1px solid color-mix(in srgb,var(--primary) 20%,var(--border)); color:var(--primary); padding:16px 20px; border-radius:12px; font-size:13px; }
.ops-pill-button { background:var(--card); border:1px solid var(--border); padding:5px 9px; color:var(--foreground); }
.ops-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:48px 24px; text-align:center; }
.ops-empty>svg { height:30px; width:30px; color:var(--muted-foreground); opacity:.6; margin-bottom:15px; }
.ops-empty h3 { font-size:14px; font-weight:500; }.ops-empty p { margin-top:7px; font-size:12px; color:var(--muted-foreground); line-height:20px; }
.ops-footnote { display:flex; gap:8px; font-size:11px; line-height:19px; color:var(--muted-foreground); padding:0 3px; }
.ops-select,.ops-inline-field { border:1px solid var(--border); background:var(--card); border-radius:8px; padding:8px 11px; font-size:12px; min-height:38px; max-width:100%; color:var(--foreground); }
.ops-inline-field { display:flex; align-items:center; gap:9px; }
.ops-search { display:flex; align-items:center; gap:8px; flex:1; min-width:180px; border:1px solid var(--border); border-radius:8px; padding:8px 11px; }
.ops-search input { border:0; background:transparent; outline:0; width:100%; min-width:0; font-size:12px; }
.ops-table-wrap { width:100%; overflow:auto; }
.ops-table { width:100%; border-collapse:collapse; text-align:left; font-size:12px; }
.ops-table th { padding:12px 20px; font-size:10px; letter-spacing:.02em; font-weight:500; white-space:nowrap; color:var(--muted-foreground); background:color-mix(in srgb,var(--muted) 60%,var(--card)); border-bottom:1px solid var(--border); }
.ops-table td { padding:16px 20px; border-bottom:1px solid var(--border); min-width:100px; vertical-align:middle; }
.ops-table tr:last-child td { border-bottom:0; }.ops-table td strong { font-size:12px; font-weight:500; }.ops-table td small { display:block; font-size:10px; color:var(--muted-foreground); margin-top:5px; }
.ops-field { display:flex; flex-direction:column; gap:8px; font-size:12px; font-weight:500; min-width:0; }
.ops-field input,.ops-field select,.ops-field textarea { width:100%; min-width:0; border:1px solid var(--border); border-radius:8px; background:var(--card); padding:10px 12px; font-size:13px; font-weight:400; color:var(--foreground); }
.ops-field textarea { resize:vertical; min-height:70px; }.ops-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
.ops-form-note { background:var(--muted); border-radius:9px; padding:13px 15px; font-size:12px; line-height:21px; color:var(--muted-foreground); }
.ops-form-note strong { color:var(--foreground); }.ops-checkbox { display:flex; align-items:flex-start; gap:10px; font-size:12px; line-height:20px; }.ops-checkbox input { margin-top:3px; accent-color:var(--primary); }
@media(max-width:1024px) { .ops-stats-four { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:640px) { .ops-stats { grid-template-columns:1fr; gap:10px; }.ops-stat { padding:16px; }.ops-stat>strong { margin-top:8px; }.ops-stats-four { grid-template-columns:repeat(2,minmax(0,1fr)); }.ops-panel-header { padding:16px; }.ops-form-grid { grid-template-columns:1fr; }.ops-table td,.ops-table th { padding-left:15px; padding-right:15px; }.ops-inline-field { width:100%; }.ops-select { flex:1; }.ops-panel-header .ops-primary { width:100%; justify-content:center; } }
</style>
