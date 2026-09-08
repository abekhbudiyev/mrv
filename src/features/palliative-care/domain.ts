import type { ActionResult, AssessmentInput, CaseInput, CaseStatus, ContactInput, DecisionInput, EpisodeCloseInput, EpisodeExtensionInput, EpisodeInput, HandoffInput, PalliativeCase, PalliativeState, ReferralInput, RegionCode, ServiceType, CareTaskInput, VisitInput } from './types'

export const REGION_LABELS: Record<RegionCode, string> = { SAMARQAND: 'Samarqand', JIZZAX: 'Jizzax', QASHQADARYO: 'Qashqadaryo', NAVOIY: 'Navoiy' }
export const SERVICE_LABELS: Record<ServiceType, string> = { INPATIENT: 'Statsionar', MOBILE: 'Mobil yordam' }
export const STATUS_LABELS: Record<CaseStatus, string> = { INTAKE: 'Yangi murojaat', ASSESSMENT: 'Baholash', OBSERVATION: 'Poliklinika kuzatuvi', REFERRAL: 'Yo‘llanma tayyorlash', CONSILIUM: 'Konsiliumda', APPROVED: 'Qabul tasdiqlangan', PAUSED: 'Vaqtincha to‘xtatilgan', REJECTED: 'Qabul rad etilgan', INPATIENT: 'Statsionarda', MOBILE: 'Mobil yordamda', FOLLOW_UP: 'Keyingi kuzatuv', BEREAVEMENT: 'Oilaga yordam', CLOSED: 'Yakunlangan' }
export const LOCAL_COUNTING_ASSUMPTION = 'Prototip hisobi: kirish va chiqish kuni qo‘shiladi; 14/28 kun shu kalendar yilidagi jami vaqtinchalik statsionar kunlariga qo‘llanadi. Yakuniy tartib kelishilishi kerak.'
export const WORKING_DAY_ASSUMPTION = '3 ish kuni prototipda dushanba–juma bo‘yicha; rasmiy bayram kalendari ulanmagan.'
const DAY = 86_400_000
const ok = (id?: string): ActionResult => ({ ok: true, id })
const fail = (error: string): ActionResult => ({ ok: false, error })
const id = (prefix: string) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
const caseFields: (keyof CaseInput)[] = ['childName', 'birthDate', 'sex', 'region', 'district', 'address', 'guardianName', 'relationship', 'phone', 'familyDoctor', 'clinic', 'diagnosis', 'medicalIndication', 'requestedService', 'urgency', 'notes', 'pinfl', 'identityType', 'identityNumber', 'symptoms', 'intakeDate']
const casePayload = (input: CaseInput): CaseInput => Object.fromEntries(caseFields.map(field => [field, input[field]])) as unknown as CaseInput
export function today(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` }
export function isValidDate(value: string) { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value }
export function addDays(value: string, count: number) { return new Date(Date.parse(`${value}T12:00:00Z`) + count * DAY).toISOString().slice(0, 10) }
export function addCalendarMonths(value: string, months: number) {
  const date = new Date(`${value}T12:00:00Z`); const day = date.getUTCDate()
  date.setUTCDate(1); date.setUTCMonth(date.getUTCMonth() + months)
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate()
  date.setUTCDate(Math.min(day, last)); return date.toISOString().slice(0, 10)
}
export function addWorkingDays(value: string, count: number) { let result = value; let remaining = count; while (remaining > 0) { result = addDays(result, 1); const day = new Date(`${result}T12:00:00Z`).getUTCDay(); if (day !== 0 && day !== 6) remaining-- } return result }
export function formatDate(value?: string) { return value && !Number.isNaN(Date.parse(value)) ? new Intl.DateTimeFormat('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value.length === 10 ? `${value}T12:00:00` : value)) : '—' }
export function ageOn(birthDate: string, on = today()) { if (!isValidDate(birthDate) || !isValidDate(on)) return NaN; return Number(on.slice(0, 4)) - Number(birthDate.slice(0, 4)) - (on.slice(5) < birthDate.slice(5) ? 1 : 0) }
export function latestAssessment(c: PalliativeCase, type: AssessmentInput['type']) { return c.assessments.filter(a => a.type === type).slice().sort((a, b) => b.date.localeCompare(a.date) || c.assessments.indexOf(b) - c.assessments.indexOf(a))[0] }
export function activeEpisode(c: PalliativeCase) { return c.episodes.find(e => e.status === 'ACTIVE') }
export function suggestedWeeklyVisits(score: number) { return Number.isFinite(score) && score >= 15 ? score >= 25 ? 3 : score >= 21 ? 2 : 1 : undefined }
export function inpatientDaysInYear(c: PalliativeCase, year: number, through = today()) {
  const dates = new Set<string>()
  for (const e of c.episodes.filter(e => e.service === 'INPATIENT' && e.admissionType !== 'TERMINAL')) {
    const start = e.startDate > `${year}-01-01` ? e.startDate : `${year}-01-01`
    const rawEnd = e.endDate ?? through; const end = rawEnd < `${year}-12-31` ? rawEnd : `${year}-12-31`
    for (let date = start; date <= end; date = addDays(date, 1)) dates.add(date)
  }
  return dates.size
}
export function referralErrors(c: PalliativeCase): string[] {
  const r = c.referral; if (!r) return ['Yo‘llanma ma’lumotlari kiritilmagan.']
  const errors: string[] = []
  if (!r.number.trim() || !isValidDate(r.date)) errors.push('Yo‘llanma raqami va haqiqiy sanasi kerak.')
  if (!r.organization.trim() || !r.sourceConsiliumNumber.trim() || !isValidDate(r.sourceConsiliumDate) || !r.sourceConsiliumMembers.trim() || !r.sourceConsiliumEligible) errors.push('Yo‘llanma beruvchi vakolatli muassasa konsiliumining ijobiy xulosasi kerak.')
  if (r.diagnosisCode.trim().toUpperCase() !== 'Z51.5') errors.push('Yo‘llanmadagi XKT-10 kodi Z51.5 bo‘lishi kerak.')
  if (!c.medicalIndication.trim()) errors.push('1-ilova bo‘yicha klinik ko‘rsatma tasdig‘i kerak.')
  const papas = latestAssessment(c, 'PAPAS'); if (!papas || papas.score < 15) errors.push('PaPaS kamida 15 ball bo‘lishi kerak; past ball poliklinika kuzatuvida qoladi.')
  if (!r.historyExtract.trim() || !Number.isInteger(r.historyPages) || r.historyPages < 1) errors.push('Kasallik tarixidan ko‘chirma va varaqlar soni majburiy.')
  if (!r.papasDocument.trim() || !r.examinationDocument.trim() || !Number.isInteger(r.examinationPages) || r.examinationPages < 1) errors.push('PaPaS va tekshiruv natijalari hujjatlari kerak.')
  if (!r.referringDoctor.trim() || !r.doctorPosition.trim() || !r.doctorPhone.trim() || !r.chiefDoctor.trim() || !r.sourceConfirmation.trim()) errors.push('Yo‘naltiruvchi shifokor, bosh shifokor va manba tasdiqlari kerak.')
  if (r.source === 'PAPER' && !r.outageReason?.trim()) errors.push('Yozma yo‘llanma uchun texnik nosozlik sababi kerak.')
  if (r.source === 'EPALLIATIVE' && !r.externalId?.trim()) errors.push('Tashqi yo‘llanmaning manba identifikatori kerak.')
  if (papas && papas.date > r.date) errors.push('PaPaS baholashi yo‘llanma sanasidan keyin bo‘lishi mumkin emas.')
  if (r.sourceConsiliumDate > r.date) errors.push('Manba konsiliumi sanasi yo‘llanma sanasidan keyin bo‘lishi mumkin emas.')
  return errors
}

/** Pure local workflow. Clinical conclusions are always entered by a human. */
export function createPalliativeDomain(state: PalliativeState, clock: () => Date = () => new Date()) {
  const now = () => clock().toISOString(); const dateNow = () => today(clock())
  const getCase = (caseId: string) => state.cases.find(c => c.id === caseId)
  const log = (c: PalliativeCase, title: string, detail: string, actor = 'Prototip foydalanuvchisi') => c.timeline.push({ id: id('event'), at: now(), title, detail, actor })
  const find = (caseId: string) => { const c = getCase(caseId); return c && c.status !== 'CLOSED' ? c : undefined }
  const missing = () => fail('Faol ish topilmadi.')
  const checkDate = (date: string) => isValidDate(date) && date <= dateNow()
  function createCase(input: CaseInput): ActionResult {
    if (![input.childName, input.guardianName, input.relationship, input.phone, input.address, input.district, input.familyDoctor, input.clinic, input.diagnosis].every(v => v?.trim())) return fail('Bola, vakil, telefon, manzil, shifokor va tashxis maydonlarini to‘ldiring.')
    if (!checkDate(input.birthDate)) return fail('Tug‘ilgan sana haqiqiy va kelajakda bo‘lmasligi kerak.')
    const intakeDate = input.intakeDate ?? dateNow()
    if (!checkDate(intakeDate) || intakeDate < input.birthDate) return fail('Dastlabki murojaat sanasi tug‘ilgan sanadan oldin yoki kelajakda bo‘lmasligi kerak.')
    if (!(input.region in REGION_LABELS)) return fail('Xizmat hududini tanlang.')
    if (input.pinfl && !/^\d{14}$/.test(input.pinfl)) return fail('JShShIR 14 ta raqamdan iborat bo‘lishi kerak.')
    if (ageOn(input.birthDate, dateNow()) >= 18) return fail('Yangi murojaat 18 yoshga to‘lmagan bola uchun ochiladi. Statsionardagi davom ettirish alohida qaror bilan yuritiladi.')
    if (state.cases.some(c => c.childName.trim().toLocaleLowerCase() === input.childName.trim().toLocaleLowerCase() && c.birthDate === input.birthDate)) return fail('Shu F.I.Sh. va tug‘ilgan sana bilan ish mavjud. Reyestrdagi kartani oching.')
    const caseId = id('case'); const c: PalliativeCase = { ...casePayload(input), intakeDate, childName: input.childName.trim(), id: caseId, number: `PAL-${dateNow().slice(0, 4)}-${String(state.cases.length + 1).padStart(4, '0')}`, createdAt: now(), assessmentDueDate: addWorkingDays(intakeDate, 3), status: 'INTAKE', assessments: [], decisions: [], episodes: [], careTasks: [], contacts: [], timeline: [], handoffs: [] }
    log(c, 'Murojaat ro‘yxatga olindi', `${c.guardianName} · ${c.clinic}`); state.cases.unshift(c); return ok(caseId)
  }
  function recordAssessment(caseId: string, input: AssessmentInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (c.familySupport) return fail('Vafotdan keyingi oilaviy ishga klinik baholash qo‘shilmaydi.')
    if (!Number.isFinite(input.score) || input.score < 0 || input.score > 100 || !checkDate(input.date) || input.date < (c.intakeDate ?? c.createdAt.slice(0, 10))) return fail('0–100 oralig‘idagi ball va murojaatdan keyingi haqiqiy baholash sanasini kiriting.')
    if (![input.assessor, input.methodology, input.document].every(v => v?.trim())) return fail('Baholovchi, metodika versiyasi va natija hujjati kerak.')
    const suggested = input.type === 'HOME' ? suggestedWeeklyVisits(input.score) : undefined
    if (input.weeklyVisits !== undefined && (!Number.isInteger(input.weeklyVisits) || input.weeklyVisits < 1 || input.weeklyVisits > 7)) return fail('Haftalik tashrif soni 1–7 oralig‘idagi butun son bo‘lishi kerak.')
    if (input.type === 'HOME' && input.weeklyVisits !== undefined && input.weeklyVisits !== suggested && !input.overrideReason?.trim()) return fail('Tashrif sonini o‘zgartirish uchun konsilium qarori va sababini kiriting.')
    c.assessments.push({ ...input, id: id('assessment'), suggestedVisits: suggested })
    if (input.type === 'PAPAS' && !activeEpisode(c)) c.status = input.score < 15 ? 'OBSERVATION' : c.referral?.status === 'SUBMITTED' ? 'CONSILIUM' : 'REFERRAL'
    log(c, input.type === 'PAPAS' ? 'PaPaS baholandi' : 'Uyda yordam ehtiyoji baholandi', `${input.score} ball · ${input.methodology}${input.overrideReason ? ` · ${input.overrideReason}` : ''}`, input.assessor); return ok()
  }
  function updateCase(caseId: string, input: CaseInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (![input.childName, input.guardianName, input.relationship, input.phone, input.address, input.district, input.familyDoctor, input.clinic, input.diagnosis].every(v => v?.trim()) || !checkDate(input.birthDate) || !(input.region in REGION_LABELS)) return fail('Bola, vakil, manzil va shifokor maydonlarini to‘liq va to‘g‘ri kiriting.')
    if (input.pinfl && !/^\d{14}$/.test(input.pinfl)) return fail('JShShIR 14 ta raqamdan iborat bo‘lishi kerak.')
    const intakeDate = input.intakeDate ?? c.intakeDate ?? c.createdAt.slice(0, 10)
    if (!checkDate(intakeDate) || intakeDate < input.birthDate) return fail('Dastlabki murojaat sanasi tug‘ilgan sanadan oldin yoki kelajakda bo‘lmasligi kerak.')
    if (c.assessments.some(a => a.date < intakeDate) || (c.referral && c.referral.date < intakeDate)) return fail('Murojaat sanasi saqlangan baholash yoki yo‘llanma sanasidan keyin bo‘lishi mumkin emas.')
    if (input.birthDate !== c.birthDate && (c.episodes.length > 0 || ageOn(input.birthDate, dateNow()) >= 18)) return fail('Xizmat tarixi mavjud ishda tug‘ilgan sanani o‘zgartirish alohida tekshiruv talab qiladi; prototipda bloklangan.')
    if (state.cases.some(other => other.id !== c.id && other.childName.trim().toLocaleLowerCase() === input.childName.trim().toLocaleLowerCase() && other.birthDate === input.birthDate)) return fail('Shu bola uchun boshqa ish mavjud.')
    Object.assign(c, casePayload(input), { intakeDate, assessmentDueDate: addWorkingDays(intakeDate, 3) }); log(c, 'Bola/oila ma’lumoti yangilandi', `${input.childName} · ${input.guardianName}`); return ok()
  }
  function saveReferral(caseId: string, input: ReferralInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (activeEpisode(c) || c.familySupport) return fail('Faol xizmat yoki oilaga yordam paytida yo‘llanmani almashtirish mumkin emas.')
    if (!input.number?.trim() || !checkDate(input.date)) return fail('Yo‘llanma raqami va haqiqiy sanasi kerak.')
    if (state.cases.some(other => other.id !== c.id && other.referral && ((input.externalId?.trim() && other.referral.externalId === input.externalId.trim()) || (other.referral.number === input.number.trim() && other.referral.organization === input.organization && other.referral.date === input.date)))) return fail('Ushbu manba yo‘llanmasi boshqa ishda mavjud.')
    if (c.referral) { c.referralHistory ??= []; c.referralHistory.push(JSON.parse(JSON.stringify(c.referral))) }
    c.referral = { ...input, number: input.number.trim(), id: id('referral'), status: 'DRAFT' }; c.status = 'REFERRAL'
    log(c, 'Yo‘llanma saqlandi', `${input.number} · ${input.organization} · lokal qayd`); return ok()
  }
  function submitReferral(caseId: string): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (activeEpisode(c) || c.familySupport) return fail('Bu ishda yo‘llanmani qayta yuborish mumkin emas.')
    if (c.referral?.status === 'SUBMITTED') return fail('Yo‘llanma allaqachon konsiliumga yuborilgan.')
    const errors = referralErrors(c); if (errors.length) return fail(errors.join(' '))
    c.referral!.status = 'SUBMITTED'; c.referral!.submittedAt = now(); c.status = 'CONSILIUM'; log(c, 'Markaz konsiliumiga yuborildi', 'Manba konsiliumi va yo‘llanma to‘liqligi tekshirildi; Markaz qarori hali kutilmoqda.'); return ok()
  }
  function recordDecision(caseId: string, input: DecisionInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (!['CONSILIUM', 'PAUSED', 'REJECTED', 'APPROVED'].includes(c.status) || c.referral?.status !== 'SUBMITTED') return fail('Avval to‘liq yo‘llanmani Markaz konsiliumiga yuboring.')
    if (![input.number, input.members, input.reason].every(v => v?.trim()) || !checkDate(input.date) || input.date < c.referral.date) return fail('Konsilium raqami, tarkibi, asos va yo‘llanmadan keyingi haqiqiy qaror sanasi kerak.')
    if (input.outcome === 'PAUSE' && (!input.destination?.trim() || !input.reviewDate || !isValidDate(input.reviewDate) || input.reviewDate < input.date)) return fail('Vaqtincha to‘xtatishda boshqa tibbiyot muassasasi va qayta ko‘rish sanasi kerak.')
    if (input.outcome === 'APPROVE') {
      const errors = referralErrors(c); if (errors.length) return fail(errors.join(' '))
      if (ageOn(c.birthDate, input.date) >= 18) return fail('18 yoshga to‘lgan shaxs yangi qabul qilinmaydi.')
      if (!input.safeCare || !input.safeTransport) return fail('Xavfsiz yordam va transportirovka imkoniyatini konsilium tasdiqlashi kerak.')
      if (input.service === 'MOBILE' && (!input.consent || !input.consentPerson.trim())) return fail('Mobil yordam uchun vakil/yaqin qarindosh roziligi va F.I.Sh. kerak.')
    }
    c.decisions.push({ ...input, id: id('decision') }); c.status = input.outcome === 'APPROVE' ? 'APPROVED' : input.outcome === 'PAUSE' ? 'PAUSED' : 'REJECTED'
    log(c, 'Markaz konsiliumi qarori', `${STATUS_LABELS[c.status]} · ${input.number} · ${input.reason}`, input.members); return ok()
  }
  function addCareTask(caseId: string, input: CareTaskInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (!input.title.trim() || !input.assignee.trim() || !isValidDate(input.dueDate)) return fail('Vazifa, mas’ul va haqiqiy muddatni kiriting.')
    if (c.familySupport && dateNow() > c.familySupport.deadline) return fail('Oilaga uch oylik yordam muddati tugagan; yangi xizmat vazifasi qo‘shilmaydi. Mas’ul xodim yakunlashni ko‘rib chiqadi.')
    if (c.familySupport && (input.target !== 'FAMILY' || c.familySupport.status !== 'ACTIVE' || input.dueDate > c.familySupport.deadline)) return fail('Oilaga yordam uchun faol muddat ichidagi oilaviy vazifani kiriting.')
    const taskId = id('task'); c.careTasks.push({ ...input, id: taskId, status: 'PLANNED' }); log(c, 'Individual reja to‘ldirildi', `${input.title} · ${input.assignee} · ${input.dueDate}`); return ok(taskId)
  }
  function completeCareTask(caseId: string, taskId: string, note: string): ActionResult {
    const c = find(caseId); if (!c) return missing(); const task = c.careTasks.find(t => t.id === taskId)
    if (!task || task.status !== 'PLANNED') return fail('Bajarilishi kutilayotgan vazifa topilmadi.')
    if (!note.trim()) return fail('Xizmat natijasini yozing.')
    if (c.familySupport && task.target === 'FAMILY' && dateNow() > c.familySupport.deadline) return fail('Oilaga uch oylik yordam muddati tugagan; xizmatni hozir bajarilgan deb qayd etib bo‘lmaydi.')
    if (c.familySupport && task.target === 'CHILD') return fail('Vafotdan keyin bola uchun klinik xizmat bajarilgan deb belgilanmaydi.')
    task.status = 'DONE'; task.completedAt = now(); task.completionNote = note; log(c, 'Reja vazifasi bajarildi', `${task.title} · ${note}`, task.assignee); return ok()
  }
  function addContact(caseId: string, input: ContactInput): ActionResult {
    const c = find(caseId); if (!c) return missing(); if (!input.note.trim() || !input.author.trim()) return fail('Murojaat mazmuni va mas’ulni kiriting.')
    c.contacts.push({ ...input, id: id('contact'), date: now() }); log(c, 'Aloqa qaydi qo‘shildi', input.note, input.author); return ok()
  }
  function plannedDays(c: PalliativeCase, start: string, end: string, exceptId?: string) {
    let maximum = 0
    for (let year = Number(start.slice(0, 4)); year <= Number(end.slice(0, 4)); year++) {
      const rangeStart = start > `${year}-01-01` ? start : `${year}-01-01`; const rangeEnd = end < `${year}-12-31` ? end : `${year}-12-31`
      const prior = inpatientDaysInYear({ ...c, episodes: c.episodes.filter(e => e.id !== exceptId) }, year, dateNow())
      const days = Math.round((Date.parse(rangeEnd) - Date.parse(rangeStart)) / DAY) + 1
      maximum = Math.max(maximum, prior + days)
    }
    return maximum
  }
  function startEpisode(caseId: string, input: EpisodeInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (c.status !== 'APPROVED' || activeEpisode(c) || c.familySupport) return fail('Yordamni boshlash uchun Markaz konsiliumining yangi qabul qarori kerak.')
    const decision = c.decisions.slice(-1)[0]
    if (!decision || decision.outcome !== 'APPROVE' || decision.service !== input.service) return fail('Xizmat shakli Markaz konsiliumi qaroriga mos bo‘lishi kerak.')
    if (!checkDate(input.startDate) || input.startDate < decision.date || ageOn(c.birthDate, input.startDate) >= 18) return fail('Qabul sanasi qarordan oldin/kelajakda bo‘lmasligi va bola 18 yoshga to‘lmagan bo‘lishi kerak.')
    if (!input.decisionNumber.trim() || !input.decisionReason.trim()) return fail('Joylashtirishga asos bo‘lgan konsilium qarori va asosini kiriting.')
    if (input.service === 'INPATIENT') {
      const bed = state.beds.find(b => b.id === input.bedId)
      if (!bed?.available || state.cases.some(other => activeEpisode(other)?.bedId === input.bedId)) return fail('Tanlangan o‘rin band yoki foydalanishga tayyor emas.')
      if (input.admissionType === 'TEMPORARY') {
        if (!input.plannedEndDate || !isValidDate(input.plannedEndDate) || input.plannedEndDate < input.startDate) return fail('Vaqtinchalik qabulning haqiqiy rejalashtirilgan yakun sanasi kerak.')
        if (plannedDays(c, input.startDate, input.plannedEndDate) > 14) return fail('Yillik 14 kunlik boshlang‘ich limitdan oshadi. Avval limit ichida qabul qiling, keyin konsilium qarori bilan uzaytiring.')
        if (ageOn(c.birthDate, input.plannedEndDate) >= 18) return fail('18 yoshdan keyingi kunlar statsionarda davom ettirish qarori bilan alohida belgilanadi.')
      }
    } else {
      if (!state.teams.some(t => t.id === input.teamId)) return fail('Mobil brigadani tanlang.')
      const home = latestAssessment(c, 'HOME'); if (!home || !(home.weeklyVisits ?? home.suggestedVisits)) return fail('Mobil xizmat oldidan alohida uy ehtiyoji bahosini va tashriflar rejasini kiriting.')
      if (!decision.consent || !decision.consentPerson.trim()) return fail('Mobil yordam uchun rozilik qaydi kerak.')
    }
    const episodeId = id('episode'); c.episodes.push({ ...input, bedId: input.service === 'INPATIENT' ? input.bedId : undefined, teamId: input.service === 'MOBILE' ? input.teamId : undefined, plannedEndDate: input.admissionType === 'TERMINAL' || input.service === 'MOBILE' ? undefined : input.plannedEndDate, id: episodeId, status: 'ACTIVE', extensions: [] }); c.status = input.service
    log(c, `${SERVICE_LABELS[input.service]} boshlandi`, `${input.startDate} · qaror ${input.decisionNumber} · ${input.decisionReason}`); return ok(episodeId)
  }
  function extendEpisode(caseId: string, input: EpisodeExtensionInput): ActionResult {
    const c = find(caseId); if (!c) return missing(); const e = activeEpisode(c)
    if (!e || e.service !== 'INPATIENT') return fail('Faol statsionar epizod topilmadi.')
    if (![input.decisionNumber, input.reason].every(v => v?.trim()) || !checkDate(input.decisionDate) || input.decisionDate < e.startDate || !isValidDate(input.plannedEndDate) || input.plannedEndDate < input.decisionDate || input.plannedEndDate < e.startDate || (e.plannedEndDate && input.plannedEndDate <= e.plannedEndDate)) return fail('Uzaytirish qarori, sababi va avvalgi muddatdan keyingi haqiqiy sanalarni kiriting.')
    if (ageOn(c.birthDate, input.plannedEndDate) >= 21) return fail('Statsionar yordam 21 yoshga to‘lish chegarasidan davom ettirilmaydi.')
    if (ageOn(c.birthDate, input.plannedEndDate) >= 18 && !input.adultContinuation) return fail('18 yoshdan keyingi davom ettirish uchun konsiliumning alohida tasdig‘i kerak.')
    if (e.admissionType !== 'TERMINAL' && plannedDays(c, e.startDate, input.plannedEndDate, e.id) > 28) return fail('Kalendar yilidagi jami vaqtinchalik yotish 28 kundan oshmaydi (prototip hisob qoidasi).')
    e.extensions.push({ ...input, id: id('extension') }); e.plannedEndDate = input.plannedEndDate; log(c, 'Statsionar muddati uzaytirildi', `${input.plannedEndDate} gacha · ${input.decisionNumber} · ${input.reason}`); return ok()
  }
  function closeEpisode(caseId: string, input: EpisodeCloseInput): ActionResult {
    const c = find(caseId); if (!c) return missing(); const e = activeEpisode(c)
    if (!e) return fail('Faol xizmat epizodi topilmadi.')
    if (!checkDate(input.endDate) || input.endDate < e.startDate || !input.summary.trim() || !input.document.trim()) return fail('Qabuldan keyingi haqiqiy chiqarish sanasi, xulosa va epikriz/topshirish hujjati kerak.')
    if (input.reason === 'DEATH' && input.deathObjection && !input.pathologyReferral?.trim()) return fail('Vafot sababiga e’tiroz bo‘lsa, patologiya bo‘limiga yo‘naltirishni kiriting.')
    e.status = 'CLOSED'; e.endDate = input.endDate; e.closure = { ...input }
    for (const visit of state.visits.filter(v => v.caseId === c.id && ['PLANNED', 'IN_PROGRESS'].includes(v.status))) { visit.status = 'CANCELLED'; visit.note = 'Xizmat epizodi yakunlangani sababli bekor qilindi.' }
    if (input.reason === 'DEATH') { c.status = 'BEREAVEMENT'; c.familySupport = { status: 'ACTIVE', startDate: input.endDate, deadline: addCalendarMonths(input.endDate, 3) } } else c.status = 'FOLLOW_UP'
    log(c, input.reason === 'DEATH' ? 'Klinik epizod yakunlandi; oilaga yordam ochildi' : 'Xizmat yakunlandi; topshirish kutilmoqda', `${input.endDate} · ${input.summary} · ${input.document}`); return ok()
  }
  function recordHandoff(caseId: string, input: HandoffInput): ActionResult {
    const c = find(caseId); if (!c) return missing()
    if (c.status !== 'FOLLOW_UP' || activeEpisode(c)) return fail('Topshirish xizmat yakunlangandan keyin qayd etiladi.')
    if (![input.doctor, input.clinic, input.document, input.note].every(v => v?.trim()) || !checkDate(input.date) || !isValidDate(input.nextReviewDate) || input.nextReviewDate < input.date || input.date < (c.episodes.slice(-1)[0]?.endDate ?? c.createdAt.slice(0, 10))) return fail('Qabul qilgan shifokor, tashkilot, hujjat, xulosa va haqiqiy kuzatuv sanalari kerak.')
    c.handoffs.push({ ...input, id: id('handoff') }); log(c, 'Oilaviy shifokorga topshirildi', `${input.doctor} · ${input.clinic} · keyingi ko‘rik ${input.nextReviewDate}`); return ok()
  }
  function closeFamilySupport(caseId: string): ActionResult {
    const c = find(caseId); if (!c || c.familySupport?.status !== 'ACTIVE') return fail('Faol oilaviy yordam topilmadi.')
    const unfinished = c.careTasks.filter(t => t.target === 'FAMILY' && t.status === 'PLANNED')
    for (const task of unfinished) { task.status = 'CANCELLED'; task.cancellationNote = 'Oilaga yordam mas’ul xodim tomonidan yakunlangani sababli bajarilmagan vazifa bekor qilindi.' }
    if (unfinished.length) log(c, 'Bajarilmagan oilaviy vazifalar bekor qilindi', `${unfinished.length} ta vazifa · ${unfinished.map(t => t.title).join('; ')}`)
    for (const visit of state.visits.filter(v => v.caseId === c.id && ['PLANNED', 'IN_PROGRESS'].includes(v.status))) { visit.status = 'CANCELLED'; visit.note = 'Oilaga yordam mas’ul tomonidan yakunlangani sababli bekor qilindi.' }
    c.familySupport.status = 'CLOSED'; c.familySupport.closedAt = now(); c.status = 'CLOSED'; log(c, 'Oilaga yordam yakunlandi', 'Mas’ul xodim tomonidan yakunlash qayd etildi.'); return ok()
  }
  function scheduleVisit(input: VisitInput): ActionResult {
    const c = find(input.caseId); if (!c) return missing()
    const e = activeEpisode(c); if (e?.service !== 'MOBILE' && c.familySupport?.status !== 'ACTIVE') return fail('Tashrif faol mobil epizod yoki oilaviy yordamga bog‘lanadi.')
    if (!state.teams.some(t => t.id === input.teamId)) return fail('Brigadani tanlang.')
    const time = Date.parse(input.scheduledAt)
    if (!Number.isFinite(time) || !Number.isInteger(input.durationMinutes) || input.durationMinutes < 15 || input.durationMinutes > 480 || !input.purpose.trim()) return fail('Haqiqiy tashrif vaqti, 15–480 daqiqa davomiylik va maqsadini kiriting.')
    if (input.scheduledAt.slice(0, 10) < (e?.startDate ?? c.familySupport!.startDate)) return fail('Tashrif xizmat boshlanishidan oldin bo‘lmaydi.')
    if (c.familySupport && input.scheduledAt.slice(0, 10) > c.familySupport.deadline) return fail('Oilaga yordam uch kalendar oylik muddat doirasida rejalashtiriladi.')
    const end = time + input.durationMinutes * 60_000
    if (state.visits.some(v => v.status !== 'CANCELLED' && (v.teamId === input.teamId || v.caseId === input.caseId) && time < Date.parse(v.scheduledAt) + v.durationMinutes * 60_000 && end > Date.parse(v.scheduledAt))) return fail('Bu vaqtda brigada yoki bolaning boshqa tashrifi band. Boshqa vaqt tanlang.')
    const visitId = id('visit'); state.visits.push({ ...input, id: visitId, target: c.familySupport?.status === 'ACTIVE' ? 'FAMILY' : 'CHILD', status: 'PLANNED' }); log(c, 'Tashrif rejalashtirildi', `${input.scheduledAt} · ${input.type === 'HOME' ? 'Uyga tashrif' : 'Masofaviy maslahat'} · ${input.purpose}`); return ok(visitId)
  }
  function startVisit(visitId: string): ActionResult {
    const v = state.visits.find(visit => visit.id === visitId); if (!v || v.status !== 'PLANNED') return fail('Rejalashtirilgan tashrif topilmadi.')
    const patient = find(v.caseId)
    if (!patient || (activeEpisode(patient)?.service !== 'MOBILE' && patient.familySupport?.status !== 'ACTIVE')) return fail('Tashrif uchun faol mobil yoki oilaviy yordam topilmadi.')
    if (patient.familySupport && dateNow() > patient.familySupport.deadline) return fail('Oilaga uch oylik yordam muddati tugagan; mas’ul xodim yakunlashni ko‘rib chiqadi.')
    if (Date.parse(v.scheduledAt) > clock().getTime()) return fail('Kelajakdagi tashrifni hozir boshlash mumkin emas.')
    if (state.visits.some(other => other.id !== v.id && other.teamId === v.teamId && other.status === 'IN_PROGRESS')) return fail('Brigadaning boshqa tashrifi hali yakunlanmagan.')
    v.status = 'IN_PROGRESS'; v.startedAt = now(); const c = getCase(v.caseId); if (c) log(c, 'Tashrif boshlandi', v.purpose); return ok()
  }
  function completeVisit(visitId: string, note: string): ActionResult {
    const v = state.visits.find(visit => visit.id === visitId); if (!v || v.status !== 'IN_PROGRESS') return fail('Avval tashrifni boshlang.')
    if (!note.trim()) return fail('Tashrif natijasini yozing.')
    v.status = 'COMPLETED'; v.completedAt = now(); v.note = note; const c = getCase(v.caseId); if (c) log(c, v.type === 'HOME' ? 'Uyga tashrif bajarildi' : 'Masofaviy maslahat bajarildi', note); return ok()
  }
  function issueEquipment(equipmentId: string, caseId: string, agreement: string): ActionResult {
    const c = find(caseId); if (!c) return missing(); const item = state.equipment.find(e => e.id === equipmentId)
    if (activeEpisode(c)?.service !== 'MOBILE' || c.familySupport) return fail('Jihoz uyda bepul foydalanish uchun faol mobil yordam olayotgan bolaga beriladi.')
    if (!item || item.status !== 'AVAILABLE' || item.allocations.some(a => !a.returnedAt)) return fail('Jihoz mavjud emas yoki boshqa bolaga berilgan.')
    if (!agreement.trim()) return fail('Vakil bilan bepul foydalanish shartnomasi raqamini kiriting.')
    item.status = 'ISSUED'; item.allocations.push({ id: id('allocation'), caseId, agreement, issuedAt: now() }); log(c, 'Jihoz berildi', `${item.name} · ${item.inventoryNumber} · shartnoma ${agreement}`); return ok()
  }
  function returnEquipment(equipmentId: string, note: string, needsMaintenance = false): ActionResult {
    const item = state.equipment.find(e => e.id === equipmentId); const allocation = item?.allocations.find(a => !a.returnedAt)
    if (!item || !allocation || item.status !== 'ISSUED') return fail('Faol jihoz berish qaydi topilmadi.')
    if (!note.trim()) return fail('Qaytarishdagi holat va dalolatnoma qaydini kiriting.')
    allocation.returnedAt = now(); allocation.returnNote = note; item.status = needsMaintenance ? 'MAINTENANCE' : 'AVAILABLE'; item.condition = note
    const c = getCase(allocation.caseId); if (c) log(c, 'Jihoz qaytarildi', `${item.name} · ${note}`); return ok()
  }
  return { getCase, createCase, updateCase, recordAssessment, saveReferral, submitReferral, recordDecision, addCareTask, completeCareTask, addContact, startEpisode, extendEpisode, closeEpisode, recordHandoff, closeFamilySupport, scheduleVisit, startVisit, completeVisit, issueEquipment, returnEquipment }
}
