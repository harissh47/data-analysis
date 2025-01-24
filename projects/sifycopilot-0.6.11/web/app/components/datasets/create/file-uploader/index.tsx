'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import cn from 'classnames'
import useSWR from 'swr'
import s from './index.module.css'
import type { CustomFile as File, FileItem } from '@/models/datasets'
import { ToastContext } from '@/app/components/base/toast'

import { upload } from '@/service/base'
import { fetchFileUploadConfig } from '@/service/common'
import { fetchSupportFileTypes } from '@/service/datasets'
import I18n from '@/context/i18n'
import { LanguagesSupported } from '@/i18n/language'
import { IS_CE_EDITION } from '@/config'

const FILES_NUMBER_LIMIT = 20

type IFileUploaderProps = {
  fileList: FileItem[]
  titleClassName?: string
  prepareFileList: (files: FileItem[]) => void
  onFileUpdate: (fileItem: FileItem, progress: number, list: FileItem[]) => void
  onFileListUpdate?: (files: FileItem[]) => void
  onPreview: (file: File) => void
  notSupportBatchUpload?: boolean
}

const FileUploader = ({
  fileList,
  titleClassName,
  prepareFileList,
  onFileUpdate,
  onFileListUpdate,
  onPreview,
  notSupportBatchUpload,
}: IFileUploaderProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { locale } = useContext(I18n)
  const [dragging, setDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const fileUploader = useRef<HTMLInputElement>(null)
  const hideUpload = notSupportBatchUpload && fileList.length > 0

  const { data: fileUploadConfigResponse } = useSWR({ url: '/files/upload' }, fetchFileUploadConfig)
  const { data: supportFileTypesResponse } = useSWR({ url: '/files/support-type' }, fetchSupportFileTypes)
  const supportTypes = supportFileTypesResponse?.allowed_extensions || []
  const supportTypesShowNames = (() => {
    const extensionMap: { [key: string]: string } = {
      md: 'markdown',
      pptx: 'pptx',
      htm: 'html',
      xlsx: 'xlsx',
      docx: 'docx',
    }

    return [...supportTypes]
      .map(item => extensionMap[item] || item) // map to standardized extension
      .map(item => item.toLowerCase()) // convert to lower case
      .filter((item, index, self) => self.indexOf(item) === index) // remove duplicates
      .map(item => item.toUpperCase()) // convert to upper case
      .join(locale !== LanguagesSupported[1] ? ', ' : '、 ')
  })()
  const ACCEPTS = supportTypes.map((ext: string) => `.${ext}`)
  const fileUploadConfig = useMemo(() => fileUploadConfigResponse ?? {
    file_size_limit: 15,
    batch_count_limit: 5,
  }, [fileUploadConfigResponse])

  const fileListRef = useRef<FileItem[]>([])

  // utils
  const getFileType = (currentFile: File) => {
    if (!currentFile)
      return ''

    const arr = currentFile.name.split('.')
    return arr[arr.length - 1]
  }

  const getFileSize = (size: number) => {
    if (size / 1024 < 10)
      return `${(size / 1024).toFixed(2)}KB`

    return `${(size / 1024 / 1024).toFixed(2)}MB`
  }

  const isValid = useCallback((file: File) => {
    const { size } = file
    const ext = `.${getFileType(file)}`
    const isValidType = ACCEPTS.includes(ext.toLowerCase())
    if (!isValidType)
      notify({ type: 'error', message: t('datasetCreation.stepOne.uploader.validation.typeError') })

    const isValidSize = size <= fileUploadConfig.file_size_limit * 1024 * 1024
    if (!isValidSize)
      notify({ type: 'error', message: t('datasetCreation.stepOne.uploader.validation.size', { size: fileUploadConfig.file_size_limit }) })

    return isValidType && isValidSize
  }, [fileUploadConfig, notify, t, ACCEPTS])

  const fileUpload = useCallback(async (fileItem: FileItem): Promise<FileItem> => {
    const formData = new FormData()
    formData.append('file', fileItem.file)
    const onProgress = (e: ProgressEvent) => {
      if (e.lengthComputable) {
        const percent = Math.floor(e.loaded / e.total * 100)
        onFileUpdate(fileItem, percent, fileListRef.current)
      }
    }

    return upload({
      xhr: new XMLHttpRequest(),
      data: formData,
      onprogress: onProgress,
    }, false, undefined, '?source=datasets')
      .then((res: File) => {
        const completeFile = {
          fileID: fileItem.fileID,
          file: res,
          progress: -1,
        }
        const index = fileListRef.current.findIndex(item => item.fileID === fileItem.fileID)
        fileListRef.current[index] = completeFile
        onFileUpdate(completeFile, 100, fileListRef.current)
        return Promise.resolve({ ...completeFile })
      })
      .catch((e) => {
        notify({ type: 'error', message: e?.response?.code === 'forbidden' ? e?.response?.message : t('datasetCreation.stepOne.uploader.failed') })
        onFileUpdate(fileItem, -2, fileListRef.current)
        return Promise.resolve({ ...fileItem })
      })
      .finally()
  }, [fileListRef, notify, onFileUpdate, t])

  const uploadBatchFiles = useCallback((bFiles: FileItem[]) => {
    bFiles.forEach(bf => (bf.progress = 0))
    return Promise.all(bFiles.map(fileUpload))
  }, [fileUpload])

  const uploadMultipleFiles = useCallback(async (files: FileItem[]) => {
    const batchCountLimit = fileUploadConfig.batch_count_limit
    const length = files.length
    let start = 0
    let end = 0

    while (start < length) {
      if (start + batchCountLimit > length)
        end = length
      else
        end = start + batchCountLimit
      const bFiles = files.slice(start, end)
      await uploadBatchFiles(bFiles)
      start = end
    }
  }, [fileUploadConfig, uploadBatchFiles])

  const initialUpload = useCallback((files: File[]) => {
    if (!files.length)
      return false

    if (files.length + fileList.length > FILES_NUMBER_LIMIT && !IS_CE_EDITION) {
      notify({ type: 'error', message: t('datasetCreation.stepOne.uploader.validation.filesNumber', { filesNumber: FILES_NUMBER_LIMIT }) })
      return false
    }

    const preparedFiles = files.map((file, index) => ({
      fileID: `file${index}-${Date.now()}`,
      file,
      progress: -1,
    }))
    const newFiles = [...fileListRef.current, ...preparedFiles]
    prepareFileList(newFiles)
    fileListRef.current = newFiles
    uploadMultipleFiles(preparedFiles)
  }, [prepareFileList, uploadMultipleFiles, notify, t, fileList])

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.target !== dragRef.current && setDragging(true)
  }
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.target === dragRef.current && setDragging(false)
  }

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (!e.dataTransfer)
      return

    const files = [...e.dataTransfer.files] as File[]
    const validFiles = files.filter(isValid)
    initialUpload(validFiles)
  }, [initialUpload, isValid])

  const selectHandle = () => {
    if (fileUploader.current)
      fileUploader.current.click()
  }

  const removeFile = (fileID: string) => {
    if (fileUploader.current)
      fileUploader.current.value = ''

    fileListRef.current = fileListRef.current.filter(item => item.fileID !== fileID)
    onFileListUpdate?.([...fileListRef.current])
  }
  const fileChangeHandle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...(e.target.files ?? [])] as File[]
    initialUpload(files.filter(isValid))
  }, [isValid, initialUpload])

  useEffect(() => {
    dropRef.current?.addEventListener('dragenter', handleDragEnter)
    dropRef.current?.addEventListener('dragover', handleDragOver)
    dropRef.current?.addEventListener('dragleave', handleDragLeave)
    dropRef.current?.addEventListener('drop', handleDrop)
    return () => {
      dropRef.current?.removeEventListener('dragenter', handleDragEnter)
      dropRef.current?.removeEventListener('dragover', handleDragOver)
      dropRef.current?.removeEventListener('dragleave', handleDragLeave)
      dropRef.current?.removeEventListener('drop', handleDrop)
    }
  }, [handleDrop])

  return (
    <div className={s.fileUploader}>
      {!hideUpload && (
        <input
          ref={fileUploader}
          id="fileUploader"
          style={{ display: 'none' }}
          type="file"
          multiple={!notSupportBatchUpload}
          accept={ACCEPTS.join(',')}
          onChange={fileChangeHandle}
        />
      )}

      {/* <div className={cn(s.title, titleClassName)}>{t('datasetCreation.stepOne.uploader.title')}</div> */}
      
      <div className={cn(
    "mb-2 font-medium text-[16px] leading-[24px] text-[#344054] dark:text-white",
    titleClassName
  )}>{t('datasetCreation.stepOne.uploader.title')}</div>

      {!hideUpload && (

        <div ref={dropRef} 
        className={cn(s.uploader, dragging && s.dragging)}>
        {/*  className={cn(
        //   "relative box-border flex justify-center items-center mb-2 p-3 flex-col max-w-[640px] min-h-[80px] bg-[#F9FAFB] dark:bg-[#3F3F3F] border border-dashed border-[#EAECF0] dark:border-[#5F5F5F] rounded-[12px] font-normal text-[14px] leading-[20px] text-[#667085]",
        //   dragging &&
        //   "bg-[#F5F8FF] border-[#B2CCFF] dark:border-[#5F5F5F]"
        //   )} */}
        
          <div className='flex justify-center items-center min-h-6 mb-2 '>
          {/* <div className='flex justify-center items-center min-h-6 mb-2 dark:text-white'> */}
            <span className={s.uploadIcon} />
            
            {/* <span
              className="block mr-2 w-6 h-6 bg-center bg-no-repeat dark:text-[#6B7280]"
              style={{
              backgroundImage: "url('../assets/upload-cloud-01.svg')",
              backgroundSize: "contain",
              }}
              /> */}

            <span>
              {t('datasetCreation.stepOne.uploader.button')}
              {/* <label className={s.browse} onClick={selectHandle}>{t('datasetCreation.stepOne.uploader.browse')}</label> */}
              <label className="pl-1 cursor-pointer text-[#8AB40A] dark:text-[#8AB40A]"
              onClick={selectHandle}>
              {t('datasetCreation.stepOne.uploader.browse')}
              </label>

            </span>
          </div>
          {/* <div className={s.tip}>{t('datasetCreation.stepOne.uploader.tip', {  */}
          <div className={"font-normal text-[12px] leading-[18px] text-[#667085] dark:text-[#A1A6B2]"}>{t('datasetCreation.stepOne.uploader.tip', {
        
            size: fileUploadConfig.file_size_limit,
            supportTypes: supportTypesShowNames,
          })}</div>
          {dragging && <div ref={dragRef} className={s.draggingCover} />}
        </div>
      )}
      <div className={s.fileList}>
        {fileList.map((fileItem, index) => (
          <div
            key={`${fileItem.fileID}-${index}`}
            onClick={() => fileItem.file?.id && onPreview(fileItem.file)}
            className={cn(
              s.file,
              fileItem.progress < 100 && s.uploading,
            )}
            // className={cn(
            //   "box-border relative flex items-center justify-between p-2 max-w-[640px] h-10 bg-white dark:bg-[#3F3F3F] border border-[#EAECF0] dark:border-[#5f5f5f] shadow-sm rounded-md overflow-hidden cursor-pointer",
            //   fileItem.progress < 100 && "bg-[#FCFCFD] border-[#EAECF0] dark:border-[#5f5f5f] "
            // )}
            >
            
            {fileItem.progress < 100 && (
              <div className={s.progressbar} style={{ width: `${fileItem.progress}%` }} />
            )}
            <div className={s.fileInfo}>
              <div className={cn(s.fileIcon, s[getFileType(fileItem.file)])} />
              {/* <div className={s.filename}>{fileItem.file.name}</div>
              <div className={s.size}>{getFileSize(fileItem.file.size)}</div> */}
              <div className="font-medium text-[13px] leading-[18px] text-[#1D2939]">
              {fileItem.file.name}
              </div>
              <div className="ml-3 font-normal text-[12px] leading-[18px] text-[#667085] ">
              {getFileSize(fileItem.file.size)}
              </div>

            </div>
            <div className={s.actionWrapper}>
              {(fileItem.progress < 100 && fileItem.progress >= 0) && (
                <div className={s.percent}>{`${fileItem.progress}%`}</div>
              )}
              {fileItem.progress === 100 && (
                <div className={s.remove} onClick={(e) => {
                  e.stopPropagation()
                  removeFile(fileItem.fileID)
                }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FileUploader
