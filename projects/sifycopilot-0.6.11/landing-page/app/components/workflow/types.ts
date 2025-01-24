import { TransferMethod } from '@/types/app'
import type {
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  Viewport,
} from 'reactflow'
import type { Collection, Tool } from '@/app/components/tools/types'
import { NodeTracing } from '@/types/workflow'

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Answer = 'answer',
  Actions = 'actions',
  LLM = 'llm',
  KnowledgeRetrieval = 'knowledge-retrieval',
  QuestionClassifier = 'question-classifier',
  IfElse = 'if-else',
  Code = 'code',
  TemplateTransform = 'template-transform',
  HttpRequest = 'http-request',
  VariableAssigner = 'variable-assigner',
  VariableAggregator = 'variable-aggregator',
  Tool = 'tool',
  ParameterExtractor = 'parameter-extractor',
  Iteration = 'iteration',
}

export type Branch = {
  id: string
  name: string
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
}

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _singleRunningStatus?: NodeRunningStatus
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: string[]
  _isEntering?: boolean
  _showAddVariablePopup?: boolean
  _holdAddVariablePopup?: boolean
  _iterationLength?: number
  _iterationIndex?: number
  isIterationStart?: boolean
  isInIteration?: boolean
  iteration_id?: string
  selected?: boolean
  title: string
  desc: string
  type: BlockEnum
  width?: number
  height?: number
} & T & Partial<Pick<ToolDefaultValue, 'provider_id' | 'provider_type' | 'provider_name' | 'tool_name'>>

export type ToolDefaultValue = {
  provider_id: string
  provider_type: string
  provider_name: string
  tool_name: string
  tool_label: string
  title: string
}

export type ValueSelector = string[] // [nodeId, key | obj key path]

export enum VarType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any',
}


export type InputVar = {
  type: InputVarType
  label: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
  }
  variable: string
  max_length?: number
  default?: string
  required: boolean
  hint?: string
  options?: string[]
}

export type CommonEdgeType = {
  _hovering?: boolean
  _connectedNodeIsHovering?: boolean
  _connectedNodeIsSelected?: boolean
  _runned?: boolean
  _isBundled?: boolean
  isInIteration?: boolean
  iteration_id?: string
  sourceType: BlockEnum
  targetType: BlockEnum
}

export type Edge = ReactFlowEdge<CommonEdgeType>

export type HistoryWorkflowData = {
  id: string
  sequence_number: number
  status: string
  conversation_id?: string
}

export type RunFile = {
  type: string
  transfer_method: TransferMethod
  url?: string
  upload_file_id?: string
}

export type Node<T = {}> = ReactFlowNode<CommonNodeType<T>>

export type ToolWithProvider = Collection & {
  tools: Tool[]
}

export type WorkflowRunningData = {
  task_id?: string
  message_id?: string
  conversation_id?: string
  result: {
    sequence_number?: number
    workflow_id?: string
    inputs?: string
    process_data?: string
    outputs?: string
    status: string
    error?: string
    elapsed_time?: number
    total_tokens?: number
    created_at?: number
    created_by?: string
    finished_at?: number
    steps?: number
    showSteps?: boolean
    total_steps?: number
  }
  tracing?: NodeTracing[]
}
