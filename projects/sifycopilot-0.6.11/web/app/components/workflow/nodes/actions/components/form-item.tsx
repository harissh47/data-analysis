'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import type { FormValues } from '../types'
import { formDataTypes } from '../constants'
import Select from '@/app/components/base/select'
import { Trash03 } from '@/app/components/base/icons/src/vender/line/general'

type Props = {
  payload: FormValues
  onChange: (payload: FormValues) => void
  onRemove: () => void
  index: number
  readonly?: boolean
}

const FormItem: FC<Props> = ({
  payload,
  onChange,
  onRemove,
  index,
  readonly,
}) => {
  const handleInputChange = useCallback((value: string) => {
    onChange({ ...payload, name: value })
  }, [onChange, payload])

  const handleDatatypeChange = useCallback((value: string) => {
    onChange({ ...payload, datatype: value })
  }, [onChange, payload])

  return (
    <div className='mb-4'>
      <div className='flex justify-between'>
        <span className='text-sm dark:text-white'>{`Value ${index + 1}`}</span>
        {!readonly && (
          <Trash03
            className='mr-1 w-3.5 h-3.5 text-gray-500 cursor-pointer'
            onClick={onRemove}
          />
        )}
      </div>
      <input
        // className="w-full mb-2 px-3 text-sm leading-8 text-gray-900 border-0 rounded-lg grow h-8 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200"
        className="w-full mb-2 px-3 text-sm leading-8 text-gray-900 dark:text-white border-0 rounded-lg grow h-8 bg-gray-50 dark:bg-[#3f3f3f] focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200 dark:focus:ring-[#5F5F5F]"

        type="text"
        value={payload.name}
        onChange={e => handleInputChange(e.target.value)}
        placeholder={'Input Field'}
        disabled={readonly}
      />
      <Select
        className='w-full'
        placeholder={'Input Datatype'}
        defaultValue={payload.datatype}
        items={formDataTypes.map(option => ({ name: option, value: option })) || []}
        onSelect={i => handleDatatypeChange(i.name)}
        allowSearch={false}
        disabled={readonly}
      />
    </div>
  )
}

export default React.memo(FormItem)
