export type ServiceType = 'INPATIENT' | 'MOBILE'
export type CaseStatus = 'INTAKE' | 'ASSESSMENT' | 'OBSERVATION' | 'REFERRAL' | 'CONSILIUM' | 'APPROVED' | 'PAUSED' | 'REJECTED' | 'INPATIENT' | 'MOBILE' | 'FOLLOW_UP' | 'BEREAVEMENT' | 'CLOSED'
export type RegionCode = 'SAMARQAND' | 'JIZZAX' | 'QASHQADARYO' | 'NAVOIY'
export type ActionResult = { ok: boolean; error?: string; id?: string }
export interface CaseInput {
  childName: string; birthDate: string; sex: 'MALE' | 'FEMALE'; region: RegionCode
  district: string; address: string; guardianName: string; relationship: string; phone: string
  familyDoctor: string; clinic: string; diagnosis: string; medicalIndication: string
  requestedService: ServiceType; urgency: 'ROUTINE' | 'PRIORITY'; notes?: string
  pinfl?: string; identityType?: 'BIRTH_CERTIFICATE' | 'PASSPORT'; identityNumber?: string; symptoms?: string[]
  intakeDate?: string
}
export interface AssessmentInput {
  type: 'PAPAS' | 'HOME'; score: number; date: string; assessor: string; methodology: string; document: string
  weeklyVisits?: number; overrideReason?: string; notes?: string
}
export interface Assessment extends AssessmentInput { id: string; suggestedVisits?: number }
export interface ReferralInput {
  number: string; date: string; source: 'LOCAL' | 'EPALLIATIVE' | 'PAPER'; externalId?: string; outageReason?: string
  organization: string; sourceConsiliumNumber: string; sourceConsiliumDate: string; sourceConsiliumMembers: string
  sourceConsiliumEligible: boolean; diagnosisCode: string; service: ServiceType; historyExtract: string; historyPages: number
  examinationDocument: string; examinationPages: number; papasDocument: string
  referringDoctor: string; doctorPosition: string; doctorPhone: string; chiefDoctor: string; sourceConfirmation: string
  requiredEquipment: string[]; transportNotes: string; notes?: string
}
export interface Referral extends ReferralInput { id: string; status: 'DRAFT' | 'SUBMITTED'; submittedAt?: string }
export interface DecisionInput {
  outcome: 'APPROVE' | 'PAUSE' | 'REJECT'; date: string; number: string; members: string; reason: string
  service: ServiceType; safeCare: boolean; safeTransport: boolean; consent: boolean; consentPerson: string
  reviewDate?: string; destination?: string
}
export interface Decision extends DecisionInput { id: string }
export interface CareTaskInput { title: string; category: 'MEDICAL' | 'NURSING' | 'PSYCHOLOGICAL' | 'SOCIAL' | 'FAMILY'; assignee: string; dueDate: string; target: 'CHILD' | 'FAMILY' }
export interface CareTask extends CareTaskInput { id: string; status: 'PLANNED' | 'DONE' | 'CANCELLED'; completedAt?: string; completionNote?: string; cancellationNote?: string }
export interface ContactInput { type: 'CALL' | 'REMOTE' | 'NOTE' | 'COMPLAINT'; author: string; note: string }
export interface Contact extends ContactInput { id: string; date: string }
export interface TimelineEvent { readonly id: string; readonly at: string; readonly title: string; readonly detail: string; readonly actor: string }
export interface EpisodeInput {
  service: ServiceType; startDate: string; plannedEndDate?: string; bedId?: string; teamId?: string
  admissionType: 'TEMPORARY' | 'TERMINAL'; decisionNumber: string; decisionReason: string; companion?: string
}
export interface EpisodeExtensionInput { plannedEndDate: string; decisionNumber: string; decisionDate: string; reason: string; adultContinuation?: boolean }
export interface EpisodeCloseInput {
  endDate: string; reason: 'DISCHARGE' | 'TRANSFER' | 'DEATH'; summary: string; document: string
  deathObjection?: boolean; pathologyReferral?: string
}
export interface ServiceEpisode extends EpisodeInput {
  id: string; status: 'ACTIVE' | 'CLOSED'; endDate?: string; closure?: EpisodeCloseInput; extensions: (EpisodeExtensionInput & { id: string })[]
}
export interface HandoffInput { date: string; doctor: string; clinic: string; document: string; nextReviewDate: string; note: string }
export interface Handoff extends HandoffInput { id: string }
export interface FamilySupport { status: 'ACTIVE' | 'CLOSED'; startDate: string; deadline: string; closedAt?: string }
export interface DemoScenario { code: string; title: string; summary: string; checkpoints: string[] }
export interface PalliativeCase extends CaseInput {
  id: string; number: string; createdAt: string; assessmentDueDate: string; status: CaseStatus
  assessments: Assessment[]; referral?: Referral; referralHistory?: Referral[]; decisions: Decision[]; episodes: ServiceEpisode[]
  careTasks: CareTask[]; contacts: Contact[]; timeline: TimelineEvent[]; handoffs: Handoff[]; familySupport?: FamilySupport
  demoScenario?: DemoScenario
}
export interface VisitInput { caseId: string; teamId: string; scheduledAt: string; durationMinutes: number; type: 'HOME' | 'REMOTE'; purpose: string }
export interface Visit extends VisitInput { id: string; target?: 'CHILD' | 'FAMILY'; status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; startedAt?: string; completedAt?: string; note?: string }
export interface EquipmentAllocation { id: string; caseId: string; agreement: string; issuedAt: string; returnedAt?: string; returnNote?: string }
export interface Equipment { id: string; name: string; inventoryNumber: string; status: 'AVAILABLE' | 'ISSUED' | 'MAINTENANCE'; condition: string; allocations: EquipmentAllocation[] }
export interface Bed { id: string; name: string; room: string; available: boolean }
export interface Team { id: string; name: string; vehicle: string; members: string[]; regions: RegionCode[]; gpsStatus: 'NOT_CONNECTED' }
export interface PalliativeState { schemaVersion: 1; cases: PalliativeCase[]; visits: Visit[]; equipment: Equipment[]; beds: Bed[]; teams: Team[] }
