'use client'
import React from 'react'

const OperationBtn = ({ innerContent, onClick, className }: { innerContent: React.ReactNode; onClick?: () => void; className?: string }) => (
  <div
    // className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white cursor-pointer text-gray-500 hover:text-gray-800 ${className ?? ''}`}
    className={`relative box-border flex items-center justify-center h-7 w-7 p-0.5 rounded-lg bg-white dark:bg-[#3F3F3F] cursor-pointer text-gray-500 hover:text-gray-800 dark:hover:!text-white ${className ?? ''}`}
    style={{ boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.05)' }}
    onClick={onClick && onClick}
  >
    {innerContent}
  </div>
)

export default OperationBtn
