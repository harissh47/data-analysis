import { TypeWithI18N } from "../header/account-setting/model-provider-page/declaration"

export type Emoji = {
  background: string
  content: string
}

export enum CollectionType {
  all = 'all',
  builtIn = 'builtin',
  custom = 'api',
  model = 'model',
  workflow = 'workflow',
}

export type Collection = {
  id: string
  name: string
  author: string
  description: TypeWithI18N
  icon: string | Emoji
  label: TypeWithI18N
  type: CollectionType
  team_credentials: Record<string, any>
  is_team_authorization: boolean
  allow_delete: boolean
  labels: string[]
}

export type ToolParameter = {
  name: string
  label: TypeWithI18N
  human_description: TypeWithI18N
  type: string
  form: string
  llm_description: string
  required: boolean
  default: string
  options?: {
    label: TypeWithI18N
    value: string
  }[]
  min?: number
  max?: number
}

export type Tool = {
  name: string
  author: string
  label: TypeWithI18N
  description: any
  parameters: ToolParameter[]
  labels: string[]
}
