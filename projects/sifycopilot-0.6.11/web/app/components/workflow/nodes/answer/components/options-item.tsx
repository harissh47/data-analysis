'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import TextEditor from '../../_base/components/editor/text-editor'
import { Trash03 } from '@/app/components/base/icons/src/vender/line/general'

type Props = {
  payload: string
  onChange: (payload: string) => void
  onRemove: () => void
  index: number
  readonly?: boolean
}

const OptionsItem: FC<Props> = ({
  payload,
  onChange,
  onRemove,
  index,
  readonly,
}) => {
  const handleOptionsInputChange = useCallback((value: string) => {
    onChange(value)
  }, [onChange])

  return (
    <TextEditor
      isInNode
      title={<div>
        <div className='w-[200px]'>
          <div
            className='leading-4 text-xs font-semibold text-gray-700 dark:text-white'
          >
            {`Option ${index + 1}`}
          </div>
        </div>
      </div>}
      value={payload}
      onChange={handleOptionsInputChange}
      placeholder={'Enter your option'}
      headerRight={(
        <div className='flex items-center h-full'>
          <div className='mx-3 h-3 w-px bg-gray-200'></div>
          {!readonly && (
            <Trash03
              className='mr-1 w-3.5 h-3.5 text-gray-500 cursor-pointer'
              onClick={onRemove}
            />
          )}
        </div>
      )}
      readonly={readonly}
      minHeight={2}
    />
  )
}

export default React.memo(OptionsItem)
