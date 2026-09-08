export type CaseTypeCode = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9'

export type ServiceRouteCode = 'S0' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6'

export type IntakeChannelCode =
  | 'FAMILY'
  | 'EDUCATION'
  | 'HEALTHCARE'
  | 'SOCIAL_SERVICE'
  | 'MAHALLA'
  | 'CHILD_PROTECTION'
  | 'PROVIDER'
  | 'SYSTEM_EVENT'

export type CasePriority = 'ROUTINE' | 'PRIORITY' | 'URGENT'

/** A case lifecycle is independent from its plan, referrals and appeal. */
export type CasePhase =
  | 'SIGNAL_RECEIVED'
  | 'IDENTITY_CHECK'
  | 'TRIAGE'
  | 'ASSESSMENT'
  | 'PLAN_DEVELOPMENT'
  | 'AUTHORIZATION'
  | 'SERVICE_COORDINATION'
  | 'MONITORING'
  | 'REVIEW'
  | 'CLOSED'

/** One case may have several versions of an integrated support plan. */
export type PlanStatus =
  | 'NOT_STARTED'
  | 'DRAFT'
  | 'FAMILY_REVIEW'
  | 'APPROVAL_PENDING'
  | 'APPROVED'
  | 'ACTIVE'
  | 'REVISION_REQUIRED'
  | 'COMPLETED'
  | 'CANCELLED'

/** Every service route advances independently from the case and plan. */
export type ReferralStatus =
  | 'DRAFT'
  | 'READY_TO_REFER'
  | 'REFERRED'
  | 'MATCHING'
  | 'WAITLISTED'
  | 'PROVIDER_ACCEPTED'
  | 'PROVIDER_DECLINED'
  | 'SCHEDULED'
  | 'STARTED'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'

/** An appeal never replaces the operational case or suspends safe services. */
export type AppealStatus =
  | 'NONE'
  | 'SUBMITTED'
  | 'ADMISSIBILITY_CHECK'
  | 'UNDER_REVIEW'
  | 'DECISION_MADE'
  | 'IMPLEMENTATION_PENDING'
  | 'IMPLEMENTED'
  | 'WITHDRAWN'
  | 'CLOSED'

export type ConsentStatus = 'NOT_REQUIRED' | 'PENDING' | 'RECORDED' | 'LEGAL_BASIS_RECORDED'

export type TimelineEventKind =
  | 'SIGNAL'
  | 'TRIAGE'
  | 'ASSESSMENT'
  | 'PLAN'
  | 'REFERRAL'
  | 'SERVICE'
  | 'REVIEW'
  | 'APPEAL'
  | 'SYSTEM'

export interface PTPKReferenceDefinition<TCode extends string> {
  code: TCode
  title: string
  description: string
}

export interface PTPKCaseTypeDefinition extends PTPKReferenceDefinition<CaseTypeCode> {
  routeHint: 'STANDARD' | 'REVIEW' | 'URGENT' | 'DELIVERY_FAILURE' | 'APPEAL'
  firstAction: string
}

export interface PTPKServiceRouteDefinition extends PTPKReferenceDefinition<ServiceRouteCode> {
  examples: string[]
  color: string
}

export interface PTPKStatusDefinition<TCode extends string> {
  code: TCode
  title: string
  tone: 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'purple'
}

export interface PTPKChild {
  id: string
  fullName: string
  birthDate: string
  pinfl: string
  gender: 'MALE' | 'FEMALE'
  district: string
  representativeName: string
  representativePhone: string
  educationEngagement: 'NOT_ENGAGED' | 'PRESCHOOL' | 'SCHOOL' | 'HOME_EDUCATION' | 'GRADUATED'
}

export interface PTPKNeed {
  id: string
  domain: 'LEARNING' | 'COMMUNICATION' | 'MOBILITY' | 'SELF_CARE' | 'BEHAVIOUR' | 'HEALTH' | 'SAFETY' | 'FAMILY_ACCESS'
  summary: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  assessed: boolean
}

export interface PTPKServiceReferral {
  id: string
  serviceCode: ServiceRouteCode
  serviceName: string
  status: ReferralStatus
  providerName?: string
  owner: string
  requestedAt: string
  targetStartDate?: string
  actualStartDate?: string
  waitingDays?: number
  capacityNote?: string
  isTemporary?: boolean
  updatedAt: string
}

export interface PTPKIntegratedPlan {
  id: string
  version: number
  status: PlanStatus
  goals: string[]
  familyReviewedAt?: string
  approvedAt?: string
  reviewDate?: string
  owner: string
  referrals: PTPKServiceReferral[]
}

export interface PTPKAppeal {
  id: string
  status: AppealStatus
  subject: string
  submittedAt: string
  owner: string
  dueAt: string
  existingServicesContinue: boolean
}

export interface PTPKTimelineEvent {
  id: string
  at: string
  kind: TimelineEventKind
  title: string
  description: string
  actor: string
}

export interface PTPKCase {
  id: string
  displayId: string
  type: CaseTypeCode
  intakeChannel: IntakeChannelCode
  priority: CasePriority
  phase: CasePhase
  child: PTPKChild
  signalSummary: string
  needs: PTPKNeed[]
  consentStatus: ConsentStatus
  assignedTeam: string
  owner: string
  createdAt: string
  updatedAt: string
  dueAt: string
  nextAction: string
  flags: {
    urgent: boolean
    safeguarding: boolean
    currentlyUnserved: boolean
    overdue: boolean
  }
  plan: PTPKIntegratedPlan
  appeal?: PTPKAppeal
  timeline: PTPKTimelineEvent[]
}

export interface PTPKProcessStep {
  order: number
  key: string
  title: string
  description: string
  automatedChecks: string[]
  humanDecision: string
}
