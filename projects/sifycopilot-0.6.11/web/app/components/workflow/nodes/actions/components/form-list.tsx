'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import produce from 'immer'
import AddButton from '../../_base/components/add-button'
import type { FormValues } from '../types'
import FormItem from './form-item'

type Props = {
  list: FormValues[]
  onChange: (list: FormValues[]) => void
  readonly?: boolean
}

const FormList: FC<Props> = ({
  list,
  onChange,
  readonly,
}) => {
  const handleAddValue = useCallback(() => {
    const newList = produce(list, (draft) => {
      draft.push({ id: `${Date.now()}`, name: '', datatype: 'text' })
    })
    onChange(newList)
  }, [list, onChange])

  const handleRemoveValue = useCallback((index: number) => {
    const newList = produce(list, (draft) => {
      draft.splice(index, 1)
    })
    onChange(newList)
  }, [list, onChange])

  const handleValueChange = useCallback((index: number) => {
    return (value: FormValues) => {
      const newList = produce(list, (draft) => {
        draft[index] = value
      })
      onChange(newList)
    }
  }, [list, onChange])

  return (
    <div className='space-y-2'>
      {
        list.map((item, index) => {
          return (
            <FormItem
              key={index}
              payload={item}
              onChange={handleValueChange(index)}
              onRemove={() => handleRemoveValue(index)}
              index={index}
              readonly={readonly}
            />
          )
        })
      }
      {!readonly && (
        <AddButton
          onClick={handleAddValue}
          text={'Add Value'}
        />
      )}
    </div>
  )
}

export default React.memo(FormList)
