import { get } from './base'
import type { CurrentPlanInfoBackend } from '@/app/components/billing/type'

export const fetchCurrentPlanInfo = () => {
  return get<CurrentPlanInfoBackend>('/features')
}