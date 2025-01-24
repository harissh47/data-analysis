import type { NodeDefault } from '../../types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '../../constants'
import { BlockEnum } from '../../types'
import { ActionType, type ActionsNodeType } from './types'

const i18nPrefix = 'worflow'

const nodeDefault: NodeDefault<ActionsNodeType> = {
  defaultValue: {
    action_type: undefined,
    action_mandatory: false,
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: ActionsNodeType, t: any) {
    let errorMessages = ''
    if (!errorMessages && (!payload.action_type || payload.action_type.length === 0))
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.actions.actionType`) })

    // if (!errorMessages && (payload.action_type === ActionType.CustomForm && !payload.custom_forms === undefined))
    //   errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.actions.customForm`) })

    // if (!errorMessages && (payload.action_type === ActionType.Form && !payload.form_values === undefined))
    //   errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.actions.formValues`) })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
