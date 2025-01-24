import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useConfig from './use-config'
import type { AnswerNodeType } from './types'
import OptionsList from './components/options-list'
import Editor from '@/app/components/workflow/nodes/_base/components/prompt/editor'
import type { NodePanelProps } from '@/app/components/workflow/types'
import useAvailableVarList from '@/app/components/workflow/nodes/_base/hooks/use-available-var-list'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import Switch from '@/app/components/base/switch'
const i18nPrefix = 'workflow.nodes.answer'

const Panel: FC<NodePanelProps<AnswerNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    handleAnswerChange,
    handleOptionsEnabled,
    handleOptionsChange,
    filterVar,
  } = useConfig(id, data)

  const { availableVars, availableNodesWithParent } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar,
  })

  if (!data)
    return null

  return (
    <div className='mt-2 mb-2 px-4 space-y-4'>
      <Editor
        readOnly={readOnly}
        justVar
        title={t(`${i18nPrefix}.answer`)!}
        value={inputs.answer}
        onChange={handleAnswerChange}
        nodesOutputVars={availableVars}
        availableNodes={availableNodesWithParent}
      />
      {inputs.action_questions && (
        <Field
          title={'Options'}
          operations={
            <Switch
              defaultValue={inputs.action_questions.length > 0}
              onChange={handleOptionsEnabled}
              size='md'
              disabled={readOnly}
            />
          }
        >
          <OptionsList
            id={id}
            options={inputs.action_questions}
            onChange={handleOptionsChange}
            readonly={readOnly}
          />
        </Field>
      )}
    </div>
  )
}

export default React.memo(Panel)
