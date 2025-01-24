'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import produce from 'immer'
import AddButton from '../../_base/components/add-button'
import OptionsItem from './options-item'

type Props = {
  id: string
  options: string[]
  onChange: (options: string[]) => void
  readonly?: boolean
}

const OptionsList: FC<Props> = ({
  options,
  onChange,
  readonly,
}) => {
  const handleAddOption = useCallback(() => {
    const newOptions = produce(options, (draft) => {
      draft.push('')
    })
    onChange(newOptions)
  }, [options, onChange])

  const handleOptionsChange = useCallback((value: string, index: number) => {
    const newOptions = produce(options, (draft) => {
      draft[index] = value
    })
    onChange(newOptions)
  }, [options, onChange])

  const handleRemoveOption = useCallback((index: number) => {
    return () => {
      const newOptions = produce(options, (draft) => {
        draft.splice(index, 1)
      })
      onChange(newOptions)
    }
  }, [options, onChange])

  return (
    <div className='space-y-2'>
      {
        options.map((item, index) => {
          return (
            <OptionsItem
              key={index}
              payload={item}
              onChange={(value: string) => {
                handleOptionsChange(value, index)
              }}
              onRemove={handleRemoveOption(index)}
              index={index}
              readonly={readonly}
            />
          )
        })
      }
      {!readonly && options.length > 0 && (
        <AddButton
          onClick={handleAddOption}
          text={'Add Option'}
        />
      )}
    </div>
  )
}

export default React.memo(OptionsList)
