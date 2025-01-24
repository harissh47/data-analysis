'use client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { XMarkIcon } from '@heroicons/react/20/solid'
import s from './index.module.css'
import type { CustomFile as File } from '@/models/datasets'
import { fetchFilePreview } from '@/service/common'

type IProps = {
  file?: File
  hidePreview: () => void
}

const FilePreview = ({
  file,
  hidePreview,
}: IProps) => {
  const { t } = useTranslation()
  const [previewContent, setPreviewContent] = useState('')
  const [loading, setLoading] = useState(true)

  const getPreviewContent = async (fileID: string) => {
    try {
      const res = await fetchFilePreview({ fileID })
      setPreviewContent(res.content)
      setLoading(false)
    }
    catch {}
  }

  const getFileName = (currentFile?: File) => {
    if (!currentFile)
      return ''
    const arr = currentFile.name.split('.')
    return arr.slice(0, -1).join()
  }

  useEffect(() => {
    if (file?.id) {
      setLoading(true)
      getPreviewContent(file.id)
    }
  }, [file])

  return (
    // <div className={cn(s.filePreview)}>
    <div className="flex flex-col border-l border-gray-200dark:border-[#5f5f5f] shrink-0 w-[528px] bg-[#fcfcfd] dark:bg-[#202020] h-screen">
      <div className={cn(s.previewHeader)}>
        {/* <div className={cn(s.title)}> */}
        <div className="flex justify-between items-center text-[#101828] dark:text-white font-semibold text-lg leading-7">
          <span>{t('datasetCreation.stepOne.filePreview')}</span>
          <div className='flex items-center justify-center w-6 h-6 cursor-pointer' onClick={hidePreview}>
            <XMarkIcon className='h-4 w-4'></XMarkIcon>
          </div>
        </div>
        {/* <div className={cn(s.fileName)}> */}
        <div className="font-normal text-xs leading-4 text-[#1D2939] dark:text-[#FCFCFC]">
          {/* <span>{getFileName(file)}</span><span className={cn(s.filetype)}>.{file?.extension}</span> */}
          <span>{getFileName(file)}</span>
          <span className="text-[#667085] dark:text-[#FCFCFC]">.{file?.extension}</span>
        </div>
      </div>
      {/* <div className={cn(s.previewContent)}> */}
      <div className="overflow-y-auto overflow-x-auto grow px-8 py-5 text-[#344054] dark:text-[#FCFCFC] font-normal text-base leading-6 whitespace-nowrap h-[calc(100vh-100px)] relative">
        {loading && <div className={cn(s.loading)}/>}
        {!loading && (
          <div className={cn(s.fileContent)}>{previewContent}</div>
        )}
      </div>
    </div>
  )
}

export default FilePreview
