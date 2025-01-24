import type { RETRIEVE_TYPE } from "@/types/app"

export type Inputs = Record<string, string | number | object>

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export type PromptVariable = {
  key: string
  name: string
  type: string // "string" | "number" | "select",
  default?: string | number
  required?: boolean
  options?: string[]
  max_length?: number
  is_context_var?: boolean
  enabled?: boolean
  config?: Record<string, any>
  icon?: string
  icon_background?: string
}

export enum PromptMode {
  simple = 'simple',
  advanced = 'advanced',
}

export type DatasetConfigs = {
  retrieval_model: RETRIEVE_TYPE
  reranking_model: {
    reranking_provider_name: string
    reranking_model_name: string
  }
  top_k: number
  score_threshold_enabled: boolean
  score_threshold?: number | null
  datasets: {
    datasets: {
      enabled: boolean
      id: string
    }[]
  }
}

export type AnnotationReplyConfig = {
  id: string
  enabled: boolean
  score_threshold: number
  embedding_model: {
    embedding_provider_name: string
    embedding_model_name: string
  }
}

export type PromptItem = {
  role?: PromptRole
  text: string
}

export type ChatPromptConfig = {
  prompt: PromptItem[]
}

export type ConversationHistoriesRole = {
  user_prefix: string
  assistant_prefix: string
}

export type CompletionPromptConfig = {
  prompt: PromptItem
  conversation_histories_role: ConversationHistoriesRole
}

export type MoreLikeThisConfig = {
  enabled: boolean
}

export type ModerationContentConfig = {
  enabled: boolean
  preset_response?: string
}

export type ModerationConfig = MoreLikeThisConfig & {
  type?: string
  config?: {
    keywords?: string
    api_based_extension_id?: string
    inputs_config?: ModerationContentConfig
    outputs_config?: ModerationContentConfig
  } & Partial<Record<string, any>>
}