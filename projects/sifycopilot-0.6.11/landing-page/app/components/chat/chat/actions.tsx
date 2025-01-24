/* eslint-disable no-case-declarations */
import { type FC, useCallback } from 'react'
import { useContext } from 'use-context-selector'
import classNames from 'classnames'
import produce from 'immer'
// import Button from '../../button'
import Button from '@/app/components/base/button'
import type { OnSend } from '../types'
import Form1 from './forms/form1'
import Form2 from './forms/form2'
import { ToastContext } from '@/app/components/base/toast'
import type { ActionItem, FormValues } from '../../app/chat/type'

type ActionProps = {
  onChange: (list: FormValues[]) => void
  actionItem: ActionItem
  onSubmit: (message: string) => void
  // onSend: OnSend
  onModalClose?: () => void
  onUpdateMemory: (formValue: any) => void
}
const Action: FC<ActionProps> = ({
  onChange,
  actionItem,
  onSubmit,
  // onSend,
  onModalClose,
  onUpdateMemory,
}) => {
  const formValues: FormValues[] = actionItem.form_values
  const { notify } = useContext(ToastContext)

  const handleChange = useCallback(
    (index: number, value: string) => {
      const newFormValue = produce(formValues, (draft) => {
        draft[index].value = value
      })
      onChange(newFormValue)
    },
    [formValues, onChange],
  )

  const handleInputValidation = (type: string, value: string) => {
    if (value === undefined || value.length === 0) {
      notify({ type: 'error', message: 'Fill out the fields' })
      return false
    }

    switch (type) {
      case 'phone':
        const phonePattern = /^[0-9]{10}$/
        if (!phonePattern.test(value)) {
          notify({ type: 'error', message: 'Invalid Phone Number' })
          return false
        }
        return true
      case 'email':
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(value)) {
          notify({ type: 'error', message: 'Invalid Email ID' })
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleModalClose = () => {
    if (actionItem.action_mandatory)
      onModalClose!()
  }

  const handleSubmit = () => {
    let message = ''
    const formValue: { [key: string]: any } = {}

    for (let i = 0; i < formValues.length; i++) {
      const element = formValues[i]
      if (!handleInputValidation(element.datatype, element.value))
        return
      message += `${element.name} - ${element.value}\n`
      formValue[element.name] = element.value
    }

    // onModalClose()
    // onSend(message)
    console.log(formValue)
    onUpdateMemory(formValue)
    handleModalClose()
    onSubmit(message)

  }

  return (
    // <div className={classNames('my-4 p-4 ml-7 rounded-lg shadow-md bg-white max-w-sm')}>
    <div className={classNames('my-4 p-4 ml-14 rounded-lg shadow-md bg-white max-w-sm')}>
      {actionItem.action_type === 'Form'
        && <form>
          {formValues.map((field, index) => (
            <div key={field.id} className='mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                {field.name}
                {(field.datatype === 'text' || field.datatype === 'number')
                  ? (
                    <input
                      type={field.datatype}
                      value={field.value || ''}
                      onChange={e => handleChange(index, e.target.value)}
                      required
                      className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
                    />
                  )
                  : field.datatype === 'email'
                    ? (
                      <input
                        type='email'
                        value={field.value || ''}
                        onChange={e => handleChange(index, e.target.value)}
                        required
                        className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
                      />
                    )
                    : field.datatype === 'phone'
                      ? (
                        <input
                          type='tel'
                          value={field.value || ''}
                          onChange={e => handleChange(index, e.target.value)}
                          pattern='[0-9]{10}'
                          required
                          className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
                        />
                      )
                      : (
                        field.datatype === 'date' && (
                          <input
                            type='date'
                            value={field.value || ''}
                            onChange={e => handleChange(index, e.target.value)}
                            required
                            className='mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm outline-none'
                          />
                        )
                      )}
              </label>
            </div>
          ))}
          <div className='flex justify-end'>
            <Button type='primary' className='mt-2' onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </form>
      }

      {
        actionItem.action_type === 'Custom Form' && (
          actionItem.custom_forms === 'Form1'
            // ? <Form1 onSend={onSend} />
            ? <Form1 onSend={onSubmit} handleModal={handleModalClose} />
            : actionItem.custom_forms === 'Form2'
              // ? <Form2 onSend={onSend} />
              ? <Form2 onSend={onSubmit} handleModal={handleModalClose} />
              : <div>Invalid Form Type</div>
        )
      }

      {/* {actionItem.action_type === 'Custom Form' && (
        <>
          {actionItem.custom_forms === 'Form1' && <Form1 onSend={onSend}/>}
          {actionItem.custom_forms === 'Form2' && <Form2 onSend={onSend}/>}
        </>
      )} */}
    </div>
  )
}

export default Action
