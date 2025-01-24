import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'
import { useChatWithHistoryContext } from '../context'
import Input from './form-input'
import { PortalSelect } from '@/app/components/base/select'

const Form = () => {
  const { t } = useTranslation()
  const {
    inputsForms,
    newConversationInputs,
    handleNewConversationInputsChange,
    isMobile,
  } = useChatWithHistoryContext()

  const searchParams = useSearchParams()

  const handleFormChange = useCallback((variable: string, value: string) => {
    handleNewConversationInputsChange({
      ...newConversationInputs,
      [variable]: value,
    })
  }, [newConversationInputs, handleNewConversationInputsChange])

  useEffect(() => {
    for (let i = 0; i < inputsForms.length; i++) {
      const variable = inputsForms[i].variable

      const val = searchParams.get(variable)

      if (val && (newConversationInputs[variable] === '' || newConversationInputs[variable] === undefined))
        handleFormChange(variable, val)
    }
  }, [inputsForms, searchParams, handleFormChange])

  const renderField = (form: any) => {
    const {
      label,
      required,
      variable,
      options,
    } = form

    if (form.type === 'text-input' || form.type === 'paragraph') {
      return (
        <Input
          form={form}
          value={newConversationInputs[variable]}
          onChange={handleFormChange}
        />
      )
    }
    if (form.type === 'number') {
      return (
        <input
          // className="grow h-9 rounded-lg bg-gray-100 px-2.5 outline-none appearance-none"
          className="grow h-9 rounded-lg bg-[#202020] px-2.5 outline-none appearance-none"
          type="number"
          value={newConversationInputs[variable] || ''}
          onChange={e => handleFormChange(variable, e.target.value)}
          placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
        />
      )
    }

    return (
      <PortalSelect
        popupClassName='w-[200px]'
        value={newConversationInputs[variable]}
        items={options.map((option: string) => ({ value: option, name: option }))}
        onSelect={item => handleFormChange(variable, item.value as string)}
        placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
      />
    )
  }

  if (!inputsForms.length)
    return null

  return (
    <div />
    // <div className='mb-4 py-2'>
    //   {
    //     inputsForms.map(form => (
    //       <div
    //         key={form.variable}
    //         // className={`flex mb-3 last-of-type:mb-0 text-sm text-gray-900 ${isMobile && '!flex-wrap'}`}
    //         className={`flex mb-3 last-of-type:mb-0 text-sm text-gray-100 ${isMobile && '!flex-wrap'}`}
    //       >
    //         <div className={`shrink-0 mr-2 py-2 w-[128px] ${isMobile && '!w-full'}`}>{form.label}</div>
    //         {renderField(form)}
    //       </div>
    //     ))
    //   }
    // </div>
  )
}

export default Form
