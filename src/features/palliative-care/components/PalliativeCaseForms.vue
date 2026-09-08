<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Check, CircleX, FilePenLine, LoaderCircle, PauseCircle, X } from 'lucide-vue-next'
import PalliativeDialog from './PalliativeDialog.vue'
import { usePalliativeStore } from '../store'
import { addDays, latestAssessment, REGION_LABELS, today } from '../domain'
import { decisionTone } from '../presenters'
import type { ActionResult, AssessmentInput, CareTaskInput, CaseInput, ContactInput, DecisionInput, HandoffInput, ReferralInput } from '../types'

export type CaseFormKind = '' | 'new' | 'edit' | 'assessment' | 'home-assessment' | 'referral' | 'decision' | 'task' | 'complete-task' | 'contact' | 'handoff'
const props = defineProps<{ kind: CaseFormKind; caseId?: string; taskId?: string }>()
const emit = defineEmits<{ close: []; done: [result: ActionResult, kind: CaseFormKind] }>()
const store = usePalliativeStore()
const values = reactive<Record<string, string | number | boolean>>({})
const error = ref('')
const saving = ref(false)
const demoFilled = ref(false)
const touchedFields = new Set<string>()
const previousDemoValues = new Map<string, string | number | boolean>()
type Field = { key: string; label: string; type?: string; required?: boolean; options?: { value: string; label: string }[]; section?: string; hint?: string; wide?: boolean; min?: number; max?: number }
const options = (items: [string, string][]) => items.map(([value, label]) => ({ value, label }))
const services = options([['INPATIENT', 'Statsionar — xospis'], ['MOBILE', 'Mobil — uy sharoitida']])
const sourceKinds = options([['LOCAL', 'Prototipda rasmiylashtirish'], ['PAPER', 'Yozma yo‘llanma'], ['EPALLIATIVE', 'E-palliative namunasi']])
const metadata: Record<Exclude<CaseFormKind, ''>, { title: string; description: string }> = {
  new: { title: 'Yangi bola kartasi', description: 'Murojaatni qayd eting va keyingi ish uchun mas’ul shifokorni belgilang.' },
  edit: { title: 'Bola ma’lumotlarini tahrirlash', description: 'Shaxs va oila ma’lumotlarini aniqlashtiring.' },
  assessment: { title: 'PaPaS natijasini qayd etish', description: 'Shifokor tasdiqlagan natijani kiriting. Bu shakl klinik baholashni o‘zi hisoblamaydi.' },
  'home-assessment': { title: 'Uyda yordam ehtiyojini baholash', description: 'Uyda yordam bahosi PaPaSdan alohida saqlanadi. Metodika va baholovchini ko‘rsating.' },
  referral: { title: 'Palliativ yordam uchun yo‘llanma', description: '316-son buyruqning 2-ilovasi asosida. Hujjatlar ushbu prototipda rekvizitlari bilan qayd etiladi.' },
  decision: { title: 'Markaz konsiliumi qarori', description: 'Yo‘llanma bergan muassasa xulosasidan alohida qaror. Qaror va uning asosini konsilium belgilaydi.' },
  task: { title: 'Individual rejaga vazifa', description: 'Bola yoki oila qanday yordam olishini, ijrochi va muddatni belgilang.' },
  'complete-task': { title: 'Bajarilgan yordamni qayd etish', description: 'Amalda ko‘rsatilgan yordam va uning natijasini yozing.' },
  contact: { title: 'Muloqot yoki murojaatni qayd etish', description: 'Maslahat, qo‘ng‘iroq va murojaatlar bolaning umumiy tarixida saqlanadi.' },
  handoff: { title: 'Oilaviy shifokorga topshirish', description: 'Keyingi kuzatuv uchun qabul qiluvchi shifokor va sanani ko‘rsating.' },
}
const meta = computed(() => props.kind ? metadata[props.kind] : { title: '', description: '' })
const submitTone = computed(() => props.kind === 'decision' && values.outcome === 'REJECT' ? 'bg-rose-700 hover:bg-rose-800 text-white' : props.kind === 'decision' && values.outcome === 'PAUSE' ? 'bg-amber-700 hover:bg-amber-800 text-white' : 'bg-emerald-700 hover:bg-emerald-800 text-white')
const submitLabel = computed(() => props.kind === 'decision' ? values.outcome === 'REJECT' ? 'Rad etishni qayd etish' : values.outcome === 'PAUSE' ? 'Vaqtincha to‘xtatishni qayd etish' : 'Qabulni tasdiqlash' : props.kind === 'referral' ? 'Yo‘llanmani saqlash' : 'Saqlash')
const fields = computed<Field[]>(() => {
  switch (props.kind) {
    case 'new': case 'edit': return [
      { key: 'childName', label: 'Bolaning F.I.Sh.', required: true, wide: true, section: 'Bola haqida' },
      { key: 'birthDate', label: 'Tug‘ilgan sana', type: 'date', required: true },
      { key: 'sex', label: 'Jinsi', options: options([['MALE', 'O‘g‘il bola'], ['FEMALE', 'Qiz bola']]) },
      { key: 'pinfl', label: 'JShShIR', hint: 'Prototip uchun ixtiyoriy. Haqiqiy shaxs ma’lumotlarini ishlatish shart emas.' },
      { key: 'identityType', label: 'Shaxsni tasdiqlovchi hujjat', options: options([['BIRTH_CERTIFICATE', 'Tug‘ilganlik guvohnomasi'], ['PASSPORT', 'Pasport / ID']]) },
      { key: 'identityNumber', label: 'Hujjat seriyasi va raqami' },
      { key: 'region', label: 'Viloyat', options: Object.entries(REGION_LABELS).map(([value, label]) => ({ value, label })) },
      { key: 'district', label: 'Tuman / shahar', required: true },
      { key: 'address', label: 'Yashash manzili', required: true },
      { key: 'guardianName', label: 'Qonuniy vakil F.I.Sh.', required: true, section: 'Oila va qonuniy vakil' },
      { key: 'relationship', label: 'Qarindoshligi', required: true },
      { key: 'phone', label: 'Aloqa telefoni', type: 'tel', required: true },
      { key: 'intakeDate', label: 'Poliklinikaga dastlabki murojaat sanasi', type: 'date', required: true, section: 'Murojaat va keyingi yordam', hint: 'Avval berilgan yozma yo‘llanmada asl murojaat sanasini kiriting.' },
      { key: 'familyDoctor', label: 'Mas’ul oilaviy shifokor', required: true },
      { key: 'clinic', label: 'Poliklinika', required: true },
      { key: 'diagnosis', label: 'Asosiy tashxis / dastlabki ma’lumot', required: true },
      { key: 'medicalIndication', label: '1-ilovadagi tibbiy ko‘rsatma', options: options([['', 'Baholashda aniqlanadi'], ['NEUROLOGICAL', 'Asab tizimi kasalliklari'], ['NEUROMUSCULAR', 'Progressiyalanuvchi nerv-mushak kasalliklari'], ['GENETIC', 'Genetik, irsiy va orfan kasalliklar'], ['ONCOLOGICAL', 'Onkologik va onkogematologik kasalliklar']]) },
      { key: 'symptoms', label: 'Yetakchi simptom va ehtiyojlar', type: 'textarea', hint: 'Masalan: og‘riq, oziqlanish, psixologik yordam. Vergul bilan ajrating.', wide: true },
      { key: 'requestedService', label: 'So‘ralayotgan yordam shakli', options: services },
      { key: 'urgency', label: 'Ish ustuvorligi', options: options([['ROUTINE', 'Odatiy'], ['PRIORITY', 'Birinchi navbatda']]) },
      { key: 'notes', label: 'Murojaat mazmuni', type: 'textarea', wide: true },
    ]
    case 'assessment': case 'home-assessment': return [
      { key: 'score', label: 'Shifokor tasdiqlagan ball', type: 'number', required: true, min: 0, max: 100 },
      { key: 'date', label: 'Baholash sanasi', type: 'date', required: true },
      { key: 'assessor', label: 'Baholovchi shifokor F.I.Sh.', required: true },
      { key: 'methodology', label: 'Metodika nomi va versiyasi', required: true },
      { key: 'document', label: 'Baholash hujjati rekviziti', required: true, wide: true },
      ...(props.kind === 'home-assessment' ? [
        { key: 'weeklyVisits', label: 'Konsilium belgilagan haftalik uy tashrifi', type: 'number', min: 1, max: 7, hint: 'Bo‘sh qoldirsangiz 15–20: 1, 21–24: 2, 25+: 3 marta taklif qilinadi.' },
        { key: 'overrideReason', label: 'Me’yordan o‘zgartirish uchun konsilium asosi' },
      ] : []),
      { key: 'notes', label: 'Izoh', type: 'textarea', wide: true },
    ]
    case 'referral': return [
      { key: 'number', label: 'Yo‘llanma raqami', required: true, section: 'Yo‘llanma rekvizitlari' },
      { key: 'date', label: 'Rasmiylashtirish sanasi', type: 'date', required: true },
      { key: 'source', label: 'Yo‘llanma manbasi', options: sourceKinds },
      { key: 'organization', label: 'Vakolatli yo‘llanma beruvchi muassasa', required: true },
      ...(values.source === 'EPALLIATIVE' ? [{ key: 'externalId', label: 'Tashqi yo‘llanma IDsi', required: true, hint: 'Qo‘lda kiritiladigan namuna; haqiqiy integratsiya ulanmagan.' }] : []),
      ...(values.source === 'PAPER' ? [{ key: 'outageReason', label: 'Texnik nosozlik sababi', required: true, wide: true }] : []),
      { key: 'sourceConsiliumNumber', label: 'Tibbiy konsilium xulosasi raqami', required: true, section: 'Yo‘llanma beruvchi muassasa konsiliumi' },
      { key: 'sourceConsiliumDate', label: 'Xulosa sanasi', type: 'date', required: true },
      { key: 'sourceConsiliumMembers', label: 'Konsilium tarkibi', required: true, wide: true },
      { key: 'sourceConsiliumEligible', label: 'Konsilium palliativ yordamga muvofiqligini tasdiqlagan', type: 'checkbox', wide: true },
      { key: 'diagnosisCode', label: 'Konsilium qo‘ygan XKT-10 kodi', required: true, hint: 'Qabul uchun hujjatda Z51.5 ko‘rsatiladi; tizim tashxis qo‘ymaydi.' },
      { key: 'service', label: 'Klinik marshrut / yordam shakli', options: services },
      { key: 'transportNotes', label: 'Yo‘naltirish sababi va birinchi navbatdagi vazifalar', required: true, type: 'textarea', wide: true },
      { key: 'requiredEquipment', label: 'Zarur jihozlar', hint: 'Vergul bilan ajrating: kislorod konsentratori, aspirator, funksional karavot…', wide: true },
      { key: 'historyExtract', label: 'Kasallik tarixidan ko‘chirma rekviziti', required: true, section: 'Hujjatlar hisobi' },
      { key: 'historyPages', label: 'Ko‘chirma varaqlari soni', type: 'number', required: true, min: 1 },
      { key: 'examinationDocument', label: 'Tekshiruv natijalari rekviziti', required: true },
      { key: 'examinationPages', label: 'Tekshiruv varaqlari soni', type: 'number', required: true, min: 1 },
      { key: 'papasDocument', label: 'PaPaS natijasi hujjati', required: true, wide: true },
      { key: 'referringDoctor', label: 'Yo‘naltiruvchi shifokor F.I.Sh.', required: true, section: 'Tasdiqlovchi shaxslar' },
      { key: 'doctorPosition', label: 'Shifokor lavozimi', required: true },
      { key: 'doctorPhone', label: 'Shifokor telefoni', type: 'tel', required: true },
      { key: 'chiefDoctor', label: 'Bosh shifokor / o‘rinbosar F.I.Sh.', required: true },
      { key: 'sourceConfirmation', label: 'Imzolangan xulosa / tasdiq rekviziti', required: true, wide: true, hint: 'Prototipda tasdiq rekviziti saqlanadi. Elektron imzo qo‘yilmaydi.' },
    ]
    case 'decision': return [
      { key: 'outcome', label: 'Konsilium qarori', options: options([['APPROVE', 'Qabul qilish'], ['PAUSE', 'Vaqtincha to‘xtatish va yo‘naltirish'], ['REJECT', 'Asosli rad etish']]) },
      { key: 'service', label: 'Yordam shakli', options: services },
      { key: 'number', label: 'Qaror raqami', required: true },
      { key: 'date', label: 'Qaror sanasi', type: 'date', required: true },
      { key: 'members', label: 'Konsilium tarkibi', required: true, wide: true, hint: 'Palliativ yordam shifokori, psixolog va ijtimoiy xodim.' },
      { key: 'reason', label: 'Qaror asosi', type: 'textarea', required: true, wide: true },
      ...(values.outcome === 'APPROVE' ? [
        { key: 'safeCare', label: 'Konsilium Markaz sharoitida yordam xavfsizligini tasdiqlagan', type: 'checkbox', wide: true },
        { key: 'safeTransport', label: 'Konsilium tibbiy transportirovka imkonini tasdiqlagan', type: 'checkbox', wide: true },
        { key: 'consent', label: 'Mobil yordamga vakil / yaqin qarindosh roziligi qayd etilgan', type: 'checkbox', wide: true },
        { key: 'consentPerson', label: 'Rozilik bergan shaxs, qarindoshligi va rozilik sanasi', wide: true },
      ] : [
        { key: 'destination', label: 'Keyingi davolash / kuzatuv muassasasi', required: values.outcome === 'PAUSE', wide: true },
        { key: 'reviewDate', label: 'Qayta ko‘rish sanasi', type: 'date', required: values.outcome === 'PAUSE' },
      ]),
    ]
    case 'task': return [
      { key: 'title', label: 'Ko‘rsatiladigan yordam va kutilgan natija', required: true, wide: true },
      { key: 'category', label: 'Xizmat yo‘nalishi', options: options([['MEDICAL', 'Tibbiy yordam'], ['NURSING', 'Parvarish'], ['PSYCHOLOGICAL', 'Psixologik yordam'], ['SOCIAL', 'Ijtimoiy xizmat'], ['FAMILY', 'Oilani o‘qitish / qo‘llab-quvvatlash']]) },
      { key: 'target', label: 'Yordam oluvchi', options: options([['CHILD', 'Bola'], ['FAMILY', 'Oila']]) },
      { key: 'assignee', label: 'Mas’ul mutaxassis', required: true },
      { key: 'dueDate', label: 'Bajarish muddati', type: 'date', required: true },
    ]
    case 'complete-task': return [{ key: 'note', label: 'Bajarilgan yordam va natija', type: 'textarea', required: true, wide: true }]
    case 'contact': return [
      { key: 'type', label: 'Muloqot turi', options: options([['CALL', 'Ishonch telefoniga qo‘ng‘iroq'], ['REMOTE', 'Masofaviy maslahat'], ['NOTE', 'Ish bo‘yicha qayd'], ['COMPLAINT', 'Shikoyat / murojaat']]) },
      { key: 'author', label: 'Qayd etgan xodim', required: true },
      { key: 'note', label: 'Muloqot mazmuni va keyingi harakat', type: 'textarea', required: true, wide: true },
    ]
    case 'handoff': return [
      { key: 'doctor', label: 'Qabul qiluvchi oilaviy shifokor', required: true },
      { key: 'clinic', label: 'Poliklinika', required: true },
      { key: 'date', label: 'Topshirish sanasi', type: 'date', required: true },
      { key: 'nextReviewDate', label: 'Keyingi kuzatuv sanasi', type: 'date', required: true },
      { key: 'document', label: 'Topshirish hujjati rekviziti', required: true, wide: true },
      { key: 'note', label: 'Kuzatuv rejasi', type: 'textarea', required: true, wide: true },
    ]
    default: return []
  }
})

watch(() => [props.kind, props.caseId, props.taskId], () => {
  for (const key of Object.keys(values)) delete values[key]
  error.value = ''
  demoFilled.value = false
  touchedFields.clear()
  previousDemoValues.clear()
  const item = props.caseId ? store.getCase(props.caseId) : undefined
  Object.assign(values, { date: today(), intakeDate: item?.createdAt.slice(0,10) ?? today(), sourceConsiliumDate: today(), sex: 'MALE', region: 'SAMARQAND', relationship: 'Onasi', requestedService: 'MOBILE', urgency: 'ROUTINE', identityType: 'BIRTH_CERTIFICATE', medicalIndication: '', type: 'CALL', category: 'NURSING', target: 'CHILD', dueDate: today(), nextReviewDate: today(), source: 'LOCAL', service: item?.requestedService ?? 'INPATIENT', outcome: 'APPROVE', sourceConsiliumEligible: false, safeCare: false, safeTransport: false, consent: false, consentPerson: '' })
  if (props.kind === 'edit' && item) Object.assign(values, item, { symptoms: item.symptoms?.join(', ') ?? '' })
  if (props.kind === 'referral' && item?.referral) Object.assign(values, item.referral, { requiredEquipment: item.referral.requiredEquipment.join(', ') })
  if (props.kind === 'assessment') values.methodology = 'PaPaS — tasdiqlangan natija'
  if (props.kind === 'home-assessment') values.methodology = 'Uyda yordam ehtiyoji — tasdiqlangan natija'
  if (props.kind === 'handoff' && item) Object.assign(values, { doctor: item.familyDoctor, clinic: item.clinic })
  for (const field of fields.value) if (values[field.key] === undefined) values[field.key] = field.type === 'checkbox' ? false : ''
}, { immediate: true })

function fillDemo() {
  const item = props.caseId ? store.getCase(props.caseId) : undefined
  const date = today()
  const suffix = item?.number.slice(-4) ?? String(store.cases.length + 1).padStart(4, '0')
  const samples: Record<string, string | number | boolean> = {}
  switch (props.kind) {
    case 'new': Object.assign(samples, {
      childName: `Demo bola ${store.cases.length + 1} (namuna)`, birthDate: `${Number(date.slice(0, 4)) - 8}-04-12`,
      district: 'Samarqand tumani', address: 'Namuna mahallasi, 12-uy (shartli manzil)',
      guardianName: 'Dilnoza Karimova (namuna)', phone: '+998 00 000 00 00', identityNumber: `DEMO-${suffix}`,
      familyDoctor: 'Nodira Aliyeva (namuna)', clinic: '12-oilaviy poliklinika (namuna)',
      diagnosis: 'Asab tizimi kasalligi bilan uzoq muddatli parvarishga ehtiyoj — demo holat', medicalIndication: 'NEUROLOGICAL',
      symptoms: 'Kundalik parvarish, harakatlanishda yordam, oilaga maslahat',
      notes: 'Onasi uyda parvarishni tashkil qilish va mutaxassis maslahatini olish uchun murojaat qildi. Dastlabki baholashni o‘tkazish kerak.',
    }); break
    case 'assessment': case 'home-assessment': Object.assign(samples, {
      score: props.kind === 'assessment' ? 18 : 23, assessor: item?.familyDoctor ?? 'Baholovchi shifokor (namuna)',
      document: `${props.kind === 'assessment' ? 'PAPAS' : 'UY'}-DEMO-${suffix}`,
      notes: props.kind === 'assessment' ? 'Demo natija: keyingi bosqichda tibbiy konsilium xulosasi va yo‘llanma rasmiylashtiriladi.' : 'Demo natija: haftasiga ikki uy tashrifi; oilaga parvarish bo‘yicha maslahat rejalashtiriladi.',
    }); break
    case 'referral': Object.assign(samples, {
      number: `DEMO-Y-${suffix}`, organization: 'Viloyat bolalar tibbiyot markazi (namuna)',
      sourceConsiliumNumber: `DEMO-TK-${suffix}`, sourceConsiliumMembers: 'Shifokor Dilshod Akbarov, shifokor Nigora Ergasheva (namuna)',
      sourceConsiliumEligible: true, diagnosisCode: 'Z51.5',
      transportNotes: 'Demo xulosa: parvarishni tashkil qilish, oila ehtiyojini baholash va individual yordam rejasini tuzish uchun yo‘naltirildi.',
      historyExtract: `DEMO-KOCH-${suffix}`, historyPages: 3, examinationDocument: `DEMO-TEK-${suffix}`, examinationPages: 2,
      papasDocument: item ? latestAssessment(item, 'PAPAS')?.document ?? `DEMO-PAPAS-${suffix}` : `DEMO-PAPAS-${suffix}`,
      referringDoctor: item?.familyDoctor ?? 'Yo‘naltiruvchi shifokor (namuna)', doctorPosition: 'Shifokor', doctorPhone: '+998 00 000 00 00',
      chiefDoctor: 'Aziz Rahimov (namuna)', sourceConfirmation: `DEMO-TASDIQ-${suffix} — namunaviy rekvizit`,
      ...(values.source === 'PAPER' ? { outageReason: 'Demo vaziyat: elektron kanal vaqtincha ishlamagani sabab yozma yo‘llanma berilgan.' } : {}),
      ...(values.source === 'EPALLIATIVE' ? { externalId: `DEMO-EXT-${suffix}` } : {}),
    }); break
    case 'decision': Object.assign(samples, {
      number: `DEMO-MK-${suffix}-${(item?.decisions.length ?? 0) + 1}`,
      members: 'Shifokor Kamol Sobirov, psixolog Nilufar Hamidova, ijtimoiy xodim Feruza Saidova (namuna)',
      reason: values.outcome === 'PAUSE' ? 'Demo qaror: boshqa tibbiyot muassasasidagi davolashdan so‘ng hujjatlar yangilanib, qabul qayta ko‘rib chiqiladi.' : values.outcome === 'REJECT' ? 'Demo qaror namunasi. Tanlangan qabul mezoniga mos kelmaslik asosi va keyingi kuzatuv yo‘li ushbu maydonda qayd etiladi.' : 'Demo qaror: taqdim etilgan hujjatlar ko‘rib chiqildi, tanlangan yordam shakli bo‘yicha individual reja tuzish belgilandi.',
      safeCare: true, safeTransport: true, consent: values.service === 'MOBILE',
      consentPerson: values.service === 'MOBILE' ? `${item?.guardianName ?? 'Qonuniy vakil (namuna)'} · ${date} · demo rozilik` : '',
      destination: 'Viloyat bolalar tibbiyot markazi (namuna)', reviewDate: addDays(date, 3),
    }); break
    case 'task': Object.assign(samples, {
      title: 'Oilaga kundalik parvarishni tushuntirish va savollariga javob berish', category: 'FAMILY', target: 'FAMILY',
      assignee: 'Hamshira Dilafruz Akbarova (namuna)', dueDate: addDays(date, 1),
    }); break
    case 'complete-task': Object.assign(samples, { note: `Demo bajarilish qaydi: ${item?.careTasks.find(task => task.id === props.taskId)?.title ?? 'Rejadagi yordam'}. Uchrashuv o‘tkazildi, savollarga javob berildi va keyingi ehtiyojlar qayd etildi.` }); break
    case 'contact': Object.assign(samples, { author: 'Ijtimoiy xodim Feruza Saidova (namuna)', note: 'Vakil bilan keyingi uchrashuv vaqti kelishildi. Oila parvarish bo‘yicha qo‘shimcha maslahat so‘radi; brigada jadvaliga vazifa kiritiladi. Demo muloqot.' }); break
    case 'handoff': Object.assign(samples, { nextReviewDate: addDays(date, 5), document: `DEMO-TOP-${suffix}`, note: 'Oilaviy shifokor kuzatuvni qabul qildi. Keyingi ko‘rikda bola holati va oilaning parvarish ehtiyojlari qayta ko‘riladi. Demo topshirish.' }); break
  }
  for (const [key, value] of Object.entries(samples)) {
    const field = fields.value.find(entry => entry.key === key)
    const belowMinimum = typeof value === 'number' && field?.min !== undefined && Number(values[key]) < field.min
    if (!touchedFields.has(key) && (values[key] === '' || values[key] === undefined || belowMinimum || values[key] === previousDemoValues.get(key) || typeof value === 'boolean' || ['category', 'target', 'nextReviewDate', 'dueDate'].includes(key))) {
      values[key] = value
      previousDemoValues.set(key, value)
    }
  }
  demoFilled.value = true
  error.value = ''
}

function readInput(event: Event, field: Field) {
  const input = event.target as HTMLInputElement
  touchedFields.add(field.key)
  values[field.key] = field.type === 'checkbox' ? input.checked : input.value
}
async function submit() {
  error.value = ''
  saving.value = true
  try {
    const payload: Record<string, unknown> = Object.fromEntries(fields.value.map(field => [field.key, values[field.key] ?? (field.type === 'checkbox' ? false : '')]))
    if (props.kind === 'decision') Object.assign(payload, { safeCare: Boolean(values.safeCare), safeTransport: Boolean(values.safeTransport), consent: Boolean(values.consent), consentPerson: String(values.consentPerson ?? '') })
    for (const field of fields.value) {
      if (field.type === 'number') payload[field.key] = values[field.key] === '' || values[field.key] === undefined ? undefined : Number(values[field.key])
    }
    const split = (value: unknown) => String(value ?? '').split(',').map((s) => s.trim()).filter(Boolean)
    let result: ActionResult = { ok: false, error: 'Amalni tanlang.' }
    const id = props.caseId ?? ''
    switch (props.kind) {
      case 'new': case 'edit': {
        payload.symptoms = split(payload.symptoms)
        const input = payload as unknown as CaseInput
        result = props.kind === 'new' ? store.createCase(input) : store.updateCase(id, input)
        break
      }
      case 'assessment': case 'home-assessment': result = store.recordAssessment(id, { ...payload, type: props.kind === 'assessment' ? 'PAPAS' : 'HOME' } as unknown as AssessmentInput); break
      case 'referral': result = store.saveReferral(id, { ...payload, requiredEquipment: split(payload.requiredEquipment) } as unknown as ReferralInput); break
      case 'decision': result = store.recordDecision(id, payload as unknown as DecisionInput); break
      case 'task': result = store.addCareTask(id, payload as unknown as CareTaskInput); break
      case 'complete-task': result = store.completeCareTask(id, props.taskId ?? '', String(payload.note ?? '')); break
      case 'contact': result = store.addContact(id, payload as unknown as ContactInput); break
      case 'handoff': result = store.recordHandoff(id, payload as unknown as HandoffInput); break
    }
    if (!result.ok) error.value = result.error ?? 'Saqlashda xatolik yuz berdi.'
    else emit('done', result, props.kind)
  } catch { error.value = 'Ma’lumot saqlanmadi. Kiritilgan maydonlarni tekshirib, qayta urinib ko‘ring.' }
  finally { saving.value = false }
}
</script>

<template>
  <PalliativeDialog :open="Boolean(kind)" :title="meta.title" :description="meta.description" @close="emit('close')">
    <form class="pc-form" @submit.prevent="submit">
      <div v-if="kind !== 'edit'" class="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/60 p-3">
        <p class="flex-1 text-xs leading-5 text-muted-foreground" role="status">{{ demoFilled ? 'Namuna qiymatlar qo‘yildi. Ularni o‘zgartirib, amalni sinab ko‘rishingiz mumkin.' : 'Jarayonni tez sinash uchun namuna qiymatlarni qo‘yishingiz mumkin. O‘zingiz tahrirlagan maydonlar saqlanadi.' }}</p>
        <button type="button" class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted" @click="fillDemo"><FilePenLine class="h-4 w-4" />Namuna bilan to‘ldirish</button>
      </div>
      <div v-if="kind === 'decision'" class="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">24-banddagi noaniq klinik shart avtomatik talqin qilinmaydi. Qarorni konsilium xulosasiga muvofiq qayd eting.</div>
      <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
        <template v-for="field in fields" :key="field.key">
          <h3 v-if="field.section" class="col-span-full border-b border-border pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{{ field.section }}</h3>
          <fieldset v-if="field.key === 'outcome'" class="col-span-full min-w-0"><legend class="mb-3 text-sm font-medium">{{ field.label }}</legend><div class="grid gap-2 sm:grid-cols-3"><label v-for="option in field.options" :key="option.value" :class="['flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm leading-5', decisionTone(option.value), values.outcome === option.value ? 'ring-2 ring-current' : 'opacity-80']"><input type="radio" name="consilium-outcome" :value="option.value" :checked="values.outcome === option.value" class="mt-0.5 h-4 w-4 shrink-0 accent-current" @change="readInput($event, field)" /><Check v-if="option.value === 'APPROVE'" class="h-4 w-4 shrink-0" aria-hidden="true" /><CircleX v-else-if="option.value === 'REJECT'" class="h-4 w-4 shrink-0" aria-hidden="true" /><PauseCircle v-else class="h-4 w-4 shrink-0" aria-hidden="true" /><span>{{ option.label }}</span></label></div></fieldset>
          <label v-else :class="['flex flex-col gap-1.5 text-sm', field.wide ? 'sm:col-span-2' : '']">
            <template v-if="field.type === 'checkbox'"><span class="flex items-start gap-2.5 rounded-lg border border-border p-3"><input :checked="Boolean(values[field.key])" type="checkbox" class="mt-0.5 h-4 w-4 accent-emerald-700" @change="readInput($event, field)"><span>{{ field.label }}</span></span></template>
            <template v-else>
              <span class="font-medium">{{ field.label }}<span v-if="field.required" class="ml-1 text-rose-600" aria-hidden="true">*</span></span>
              <select v-if="field.options" :value="String(values[field.key] ?? '')" :required="field.required" @change="readInput($event, field)"><option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option></select>
              <textarea v-else-if="field.type === 'textarea'" :value="String(values[field.key] ?? '')" :required="field.required" rows="3" @input="readInput($event, field)" />
              <input v-else :value="String(values[field.key] ?? '')" :type="field.type ?? 'text'" :min="field.min" :max="field.max" :required="field.required" :maxlength="field.key === 'pinfl' ? 14 : undefined" @input="readInput($event, field)">
            </template>
            <small v-if="field.hint" class="text-xs leading-5 text-muted-foreground">{{ field.hint }}</small>
          </label>
        </template>
      </div>
      <p v-if="error" role="alert" class="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/40 dark:text-rose-200">{{ error }}</p>
      <footer class="mt-6 flex flex-wrap justify-end gap-3 border-t border-border pt-5"><button type="button" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200" @click="emit('close')"><X class="h-4 w-4" />Bekor qilish</button><button type="submit" :disabled="saving" :class="['flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50', submitTone]"><LoaderCircle v-if="saving" class="h-4 w-4 animate-spin" /><CircleX v-else-if="kind === 'decision' && values.outcome === 'REJECT'" class="h-4 w-4" /><PauseCircle v-else-if="kind === 'decision' && values.outcome === 'PAUSE'" class="h-4 w-4" /><Check v-else class="h-4 w-4" />{{ submitLabel }}</button></footer>
    </form>
  </PalliativeDialog>
</template>

<style scoped>
.pc-form input:not([type=checkbox]):not([type=radio]), .pc-form select, .pc-form textarea { border: 1px solid var(--input); border-radius: 8px; padding: 10px 12px; background: var(--background); color: var(--foreground); width: 100%; min-width: 0; font: inherit; outline: none; }
.pc-form input:focus, .pc-form select:focus, .pc-form textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent); }
</style>
