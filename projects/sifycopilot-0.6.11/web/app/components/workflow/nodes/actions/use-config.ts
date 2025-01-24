import { useCallback, useEffect, useRef } from 'react'
import produce from 'immer'
import { BlockEnum, VarType } from '../../types'
import type { Var } from '../../types'
import { useIsChatMode, useNodesReadOnly, useWorkflow } from '../../hooks'
import { useStore } from '../../store'
import useAvailableVarList from '../_base/hooks/use-available-var-list'
import type { ActionsNodeType, FormValues } from './types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'

const useConfig = (id: string, payload: ActionsNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const isChatMode = useIsChatMode()
  const defaultConfig = useStore(s => s.nodesDefaultConfigs)[payload.type]
  const { getBeforeNodesInSameBranch } = useWorkflow()
  const startNode = getBeforeNodesInSameBranch(id).find(node => node.data.type === BlockEnum.Start)
  const startNodeId = startNode?.id
  const { inputs, setInputs } = useNodeCrud<ActionsNodeType>(id, payload)
  const inputRef = useRef(inputs)
  useEffect(() => {
    inputRef.current = inputs
  }, [inputs])

  const handleTypeChange = useCallback((type: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.action_type = type.value
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const handleFormValueChange = useCallback((value: FormValues[]) => {
    const newInputs = produce(inputs, (draft) => {
      draft.form_values = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const handleCustomFormChange = useCallback((form: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.custom_forms = form.value
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const handleActionMandatoryChange = useCallback((mandatory: boolean) => {
    const newInputs = produce(inputs, (draft) => {
      draft.action_mandatory = mandatory
    })
    setInputs(newInputs)
  }, [inputs, setInputs]) // action mandatory

  const handleMemoryChange = useCallback((memory: boolean) => {
    const newInputs = produce(inputs, (draft) => {
      draft.memory = memory
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const filterInputVar = useCallback((varPayload: Var) => {
    return [VarType.number, VarType.string].includes(varPayload.type)
  }, [])

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterInputVar,
  })

  const filterVar = useCallback((varPayload: Var) => {
    return varPayload.type === VarType.string
  }, [])

  return {
    readOnly,
    inputs,
    isChatMode,
    filterVar,
    handleTypeChange,
    handleMemoryChange,
    handleFormValueChange,
    handleCustomFormChange,
    handleActionMandatoryChange,
    availableVars,
    availableNodesWithParent,
  }
}

export default useConfig
