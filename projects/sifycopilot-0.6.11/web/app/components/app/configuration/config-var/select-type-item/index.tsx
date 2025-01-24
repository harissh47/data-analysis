'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import s from './style.module.css'
import type { InputVarType } from '@/app/components/workflow/types'
import InputVarTypeIcon from '@/app/components/workflow/nodes/_base/components/input-var-type-icon'
export type ISelectTypeItemProps = {
  type: InputVarType
  selected: boolean
  onClick: () => void
}

const SelectTypeItem: FC<ISelectTypeItemProps> = ({
  type,
  selected,
  onClick,
}) => {
  const { t } = useTranslation()
  const typeName = t(`appDebug.variableConig.${type}`)

  return (
    <div
      // className={cn(s.item, selected && s.selected, 'space-y-1')}
      className={cn('flex flex-col justify-center items-center h-[58px] w-[98px] rounded-lg border border-[#EAECF0] dark:border-[#5F5F5F] shadow-sm bg-white dark:shadow-[#5F5F5F] cursor-pointer', selected ? 'border-[#4CAF50] bg-[#F5F8FF] text-[#8AB40A] shadow-md' : 'hover:border-[#B2CCFF] dark:hover:border-[#4CAF50] dark:hover:shadow-none hover:bg-[#F5F8FF] dark:hover:bg-zinc-800 dark:text-[#6B7280] hover:shadow-lg', 'space-y-1 dark:bg-[#3F3F3F]')}

      onClick={onClick}
    >
      <div className='shrink-0'>
        <InputVarTypeIcon type={type} className='w-5 h-5' />
      </div>
      {/* <span className={cn(s.text)}>{typeName}</span> */}
      <span className={cn('text-sm text-[#667085] dark:text-[#FCFCFC] font-medium')}>{typeName}</span>
    </div>
  )
}
export default React.memo(SelectTypeItem)
