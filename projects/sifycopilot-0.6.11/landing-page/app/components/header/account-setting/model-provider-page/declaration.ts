export type FormValue = Record<string, any>

export type TypeWithI18N<T = string> = {
  en_US: T
  zh_Hans: T
  [key: string]: T
}

export enum ModelStatusEnum {
  active = 'active',
  noConfigure = 'no-configure',
  quotaExceeded = 'quota-exceeded',
  noPermission = 'no-permission',
  disabled = 'disabled',
}

export enum ModelFeatureTextEnum {
  toolCall = 'Tool Call',
  multiToolCall = 'Multi Tool Call',
  agentThought = 'Agent Thought',
  vision = 'Vision',
}

export enum ModelTypeEnum {
  textGeneration = 'llm',
  textEmbedding = 'text-embedding',
  rerank = 'rerank',
  speech2text = 'speech2text',
  moderation = 'moderation',
  tts = 'tts',
}

export enum ConfigurationMethodEnum {
  predefinedModel = 'predefined-model',
  customizableModel = 'customizable-model',
  fetchFromRemote = 'fetch-from-remote',
}

export enum ModelFeatureEnum {
  toolCall = 'tool-call',
  multiToolCall = 'multi-tool-call',
  agentThought = 'agent-thought',
  vision = 'vision',
}

export enum CustomConfigurationStatusEnum {
  active = 'active',
  noConfigure = 'no-configure',
}

export type ModelItem = {
  model: string
  label: TypeWithI18N
  model_type: ModelTypeEnum
  features?: ModelFeatureEnum[]
  fetch_from: ConfigurationMethodEnum
  status: ModelStatusEnum
  model_properties: Record<string, string | number>
  load_balancing_enabled: boolean
  deprecated?: boolean
}

export enum PreferredProviderTypeEnum {
  system = 'system',
  custom = 'custom',
}

export enum CurrentSystemQuotaTypeEnum {
  trial = 'trial',
  free = 'free',
  paid = 'paid',
}

export enum QuotaUnitEnum {
  times = 'times',
  tokens = 'tokens',
  credits = 'credits',
}

export type QuotaConfiguration = {
  quota_type: CurrentSystemQuotaTypeEnum
  quota_unit: QuotaUnitEnum
  quota_limit: number
  quota_used: number
  last_used: number
  is_valid: boolean
}

export type FormShowOnObject = {
  variable: string
  value: string
}

export enum FormTypeEnum {
  textInput = 'text-input',
  textNumber = 'number-input',
  secretInput = 'secret-input',
  select = 'select',
  radio = 'radio',
  files = 'files',
}

export type FormOption = {
  label: TypeWithI18N
  value: string
  show_on: FormShowOnObject[]
}

export type CredentialFormSchemaBase = {
  variable: string
  label: TypeWithI18N
  type: FormTypeEnum
  required: boolean
  default?: string
  tooltip?: TypeWithI18N
  show_on: FormShowOnObject[]
  url?: string
}

export type CredentialFormSchemaTextInput = CredentialFormSchemaBase & { max_length?: number; placeholder?: TypeWithI18N }
export type CredentialFormSchemaNumberInput = CredentialFormSchemaBase & { min?: number; max?: number; placeholder?: TypeWithI18N }
export type CredentialFormSchemaSelect = CredentialFormSchemaBase & { options: FormOption[]; placeholder?: TypeWithI18N }
export type CredentialFormSchemaRadio = CredentialFormSchemaBase & { options: FormOption[] }
export type CredentialFormSchemaSecretInput = CredentialFormSchemaBase & { placeholder?: TypeWithI18N }
export type CredentialFormSchema = CredentialFormSchemaTextInput | CredentialFormSchemaSelect | CredentialFormSchemaRadio | CredentialFormSchemaSecretInput

export type CustomConfigurationModelFixedFields = {
  __model_name: string
  __model_type: ModelTypeEnum
}

export type Model = {
  provider: string
  icon_large: TypeWithI18N
  icon_small: TypeWithI18N
  label: TypeWithI18N
  models: ModelItem[]
  status: ModelStatusEnum
}

export type ModelProvider = {
  provider: string
  label: TypeWithI18N
  description?: TypeWithI18N
  help: {
    title: TypeWithI18N
    url: TypeWithI18N
  }
  icon_small: TypeWithI18N
  icon_large: TypeWithI18N
  background?: string
  supported_model_types: ModelTypeEnum[]
  configurate_methods: ConfigurationMethodEnum[]
  provider_credential_schema: {
    credential_form_schemas: CredentialFormSchema[]
  }
  model_credential_schema: {
    model: {
      label: TypeWithI18N
      placeholder: TypeWithI18N
    }
    credential_form_schemas: CredentialFormSchema[]
  }
  preferred_provider_type: PreferredProviderTypeEnum
  custom_configuration: {
    status: CustomConfigurationStatusEnum
  }
  system_configuration: {
    enabled: boolean
    current_quota_type: CurrentSystemQuotaTypeEnum
    quota_configurations: QuotaConfiguration[]
  }
}

export type ModelLoadBalancingConfigEntry = {
  /** model balancing config entry id */
  id?: string
  /** is config entry enabled */
  enabled?: boolean
  /** config entry name */
  name: string
  /** model balancing credential */
  credentials: Record<string, string | undefined | boolean>
  /** is config entry currently removed from Round-robin queue */
  in_cooldown?: boolean
  /** cooldown time (in seconds) */
  ttl?: number
}

export type ModelLoadBalancingConfig = {
  enabled: boolean
  configs: ModelLoadBalancingConfigEntry[]
}
