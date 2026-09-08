<script lang="ts">
import type { Mermaid, MermaidConfig } from 'mermaid'

// This packaged entry has its own configuration modules. Other NASP pages use
// Mermaid's default core entry with different security/theme settings.
let isolatedMermaid: Promise<Mermaid> | undefined
let guideRenderQueue: Promise<void> = Promise.resolve()
let guideRenderNumber = 0
function getGuideMermaid() {
  if (!isolatedMermaid) {
    // @ts-expect-error Mermaid ships this isolated ESM entry without a matching .d.ts file.
    isolatedMermaid = import('mermaid/dist/mermaid.esm.mjs').then((module) => module.default as Mermaid).catch((error: unknown) => { isolatedMermaid = undefined; throw error })
  }
  return isolatedMermaid!
}
function queueGuideRender<T>(operation: () => Promise<T>): Promise<T> {
  const next = guideRenderQueue.then(operation, operation)
  guideRenderQueue = next.then(() => undefined, () => undefined)
  return next
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight, Ban, CircleCheck, CircleX, Clock3, Download, Expand, LoaderCircle, RotateCcw, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { useTheme } from '@/shared/composables/use-theme'
import { guideToneClasses, guideToneLabels, withGuideSemanticPalette } from '../guide-semantics'
import type { GuideTone } from '../guides-types'

const props = defineProps<{ definition: string; title: string; description?: string }>()
const { isDark } = useTheme()
const viewport = ref<HTMLDivElement>()
const markup = ref('')
const loading = ref(true)
const error = ref('')
const downloadNotice = ref('')
const minimumZoom = 0.05
const zoom = ref(1)
const naturalWidth = ref(700)
const naturalHeight = ref(450)
const fitEnabled = ref(true)
const instanceId = `palliative-guide-${Math.random().toString(36).slice(2)}`
const legend = [
  { tone: 'success', icon: CircleCheck }, { tone: 'rejected', icon: CircleX },
  { tone: 'cancelled', icon: Ban }, { tone: 'waiting', icon: Clock3 }, { tone: 'action', icon: ArrowRight },
] satisfies { tone: GuideTone; icon: typeof CircleCheck }[]
const semanticDefinition = computed(() => withGuideSemanticPalette(props.definition, isDark.value))
const textAlternative = computed(() => `${props.description || `${props.title} bo‘yicha bosqichlar va qaror yo‘llari. Strelkalar keyingi bosqichni, shart yozuvlari esa qaror yo‘nalishini ko‘rsatadi.`} Yashil: tasdiqlash yoki bajarilgan; qizil: rad etish yoki cheklov; kulrang: bekor qilish; amber: kutish yoki qayta ko‘rish; ko‘k: oddiy amal. Har bir tugunda ma’nosi matn bilan ham yozilgan.`)
const chartSize = computed(() => ({ width: `${Math.ceil(naturalWidth.value * zoom.value)}px`, height: `${Math.ceil(naturalHeight.value * zoom.value)}px` }))
const zoomPercent = computed(() => Math.round(zoom.value * 100))
let mounted = false
let requestNumber = 0
let resizeObserver: ResizeObserver | undefined
const dragging = ref(false)
let dragOrigin: { x: number; y: number; left: number; top: number } | undefined

function configuration(dark: boolean): MermaidConfig {
  return {
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    theme: 'base',
    fontFamily: 'Arial, sans-serif',
    htmlLabels: false,
    flowchart: { htmlLabels: false, useMaxWidth: false, curve: 'linear', nodeSpacing: 35, rankSpacing: 58, padding: 18, wrappingWidth: 230 },
    themeVariables: {
      darkMode: dark,
      background: dark ? '#17211f' : '#ffffff',
      primaryColor: dark ? '#172554' : '#eff6ff',
      primaryTextColor: dark ? '#bfdbfe' : '#1e40af',
      primaryBorderColor: dark ? '#60a5fa' : '#3b82f6',
      secondaryColor: dark ? '#223849' : '#f0f6fc',
      secondaryTextColor: dark ? '#e4effa' : '#25465e',
      secondaryBorderColor: dark ? '#577c9c' : '#96b2cd',
      tertiaryColor: dark ? '#403928' : '#fff8e8',
      tertiaryTextColor: dark ? '#f6ecd5' : '#645128',
      tertiaryBorderColor: dark ? '#9e8b59' : '#d2bb7a',
      lineColor: dark ? '#94a3b8' : '#64748b',
      textColor: dark ? '#e2e8f0' : '#334155',
      edgeLabelBackground: dark ? '#17211f' : '#ffffff',
      clusterBkg: dark ? '#1d2d27' : '#f8faf9',
      clusterBorder: dark ? '#496354' : '#cfddd5',
      fontSize: '16px',
    },
  }
}

function validateSvg(source: string, renderId: string, title: string, description: string, dark: boolean) {
  const document = new DOMParser().parseFromString(source, 'image/svg+xml')
  const svg = document.documentElement
  if (document.querySelector('parsererror') || svg.localName !== 'svg' || svg.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('SVG tuzilishi yaroqsiz.')
  if (svg.querySelector('script, foreignObject, iframe, object, embed')) throw new Error('SVG matnli va mustaqil ko‘rinishda bo‘lishi kerak.')
  for (const element of [svg, ...Array.from(svg.querySelectorAll('*'))]) {
    for (const attribute of Array.from(element.attributes)) {
      if (/^on/i.test(attribute.name) || ((attribute.localName === 'href' || attribute.name === 'xlink:href') && attribute.value && !attribute.value.startsWith('#'))) element.removeAttribute(attribute.name)
    }
  }
  const viewBox = svg.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number)
  const width = viewBox?.length === 4 ? viewBox[2]! : Number.parseFloat(svg.getAttribute('width') ?? '')
  const height = viewBox?.length === 4 ? viewBox[3]! : Number.parseFloat(svg.getAttribute('height') ?? '')
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 || width > 100000 || height > 100000) throw new Error('SVG o‘lchami aniqlanmadi.')
  if (!viewBox) svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('style', `display:block;max-width:none;background:${dark ? '#17211f' : '#ffffff'}`)
  svg.setAttribute('role', 'img')
  svg.setAttribute('aria-labelledby', `${renderId}-title ${renderId}-description`)
  svg.setAttribute('focusable', 'false')
  for (const child of Array.from(svg.children)) if (child.localName === 'title' || child.localName === 'desc') child.remove()
  for (const [tag, id, value] of [['title', `${renderId}-title`, title], ['desc', `${renderId}-description`, description]]) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag!)
    element.setAttribute('id', id!); element.textContent = value!; svg.insertBefore(element, svg.firstChild)
  }
  return { svg: new XMLSerializer().serializeToString(svg), width, height }
}

function fitWidth() {
  fitEnabled.value = true
  const available = Math.max(1, (viewport.value?.clientWidth ?? 740) - 48)
  // Start with the overall flow visible on narrow screens; manual zoom reveals labels.
  zoom.value = Math.min(1, Math.max(minimumZoom, available / naturalWidth.value))
  void nextTick(() => { if (viewport.value) viewport.value.scrollLeft = 0 })
}
function fitAll() {
  const element = viewport.value
  if (!element) return
  fitEnabled.value = false
  zoom.value = Math.min(1, Math.max(minimumZoom, Math.min((element.clientWidth - 48) / naturalWidth.value, (element.clientHeight - 48) / naturalHeight.value)))
  void nextTick(() => { element.scrollLeft = 0; element.scrollTop = 0 })
}
function setZoom(value: number) {
  const element = viewport.value
  const previous = zoom.value
  const centerX = (element?.scrollLeft ?? 0) + (element?.clientWidth ?? 0) / 2 - 24
  const centerY = (element?.scrollTop ?? 0) + Math.min(element?.clientHeight ?? 0, naturalHeight.value * previous + 48) / 2 - 24
  fitEnabled.value = false
  zoom.value = Math.min(3, Math.max(minimumZoom, Math.round(value * 100) / 100))
  void nextTick(() => { if (element) { element.scrollLeft = centerX * zoom.value / previous + 24 - element.clientWidth / 2; element.scrollTop = centerY * zoom.value / previous + 24 - element.clientHeight / 2 } })
}
function startPan(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || !markup.value || !viewport.value) return
  dragging.value = true
  dragOrigin = { x: event.clientX, y: event.clientY, left: viewport.value.scrollLeft, top: viewport.value.scrollTop }
  viewport.value.setPointerCapture(event.pointerId)
  viewport.value.focus({ preventScroll: true })
  event.preventDefault()
}
function movePan(event: PointerEvent) {
  if (!dragOrigin || !viewport.value) return
  viewport.value.scrollLeft = dragOrigin.left - (event.clientX - dragOrigin.x)
  viewport.value.scrollTop = dragOrigin.top - (event.clientY - dragOrigin.y)
}
function stopPan() { dragging.value = false; dragOrigin = undefined }
function onKeydown(event: KeyboardEvent) {
  if (event.target !== viewport.value || !markup.value || loading.value) return
  if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom.value + 0.1) }
  else if (event.key === '-') { event.preventDefault(); setZoom(zoom.value - 0.1) }
  else if (event.key === '0') { event.preventDefault(); setZoom(1) }
}

async function renderChart(resetZoom = false) {
  if (!mounted) return
  const request = ++requestNumber
  const definition = semanticDefinition.value
  const title = props.title
  const description = textAlternative.value
  const dark = isDark.value
  loading.value = true; error.value = ''; markup.value = ''; downloadNotice.value = ''
  if (resetZoom) fitEnabled.value = true
  try {
    const result = await queueGuideRender(async () => {
      if (!mounted || request !== requestNumber) return undefined
      const mermaid = await getGuideMermaid()
      if (!mounted || request !== requestNumber) return undefined
      mermaid.initialize(configuration(dark))
      const staging = window.document.createElement('div')
      staging.setAttribute('aria-hidden', 'true')
      staging.style.cssText = 'position:fixed;left:-20000px;top:0;width:1400px;opacity:0;pointer-events:none;'
      window.document.body.appendChild(staging)
      const renderId = `${instanceId}-${++guideRenderNumber}`
      try {
        const output = await mermaid.render(renderId, definition, staging)
        return validateSvg(output.svg, renderId, title, description, dark)
      } finally { staging.remove() }
    })
    if (!mounted || request !== requestNumber || !result) return
    naturalWidth.value = result.width; naturalHeight.value = result.height; markup.value = result.svg
    await nextTick()
    if (!mounted || request !== requestNumber) return
    if (fitEnabled.value) fitWidth()
  } catch {
    if (mounted && request === requestNumber) error.value = 'Sxemani ko‘rsatib bo‘lmadi. Qayta urinishingiz yoki quyidagi matnli manbani ko‘rishingiz mumkin.'
  } finally { if (mounted && request === requestNumber) loading.value = false }
}

function downloadSvg() {
  if (!markup.value || loading.value || error.value) return
  const fileName = props.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'qollanma-sxemasi'
  const blob = new Blob([markup.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = url; link.download = `${fileName}.svg`
  document.body.appendChild(link); link.click(); link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
  downloadNotice.value = 'SVG fayl yuklash uchun tayyorlandi.'
}

watch([() => props.definition, () => props.title, () => props.description, isDark], (current, previous) => { void renderChart(current[0] !== previous[0]) }, { flush: 'post' })
onMounted(() => {
  mounted = true
  if (typeof ResizeObserver !== 'undefined' && viewport.value) { resizeObserver = new ResizeObserver(() => { if (fitEnabled.value && markup.value) fitWidth() }); resizeObserver.observe(viewport.value) }
  void renderChart(true)
})
onBeforeUnmount(() => { mounted = false; requestNumber++; resizeObserver?.disconnect() })
</script>

<template>
  <figure class="guide-flowchart overflow-hidden rounded-xl border border-border bg-card" :aria-labelledby="`${instanceId}-caption`">
    <figcaption :id="`${instanceId}-caption`" class="sr-only">{{ title }}. {{ textAlternative }}</figcaption>
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
      <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Sxema o‘lchami"><button type="button" class="flow-button" :disabled="loading || !markup || zoom <= minimumZoom" aria-label="Sxemani kichraytirish" @click="setZoom(zoom - 0.1)"><ZoomOut class="h-4 w-4" /></button><span class="min-w-12 text-center text-xs tabular-nums" aria-live="polite">{{ zoomPercent }}%</span><button type="button" class="flow-button" :disabled="loading || !markup || zoom >= 3" aria-label="Sxemani kattalashtirish" @click="setZoom(zoom + 0.1)"><ZoomIn class="h-4 w-4" /></button><button type="button" class="flow-button" :disabled="loading || !markup" @click="setZoom(1)">Asl o‘lcham</button><button type="button" class="flow-button" :disabled="loading || !markup" @click="fitWidth"><Expand class="h-4 w-4" />Kenglikka moslash</button><button type="button" class="flow-button" :disabled="loading || !markup" @click="fitAll">To‘liq ko‘rish</button></div>
      <button type="button" class="flow-button" :disabled="loading || !markup || Boolean(error)" @click="downloadSvg"><Download class="h-4 w-4" />SVG yuklash</button>
    </div>
    <ul class="flex flex-wrap gap-2 border-b border-border px-4 py-3" aria-label="Sxemadagi ranglar ma’nosi"><li v-for="item in legend" :key="item.tone" :class="['inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium leading-5', guideToneClasses[item.tone]]"><component :is="item.icon" class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{{ guideToneLabels[item.tone] }}</li></ul>
    <div ref="viewport" :class="['flow-viewport', { 'flow-dragging': dragging }]" tabindex="0" role="region" :aria-label="`${title}: sxemani strelka tugmalari bilan surish, + va − bilan kattalashtirish mumkin`" :aria-busy="loading" @keydown="onKeydown" @pointerdown="startPan" @pointermove="movePan" @pointerup="stopPan" @pointercancel="stopPan" @lostpointercapture="stopPan">
      <div v-if="loading" role="status" class="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-10 text-sm text-muted-foreground"><LoaderCircle class="h-6 w-6 animate-spin" />Sxema tayyorlanmoqda…</div>
      <div v-else-if="error" class="flex min-h-64 flex-col items-center justify-center gap-4 px-6 py-10 text-center"><p role="alert" class="max-w-md text-sm leading-6 text-muted-foreground">{{ error }}</p><button type="button" class="flow-button" @click="renderChart(true)"><RotateCcw class="h-4 w-4" />Qayta urinish</button></div>
      <div v-else class="flow-canvas"><div class="flow-svg" :style="chartSize" v-html="markup" /></div>
    </div>
    <div class="border-t border-border px-5 py-3"><p class="text-[11px] leading-5 text-muted-foreground">Sxemani kattalashtiring; sichqoncha bilan ushlab suring yoki strelka tugmalaridan foydalaning.</p><p v-if="downloadNotice" role="status" class="mt-1 text-xs text-primary">{{ downloadNotice }}</p><details class="mt-2"><summary class="cursor-pointer text-xs font-medium text-muted-foreground">Mermaid manbasi</summary><pre class="mt-3 max-h-72 overflow-auto rounded-lg bg-muted p-4 text-xs leading-6 whitespace-pre-wrap">{{ semanticDefinition }}</pre></details></div>
  </figure>
</template>

<style scoped>
.flow-button { display:inline-flex; align-items:center; justify-content:center; gap:7px; min-height:34px; padding:7px 10px; border:1px solid var(--border); border-radius:7px; background:var(--card); font-size:11px; line-height:18px; font-weight:500; }
.flow-button:hover:not(:disabled) { background:var(--muted); }.flow-button:disabled { opacity:.4; cursor:not-allowed; }
.flow-button:focus-visible,.flow-viewport:focus-visible,summary:focus-visible { outline:2px solid var(--primary); outline-offset:3px; }
.flow-viewport { min-height:280px; max-height:min(72vh,720px); overflow:auto; overscroll-behavior:contain; background:var(--muted); scrollbar-gutter:stable; cursor:grab; }
.flow-dragging { cursor:grabbing; user-select:none; }
.flow-canvas { display:flex; justify-content:center; width:max-content; min-width:100%; padding:24px; box-sizing:border-box; }
.flow-svg { flex:none; }.flow-svg :deep(svg) { width:100%; height:100%; max-width:none !important; }
@media print { .guide-flowchart { break-inside:auto; }.flow-button,.flow-viewport+div { display:none; }.flow-viewport { overflow:visible; max-height:none; }.flow-canvas { padding:8px; min-width:0; max-width:100%; }.flow-svg { width:100% !important; height:auto !important; }.flow-svg :deep(svg) { height:auto; } }
</style>
