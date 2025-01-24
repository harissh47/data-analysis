'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import OperationBtn from '@/app/components/app/configuration/base/operation-btn'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import { ApiConnection } from '@/app/components/base/icons/src/vender/solid/development'
import InputVarTypeIcon from '@/app/components/workflow/nodes/_base/components/input-var-type-icon'
import { InputVarType } from '@/app/components/workflow/types'

type Props = {
  onChange: (value: string) => void
}

type ItemProps = {
  text: string
  value: string
  Icon?: any
  type?: InputVarType
  onClick: (value: string) => void
}

const SelectItem: FC<ItemProps> = ({ text, type, value, Icon, onClick }) => {
  return (
    // <div
    //   className='flex items-center px-3 h-8 rounded-lg hover:bg-gray-50 cursor-pointer'
    //   onClick={() => onClick(value)}
    // >
      <div
      className='flex items-center px-3 h-8 rounded-lg hover:bg-gray-50 cursor-pointer dark:hover:bg-zinc-600 '
      onClick={() => onClick(value)}
    >
      {Icon ? <Icon className='w-4 h-4 text-gray-500' /> : <InputVarTypeIcon type={type!} className='w-4 h-4 text-gray-500 dark:text-white' />}
      {/* <div className='ml-2 text-xs text-gray-600 truncate'>{text}</div> */}
      {/* <div className='ml-2 text-xs text-gray-600 truncate'>{text}</div> */}
      <div className='ml-2 text-xs text-gray-600 truncate dark:text-white'>{text}</div>
    </div>
  )
}

const SelectVarType: FC<Props> = ({
  onChange,
}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const handleChange = (value: string) => {
    onChange(value)
    setOpen(false)
  }
  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
      offset={{
        mainAxis: 8,
        crossAxis: -2,
      }}
    >
      <PortalToFollowElemTrigger onClick={() => setOpen(v => !v)}>
        <OperationBtn type='add' className={cn(open && 'bg-gray-200 dark:bg-zinc-800')} />
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{ zIndex: 1000 }}>
        {/* <div className='bg-white border border-gray-200 shadow-lg rounded-lg min-w-[192px]'> */}
        <div className='bg-white border border-gray-200 dark:border-[#5f5f5f] shadow-lg rounded-lg overflow-hidden min-w-[192px]'>
          {/* <div className='p-1'> */}
            <div className='p-1 dark:bg-[#3e3e3e]'>
            <SelectItem type={InputVarType.textInput} value='string' text={t('appDebug.variableConig.string')} onClick={handleChange}></SelectItem>
            <SelectItem type={InputVarType.paragraph} value='paragraph' text={t('appDebug.variableConig.paragraph')} onClick={handleChange}></SelectItem>
            <SelectItem type={InputVarType.select} value='select' text={t('appDebug.variableConig.select')} onClick={handleChange}></SelectItem>
            <SelectItem type={InputVarType.number} value='number' text={t('appDebug.variableConig.number')} onClick={handleChange}></SelectItem>
          </div>
          <div className='h-[1px] bg-gray-100 dark:bg-[#5f5f5f]'></div>
          {/* <div className='p-1'> */}
          <div className='p-1 dark:bg-[#3e3e3e]'>
            <SelectItem Icon={ApiConnection} value='api' text={t('appDebug.variableConig.apiBasedVar')} onClick={handleChange}></SelectItem>
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}
export default React.memo(SelectVarType)
