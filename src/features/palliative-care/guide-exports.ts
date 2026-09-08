import type { GuideRole, GuideTerm, GuideTopic } from './guides-types'

export interface GuideExportContext {
  roleLabels?: Record<string, string>
  scenarioLabels?: Record<string, string>
  scenarioDetails?: Record<string, { summary: string; checkpoints: string[] }>
  baseUrl?: string
  topicLabels?: Record<string, string>
  glossary?: GuideTerm[]
  roles?: GuideRole[]
}

function markdownText(value: string) { return value.replace(/\\/g, '\\\\').replace(/([`*_{}\[\]()#+.!|<>~-])/g, '\\$1').replace(/\r\n?/g, '\n') }
function cell(value: string) { return markdownText(value).replace(/\n/g, '<br>') }
function routeUrl(value: string) { return encodeURI(value).replace(/\(/g, '%28').replace(/\)/g, '%29') }
function linkUrl(route: string, context: GuideExportContext) {
  if (context.baseUrl) {
    try {
      const base = new URL(context.baseUrl)
      if (base.protocol === 'https:' || base.protocol === 'http:') return routeUrl(new URL(route, base.origin).href)
    } catch { /* Without a valid web origin, preserve the app-relative route. */ }
  }
  return routeUrl(route)
}
function filename(value: string) { return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'qollanma' }
function mermaidBlock(value: string) {
  const longest = Math.max(2, ...(value.match(/`+/g) ?? []).map((part) => part.length))
  const fence = '`'.repeat(longest + 1)
  return `${fence}mermaid\n${value.trim()}\n${fence}`
}

function topicMarkdown(topic: GuideTopic, level: number, context: GuideExportContext) {
  const h = (offset: number, title: string) => `${'#'.repeat(level + offset)} ${markdownText(title)}`
  const output: string[] = [h(0, topic.title), markdownText(topic.summary)]
  if (topic.roles.length) output.push(`**Kimlar uchun:** ${topic.roles.map((role) => markdownText(context.roleLabels?.[role] ?? role)).join(', ')}`)
  if (topic.detail?.prerequisites.length) output.push(h(1, 'Boshlashdan oldin'), topic.detail.prerequisites.map(item => `- ${markdownText(item)}`).join('\n'))
  for (const section of topic.sections) output.push(h(1, section.title), ...section.paragraphs.map(markdownText))
  if (topic.steps.length) {
    output.push(h(1, 'Bosqichma-bosqich bajarish'))
    topic.steps.forEach((step, index) => {
      output.push(h(2, `${index + 1}. ${step.title}`), `**Mas’ul:** ${markdownText(step.actor)}`, `**Amal:** ${markdownText(step.action)}`, `**Natija:** ${markdownText(step.result)}`)
      if (step.route) output.push(`**Ish oynasi:** [Tegishli ish oynasini ochish](${linkUrl(step.route, context)})`)
    })
  }
  if (topic.checklist.length) output.push(h(1, 'Tekshirish ro‘yxati'), topic.checklist.map((item) => `- [ ] ${markdownText(item)}`).join('\n'))
  if (topic.detail?.fields.length) {
    output.push(h(1, 'Maydonlar va to‘ldirish namunalari'))
    for (const field of topic.detail.fields) output.push(h(2, field.name), `**Qayerda:** ${markdownText(field.location)}`, `**Talab:** ${markdownText(field.requirement)}`, markdownText(field.meaning), `**Namuna:** ${markdownText(field.example)}`)
  }
  if (topic.rules.length) {
    output.push(h(1, 'Shartlar va qarorlar'), ['| Shart / holat | Amal | Mas’ul | Asos |', '| --- | --- | --- | --- |', ...topic.rules.map((rule) => `| ${cell(rule.condition)} | ${cell(rule.action)} | ${cell(rule.owner)} | ${cell(rule.basis)} |`)].join('\n'))
  }
  if (topic.faq.length) {
    output.push(h(1, 'Savollar va javoblar'))
    for (const entry of topic.faq) output.push(h(2, entry.question), markdownText(entry.answer))
  }
  if (topic.detail?.troubleshooting.length) {
    output.push(h(1, 'Xatolar va yechimlar'))
    for (const issue of topic.detail.troubleshooting) output.push(h(2, issue.problem), `**Sabab:** ${markdownText(issue.reason)}`, `**Yechim:** ${markdownText(issue.solution)}`)
  }
  if (topic.detail?.flows.length) {
    output.push(h(1, 'Batafsil jarayon sxemalari'))
    for (const flow of topic.detail.flows) output.push(h(2, flow.title), markdownText(flow.description), mermaidBlock(flow.definition), h(3, 'Bosqichlar va tarmoqlar izohi'), flow.walkthrough.map((item,index) => `${index + 1}. ${markdownText(item)}`).join('\n'))
  }
  if (topic.flowchart.trim()) output.push(h(1, 'Jarayon blok-sxemasi'), 'Quyidagi Mermaid ta’rifi blok-sxemaning matnli ko‘rinishidir.', mermaidBlock(topic.flowchart))
  if (topic.scenarioCodes.length) output.push(h(1, 'Bog‘liq demo misollar'), `[Tizimdagi demo misollar ro‘yxati](${linkUrl('/apps/palliative-care/cases?view=scenarios', context)})`, topic.scenarioCodes.map((code) => {
    const label = markdownText(context.scenarioLabels?.[code] ?? code)
    const route = `/apps/palliative-care/cases/demo-case-${code.toLowerCase().replace(/_/g, '-')}`
    const detail = context.scenarioDetails?.[code]
    const link = `[${label}](${linkUrl(route, context)})`
    return detail ? `${link}\n\n${markdownText(detail.summary)}\n\n**Ushbu misolda tekshiring:**\n\n${detail.checkpoints.map((item, index) => `${index + 1}. ${markdownText(item)}`).join('\n')}` : `- ${link}`
  }).join('\n\n'))
  if (topic.sources.length) output.push(h(1, 'Manbalar va asoslar'), topic.sources.map((source) => {
    if (source.page === undefined) return `- ${markdownText(source.label)}`
    const label = `${markdownText(source.label)} — PDF ${source.page}-bet`
    const route = `/guides/316-son-buyruq-31-07-2026.pdf#page=${source.page}`
    return `- [${label}](${linkUrl(route, context)})`
  }).join('\n'))
  if (topic.detail?.outcomes.length) output.push(h(1, 'Yakunida tekshiriladigan natijalar'), topic.detail.outcomes.map(item => `- ${markdownText(item)}`).join('\n'))
  if (topic.detail?.relatedTopics.length) output.push(h(1, 'Bog‘liq qo‘llanmalar'), topic.detail.relatedTopics.map(id => `- [${markdownText(context.topicLabels?.[id] ?? id)}](${linkUrl(`/apps/palliative-care/guides?topic=${encodeURIComponent(id)}`, context)})`).join('\n'))
  output.push('Qo‘llanma frontend demo jarayonini tushuntiradi. Namunalardagi barcha shaxslar va qaydlar sun’iy; amallar faqat ochiq demo sessiyasida bajariladi.')
  return output.join('\n\n')
}

/** Portable, escaped Markdown; includes all content and the exact local Mermaid source. */
function referenceMarkdown(context: GuideExportContext) {
  const glossary = context.glossary?.length ? `\n\n## Atamalar lug‘ati\n\n${context.glossary.map(entry => `### ${markdownText(entry.term)}\n\n${markdownText(entry.description)}`).join('\n\n')}` : ''
  const roles = context.roles?.length ? `\n\n## Rollar va mas’uliyatlar\n\n${context.roles.map(entry => `### ${markdownText(entry.title)}\n\n${markdownText(entry.description)}`).join('\n\n')}` : ''
  return `${glossary}${roles}`
}
export function guideToMarkdown(topic: GuideTopic, context: GuideExportContext = {}): string { return `${topicMarkdown(topic, 1, context)}${referenceMarkdown(context)}\n` }
export function guidesToMarkdown(topics: GuideTopic[], context: GuideExportContext = {}): string {
  return `# Bolalar palliativ yordami — qo‘llanmalar\n\n${topics.map((topic) => topicMarkdown(topic, 2, context)).join('\n\n---\n\n')}${referenceMarkdown(context)}\n`
}
function downloadMarkdown(contents: string, name: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: 'text/markdown;charset=utf-8' }))
  const link = document.createElement('a'); link.href = url; link.download = name
  document.body.appendChild(link); link.click(); link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
}
export function downloadGuideMarkdown(topic: GuideTopic, context: GuideExportContext = {}): void { downloadMarkdown(guideToMarkdown(topic, context), `${filename(topic.title)}.md`) }
export function downloadGuidesMarkdown(topics: GuideTopic[], context: GuideExportContext = {}): void { downloadMarkdown(guidesToMarkdown(topics, context), 'bolalar-palliativ-yordami-qollanmalar.md') }
