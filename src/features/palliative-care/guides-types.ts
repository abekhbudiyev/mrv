export type GuideView = 'read' | 'steps' | 'flowchart' | 'fields' | 'troubleshooting' | 'rules' | 'faq' | 'examples'
export type GuideTone = 'action' | 'success' | 'rejected' | 'cancelled' | 'waiting'
export interface GuideSection { title: string; paragraphs: string[] }
export interface GuideStep { title: string; actor: string; action: string; result: string; route?: string }
export interface GuideRule { condition: string; action: string; owner: string; basis: string; tone?: GuideTone }
export interface GuideQuestion { question: string; answer: string }
export interface GuideSource { label: string; page?: number }
export interface GuideField { name: string; location: string; requirement: string; meaning: string; example: string }
export interface GuideTroubleshooting { problem: string; reason: string; solution: string; tone?: GuideTone }
export interface GuideFlow { id: string; title: string; description: string; definition: string; walkthrough: string[] }
export interface GuideDetail {
  prerequisites: string[]
  sections: GuideSection[]
  steps: GuideStep[]
  rules: GuideRule[]
  faq: GuideQuestion[]
  checklist: string[]
  fields: GuideField[]
  troubleshooting: GuideTroubleshooting[]
  outcomes: string[]
  relatedTopics: string[]
  flows: GuideFlow[]
}
export interface GuideTopic {
  id: string
  title: string
  summary: string
  category: 'start' | 'care' | 'management'
  roles: string[]
  sections: GuideSection[]
  steps: GuideStep[]
  checklist: string[]
  rules: GuideRule[]
  faq: GuideQuestion[]
  scenarioCodes: string[]
  sources: GuideSource[]
  flowchart: string
  detail?: GuideDetail
}
export interface GuideRole { id: string; title: string; description: string }
export interface GuideTerm { term: string; description: string }
