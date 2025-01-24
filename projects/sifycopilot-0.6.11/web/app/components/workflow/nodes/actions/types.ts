import type { CommonNodeType } from '@/app/components/workflow/types'

export type ActionsNodeType = CommonNodeType & {
  action_type: ActionType
  form_values?: FormValues[]
  custom_forms?: string
  memory?: boolean
  action_mandatory: boolean
}

export enum ActionType {
  Form = 'Form',
  CustomForm = 'Custom Form',
}

export type FormValues = {
  id: string
  name: string
  datatype: string
}
