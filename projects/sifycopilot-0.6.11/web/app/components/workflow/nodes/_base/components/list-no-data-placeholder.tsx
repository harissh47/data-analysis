'use client'
import type { FC } from 'react'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const ListNoDataPlaceholder: FC<Props> = ({
  children,
}) => {
  return (
    // <div className='flex rounded-md bg-gray-50 items-center min-h-[42px] justify-center leading-[18px] text-xs font-normal text-gray-500'>
    <div className='flex rounded-md bg-gray-50 dark:bg-[#2c2c2c] items-center min-h-[42px] justify-center leading-[18px] text-xs font-normal text-gray-500 dark:text-white'>

      {children}
    </div>
  )
}
export default React.memo(ListNoDataPlaceholder)
