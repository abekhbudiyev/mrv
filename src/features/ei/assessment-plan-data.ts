import {
  formatAge,
  getAssessmentChild,
  getCorrectedAgeMonths,
  type AssessmentRecord,
} from '@/features/ei/assessment-data'
import { eiRecordsByPageKey, type EiRecord } from '@/features/ei/data'

const PLAN_STORAGE_KEY = 'nasp.ei.assessment-plans.v1'

function loadAssessmentPlans(): EiRecord[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = window.localStorage.getItem(PLAN_STORAGE_KEY)
    return saved ? JSON.parse(saved) as EiRecord[] : []
  }
  catch {
    return []
  }
}

const assessmentPlanRecords = loadAssessmentPlans()

function getPlanList() {
  return eiRecordsByPageKey['service-plans']
    ?? (eiRecordsByPageKey['service-plans'] = [])
}

function syncAssessmentPlans() {
  const plans = getPlanList()

  for (const plan of [...assessmentPlanRecords].reverse()) {
    if (!plans.some((item) => item.id === plan.id)) {
      plans.unshift(plan)
    }
  }
}

function persistAssessmentPlans() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(assessmentPlanRecords))
  }
}

syncAssessmentPlans()

export function createAssessmentPlanRecord(
  record: AssessmentRecord,
  goals: Array<{ domainLabel: string, title: string, duration: string }>,
) {
  const child = getAssessmentChild(record.childId)

  if (!child) {
    return
  }

  const planId = `EA-PLN-${record.id.replace('BAH-', '')}`
  const existingPlan = assessmentPlanRecords.find((plan) => plan.id === planId)

  if (existingPlan) {
    return existingPlan
  }

  const createdDate = new Date().toLocaleDateString('en-CA')
  const dueDateValue = new Date(`${createdDate}T12:00:00`)
  dueDateValue.setMonth(dueDateValue.getMonth() + 3)
  const referenceAge = getCorrectedAgeMonths(
    child.birthDate,
    record.assessmentDate,
    child.gestationalWeek,
  )
  const plan: EiRecord = {
    id: planId,
    title: child.fullName,
    subject: 'Individual rivojlanish rejasi',
    region: child.region,
    district: child.district,
    owner: record.assessor,
    status: 'Loyiha',
    tone: 'info',
    submittedAt: createdDate,
    dueAt: dueDateValue.toLocaleDateString('en-CA'),
    nextAction: 'Maqsad va mashg‘ulotlarni oila bilan kelishish',
    summary: `${record.instrument} natijasidan ${goals.length} ta ustuvor rivojlanish maqsadi shakllantirildi.`,
    metadata: [
      { label: 'Baholash', value: `${record.id} · ${record.instrument}` },
      { label: 'Tuzatilgan yosh', value: formatAge(referenceAge) },
      ...goals.map((goal, index) => ({
        label: `Maqsad ${index + 1}`,
        value: `${goal.domainLabel}: ${goal.title}`,
      })),
    ],
    history: [
      {
        label: 'Baholash natijasidan reja qoralamasi yaratildi',
        date: createdDate.split('-').reverse().join('.'),
      },
    ],
  }

  assessmentPlanRecords.unshift(plan)
  getPlanList().unshift(plan)
  persistAssessmentPlans()
  return plan
}
