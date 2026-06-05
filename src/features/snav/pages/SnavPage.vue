<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building2, CalendarClock, Check, ChevronDown, Compass, Download, Filter, MapPin, MoreHorizontal, Navigation, Pencil, Plus, Search, Tags, UserRound, X } from 'lucide-vue-next'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'reka-ui'
import { getSnavPage } from '@/features/snav/config'
import PageContainer from '@/shared/components/PageContainer.vue'
import PageHeader from '@/shared/components/PageHeader.vue'
import SectionBlock from '@/shared/components/SectionBlock.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Card, CardContent } from '@/shared/ui/shadcn/card'
import { Input } from '@/shared/ui/shadcn/input'

type OrganizationType = {
  id: string
  date: string
  shortName: string
  fullName: string
  translations: {
    uzCyr: {
      shortName: string
      fullName: string
    }
    qq: {
      shortName: string
      fullName: string
    }
    ru: {
      shortName: string
      fullName: string
    }
    en: {
      shortName: string
      fullName: string
    }
  }
  organizationsCount: number
  status: 'Faol' | 'Nofaol'
}

type Organization = {
  id: string
  date: string
  name: string
  type: string
  region: string
  district: string
  address: string
  phone: string
  status: 'Faol' | 'Nofaol'
  latitude: number
  longitude: number
}

type ReceptionSlot = {
  day: string
  time: string
  status: 'Boâ€˜sh' | 'Yozilgan' | 'Tasdiqlangan' | 'Bekor qilingan'
}

type ReceptionSchedule = {
  id: string
  date: string
  person: string
  position: string
  organizationId: string
  phone: string
  weeklySlots: ReceptionSlot[]
  status: 'Faol' | 'Nofaol'
}

type UserLocation = {
  latitude: number
  longitude: number
}

type NearestOrganization = {
  type: string
  organization: Organization
  distanceKm: number
}

const props = withDefaults(defineProps<{
  pageKey?: string
}>(), {
  pageKey: 'dashboard',
})

const search = ref('')
const page = computed(() => getSnavPage(props.pageKey))
const isDashboard = computed(() => props.pageKey === 'dashboard')
const isTypesPage = computed(() => props.pageKey === 'organization-types')
const isOrganizationsPage = computed(() => props.pageKey === 'organizations')
const isReceptionSchedulesPage = computed(() => props.pageKey === 'reception-schedules')
const mapSectionTitle = computed(() => page.value.sectionTitle ?? 'Tashkilotlar xaritasi')
const mapSectionDescription = computed(() => page.value.sectionDescription ?? '')
const selectedType = ref<OrganizationType | null>(null)
const selectedOrganization = ref<Organization | null>(null)
const selectedReception = ref<ReceptionSchedule | null>(null)
const selectedReceptionOrganization = ref<Organization | null>(null)
const isEditDialogOpen = ref(false)
const isReceptionDialogOpen = ref(false)
const userLocation = ref<UserLocation | null>(null)
const isLocating = ref(false)
const locationError = ref('')
const mapElement = ref<HTMLElement | null>(null)
let mapInstance: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

const organizationTypes: OrganizationType[] = [
  {
    id: 'SNAV-TUR-001',
    date: '05.06.2026',
    shortName: 'Agentlik',
    fullName: 'Ijtimoiy himoya milliy agentligi',
    translations: {
      uzCyr: {
        shortName: 'ÐÐ³ÐµÐ½Ñ‚Ð»Ð¸Ðº',
        fullName: 'Ð˜Ð¶Ñ‚Ð¸Ð¼Ð¾Ð¸Ð¹ Ò³Ð¸Ð¼Ð¾Ñ Ð¼Ð¸Ð»Ð»Ð¸Ð¹ Ð°Ð³ÐµÐ½Ñ‚Ð»Ð¸Ð³Ð¸',
      },
      qq: {
        shortName: 'Agentlik',
        fullName: 'Socialliq qorgaw milliy agentligi',
      },
      ru: {
        shortName: 'ÐÐ³ÐµÐ½Ñ‚ÑÑ‚Ð²Ð¾',
        fullName: 'ÐÐ°Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ð¾Ðµ Ð°Ð³ÐµÐ½Ñ‚ÑÑ‚Ð²Ð¾ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð·Ð°Ñ‰Ð¸Ñ‚Ñ‹',
      },
      en: {
        shortName: 'Agency',
        fullName: 'National Agency for Social Protection',
      },
    },
    organizationsCount: 0,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-002',
    date: '05.06.2026',
    shortName: 'Hududiy boshqarma',
    fullName: 'Agentlikning hududiy boshqarmasi',
    translations: {
      uzCyr: {
        shortName: 'Ò²ÑƒÐ´ÑƒÐ´Ð¸Ð¹ Ð±Ð¾ÑˆÒ›Ð°Ñ€Ð¼Ð°',
        fullName: 'ÐÐ³ÐµÐ½Ñ‚Ð»Ð¸ÐºÐ½Ð¸Ð½Ð³ Ò³ÑƒÐ´ÑƒÐ´Ð¸Ð¹ Ð±Ð¾ÑˆÒ›Ð°Ñ€Ð¼Ð°ÑÐ¸',
      },
      qq: {
        shortName: 'Aymaqliq basqarma',
        fullName: 'Agentliktin aymaqliq basqarmasi',
      },
      ru: {
        shortName: 'Ð¢ÐµÑ€Ñ€Ð¸Ñ‚Ð¾Ñ€Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ',
        fullName: 'Ð¢ÐµÑ€Ñ€Ð¸Ñ‚Ð¾Ñ€Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ ÑƒÐ¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ ÐÐ³ÐµÐ½Ñ‚ÑÑ‚Ð²Ð°',
      },
      en: {
        shortName: 'Regional department',
        fullName: 'Regional department of the Agency',
      },
    },
    organizationsCount: 1,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-003',
    date: '05.06.2026',
    shortName: 'Inson markazi',
    fullName: '"Inson" ijtimoiy xizmatlar markazi',
    translations: {
      uzCyr: {
        shortName: 'Ð˜Ð½ÑÐ¾Ð½ Ð¼Ð°Ñ€ÐºÐ°Ð·Ð¸',
        fullName: '"Ð˜Ð½ÑÐ¾Ð½" Ð¸Ð¶Ñ‚Ð¸Ð¼Ð¾Ð¸Ð¹ Ñ…Ð¸Ð·Ð¼Ð°Ñ‚Ð»Ð°Ñ€ Ð¼Ð°Ñ€ÐºÐ°Ð·Ð¸',
      },
      qq: {
        shortName: 'Inson orayi',
        fullName: '"Inson" socialliq xizmetler orayi',
      },
      ru: {
        shortName: 'Ð¦ÐµÐ½Ñ‚Ñ€ "Ð˜Ð½ÑÐ¾Ð½"',
        fullName: 'Ð¦ÐµÐ½Ñ‚Ñ€ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ñ… ÑƒÑÐ»ÑƒÐ³ "Ð˜Ð½ÑÐ¾Ð½"',
      },
      en: {
        shortName: 'Inson center',
        fullName: '"Inson" social services center',
      },
    },
    organizationsCount: 1,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-004',
    date: '05.06.2026',
    shortName: 'Sanatoriylar',
    fullName: 'Sanatoriylar',
    translations: {
      uzCyr: {
        shortName: 'Ð¡Ð°Ð½Ð°Ñ‚Ð¾Ñ€Ð¸Ð¹Ð»Ð°Ñ€',
        fullName: 'Ð¡Ð°Ð½Ð°Ñ‚Ð¾Ñ€Ð¸Ð¹Ð»Ð°Ñ€',
      },
      qq: {
        shortName: 'Sanatoriyalar',
        fullName: 'Sanatoriyalar',
      },
      ru: {
        shortName: 'Ð¡Ð°Ð½Ð°Ñ‚Ð¾Ñ€Ð¸Ð¸',
        fullName: 'Ð¡Ð°Ð½Ð°Ñ‚Ð¾Ñ€Ð¸Ð¸',
      },
      en: {
        shortName: 'Sanatoriums',
        fullName: 'Sanatoriums',
      },
    },
    organizationsCount: 1,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-005',
    date: '05.06.2026',
    shortName: "Ijtimoiy qo'llab-quvvatlash markazi",
    fullName: "Ijtimoiy qo'llab-quvvatlash markazi",
    translations: {
      uzCyr: {
        shortName: 'Ð˜Ð¶Ñ‚Ð¸Ð¼Ð¾Ð¸Ð¹ Ò›ÑžÐ»Ð»Ð°Ð±-Ò›ÑƒÐ²Ð²Ð°Ñ‚Ð»Ð°Ñˆ Ð¼Ð°Ñ€ÐºÐ°Ð·Ð¸',
        fullName: 'Ð˜Ð¶Ñ‚Ð¸Ð¼Ð¾Ð¸Ð¹ Ò›ÑžÐ»Ð»Ð°Ð±-Ò›ÑƒÐ²Ð²Ð°Ñ‚Ð»Ð°Ñˆ Ð¼Ð°Ñ€ÐºÐ°Ð·Ð¸',
      },
      qq: {
        shortName: 'Socialliq qollap-quwatlaw orayi',
        fullName: 'Socialliq qollap-quwatlaw orayi',
      },
      ru: {
        shortName: 'Ð¦ÐµÐ½Ñ‚Ñ€ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸',
        fullName: 'Ð¦ÐµÐ½Ñ‚Ñ€ ÑÐ¾Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ð¹ Ð¿Ð¾Ð´Ð´ÐµÑ€Ð¶ÐºÐ¸',
      },
      en: {
        shortName: 'Social support center',
        fullName: 'Social support center',
      },
    },
    organizationsCount: 0,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-006',
    date: '05.06.2026',
    shortName: '"Muruvvat" erkaklar internat uylari',
    fullName: '"Muruvvat" erkaklar internat uylari',
    translations: {
      uzCyr: {
        shortName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" ÑÑ€ÐºÐ°ÐºÐ»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
        fullName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" ÑÑ€ÐºÐ°ÐºÐ»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
      },
      qq: {
        shortName: '"Muruvvat" erkekler internat uylari',
        fullName: '"Muruvvat" erkekler internat uylari',
      },
      ru: {
        shortName: 'ÐœÑƒÐ¶ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
        fullName: 'ÐœÑƒÐ¶ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
      },
      en: {
        shortName: '"Muruvvat" men boarding homes',
        fullName: '"Muruvvat" men boarding homes',
      },
    },
    organizationsCount: 0,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-007',
    date: '05.06.2026',
    shortName: '"Muruvvat" ayollar internat uylari',
    fullName: '"Muruvvat" ayollar internat uylari',
    translations: {
      uzCyr: {
        shortName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" Ð°Ñ‘Ð»Ð»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
        fullName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" Ð°Ñ‘Ð»Ð»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
      },
      qq: {
        shortName: '"Muruvvat" hayallar internat uylari',
        fullName: '"Muruvvat" hayallar internat uylari',
      },
      ru: {
        shortName: 'Ð–ÐµÐ½ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
        fullName: 'Ð–ÐµÐ½ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
      },
      en: {
        shortName: '"Muruvvat" women boarding homes',
        fullName: '"Muruvvat" women boarding homes',
      },
    },
    organizationsCount: 0,
    status: 'Faol',
  },
  {
    id: 'SNAV-TUR-008',
    date: '05.06.2026',
    shortName: '"Muruvvat" bolalar internat uylari',
    fullName: '"Muruvvat" bolalar internat uylari',
    translations: {
      uzCyr: {
        shortName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" Ð±Ð¾Ð»Ð°Ð»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
        fullName: '"ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚" Ð±Ð¾Ð»Ð°Ð»Ð°Ñ€ Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚ ÑƒÐ¹Ð»Ð°Ñ€Ð¸',
      },
      qq: {
        shortName: '"Muruvvat" balalar internat uylari',
        fullName: '"Muruvvat" balalar internat uylari',
      },
      ru: {
        shortName: 'Ð”ÐµÑ‚ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
        fullName: 'Ð”ÐµÑ‚ÑÐºÐ¸Ðµ Ð´Ð¾Ð¼Ð°-Ð¸Ð½Ñ‚ÐµÑ€Ð½Ð°Ñ‚Ñ‹ "ÐœÑƒÑ€ÑƒÐ²Ð²Ð°Ñ‚"',
      },
      en: {
        shortName: '"Muruvvat" children boarding homes',
        fullName: '"Muruvvat" children boarding homes',
      },
    },
    organizationsCount: 0,
    status: 'Faol',
  },
]

const organizations: Organization[] = [
  {
    id: 'SNAV-ORG-001',
    date: '05.06.2026',
    name: 'Yunusobod tumani Inson markazi',
    type: 'Inson markazi',
    region: 'Toshkent shahri',
    district: 'Yunusobod tumani',
    address: 'Amir Temur koâ€˜chasi, 12-uy',
    phone: '+998 71 200 11 01',
    status: 'Faol',
    latitude: 41.3662,
    longitude: 69.2871,
  },
  {
    id: 'SNAV-ORG-002',
    date: '05.06.2026',
    name: 'Samarqand viloyati hududiy boshqarmasi',
    type: 'Hududiy boshqarma',
    region: 'Samarqand viloyati',
    district: 'Samarqand shahri',
    address: 'Koâ€˜ksaroy maydoni, 4-uy',
    phone: '+998 66 200 21 02',
    status: 'Faol',
    latitude: 39.6542,
    longitude: 66.9597,
  },
  {
    id: 'SNAV-ORG-003',
    date: '05.06.2026',
    name: 'Chortoq sanatoriysi',
    type: 'Sanatoriylar',
    region: 'Namangan viloyati',
    district: 'Chortoq tumani',
    address: 'Chortoq shaharchasi, Istirohat koâ€˜chasi',
    phone: '+998 69 200 31 03',
    status: 'Faol',
    latitude: 41.0692,
    longitude: 71.8231,
  },
  {
    id: 'SNAV-ORG-004',
    date: '05.06.2026',
    name: 'Muruvvat internat uyi 1',
    type: 'Internat uyi',
    region: 'Buxoro viloyati',
    district: 'Buxoro shahri',
    address: 'Mustaqillik koâ€˜chasi, 8-uy',
    phone: '+998 65 200 41 04',
    status: 'Faol',
    latitude: 39.7747,
    longitude: 64.4286,
  },
  {
    id: 'SNAV-ORG-005',
    date: '05.06.2026',
    name: 'Saxovat uyi markazi',
    type: 'Internat uyi',
    region: 'Qoraqalpogâ€˜iston Respublikasi',
    district: 'Nukus shahri',
    address: 'A. Dosnazarov koâ€˜chasi, 18-uy',
    phone: '+998 61 200 51 05',
    status: 'Faol',
    latitude: 42.4617,
    longitude: 59.6166,
  },
  {
    id: 'SNAV-ORG-006',
    date: '05.06.2026',
    name: '158-maktab',
    type: 'Maxsus maktab',
    region: 'Toshkent shahri',
    district: 'Yashnobod tumani',
    address: '158-maktab',
    phone: '+998 71 000 00 00',
    status: 'Faol',
    latitude: 41.274634,
    longitude: 69.297888,
  },
]

const receptionSchedules = ref<ReceptionSchedule[]>([
  {
    id: 'SNAV-QABUL-001',
    date: '05.06.2026',
    person: 'ABDULLAYEV KOMILJON ZAFAROVICH',
    position: 'Markaz direktori',
    organizationId: 'SNAV-ORG-001',
    phone: '+998 90 123 45 67',
    status: 'Faol',
    weeklySlots: [
      { day: 'Dushanba', time: '10:00 - 12:00', status: 'Boâ€˜sh' },
      { day: 'Chorshanba', time: '15:00 - 17:00', status: 'Yozilgan' },
    ],
  },
  {
    id: 'SNAV-QABUL-002',
    date: '05.06.2026',
    person: 'KARIMOVA DILNOZA BAHROM QIZI',
    position: 'Boâ€˜lim boshligâ€˜i',
    organizationId: 'SNAV-ORG-002',
    phone: '+998 93 222 44 66',
    status: 'Faol',
    weeklySlots: [
      { day: 'Seshanba', time: '09:00 - 11:00', status: 'Boâ€˜sh' },
      { day: 'Payshanba', time: '14:00 - 16:00', status: 'Tasdiqlangan' },
    ],
  },
  {
    id: 'SNAV-QABUL-003',
    date: '05.06.2026',
    person: 'RAHIMOV OYBEK JALOLOVICH',
    position: 'Bosh shifokor',
    organizationId: 'SNAV-ORG-003',
    phone: '+998 91 456 78 90',
    status: 'Faol',
    weeklySlots: [
      { day: 'Juma', time: '11:00 - 13:00', status: 'Boâ€˜sh' },
      { day: 'Shanba', time: '10:00 - 12:00', status: 'Bekor qilingan' },
    ],
  },
  {
    id: 'SNAV-QABUL-004',
    date: '05.06.2026',
    person: 'SAIDOVA NILUFAR AKMAL QIZI',
    position: 'Ijtimoiy xodim',
    organizationId: 'SNAV-ORG-004',
    phone: '+998 94 111 22 33',
    status: 'Faol',
    weeklySlots: [
      { day: 'Dushanba', time: '14:00 - 16:00', status: 'Boâ€˜sh' },
      { day: 'Payshanba', time: '10:00 - 12:00', status: 'Boâ€˜sh' },
    ],
  },
])

const normalizedSearch = computed(() => search.value.trim().toLowerCase())
const typeStatusSearch = ref('')
const isTypeStatusOpen = ref(false)
const typeStatusOptions: OrganizationType['status'][] = ['Faol', 'Nofaol']
const filteredTypeStatusOptions = computed(() => {
  const query = typeStatusSearch.value.trim().toLowerCase()
  if (!query) return typeStatusOptions
  return typeStatusOptions.filter((status) => status.toLowerCase().includes(query))
})

function toggleTypeStatusDropdown() {
  isTypeStatusOpen.value = !isTypeStatusOpen.value
  if (isTypeStatusOpen.value) {
    typeStatusSearch.value = ''
  }
}

function selectTypeStatus(status: OrganizationType['status']) {
  if (!selectedType.value) return
  selectedType.value.status = status
  isTypeStatusOpen.value = false
}

const filteredTypes = computed(() => {
  if (!normalizedSearch.value) {
    return organizationTypes
  }

  return organizationTypes.filter((item) => [
    item.id,
    item.shortName,
    item.fullName,
    item.translations.uzCyr.shortName,
    item.translations.uzCyr.fullName,
    item.translations.qq.shortName,
    item.translations.qq.fullName,
    item.translations.ru.shortName,
    item.translations.ru.fullName,
    item.translations.en.shortName,
    item.translations.en.fullName,
    item.status,
  ].some((value) => value.toLowerCase().includes(normalizedSearch.value)))
})

const filteredOrganizations = computed(() => {
  if (!normalizedSearch.value) {
    return organizations
  }

  return organizations.filter((item) => [
    item.id,
    item.name,
    item.type,
    item.region,
    item.district,
    item.address,
    item.status,
  ].some((value) => value.toLowerCase().includes(normalizedSearch.value)))
})

const filteredReceptions = computed(() => {
  if (!normalizedSearch.value) {
    return receptionSchedules.value
  }

  return receptionSchedules.value.filter((item) => [
    item.id,
    item.person,
    item.position,
    item.phone,
    item.status,
    getOrganizationById(item.organizationId)?.name ?? '',
  ].some((value) => value.toLowerCase().includes(normalizedSearch.value)))
})

const nearestOrganizationsByType = computed<NearestOrganization[]>(() => {
  if (!userLocation.value) {
    return []
  }

  return Array.from(new Set(organizations.map((organization) => organization.type)))
    .map((type) => {
      const nearest = organizations
        .filter((organization) => organization.type === type)
        .map((organization) => ({
          type,
          organization,
          distanceKm: calculateDistanceKm(userLocation.value!, {
            latitude: organization.latitude,
            longitude: organization.longitude,
          }),
        }))
        .sort((left, right) => left.distanceKm - right.distanceKm)[0]

      return nearest
    })
    .filter((item): item is NearestOrganization => Boolean(item))
})

const stats = computed(() => [
  {
    title: 'Tashkilotlar',
    value: organizations.length,
    description: 'Xaritada koâ€˜rsatiladigan tashkilotlar',
    icon: Building2,
  },
  {
    title: 'Tashkilot turlari',
    value: organizationTypes.length,
    description: 'Maâ€™lumotnomadagi turlar',
    icon: Tags,
  },
  {
    title: 'Hududlar',
    value: new Set(organizations.map((item) => item.region)).size,
    description: 'Tashkilot mavjud hududlar',
    icon: MapPin,
  },
  {
    title: 'Yoâ€˜nalishlar',
    value: organizations.length,
    description: 'Direction uchun tayyor manzillar',
    icon: Compass,
  },
  {
    title: 'Qabullar',
    value: receptionSchedules.value.length,
    description: 'Haftalik ochiq qabul jadvallari',
    icon: CalendarClock,
  },
])

const editDialogTitle = computed(() => {
  if (selectedType.value) {
    return 'Tashkilot turini oâ€˜zgartirish'
  }

  return 'Tashkilotni oâ€˜zgartirish'
})

function openTypeEditDialog(item: OrganizationType) {
  selectedType.value = item
  selectedOrganization.value = null
  selectedReception.value = null
  isEditDialogOpen.value = true
}

function openOrganizationEditDialog(item: Organization) {
  selectedOrganization.value = item
  selectedType.value = null
  selectedReception.value = null
  isEditDialogOpen.value = true
}

function closeEditDialog() {
  void editDialogTitle.value
  isEditDialogOpen.value = false
}

const activeEditDialogTitle = computed(() => {
  if (selectedReception.value) {
    return 'Qabul jadvalini oâ€˜zgartirish'
  }

  if (selectedType.value) {
    return 'Tashkilot turini oâ€˜zgartirish'
  }

  return 'Tashkilotni oâ€˜zgartirish'
})

const selectedOrganizationReceptions = computed(() => {
  if (!selectedReceptionOrganization.value) {
    return []
  }

  return getReceptionsByOrganization(selectedReceptionOrganization.value.id)
})

function getOrganizationById(id: string) {
  return organizations.find((organization) => organization.id === id) ?? null
}

function getReceptionsByOrganization(organizationId: string) {
  return receptionSchedules.value.filter((schedule) => schedule.organizationId === organizationId)
}

function openReceptionEditDialog(item: ReceptionSchedule) {
  selectedReception.value = item
  selectedType.value = null
  selectedOrganization.value = null
  isEditDialogOpen.value = true
}

function openReceptionDialog(organization: Organization) {
  selectedReceptionOrganization.value = organization
  isReceptionDialogOpen.value = true
}

function closeReceptionDialog() {
  isReceptionDialogOpen.value = false
}

function changeSlotStatus(scheduleId: string, slotIndex: number, status: ReceptionSlot['status']) {
  const schedule = receptionSchedules.value.find((item) => item.id === scheduleId)
  if (!schedule) {
    return
  }

  schedule.weeklySlots[slotIndex]!.status = status
}

function calculateDistanceKm(from: UserLocation, to: UserLocation) {
  const earthRadiusKm = 6371
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function toRadians(value: number) {
  return value * Math.PI / 180
}

function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }

  return `${distanceKm.toFixed(1)} km`
}

function requestUserLocation() {
  locationError.value = ''

  if (!navigator.geolocation) {
    locationError.value = 'Browser joylashuvni aniqlashni qoÃ¢â‚¬Ëœllab-quvvatlamaydi.'
    return
  }

  isLocating.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLocation.value = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }
      isLocating.value = false
      void nextTick(renderMap)
    },
    (error) => {
      locationError.value = error.message || 'Joylashuvni aniqlab boÃ¢â‚¬Ëœlmadi.'
      isLocating.value = false
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    },
  )
}

function createOrganizationMarkerIcon(organization: Organization) {
  return L.divIcon({
    className: 'snav-map-marker-wrapper',
    html: `
      <span class="snav-map-marker">
        <span class="snav-map-marker__dot"></span>
        <span class="snav-map-marker__label">${organization.type}</span>
      </span>
    `,
    iconSize: [132, 34],
    iconAnchor: [18, 32],
    popupAnchor: [0, -30],
  })
}

function renderMap() {
  if (!mapElement.value || !isDashboard.value) {
    return
  }

  if (!mapInstance) {
    mapInstance = L.map(mapElement.value, {
      center: [41.3775, 64.5853],
      zoom: 6,
      minZoom: 5,
      maxZoom: 18,
      scrollWheelZoom: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapInstance)

    markerLayer = L.layerGroup().addTo(mapInstance)
  }

  markerLayer?.clearLayers()

  const bounds = L.latLngBounds([])
  organizations.forEach((organization) => {
    const position = L.latLng(organization.latitude, organization.longitude)
    bounds.extend(position)

    L.marker(position, {
      icon: createOrganizationMarkerIcon(organization),
    })
      .bindPopup(`
        <strong>${organization.name}</strong><br />
        ${organization.region}, ${organization.district}<br />
        ${organization.address}<br />
        <span>${organization.phone}</span>
      `)
      .on('click', () => openReceptionDialog(organization))
      .addTo(markerLayer!)
  })

  if (userLocation.value) {
    const currentPosition = L.latLng(userLocation.value.latitude, userLocation.value.longitude)
    bounds.extend(currentPosition)

    L.circleMarker(currentPosition, {
      radius: 8,
      color: '#2563eb',
      weight: 2,
      fillColor: '#3b82f6',
      fillOpacity: 0.88,
    })
      .bindPopup('Sizning joylashuvingiz')
      .addTo(markerLayer!)
  }

  if (bounds.isValid()) {
    mapInstance.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 7,
    })
  }

  setTimeout(() => mapInstance?.invalidateSize(), 0)
}

function openDirections(organization: Organization) {
  const destination = `${organization.latitude},${organization.longitude}`
  const route = userLocation.value
    ? `${userLocation.value.latitude},${userLocation.value.longitude}~${destination}`
    : `~${destination}`
  const url = `https://yandex.com/maps/?rtext=${encodeURIComponent(route)}&rtt=auto`
  window.open(url, '_blank', 'noopener,noreferrer')
}

onMounted(() => {
  void nextTick(renderMap)
})

watch(isDashboard, (value) => {
  if (value) {
    void nextTick(renderMap)
  }
})

onBeforeUnmount(() => {
  mapInstance?.remove()
  mapInstance = null
  markerLayer = null
})
</script>

<template>
  <PageContainer class="xl:overflow-y-auto">
    <PageHeader
      :title="page.title"
      :description="page.description"
    />

    <template v-if="isDashboard">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card
          v-for="stat in stats"
          :key="stat.title"
          class="border-border bg-card"
        >
          <CardContent class="flex items-start justify-between gap-4 p-4">
            <div class="space-y-2">
              <p class="text-sm text-muted-foreground">
                {{ stat.title }}
              </p>
              <p class="text-2xl font-semibold text-foreground">
                {{ stat.value }}
              </p>
              <p class="text-xs text-muted-foreground">
                {{ stat.description }}
              </p>
            </div>
            <div class="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground">
              <component
                :is="stat.icon"
                class="h-5 w-5"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <SectionBlock
        :title="mapSectionTitle"
        :description="mapSectionDescription"
        content-class="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]"
      >
        <div class="relative min-h-[34rem] min-w-0 overflow-hidden rounded-xl border border-border bg-muted/30">
          <div
            ref="mapElement"
            class="h-[34rem] w-full min-w-0"
          />
        </div>

        <div class="min-w-0 space-y-3">
          <div class="rounded-xl border border-border bg-card p-4">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-foreground">Eng yaqin tashkilotlar</p>
                <p class="text-xs text-muted-foreground">Har bir tashkilot turi bo'yicha masofa hisoblanadi.</p>
              </div>
              <div class="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-primary">
                <MapPin class="h-4 w-4" />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              class="mt-4 w-full justify-center gap-2"
              :disabled="isLocating"
              @click="requestUserLocation"
            >
              <MapPin class="h-4 w-4" />
              {{ isLocating ? 'Aniqlanmoqda...' : 'Joylashuvni aniqlash' }}
            </Button>

            <p
              v-if="locationError"
              class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700"
            >
              {{ locationError }}
            </p>

            <div
              v-if="userLocation"
              class="mt-3 space-y-2"
            >
              <div
                v-for="item in nearestOrganizationsByType"
                :key="item.type"
                class="rounded-lg border border-border bg-muted/20 p-3"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="text-xs font-medium uppercase text-muted-foreground">{{ item.type }}</p>
                    <p class="mt-1 truncate text-sm font-semibold text-foreground">{{ item.organization.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ item.organization.region }}, {{ item.organization.district }}</p>
                  </div>
                  <span class="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    {{ formatDistance(item.distanceKm) }}
                  </span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    class="gap-2"
                    @click="openDirections(item.organization)"
                  >
                    <Navigation class="h-4 w-4" />
                    Yo'nalish
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    class="gap-2"
                    @click="openReceptionDialog(item.organization)"
                  >
                    <CalendarClock class="h-4 w-4" />
                    Qabul
                  </Button>
                </div>
              </div>
            </div>

            <p
              v-else
              class="mt-3 text-xs text-muted-foreground"
            >
              Joylashuv aniqlangandan keyin eng yaqin tashkilotlar shu yerda ko'rinadi.
            </p>
          </div>

          <div
            v-for="organization in organizations"
            :key="organization.id"
            class="rounded-xl border border-border bg-card p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 space-y-1">
                <p class="truncate text-sm font-semibold text-foreground">
                  {{ organization.name }}
                </p>
                <p class="text-xs text-muted-foreground">
                  {{ organization.type }}
                </p>
              </div>
              <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {{ organization.status }}
              </span>
            </div>
            <div class="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>{{ organization.region }}, {{ organization.district }}</p>
              <p>{{ organization.address }}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              class="mt-4 w-full justify-center gap-2"
              @click="openDirections(organization)"
            >
              <Navigation class="h-4 w-4" />
              Yoâ€˜nalish qoâ€˜yish
            </Button>
            <Button
              type="button"
              class="mt-2 w-full justify-center gap-2"
              @click="openReceptionDialog(organization)"
            >
              <CalendarClock class="h-4 w-4" />
              Qabulga yozilish
            </Button>
          </div>
        </div>
      </SectionBlock>
    </template>

    <template v-else>
      <SectionBlock
        title=""
        content-class="space-y-4"
      >
        <div class="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative w-full lg:max-w-sm">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              v-model="search"
              class="pl-9"
              placeholder="Qidirish"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              class="gap-2"
            >
              <Filter class="h-4 w-4" />
              Filter
            </Button>
            <Button
              type="button"
              variant="outline"
              class="gap-2"
            >
              <Download class="h-4 w-4" />
              Yuklab olish
            </Button>
            <Button
              type="button"
              class="gap-2"
            >
              <Plus class="h-4 w-4" />
              Yaratish
            </Button>
          </div>
        </div>

        <div
          v-if="isTypesPage"
          class="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div class="hidden lg:block">
            <table class="w-full border-collapse text-sm">
              <thead class="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 text-left">Hujjat</th>
                  <th class="px-4 py-3 text-left">Qisqa nomi</th>
                  <th class="px-4 py-3 text-left">Toâ€˜liq nomi</th>
                  <th class="px-4 py-3 text-left">Tashkilotlar</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in filteredTypes"
                  :key="item.id"
                  class="border-t border-border"
                >
                  <td class="px-4 py-3">
                    <p class="font-semibold text-foreground">{{ item.id }}</p>
                    <p class="text-muted-foreground">{{ item.date }}</p>
                  </td>
                  <td class="px-4 py-3 font-medium text-foreground">{{ item.shortName }}</td>
                  <td class="px-4 py-3 text-foreground">{{ item.fullName }}</td>
                  <td class="px-4 py-3 text-foreground">{{ item.organizationsCount }} ta</td>
                  <td class="px-4 py-3">
                    <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger as-child>
                        <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openTypeEditDialog(item)">
                            <Pencil class="h-4 w-4" />
                            O'zgartirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid gap-3 p-3 lg:hidden">
            <div
              v-for="item in filteredTypes"
              :key="item.id"
              class="rounded-xl border border-border p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-foreground">{{ item.shortName }}</p>
                  <p class="text-sm text-muted-foreground">{{ item.id }} Â· {{ item.date }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {{ item.status }}
                  </span>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger as-child>
                      <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                        <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openTypeEditDialog(item)">
                          <Pencil class="h-4 w-4" />
                          O'zgartirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </div>
              </div>
              <p class="mt-3 text-sm text-foreground">{{ item.fullName }}</p>
              <p class="mt-2 text-sm text-muted-foreground">Tashkilotlar: {{ item.organizationsCount }} ta</p>
            </div>
          </div>
        </div>

        <div
          v-if="isOrganizationsPage"
          class="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div class="hidden lg:block">
            <table class="w-full border-collapse text-sm">
              <thead class="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 text-left">Hujjat</th>
                  <th class="px-4 py-3 text-left">Tashkilot</th>
                  <th class="px-4 py-3 text-left">Turi</th>
                  <th class="px-4 py-3 text-left">Manzil</th>
                  <th class="px-4 py-3 text-left">Telefon</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in filteredOrganizations"
                  :key="item.id"
                  class="border-t border-border"
                >
                  <td class="px-4 py-3">
                    <p class="font-semibold text-foreground">{{ item.id }}</p>
                    <p class="text-muted-foreground">{{ item.date }}</p>
                  </td>
                  <td class="px-4 py-3 font-medium text-foreground">{{ item.name }}</td>
                  <td class="px-4 py-3 text-foreground">{{ item.type }}</td>
                  <td class="px-4 py-3">
                    <p class="font-medium text-foreground">{{ item.region }}</p>
                    <p class="text-muted-foreground">{{ item.district }}</p>
                    <p class="text-muted-foreground">{{ item.address }}</p>
                  </td>
                  <td class="px-4 py-3 text-foreground">{{ item.phone }}</td>
                  <td class="px-4 py-3">
                    <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger as-child>
                        <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openOrganizationEditDialog(item)">
                            <Pencil class="h-4 w-4" />
                            O'zgartirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid gap-3 p-3 md:grid-cols-2 lg:hidden">
            <div
              v-for="item in filteredOrganizations"
              :key="item.id"
              class="rounded-xl border border-border p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-foreground">{{ item.name }}</p>
                  <p class="text-sm text-muted-foreground">{{ item.id }} Â· {{ item.date }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {{ item.status }}
                  </span>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger as-child>
                      <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                        <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openOrganizationEditDialog(item)">
                          <Pencil class="h-4 w-4" />
                          O'zgartirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </div>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <p class="text-muted-foreground">Turi: <span class="text-foreground">{{ item.type }}</span></p>
                <p class="text-muted-foreground">Manzil: <span class="text-foreground">{{ item.region }}, {{ item.district }}</span></p>
                <p class="text-muted-foreground">Telefon: <span class="text-foreground">{{ item.phone }}</span></p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isReceptionSchedulesPage"
          class="overflow-hidden rounded-xl border border-border bg-card"
        >
          <div class="hidden lg:block">
            <table class="w-full border-collapse text-sm">
              <thead class="bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th class="px-4 py-3 text-left">Hujjat</th>
                  <th class="px-4 py-3 text-left">Shaxs</th>
                  <th class="px-4 py-3 text-left">Lavozim</th>
                  <th class="px-4 py-3 text-left">Tashkilot</th>
                  <th class="px-4 py-3 text-left">Qabul vaqtlari</th>
                  <th class="px-4 py-3 text-left">Status</th>
                  <th class="px-4 py-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in filteredReceptions"
                  :key="item.id"
                  class="border-t border-border"
                >
                  <td class="px-4 py-3">
                    <p class="font-semibold text-foreground">{{ item.id }}</p>
                    <p class="text-muted-foreground">{{ item.date }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <p class="font-semibold text-foreground">{{ item.person }}</p>
                    <p class="text-muted-foreground">{{ item.phone }}</p>
                  </td>
                  <td class="px-4 py-3 text-foreground">{{ item.position }}</td>
                  <td class="px-4 py-3">
                    <p class="font-medium text-foreground">{{ getOrganizationById(item.organizationId)?.name }}</p>
                    <p class="text-muted-foreground">{{ getOrganizationById(item.organizationId)?.region }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-1.5">
                      <span
                        v-for="slot in item.weeklySlots"
                        :key="`${item.id}-${slot.day}-${slot.time}`"
                        class="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {{ slot.day }} Â· {{ slot.time }} Â· {{ slot.status }}
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {{ item.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <DropdownMenuRoot>
                      <DropdownMenuTrigger as-child>
                        <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                          <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openReceptionEditDialog(item)">
                            <Pencil class="h-4 w-4" />
                            O'zgartirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenuRoot>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="grid gap-3 p-3 md:grid-cols-2 lg:hidden">
            <div
              v-for="item in filteredReceptions"
              :key="item.id"
              class="rounded-xl border border-border p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-foreground">{{ item.person }}</p>
                  <p class="text-sm text-muted-foreground">{{ item.id }} Â· {{ item.date }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {{ item.status }}
                  </span>
                  <DropdownMenuRoot>
                    <DropdownMenuTrigger as-child>
                      <Button type="button" variant="outline" size="icon" class="h-9 w-9 rounded-full">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuContent side="left" align="start" :side-offset="8" class="z-50 min-w-44 rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg outline-none">
                        <DropdownMenuItem class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none hover:bg-muted" @click="openReceptionEditDialog(item)">
                          <Pencil class="h-4 w-4" />
                          O'zgartirish
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenuPortal>
                  </DropdownMenuRoot>
                </div>
              </div>
              <div class="mt-3 space-y-1 text-sm">
                <p class="text-muted-foreground">Lavozim: <span class="text-foreground">{{ item.position }}</span></p>
                <p class="text-muted-foreground">Tashkilot: <span class="text-foreground">{{ getOrganizationById(item.organizationId)?.name }}</span></p>
                <p class="text-muted-foreground">Telefon: <span class="text-foreground">{{ item.phone }}</span></p>
              </div>
              <div class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="slot in item.weeklySlots"
                  :key="`${item.id}-mobile-${slot.day}-${slot.time}`"
                  class="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  {{ slot.day }} Â· {{ slot.time }} Â· {{ slot.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionBlock>
    </template>

    <div
      v-if="isEditDialogOpen"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4"
    >
      <div
        class="w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
        :class="selectedType ? 'max-w-2xl' : 'max-w-3xl'"
        :style="selectedType ? { maxWidth: '58rem' } : undefined"
      >
        <div
          class="flex items-start justify-between gap-4 border-b border-border"
          :class="selectedType ? 'px-5 py-4' : 'px-6 py-4'"
        >
          <div>
            <h2 class="text-lg font-semibold text-foreground">
              {{ activeEditDialogTitle }}
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              Ma'lumotlar tarkibi demo ko'rinishda ko'rsatilmoqda.
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="closeEditDialog"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div
          class="max-h-[70vh] overflow-x-hidden overflow-y-auto"
          :class="selectedType ? 'p-5' : 'p-6'"
        >
          <div
            v-if="selectedType"
            class="grid gap-3 md:grid-cols-2"
          >
            <div class="rounded-xl border border-border bg-card p-3 md:col-span-2">
              <div class="grid gap-3 md:grid-cols-2">
                <label class="space-y-2 text-sm font-medium text-foreground">
                  Qisqa nomi
                  <Input v-model="selectedType.shortName" />
                </label>
                <label class="space-y-2 text-sm font-medium text-foreground">
                  To'liq nomi
                  <Input v-model="selectedType.fullName" />
                </label>
              </div>

              <div class="mt-3 grid gap-3 md:grid-cols-2">
                <div class="rounded-xl border border-border bg-muted/20 p-3">
                  <p class="text-sm font-semibold text-foreground">Qisqa nomi tarjimalari</p>
                  <div class="mt-3 grid gap-3">
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      O'zbek kirill
                      <Input
                        v-model="selectedType.translations.uzCyr.shortName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      Qoraqalpoq lotin
                      <Input
                        v-model="selectedType.translations.qq.shortName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      Rus tili
                      <Input
                        v-model="selectedType.translations.ru.shortName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      English
                      <Input
                        v-model="selectedType.translations.en.shortName"
                        class="font-normal normal-case"
                      />
                    </label>
                  </div>
                </div>
                <div class="rounded-xl border border-border bg-muted/20 p-3">
                  <p class="text-sm font-semibold text-foreground">To'liq nomi tarjimalari</p>
                  <div class="mt-3 grid gap-3">
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      O'zbek kirill
                      <Input
                        v-model="selectedType.translations.uzCyr.fullName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      Qoraqalpoq lotin
                      <Input
                        v-model="selectedType.translations.qq.fullName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      Rus tili
                      <Input
                        v-model="selectedType.translations.ru.fullName"
                        class="font-normal normal-case"
                      />
                    </label>
                    <label class="space-y-2 text-xs font-semibold uppercase text-muted-foreground">
                      English
                      <Input
                        v-model="selectedType.translations.en.fullName"
                        class="font-normal normal-case"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-2 text-sm font-medium text-foreground">
              Status
              <div class="relative max-w-sm">
                <button
                    type="button"
                    :class="[
                      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-left text-sm transition',
                      isTypeStatusOpen && 'border-ring ring-2 ring-ring/20',
                    ]"
                    @click="toggleTypeStatusDropdown"
                  >
                    <span>{{ selectedType.status || 'Statusni tanlang' }}</span>
                    <ChevronDown class="h-4 w-4 text-muted-foreground" />
                  </button>
                <div
                  v-if="isTypeStatusOpen"
                  class="absolute left-0 top-full z-50 mt-2 w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
                >
                    <div class="relative mb-1">
                      <Search class="pointer-events-none absolute z-10 left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        v-model="typeStatusSearch"
                        class="h-8 pl-8 text-xs"
                        placeholder="Qidirish"
                        @click.stop
                        @keydown.stop
                      />
                    </div>
                    <button
                      v-for="status in filteredTypeStatusOptions"
                      :key="status"
                      type="button"
                      class="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                      @click="selectTypeStatus(status)"
                    >
                      <span>{{ status }}</span>
                      <Check
                        v-if="selectedType.status === status"
                        class="h-4 w-4 text-primary"
                      />
                    </button>
                    <div
                      v-if="filteredTypeStatusOptions.length === 0"
                      class="px-3 py-2 text-sm text-muted-foreground"
                    >
                      Ma'lumot topilmadi
                    </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="selectedOrganization"
            class="grid gap-4 md:grid-cols-2"
          >
            <label class="space-y-2 text-sm font-medium text-foreground">
              Hujjat ID
              <Input :value="selectedOrganization.id" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Sana
              <Input :value="selectedOrganization.date" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground md:col-span-2">
              Tashkilot nomi
              <Input :value="selectedOrganization.name" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Tashkilot turi
              <Input :value="selectedOrganization.type" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Telefon
              <Input :value="selectedOrganization.phone" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Hudud
              <Input :value="selectedOrganization.region" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Tuman yoki shahar
              <Input :value="selectedOrganization.district" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground md:col-span-2">
              To'liq manzil
              <Input :value="selectedOrganization.address" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Kenglik
              <Input :value="selectedOrganization.latitude" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Uzunlik
              <Input :value="selectedOrganization.longitude" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Status
              <Input :value="selectedOrganization.status" />
            </label>
          </div>

          <div
            v-if="selectedReception"
            class="grid gap-4 md:grid-cols-2"
          >
            <label class="space-y-2 text-sm font-medium text-foreground">
              Hujjat ID
              <Input :value="selectedReception.id" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Sana
              <Input :value="selectedReception.date" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Shaxs
              <Input :value="selectedReception.person" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Lavozim
              <Input :value="selectedReception.position" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Tashkilot
              <Input :value="getOrganizationById(selectedReception.organizationId)?.name ?? ''" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Telefon
              <Input :value="selectedReception.phone" />
            </label>
            <label class="space-y-2 text-sm font-medium text-foreground">
              Status
              <Input :value="selectedReception.status" />
            </label>
            <div class="space-y-2 md:col-span-2">
              <p class="text-sm font-medium text-foreground">Hafta bo'yicha ochiq qabul vaqtlari</p>
              <div class="grid gap-2 md:grid-cols-2">
                <div
                  v-for="slot in selectedReception.weeklySlots"
                  :key="`${selectedReception.id}-edit-${slot.day}-${slot.time}`"
                  class="rounded-xl border border-border bg-muted/30 p-3"
                >
                  <p class="font-medium text-foreground">{{ slot.day }}</p>
                  <p class="text-sm text-muted-foreground">{{ slot.time }}</p>
                  <p class="mt-2 text-xs font-medium text-foreground">{{ slot.status }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            @click="closeEditDialog"
          >
            Yopish
          </Button>
          <Button type="button">
            Saqlash
          </Button>
        </div>
      </div>
    </div>

    <div
      v-if="isReceptionDialogOpen && selectedReceptionOrganization"
      class="fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-4"
    >
      <div class="w-full max-w-4xl max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl">
        <div class="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-foreground">
              Qabulga yozilish
            </h2>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ selectedReceptionOrganization.name }} uchun ochiq qabul vaqtlari.
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            @click="closeReceptionDialog"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="max-h-[70vh] overflow-x-hidden overflow-y-auto p-6">
          <div class="rounded-xl border border-border bg-muted/20 p-4">
            <p class="text-sm font-semibold text-foreground">
              {{ selectedReceptionOrganization.region }}, {{ selectedReceptionOrganization.district }}
            </p>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ selectedReceptionOrganization.address }}
            </p>
          </div>

          <div class="mt-4 grid gap-4">
            <div
              v-for="schedule in selectedOrganizationReceptions"
              :key="schedule.id"
              class="rounded-xl border border-border bg-card p-4"
            >
              <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div class="flex items-start gap-3">
                  <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 text-primary">
                    <UserRound class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="font-semibold text-foreground">{{ schedule.person }}</p>
                    <p class="text-sm text-muted-foreground">{{ schedule.position }}</p>
                    <p class="text-sm text-muted-foreground">{{ schedule.phone }}</p>
                  </div>
                </div>
                <span class="w-fit rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  {{ schedule.status }}
                </span>
              </div>

              <div class="mt-4 grid gap-2 md:grid-cols-2">
                <div
                  v-for="(slot, slotIndex) in schedule.weeklySlots"
                  :key="`${schedule.id}-slot-${slot.day}-${slot.time}`"
                  class="rounded-xl border border-border bg-muted/20 p-3"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-medium text-foreground">{{ slot.day }}</p>
                      <p class="text-sm text-muted-foreground">{{ slot.time }}</p>
                    </div>
                    <span class="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                      {{ slot.status }}
                    </span>
                  </div>

                  <div class="mt-3 flex flex-wrap gap-2">
                    <Button
                      v-if="slot.status.startsWith('Bo')"
                      type="button"
                      size="sm"
                      class="gap-2"
                      @click="changeSlotStatus(schedule.id, slotIndex, 'Yozilgan')"
                    >
                      <CalendarClock class="h-4 w-4" />
                      Yozilish
                    </Button>
                    <template v-else-if="slot.status === 'Yozilgan'">
                      <Button
                        type="button"
                        size="sm"
                        class="gap-2"
                        @click="changeSlotStatus(schedule.id, slotIndex, 'Tasdiqlangan')"
                      >
                        <CheckCircle2 class="h-4 w-4" />
                        Tasdiqlash
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        class="gap-2"
                        @click="changeSlotStatus(schedule.id, slotIndex, 'Bekor qilingan')"
                      >
                        <X class="h-4 w-4" />
                        Bekor qilish
                      </Button>
                    </template>
                    <Button
                      v-else-if="slot.status === 'Bekor qilingan'"
                      type="button"
                      size="sm"
                      variant="outline"
                      class="gap-2"
                      @click="changeSlotStatus(schedule.id, slotIndex, 'Yozilgan')"
                    >
                      <CalendarClock class="h-4 w-4" />
                      Qayta yozilish
                    </Button>
                    <Button
                      v-else
                      type="button"
                      size="sm"
                      variant="outline"
                      class="gap-2"
                      disabled
                    >
                      <CheckCircle2 class="h-4 w-4" />
                      Tasdiqlangan
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="selectedOrganizationReceptions.length === 0"
              class="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground"
            >
              Ushbu tashkilot uchun qabul jadvali kiritilmagan.
            </div>
          </div>
        </div>

        <div class="flex justify-end border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            @click="closeReceptionDialog"
          >
            Yopish
          </Button>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<style scoped>
:global(.snav-map-marker-wrapper) {
  background: transparent;
  border: 0;
}

:global(.snav-map-marker) {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  max-width: 8.25rem;
  border: 1px solid hsl(var(--primary) / 0.32);
  border-radius: 999px;
  background: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: 0 8px 22px hsl(var(--foreground) / 0.12);
  padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

:global(.snav-map-marker__dot) {
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 auto;
  border-radius: 999px;
  background: hsl(var(--primary));
  box-shadow: inset 0 0 0 0.375rem hsl(var(--primary-foreground) / 0.16);
}

:global(.snav-map-marker__label) {
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(.leaflet-container) {
  background: hsl(var(--muted));
  font-family: inherit;
}

:global(.leaflet-popup-content-wrapper),
:global(.leaflet-popup-tip) {
  background: hsl(var(--card));
  color: hsl(var(--foreground));
}

:global(.leaflet-control-zoom a) {
  color: hsl(var(--foreground));
  background: hsl(var(--card));
}

:global(.leaflet-control-attribution) {
  background: hsl(var(--card) / 0.88);
  color: hsl(var(--muted-foreground));
}
</style>
