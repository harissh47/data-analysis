import { Plan } from "./type"

export const defaultPlan = {
  type: Plan.sandbox,
  usage: {
    vectorSpace: 1,
    buildApps: 1,
    teamMembers: 1,
    annotatedResponse: 1,
    documentsUploadQuota: 1,
  },
  total: {
    vectorSpace: 10,
    buildApps: 10,
    teamMembers: 1,
    annotatedResponse: 10,
    documentsUploadQuota: 50,
  },
}