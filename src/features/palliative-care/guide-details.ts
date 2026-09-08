import { careGuideDetails } from './guide-details-care'
import { intakeGuideDetails } from './guide-details-intake'
import { managementGuideDetails } from './guide-details-management'
import type { GuideDetail } from './guides-types'

export const guideDetails: Record<string, GuideDetail> = { ...intakeGuideDetails, ...careGuideDetails, ...managementGuideDetails }
