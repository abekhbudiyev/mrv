<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {
  ArrowDown,
  ArrowUp,
  Banknote,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  MapPin,
  Search,
  Star,
  Users,
} from 'lucide-vue-next'
import PageContainer from '@/shared/components/PageContainer.vue'
import FilterPopover from '@/shared/components/FilterPopover.vue'
import FilterDateInput from '@/shared/components/FilterDateInput.vue'
import { Button } from '@/shared/ui/shadcn/button'
import { Input } from '@/shared/ui/shadcn/input'

type Entrepreneur = {
  id: number
  name: string
  tin: string
  region: string
  district: string
  address: string
  category: 'Reabilitatsiya markazi' | 'Terapiya markazi' | 'Ta\'lim markazi'
  score: number
  previousRank: number
  reviews: number
  children: number
  completedServices: number
  serviceHours: number
  quality: number
  attendance: number
  status: 'Faol' | 'Vaqtincha to\'xtatilgan'
  lat: number
  lng: number
}

type RegionRating = {
  name: string
  entrepreneurCount: number
  activeCount: number
  score: number
  children: number
  attendedChildren: number
  serviceHours: number
  totalServiceHours: number
  amount: number
  totalAmount: number
  lat: number
  lng: number
}

const entrepreneurSeeds: Entrepreneur[] = [
  { id: 1, name: 'Mehrli Qadam MCHJ', tin: '309845672', region: 'Toshkent shahri', district: 'Yunusobod', address: 'Bog‘ishamol MFY, 12-uy', category: 'Reabilitatsiya markazi', score: 4.96, previousRank: 2, reviews: 148, children: 186, completedServices: 1248, serviceHours: 2496, quality: 98, attendance: 97, status: 'Faol', lat: 41.366, lng: 69.288 },
  { id: 2, name: 'Kelajak Reabilitatsiya NNT', tin: '302471895', region: 'Samarqand', district: 'Samarqand shahri', address: 'Universitet xiyoboni, 18-uy', category: 'Reabilitatsiya markazi', score: 4.91, previousRank: 1, reviews: 132, children: 164, completedServices: 1106, serviceHours: 2212, quality: 97, attendance: 96, status: 'Faol', lat: 39.654, lng: 66.959 },
  { id: 3, name: 'Bolajon Terapiya Markazi', tin: '614923780', region: 'Farg‘ona', district: 'Qo‘qon', address: 'Istiqlol ko‘chasi, 24-uy', category: 'Terapiya markazi', score: 4.88, previousRank: 5, reviews: 119, children: 153, completedServices: 986, serviceHours: 1972, quality: 96, attendance: 98, status: 'Faol', lat: 40.528, lng: 70.942 },
  { id: 4, name: 'Imkon Plus MCHJ', tin: '305718294', region: 'Andijon', district: 'Andijon shahri', address: 'Bobur shoh ko‘chasi, 41-uy', category: 'Ta\'lim markazi', score: 4.82, previousRank: 3, reviews: 104, children: 142, completedServices: 904, serviceHours: 1808, quality: 95, attendance: 94, status: 'Faol', lat: 40.783, lng: 72.344 },
  { id: 5, name: 'Yangi Umid Markazi', tin: '307845126', region: 'Buxoro', district: 'Buxoro shahri', address: 'G‘ijduvon ko‘chasi, 8-uy', category: 'Reabilitatsiya markazi', score: 4.79, previousRank: 7, reviews: 98, children: 137, completedServices: 872, serviceHours: 1744, quality: 94, attendance: 95, status: 'Faol', lat: 39.768, lng: 64.455 },
  { id: 6, name: 'Sog‘lom Avlod Servis', tin: '301958476', region: 'Qashqadaryo', district: 'Qarshi shahri', address: 'Nasaf ko‘chasi, 33-uy', category: 'Terapiya markazi', score: 4.73, previousRank: 4, reviews: 91, children: 128, completedServices: 811, serviceHours: 1622, quality: 93, attendance: 92, status: 'Faol', lat: 38.861, lng: 65.789 },
  { id: 7, name: 'Mehr Nuri MCHJ', tin: '308426159', region: 'Namangan', district: 'Namangan shahri', address: 'Navoiy ko‘chasi, 16-uy', category: 'Terapiya markazi', score: 4.68, previousRank: 8, reviews: 86, children: 119, completedServices: 774, serviceHours: 1548, quality: 92, attendance: 93, status: 'Faol', lat: 40.998, lng: 71.672 },
  { id: 8, name: 'Kamalak Bolalar Markazi', tin: '304619827', region: 'Xorazm', district: 'Urganch shahri', address: 'Al-Xorazmiy ko‘chasi, 29-uy', category: 'Ta\'lim markazi', score: 4.61, previousRank: 6, reviews: 79, children: 108, completedServices: 703, serviceHours: 1406, quality: 91, attendance: 90, status: 'Faol', lat: 41.551, lng: 60.631 },
  { id: 9, name: 'Ishonch Reabilitatsiya', tin: '306297418', region: 'Surxondaryo', district: 'Termiz shahri', address: 'At-Termiziy ko‘chasi, 7-uy', category: 'Reabilitatsiya markazi', score: 4.54, previousRank: 10, reviews: 72, children: 94, completedServices: 648, serviceHours: 1296, quality: 90, attendance: 91, status: 'Faol', lat: 37.225, lng: 67.278 },
  { id: 10, name: 'Ziyo Terapiya MCHJ', tin: '309174625', region: 'Jizzax', district: 'Jizzax shahri', address: 'Sh. Rashidov ko‘chasi, 52-uy', category: 'Terapiya markazi', score: 4.47, previousRank: 9, reviews: 66, children: 87, completedServices: 592, serviceHours: 1184, quality: 88, attendance: 89, status: 'Vaqtincha to\'xtatilgan', lat: 40.126, lng: 67.88 },
]

const regionCatalog = [
  { region: 'Qoraqalpog‘iston Respublikasi', district: 'Nukus shahri', lat: 42.4619, lng: 59.6166 },
  { region: 'Andijon', district: 'Andijon shahri', lat: 40.783, lng: 72.344 },
  { region: 'Buxoro', district: 'Buxoro shahri', lat: 39.768, lng: 64.455 },
  { region: 'Jizzax', district: 'Jizzax shahri', lat: 40.126, lng: 67.88 },
  { region: 'Qashqadaryo', district: 'Qarshi shahri', lat: 38.861, lng: 65.789 },
  { region: 'Navoiy', district: 'Navoiy shahri', lat: 40.1039, lng: 65.3688 },
  { region: 'Namangan', district: 'Namangan shahri', lat: 40.998, lng: 71.672 },
  { region: 'Samarqand', district: 'Samarqand shahri', lat: 39.654, lng: 66.959 },
  { region: 'Surxondaryo', district: 'Termiz shahri', lat: 37.225, lng: 67.278 },
  { region: 'Sirdaryo', district: 'Guliston shahri', lat: 40.4897, lng: 68.7842 },
  { region: 'Toshkent viloyati', district: 'Nurafshon shahri', lat: 41.0478, lng: 69.3556 },
  { region: 'Farg‘ona', district: 'Farg‘ona shahri', lat: 40.3864, lng: 71.7864 },
  { region: 'Xorazm', district: 'Urganch shahri', lat: 41.551, lng: 60.631 },
  { region: 'Toshkent shahri', district: 'Yunusobod', lat: 41.366, lng: 69.288 },
] as const

const entrepreneurs: Entrepreneur[] = Array.from({ length: 150 }, (_, index) => {
  const seed = entrepreneurSeeds[index % entrepreneurSeeds.length]!
  const location = regionCatalog[index % regionCatalog.length]!
  const branchNumber = Math.floor(index / entrepreneurSeeds.length) + 1
  const attendance = 86 + (index % 13)
  const serviceHours = 760 + ((index * 47) % 1900)

  return {
    ...seed,
    id: index + 1,
    name: branchNumber === 1 ? seed.name : `${seed.name} — ${branchNumber}-filial`,
    tin: String(300_000_000 + (index + 1) * 7_919),
    region: location.region,
    district: location.district,
    address: `${location.district}, ${index % 50 + 1}-uy`,
    score: Number((attendance / 20).toFixed(2)),
    previousRank: (index + 7) % 150 + 1,
    reviews: 42 + (index * 11) % 180,
    children: 48 + (index * 13) % 190,
    completedServices: Math.round(serviceHours / 2),
    serviceHours,
    quality: 86 + (index % 13),
    attendance,
    status: index % 12 === 0 ? 'Vaqtincha to\'xtatilgan' : 'Faol',
    lat: location.lat + ((index % 5) - 2) * 0.035,
    lng: location.lng + ((Math.floor(index / 5) % 5) - 2) * 0.035,
  }
})

const registryDates: Record<number, string> = {
  1: '15.01.2024',
  2: '02.02.2024',
  3: '19.03.2024',
  4: '08.04.2024',
  5: '21.05.2024',
  6: '10.06.2024',
  7: '17.07.2024',
  8: '05.08.2024',
  9: '23.09.2024',
  10: '11.10.2024',
}

const serviceActivityDates: Record<number, string> = {
  1: '2026-06-28',
  2: '2026-06-24',
  3: '2026-06-18',
  4: '2026-06-11',
  5: '2026-05-29',
  6: '2026-05-17',
  7: '2026-05-06',
  8: '2026-04-25',
  9: '2026-04-14',
  10: '2026-04-03',
}

const mapElement = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const selectedRegion = ref('Barcha hududlar')
const selectedStatus = ref('Barcha holatlar')
const startDate = ref('')
const endDate = ref('')
const filtersOpen = ref(false)
const ratingView = ref<'republic' | 'regions'>('republic')
const ratingOrder = ref<'best' | 'worst'>('best')
const sortType = ref<'hours' | 'children' | 'amount' | 'rating'>('hours')
const selectedEntrepreneur = ref<Entrepreneur | null>(null)
const currentPage = ref(1)
const rowsPerPage = 20
const hourlyServiceRate = 115_000
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null

const filteredEntrepreneurs = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('uz')
  const start = toIsoDate(startDate.value)
  const end = toIsoDate(endDate.value)
  return entrepreneurs
    .filter(item => selectedRegion.value === 'Barcha hududlar' || item.region === selectedRegion.value)
    .filter(item => selectedStatus.value === 'Barcha holatlar' || item.status === selectedStatus.value)
    .filter(item => !start || serviceActivityDateFor(item.id) >= start)
    .filter(item => !end || serviceActivityDateFor(item.id) <= end)
    .filter(item => !query || [item.name, item.tin, item.region, item.district].some(value => value.toLocaleLowerCase('uz').includes(query)))
    .sort((a, b) => ratingOrder.value === 'best' ? entrepreneurSortValue(b) - entrepreneurSortValue(a) : entrepreneurSortValue(a) - entrepreneurSortValue(b))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEntrepreneurs.value.length / rowsPerPage)))
const paginatedEntrepreneurs = computed(() => filteredEntrepreneurs.value.slice((currentPage.value - 1) * rowsPerPage, currentPage.value * rowsPerPage))
const totalChildren = computed(() => filteredEntrepreneurs.value.reduce((total, item) => total + item.children, 0))
const attendedChildren = computed(() => filteredEntrepreneurs.value.reduce((total, item) => total + attendedChildrenFor(item), 0))
const calculatedServiceHours = computed(() => filteredEntrepreneurs.value.reduce((total, item) => total + item.serviceHours, 0))
const totalServiceHours = computed(() => filteredEntrepreneurs.value.reduce((total, item) => total + totalHoursFor(item), 0))
const totalCalculatedAmount = computed(() => filteredEntrepreneurs.value.reduce((total, item) => total + calculatedAmount(item), 0))
const totalPotentialAmount = computed(() => totalServiceHours.value * hourlyServiceRate)
const activeCount = computed(() => filteredEntrepreneurs.value.filter(item => item.status === 'Faol').length)
const regionRatings = computed<RegionRating[]>(() => {
  const grouped = new Map<string, Entrepreneur[]>()

  for (const item of filteredEntrepreneurs.value) {
    const group = grouped.get(item.region) ?? []
    group.push(item)
    grouped.set(item.region, group)
  }

  return Array.from(grouped, ([name, items]) => ({
    name,
    entrepreneurCount: items.length,
    activeCount: items.filter(item => item.status === 'Faol').length,
    score: items.reduce((sum, item) => sum + item.score, 0) / items.length,
    children: items.reduce((sum, item) => sum + item.children, 0),
    attendedChildren: items.reduce((sum, item) => sum + attendedChildrenFor(item), 0),
    serviceHours: items.reduce((sum, item) => sum + item.serviceHours, 0),
    totalServiceHours: items.reduce((sum, item) => sum + totalHoursFor(item), 0),
    amount: items.reduce((sum, item) => sum + calculatedAmount(item), 0),
    totalAmount: items.reduce((sum, item) => sum + totalAmountFor(item), 0),
    lat: items.reduce((sum, item) => sum + item.lat, 0) / items.length,
    lng: items.reduce((sum, item) => sum + item.lng, 0) / items.length,
  })).sort((a, b) => ratingOrder.value === 'best' ? regionSortValue(b) - regionSortValue(a) : regionSortValue(a) - regionSortValue(b))
})
const isRegionOverview = computed(() => ratingView.value === 'regions' && selectedRegion.value === 'Barcha hududlar')
const activeFilterCount = computed(() => [
  searchQuery.value.trim(),
  ratingOrder.value !== 'best',
  sortType.value !== 'hours',
  selectedStatus.value !== 'Barcha holatlar',
  startDate.value || endDate.value,
].filter(Boolean).length)

function markerIcon(rank: number, selected: boolean) {
  return L.divIcon({
    className: 'rating-map-marker-wrap',
    html: `<div class="rating-map-marker${selected ? ' is-selected' : ''}"><span>${rank}</span></div>`,
    iconSize: [34, 42],
    iconAnchor: [17, 40],
    popupAnchor: [0, -38],
  })
}

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()

  if (isRegionOverview.value) {
    regionRatings.value.forEach((region, index) => {
      L.marker([region.lat, region.lng], { icon: markerIcon(orderedRank(index, regionRatings.value.length), false) })
        .bindTooltip(`<strong>${region.name}</strong><br>${region.entrepreneurCount} ta tadbirkor<br><b>${formatRegionSortValue(region)}</b> ${sortMetricLabel.value.toLocaleLowerCase('uz')}`, { direction: 'top', offset: [0, -34] })
        .on('click', () => selectRegion(region.name))
        .addTo(markerLayer!)
    })

    if (regionRatings.value.length) {
      const bounds = L.latLngBounds(regionRatings.value.map(region => [region.lat, region.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.25), { maxZoom: 7, animate: true })
    }
    return
  }

  filteredEntrepreneurs.value.forEach((item, index) => {
    const marker = L.marker([item.lat, item.lng], { icon: markerIcon(orderedRank(index, filteredEntrepreneurs.value.length), selectedEntrepreneur.value?.id === item.id) })
      .bindTooltip(`<strong>${item.name}</strong><br>${item.region}, ${item.district}<br><b>${formatEntrepreneurSortValue(item)}</b> ${sortMetricLabel.value.toLocaleLowerCase('uz')}`, { direction: 'top', offset: [0, -34] })
      .on('click', () => { selectedEntrepreneur.value = item })
    marker.addTo(markerLayer!)
  })

  if (!filteredEntrepreneurs.value.length) return
  const bounds = L.latLngBounds(filteredEntrepreneurs.value.map(item => [item.lat, item.lng] as [number, number]))
  map.fitBounds(bounds.pad(0.25), { maxZoom: selectedRegion.value === 'Barcha hududlar' ? 7 : 11, animate: true })
}

function selectRatingView(view: 'republic' | 'regions') {
  ratingView.value = view
  selectedRegion.value = 'Barcha hududlar'
  selectedEntrepreneur.value = null
  currentPage.value = 1
}

function selectRegion(region: string) {
  selectedRegion.value = region
  selectedEntrepreneur.value = null
  currentPage.value = 1
}

function backToRegions() {
  selectedRegion.value = 'Barcha hududlar'
  selectedEntrepreneur.value = null
}

function selectEntrepreneur(item: Entrepreneur) {
  selectedEntrepreneur.value = item
  map?.flyTo([item.lat, item.lng], 12, { duration: 0.8 })
}

function resetFilters() {
  searchQuery.value = ''
  selectedRegion.value = 'Barcha hududlar'
  selectedStatus.value = 'Barcha holatlar'
  ratingOrder.value = 'best'
  sortType.value = 'hours'
  startDate.value = ''
  endDate.value = ''
}

function toIsoDate(value: string) {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value)
  return match ? `${match[3]}-${match[2]}-${match[1]}` : ''
}

function registryDateFor(id: number) {
  if (registryDates[id]) {
    return registryDates[id]
  }

  const date = new Date(Date.UTC(2024, 0, 1 + (id * 11) % 700))
  return `${String(date.getUTCDate()).padStart(2, '0')}.${String(date.getUTCMonth() + 1).padStart(2, '0')}.${date.getUTCFullYear()}`
}

function serviceActivityDateFor(id: number) {
  if (serviceActivityDates[id]) {
    return serviceActivityDates[id]
  }

  return new Date(Date.UTC(2026, 3, 1 + (id * 7) % 90)).toISOString().slice(0, 10)
}

function calculatedAmount(item: Entrepreneur) {
  return item.serviceHours * hourlyServiceRate
}

function totalHoursFor(item: Entrepreneur) {
  return Math.ceil(item.serviceHours * 100 / item.attendance)
}

function attendedChildrenFor(item: Entrepreneur) {
  return Math.round(item.children * item.attendance / 100)
}

function totalAmountFor(item: Entrepreneur) {
  return totalHoursFor(item) * hourlyServiceRate
}

function formatCompactAmount(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString('uz-UZ', { maximumFractionDigits: 2 })} mlrd`
  }

  return `${(value / 1_000_000).toLocaleString('uz-UZ', { maximumFractionDigits: 1 })} mln`
}

function percentage(value: number, total: number) {
  return total ? Math.round(value / total * 100) : 0
}

function orderedRank(index: number, total: number) {
  return ratingOrder.value === 'best' ? index + 1 : total - index
}

const sortMetricLabel = computed(() => ({
  hours: 'Xizmat soatlari',
  children: 'Bolalar soni',
  amount: 'Mablag‘',
  rating: 'Reyting',
}[sortType.value]))

function entrepreneurSortValue(item: Entrepreneur) {
  if (sortType.value === 'children') return attendedChildrenFor(item)
  if (sortType.value === 'amount') return calculatedAmount(item)
  if (sortType.value === 'rating') return item.score
  return item.serviceHours
}

function regionSortValue(region: RegionRating) {
  if (sortType.value === 'children') return region.attendedChildren
  if (sortType.value === 'amount') return region.amount
  if (sortType.value === 'rating') return region.score
  return region.serviceHours
}

function formatEntrepreneurSortValue(item: Entrepreneur) {
  if (sortType.value === 'amount') return formatCompactAmount(calculatedAmount(item))
  if (sortType.value === 'rating') return item.score.toFixed(2)
  return entrepreneurSortValue(item).toLocaleString('uz-UZ')
}

function formatRegionSortValue(region: RegionRating) {
  if (sortType.value === 'amount') return formatCompactAmount(region.amount)
  if (sortType.value === 'rating') return region.score.toFixed(2)
  return regionSortValue(region).toLocaleString('uz-UZ')
}

function exportCsv() {
  if (isRegionOverview.value) {
    const header = ['O‘rin', 'Hudud', 'Tadbirkorlar soni', 'Faol tadbirkorlar', 'O‘rtacha reyting', 'Hisoblangan soatlar', 'Jami soatlar', 'Davomati mavjud bolalar', 'Jami bolalar', 'Hisoblangan mablag‘ (so‘m)', 'Jami mablag‘ (so‘m)']
    const rows = regionRatings.value.map((region, index) => [orderedRank(index, regionRatings.value.length), region.name, region.entrepreneurCount, region.activeCount, region.score.toFixed(2), region.serviceHours, region.totalServiceHours, region.attendedChildren, region.children, region.amount, region.totalAmount])
    const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    link.download = 'hududlar-reytingi.csv'
    link.click()
    URL.revokeObjectURL(link.href)
    return
  }

  const header = ['O‘rin', 'Tadbirkor', 'STIR', 'Reyestrga kiritilgan sana', 'Hudud', 'Tuman', 'Reyting', 'Hisoblangan soatlar', 'Jami soatlar', 'Davomati mavjud bolalar', 'Jami bolalar', 'Hisoblangan mablag‘ (so‘m)', 'Jami mablag‘ (so‘m)', 'Holati']
  const rows = filteredEntrepreneurs.value.map((item, index) => [orderedRank(index, filteredEntrepreneurs.value.length), item.name, item.tin, registryDateFor(item.id), item.region, item.district, item.score, item.serviceHours, totalHoursFor(item), attendedChildrenFor(item), item.children, calculatedAmount(item), totalAmountFor(item), item.status])
  const csv = [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
  link.download = 'tadbirkorlar-reytingi.csv'
  link.click()
  URL.revokeObjectURL(link.href)
}

onMounted(async () => {
  await nextTick()
  if (!mapElement.value) return
  map = L.map(mapElement.value, { zoomControl: false, attributionControl: true }).setView([41.2, 64.5], 6)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 18,
  }).addTo(map)
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  markerLayer = L.layerGroup().addTo(map)
  renderMarkers()
})

onBeforeUnmount(() => {
  map?.remove()
  map = null
})

watch([filteredEntrepreneurs, selectedRegion, selectedEntrepreneur, ratingView], () => {
  currentPage.value = 1
  renderMarkers()
})

watch(totalPages, value => {
  if (currentPage.value > value) currentPage.value = value
})
</script>

<template>
  <PageContainer class="xl:!overflow-y-auto">
    <div class="flex flex-col gap-4">
      <div class="relative z-[1000] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex overflow-hidden rounded-lg border border-border bg-background text-muted-foreground">
            <button
              type="button"
              class="inline-flex h-7 items-center justify-center whitespace-nowrap border-r border-border px-2.5 text-[0.8rem] font-medium outline-none transition-colors duration-150 hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring/50"
              :class="ratingView === 'republic' ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'bg-background text-foreground'"
              @click="selectRatingView('republic')"
            >
              Respublika bo‘yicha
            </button>
            <button
              type="button"
              class="inline-flex h-7 items-center justify-center whitespace-nowrap px-2.5 text-[0.8rem] font-medium outline-none transition-colors duration-150 hover:bg-muted focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring/50"
              :class="ratingView === 'regions' ? 'bg-primary text-primary-foreground hover:bg-primary-hover' : 'bg-background text-foreground'"
              @click="selectRatingView('regions')"
            >
              Hududlar bo‘yicha
            </button>
          </div>
          <Button v-if="ratingView === 'regions' && selectedRegion !== 'Barcha hududlar'" variant="ghost" size="sm" class="gap-1.5" @click="backToRegions">
            <ChevronLeft class="h-4 w-4" /> Barcha hududlar
          </Button>
          <span v-if="ratingView === 'regions' && selectedRegion !== 'Barcha hududlar'" class="text-sm font-medium text-primary">{{ selectedRegion }}</span>
        </div>
        <div class="flex items-center justify-end gap-2">
          <FilterPopover
          v-model:open="filtersOpen"
          :active-count="activeFilterCount"
          button-label="Filtrlar"
          title="Umumiy filtrlar"
          wrapper-class="z-[1000]"
          panel-class="!z-[1000] xl:w-[24rem]"
        >
          <label class="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Qidirish</span>
            <span class="relative block">
              <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input v-model="searchQuery" class="pl-9" placeholder="Nomi, STIR yoki hudud bo‘yicha..." />
            </span>
          </label>
          <label class="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Holati</span>
            <select v-model="selectedStatus" class="filter-select w-full text-foreground"><option>Barcha holatlar</option><option>Faol</option><option>Vaqtincha to‘xtatilgan</option></select>
          </label>
          <label class="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Tartiblash turi</span>
            <select v-model="sortType" class="filter-select w-full text-foreground">
              <option value="hours">Xizmat soatlari</option>
              <option value="children">Bolalar soni</option>
              <option value="amount">Mablag‘</option>
              <option value="rating">Reyting</option>
            </select>
          </label>
          <label class="space-y-1.5 text-xs font-medium text-muted-foreground">
            <span>Tartiblash yo‘nalishi</span>
            <select v-model="ratingOrder" class="filter-select w-full text-foreground">
              <option value="best">Yuqoridan pastga</option>
              <option value="worst">Pastdan yuqoriga</option>
            </select>
          </label>
          <div class="grid gap-2">
            <FilterDateInput v-model="startDate" label="Boshlanish sanasi" />
            <FilterDateInput v-model="endDate" label="Tugash sanasi" />
          </div>
          <template #footer>
            <div class="flex items-center justify-end gap-2 border-t pt-3">
              <Button variant="ghost" size="sm" @click="resetFilters">Tozalash</Button>
              <Button size="sm" @click="filtersOpen = false">Qo‘llash</Button>
            </div>
          </template>
          </FilterPopover>
          <Button variant="outline" size="sm" class="h-7 gap-2" @click="exportCsv">
            <Download class="h-4 w-4" /> Eksport
          </Button>
        </div>
      </div>

      <section class="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <article class="metric-card">
          <span class="metric-icon bg-emerald-50 text-emerald-700"><Building2 class="h-5 w-5" /></span>
          <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><p>Tadbirkorlar</p><span class="metric-badge bg-emerald-50 text-emerald-700">{{ percentage(activeCount, filteredEntrepreneurs.length) }}%</span></div><strong>{{ activeCount }}<span class="metric-secondary"> / {{ filteredEntrepreneurs.length }}</span></strong></div>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-amber-50 text-amber-600"><Clock3 class="h-5 w-5" /></span>
          <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><p>Xizmat soatlari</p><span class="metric-badge bg-amber-50 text-amber-700">{{ percentage(calculatedServiceHours, totalServiceHours) }}%</span></div><strong class="!text-xl">{{ calculatedServiceHours.toLocaleString('uz-UZ') }}<span class="metric-secondary"> / {{ totalServiceHours.toLocaleString('uz-UZ') }}</span></strong></div>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-blue-50 text-blue-600"><Users class="h-5 w-5" /></span>
          <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><p>Bolalar</p><span class="metric-badge bg-blue-50 text-blue-700">{{ percentage(attendedChildren, totalChildren) }}%</span></div><strong class="!text-xl">{{ attendedChildren.toLocaleString('uz-UZ') }}<span class="metric-secondary"> / {{ totalChildren.toLocaleString('uz-UZ') }}</span></strong></div>
        </article>
        <article class="metric-card">
          <span class="metric-icon bg-violet-50 text-violet-600"><Banknote class="h-5 w-5" /></span>
          <div class="min-w-0 flex-1"><div class="flex items-center justify-between gap-2"><p>Mablag‘</p><span class="metric-badge bg-violet-50 text-violet-700">{{ percentage(totalCalculatedAmount, totalPotentialAmount) }}%</span></div><strong class="!text-base">{{ formatCompactAmount(totalCalculatedAmount) }}<span class="metric-secondary"> / {{ formatCompactAmount(totalPotentialAmount) }}</span></strong></div>
        </article>
      </section>

      <section class="min-h-[390px]">
        <div class="relative min-h-[390px] overflow-hidden rounded-xl border bg-muted shadow-sm">
          <div ref="mapElement" class="absolute inset-0 z-0" />
          <div class="absolute bottom-3 left-3 z-[500] rounded-md border bg-background/95 px-3 py-2 text-xs text-muted-foreground shadow-sm backdrop-blur">
            <MapPin class="mr-1 inline h-3.5 w-3.5 text-primary" /> Marker raqami — {{ sortMetricLabel.toLocaleLowerCase('uz') }} bo‘yicha o‘rni
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div class="overflow-x-auto">
          <table v-if="isRegionOverview" class="w-full min-w-[1000px] table-fixed text-sm">
            <colgroup>
              <col class="w-[7%]" />
              <col class="w-[20%]" />
              <col class="w-[12%]" />
              <col class="w-[10%]" />
              <col class="w-[15%]" />
              <col class="w-[12%]" />
              <col class="w-[18%]" />
              <col class="w-[6%]" />
            </colgroup>
            <thead class="bg-muted/60 text-xs text-muted-foreground">
              <tr><th class="px-4 py-3 text-center">O‘RIN</th><th class="px-4 py-3 text-left">HUDUD</th><th class="px-4 py-3 text-center">TADBIRKORLAR</th><th class="px-4 py-3 text-center">REYTING</th><th class="px-4 py-3 text-center">XIZMAT SOATLARI</th><th class="px-4 py-3 text-center">BOLALAR</th><th class="px-4 py-3 text-center">MABLAG‘</th><th class="px-4 py-3" /></tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="(region, index) in regionRatings" :key="region.name" class="cursor-pointer transition hover:bg-muted/40" @click="selectRegion(region.name)">
                <td class="px-4 py-3 text-center"><span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-bold" :class="ratingOrder === 'best' && index < 3 ? 'bg-amber-100 text-amber-700' : ratingOrder === 'worst' ? 'bg-red-50 text-red-700' : 'bg-muted text-muted-foreground'">{{ orderedRank(index, regionRatings.length) }}</span></td>
                <td class="px-4 py-3"><strong class="block font-medium text-foreground">{{ region.name }}</strong><small class="text-muted-foreground">{{ region.activeCount }} ta faol markaz</small></td>
                <td class="px-4 py-3 text-center"><strong class="text-base">{{ region.entrepreneurCount }}</strong><small class="ml-1 text-muted-foreground">ta</small></td>
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center gap-1 font-semibold"><Star class="h-4 w-4 fill-amber-400 text-amber-400" />{{ region.score.toFixed(2) }}</span></td>
                <td class="px-4 py-3 text-center"><span class="block font-medium">{{ region.serviceHours.toLocaleString('uz-UZ') }} / {{ region.totalServiceHours.toLocaleString('uz-UZ') }}</span><small class="text-muted-foreground">{{ percentage(region.serviceHours, region.totalServiceHours) }}%</small></td>
                <td class="px-4 py-3 text-center"><span class="block font-medium">{{ region.attendedChildren }} / {{ region.children }}</span><small class="text-muted-foreground">{{ percentage(region.attendedChildren, region.children) }}%</small></td>
                <td class="whitespace-nowrap px-4 py-3 text-center"><span class="block font-semibold">{{ formatCompactAmount(region.amount) }} / {{ formatCompactAmount(region.totalAmount) }}</span><small class="block text-muted-foreground">{{ percentage(region.amount, region.totalAmount) }}%</small></td>
                <td class="px-4 py-3"><button type="button" class="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="Hudud tadbirkorlarini ko‘rish" @click.stop="selectRegion(region.name)"><Eye class="h-4 w-4" /></button></td>
              </tr>
              <tr v-if="!regionRatings.length"><td colspan="8" class="h-32 text-center text-muted-foreground">Tanlangan mezonlar bo‘yicha hudud topilmadi</td></tr>
            </tbody>
          </table>

          <table v-else class="w-full min-w-[1120px] table-fixed text-sm">
            <colgroup>
              <col class="w-[6%]" />
              <col class="w-[20%]" />
              <col class="w-[13%]" />
              <col class="w-[9%]" />
              <col class="w-[14%]" />
              <col class="w-[12%]" />
              <col class="w-[17%]" />
              <col class="w-[5%]" />
              <col class="w-[4%]" />
            </colgroup>
            <thead class="bg-muted/60 text-xs text-muted-foreground">
              <tr><th class="w-16 px-4 py-3 text-center">O‘RIN</th><th class="px-4 py-3 text-left">TADBIRKOR</th><th class="px-4 py-3 text-left">HUDUD</th><th class="px-4 py-3 text-center">REYTING</th><th class="px-4 py-3 text-center">XIZMAT SOATLARI</th><th class="px-4 py-3 text-center">BOLALAR</th><th class="px-4 py-3 text-center">MABLAG‘</th><th class="px-4 py-3 text-left">HOLATI</th><th class="w-14 px-4 py-3" /></tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="item in paginatedEntrepreneurs" :key="item.id" class="transition hover:bg-muted/40">
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-bold" :class="ratingOrder === 'best' && filteredEntrepreneurs.indexOf(item) < 3 ? 'bg-amber-100 text-amber-700' : ratingOrder === 'worst' ? 'bg-red-50 text-red-700' : 'bg-muted text-muted-foreground'">{{ orderedRank(filteredEntrepreneurs.indexOf(item), filteredEntrepreneurs.length) }}</span>
                </td>
                <td class="px-4 py-3"><button class="min-w-0 max-w-full text-left" @click="selectEntrepreneur(item)"><strong class="block truncate font-medium text-foreground hover:text-primary" :title="item.name">{{ item.name }}</strong><small class="block truncate text-muted-foreground">STIR: {{ item.tin }} · Reyestr: {{ registryDateFor(item.id) }}</small></button></td>
                <td class="px-4 py-3"><span class="block truncate" :title="item.region">{{ item.region }}</span><small class="block truncate text-muted-foreground">{{ item.district }}</small></td>
                <td class="px-4 py-3 text-center"><span class="inline-flex items-center gap-1 font-semibold"><Star class="h-4 w-4 fill-amber-400 text-amber-400" />{{ item.score.toFixed(2) }}</span><span v-if="sortType === 'rating'" class="ml-2 inline-flex text-xs" :class="item.previousRank > orderedRank(filteredEntrepreneurs.indexOf(item), filteredEntrepreneurs.length) ? 'text-emerald-600' : 'text-red-500'"><ArrowUp v-if="item.previousRank > orderedRank(filteredEntrepreneurs.indexOf(item), filteredEntrepreneurs.length)" class="h-3.5 w-3.5" /><ArrowDown v-else class="h-3.5 w-3.5" /></span></td>
                <td class="px-4 py-3 text-center"><span class="block font-medium">{{ item.serviceHours.toLocaleString('uz-UZ') }} / {{ totalHoursFor(item).toLocaleString('uz-UZ') }}</span><small class="text-muted-foreground">{{ percentage(item.serviceHours, totalHoursFor(item)) }}%</small></td>
                <td class="px-4 py-3 text-center"><span class="block font-medium">{{ attendedChildrenFor(item) }} / {{ item.children }}</span><small class="text-muted-foreground">{{ percentage(attendedChildrenFor(item), item.children) }}%</small></td>
                <td class="whitespace-nowrap px-4 py-3 text-center"><span class="block font-semibold text-foreground">{{ formatCompactAmount(calculatedAmount(item)) }} / {{ formatCompactAmount(totalAmountFor(item)) }}</span><small class="block text-muted-foreground">{{ percentage(calculatedAmount(item), totalAmountFor(item)) }}%</small></td>
                <td class="px-4 py-3"><span class="inline-flex rounded-full px-2 py-1 text-xs font-medium" :class="item.status === 'Faol' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'">{{ item.status }}</span></td>
                <td class="px-4 py-3"><button type="button" class="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary" title="Xaritada ko‘rish" @click="selectEntrepreneur(item)"><Eye class="h-4 w-4" /></button></td>
              </tr>
              <tr v-if="!paginatedEntrepreneurs.length"><td colspan="9" class="h-32 text-center text-muted-foreground">Tanlangan mezonlar bo‘yicha tadbirkor topilmadi</td></tr>
            </tbody>
          </table>
        </div>

        <div v-if="!isRegionOverview" class="flex items-center justify-between border-t px-4 py-3 text-xs text-muted-foreground">
          <span>{{ filteredEntrepreneurs.length ? (currentPage - 1) * rowsPerPage + 1 : 0 }}–{{ Math.min(currentPage * rowsPerPage, filteredEntrepreneurs.length) }} / {{ filteredEntrepreneurs.length }}</span>
          <div class="flex items-center gap-2">
            <button class="page-button" :disabled="currentPage === 1" @click="currentPage--"><ChevronLeft class="h-4 w-4" /></button>
            <span class="font-medium text-foreground">{{ currentPage }} / {{ totalPages }}</span>
            <button class="page-button" :disabled="currentPage === totalPages" @click="currentPage++"><ChevronRight class="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </div>
  </PageContainer>
</template>

<style scoped>
@reference "../../../styles/globals.css";

.metric-card { min-height: 5.25rem; @apply flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm; }
.metric-card p { @apply text-xs font-medium text-muted-foreground; }
.metric-card strong { @apply mt-1 block text-2xl font-semibold text-foreground; }
.metric-card small { @apply text-xs text-muted-foreground; }
.metric-icon { @apply flex h-9 w-9 shrink-0 items-center justify-center rounded-lg; }
.metric-badge { @apply inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold; }
.metric-secondary { @apply font-normal text-muted-foreground; }
.filter-select { @apply h-9 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring/30; }
.page-button { @apply flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground transition hover:bg-muted disabled:pointer-events-none disabled:opacity-40; }
:global(.rating-map-marker-wrap) { background: transparent; border: 0; }
:global(.rating-map-marker) { position: relative; display: flex; width: 34px; height: 34px; align-items: center; justify-content: center; border: 3px solid white; border-radius: 999px 999px 999px 3px; background: #14936f; color: white; font-size: 12px; font-weight: 700; box-shadow: 0 4px 14px rgb(15 23 42 / .25); transform: rotate(-45deg); }
:global(.rating-map-marker span) { transform: rotate(45deg); }
:global(.rating-map-marker.is-selected) { background: #f59e0b; transform: rotate(-45deg) scale(1.14); }
:global(.leaflet-container) { background: #e9f1ed; font-family: inherit; }
:global(.leaflet-control-attribution) { font-size: 9px; }
</style>
