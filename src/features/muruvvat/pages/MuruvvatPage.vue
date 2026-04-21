<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { CalendarDays, Check, ChevronsLeft, ChevronsRight, ChevronDown, ChevronLeft, ChevronRight, Download, Ellipsis, Eye, FilePenLine, Filter, Info, Plus, Search, Trash2, X } from 'lucide-vue-next'
import mermaid from 'mermaid'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { useRoute } from 'vue-router'
import { getMuruvvatPage } from '@/features/muruvvat/config'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'
import applicantManImage from '@/assets/applicant-man.png'
import applicantWomanImage from '@/assets/applicant-woman.png'

const props = defineProps<{
  pageKey: string
}>()

const route = useRoute()

const NOTIFICATION_DURATION = 2600
const EXPORT_MIN_LOADING_DURATION = 1000

type ApplicationStatus = 'Jarayonda' | 'Tasdiqlangan' | 'Bekor qilingan'

type ApplicationRow = {
  id: string
  date: string
  fullName: string
  pinfl: string
  serviceType: string
  region: string
  district: string
  status: ApplicationStatus
  statusClass: string
}

type ApplicantLookupResult = {
  fullName: string
  pinfl: string
  birthDate: string
  permanentAddress: string
  temporaryAddress?: string
  documentNumber: string
  diagnosisCode?: string
  diagnosisLabel?: string
  disabilityGroup?: string
}

type MedicalDocumentField = {
  id: string
  label: string
}

type ServiceOption = {
  id: string
  label: string
}

type ServiceEligibilityOption = ServiceOption & {
  eligible: boolean
  reasons: string[]
}

type FlowStepInfo = {
  id: string
  title: string
  services: string[]
  description: string
  responsible: string
  duration: string
  legalBasis: string
  outcomes: string[]
}

type IptkGuideInfo = {
  id: string
  title: string
  description: string
  stepIds: string[]
  items: string[]
}

type IptkQuestionnaireSectionInfo = {
  id: string
  title: string
  description: string
  stepIds: string[]
  fields: string[]
}

type IptkAssessmentInfo = {
  id: string
  title: string
  description: string
  stepIds: string[]
  purpose: string
  usage: string[]
}

type ViewApplicationDetail = {
  applicant: ApplicantLookupResult
  applicantInitials: string
  serviceRecipient: ApplicantLookupResult
  serviceRecipientInitials: string
  service: ServiceOption
  documents: Array<{ id: string, label: string, fileName: string }>
  phoneNumber: string
  smsCode: string
}

type PageNotification = {
  tone: 'success' | 'destructive'
  title: string
  description: string
}

type PendingConfirmation = {
  tone: 'success' | 'destructive'
  title: string
  description: string
  confirmLabel: string
  action: () => void
}

const page = computed(() => getMuruvvatPage(props.pageKey))
const isApplicationsListPage = computed(() => props.pageKey === 'applications-list')
const isIptkApplicationsListPage = computed(() => isApplicationsListPage.value && route.meta.moduleKey === 'iptk')

const applicationStatusCardMeta = [
  {
    id: 'total',
    title: 'Jami arizalar',
    tone: 'border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40',
    badge: 'bg-slate-600',
  },
  {
    id: 'in-progress',
    title: 'Jarayonda',
    tone: 'border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/20',
    badge: 'bg-amber-500',
  },
  {
    id: 'approved',
    title: 'Tasdiqlangan',
    tone: 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/20',
    badge: 'bg-emerald-600',
  },
  {
    id: 'rejected',
    title: 'Bekor qilingan',
    tone: 'border-rose-200 bg-rose-50/80 dark:border-rose-900/60 dark:bg-rose-950/20',
    badge: 'bg-rose-600',
  },
] as const

const statusStyles = {
  Jarayonda: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-300',
  Tasdiqlangan: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300',
  'Bekor qilingan': 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-rose-300',
} as const

const demoPeople = [
  "Aliyev Azizbek Anvar o'g'li",
  'Karimova Mohira Baxtiyor qizi',
  "Rasulov Doston Elyor o'g'li",
  'Tursunova Shahnoza Sherzod qizi',
  "Qodirov Jamshid Shuhrat o'g'li",
  'Saidova Nilufar Akmal qizi',
  "Yuldashev Bekzod Ilhom o'g'li",
  "Abdullayeva Madina Ulug'bek qizi",
  "Mamatov Sanjar Dilshod o'g'li",
  'Nazarova Maftuna Otabek qizi',
]

const demoRegions = [
  ['Toshkent viloyati', 'Zangiota tumani'],
  ['Samarqand viloyati', 'Samarqand shahri'],
  ['Andijon viloyati', 'Andijon shahri'],
  ["Farg'ona viloyati", "Qo'qon shahri"],
  ['Namangan viloyati', 'Chortoq tumani'],
  ['Buxoro viloyati', 'Buxoro shahri'],
  ['Qashqadaryo viloyati', 'Qarshi shahri'],
  ['Surxondaryo viloyati', 'Termiz shahri'],
  ['Navoiy viloyati', 'Navoiy shahri'],
  ['Xorazm viloyati', 'Urganch shahri'],
] as const

const demoStatuses = ['Jarayonda', 'Tasdiqlangan', 'Bekor qilingan'] as const
const demoMahallas = [
  'Navbahor MFY',
  'Mustaqillik MFY',
  'Yangi hayot MFY',
  'Do‘stlik MFY',
  'Saxovat MFY',
  'Bog‘zor MFY',
  'Istiqlol MFY',
  'Madadkor MFY',
  'Bunyodkor MFY',
  'Yoshlik MFY',
] as const
const huzurMedicalDocumentFields: MedicalDocumentField[] = [
  {
    id: 'huzur-027',
    label: 'Ambulator-poliklinika muassasasining bosh vrachi tomonidan imzolangan bemorning tibbiy kartasidan batafsil ko‘chirma (027-shakl), oilaviy shifokor va psixiatr xulosalari bilan',
  },
  {
    id: 'huzur-medical-history',
    label: 'Kasallik tarixidan ko‘chirma (ruhiy-asab kasalliklari shifoxonasida oxirgi 5 yil davomida davolanganligi to‘g‘risida)',
  },
  {
    id: 'huzur-guardian-order',
    label: 'Nogironligi bo‘lgan shaxsga vasiy tayinlash to‘g‘risidagi qaror',
  },
  {
    id: 'huzur-court-capacity',
    label: 'Shaxsni muomalaga layoqatsiz deb topish to‘g‘risidagi sud qarori',
  },
  {
    id: 'huzur-psy-expertise',
    label: 'Sud tomonidan tayinlangan sud-psixiatriya ekspertizasi xulosasi',
  },
]
const communityMedicalDocumentFields: MedicalDocumentField[] = [
  {
    id: 'community-027',
    label: 'Ambulator-poliklinika muassasasining bosh vrachi tomonidan imzolangan bemorning tibbiy kartasidan batafsil ko‘chirma (027-shakl), oilaviy shifokor va psixiatr xulosalari bilan',
  },
  {
    id: 'community-medical-history',
    label: 'Kasallik tarixidan ko‘chirma (ruhiy-asab kasalliklari shifoxonasida oxirgi 5 yil davomida davolanganligi to‘g‘risida)',
  },
]
const madadMedicalDocumentFields: MedicalDocumentField[] = [
  {
    id: 'madad-027',
    label: 'Ambulator-poliklinika muassasasining bosh vrachi tomonidan imzolangan bemorning tibbiy kartasidan batafsil ko‘chirma (027-shakl), oilaviy shifokor va psixiatr xulosalari bilan',
  },
  {
    id: 'madad-medical-history',
    label: 'Kasallik tarixidan ko‘chirma (ruhiy-asab kasalliklari shifoxonasida oxirgi 5 yil davomida davolanganligi to‘g‘risida)',
  },
  {
    id: 'madad-blood',
    label: 'Qonning umumiy tahlili',
  },
  {
    id: 'madad-urine',
    label: 'Siydik umumiy tahlili',
  },
  {
    id: 'madad-rw',
    label: 'Qonning RW (Vasserman reaksiyasi) tahlili',
  },
  {
    id: 'madad-hepatitis',
    label: '“B” va “C” gepatit markerlarini aniqlovchi qon tahlili (HBsAg, HCV)',
  },
  {
    id: 'madad-hiv-analysis',
    label: 'Qonning OIV bilan zararlanishi to‘g‘risidagi tahlil (OITSga qarshi kurash markazidan)',
  },
  {
    id: 'madad-fluorography',
    label: 'Ko‘krak qafasi a’zolarining flyuorografiyasi',
  },
  {
    id: 'madad-mental-commission',
    label: 'Respublika ixtisoslashtirilgan ruhiy salomatlik ilmiy-amaliy tibbiyot markazi hududiy filiallari Tibbiy-maslahat komissiyasi xulosasi',
  },
  {
    id: 'madad-tuberculosis',
    label: 'Silga qarshi kurashish dispanseri xulosasi',
  },
  {
    id: 'madad-oncology',
    label: 'Onkologik dispanser xulosasi',
  },
  {
    id: 'madad-skin',
    label: 'Teri-tanosil kasalliklari dispanseri xulosasi',
  },
  {
    id: 'madad-aids',
    label: 'OITSga qarshi kurash markazining xulosasi',
  },
  {
    id: 'madad-guardian-order',
    label: 'Nogironligi bo‘lgan shaxsga vasiy tayinlash to‘g‘risidagi qaror',
  },
  {
    id: 'madad-court-capacity',
    label: 'Shaxsni muomalaga layoqatsiz deb topish to‘g‘risidagi sud qarori',
  },
  {
    id: 'madad-psy-expertise',
    label: 'Sud tomonidan tayinlangan sud-psixiatriya ekspertizasi xulosasi',
  },
]
const serviceOptions: ServiceOption[] = [
  { id: 'huzur', label: 'Nogironligi bo‘lgan shaxsni “Huzur” markaziga joylashtirish' },
  { id: 'madad', label: 'Nogironligi bo‘lgan shaxsni kichik hajmli “Madad” uylari xizmatiga joylashtirish' },
  { id: 'social-holiday', label: 'Nogironligi bo‘lgan shaxsni “Ijtimoiy ta’til” qisqa muddatli joylashtirish xizmatiga yo‘naltirish' },
  { id: 'home-care', label: 'Nogironligi bo‘lgan shaxsni uy sharoitida qarab turish xizmatiga yo‘naltirish' },
  { id: 'yangi-kun', label: 'Nogironligi bo‘lgan shaxsni “Yangi kun” kunduzgi qarab turish xizmatiga yo‘naltirish' },
]
const diagnosisOptions = [
  { code: 'F71', label: 'Mo‘tadil darajadagi aqliy zaiflik' },
  { code: 'F72', label: 'Og‘ir darajadagi aqliy zaiflik' },
  { code: 'F73', label: 'Chuqur darajadagi aqliy zaiflik' },
  { code: 'F00-F03', label: 'Demensiya' },
  { code: 'F20-F29', label: 'Shizofreniya, shizotipik va alahli buzilishlar' },
  { code: 'F60-F69', label: 'Shaxsiyat va fe’l-atvor buzilishlari' },
] as const
const disabilityGroupOptions = ['I guruh', 'II guruh', 'III guruh'] as const
const serviceRequirements = {
  huzur: {
    diagnosisCodes: ['F71', 'F72', 'F73', 'F00-F03'],
    diagnosisText: 'F71, F72, F73 yoki F00-F03',
    disabilityGroups: ['I guruh', 'II guruh'],
    disabilityGroupText: 'I yoki II guruh',
  },
  madad: {
    diagnosisCodes: ['F71', 'F72', 'F73', 'F00-F03'],
    diagnosisText: 'F71, F72, F73 yoki F00-F03',
    disabilityGroups: ['I guruh', 'II guruh'],
    disabilityGroupText: 'I yoki II guruh',
  },
  'social-holiday': {
    diagnosisCodes: ['F71', 'F72', 'F73', 'F00-F03'],
    diagnosisText: 'F71, F72, F73 yoki F00-F03',
    disabilityGroups: ['I guruh', 'II guruh'],
    disabilityGroupText: 'I yoki II guruh',
  },
  'home-care': {
    diagnosisCodes: ['F73'],
    diagnosisText: 'F73',
    disabilityGroups: ['I guruh', 'II guruh'],
    disabilityGroupText: 'I yoki II guruh',
  },
  'yangi-kun': {
    diagnosisCodes: ['F71', 'F72', 'F73', 'F00-F03'],
    diagnosisText: 'F71, F72, F73 yoki F00-F03',
    disabilityGroups: ['I guruh', 'II guruh'],
    disabilityGroupText: 'I yoki II guruh',
  },
} as const
const iptkFlowSteps: FlowStepInfo[] = [
  {
    id: 'A',
    title: 'So‘rovnoma tasdiqlandi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'Arizachi sўrovnomani tasdiqlaydi va hujjatlar bir ish kuni ichida axborot moduli orqali “Inson” markaziga tushadi.',
    responsible: 'Arizachi / YAIDXP / “Inson” markazi / DXM / ijtimoiy xodim',
    duration: '1 ish kuni ichida “Inson” markaziga tushadi',
    legalBasis: '16-, 19-, 21-bandlar',
    outcomes: ['Ariza va ilovalar axborot moduliga kelib tushadi', 'Tanlangan xizmat turi bo‘yicha keyingi tekshiruv boshlanadi'],
  },
  {
    id: 'C',
    title: '“Inson” markazi tekshiruvi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: '“Inson” markazi bir ish kuni ichida hujjatlarni o‘rganadi va rad etish asoslari bor-yo‘qligini aniqlaydi.',
    responsible: '“Inson” markazi',
    duration: '1 ish kuni',
    legalBasis: '22-band 1-a, 2-a, 3-a; 23-band',
    outcomes: ['Rad etish asoslari aniqlansa ariza rad etiladi', 'Rad etish asosi bo‘lmasa xizmat turiga qarab keyingi bosqichga o‘tadi'],
  },
  {
    id: 'F',
    title: 'Baholash va xulosa kiritish',
    services: ['Huzur', 'Madad'],
    description: 'Ishchi guruh besh ish kuni ichida parvarishga muhtojlik darajasi va yashash sharoitini baholaydi hamda natijani axborot moduliga kiritadi.',
    responsible: '“Inson” markazi ishchi guruhi, oilaviy shifokor, FYO‘B organi raisi',
    duration: '5 ish kuni',
    legalBasis: '22-band 1-b va 2-b',
    outcomes: ['Baholash natijasi axborot moduliga kiritiladi', 'Huzur yoki Madad bo‘yicha keyingi qaror shakllanadi'],
  },
  {
    id: 'H',
    title: 'Tezkor yoki rejali guruh',
    services: ['Huzur'],
    description: 'Huzur xizmati bo‘yicha baholashdan so‘ng shaxs tezkor yoki rejali guruhga ajratiladi.',
    responsible: '“Inson” markazi',
    duration: 'Baholash yakunlangandan so‘ng darhol',
    legalBasis: '22-band 1-v, 1-d',
    outcomes: ['Tezkor guruh bo‘lsa qo‘shimcha hujjatlar talab qilinadi', 'Rejali guruh bo‘lsa to‘g‘ridan IPTKga yuboriladi'],
  },
  {
    id: 'I',
    title: 'Qo‘shimcha hujjatlar yig‘ish',
    services: ['Huzur (faqat tezkor guruh)'],
    description: 'Tezkor guruhga tushgan shaxslar uchun 3-ilovadagi qo‘shimcha hujjatlar besh ish kuni ichida arizachidan olinadi.',
    responsible: 'Arizachi / “Inson” markazi',
    duration: '5 ish kuni',
    legalBasis: '22-band 1-v',
    outcomes: ['Qo‘shimcha hujjatlar to‘planadi', 'Hujjatlar to‘liq bo‘lsa IPTKga yuboriladi'],
  },
  {
    id: 'J',
    title: 'IPTKga yuborildi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'Ma’lumot va hujjatlar bir ish kuni ichida axborot moduli orqali IPTKga yuboriladi, arizachiga SMS va YAIDXP orqali xabar beriladi.',
    responsible: '“Inson” markazi',
    duration: '1 ish kuni',
    legalBasis: '22-band 1-g, 2-v, 3-b',
    outcomes: ['IPTK kotibi ko‘rib chiqishi uchun ish shakllanadi', 'Arizachi yuborilganligi haqida xabardor qilinadi'],
  },
  {
    id: 'L',
    title: 'IPTK kotibi tekshiruvi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'IPTK kotibi besh ish kuni ichida hujjatlarning to‘liqligi va to‘g‘ri rasmiylashtirilganligini tekshiradi.',
    responsible: 'IPTK kotibi',
    duration: '5 ish kuni',
    legalBasis: '25-band',
    outcomes: ['Kamchilik bo‘lmasa yig‘ilishga kiritiladi', 'Kamchilik bo‘lsa “Inson” markaziga qaytariladi'],
  },
  {
    id: 'N',
    title: 'Yig‘ilish va xabarnoma',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'Hujjatlar qabul qilingach ariza IPTK yig‘ilishiga kiritiladi, a’zolar va arizachi kamida uch kun oldin xabardor qilinadi.',
    responsible: 'IPTK kotibi',
    duration: 'Yig‘ilishdan kamida 3 kun oldin xabarnoma',
    legalBasis: '26-, 27-bandlar',
    outcomes: ['Ariza navbatdagi yig‘ilishga kiritiladi', 'A’zolar va arizachi xabardor qilinadi'],
  },
  {
    id: 'Q',
    title: 'IPTK tekshiruvi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'IPTK nogironligi bo‘lgan shaxsni ko‘rikdan o‘tkazadi, WHODAS va PPS kabi mezonlarni qo‘llaydi va bayonnoma rasmiylashtiradi.',
    responsible: 'IPTK a’zolari',
    duration: 'Yig‘ilish kuni',
    legalBasis: '28–34-bandlar',
    outcomes: ['Kompleks ijtimoiy-psixiatrik-tibbiy tekshiruv o‘tkaziladi', 'Bayonnoma va xulosa uchun asos yaratiladi'],
  },
  {
    id: 'S',
    title: 'IPTK xulosasi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'IPTK tanlangan xizmatga yo‘naltirish, boshqa xizmatni tavsiya qilish yoki rad etish haqida xulosa qabul qiladi.',
    responsible: 'IPTK',
    duration: 'Bayonnoma imzolangach 3 ish kuni ichida rasmiylashtiriladi',
    legalBasis: '34-, 35-, 37-bandlar',
    outcomes: ['Tanlangan xizmatga yo‘naltirish', 'Boshqa xizmatni tavsiya qilish', 'Rad etish'],
  },
  {
    id: 'T',
    title: 'Inson markaziga yuborildi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'Rasmiylashtirilgan IPTK xulosasi bir ish kuni ichida yashash manzilidagi “Inson” markaziga yuboriladi va arizachi SMS orqali xabardor qilinadi.',
    responsible: 'IPTK / axborot moduli',
    duration: '1 ish kuni',
    legalBasis: '38-band',
    outcomes: ['Xulosa yashash manzilidagi “Inson” markaziga yuboriladi', 'Arizachi yakuniy xabarnoma oladi'],
  },
  {
    id: 'R',
    title: 'Bekor qilindi yoki qaytarildi',
    services: ['Huzur', 'Madad', 'Ijtimoiy ta’til', 'Uy sharoitida qarab turish', 'Yangi kun'],
    description: 'Ariza xizmat turiga mos kelmasa rad etiladi; hujjatlarda kamchilik bo‘lsa yoki ko‘rikka olib kelinmasa ish “Inson” markaziga qaytariladi.',
    responsible: '“Inson” markazi / IPTK / IPTK kotibi',
    duration: 'Bosqichga qarab',
    legalBasis: '23-, 24-, 25-, 27-bandlar',
    outcomes: ['Rad etish bo‘yicha SMS xabarnoma yuboriladi', 'Yoki hujjatlar kamchiliklari bilan “Inson” markaziga qaytariladi'],
  },
]
const iptkValidationGuides: IptkGuideInfo[] = [
  {
    id: 'person-validation',
    title: 'Shaxs ma’lumotlarini tekshirish',
    description: 'Ariza topshirilishidan oldin arizachi va xizmat oluvchining identifikatsiya ma’lumotlari to‘g‘ri kiritilgan bo‘lishi kerak.',
    stepIds: ['A', 'C', 'R'],
    items: [
      'JSHSHIR faqat 14 ta raqamdan iborat bo‘lishi kerak.',
      'Arizachi va xizmat oluvchi alohida qidiruv orqali aniqlanadi.',
      'Xizmat oluvchi 18 yoshdan kichik shaxsga moslab tekshiriladi.',
      'Manzil farq qilsa viloyat, tuman, MFY va to‘liq manzil majburiy to‘ldiriladi.',
    ],
  },
  {
    id: 'service-validation',
    title: 'Xizmatga moslik validatsiyasi',
    description: 'Xizmat tanlashda 4-ilovadagi tashxis va nogironlik guruhi mezonlari avtomatik tekshiriladi.',
    stepIds: ['C', 'F', 'H', 'R'],
    items: [
      'Aniqlangan tashxis va nogironlik guruhi asosida faqat mos xizmatlar faollashadi.',
      'Mos bo‘lmagan xizmatlar bloklanadi va sababi ko‘rsatiladi.',
      'Uy sharoitida qarab turish xizmati faqat F73 tashxisi uchun ochiladi.',
      'Mos bo‘lmagan tashxis yoki guruh holatida rad etish asosi shakllanadi.',
    ],
  },
  {
    id: 'document-validation',
    title: 'Hujjatlar to‘liqligi',
    description: 'Tanlangan xizmat turiga qarab 3-ilovadagi hujjatlar ro‘yxati tekshiriladi.',
    stepIds: ['A', 'I', 'J', 'L', 'R'],
    items: [
      'Har bir xizmat turi uchun alohida tibbiy hujjatlar ro‘yxati shakllanadi.',
      'Majburiy hujjatlar yuklanmaguncha arizani saqlash mumkin emas.',
      'Tezkor guruh uchun qo‘shimcha hujjatlar alohida so‘raladi.',
      'IPTK kotibi kamchilik topsa ish “Inson” markaziga qaytariladi.',
    ],
  },
  {
    id: 'confirmation-validation',
    title: 'Tasdiqlash va rozilik',
    description: 'So‘rovnoma yakunida arizachi SMS-kod orqali tasdiqlaydi va rozilik beradi.',
    stepIds: ['A', 'J', 'N', 'T'],
    items: [
      'Telefon raqamida +998 prefiksi doimiy ko‘rsatiladi, foydalanuvchi 9 ta raqam kiritadi.',
      'SMS-kod 6 xonali bo‘lishi kerak.',
      'SMS-kod yuborilgach qayta yuborish taymeri ishga tushadi.',
      'Barcha majburiy maydonlar to‘ldirilmaguncha arizani saqlash tugmasi ochilmaydi.',
    ],
  },
]
const iptkQuestionnaireSections: IptkQuestionnaireSectionInfo[] = [
  {
    id: 'applicant-section',
    title: 'Arizachi bo‘limi',
    description: 'Arizachi nomidan murojaat kiritiladi va uning identifikatsiya hamda manzil ma’lumotlari tekshiriladi.',
    stepIds: ['A', 'C'],
    fields: [
      'JSHSHIR va qidiruv tugmasi',
      'FIO, tug‘ilgan sana, JSHSHIR, vaqtinchalik manzil, manzil',
      'Amaldagi yashash manzili farq qilsa qo‘shimcha manzil formasi',
    ],
  },
  {
    id: 'recipient-section',
    title: 'Xizmat oluvchi bo‘limi',
    description: 'Xizmat oluvchi topilgach uning tashxisi, nogironlik guruhi va rasm ma’lumoti asosiy tekshiruv uchun ishlatiladi.',
    stepIds: ['A', 'C', 'F', 'R'],
    fields: [
      'JSHSHIR va qidiruv tugmasi',
      'FIO, tug‘ilgan sana, tashxis, nogironlik guruhi, manzil',
      'Rasm yuklash va preview',
      'Xizmatga moslik paneli',
    ],
  },
  {
    id: 'service-section',
    title: 'Xizmat turini tanlash',
    description: 'Tashxis va nogironlik guruhiga mos xizmatlar orasidan bitta xizmat turi tanlanadi.',
    stepIds: ['C', 'F', 'H', 'J'],
    fields: [
      'Custom dropdown ko‘rinishidagi xizmat tanlash maydoni',
      'Har bir xizmat uchun moslik holati va izoh',
      'Tanlangan xizmatga qarab hujjatlar ro‘yxati avtomatik almashadi',
    ],
  },
  {
    id: 'documents-section',
    title: 'Tibbiy hujjatlar bo‘limi',
    description: 'Xizmat turidan kelib chiqib 3-ilovadagi hujjatlar yuklanadi.',
    stepIds: ['A', 'I', 'J', 'L'],
    fields: [
      '027-shakl va kasallik tarixidan ko‘chirma',
      'Xizmat turiga mos qo‘shimcha laborator va dispanser xulosalari',
      'Har bir hujjat uchun alohida fayl yuklash maydoni',
    ],
  },
  {
    id: 'confirmation-section',
    title: 'Tasdiqlash bo‘limi',
    description: 'So‘rovnoma SMS-kod bilan tasdiqlanadi va rozilik qayd etiladi.',
    stepIds: ['A', 'J', 'N', 'T'],
    fields: [
      'Telefon raqami maydoni',
      'SMS-kod yuborish va qayta yuborish taymeri',
      '6 xonali SMS-kod kiritish',
      'Arizani saqlash va tozalash tugmalari',
    ],
  },
]
const iptkAssessmentGuides: IptkAssessmentInfo[] = [
  {
    id: 'barthel-lawton',
    title: 'Barthel va Lawton shkalalari',
    description: 'Parvarishga muhtojlik darajasi va kundalik mustaqillikni baholash uchun ishlatiladi. Ayniqsa Huzur va Madad xizmatlari bo‘yicha muhim o‘rin tutadi.',
    stepIds: ['F', 'H'],
    purpose: 'Shaxsning o‘ziga-o‘zi xizmat ko‘rsatish, kundalik faoliyatlarni bajara olish va parvarishga ehtiyoj darajasini aniqlash.',
    usage: [
      'Huzur va Madad bo‘yicha ishchi guruh baholashida qo‘llanadi.',
      'Huzur xizmati uchun tezkor yoki rejali guruhga ajratishda asosiy mezonlardan biri hisoblanadi.',
      'Madad bo‘yicha 62 ballgacha bo‘lgan parvarishga muhtojlik darajasini tasdiqlashda ishlatiladi.',
    ],
  },
  {
    id: 'whodas',
    title: 'WHODAS savolnomasi',
    description: 'Jahon sog‘liqni saqlash tashkiloti savolnomasi bo‘lib, nogironligi bo‘lgan shaxsning kundalik funksional cheklovlari va ijtimoiy ishtirok darajasini baholashga xizmat qiladi.',
    stepIds: ['Q', 'S'],
    purpose: 'Kundalik hayotdagi qiyinchiliklar, muloqot, harakatlanish, o‘ziga qarash va ijtimoiy faollikni kompleks baholash.',
    usage: [
      'IPTK yig‘ilishida shaxsni ko‘rikdan o‘tkazishda qo‘llanadi.',
      'Tibbiy kartadagi ma’lumotlar bilan birga komissiya xulosasini asoslashga yordam beradi.',
      'Tanlangan xizmat turi mosligini aniqlashda qo‘shimcha funksional ko‘rsatkich beradi.',
    ],
  },
  {
    id: 'pps',
    title: 'PPS shkalasi',
    description: 'Palliative Performance Scale shaxsning umumiy funksional holati, harakatlanishi va o‘zini parvarish qila olish darajasini ko‘rsatadi.',
    stepIds: ['Q', 'S'],
    purpose: 'Jismoniy holat, yotoqda yotish darajasi, ovqatlanish va umumiy funksional imkoniyatlarni baholash.',
    usage: [
      'IPTK yig‘ilishida WHODAS bilan birga qo‘llanadi.',
      'Shaxsning holatiga mos ijtimoiy xizmatni tavsiya qilishda yordam beradi.',
      'Xulosa va bayonnomani asoslash uchun komissiya a’zolari tomonidan ko‘rib chiqiladi.',
    ],
  },
]

const iptkFlowMermaidDefinition = `
flowchart TD
    A["So'rovnoma tasdiqlandi"] --> B["Inson markaziga tushdi"]
    B --> C["Inson markazi tekshiruvi"]
    C --> D{"Rad etish asosi bormi?"}

    D -->|Ha| R["Bekor qilindi"]
    D -->|Yo'q| E{"Xizmat turi"}

    E -->|"Huzur"| F["Baholash va xulosa kiritish"]
    E -->|"Madad"| F
    E -->|"Ijtimoiy ta'til"| J["IPTKga yuborildi"]
    E -->|"Uy sharoitida qarab turish"| J
    E -->|"Yangi kun"| J

    F --> G{"Huzur bo'yichami?"}
    G -->|Yo'q| J
    G -->|Ha| H{"Tezkor guruhmi?"}
    H -->|Yo'q| J
    H -->|Ha| I["Qo'shimcha hujjatlar<br/>yig'iladi"]
    I --> K{"Hujjatlar to'liqmi?"}
    K -->|Yo'q| I
    K -->|Ha| J

    J --> L["IPTK kotibi tekshiruvi"]
    L --> M{"Kamchilik bormi?"}
    M -->|Ha| U["Inson markaziga<br/>qaytarildi"]
    M -->|Yo'q| N["Yig'ilishga kiritildi"]
    N --> O["SMS / xabarnoma yuborildi"]
    O --> P{"Ko'rikka olib kelindimi?"}
    P -->|Yo'q| V["Inson markaziga<br/>qaytarildi"]
    P -->|Ha| Q["IPTK tekshiruvi o'tkazildi"]
    Q --> S{"IPTK xulosasi"}
    S -->|"Tanlangan xizmat"| T["Inson markaziga yuborildi"]
    S -->|"Boshqa xizmat tavsiya qilindi"| T
    S -->|"Bekor qilish"| W["Bekor qilindi"]
    T --> X["Arizachi xabardor qilindi"]

    classDef neutral fill:#f8fafc,stroke:#cbd5e1,color:#0f172a,stroke-width:1.5px;
    classDef decision fill:#ffffff,stroke:#94a3b8,color:#0f172a,stroke-width:1.5px;
    classDef danger fill:#fff1f2,stroke:#fda4af,color:#be123c,stroke-width:1.5px;
    classDef info fill:#eff6ff,stroke:#93c5fd,color:#1d4ed8,stroke-width:1.5px;
    classDef warning fill:#fff7ed,stroke:#fdba74,color:#9a3412,stroke-width:1.5px;
    classDef success fill:#ecfdf5,stroke:#86efac,color:#166534,stroke-width:1.5px;
    classDef return fill:#fefce8,stroke:#facc15,color:#854d0e,stroke-width:1.5px;

    class A,B,C,N,O neutral;
    class D,E,G,H,K,M,P,S decision;
    class R,W danger;
    class F,J,L,Q info;
    class I warning;
    class T,X success;
    class U,V return;

    click A handleIptkFlowNodeClick
    click C handleIptkFlowNodeClick
    click F handleIptkFlowNodeClick
    click H handleIptkFlowNodeClick
    click I handleIptkFlowNodeClick
    click J handleIptkFlowNodeClick
    click L handleIptkFlowNodeClick
    click N handleIptkFlowNodeClick
    click Q handleIptkFlowNodeClick
    click S handleIptkFlowNodeClick
    click T handleIptkFlowNodeClick
    click R handleIptkFlowNodeClick
    click U handleIptkFlowNodeClick
    click V handleIptkFlowNodeClick
    click W handleIptkFlowNodeClick
`

let mermaidInitialized = false
let mermaidRenderId = 0

const monthNames = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr',
] as const

const applicationRows = ref(Array.from({ length: 100 }, (_, index) => {
  const person = demoPeople[index % demoPeople.length] ?? demoPeople[0]
  const regionEntry = demoRegions[index % demoRegions.length] ?? demoRegions[0]
  const [region, district] = regionEntry
  const status = demoStatuses[index % demoStatuses.length] ?? demoStatuses[0]
  const service = serviceOptions[index % serviceOptions.length] ?? serviceOptions[0]
  const day = String((index % 28) + 1).padStart(2, '0')
  const month = String((index % 12) + 1).padStart(2, '0')
  const year = 2024 + Math.floor(index / 50)
  const pinflSeed = String(10000000000000 + index * 137).padStart(14, '0')

  return {
    id: `ARZ-${String(index + 1).padStart(6, '0')}`,
    date: `${day}.${month}.${year}`,
    fullName: person,
    pinfl: pinflSeed,
    serviceType: service?.label ?? 'Xizmat turi belgilanmagan',
    region,
    district,
    status,
    statusClass: statusStyles[status],
  }
}) as ApplicationRow[])

const rowsPerPageOptions = [20, 50, 100, 200, 500]
const selectedRowsPerPage = ref(20)
const currentPage = ref(1)
const searchInput = ref('')
const searchQuery = ref('')
const isFiltersOpen = ref(false)
const appliedStatusFilter = ref<'all' | ApplicationStatus>('all')
const appliedRegionFilter = ref('all')
const appliedDistrictFilter = ref('all')
const appliedStartDateFilter = ref('')
const appliedEndDateFilter = ref('')
const draftStatusFilter = ref<'all' | ApplicationStatus>('all')
const draftRegionFilter = ref('all')
const draftDistrictFilter = ref('all')
const draftStartDateFilter = ref('')
const draftEndDateFilter = ref('')
const openFilterField = ref<'status' | 'region' | 'district' | null>(null)
const openCalendarField = ref<'start' | 'end' | null>(null)
const calendarMonth = ref('')
const isRowsPerPageOpen = ref(false)
const openActionMenuId = ref<string | null>(null)
const isTableLoading = ref(true)
const isExporting = ref(false)
const pageNotification = ref<PageNotification | null>(null)
const pendingConfirmation = ref<PendingConfirmation | null>(null)
const selectedViewRow = ref<ApplicationRow | null>(null)
const isIptkFlowDialogOpen = ref(false)
const iptkFlowMermaidSvg = ref('')
const selectedIptkFlowStepId = ref('A')
const iptkFlowDiagramRef = ref<HTMLElement | null>(null)
const iptkFlowCommentBadges = ref<Array<{ stepId: string; left: number; top: number }>>([])
const notificationProgress = ref(100)
const notificationRemaining = ref(NOTIFICATION_DURATION)
const filterAnchorRef = ref<HTMLElement | null>(null)
const paginationRef = ref<HTMLElement | null>(null)
const desktopFilterMaxHeight = ref<number | null>(null)
const isCreateDialogOpen = ref(false)
const applicantPinflInput = ref('')
const applicantLookupResult = ref<ApplicantLookupResult | null>(null)
const applicantLookupError = ref('')
const isApplicantLookupLoading = ref(false)
const hasApplicantCustomResidenceAddress = ref(false)
const applicantCustomResidenceRegion = ref('')
const applicantCustomResidenceDistrict = ref('')
const applicantCustomResidenceMfy = ref('')
const applicantCustomResidenceAddress = ref('')
const serviceRecipientPinflInput = ref('')
const serviceRecipientLookupResult = ref<ApplicantLookupResult | null>(null)
const serviceRecipientLookupError = ref('')
const isServiceRecipientLookupLoading = ref(false)
const serviceRecipientPhotoPreview = ref('')
const serviceRecipientPhotoName = ref('')
const hasServiceRecipientCustomResidenceAddress = ref(false)
const serviceRecipientCustomResidenceRegion = ref('')
const serviceRecipientCustomResidenceDistrict = ref('')
const serviceRecipientCustomResidenceMfy = ref('')
const serviceRecipientCustomResidenceAddress = ref('')
const uploadedMedicalDocuments = ref<Record<string, string>>({})
const selectedServiceOptionId = ref('')
const smsPhoneNumber = ref('')
const smsCodeInput = ref('')
const isSmsCodeSent = ref(false)
const smsResendCountdown = ref(0)
const isSavingApplication = ref(false)
const openCreateAddressField = ref<'applicant-region' | 'applicant-district' | 'applicant-mfy' | 'recipient-region' | 'recipient-district' | 'recipient-mfy' | 'service-option' | null>(null)
let loadingTimer: ReturnType<typeof setTimeout> | null = null
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let notificationTimer: ReturnType<typeof setTimeout> | null = null
let smsResendTimer: ReturnType<typeof setInterval> | null = null
let notificationAnimationFrame: number | null = null
let notificationCountdownStart = NOTIFICATION_DURATION
let notificationStartedAt = 0
let iptkFlowBadgeMeasureFrame: number | null = null

const selectedIptkFlowStep = computed(() => {
  return iptkFlowSteps.find((step) => step.id === selectedIptkFlowStepId.value) ?? iptkFlowSteps[0]
})
const selectedIptkStepGuides = computed(() => {
  return iptkValidationGuides.filter((guide) => guide.stepIds.includes(selectedIptkFlowStepId.value))
})
const selectedIptkQuestionnaireGuides = computed(() => {
  return iptkQuestionnaireSections.filter((section) => section.stepIds.includes(selectedIptkFlowStepId.value))
})
const selectedIptkAssessmentGuides = computed(() => {
  return iptkAssessmentGuides.filter((assessment) => assessment.stepIds.includes(selectedIptkFlowStepId.value))
})

const filteredRows = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return applicationRows.value.filter((row) => {
    const matchesQuery = !query || [
      row.id,
      row.date,
      row.fullName,
      row.pinfl,
      row.serviceType,
      row.region,
      row.district,
      row.status,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)

    const matchesStatus = appliedStatusFilter.value === 'all' || row.status === appliedStatusFilter.value
    const matchesRegion = appliedRegionFilter.value === 'all' || row.region === appliedRegionFilter.value
    const matchesDistrict = appliedDistrictFilter.value === 'all' || row.district === appliedDistrictFilter.value
    const rowDate = parseApplicationDate(row.date)
    const matchesStartDate = !appliedStartDateFilter.value || (rowDate !== null && rowDate >= appliedStartDateFilter.value)
    const matchesEndDate = !appliedEndDateFilter.value || (rowDate !== null && rowDate <= appliedEndDateFilter.value)

    return matchesQuery && matchesStatus && matchesRegion && matchesDistrict && matchesStartDate && matchesEndDate
  })
})

const regionOptions = computed(() => {
  return Array.from(new Set(applicationRows.value.map((row) => row.region))).sort((left, right) => left.localeCompare(right))
})

const districtOptions = computed(() => {
  const rows = draftRegionFilter.value === 'all'
    ? applicationRows.value
    : applicationRows.value.filter((row) => row.region === draftRegionFilter.value)

  return Array.from(new Set(rows.map((row) => row.district))).sort((left, right) => left.localeCompare(right))
})

const hasActiveFilters = computed(() => {
  return appliedStatusFilter.value !== 'all'
    || appliedRegionFilter.value !== 'all'
    || appliedDistrictFilter.value !== 'all'
    || Boolean(appliedStartDateFilter.value)
    || Boolean(appliedEndDateFilter.value)
})

const activeFilterCount = computed(() => {
  return [
    appliedStatusFilter.value !== 'all',
    appliedRegionFilter.value !== 'all',
    appliedDistrictFilter.value !== 'all',
    Boolean(appliedStartDateFilter.value),
    Boolean(appliedEndDateFilter.value),
  ].filter(Boolean).length
})
const applicantCustomResidenceRegionOptions = computed(() => {
  return Array.from(new Set(demoRegions.map(([region]) => region))).sort((left, right) => left.localeCompare(right))
})
const applicantCustomResidenceDistrictOptions = computed(() => {
  if (!applicantCustomResidenceRegion.value) {
    return []
  }

  return demoRegions
    .filter(([region]) => region === applicantCustomResidenceRegion.value)
    .map(([, district]) => district)
})
const serviceRecipientCustomResidenceRegionOptions = computed(() => {
  return Array.from(new Set(demoRegions.map(([region]) => region))).sort((left, right) => left.localeCompare(right))
})
const serviceRecipientCustomResidenceDistrictOptions = computed(() => {
  if (!serviceRecipientCustomResidenceRegion.value) {
    return []
  }

  return demoRegions
    .filter(([region]) => region === serviceRecipientCustomResidenceRegion.value)
    .map(([, district]) => district)
})
const applicantCustomResidenceRegionLabel = computed(() => applicantCustomResidenceRegion.value || 'Viloyatni tanlang')
const applicantCustomResidenceDistrictLabel = computed(() => {
  if (!applicantCustomResidenceRegion.value) {
    return 'Tuman yoki shaharni tanlang'
  }

  return applicantCustomResidenceDistrict.value || 'Tuman yoki shaharni tanlang'
})
const applicantCustomResidenceMfyLabel = computed(() => {
  if (!applicantCustomResidenceDistrict.value) {
    return 'Avval tumanni tanlang'
  }

  return applicantCustomResidenceMfy.value || 'MFYni tanlang'
})
const serviceRecipientCustomResidenceRegionLabel = computed(() => serviceRecipientCustomResidenceRegion.value || 'Viloyatni tanlang')
const serviceRecipientCustomResidenceDistrictLabel = computed(() => {
  if (!serviceRecipientCustomResidenceRegion.value) {
    return 'Tuman yoki shaharni tanlang'
  }

  return serviceRecipientCustomResidenceDistrict.value || 'Tuman yoki shaharni tanlang'
})
const serviceRecipientCustomResidenceMfyLabel = computed(() => {
  if (!serviceRecipientCustomResidenceDistrict.value) {
    return 'Avval tumanni tanlang'
  }

  return serviceRecipientCustomResidenceMfy.value || 'MFYni tanlang'
})
const selectedServiceOption = computed(() => {
  return serviceOptions.find((service) => service.id === selectedServiceOptionId.value) ?? null
})
const selectedServiceOptionLabel = computed(() => {
  return selectedServiceOption.value?.label ?? 'Xizmat turini tanlang'
})
const serviceEligibilityOptions = computed(() => {
  return serviceOptions.map((service) => buildServiceEligibility(service, serviceRecipientLookupResult.value))
})
const eligibleServiceCount = computed(() => serviceEligibilityOptions.value.filter((service) => service.eligible).length)
const selectedServiceEligibility = computed(() => {
  return serviceEligibilityOptions.value.find((service) => service.id === selectedServiceOptionId.value) ?? null
})

function getMedicalDocumentsForService(serviceId: string) {
  switch (serviceId) {
    case 'huzur':
      return huzurMedicalDocumentFields
    case 'madad':
      return madadMedicalDocumentFields
    case 'social-holiday':
    case 'home-care':
    case 'yangi-kun':
      return communityMedicalDocumentFields
    default:
      return []
  }
}

const activeMedicalDocumentFields = computed(() => {
  return getMedicalDocumentsForService(selectedServiceOptionId.value)
})
const applicantLookupRows = computed(() => {
  if (!applicantLookupResult.value) {
    return []
  }

  return [
    ['FIO', applicantLookupResult.value.fullName],
    ["Tug'ilgan sanasi", applicantLookupResult.value.birthDate],
    ...(applicantLookupResult.value.temporaryAddress
      ? [["Vaqtinchalik manzili", applicantLookupResult.value.temporaryAddress] as const]
      : []),
    ['JSHSHIR', applicantLookupResult.value.pinfl],
    ['Manzil', applicantLookupResult.value.permanentAddress],
  ] as const
})
const serviceRecipientLookupRows = computed(() => {
  if (!serviceRecipientLookupResult.value) {
    return []
  }

  return [
    ['FIO', serviceRecipientLookupResult.value.fullName],
    ["Tug'ilgan sanasi", serviceRecipientLookupResult.value.birthDate],
    ['Tashxis', `${serviceRecipientLookupResult.value.diagnosisLabel} (${serviceRecipientLookupResult.value.diagnosisCode})`],
    ['Nogironlik guruhi', serviceRecipientLookupResult.value.disabilityGroup ?? '—'],
    ...(serviceRecipientLookupResult.value.temporaryAddress
      ? [["Vaqtinchalik manzili", serviceRecipientLookupResult.value.temporaryAddress] as const]
      : []),
    ['JSHSHIR', serviceRecipientLookupResult.value.pinfl],
    ['Manzil', serviceRecipientLookupResult.value.permanentAddress],
  ] as const
})
const serviceRecipientInitials = computed(() => {
  if (!serviceRecipientLookupResult.value) {
    return ''
  }

  return serviceRecipientLookupResult.value.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
})

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getApplicantImageByFullName(fullName: string) {
  const normalizedFullName = fullName.toLowerCase()

  if (normalizedFullName.includes(' qizi')) {
    return applicantWomanImage
  }

  return applicantManImage
}

const applicantImage = computed(() => {
  if (!applicantLookupResult.value) {
    return ''
  }

  return getApplicantImageByFullName(applicantLookupResult.value.fullName)
})
const selectedViewApplicantImage = computed(() => {
  if (!selectedViewDetail.value) {
    return ''
  }

  return getApplicantImageByFullName(selectedViewDetail.value.applicant.fullName)
})

function buildBirthDate(indexSeed: number, isMinor = false) {
  const birthDay = String((indexSeed % 28) + 1).padStart(2, '0')
  const birthMonth = String((indexSeed % 12) + 1).padStart(2, '0')
  const currentYear = new Date().getFullYear()
  const birthYear = isMinor
    ? String(currentYear - ((indexSeed % 17) + 1))
    : String(1970 + (indexSeed % 30))

  return `${birthDay}.${birthMonth}.${birthYear}`
}

function getDiagnosisBySeed(indexSeed: number, isMinor = false) {
  if (isMinor) {
    return diagnosisOptions[indexSeed % diagnosisOptions.length] ?? diagnosisOptions[0]
  }

  return diagnosisOptions[indexSeed % 4] ?? diagnosisOptions[0]
}

function getDisabilityGroupBySeed(indexSeed: number, isMinor = false) {
  if (!isMinor) {
    return disabilityGroupOptions[indexSeed % 2] ?? disabilityGroupOptions[0]
  }

  if (indexSeed % 5 === 0) {
    return disabilityGroupOptions[2] ?? disabilityGroupOptions[0]
  }

  return disabilityGroupOptions[indexSeed % 2] ?? disabilityGroupOptions[0]
}

function buildServiceEligibility(service: ServiceOption, person: ApplicantLookupResult | null): ServiceEligibilityOption {
  if (!person) {
    return {
      ...service,
      eligible: false,
      reasons: ['Avval xizmat oluvchining ma’lumotlarini aniqlang.'],
    }
  }

  const requirement = serviceRequirements[service.id as keyof typeof serviceRequirements]
  const allowedDiagnosisCodes: string[] = [...requirement.diagnosisCodes]
  const allowedDisabilityGroups: string[] = [...requirement.disabilityGroups]
  const reasons: string[] = []

  if (person.diagnosisCode && !allowedDiagnosisCodes.includes(person.diagnosisCode)) {
    reasons.push(`Aniqlangan tashxis: ${person.diagnosisLabel} (${person.diagnosisCode}). Talab etilgan tashxis: ${requirement.diagnosisText}.`)
  }

  if (person.disabilityGroup && !allowedDisabilityGroups.includes(person.disabilityGroup)) {
    reasons.push(`Aniqlangan nogironlik guruhi: ${person.disabilityGroup}. Talab etilgan nogironlik guruhi: ${requirement.disabilityGroupText}.`)
  }

  return {
    ...service,
    eligible: reasons.length === 0,
    reasons,
  }
}

function buildLookupResultFromRow(row: ApplicationRow, indexOffset = 0, isMinor = false) {
  const rowIndex = applicationRows.value.findIndex((entry) => entry.id === row.id)
  const safeIndex = rowIndex >= 0 ? rowIndex + indexOffset : indexOffset
  const fallbackRegionEntry = demoRegions[safeIndex % demoRegions.length] ?? demoRegions[0]
  const [fallbackRegion, fallbackDistrict] = fallbackRegionEntry
  const mfy = demoMahallas[safeIndex % demoMahallas.length] ?? demoMahallas[0]
  const diagnosis = getDiagnosisBySeed(safeIndex, isMinor)
  const disabilityGroup = getDisabilityGroupBySeed(safeIndex, isMinor)

  return {
    fullName: demoPeople[safeIndex % demoPeople.length] ?? row.fullName,
    pinfl: String(Number(row.pinfl) + indexOffset).padStart(14, '0').slice(0, 14),
    birthDate: buildBirthDate(safeIndex, isMinor),
    permanentAddress: `${row.region || fallbackRegion}, ${row.district || fallbackDistrict}, ${mfy}, ${String((safeIndex % 47) + 1)}-uy`,
    temporaryAddress: safeIndex % 2 === 0
      ? `${row.region || fallbackRegion}, ${row.district || fallbackDistrict}, ${mfy}, ${String((safeIndex % 17) + 10)}-uy, ${String((safeIndex % 12) + 1)}-xonadon`
      : undefined,
    documentNumber: '',
    diagnosisCode: diagnosis.code,
    diagnosisLabel: diagnosis.label,
    disabilityGroup,
  } satisfies ApplicantLookupResult
}

const selectedViewDetail = computed<ViewApplicationDetail | null>(() => {
  if (!selectedViewRow.value) {
    return null
  }

  const row = selectedViewRow.value
  const rowIndex = Math.max(0, applicationRows.value.findIndex((entry) => entry.id === row.id))
  const defaultService = serviceOptions[0]

  if (!defaultService) {
    return null
  }

  const service = serviceOptions[rowIndex % serviceOptions.length] ?? defaultService
  const serviceRecipient = {
    ...buildLookupResultFromRow(row, 0, true),
    fullName: row.fullName,
    pinfl: row.pinfl,
    permanentAddress: `${row.region}, ${row.district}, ${demoMahallas[rowIndex % demoMahallas.length] ?? demoMahallas[0]}, ${String((rowIndex % 47) + 1)}-uy`,
  }
  const applicant = buildLookupResultFromRow(row, 3)
  const documents = getMedicalDocumentsForService(service.id).map((document, index) => ({
    id: document.id,
    label: document.label,
    fileName: `hujjat-${String(index + 1).padStart(2, '0')}.pdf`,
  }))

  return {
    applicant,
    applicantInitials: getInitials(applicant.fullName),
    serviceRecipient,
    serviceRecipientInitials: getInitials(serviceRecipient.fullName),
    service,
    documents,
    phoneNumber: '90 123 45 67',
    smsCode: '000001',
  }
})
const selectedViewApplicantRows = computed(() => {
  if (!selectedViewDetail.value) {
    return []
  }

  const applicant = selectedViewDetail.value.applicant

  return [
    ['FIO', applicant.fullName],
    ["Tug'ilgan sanasi", applicant.birthDate],
    ['JSHSHIR', applicant.pinfl],
    ...(applicant.temporaryAddress
      ? [["Vaqtinchalik manzili", applicant.temporaryAddress] as const]
      : []),
    ['Manzil', applicant.permanentAddress],
  ] as const
})
const selectedViewServiceRecipientRows = computed(() => {
  if (!selectedViewDetail.value) {
    return []
  }

  const serviceRecipient = selectedViewDetail.value.serviceRecipient

  return [
    ['FIO', serviceRecipient.fullName],
    ["Tug'ilgan sanasi", serviceRecipient.birthDate],
    ['Tashxis', `${serviceRecipient.diagnosisLabel} (${serviceRecipient.diagnosisCode})`],
    ['Nogironlik guruhi', serviceRecipient.disabilityGroup ?? '—'],
    ['JSHSHIR', serviceRecipient.pinfl],
    ...(serviceRecipient.temporaryAddress
      ? [["Vaqtinchalik manzili", serviceRecipient.temporaryAddress] as const]
      : []),
    ['Manzil', serviceRecipient.permanentAddress],
  ] as const
})
const hasAllMedicalDocuments = computed(() => {
  return activeMedicalDocumentFields.value.length > 0
    && activeMedicalDocumentFields.value.every((document) => Boolean(uploadedMedicalDocuments.value[document.id]))
})
const isApplicantCustomResidenceComplete = computed(() => {
  if (!hasApplicantCustomResidenceAddress.value) {
    return true
  }

  return Boolean(
    applicantCustomResidenceRegion.value
    && applicantCustomResidenceDistrict.value
    && applicantCustomResidenceMfy.value
    && applicantCustomResidenceAddress.value.trim(),
  )
})
const isServiceRecipientCustomResidenceComplete = computed(() => {
  if (!hasServiceRecipientCustomResidenceAddress.value) {
    return true
  }

  return Boolean(
    serviceRecipientCustomResidenceRegion.value
    && serviceRecipientCustomResidenceDistrict.value
    && serviceRecipientCustomResidenceMfy.value
    && serviceRecipientCustomResidenceAddress.value.trim(),
  )
})
const hasCreateFormContent = computed(() => {
  return Boolean(
    applicantPinflInput.value
    || applicantLookupResult.value
    || hasApplicantCustomResidenceAddress.value
    || applicantCustomResidenceRegion.value
    || applicantCustomResidenceDistrict.value
    || applicantCustomResidenceMfy.value
    || applicantCustomResidenceAddress.value
    || serviceRecipientPinflInput.value
    || serviceRecipientLookupResult.value
    || hasServiceRecipientCustomResidenceAddress.value
    || serviceRecipientCustomResidenceRegion.value
    || serviceRecipientCustomResidenceDistrict.value
    || serviceRecipientCustomResidenceMfy.value
    || serviceRecipientCustomResidenceAddress.value
    || Object.keys(uploadedMedicalDocuments.value).length
    || selectedServiceOptionId.value
    || smsPhoneNumber.value
    || smsCodeInput.value
    || isSmsCodeSent.value
  )
})
const isCreateFormReadyToSave = computed(() => {
  return Boolean(
    applicantLookupResult.value
    && serviceRecipientLookupResult.value
    && isApplicantCustomResidenceComplete.value
    && isServiceRecipientCustomResidenceComplete.value
    && selectedServiceOptionId.value
    && selectedServiceEligibility.value?.eligible
    && hasAllMedicalDocuments.value
    && smsPhoneNumber.value.length === 9
    && isSmsCodeSent.value
    && smsCodeInput.value.length === 6,
  )
})

const hasPendingFilterChanges = computed(() => {
  return draftStatusFilter.value !== appliedStatusFilter.value
    || draftRegionFilter.value !== appliedRegionFilter.value
    || draftDistrictFilter.value !== appliedDistrictFilter.value
    || draftStartDateFilter.value !== appliedStartDateFilter.value
    || draftEndDateFilter.value !== appliedEndDateFilter.value
})

const draftStatusLabel = computed(() => draftStatusFilter.value === 'all' ? 'Barchasi' : draftStatusFilter.value)
const draftRegionLabel = computed(() => draftRegionFilter.value === 'all' ? 'Barchasi' : draftRegionFilter.value)
const isDistrictFilterEnabled = computed(() => draftRegionFilter.value !== 'all')
const draftDistrictLabel = computed(() => {
  if (!isDistrictFilterEnabled.value) {
    return 'Avval viloyatni tanlang'
  }

  return draftDistrictFilter.value === 'all' ? 'Barchasi' : draftDistrictFilter.value
})
const calendarMonthLabel = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [year, month] = monthValue.split('-')

  if (!year || !month) {
    return ''
  }

  const monthIndex = Number(month) - 1
  const monthName = monthNames[monthIndex]

  if (!monthName) {
    return year
  }

  return `${monthName} ${year}`
})
const calendarWeekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
const calendarDays = computed(() => {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return []
  }

  const year = Number(yearString)
  const monthIndex = Number(monthString) - 1
  const firstDay = new Date(year, monthIndex, 1)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const leadingEmptyDays = (firstDay.getDay() + 6) % 7
  const days: Array<{ key: string, label: string, value: string, isCurrentMonth: boolean }> = []

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    days.push({
      key: `empty-start-${index}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayValue = String(day).padStart(2, '0')
    days.push({
      key: `${yearString}-${monthString}-${dayValue}`,
      label: String(day),
      value: `${yearString}-${monthString}-${dayValue}`,
      isCurrentMonth: true,
    })
  }

  while (days.length % 7 !== 0) {
    days.push({
      key: `empty-end-${days.length}`,
      label: '',
      value: '',
      isCurrentMonth: false,
    })
  }

  return days
})

function closeFilters() {
  isFiltersOpen.value = false
  openFilterField.value = null
  openCalendarField.value = null
}

function toggleCreateAddressField(field: typeof openCreateAddressField.value) {
  openCreateAddressField.value = openCreateAddressField.value === field ? null : field
}

function closeCreateAddressField() {
  openCreateAddressField.value = null
}

function handleServiceOptionChange(value: string) {
  const targetService = serviceEligibilityOptions.value.find((service) => service.id === value)

  if (!targetService?.eligible) {
    return
  }

  if (selectedServiceOptionId.value !== value) {
    uploadedMedicalDocuments.value = {}
  }

  selectedServiceOptionId.value = value
  closeCreateAddressField()
}

function setRowsPerPageOpen(nextOpen: boolean) {
  isRowsPerPageOpen.value = nextOpen
}

function setActionMenuOpen(rowId: string, nextOpen: boolean) {
  openActionMenuId.value = nextOpen ? rowId : null
}

function parseApplicationDate(value: string) {
  const [day, month, year] = value.split('.')

  if (!day || !month || !year) {
    return null
  }

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function normalizeFilterDate(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)

  if (dotMatch) {
    const day = dotMatch[1]
    const month = dotMatch[2]
    const year = dotMatch[3]

    if (!day || !month || !year) {
      return ''
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (isoMatch) {
    return trimmed
  }

  return ''
}

function formatFilterDateForInput(value: string) {
  if (!value) {
    return ''
  }

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!isoMatch) {
    return value
  }

  const year = isoMatch[1]
  const month = isoMatch[2]
  const day = isoMatch[3]

  if (!year || !month || !day) {
    return value
  }

  return `${day}.${month}.${year}`
}

function openCalendar(field: 'start' | 'end') {
  openCalendarField.value = openCalendarField.value === field ? null : field
  if (!openCalendarField.value) {
    return
  }

  const sourceDate = field === 'start' ? draftStartDateFilter.value : draftEndDateFilter.value
  calendarMonth.value = (sourceDate || getTodayIso()).slice(0, 7)
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10)
}

function shiftCalendarMonth(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString), Number(monthString) - 1 + direction, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function shiftCalendarYear(direction: -1 | 1) {
  const monthValue = calendarMonth.value || getTodayIso().slice(0, 7)
  const [yearString, monthString] = monthValue.split('-')

  if (!yearString || !monthString) {
    return
  }

  const date = new Date(Number(yearString) + direction, Number(monthString) - 1, 1)
  calendarMonth.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function selectCalendarDate(field: 'start' | 'end', value: string) {
  if (field === 'start') {
    handleStartDateFilterChange(value)
  }
  else {
    handleEndDateFilterChange(value)
  }

  openCalendarField.value = null
}

function isCalendarDateSelected(value: string) {
  if (openCalendarField.value === 'start') {
    return draftStartDateFilter.value === value
  }

  if (openCalendarField.value === 'end') {
    return draftEndDateFilter.value === value
  }

  return false
}

function toggleFiltersFromMenu(nextOpen: boolean) {
  if (nextOpen) {
    draftStatusFilter.value = appliedStatusFilter.value
    draftRegionFilter.value = appliedRegionFilter.value
    draftDistrictFilter.value = appliedDistrictFilter.value
    draftStartDateFilter.value = appliedStartDateFilter.value
    draftEndDateFilter.value = appliedEndDateFilter.value
    openFilterField.value = null
  }

  isFiltersOpen.value = nextOpen
}

function toggleFilterField(field: 'status' | 'region' | 'district') {
  openFilterField.value = openFilterField.value === field ? null : field
}

function selectStatusFilter(value: 'all' | ApplicationStatus) {
  draftStatusFilter.value = value
  openFilterField.value = null
}

function selectRegionFilter(value: string) {
  draftRegionFilter.value = value

  if (value === 'all') {
    draftDistrictFilter.value = 'all'
    openFilterField.value = null
    return
  }

  const districtExists = applicationRows.value.some((row) => row.region === value && row.district === draftDistrictFilter.value)

  if (!districtExists) {
    draftDistrictFilter.value = 'all'
  }

  openFilterField.value = null
}

function selectDistrictFilter(value: string) {
  draftDistrictFilter.value = value
  openFilterField.value = null
}

function sanitizePinflValue(value: string) {
  return value.replace(/\D/g, '').slice(0, 14)
}

function handlePinflKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    return
  }

  const allowedKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
  ]

  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
    return
  }

  if (!/^\d$/.test(event.key)) {
    event.preventDefault()
  }
}

function updateApplicantPinfl(value: string) {
  applicantPinflInput.value = sanitizePinflValue(value)
}

function updateServiceRecipientPinfl(value: string) {
  serviceRecipientPinflInput.value = sanitizePinflValue(value)
}

function updateSmsPhoneNumber(value: string) {
  smsPhoneNumber.value = value.replace(/\D/g, '').slice(0, 9)
}

function clearSmsResendTimer() {
  if (smsResendTimer) {
    clearInterval(smsResendTimer)
    smsResendTimer = null
  }
}

function startSmsResendCountdown() {
  clearSmsResendTimer()
  smsResendCountdown.value = 10

  smsResendTimer = setInterval(() => {
    if (smsResendCountdown.value <= 1) {
      smsResendCountdown.value = 0
      clearSmsResendTimer()
      return
    }

    smsResendCountdown.value -= 1
  }, 1000)
}

function resetApplicantCustomResidenceAddress() {
  applicantCustomResidenceRegion.value = ''
  applicantCustomResidenceDistrict.value = ''
  applicantCustomResidenceMfy.value = ''
  applicantCustomResidenceAddress.value = ''
  closeCreateAddressField()
}

function resetServiceRecipientCustomResidenceAddress() {
  serviceRecipientCustomResidenceRegion.value = ''
  serviceRecipientCustomResidenceDistrict.value = ''
  serviceRecipientCustomResidenceMfy.value = ''
  serviceRecipientCustomResidenceAddress.value = ''
  closeCreateAddressField()
}

function handleApplicantCustomResidenceRegionChange(value: string) {
  applicantCustomResidenceRegion.value = value
  applicantCustomResidenceDistrict.value = ''
  applicantCustomResidenceMfy.value = ''
  closeCreateAddressField()
}

function handleServiceRecipientCustomResidenceRegionChange(value: string) {
  serviceRecipientCustomResidenceRegion.value = value
  serviceRecipientCustomResidenceDistrict.value = ''
  serviceRecipientCustomResidenceMfy.value = ''
  closeCreateAddressField()
}

function handleApplicantCustomResidenceDistrictChange(value: string) {
  applicantCustomResidenceDistrict.value = value
  applicantCustomResidenceMfy.value = ''
  closeCreateAddressField()
}

function handleServiceRecipientCustomResidenceDistrictChange(value: string) {
  serviceRecipientCustomResidenceDistrict.value = value
  serviceRecipientCustomResidenceMfy.value = ''
  closeCreateAddressField()
}

function handleApplicantCustomResidenceMfyChange(value: string) {
  applicantCustomResidenceMfy.value = value
  closeCreateAddressField()
}

function handleServiceRecipientCustomResidenceMfyChange(value: string) {
  serviceRecipientCustomResidenceMfy.value = value
  closeCreateAddressField()
}

function handleApplicantPinflPaste(event: ClipboardEvent) {
  event.preventDefault()
  updateApplicantPinfl(event.clipboardData?.getData('text') ?? '')
}

function handleServiceRecipientPinflPaste(event: ClipboardEvent) {
  event.preventDefault()
  updateServiceRecipientPinfl(event.clipboardData?.getData('text') ?? '')
}

function handleStartDateFilterChange(value: string) {
  const normalizedValue = normalizeFilterDate(value)
  draftStartDateFilter.value = normalizedValue

  if (draftEndDateFilter.value && normalizedValue && draftEndDateFilter.value < normalizedValue) {
    draftEndDateFilter.value = normalizedValue
  }
}

function handleEndDateFilterChange(value: string) {
  const normalizedValue = normalizeFilterDate(value)
  draftEndDateFilter.value = normalizedValue

  if (draftStartDateFilter.value && normalizedValue && draftStartDateFilter.value > normalizedValue) {
    draftStartDateFilter.value = normalizedValue
  }
}

function applyFilters() {
  runTableLoading(() => {
    appliedStatusFilter.value = draftStatusFilter.value
    appliedRegionFilter.value = draftRegionFilter.value
    appliedDistrictFilter.value = draftDistrictFilter.value
    appliedStartDateFilter.value = draftStartDateFilter.value
    appliedEndDateFilter.value = draftEndDateFilter.value
    currentPage.value = 1
  })

  closeFilters()
}

function clearFilters() {
  clearSearchAndFilters()
}

function openCreateDialog() {
  isCreateDialogOpen.value = true
  isSavingApplication.value = false
  applicantPinflInput.value = ''
  applicantLookupResult.value = null
  applicantLookupError.value = ''
  serviceRecipientPinflInput.value = ''
  serviceRecipientLookupResult.value = null
  serviceRecipientLookupError.value = ''
  resetServiceRecipientPhoto()
  hasApplicantCustomResidenceAddress.value = false
  resetApplicantCustomResidenceAddress()
  hasServiceRecipientCustomResidenceAddress.value = false
  resetServiceRecipientCustomResidenceAddress()
  uploadedMedicalDocuments.value = {}
  selectedServiceOptionId.value = ''
  smsPhoneNumber.value = ''
  smsCodeInput.value = ''
  isSmsCodeSent.value = false
  smsResendCountdown.value = 0
  clearSmsResendTimer()
}

function closeCreateDialog() {
  isCreateDialogOpen.value = false
  isSavingApplication.value = false
  applicantLookupResult.value = null
  applicantLookupError.value = ''
  applicantPinflInput.value = ''
  isApplicantLookupLoading.value = false
  hasApplicantCustomResidenceAddress.value = false
  resetApplicantCustomResidenceAddress()
  serviceRecipientLookupResult.value = null
  serviceRecipientLookupError.value = ''
  serviceRecipientPinflInput.value = ''
  isServiceRecipientLookupLoading.value = false
  resetServiceRecipientPhoto()
  hasServiceRecipientCustomResidenceAddress.value = false
  resetServiceRecipientCustomResidenceAddress()
  uploadedMedicalDocuments.value = {}
  selectedServiceOptionId.value = ''
  smsPhoneNumber.value = ''
  smsCodeInput.value = ''
  isSmsCodeSent.value = false
  smsResendCountdown.value = 0
  clearSmsResendTimer()
}

async function lookupPerson(
  pinflInput: typeof applicantPinflInput,
  resultTarget: typeof applicantLookupResult,
  errorTarget: typeof applicantLookupError,
  loadingTarget: typeof isApplicantLookupLoading,
  options?: {
    isMinor?: boolean
  },
) {
  const normalizedPinfl = pinflInput.value.replace(/\D/g, '')
  pinflInput.value = normalizedPinfl
  resultTarget.value = null
  errorTarget.value = ''

  if (normalizedPinfl.length !== 14) {
    errorTarget.value = 'JSHSHIR 14 ta raqamdan iborat bo‘lishi kerak.'
    return
  }

  loadingTarget.value = true

  await new Promise((resolve) => setTimeout(resolve, 350))

  const matchedRow = applicationRows.value.find((row) => row.pinfl === normalizedPinfl)

  const addressIndex = matchedRow
    ? applicationRows.value.findIndex((row) => row.pinfl === normalizedPinfl)
    : Number(normalizedPinfl.slice(-2)) % demoRegions.length

  const fallbackRegionEntry = demoRegions[addressIndex % demoRegions.length] ?? demoRegions[0]
  const [fallbackRegion, fallbackDistrict] = fallbackRegionEntry
  const mfy = demoMahallas[addressIndex % demoMahallas.length] ?? demoMahallas[0]
  const diagnosis = getDiagnosisBySeed(addressIndex, options?.isMinor)
  const disabilityGroup = getDisabilityGroupBySeed(addressIndex, options?.isMinor)
  const permanentAddress = `${matchedRow?.region ?? fallbackRegion}, ${matchedRow?.district ?? fallbackDistrict}, ${mfy}, ${String((addressIndex % 47) + 1)}-uy`
  const temporaryAddress = addressIndex % 2 === 0
    ? `${matchedRow?.region ?? fallbackRegion}, ${matchedRow?.district ?? fallbackDistrict}, ${mfy}, ${String((addressIndex % 31) + 10)}-uy, ${String((addressIndex % 12) + 1)}-xonadon`
    : undefined

  resultTarget.value = {
    fullName: matchedRow?.fullName ?? "Demo foydalanuvchi",
    pinfl: matchedRow?.pinfl ?? normalizedPinfl,
    birthDate: buildBirthDate(addressIndex, options?.isMinor),
    permanentAddress,
    temporaryAddress,
    documentNumber: '',
    diagnosisCode: diagnosis.code,
    diagnosisLabel: diagnosis.label,
    disabilityGroup,
  }
  loadingTarget.value = false
}

async function lookupApplicant() {
  hasApplicantCustomResidenceAddress.value = false
  resetApplicantCustomResidenceAddress()
  await lookupPerson(
    applicantPinflInput,
    applicantLookupResult,
    applicantLookupError,
    isApplicantLookupLoading,
  )
}

async function lookupServiceRecipient() {
  hasServiceRecipientCustomResidenceAddress.value = false
  resetServiceRecipientCustomResidenceAddress()
  resetServiceRecipientPhoto()
  await lookupPerson(
    serviceRecipientPinflInput,
    serviceRecipientLookupResult,
    serviceRecipientLookupError,
    isServiceRecipientLookupLoading,
    { isMinor: true },
  )
}

function handleMedicalDocumentUpload(documentId: string, event: Event) {
  const input = event.target as HTMLInputElement
  const fileName = input.files?.[0]?.name ?? ''

  uploadedMedicalDocuments.value = {
    ...uploadedMedicalDocuments.value,
    [documentId]: fileName,
  }
}

function resetServiceRecipientPhoto() {
  serviceRecipientPhotoPreview.value = ''
  serviceRecipientPhotoName.value = ''
}

function handleServiceRecipientPhotoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    resetServiceRecipientPhoto()
    return
  }

  serviceRecipientPhotoName.value = file.name

  const reader = new FileReader()
  reader.onload = () => {
    serviceRecipientPhotoPreview.value = typeof reader.result === 'string' ? reader.result : ''
  }
  reader.readAsDataURL(file)
}

function sendSmsCode() {
  if (!serviceRecipientLookupResult.value) {
    showNotification({
      tone: 'destructive',
      title: 'Ma’lumot yetarli emas',
      description: 'Avval xizmat oluvchini aniqlang.',
    })
    return
  }

  if (smsPhoneNumber.value.length !== 9) {
    showNotification({
      tone: 'destructive',
      title: 'Telefon raqami noto‘g‘ri',
      description: 'SMS-kod yuborish uchun +998 dan keyingi 9 xonali telefon raqamini kiriting.',
    })
    return
  }

  isSmsCodeSent.value = true
  startSmsResendCountdown()
  showNotification({
    tone: 'success',
    title: 'SMS-kod yuborildi',
    description: 'SMS-kod kiritilib tasdiqlangach, ma’lumotlarni olish va qayta ishlashga rozilik tasdiqlanadi.',
  })
}

function clearCreateDialogForm() {
  isSavingApplication.value = false
  applicantPinflInput.value = ''
  applicantLookupResult.value = null
  applicantLookupError.value = ''
  isApplicantLookupLoading.value = false
  hasApplicantCustomResidenceAddress.value = false
  resetApplicantCustomResidenceAddress()
  serviceRecipientPinflInput.value = ''
  serviceRecipientLookupResult.value = null
  serviceRecipientLookupError.value = ''
  isServiceRecipientLookupLoading.value = false
  resetServiceRecipientPhoto()
  hasServiceRecipientCustomResidenceAddress.value = false
  resetServiceRecipientCustomResidenceAddress()
  uploadedMedicalDocuments.value = {}
  selectedServiceOptionId.value = ''
  smsPhoneNumber.value = ''
  smsCodeInput.value = ''
  isSmsCodeSent.value = false
  smsResendCountdown.value = 0
  clearSmsResendTimer()
}

async function saveApplicationDraft() {
  if (!hasCreateFormContent.value) {
    showNotification({
      tone: 'destructive',
      title: 'Ma’lumot kiritilmagan',
      description: 'Arizani saqlash uchun kamida bitta maydonni to‘ldiring.',
    })
    return
  }

  if (!isCreateFormReadyToSave.value) {
    showNotification({
      tone: 'destructive',
      title: 'Majburiy ma’lumotlar yetarli emas',
      description: 'Arizani saqlash uchun oynadagi barcha majburiy maydonlarni to‘ldiring va SMS-kod bilan tasdiqlang.',
    })
    return
  }

  if (isSavingApplication.value) {
    return
  }

  isSavingApplication.value = true

  await new Promise((resolve) => setTimeout(resolve, 2000))

  showNotification({
    tone: 'success',
    title: 'Ariza saqlandi',
    description: 'Yangi ariza ma’lumotlari vaqtincha saqlandi.',
  })
  isSavingApplication.value = false
  closeCreateDialog()
}

function clearSearchAndFilters() {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = null
  }

  searchInput.value = ''
  draftStatusFilter.value = 'all'
  draftRegionFilter.value = 'all'
  draftDistrictFilter.value = 'all'
  draftStartDateFilter.value = ''
  draftEndDateFilter.value = ''

  runTableLoading(() => {
    searchQuery.value = ''
    appliedStatusFilter.value = 'all'
    appliedRegionFilter.value = 'all'
    appliedDistrictFilter.value = 'all'
    appliedStartDateFilter.value = ''
    appliedEndDateFilter.value = ''
    currentPage.value = 1
  })
}

const totalRows = computed(() => filteredRows.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalRows.value / selectedRowsPerPage.value)))
const applicationStatusCards = computed(() => {
  const total = filteredRows.value.length
  const inProgress = filteredRows.value.filter((row) => row.status === 'Jarayonda').length
  const approved = filteredRows.value.filter((row) => row.status === 'Tasdiqlangan').length
  const rejected = filteredRows.value.filter((row) => row.status === 'Bekor qilingan').length

  const formatShare = (count: number) => {
    if (total === 0) {
      return '0%'
    }

    return `${Math.round((count / total) * 100)}%`
  }

  return applicationStatusCardMeta.map((card) => {
    const countMap = {
      total,
      'in-progress': inProgress,
      approved,
      rejected,
    } as const

    const value = countMap[card.id]

    return {
      ...card,
      value: String(value),
      share: card.id === 'total' ? '100%' : formatShare(value),
    }
  })
})
const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * selectedRowsPerPage.value
  const end = start + selectedRowsPerPage.value

  return filteredRows.value.slice(start, end)
})
const paginationSummary = computed(() => {
  const start = totalRows.value === 0 ? 0 : (currentPage.value - 1) * selectedRowsPerPage.value + 1
  const end = Math.min(currentPage.value * selectedRowsPerPage.value, totalRows.value)

  return `${start}-${end} / ${totalRows.value}`
})
const currentPageSummary = computed(() => `${currentPage.value}/${totalPages.value}`)
const filterPanelBodyStyle = computed(() => {
  if (!desktopFilterMaxHeight.value) {
    return undefined
  }

  return {
    maxHeight: `${desktopFilterMaxHeight.value}px`,
  }
})

function updateDesktopFilterMaxHeight() {
  if (typeof window === 'undefined') {
    return
  }

  const anchorRect = filterAnchorRef.value?.getBoundingClientRect()
  const paginationRect = paginationRef.value?.getBoundingClientRect()

  if (!anchorRect || !paginationRect) {
    desktopFilterMaxHeight.value = null
    return
  }

  const availableHeight = Math.floor(paginationRect.top - anchorRect.bottom - 8)
  desktopFilterMaxHeight.value = availableHeight > 220 ? availableHeight : null
}

function setRowsPerPage(nextValue: number) {
  runTableLoading(() => {
    selectedRowsPerPage.value = nextValue
    currentPage.value = 1
  })
}

function handleSearchInput(value: string) {
  searchInput.value = value

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  searchDebounceTimer = setTimeout(() => {
    runTableLoading(() => {
      searchQuery.value = searchInput.value
      currentPage.value = 1
    })
    searchDebounceTimer = null
  }, 1000)
}

function showNotification(notification: PageNotification) {
  pageNotification.value = notification
  notificationProgress.value = 100
  notificationRemaining.value = NOTIFICATION_DURATION

  startNotificationCountdown(NOTIFICATION_DURATION)
}

function clearNotificationTimers() {
  if (notificationTimer) {
    clearTimeout(notificationTimer)
    notificationTimer = null
  }

  if (notificationAnimationFrame) {
    cancelAnimationFrame(notificationAnimationFrame)
    notificationAnimationFrame = null
  }
}

function closeNotification() {
  clearNotificationTimers()
  pageNotification.value = null
  notificationProgress.value = 100
  notificationRemaining.value = NOTIFICATION_DURATION
}

function openViewDialog(row: ApplicationRow) {
  selectedViewRow.value = row
}

function openIptkFlowDialog() {
  selectedIptkFlowStepId.value = 'A'
  isIptkFlowDialogOpen.value = true
}

function closeIptkFlowDialog() {
  isIptkFlowDialogOpen.value = false
}

function selectIptkFlowStep(stepId: string) {
  if (!iptkFlowSteps.some((step) => step.id === stepId)) {
    return
  }

  selectedIptkFlowStepId.value = stepId
}

function updateIptkFlowCommentBadges() {
  if (!iptkFlowDiagramRef.value) {
    iptkFlowCommentBadges.value = []
    return
  }

  const svgElement = iptkFlowDiagramRef.value.querySelector('svg')
  if (!svgElement) {
    iptkFlowCommentBadges.value = []
    return
  }

  const svgRect = svgElement.getBoundingClientRect()
  if (!svgRect.width || !svgRect.height) {
    iptkFlowCommentBadges.value = []
    return
  }

  const supportedStepIds = new Set(iptkFlowSteps.map((step) => step.id))
  const badges = Array.from(svgElement.querySelectorAll('g.node'))
    .map((node) => {
      const rawId = node.getAttribute('id') ?? ''
      const match = rawId.match(/^flowchart-([A-Z]+)-\d+$/)
      const stepId = match?.[1] ?? ''
      if (!supportedStepIds.has(stepId)) {
        return null
      }

      const nodeRect = (node as SVGGElement).getBoundingClientRect()
      return {
        stepId,
        left: nodeRect.right - svgRect.left - 10,
        top: nodeRect.top - svgRect.top - 10,
      }
    })
    .filter((badge): badge is { stepId: string; left: number; top: number } => Boolean(badge))

  const uniqueBadges = badges.filter((badge, index, array) => array.findIndex((item) => item.stepId === badge.stepId) === index)
  iptkFlowCommentBadges.value = uniqueBadges
}

function scheduleIptkFlowBadgeMeasurement() {
  if (iptkFlowBadgeMeasureFrame !== null) {
    cancelAnimationFrame(iptkFlowBadgeMeasureFrame)
  }

  iptkFlowBadgeMeasureFrame = requestAnimationFrame(() => {
    iptkFlowBadgeMeasureFrame = null
    updateIptkFlowCommentBadges()
  })
}

function triggerBrowserDownload(url: string, fileName: string) {
  const anchor = window.document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  window.document.body.append(anchor)
  anchor.click()
  anchor.remove()
}

async function saveBlobToFile(blob: Blob, fileName: string, mimeType: string) {
  const savePickerWindow = window as Window & {
    showSaveFilePicker?: (options: {
      suggestedName: string
      types: Array<{
        description: string
        accept: Record<string, string[]>
      }>
    }) => Promise<{
      createWritable: () => Promise<{
        write: (data: Blob) => Promise<void>
        close: () => Promise<void>
      }>
    }>
  }

  if (savePickerWindow.showSaveFilePicker) {
    const handle = await savePickerWindow.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: fileName.endsWith('.png') ? 'PNG image' : 'SVG image',
          accept: {
            [mimeType]: [`.${fileName.split('.').pop() ?? 'svg'}`],
          },
        },
      ],
    })
    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
    return
  }

  const objectUrl = URL.createObjectURL(blob)
  triggerBrowserDownload(objectUrl, fileName)
  setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)
}

function getIptkFlowSvgMarkup() {
  if (!iptkFlowMermaidSvg.value) {
    return ''
  }

  return iptkFlowMermaidSvg.value.trim()
}

async function downloadIptkFlowAsSvg() {
  const svgMarkup = getIptkFlowSvgMarkup()

  if (!svgMarkup) {
    showNotification({
      tone: 'destructive',
      title: 'Flow hali tayyor emas',
      description: 'Diagramma to‘liq yuklangach qayta urinib ko‘ring.',
    })
    return
  }

  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })

  try {
    await saveBlobToFile(blob, 'iptk-umumiy-flow.svg', 'image/svg+xml')
  } catch {
    showNotification({
      tone: 'destructive',
      title: 'Yuklab olish amalga oshmadi',
      description: 'SVG formatni saqlashda xatolik yuz berdi.',
    })
  }
}

async function downloadIptkFlowAsPng() {
  const svgMarkup = getIptkFlowSvgMarkup()

  if (!svgMarkup) {
    showNotification({
      tone: 'destructive',
      title: 'Flow hali tayyor emas',
      description: 'Diagramma to‘liq yuklangach qayta urinib ko‘ring.',
    })
    return
  }

  const parser = new DOMParser()
  const svgDocument = parser.parseFromString(svgMarkup, 'image/svg+xml')
  const svgElement = svgDocument.documentElement
  const viewBox = svgElement.getAttribute('viewBox')?.split(/\s+/).map(Number) ?? []
  const widthFromViewBox = viewBox.length === 4 ? viewBox[2] : 1400
  const heightFromViewBox = viewBox.length === 4 ? viewBox[3] : 1000
  const width = Number(svgElement.getAttribute('width')?.replace(/[^\d.]/g, '')) || widthFromViewBox || 1400
  const height = Number(svgElement.getAttribute('height')?.replace(/[^\d.]/g, '')) || heightFromViewBox || 1000
  const scale = 2
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)

  try {
    await new Promise<void>((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        const canvas = window.document.createElement('canvas')
        canvas.width = Math.round(width * scale)
        canvas.height = Math.round(height * scale)

        const context = canvas.getContext('2d')

        if (!context) {
          reject(new Error('Canvas context yaratilmadi'))
          return
        }

        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.scale(scale, scale)
        context.drawImage(image, 0, 0, width, height)

        canvas.toBlob(async (pngBlob) => {
          if (!pngBlob) {
            reject(new Error('PNG blob yaratilmadi'))
            return
          }

          try {
            await saveBlobToFile(pngBlob, 'iptk-umumiy-flow.png', 'image/png')
            resolve()
          } catch (error) {
            reject(error)
          }
        }, 'image/png')
      }
      image.onerror = () => reject(new Error('PNG render qilishda xatolik'))
      image.src = objectUrl
    })
  } catch {
    showNotification({
      tone: 'destructive',
      title: 'Yuklab olish amalga oshmadi',
      description: 'PNG formatni tayyorlashda xatolik yuz berdi.',
    })
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function renderIptkFlowMermaid() {
  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      fontFamily: 'Roboto, sans-serif',
      flowchart: {
        htmlLabels: false,
        useMaxWidth: true,
        curve: 'basis',
        nodeSpacing: 40,
        rankSpacing: 56,
        padding: 16,
      },
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#f8fafc',
        primaryTextColor: '#0f172a',
        primaryBorderColor: '#cbd5e1',
        lineColor: '#94a3b8',
        textColor: '#0f172a',
        mainBkg: '#ffffff',
        nodeBorder: '#cbd5e1',
        secondaryColor: '#ecfdf5',
        secondaryTextColor: '#166534',
        secondaryBorderColor: '#86efac',
        tertiaryColor: '#eff6ff',
        tertiaryTextColor: '#1d4ed8',
        tertiaryBorderColor: '#93c5fd',
        edgeLabelBackground: '#ffffff',
      },
    })
    mermaidInitialized = true
  }

  mermaidRenderId += 1
  const renderId = `iptk-flowchart-${mermaidRenderId}`
  const { svg } = await mermaid.render(renderId, iptkFlowMermaidDefinition)
  iptkFlowMermaidSvg.value = svg
  await nextTick()
  scheduleIptkFlowBadgeMeasurement()
}

function closeViewDialog() {
  selectedViewRow.value = null
}

function buildViewDocumentContent(viewDocument: { label: string, fileName: string }) {
  if (!selectedViewRow.value || !selectedViewDetail.value) {
    return ''
  }

  return [
    `Hujjat: ${viewDocument.label}`,
    `Fayl: ${viewDocument.fileName}`,
    `Ariza raqami: ${selectedViewRow.value.id}`,
    `Ariza sanasi: ${selectedViewRow.value.date}`,
    `Xizmat turi: ${selectedViewDetail.value.service.label}`,
    `Arizachi: ${selectedViewDetail.value.applicant.fullName}`,
    `Xizmat oluvchi: ${selectedViewDetail.value.serviceRecipient.fullName}`,
    '',
    'Demo preview hujjati.',
    'Backend API ulangach bu yerda real yuklangan faylning preview yoki original fayli ko‘rsatiladi.',
  ].join('\n')
}

function downloadViewDocument(viewDocument: { label: string, fileName: string }) {
  const content = buildViewDocumentContent(viewDocument)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const objectUrl = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')

  anchor.href = objectUrl
  anchor.download = viewDocument.fileName
  window.document.body.append(anchor)
  anchor.click()
  anchor.remove()

  setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)
}

function updateNotificationProgress() {
  if (!pageNotification.value) {
    notificationAnimationFrame = null
    return
  }

  const elapsed = performance.now() - notificationStartedAt
  const remaining = Math.max(0, notificationCountdownStart - elapsed)
  notificationRemaining.value = remaining
  notificationProgress.value = (remaining / NOTIFICATION_DURATION) * 100

  if (remaining > 0) {
    notificationAnimationFrame = requestAnimationFrame(updateNotificationProgress)
    return
  }

  notificationAnimationFrame = null
}

function startNotificationCountdown(duration: number) {
  clearNotificationTimers()
  notificationCountdownStart = duration
  notificationRemaining.value = duration
  notificationStartedAt = performance.now()
  notificationTimer = setTimeout(() => {
    closeNotification()
  }, duration)
  notificationAnimationFrame = requestAnimationFrame(updateNotificationProgress)
}

function pauseNotificationCountdown() {
  if (!pageNotification.value) {
    return
  }

  const elapsed = performance.now() - notificationStartedAt
  notificationRemaining.value = Math.max(0, notificationCountdownStart - elapsed)
  notificationProgress.value = (notificationRemaining.value / NOTIFICATION_DURATION) * 100
  clearNotificationTimers()
}

function resumeNotificationCountdown() {
  if (!pageNotification.value || notificationRemaining.value <= 0) {
    return
  }

  startNotificationCountdown(notificationRemaining.value)
}

function openConfirmation(confirmation: PendingConfirmation) {
  pendingConfirmation.value = confirmation
}

function closeConfirmation() {
  pendingConfirmation.value = null
}

function confirmPendingAction() {
  if (!pendingConfirmation.value) {
    return
  }

  const action = pendingConfirmation.value.action
  pendingConfirmation.value = null
  action()
}

function updateRowStatus(rowId: string, nextStatus: ApplicationStatus) {
  const targetRow = applicationRows.value.find((row) => row.id === rowId)

  if (!targetRow) {
    return
  }

  targetRow.status = nextStatus
  targetRow.statusClass = statusStyles[nextStatus]
}

function confirmApprove(row: ApplicationRow) {
  openConfirmation({
    tone: 'success',
    title: 'Tasdiqlashni tasdiqlang',
    description: `${row.id} arizasini tasdiqlashni xohlaysizmi?`,
    confirmLabel: 'Tasdiqlash',
    action: () => {
      runTableLoading(() => {
        updateRowStatus(row.id, 'Tasdiqlangan')
        showNotification({
          tone: 'success',
          title: 'Ariza tasdiqlandi',
          description: `${row.id} muvaffaqiyatli tasdiqlandi.`,
        })
      })
    },
  })
}

function confirmReject(row: ApplicationRow) {
  openConfirmation({
    tone: 'destructive',
    title: 'Bekor qilishni tasdiqlang',
    description: `${row.id} arizasini bekor qilishni xohlaysizmi?`,
    confirmLabel: 'Bekor qilish',
    action: () => {
      runTableLoading(() => {
        updateRowStatus(row.id, 'Bekor qilingan')
        showNotification({
          tone: 'destructive',
          title: 'Ariza bekor qilindi',
          description: `${row.id} bekor qilingan holatiga o'tkazildi.`,
        })
      })
    },
  })
}

async function downloadApplicationsAsExcel() {
  if (isExporting.value) {
    return
  }

  if (!filteredRows.value.length) {
    showNotification({
      tone: 'destructive',
      title: 'Eksport uchun ma’lumot topilmadi',
      description: 'Joriy filterlar bo‘yicha yuklab olinadigan yozuv mavjud emas.',
    })
    return
  }

  let exportStartedAt = 0

  try {
    isExporting.value = true
    exportStartedAt = performance.now()
    const XLSX = await import('xlsx')
    const exportRows = filteredRows.value.map((row, index) => ({
      'T/r': index + 1,
      'Ariza ID': row.id,
      Sana: row.date,
      'Xizmat turi': row.serviceType,
      'Xizmat oluvchi': row.fullName,
      PINFL: row.pinfl,
      Viloyat: row.region,
      'Tuman yoki shahar': row.district,
      Status: row.status,
    }))

    const worksheet = XLSX.utils.json_to_sheet(exportRows)
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 16 },
      { wch: 14 },
      { wch: 34 },
      { wch: 18 },
      { wch: 24 },
      { wch: 24 },
      { wch: 16 },
    ]
    worksheet['!autofilter'] = {
      ref: `A1:H${exportRows.length + 1}`,
    }

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Arizalar ro'yxati")

    const fileName = `arizalar-royxati-${new Date().toISOString().slice(0, 10)}.xlsx`
    XLSX.writeFile(workbook, fileName, { compression: true })

    showNotification({
      tone: 'success',
      title: 'Eksport tayyor',
      description: `${filteredRows.value.length} ta yozuv .xlsx faylga yuklab olindi.`,
    })
  }
  catch {
    showNotification({
      tone: 'destructive',
      title: 'Eksportda xatolik',
      description: 'Excel faylni yaratishda muammo yuz berdi.',
    })
  }
  finally {
    const elapsed = performance.now() - exportStartedAt
    const remainingDelay = Math.max(0, EXPORT_MIN_LOADING_DURATION - elapsed)

    if (remainingDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingDelay))
    }

    isExporting.value = false
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) {
    return
  }

  runTableLoading(() => {
    currentPage.value = page
  })
}

function runTableLoading(update: () => void) {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  isTableLoading.value = true

  loadingTimer = setTimeout(() => {
    update()
    isTableLoading.value = false
    loadingTimer = null
  }, 200)
}

onMounted(() => {
  ;(window as Window & { handleIptkFlowNodeClick?: (nodeId: string) => void }).handleIptkFlowNodeClick = (nodeId: string) => {
    selectIptkFlowStep(nodeId)
  }

  loadingTimer = setTimeout(() => {
    isTableLoading.value = false
    loadingTimer = null
  }, 200)

  window.addEventListener('resize', updateDesktopFilterMaxHeight)
  window.addEventListener('resize', scheduleIptkFlowBadgeMeasurement)
  updateDesktopFilterMaxHeight()
})

onUnmounted(() => {
  delete (window as Window & { handleIptkFlowNodeClick?: (nodeId: string) => void }).handleIptkFlowNodeClick

  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }

  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }

  if (notificationTimer) {
    clearNotificationTimers()
  }

  clearSmsResendTimer()

  window.removeEventListener('resize', updateDesktopFilterMaxHeight)
  window.removeEventListener('resize', scheduleIptkFlowBadgeMeasurement)

  if (iptkFlowBadgeMeasureFrame !== null) {
    cancelAnimationFrame(iptkFlowBadgeMeasureFrame)
    iptkFlowBadgeMeasureFrame = null
  }
})

watch(isFiltersOpen, async (nextOpen) => {
  if (!nextOpen) {
    return
  }

  await nextTick()
  updateDesktopFilterMaxHeight()
})

watch(isIptkFlowDialogOpen, async (nextOpen) => {
  if (!nextOpen) {
    iptkFlowMermaidSvg.value = ''
    iptkFlowCommentBadges.value = []
    return
  }

  await nextTick()
  await renderIptkFlowMermaid()
})

watch(serviceRecipientLookupResult, () => {
  const currentSelection = serviceEligibilityOptions.value.find((service) => service.id === selectedServiceOptionId.value)

  if (selectedServiceOptionId.value && !currentSelection?.eligible) {
    selectedServiceOptionId.value = ''
    uploadedMedicalDocuments.value = {}
  }
})
</script>

<template>
  <PageContainer v-if="page">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <div class="relative flex min-h-0 min-w-0 max-w-full flex-1 flex-col xl:min-h-0">
      <div
        v-if="pendingConfirmation"
        class="fixed inset-0 z-50 flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
      >
        <div class="w-full max-w-md rounded-xl border border-border bg-card p-5">
          <div class="flex items-start gap-3">
            <div
              :class="[
                'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
                pendingConfirmation.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600',
              ]"
            />
            <div class="min-w-0 flex-1">
              <p class="text-base font-semibold text-foreground">
                {{ pendingConfirmation.title }}
              </p>
              <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ pendingConfirmation.description }}
              </p>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              @click="closeConfirmation"
            >
              Bekor qilish
            </Button>
            <Button
              :variant="pendingConfirmation.tone === 'success' ? 'default' : 'destructive'"
              @click="confirmPendingAction"
            >
              {{ pendingConfirmation.confirmLabel }}
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedViewRow && selectedViewDetail"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
        @click.self="closeViewDialog"
      >
        <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p class="text-lg font-semibold text-foreground">
                Ariza ma'lumotlari
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                {{ selectedViewRow.id }} bo‘yicha batafsil ko‘rish
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              class="h-9 w-9 p-0"
              @click="closeViewDialog"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>

          <div class="flex-1 space-y-5 overflow-y-auto p-5">
            <div class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <div class="rounded-2xl border border-border bg-card p-4">
                <p class="text-base font-semibold text-foreground">
                  Ariza rekvizitlari
                </p>
                <div class="mt-4 grid gap-3 sm:grid-cols-3">
                  <div class="rounded-xl border border-border bg-background px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Ariza raqami
                    </p>
                    <p class="mt-2 text-sm font-semibold text-foreground">
                      {{ selectedViewRow.id }}
                    </p>
                  </div>
                  <div class="rounded-xl border border-border bg-background px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Sana
                    </p>
                    <p class="mt-2 text-sm font-medium text-foreground">
                      {{ selectedViewRow.date }}
                    </p>
                  </div>
                  <div class="rounded-xl border border-border bg-background px-4 py-3">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Status
                    </p>
                    <div class="mt-2">
                      <span
                        :class="[
                          'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                          selectedViewRow.statusClass,
                        ]"
                      >
                        {{ selectedViewRow.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rounded-2xl border border-border bg-card p-4">
                <p class="text-base font-semibold text-foreground">
                  Xizmat turi
                </p>
                <div class="mt-4 rounded-xl border border-border bg-background px-4 py-3">
                  <p class="text-sm font-medium leading-6 text-foreground">
                    {{ selectedViewDetail.service.label }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <p class="text-base font-semibold text-foreground">
                Arizachi
              </p>
              <div class="mt-4 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
                <div class="flex h-full min-h-[180px] flex-col items-center justify-center rounded-2xl border border-border bg-background px-4 py-4 text-center">
                  <img
                    :src="selectedViewApplicantImage"
                    alt="Arizachi rasmi"
                    class="h-32 w-24 rounded-2xl border border-border/60 object-cover"
                  >
                  <span class="mt-3 text-sm text-muted-foreground">Rasm</span>
                </div>
                <div class="overflow-hidden rounded-2xl border border-border bg-background">
                  <div
                    v-for="[label, value] in selectedViewApplicantRows"
                    :key="`view-applicant-${label}`"
                    class="grid border-b border-border last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
                  >
                    <div class="bg-muted/35 px-4 py-3 text-sm font-medium text-muted-foreground">
                      {{ label }}
                    </div>
                    <div class="px-4 py-3 text-sm text-foreground">
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <p class="text-base font-semibold text-foreground">
                Xizmat oluvchi
              </p>
              <div class="mt-4 grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
                <div class="flex h-full min-h-[220px] flex-col items-center justify-center rounded-2xl border border-border bg-background px-5 py-6 text-center">
                  <div class="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/8 text-4xl font-semibold text-primary">
                    {{ selectedViewDetail.serviceRecipientInitials }}
                  </div>
                  <span class="mt-4 text-sm text-muted-foreground">Rasm</span>
                </div>
                <div class="overflow-hidden rounded-2xl border border-border bg-background">
                  <div
                    v-for="[label, value] in selectedViewServiceRecipientRows"
                    :key="`view-service-recipient-${label}`"
                    class="grid border-b border-border last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]"
                  >
                    <div class="bg-muted/35 px-4 py-3 text-sm font-medium text-muted-foreground">
                      {{ label }}
                    </div>
                    <div class="px-4 py-3 text-sm text-foreground">
                      {{ value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <p class="text-base font-semibold text-foreground">
                Tibbiy hujjatlar
              </p>
              <div class="mt-4 grid gap-3">
                <div
                  v-for="document in selectedViewDetail.documents"
                  :key="document.id"
                  class="rounded-xl border border-border bg-background px-4 py-3"
                >
                  <p class="text-sm font-medium leading-6 text-foreground">
                    {{ document.label }}
                  </p>
                  <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p class="text-sm text-muted-foreground">
                      {{ document.fileName }}
                    </p>
                    <div class="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        class="rounded-full px-4"
                        @click="downloadViewDocument(document)"
                      >
                        Yuklab olish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-2xl border border-border bg-card p-4">
              <p class="text-base font-semibold text-foreground">
                SMS-kod orqali tasdiqlash
              </p>
              <div class="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <div class="rounded-xl border border-border bg-background px-4 py-3">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Telefon raqami
                  </p>
                  <p class="mt-2 text-sm font-medium text-foreground">
                    +998 {{ selectedViewDetail.phoneNumber }}
                  </p>
                </div>
                <div class="rounded-xl border border-border bg-background px-4 py-3">
                  <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    SMS-kod
                  </p>
                  <p class="mt-2 text-sm font-medium tracking-[0.3em] text-foreground">
                    {{ selectedViewDetail.smsCode }}
                  </p>
                </div>
              </div>
              <p class="mt-4 text-sm leading-6 text-muted-foreground">
                Arizachi tomonidan so‘rovnomaning tasdiqlanishi u hamda nogironligi bo‘lgan shaxsga tegishli shaxsga doir ma’lumotlarni olish va ishlov berishga rozilikni bildiradi.
              </p>
            </div>

            <div class="flex justify-end border-t border-border pt-1">
              <Button
                variant="outline"
                class="rounded-full px-5"
                @click="closeViewDialog"
              >
                Yopish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="isIptkFlowDialogOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-background/55 p-4 backdrop-blur-sm"
        @click.self="closeIptkFlowDialog"
      >
        <div class="flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
          <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <p class="text-lg font-semibold text-foreground">
                IPTK umumiy flow
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                Xizmat turiga qarab qo‘llanadigan umumiy bosqichlar
              </p>
            </div>

            <div class="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                class="gap-2 rounded-full px-4"
                @click="downloadIptkFlowAsSvg"
              >
                <Download class="h-4 w-4" />
                <span>SVG</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="gap-2 rounded-full px-4"
                @click="downloadIptkFlowAsPng"
              >
                <Download class="h-4 w-4" />
                <span>PNG</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                class="h-9 w-9 p-0"
                @click="closeIptkFlowDialog"
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-5">
            <div class="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div class="rounded-2xl border border-border bg-muted/20 p-4">
                <p class="text-sm font-semibold text-foreground">
                  BPMN / flowchart ko‘rinishidagi umumiy jarayon
                </p>
                <div class="mt-4">
                  <div class="overflow-x-auto rounded-2xl border border-border bg-background p-4">
                    <div class="relative min-w-[900px]">
                      <div
                        ref="iptkFlowDiagramRef"
                        class="[&_svg]:h-auto [&_svg]:w-full [&_text]:fill-slate-900 [&_text]:font-['Roboto',sans-serif] [&_.edgePath_.path]:stroke-slate-400 [&_.edgePath_.path]:stroke-[2px] [&_.flowchart-link]:stroke-slate-400 [&_.marker]:fill-slate-400 [&_.marker]:stroke-slate-400 [&_.labelBkg]:fill-background [&_.node_rect]:fill-background [&_.node_rect]:stroke-slate-300 [&_.node_rect]:stroke-[1.5px] [&_.node_polygon]:fill-background [&_.node_polygon]:stroke-slate-300 [&_.node_polygon]:stroke-[1.5px]"
                        v-html="iptkFlowMermaidSvg"
                      />
                      <button
                        v-for="badge in iptkFlowCommentBadges"
                        :key="`flow-comment-${badge.stepId}`"
                        type="button"
                        class="absolute flex h-6 w-6 items-center justify-center rounded-full border border-primary/25 bg-background text-primary shadow-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        :style="{ left: `${badge.left}px`, top: `${badge.top}px` }"
                        :aria-label="`${badge.stepId} bo'yicha batafsil ma'lumot`"
                        @click.stop="selectIptkFlowStep(badge.stepId)"
                      >
                        <Info class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div class="rounded-2xl border border-border bg-background p-4">
                  <p class="text-sm font-semibold text-foreground">
                    Bosqichlar
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    Diagrammadagi node ustiga bosing, yoki undagi `i` badge orqali batafsil ma'lumotni oching.
                  </p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <button
                      v-for="step in iptkFlowSteps"
                      :key="step.id"
                      type="button"
                      :class="[
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                        selectedIptkFlowStep?.id === step.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      ]"
                      @click="selectIptkFlowStep(step.id)"
                    >
                      {{ step.title }}
                    </button>
                  </div>
                </div>

                <div
                  v-if="selectedIptkFlowStep"
                  class="rounded-2xl border border-border bg-background p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-foreground">
                        Batafsil ma’lumot
                      </p>
                      <p class="mt-1 text-base font-semibold text-foreground">
                        {{ selectedIptkFlowStep.title }}
                      </p>
                    </div>
                    <span class="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {{ selectedIptkFlowStep.id }}
                    </span>
                  </div>

                  <p class="mt-4 text-sm leading-6 text-muted-foreground">
                    {{ selectedIptkFlowStep.description }}
                  </p>

                  <div class="mt-4 space-y-3">
                    <div class="rounded-xl border border-border bg-card px-4 py-3">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Mas’ul
                      </p>
                      <p class="mt-2 text-sm text-foreground">
                        {{ selectedIptkFlowStep.responsible }}
                      </p>
                    </div>

                    <div class="rounded-xl border border-border bg-card px-4 py-3">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Muddat
                      </p>
                      <p class="mt-2 text-sm text-foreground">
                        {{ selectedIptkFlowStep.duration }}
                      </p>
                    </div>

                    <div class="rounded-xl border border-border bg-card px-4 py-3">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Normativ asos
                      </p>
                      <p class="mt-2 text-sm text-foreground">
                        {{ selectedIptkFlowStep.legalBasis }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-4">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Xizmatlar
                    </p>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="service in selectedIptkFlowStep.services"
                        :key="`${selectedIptkFlowStep.id}-${service}`"
                        class="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {{ service }}
                      </span>
                    </div>
                  </div>

                  <div class="mt-4">
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Natijalar
                    </p>
                    <div class="mt-2 space-y-2">
                      <div
                        v-for="outcome in selectedIptkFlowStep.outcomes"
                        :key="`${selectedIptkFlowStep.id}-${outcome}`"
                        class="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground"
                      >
                        {{ outcome }}
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedIptkStepGuides.length"
                    class="mt-5 rounded-2xl border border-border bg-card p-4"
                  >
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Shu bosqichdagi validatsiyalar
                    </p>
                    <div class="mt-3 space-y-3">
                      <div
                        v-for="guide in selectedIptkStepGuides"
                        :key="guide.id"
                        class="rounded-xl border border-border bg-background px-4 py-3"
                      >
                        <p class="text-sm font-semibold text-foreground">
                          {{ guide.title }}
                        </p>
                        <p class="mt-1 text-sm leading-6 text-muted-foreground">
                          {{ guide.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedIptkQuestionnaireGuides.length"
                    class="mt-5 rounded-2xl border border-border bg-card p-4"
                  >
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Savolnoma bo‘limlari
                    </p>
                    <div class="mt-3 space-y-3">
                      <div
                        v-for="section in selectedIptkQuestionnaireGuides"
                        :key="section.id"
                        class="rounded-xl border border-border bg-background px-4 py-3"
                      >
                        <p class="text-sm font-semibold text-foreground">
                          {{ section.title }}
                        </p>
                        <p class="mt-1 text-sm leading-6 text-muted-foreground">
                          {{ section.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="selectedIptkAssessmentGuides.length"
                    class="mt-5 rounded-2xl border border-border bg-card p-4"
                  >
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Baholash metodikalari
                    </p>
                    <div class="mt-3 space-y-3">
                      <div
                        v-for="assessment in selectedIptkAssessmentGuides"
                        :key="assessment.id"
                        class="rounded-xl border border-border bg-background px-4 py-3"
                      >
                        <p class="text-sm font-semibold text-foreground">
                          {{ assessment.title }}
                        </p>
                        <p class="mt-1 text-sm leading-6 text-muted-foreground">
                          {{ assessment.description }}
                        </p>
                        <div class="mt-3 rounded-lg border border-border bg-card px-3 py-2">
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Maqsadi
                          </p>
                          <p class="mt-1 text-sm leading-6 text-foreground">
                            {{ assessment.purpose }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 grid gap-4 xl:grid-cols-2">
                <div class="rounded-2xl border border-border bg-background p-4">
                  <p class="text-sm font-semibold text-foreground">
                    Validatsiyalar
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    Ariza yuborilishidan oldin va jarayon davomida ishlatiladigan asosiy tekshiruvlar.
                  </p>
                  <div class="mt-4 space-y-3">
                    <div
                      v-for="guide in iptkValidationGuides"
                      :key="guide.id"
                      class="rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <p class="text-sm font-semibold text-foreground">
                        {{ guide.title }}
                      </p>
                      <p class="mt-1 text-sm leading-6 text-muted-foreground">
                        {{ guide.description }}
                      </p>
                      <ul class="mt-3 space-y-2 text-sm text-foreground">
                        <li
                          v-for="item in guide.items"
                          :key="`${guide.id}-${item}`"
                          class="flex gap-2"
                        >
                          <span class="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                          <span class="leading-6">{{ item }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border border-border bg-background p-4">
                  <p class="text-sm font-semibold text-foreground">
                    Savolnoma shakli
                  </p>
                  <p class="mt-1 text-sm text-muted-foreground">
                    Elektron sўrovnomada foydalanuvchi to‘ldiradigan asosiy bo‘limlar va maydonlar.
                  </p>
                  <div class="mt-4 space-y-3">
                    <div
                      v-for="section in iptkQuestionnaireSections"
                      :key="section.id"
                      class="rounded-xl border border-border bg-card px-4 py-3"
                    >
                      <p class="text-sm font-semibold text-foreground">
                        {{ section.title }}
                      </p>
                      <p class="mt-1 text-sm leading-6 text-muted-foreground">
                        {{ section.description }}
                      </p>
                      <ul class="mt-3 space-y-2 text-sm text-foreground">
                        <li
                          v-for="field in section.fields"
                          :key="`${section.id}-${field}`"
                          class="flex gap-2"
                        >
                          <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span class="leading-6">{{ field }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 rounded-2xl border border-border bg-background p-4">
                <p class="text-sm font-semibold text-foreground">
                  Baholash metodikalari
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  IPTK va ishchi guruh baholashida qo‘llanadigan asosiy shkala va savolnomalar.
                </p>
                <div class="mt-4 grid gap-3 xl:grid-cols-3">
                  <div
                    v-for="assessment in iptkAssessmentGuides"
                    :key="assessment.id"
                    class="rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <p class="text-sm font-semibold text-foreground">
                      {{ assessment.title }}
                    </p>
                    <p class="mt-1 text-sm leading-6 text-muted-foreground">
                      {{ assessment.description }}
                    </p>
                    <div class="mt-3 rounded-lg border border-border bg-background px-3 py-2">
                      <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Maqsadi
                      </p>
                      <p class="mt-1 text-sm leading-6 text-foreground">
                        {{ assessment.purpose }}
                      </p>
                    </div>
                    <ul class="mt-3 space-y-2 text-sm text-foreground">
                      <li
                        v-for="item in assessment.usage"
                        :key="`${assessment.id}-${item}`"
                        class="flex gap-2"
                      >
                        <span class="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                        <span class="leading-6">{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="pageNotification"
        :class="[
          'fixed right-4 top-4 z-[70] flex max-w-sm items-start gap-3 overflow-hidden rounded-lg border px-4 py-3 text-sm shadow-lg',
          pageNotification.tone === 'success'
            ? 'border-emerald-200 bg-card text-foreground dark:border-emerald-900/60'
            : 'border-rose-200 bg-card text-foreground dark:border-rose-900/60',
        ]"
        @mouseenter="pauseNotificationCountdown"
        @mouseleave="resumeNotificationCountdown"
      >
        <div class="absolute inset-x-0 top-0 h-1 overflow-hidden rounded-t-lg bg-transparent">
          <div
            :class="[
              'h-full transition-[width] duration-200 ease-out',
              pageNotification.tone === 'success' ? 'bg-emerald-500' : 'bg-rose-500',
            ]"
            :style="{ width: `${notificationProgress}%` }"
          />
        </div>
        <div
          :class="[
            'mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full',
            pageNotification.tone === 'success' ? 'bg-emerald-600' : 'bg-rose-600',
          ]"
        />
        <div class="min-w-0 flex-1">
          <p class="font-semibold">{{ pageNotification.title }}</p>
          <p class="mt-1 text-muted-foreground">{{ pageNotification.description }}</p>
        </div>
        <button
          type="button"
          class="text-muted-foreground transition-colors duration-200 ease-out hover:text-foreground"
          @click="closeNotification"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div
        v-if="isTableLoading"
        class="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
          <span>Yuklanmoqda...</span>
        </div>
      </div>

      <SectionBlock
        :class="isApplicationsListPage
          ? 'flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-visible'
          : 'flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col overflow-hidden'"
        :content-class="isApplicationsListPage
          ? 'flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-visible p-5'
          : 'flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col space-y-4 overflow-hidden p-5'"
        :title="page.sectionTitle ?? ''"
        :description="page.sectionDescription ?? ''"
      >
        <template v-if="isApplicationsListPage">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              v-for="card in applicationStatusCards"
              :key="card.id"
              :class="card.tone"
            >
              <CardContent class="space-y-2 pt-4">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <span
                      :class="['h-2.5 w-2.5 rounded-full', card.badge]"
                    />
                    <p class="text-xs font-medium text-muted-foreground">
                      {{ card.title }}
                    </p>
                  </div>
                  <p class="text-lg font-semibold tracking-tight text-foreground">
                    {{ card.value }}
                  </p>
                </div>
                <div class="flex items-center justify-between border-t border-border pt-2 text-xs">
                  <span class="text-muted-foreground">Ulushi</span>
                  <span class="font-medium text-foreground">{{ card.share }}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="flex min-h-[74px] flex-col gap-3 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div class="relative w-full lg:max-w-sm">
              <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                :model-value="searchInput"
                placeholder="Qidirish"
                class="pl-9"
                @update:model-value="handleSearchInput"
              />
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Button
                v-if="isIptkApplicationsListPage"
                variant="outline"
                size="icon"
                class="h-10 w-10"
                aria-label="Umumiy flow"
                @click="openIptkFlowDialog"
              >
                <Info class="h-4 w-4" />
              </Button>
              <Button
                class="h-10 gap-2"
                @click="openCreateDialog"
              >
                <Plus class="h-4 w-4" />
                <span>Yaratish</span>
              </Button>
              <div
                ref="filterAnchorRef"
                class="relative"
              >
                <div
                  v-if="isFiltersOpen"
                  class="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm lg:hidden"
                  @click="closeFilters"
                />

                <Button
                  variant="outline"
                  :class="isFiltersOpen ? 'h-10 gap-2 border-ring bg-accent/40 ring-2 ring-ring/20' : 'h-10 gap-2'"
                  @click="toggleFiltersFromMenu(!isFiltersOpen)"
                >
                  <span
                    v-if="activeFilterCount > 0"
                    class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold leading-none text-primary-foreground"
                  >
                    {{ activeFilterCount }}
                  </span>
                  <Filter
                    v-else
                    class="h-4 w-4"
                  />
                  <span>Filter</span>
                </Button>

                <div
                  v-if="isFiltersOpen"
                  class="fixed inset-x-3 top-24 z-50 overflow-hidden rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl outline-none max-xl:max-h-[calc(100vh-7rem)] xl:absolute xl:right-0 xl:top-[calc(100%+0.4rem)] xl:w-[17.5rem] xl:-translate-x-6 xl:origin-top-right"
                >
                  <div
                    class="flex flex-col gap-3 overflow-y-auto p-4 xl:gap-3 xl:p-3.5"
                    :style="filterPanelBodyStyle"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <p class="text-sm font-semibold text-foreground">
                        Filterlar
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-8 w-8 p-0"
                        aria-label="Filterni yopish"
                        @click="closeFilters"
                      >
                        <X class="h-4 w-4" />
                      </Button>
                    </div>

                    <div class="flex flex-col gap-3">
                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Status</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                              openFilterField === 'status'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            @click="toggleFilterField('status')"
                          >
                            <span>{{ draftStatusLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out',
                                openFilterField === 'status' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'status'"
                            class="overflow-hidden rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectStatusFilter('all')"
                            >
                              <span>Barchasi</span>
                              <Check
                                v-if="draftStatusFilter === 'all'"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                            <button
                              v-for="status in demoStatuses"
                              :key="status"
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectStatusFilter(status)"
                            >
                              <span>{{ status }}</span>
                              <Check
                                v-if="draftStatusFilter === status"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                          </div>
                        </div>
                      </label>

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Viloyat</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                              openFilterField === 'region'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            @click="toggleFilterField('region')"
                          >
                            <span class="truncate">{{ draftRegionLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                                openFilterField === 'region' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'region'"
                            class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectRegionFilter('all')"
                            >
                              <span>Barchasi</span>
                              <Check
                                v-if="draftRegionFilter === 'all'"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                            <button
                              v-for="region in regionOptions"
                              :key="region"
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectRegionFilter(region)"
                            >
                              <span class="truncate">{{ region }}</span>
                              <Check
                                v-if="draftRegionFilter === region"
                                class="h-4 w-4 shrink-0 text-primary"
                              />
                            </button>
                          </div>
                        </div>
                      </label>

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Tuman yoki shahar</span>
                        <div class="space-y-2 lg:mt-2 lg:space-y-0">
                          <button
                            type="button"
                            :class="[
                              'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                              openFilterField === 'district'
                                ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                                : 'border-input hover:border-ring',
                            ]"
                            :disabled="!isDistrictFilterEnabled"
                            @click="toggleFilterField('district')"
                          >
                            <span class="truncate">{{ draftDistrictLabel }}</span>
                            <ChevronDown
                              :class="[
                                'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                                openFilterField === 'district' ? 'rotate-180' : '',
                              ]"
                            />
                          </button>

                          <div
                            v-if="openFilterField === 'district' && isDistrictFilterEnabled && districtOptions.length"
                            class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <button
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectDistrictFilter('all')"
                            >
                              <span>Barchasi</span>
                              <Check
                                v-if="draftDistrictFilter === 'all'"
                                class="h-4 w-4 text-primary"
                              />
                            </button>
                            <button
                              v-for="district in districtOptions"
                              :key="district"
                              type="button"
                              class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                              @click.stop.prevent="selectDistrictFilter(district)"
                            >
                              <span class="truncate">{{ district }}</span>
                              <Check
                                v-if="draftDistrictFilter === district"
                                class="h-4 w-4 shrink-0 text-primary"
                              />
                            </button>
                          </div>
                        </div>
                      </label>

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Boshlanish sanasi</span>
                        <div class="relative space-y-2 lg:mt-2 lg:space-y-0">
                          <div class="relative">
                            <Input
                              class="h-10 pr-10"
                              placeholder="dd.mm.yyyy"
                              :model-value="formatFilterDateForInput(draftStartDateFilter)"
                              @update:model-value="handleStartDateFilterChange"
                            />
                            <button
                              type="button"
                              class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                              aria-label="Boshlanish sanasini tanlash"
                              @click="openCalendar('start')"
                            >
                              <CalendarDays class="h-4 w-4" />
                            </button>
                          </div>

                          <div
                            v-if="openCalendarField === 'start'"
                            class="rounded-lg border border-border bg-background p-3 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <div class="mb-3 flex items-center justify-between gap-2">
                              <div class="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Oldingi yil"
                                  @click="shiftCalendarYear(-1)"
                                >
                                  <ChevronsLeft class="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Oldingi oy"
                                  @click="shiftCalendarMonth(-1)"
                                >
                                  <ChevronLeft class="h-4 w-4" />
                                </Button>
                              </div>
                              <p class="text-sm font-medium capitalize text-foreground">
                                {{ calendarMonthLabel }}
                              </p>
                              <div class="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Keyingi oy"
                                  @click="shiftCalendarMonth(1)"
                                >
                                  <ChevronRight class="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Keyingi yil"
                                  @click="shiftCalendarYear(1)"
                                >
                                  <ChevronsRight class="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                              <span
                                v-for="weekday in calendarWeekdays"
                                :key="weekday"
                                class="py-1"
                              >
                                {{ weekday }}
                              </span>
                            </div>

                            <div class="grid grid-cols-7 gap-1">
                              <button
                                v-for="day in calendarDays"
                                :key="day.key"
                                type="button"
                                class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                                :class="day.isCurrentMonth
                                  ? isCalendarDateSelected(day.value)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-foreground hover:bg-muted'
                                  : 'pointer-events-none opacity-0'"
                                :disabled="!day.isCurrentMonth"
                                @click="selectCalendarDate('start', day.value)"
                              >
                                {{ day.label }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </label>

                      <label class="space-y-2 text-sm lg:relative lg:space-y-0">
                        <span class="font-medium text-foreground">Tugash sanasi</span>
                        <div class="relative space-y-2 lg:mt-2 lg:space-y-0">
                          <div class="relative">
                            <Input
                              class="h-10 pr-10"
                              placeholder="dd.mm.yyyy"
                              :model-value="formatFilterDateForInput(draftEndDateFilter)"
                              @update:model-value="handleEndDateFilterChange"
                            />
                            <button
                              type="button"
                              class="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors duration-200 ease-out hover:bg-muted/80 hover:text-foreground"
                              aria-label="Tugash sanasini tanlash"
                              @click="openCalendar('end')"
                            >
                              <CalendarDays class="h-4 w-4" />
                            </button>
                          </div>

                          <div
                            v-if="openCalendarField === 'end'"
                            class="rounded-lg border border-border bg-background p-3 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                          >
                            <div class="mb-3 flex items-center justify-between gap-2">
                              <div class="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Oldingi yil"
                                  @click="shiftCalendarYear(-1)"
                                >
                                  <ChevronsLeft class="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Oldingi oy"
                                  @click="shiftCalendarMonth(-1)"
                                >
                                  <ChevronLeft class="h-4 w-4" />
                                </Button>
                              </div>
                              <p class="text-sm font-medium capitalize text-foreground">
                                {{ calendarMonthLabel }}
                              </p>
                              <div class="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Keyingi oy"
                                  @click="shiftCalendarMonth(1)"
                                >
                                  <ChevronRight class="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  class="h-8 w-8 p-0"
                                  aria-label="Keyingi yil"
                                  @click="shiftCalendarYear(1)"
                                >
                                  <ChevronsRight class="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div class="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                              <span
                                v-for="weekday in calendarWeekdays"
                                :key="weekday"
                                class="py-1"
                              >
                                {{ weekday }}
                              </span>
                            </div>

                            <div class="grid grid-cols-7 gap-1">
                              <button
                                v-for="day in calendarDays"
                                :key="day.key"
                                type="button"
                                class="flex h-8 items-center justify-center rounded-md text-sm transition-colors duration-200 ease-out"
                                :class="day.isCurrentMonth
                                  ? isCalendarDateSelected(day.value)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-foreground hover:bg-muted'
                                  : 'pointer-events-none opacity-0'"
                                :disabled="!day.isCurrentMonth"
                                @click="selectCalendarDate('end', day.value)"
                              >
                                {{ day.label }}
                              </button>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div class="flex items-center justify-end gap-2 border-t border-border pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        :disabled="!hasActiveFilters && !hasPendingFilterChanges"
                        @click="clearFilters"
                      >
                        Tozalash
                      </Button>
                      <Button
                        size="sm"
                        :disabled="!hasPendingFilterChanges"
                        @click="applyFilters"
                      >
                        Qo'llash
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                class="h-10 gap-2"
                :disabled="isExporting"
                @click="downloadApplicationsAsExcel"
              >
                <div
                  v-if="isExporting"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
                />
                <Download
                  v-else
                  class="h-4 w-4"
                />
                <span>Yuklab olish</span>
              </Button>
            </div>
          </div>

          <div class="flex min-h-[22rem] min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-card xl:min-h-0 xl:flex-1">
            <div class="flex min-h-0 min-w-0 max-w-full flex-1 flex-col">
              <div class="flex-1 xl:hidden">
                <div
                  v-if="paginatedRows.length === 0"
                  class="flex min-h-[18rem] items-center justify-center px-4 py-10 text-center"
                >
                  <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                    <p class="text-sm font-medium text-foreground">
                      Ma'lumot topilmadi
                    </p>
                    <p class="text-sm text-muted-foreground">
                      Qidiruv yoki filter shartlariga mos yozuv topilmadi.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      class="mt-2"
                      @click="clearSearchAndFilters"
                    >
                      Tozalash
                    </Button>
                  </div>
                </div>

                <div
                  v-else
                  class="grid grid-cols-1 gap-3 p-4 md:grid-cols-2"
                >
                  <Card
                    v-for="row in paginatedRows"
                    :key="row.id"
                    class="border-border"
                  >
                    <CardContent class="space-y-4 p-4">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Ariza
                          </p>
                          <p class="mt-1 font-semibold text-foreground">
                            {{ row.id }}
                          </p>
                          <p class="mt-1 text-sm text-muted-foreground">
                            {{ row.date }}
                          </p>
                        </div>

                        <div class="flex items-center gap-2">
                          <span
                            :class="[
                              'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                              row.statusClass,
                            ]"
                          >
                            {{ row.status }}
                          </span>

                          <DropdownMenuRoot @update:open="setActionMenuOpen(row.id, $event)">
                            <DropdownMenuTrigger as-child>
                              <Button
                                variant="outline"
                                size="sm"
                                :class="openActionMenuId === row.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                              >
                                <Ellipsis class="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuPortal>
                              <DropdownMenuContent
                                side="bottom"
                                align="end"
                                :side-offset="6"
                                :collision-padding="12"
                                class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                              >
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                  @click="openViewDialog(row)"
                                >
                                  <Eye class="h-4 w-4 shrink-0" />
                                  <span>Ko'rish</span>
                                </DropdownMenuItem>
                                <template v-if="row.status === 'Jarayonda'">
                                  <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                    <FilePenLine class="h-4 w-4 shrink-0" />
                                    <span>Tahrirlash</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                    @click="confirmApprove(row)"
                                  >
                                    <Check class="h-4 w-4 shrink-0" />
                                    <span>Tasdiqlash</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                    @click="confirmReject(row)"
                                  >
                                    <X class="h-4 w-4 shrink-0" />
                                    <span>Bekor qilish</span>
                                  </DropdownMenuItem>
                                </template>
                                <DropdownMenuItem
                                  v-if="row.status === 'Tasdiqlangan'"
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                >
                                  <Trash2 class="h-4 w-4 shrink-0" />
                                  <span>Bekor qilish</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenuPortal>
                          </DropdownMenuRoot>
                        </div>
                      </div>

                      <div class="grid gap-3 text-sm">
                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Xizmat oluvchi
                          </p>
                          <p class="mt-1 font-medium uppercase text-foreground">
                            {{ row.fullName }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            {{ row.pinfl }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Xizmat turi
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ row.serviceType }}
                          </p>
                        </div>

                        <div>
                          <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            Manzil
                          </p>
                          <p class="mt-1 font-medium text-foreground">
                            {{ row.region }}
                          </p>
                          <p class="mt-1 text-muted-foreground">
                            {{ row.district }}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div class="hidden min-h-0 min-w-0 max-w-full flex-1 overflow-x-auto overflow-y-hidden [touch-action:pan-x_pan-y] xl:block xl:overflow-auto xl:[overscroll-behavior:contain]">
                <table class="min-w-[1260px] border-separate border-spacing-0 text-sm xl:min-w-full">
                  <thead class="sticky top-0 z-10 bg-card text-left text-muted-foreground">
                    <tr>
                      <th class="rounded-tl-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Amallar</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Ariza</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Xizmat oluvchi</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Xizmat turi</th>
                      <th class="border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Manzil</th>
                      <th class="rounded-tr-lg border-b-2 border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                <tbody>
                  <tr v-if="paginatedRows.length === 0">
                    <td
                      colspan="6"
                      class="border-b border-border px-4 py-12 text-center"
                    >
                      <div class="mx-auto flex max-w-md flex-col items-center gap-2">
                        <p class="text-sm font-medium text-foreground">
                          Ma'lumot topilmadi
                        </p>
                        <p class="text-sm text-muted-foreground">
                          Qidiruv yoki filter shartlariga mos yozuv topilmadi.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          class="mt-2"
                          @click="clearSearchAndFilters"
                        >
                          Tozalash
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="row in paginatedRows"
                    :key="row.id"
                    class="transition-colors duration-200 ease-out hover:bg-muted/30"
                  >
                      <td class="border-b border-border px-4 py-3 align-top">
                        <DropdownMenuRoot @update:open="setActionMenuOpen(row.id, $event)">
                          <DropdownMenuTrigger as-child>
                            <Button
                              variant="outline"
                              size="sm"
                              :class="openActionMenuId === row.id ? 'h-8 w-8 rounded-md border-ring bg-accent/40 p-0 ring-2 ring-ring/20' : 'h-8 w-8 rounded-md p-0'"
                            >
                              <Ellipsis class="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuContent
                              side="right"
                              align="start"
                              :side-offset="6"
                              :collision-padding="12"
                              class="z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                            >
                              <DropdownMenuItem
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                @click="openViewDialog(row)"
                              >
                                <Eye class="h-4 w-4 shrink-0" />
                                <span>Ko'rish</span>
                              </DropdownMenuItem>
                              <template v-if="row.status === 'Jarayonda'">
                                <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted">
                                  <FilePenLine class="h-4 w-4 shrink-0" />
                                  <span>Tahrirlash</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none hover:bg-muted"
                                  @click="confirmApprove(row)"
                                >
                                  <Check class="h-4 w-4 shrink-0" />
                                  <span>Tasdiqlash</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                                  @click="confirmReject(row)"
                                >
                                  <X class="h-4 w-4 shrink-0" />
                                  <span>Bekor qilish</span>
                                </DropdownMenuItem>
                              </template>
                              <DropdownMenuItem
                                v-if="row.status === 'Tasdiqlangan'"
                                class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-sm text-destructive outline-none hover:bg-muted"
                              >
                                <Trash2 class="h-4 w-4 shrink-0" />
                                <span>Bekor qilish</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenuPortal>
                        </DropdownMenuRoot>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium text-foreground">
                          {{ row.id }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.date }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium uppercase text-foreground">
                          {{ row.fullName }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.pinfl }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="max-w-[320px] font-medium text-foreground">
                          {{ row.serviceType }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <div class="font-medium text-foreground">
                          {{ row.region }}
                        </div>
                        <div class="mt-1 text-muted-foreground">
                          {{ row.district }}
                        </div>
                      </td>
                      <td class="border-b border-border px-4 py-3 align-top">
                        <span
                          :class="[
                            'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                            row.statusClass,
                          ]"
                        >
                          {{ row.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div
                ref="paginationRef"
                class="flex flex-col gap-3 border-t border-border px-4 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div class="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-2">
                  <div class="flex items-center gap-2">
                    <span class="text-muted-foreground">Qatorlar soni</span>
                    <DropdownMenuRoot @update:open="setRowsPerPageOpen($event)">
                      <DropdownMenuTrigger as-child>
                        <Button
                          variant="outline"
                          size="sm"
                          :class="isRowsPerPageOpen ? 'h-8 gap-1.5 rounded-md border-ring bg-accent/40 px-2.5 text-sm ring-2 ring-ring/20' : 'h-8 gap-1.5 rounded-md px-2.5 text-sm'"
                        >
                          <span>{{ selectedRowsPerPage }}</span>
                          <ChevronRight class="h-4 w-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          align="start"
                          :side-offset="6"
                          class="z-50 w-[var(--reka-dropdown-menu-trigger-width)] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none"
                        >
                          <DropdownMenuItem
                            v-for="option in rowsPerPageOptions"
                            :key="option"
                            class="cursor-pointer rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted"
                            @select.prevent="setRowsPerPage(option)"
                          >
                            <span :class="option === selectedRowsPerPage ? 'font-semibold text-foreground' : 'text-foreground'">
                              {{ option }}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-muted-foreground">Sahifada:</span>
                    <span class="font-medium text-foreground">{{ paginationSummary }}</span>
                  </div>
                </div>

                <div class="inline-flex h-9 w-full items-center justify-between gap-1 rounded-lg border border-border bg-background p-0.5 min-[480px]:w-auto min-[480px]:justify-start">
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 rounded-md p-0 self-center"
                    :disabled="isTableLoading || currentPage === 1"
                    @click="goToPage(1)"
                  >
                    <ChevronsLeft class="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 rounded-md p-0 self-center"
                    :disabled="isTableLoading || currentPage === 1"
                    @click="goToPage(currentPage - 1)"
                  >
                    <ChevronLeft class="h-5 w-5" />
                  </Button>
                  <div class="mx-1 flex h-7 min-w-14 items-center justify-center text-center text-sm font-semibold text-foreground">
                    {{ currentPageSummary }}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 rounded-md p-0 self-center"
                    :disabled="isTableLoading || currentPage === totalPages"
                    @click="goToPage(currentPage + 1)"
                  >
                    <ChevronRight class="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    class="h-7 w-7 rounded-md p-0 self-center"
                    :disabled="isTableLoading || currentPage === totalPages"
                    @click="goToPage(totalPages)"
                  >
                    <ChevronsRight class="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <EmptyState
          v-else
          title="Content will be added here later"
          description="This module is prepared for future implementation."
        />
      </SectionBlock>
    </div>

  </PageContainer>

  <div
    v-if="isCreateDialogOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/50 px-4 py-6 backdrop-blur-sm"
    @click.self="closeCreateDialog"
  >
    <div class="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
      <div class="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <p class="text-lg font-semibold text-foreground">
          Yangi ariza yaratish
        </p>

        <Button
          variant="ghost"
          size="sm"
          class="h-9 w-9 p-0"
          aria-label="Oynani yopish"
          @click="closeCreateDialog"
        >
          <X class="h-4 w-4" />
        </Button>
      </div>

      <div class="max-h-[calc(100vh-6rem)] space-y-6 overflow-y-auto p-5">
        <p class="text-base font-semibold text-foreground">
          Arizachi
        </p>

        <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <label class="space-y-2">
            <span class="text-sm font-medium text-foreground">JSHSHIR</span>
            <Input
              :model-value="applicantPinflInput"
              inputmode="numeric"
              maxlength="14"
              autocomplete="off"
              placeholder="JSHSHIR kiriting"
              class="h-11"
              @update:model-value="updateApplicantPinfl(String($event))"
              @keydown="handlePinflKeydown"
              @keydown.enter.prevent="lookupApplicant"
              @paste="handleApplicantPinflPaste"
            />
          </label>

          <Button
            class="gap-2"
            :disabled="isApplicantLookupLoading"
            @click="lookupApplicant"
          >
            <div
              v-if="isApplicantLookupLoading"
              class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
            />
            <Search
              v-else
              class="h-4 w-4"
            />
            <span>Qidiruv</span>
          </Button>
        </div>

        <p
          v-if="applicantLookupError"
          class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {{ applicantLookupError }}
        </p>

        <div
          v-if="applicantLookupResult"
          class="grid gap-4 rounded-2xl border border-border bg-muted/20 p-4 md:grid-cols-[136px_1fr]"
        >
          <div class="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-3 py-4">
            <img
              :src="applicantImage"
              alt="Arizachi rasmi"
              class="h-28 w-20 rounded-2xl border border-border/60 object-cover"
            >
            <p class="mt-2 text-center text-sm text-muted-foreground">
              Rasm
            </p>
          </div>

          <div class="overflow-hidden rounded-2xl border border-border bg-card">
            <table class="w-full border-collapse text-sm">
              <tbody>
                <tr
                  v-for="[label, value] in applicantLookupRows"
                  :key="label"
                  class="border-b border-border last:border-b-0"
                >
                  <td class="w-40 bg-muted/40 px-4 py-3 font-medium text-muted-foreground">
                    {{ label }}
                  </td>
                  <td class="px-4 py-3 text-foreground">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          v-if="applicantLookupResult"
          class="space-y-3 rounded-xl border border-border/70 bg-card p-4"
        >
          <label class="flex items-start gap-3 text-sm text-foreground">
            <input
              v-model="hasApplicantCustomResidenceAddress"
              type="checkbox"
              class="mt-0.5 h-4 w-4 rounded border-input accent-primary"
            >
            <span>Arizachining yashash manzili amaldagi manzildan farq qiladi</span>
          </label>

          <label
            v-if="hasApplicantCustomResidenceAddress"
            class="space-y-2"
          >
            <span class="text-sm font-medium text-foreground">Amaldagi yashash manzili</span>

            <div class="grid gap-3 md:grid-cols-3">
              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">Viloyat</span>
                <button
                  type="button"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                    openCreateAddressField === 'applicant-region'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('applicant-region')"
                >
                  <span class="truncate">{{ applicantCustomResidenceRegionLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'applicant-region' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'applicant-region'"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="region in applicantCustomResidenceRegionOptions"
                    :key="region"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleApplicantCustomResidenceRegionChange(region)"
                  >
                    <span class="truncate">{{ region }}</span>
                    <Check
                      v-if="applicantCustomResidenceRegion === region"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>

              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">Tuman</span>
                <button
                  type="button"
                  :disabled="!applicantCustomResidenceRegion"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                    openCreateAddressField === 'applicant-district'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('applicant-district')"
                >
                  <span class="truncate">{{ applicantCustomResidenceDistrictLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'applicant-district' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'applicant-district' && applicantCustomResidenceRegion"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="district in applicantCustomResidenceDistrictOptions"
                    :key="district"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleApplicantCustomResidenceDistrictChange(district)"
                  >
                    <span class="truncate">{{ district }}</span>
                    <Check
                      v-if="applicantCustomResidenceDistrict === district"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>

              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">MFY</span>
                <button
                  type="button"
                  :disabled="!applicantCustomResidenceDistrict"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                    openCreateAddressField === 'applicant-mfy'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('applicant-mfy')"
                >
                  <span class="truncate">{{ applicantCustomResidenceMfyLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'applicant-mfy' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'applicant-mfy' && applicantCustomResidenceDistrict"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="mfy in demoMahallas"
                    :key="mfy"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleApplicantCustomResidenceMfyChange(mfy)"
                  >
                    <span class="truncate">{{ mfy }}</span>
                    <Check
                      v-if="applicantCustomResidenceMfy === mfy"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>
            </div>

            <label class="space-y-2">
              <span class="text-sm text-muted-foreground">To‘liq manzil</span>
              <Input
                :model-value="applicantCustomResidenceAddress"
                placeholder="Uy, ko‘cha va boshqa manzil tafsilotlarini kiriting"
                class="h-10"
                @update:model-value="applicantCustomResidenceAddress = String($event)"
              />
            </label>
          </label>
        </div>

        <div
          v-if="applicantLookupResult"
          class="space-y-4 border-t border-border pt-5"
        >
          <p class="text-base font-semibold text-foreground">
            Xizmat oluvchi
          </p>

          <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
            <label class="space-y-2">
              <span class="text-sm font-medium text-foreground">JSHSHIR</span>
              <Input
                :model-value="serviceRecipientPinflInput"
                inputmode="numeric"
                maxlength="14"
                autocomplete="off"
                placeholder="JSHSHIR kiriting"
                class="h-11"
                @update:model-value="updateServiceRecipientPinfl(String($event))"
                @keydown="handlePinflKeydown"
                @keydown.enter.prevent="lookupServiceRecipient"
                @paste="handleServiceRecipientPinflPaste"
              />
            </label>

            <Button
              class="gap-2"
              :disabled="isServiceRecipientLookupLoading"
              @click="lookupServiceRecipient"
            >
              <div
                v-if="isServiceRecipientLookupLoading"
                class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
              />
              <Search
                v-else
                class="h-4 w-4"
              />
              <span>Qidiruv</span>
            </Button>
          </div>

          <p
            v-if="serviceRecipientLookupError"
            class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {{ serviceRecipientLookupError }}
          </p>

          <div
            v-if="serviceRecipientLookupResult"
            class="grid gap-4 rounded-2xl border border-border bg-muted/20 p-4 md:grid-cols-[136px_1fr]"
          >
            <div class="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-4 py-5">
              <div class="flex h-28 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-primary/5">
                <img
                  v-if="serviceRecipientPhotoPreview"
                  :src="serviceRecipientPhotoPreview"
                  alt="Xizmat oluvchi rasmi"
                  class="h-full w-full object-cover"
                >
                <div
                  v-else
                  class="flex h-full w-full items-center justify-center bg-primary/10 text-2xl font-semibold text-primary"
                >
                  {{ serviceRecipientInitials }}
                </div>
              </div>
              <label class="mt-3 inline-flex cursor-pointer items-center rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors duration-200 ease-out hover:bg-accent/40">
                <span>{{ serviceRecipientPhotoPreview ? 'Rasmni almashtirish' : 'Rasm yuklash' }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="sr-only"
                  @change="handleServiceRecipientPhotoUpload"
                >
              </label>
              <p class="mt-2 max-w-full truncate text-center text-xs text-muted-foreground">
                {{ serviceRecipientPhotoName || 'Rasm yuklanmagan' }}
              </p>
            </div>

            <div class="overflow-hidden rounded-2xl border border-border bg-card">
              <table class="w-full border-collapse text-sm">
                <tbody>
                  <tr
                    v-for="[label, value] in serviceRecipientLookupRows"
                    :key="label"
                    class="border-b border-border last:border-b-0"
                  >
                    <td class="w-40 bg-muted/40 px-4 py-3 font-medium text-muted-foreground">
                      {{ label }}
                    </td>
                    <td class="px-4 py-3 text-foreground">
                      {{ value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            v-if="serviceRecipientLookupResult"
            class="space-y-3 rounded-xl border border-border/70 bg-card p-4"
          >
            <label class="flex items-start gap-3 text-sm text-foreground">
              <input
                v-model="hasServiceRecipientCustomResidenceAddress"
                type="checkbox"
                class="mt-0.5 h-4 w-4 rounded border-input accent-primary"
              >
              <span>Xizmat oluvchining yashash manzili amaldagi manzildan farq qiladi</span>
            </label>

          <label
            v-if="hasServiceRecipientCustomResidenceAddress"
            class="space-y-2"
          >
            <span class="text-sm font-medium text-foreground">Amaldagi yashash manzili</span>

            <div class="grid gap-3 md:grid-cols-3">
              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">Viloyat</span>
                <button
                  type="button"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                    openCreateAddressField === 'recipient-region'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('recipient-region')"
                >
                  <span class="truncate">{{ serviceRecipientCustomResidenceRegionLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'recipient-region' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'recipient-region'"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="region in serviceRecipientCustomResidenceRegionOptions"
                    :key="region"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleServiceRecipientCustomResidenceRegionChange(region)"
                  >
                    <span class="truncate">{{ region }}</span>
                    <Check
                      v-if="serviceRecipientCustomResidenceRegion === region"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>

              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">Tuman</span>
                <button
                  type="button"
                  :disabled="!serviceRecipientCustomResidenceRegion"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                    openCreateAddressField === 'recipient-district'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('recipient-district')"
                >
                  <span class="truncate">{{ serviceRecipientCustomResidenceDistrictLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'recipient-district' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'recipient-district' && serviceRecipientCustomResidenceRegion"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="district in serviceRecipientCustomResidenceDistrictOptions"
                    :key="district"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleServiceRecipientCustomResidenceDistrictChange(district)"
                  >
                    <span class="truncate">{{ district }}</span>
                    <Check
                      v-if="serviceRecipientCustomResidenceDistrict === district"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>

              <label class="space-y-2 lg:relative">
                <span class="text-sm text-muted-foreground">MFY</span>
                <button
                  type="button"
                  :disabled="!serviceRecipientCustomResidenceDistrict"
                  :class="[
                    'flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 text-sm text-foreground outline-none transition-colors duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60',
                    openCreateAddressField === 'recipient-mfy'
                      ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                      : 'border-input hover:border-ring',
                  ]"
                  @click="toggleCreateAddressField('recipient-mfy')"
                >
                  <span class="truncate">{{ serviceRecipientCustomResidenceMfyLabel }}</span>
                  <ChevronDown
                    :class="[
                      'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                      openCreateAddressField === 'recipient-mfy' ? 'rotate-180' : '',
                    ]"
                  />
                </button>
                <div
                  v-if="openCreateAddressField === 'recipient-mfy' && serviceRecipientCustomResidenceDistrict"
                  class="max-h-56 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20"
                >
                  <button
                    v-for="mfy in demoMahallas"
                    :key="mfy"
                    type="button"
                    class="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm text-foreground transition-colors duration-200 ease-out hover:bg-muted/80"
                    @click.stop.prevent="handleServiceRecipientCustomResidenceMfyChange(mfy)"
                  >
                    <span class="truncate">{{ mfy }}</span>
                    <Check
                      v-if="serviceRecipientCustomResidenceMfy === mfy"
                      class="h-4 w-4 shrink-0 text-primary"
                    />
                  </button>
                </div>
              </label>
            </div>

            <label class="space-y-2">
              <span class="text-sm text-muted-foreground">To‘liq manzil</span>
              <Input
                :model-value="serviceRecipientCustomResidenceAddress"
                placeholder="Uy, ko‘cha va boshqa manzil tafsilotlarini kiriting"
                class="h-10"
                @update:model-value="serviceRecipientCustomResidenceAddress = String($event)"
              />
            </label>
          </label>
        </div>
        </div>

        <div
          v-if="serviceRecipientLookupResult"
          class="space-y-4 border-t border-border pt-5"
        >
          <div class="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p class="text-sm font-semibold text-foreground">
                  Tashxis va nogironlik guruhi tekshirildi
                </p>
                <p class="mt-1 text-sm text-muted-foreground">
                  Aniqlangan ma’lumotlarga ko‘ra faqat mos xizmatlarni tanlash mumkin.
                </p>
              </div>
              <span class="inline-flex items-center rounded-full border border-primary/20 bg-background px-3 py-1 text-xs font-semibold text-primary">
                Mos xizmatlar: {{ eligibleServiceCount }} ta
              </span>
            </div>

            <div class="mt-4 grid gap-3 md:grid-cols-2">
              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Aniqlangan tashxis
                </p>
                <p class="mt-2 text-sm font-medium text-foreground">
                  {{ serviceRecipientLookupResult.diagnosisLabel }} ({{ serviceRecipientLookupResult.diagnosisCode }})
                </p>
              </div>

              <div class="rounded-xl border border-border bg-background px-4 py-3">
                <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Aniqlangan nogironlik guruhi
                </p>
                <p class="mt-2 text-sm font-medium text-foreground">
                  {{ serviceRecipientLookupResult.disabilityGroup }}
                </p>
              </div>
            </div>
          </div>

          <p class="text-base font-semibold text-foreground">
            Xizmat turini tanlash
          </p>

          <div class="rounded-xl border border-border/70 bg-card p-4">
            <label class="space-y-2 lg:relative">
              <span class="text-sm font-medium text-foreground">Xizmat turi</span>
              <button
                type="button"
                :class="[
                  'flex h-11 w-full items-center justify-between rounded-md border bg-background px-3 text-left text-sm text-foreground outline-none transition-colors duration-200 ease-out',
                  openCreateAddressField === 'service-option'
                    ? 'border-ring bg-accent/40 ring-2 ring-ring/20'
                    : 'border-input hover:border-ring',
                ]"
                @click="toggleCreateAddressField('service-option')"
              >
                <span class="truncate">{{ selectedServiceOptionLabel }}</span>
                <ChevronDown
                  :class="[
                    'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out',
                    openCreateAddressField === 'service-option' ? 'rotate-180' : '',
                  ]"
                />
              </button>

              <div
                v-if="openCreateAddressField === 'service-option'"
                class="mt-2 max-h-72 overflow-auto rounded-md border border-border bg-background p-1 shadow-sm lg:absolute lg:left-0 lg:right-0 lg:top-[calc(100%+0.5rem)] lg:z-20 lg:mt-0"
              >
                <button
                  v-for="service in serviceEligibilityOptions"
                  :key="service.id"
                  type="button"
                  :disabled="!service.eligible"
                  :class="[
                    'flex w-full items-start justify-between gap-3 rounded-sm px-3 py-2 text-left text-sm transition-colors duration-200 ease-out',
                    service.eligible
                      ? 'text-foreground hover:bg-muted/80'
                      : 'cursor-not-allowed text-muted-foreground opacity-80',
                  ]"
                  @click.stop.prevent="handleServiceOptionChange(service.id)"
                >
                  <div class="min-w-0 flex-1">
                    <span class="block leading-6">{{ service.label }}</span>
                    <p
                      v-if="service.eligible"
                      class="mt-1 text-xs text-emerald-600"
                    >
                      Mos keladi
                    </p>
                    <div
                      v-else
                      class="mt-1 space-y-1"
                    >
                      <p
                        v-for="reason in service.reasons"
                        :key="`${service.id}-${reason}`"
                        class="text-xs leading-5 text-rose-600"
                      >
                        {{ reason }}
                      </p>
                    </div>
                  </div>
                  <Check
                    v-if="selectedServiceOptionId === service.id"
                    class="mt-1 h-4 w-4 shrink-0 text-primary"
                  />
                </button>
              </div>
            </label>
          </div>

          <p
            v-if="selectedServiceEligibility && !selectedServiceEligibility.eligible"
            class="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            {{ selectedServiceEligibility.reasons.join(' ') }}
          </p>
        </div>

        <div
          v-if="serviceRecipientLookupResult && selectedServiceOptionId"
          class="space-y-4 border-t border-border pt-5"
        >
          <p class="text-base font-semibold text-foreground">
            Tibbiy hujjatlarni yuklash
          </p>

          <div class="grid gap-3">
            <div
              v-for="document in activeMedicalDocumentFields"
              :key="document.id"
              class="rounded-xl border border-border bg-card p-3"
            >
              <span class="block text-sm font-medium text-foreground">
                {{ document.label }}
              </span>
              <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span class="truncate text-sm text-muted-foreground">
                  {{ uploadedMedicalDocuments[document.id] || 'Fayl tanlanmagan' }}
                </span>
                <label class="inline-flex cursor-pointer items-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 ease-out hover:bg-accent/40">
                  <span>Fayl tanlash</span>
                  <input
                    type="file"
                    class="sr-only"
                    @change="handleMedicalDocumentUpload(document.id, $event)"
                  >
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="serviceRecipientLookupResult"
          class="space-y-4 border-t border-border pt-5"
        >
          <p class="text-base font-semibold text-foreground">
            SMS-kod orqali tasdiqlash
          </p>
          <p class="text-sm leading-6 text-muted-foreground">
            SMS-kod bilan tasdiqlash arizachi tomonidan so‘rovnomaning tasdiqlanishi hisoblanadi va u hamda nogironligi bo‘lgan shaxsga tegishli shaxsga doir ma’lumotlarni olish va ishlov berishga rozilikni bildiradi.
          </p>

          <div class="space-y-3 rounded-xl border border-border/70 bg-card p-4">
            <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,220px)_190px] md:items-end">
              <label class="space-y-2">
                <span class="text-sm font-medium text-foreground">Telefon raqami</span>
                <div class="flex h-11 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
                  <span class="flex h-full items-center border-r border-border px-3 text-sm font-medium text-foreground">
                    +998
                  </span>
                  <Input
                    :model-value="smsPhoneNumber"
                    inputmode="numeric"
                    maxlength="9"
                    autocomplete="off"
                    placeholder="90 123 45 67"
                    class="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
                    @update:model-value="updateSmsPhoneNumber(String($event))"
                    @keydown="handlePinflKeydown"
                  />
                </div>
              </label>

              <label class="block space-y-2">
                <span class="text-sm font-medium text-foreground">SMS-kod</span>
                <Input
                  :model-value="smsCodeInput"
                  inputmode="numeric"
                  maxlength="6"
                  autocomplete="off"
                  placeholder="000000"
                  class="h-11 text-center text-base tracking-[0.35em]"
                  @update:model-value="smsCodeInput = String($event).replace(/\D/g, '').slice(0, 6)"
                  @keydown="handlePinflKeydown"
                />
              </label>

              <Button
                class="h-11 w-full gap-2"
                :disabled="smsResendCountdown > 0"
                @click="sendSmsCode"
              >
                <span>{{ smsResendCountdown > 0 ? `${smsResendCountdown}s` : 'SMS-kod yuborish' }}</span>
              </Button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-border pt-5">
          <Button
            variant="outline"
            @click="clearCreateDialogForm"
          >
            Tozalash
          </Button>
          <Button
            :disabled="!isCreateFormReadyToSave || isSavingApplication"
            @click="saveApplicationDraft"
          >
            Arizani saqlash
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
