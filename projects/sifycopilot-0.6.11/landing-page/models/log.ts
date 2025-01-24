export const MessageRatings = ['like', 'dislike', null] as const
export type MessageRating = typeof MessageRatings[number]


export type LogAnnotation = {
  id: string
  content: string
  account: {
    id: string
    name: string
    email: string
  }
  created_at: number
}

export type Annotation = {
  id: string
  authorName: string
  logAnnotation?: LogAnnotation
  created_at?: number
}

export type ToolCall = {
  status: string
  error?: string | null
  time_cost?: number
  tool_icon: any
  tool_input?: any
  tool_output?: any
  tool_name?: string
  tool_label?: any
  tool_parameters?: any
}

export type AgentIteration = {
  created_at: string
  files: string[]
  thought: string
  tokens: number
  tool_calls: ToolCall[]
  tool_raw: {
    inputs: string
    outputs: string
  }
}

export type AgentLogMeta = {
  status: string
  executor: string
  start_time: string
  elapsed_time: number
  total_tokens: number
  agent_mode: string
  iterations: number
  error?: string
}

export type AgentLogFile = {
  id: string
  type: string
  url: string
  name: string
  belongs_to: string
}

export type AgentLogDetailResponse = {
  meta: AgentLogMeta
  iterations: AgentIteration[]
  files: AgentLogFile[]
}

export type AgentLogDetailRequest = {
  conversation_id: string
  message_id: string
}