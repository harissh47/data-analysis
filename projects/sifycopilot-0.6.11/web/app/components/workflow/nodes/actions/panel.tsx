import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Split from '../_base/components/split'
import useConfig from './use-config'
import { ActionType, type ActionsNodeType } from './types'
import { actionTypeList, customFormList } from './constants'
import FormList from './components/form-list'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import Select from '@/app/components/base/select'
import { type NodePanelProps } from '@/app/components/workflow/types'
import Switch from '@/app/components/base/switch'
const i18nPrefix = 'workflow.nodes.actions'

const Panel: FC<NodePanelProps<ActionsNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    // handleQueryVarChange,
    // filterVar,
    // handleTopicsChange,
    handleMemoryChange,
    handleFormValueChange,
    handleCustomFormChange,
    handleTypeChange,
    handleActionMandatoryChange,
  } = useConfig(id, data)

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field
          title={t(`${i18nPrefix}.actionmandatory`)}
          operations={
            <Switch
              defaultValue={inputs.action_mandatory}
              onChange={handleActionMandatoryChange}
              size='md'
              disabled={readOnly}
            />
          }
        />
        <Field
          title={t(`${i18nPrefix}.actionType`)}
        >
          <Select
            className='w-full'
            defaultValue={inputs.action_type || 'Custom'}
            items={actionTypeList.map(option => ({ name: option, value: option })) || []}
            onSelect={handleTypeChange}
            allowSearch={false}
            disabled={readOnly}
          />
        </Field>
        {
          inputs.action_type === ActionType.Form && (
            <Field
              title={t(`${i18nPrefix}.formValues`)}
            >
              <FormList
                list={inputs.form_values || []}
                onChange={handleFormValueChange}
                readonly={readOnly}
              />
            </Field>
          )
        }
        {
          inputs.action_type === ActionType.CustomForm && (
            <Field
              title={t(`${i18nPrefix}.customForm`)}
            >
              <Select
                className='w-full'
                defaultValue={inputs.custom_forms || ''}
                items={customFormList.map(form => ({ name: form, value: form })) || []}
                onSelect={handleCustomFormChange}
                allowSearch={false}
                disabled={readOnly}
              />
            </Field>
          )
        }
        <Split />
        <Field
          title={t(`${i18nPrefix}.memory`)}
          operations={
            <Switch
              defaultValue={inputs.memory}
              onChange={handleMemoryChange}
              size='md'
              disabled={readOnly}
            />
          }
        />
      </div>
    </div>
  )
}

export default React.memo(Panel)
