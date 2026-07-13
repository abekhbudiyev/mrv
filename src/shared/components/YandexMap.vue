<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export type YandexMapCoordinates = [number, number]

export interface YandexMapMarker {
  coordinates: YandexMapCoordinates
  title?: string
  description?: string
}

interface YandexMapsApi {
  Map: new (
    element: HTMLElement,
    state: { center: YandexMapCoordinates; zoom: number; controls: string[] },
  ) => YandexMapInstance
  GeoObjectCollection: new () => YandexGeoObjectCollection
  Placemark: new (
    coordinates: YandexMapCoordinates,
    properties: { balloonContentHeader?: string; balloonContentBody?: string },
  ) => unknown
  ready: (callback: () => void) => void
}

interface YandexMapInstance {
  destroy: () => void
  geoObjects: {
    add: (collection: YandexGeoObjectCollection) => void
  }
  setCenter: (coordinates: YandexMapCoordinates, zoom?: number) => void
}

interface YandexGeoObjectCollection {
  add: (object: unknown) => void
  removeAll: () => void
}

declare global {
  interface Window {
    ymaps?: YandexMapsApi
    __yandexMapsPromise?: Promise<YandexMapsApi>
  }
}

const props = withDefaults(defineProps<{
  center?: YandexMapCoordinates
  zoom?: number
  height?: string
  markers?: YandexMapMarker[]
}>(), {
  center: () => [41.311081, 69.240562],
  zoom: 12,
  height: '360px',
  markers: () => [],
})

const mapElement = ref<HTMLElement | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

let mapInstance: YandexMapInstance | null = null
let markerCollection: YandexGeoObjectCollection | null = null

function loadYandexMaps(): Promise<YandexMapsApi> {
  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim()

  if (!apiKey) {
    return Promise.reject(new Error('Yandex Maps API kaliti sozlanmagan.'))
  }

  if (window.ymaps) {
    return Promise.resolve(window.ymaps)
  }

  if (window.__yandexMapsPromise) {
    return window.__yandexMapsPromise
  }

  window.__yandexMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const language = import.meta.env.VITE_YANDEX_MAPS_LANG?.trim() || 'ru_RU'

    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(apiKey)}&lang=${encodeURIComponent(language)}`
    script.async = true
    script.onload = () => {
      if (!window.ymaps) {
        reject(new Error('Yandex Maps kutubxonasi yuklanmadi.'))
        return
      }

      window.ymaps.ready(() => resolve(window.ymaps as YandexMapsApi))
    }
    script.onerror = () => reject(new Error('Yandex Maps serveriga ulanib bo‘lmadi.'))
    document.head.appendChild(script)
  })

  return window.__yandexMapsPromise
}

function renderMarkers(ymaps: YandexMapsApi) {
  if (!markerCollection) {
    markerCollection = new ymaps.GeoObjectCollection()
    mapInstance?.geoObjects.add(markerCollection)
  }

  markerCollection.removeAll()

  props.markers.forEach((marker) => {
    markerCollection?.add(new ymaps.Placemark(marker.coordinates, {
      balloonContentHeader: marker.title,
      balloonContentBody: marker.description,
    }))
  })
}

async function initializeMap() {
  if (!mapElement.value || mapInstance) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const ymaps = await loadYandexMaps()

    mapInstance = new ymaps.Map(mapElement.value, {
      center: props.center,
      zoom: props.zoom,
      controls: ['zoomControl', 'fullscreenControl', 'geolocationControl'],
    })
    renderMarkers(ymaps)
  }
  catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Xaritani yuklashda xatolik yuz berdi.'
  }
  finally {
    isLoading.value = false
  }
}

watch(
  () => [props.center, props.zoom] as const,
  ([center, zoom]) => mapInstance?.setCenter(center, zoom),
  { deep: true },
)

watch(
  () => props.markers,
  async () => {
    if (mapInstance) {
      renderMarkers(await loadYandexMaps())
    }
  },
  { deep: true },
)

onMounted(initializeMap)

onBeforeUnmount(() => {
  mapInstance?.destroy()
  mapInstance = null
  markerCollection = null
})
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-xl border border-border bg-muted/30"
    :style="{ height }"
  >
    <div
      ref="mapElement"
      class="h-full w-full"
      aria-label="Yandex xaritasi"
    />

    <div
      v-if="isLoading"
      class="absolute inset-0 grid place-items-center bg-background/80 text-sm text-muted-foreground"
    >
      Xarita yuklanmoqda...
    </div>

    <div
      v-else-if="errorMessage"
      class="absolute inset-0 grid place-items-center bg-background px-6 text-center text-sm text-destructive"
      role="alert"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>
