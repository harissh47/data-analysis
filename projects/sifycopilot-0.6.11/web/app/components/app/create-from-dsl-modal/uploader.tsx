'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import { Yaml as YamlIcon } from '@/app/components/base/icons/src/public/files'
import { ToastContext } from '@/app/components/base/toast'
import { Trash03, UploadCloud01 } from '@/app/components/base/icons/src/vender/line/general'
import Button from '@/app/components/base/button'

export type Props = {
  file: File | undefined
  updateFile: (file?: File) => void
}

const Uploader: FC<Props> = ({
  file,
  updateFile,
}) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const [dragging, setDragging] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)
  const fileUploader = useRef<HTMLInputElement>(null)

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
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (!e.dataTransfer)
      return
    const files = [...e.dataTransfer.files]
    if (files.length > 1) {
      notify({ type: 'error', message: t('datasetCreation.stepOne.uploader.validation.count') })
      return
    }
    updateFile(files[0])
  }
  const selectHandle = () => {
    if (fileUploader.current)
      fileUploader.current.click()
  }
  const removeFile = () => {
    if (fileUploader.current)
      fileUploader.current.value = ''
    updateFile()
  }
  const fileChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFile = e.target.files?.[0]
    updateFile(currentFile)
  }

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
  }, [])

  return (
    <div className='mt-6'>
      <input
        ref={fileUploader}
        style={{ display: 'none' }}
        type="file"
        id="fileUploader"
        accept='.yml'
        onChange={fileChangeHandle}
      />
      <div ref={dropRef}>
        {!file && (
          // <div className={cn('flex items-center h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-sm font-normal', dragging && 'bg-[#F5F8FF] border border-[#B2CCFF]')}>
          <div className={cn('flex items-center h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-sm font-normal dark:bg-[#3f3f3f] dark:border-[#5F5F5F]', dragging && 'bg-[#F5F8FF] border border-[#B2CCFF]')}>
            <div className='w-full flex items-center justify-center space-x-2'>
              <UploadCloud01 className='w-6 h-6 mr-2 dark:text-[#6B7280]'/>
              {/* <div className='text-gray-500'> */}
              <div className='text-gray-500 dark:text-white'>
                {t('datasetCreation.stepOne.uploader.button')}
                {/* <span className='pl-1 text-[#155eef] cursor-pointer' onClick={selectHandle}>{t */}
                <span className='pl-1 text-[#8AB40A] cursor-pointer' onClick={selectHandle}>{t('datasetDocuments.list.batchModal.browse')}</span>
              </div>
            </div>
            {dragging && <div ref={dragRef} className='absolute w-full h-full top-0 left-0'/>}
          </div>
        )}
        {file && (
          // <div className={cn('flex items-center h-20 px-6 rounded-xl bg-gray-50 border border-gray-200 text-sm font-normal group', 'hover:bg-[#F5F8FF] hover:border-[#B2CCFF]')}>
          <div className={cn('flex items-center h-20 px-6 rounded-xl bg-gray-50 dark:bg-[#383838] border border-gray-200 dark:border-[#5F5F5F] text-sm font-normal group', 'hover:bg-[#F5F8FF] hover:border-[#B2CCFF] dark:hover:border-[#B2CCFF]')}>
            <YamlIcon className="shrink-0" />
            <div className='flex ml-2 w-0 grow'>
              <span className='max-w-[calc(100%_-_30px)] text-ellipsis whitespace-nowrap overflow-hidden text-gray-800 dark:text-white'>{file.name.replace(/(.yaml|.yml)$/, '')}</span>
              <span className='shrink-0 text-gray-500 dark:text-[#6B7280]'>.yml</span>
            </div>
            <div className='hidden group-hover:flex items-center'>
              <Button className='!h-8 !px-3 !py-[6px] bg-white !text-[13px] !leading-[18px] text-gray-700 dark:bg-[#333333] dark:border-[#5F5F5F] dark:hover:bg-transparent dark:hover:shadow-[#5F5F5F]' onClick={selectHandle}>{t('datasetCreation.stepOne.uploader.change')}</Button>
              <div className='mx-2 w-px h-4 bg-gray-200' />
              <div className='p-2 cursor-pointer' onClick={removeFile}>
                <Trash03 className='w-4 h-4 text-gray-500 dark:text-[#6B7280]' />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(Uploader)

// 'use client'
// import type { FC } from 'react'
// import React, { useEffect, useRef, useState } from 'react'
// import cn from 'classnames'
// import { useTranslation } from 'react-i18next'
// import { useContext } from 'use-context-selector'
// import { Yaml as YamlIcon } from '@/app/components/base/icons/src/public/files'
// import { ToastContext } from '@/app/components/base/toast'
// import { Trash03, UploadCloud01 } from '@/app/components/base/icons/src/vender/line/general'
// import Button from '@/app/components/base/button'

// export type Props = {
//   file: File | undefined
//   updateFile: (file?: File, fileName?: string) => void
// }

// const Uploader: FC<Props> = ({
//   file,
//   updateFile,
// }) => {
//   const { t } = useTranslation()
//   const { notify } = useContext(ToastContext)
//   const [dragging, setDragging] = useState(false)
//   const [publicFiles, setPublicFiles] = useState<string[]>([
//     'automated_email_reply_copilot',
//     'book_translation_copilot',
//     'copilot_investment_analysis_report',

//   ])
//   const [selectedPublicFile, setSelectedPublicFile] = useState<string | null>(null)
//   const dropRef = useRef<HTMLDivElement>(null)
//   const dragRef = useRef<HTMLDivElement>(null)
//   const fileUploader = useRef<HTMLInputElement>(null)

//   const handleDragEnter = (e: DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     e.target !== dragRef.current && setDragging(true)
//   }
  
//   const handleDragOver = (e: DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//   }
  
//   const handleDragLeave = (e: DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     e.target === dragRef.current && setDragging(false)
//   }
  
//   const handleDrop = (e: DragEvent) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragging(false)
//     if (!e.dataTransfer) return
//     const files = [...e.dataTransfer.files]
//     if (files.length > 1) {
//       notify({ type: 'error', message: t('datasetCreation.stepOne.uploader.validation.count') })
//       return
//     }
//     updateFile(files[0])
//     setSelectedPublicFile(null) // Clear public file selection if a new file is uploaded
//   }

//   const selectHandle = () => {
//     if (fileUploader.current)
//       fileUploader.current.click()
//   }

//   const removeFile = () => {
//     if (fileUploader.current) fileUploader.current.value = ''
//     updateFile()
//     setSelectedPublicFile(null)
//   }

//   const fileChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const currentFile = e.target.files?.[0]
//     updateFile(currentFile)
//     setSelectedPublicFile(null) 
//   }

//   const selectPublicFile = (fileName: string) => {
//     setSelectedPublicFile(fileName)
//     updateFile(undefined, fileName) // Set file to undefined, but pass the selected public file
//   }

//   // Set up drag-and-drop event listeners
//   useEffect(() => {
//     dropRef.current?.addEventListener('dragenter', handleDragEnter)
//     dropRef.current?.addEventListener('dragover', handleDragOver)
//     dropRef.current?.addEventListener('dragleave', handleDragLeave)
//     dropRef.current?.addEventListener('drop', handleDrop)
    
//     return () => {
//       dropRef.current?.removeEventListener('dragenter', handleDragEnter)
//       dropRef.current?.removeEventListener('dragover', handleDragOver)
//       dropRef.current?.removeEventListener('dragleave', handleDragLeave)
//       dropRef.current?.removeEventListener('drop', handleDrop)
//     }
//   }, [])

//   return (
//     <div className='mt-6'>
//       <input
//         ref={fileUploader}
//         style={{ display: 'none' }}
//         type="file"
//         id="fileUploader"
//         accept='.yml'
//         onChange={fileChangeHandle}
//       />
//       <div ref={dropRef}>
//         {!file && !selectedPublicFile && (
//           <div className={cn('flex items-center h-20 rounded-xl bg-gray-50 border border-dashed border-gray-200 text-sm font-normal', dragging && 'bg-[#F5F8FF] border border-[#B2CCFF]')}>
//             <div className='w-full flex items-center justify-center space-x-2'>
//               <UploadCloud01 className='w-6 h-6 mr-2'/>
//               <div className='text-gray-500'>
//                 {t('datasetCreation.stepOne.uploader.button')}
//                 <span className='pl-1 text-[#8AB40A] cursor-pointer' onClick={selectHandle}>{t('datasetDocuments.list.batchModal.browse')}</span>
//               </div>
//             </div>
//             {dragging && <div ref={dragRef} className='absolute w-full h-full top-0 left-0'/>}
//           </div>
//         )}

//         {(file || selectedPublicFile) && (
//           <div className={cn('flex items-center h-20 px-6 rounded-xl bg-gray-50 border border-gray-200 text-sm font-normal group', 'hover:bg-[#F5F8FF] hover:border-[#B2CCFF]')}>
//             <YamlIcon className="shrink-0" />
//             <div className='flex ml-2 w-0 grow'>
//               <span className='max-w-[calc(100%_-_30px)] text-ellipsis whitespace-nowrap overflow-hidden text-gray-800'>{file ? file.name.replace(/(.yaml|.yml)$/, '') : selectedPublicFile}</span>
//               <span className='shrink-0 text-gray-500'>.yml</span>
//             </div>
//             <div className='hidden group-hover:flex items-center'>
//               <Button className='!h-8 !px-3 !py-[6px] bg-white !text-[13px] !leading-[18px] text-gray-700' onClick={selectHandle}>{t('datasetCreation.stepOne.uploader.change')}</Button>
//               <div className='mx-2 w-px h-4 bg-gray-200' />
//               <div className='p-2 cursor-pointer' onClick={removeFile}>
//                 <Trash03 className='w-4 h-4 text-gray-500' />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Public File List */}
//       <div className="mt-4 overflow-scroll-y">
//         <h3 className="text-gray-600 text-xl font-semibold">Create from Template</h3>
//         <ul className="space-y-2">
//           {publicFiles.map((publicFile) => (
//             <li key={publicFile}>
//               <button
//                 onClick={() => selectPublicFile(publicFile)}
//                 className={cn('w-full text-left p-2 rounded-md', selectedPublicFile === publicFile && 'bg-gray-200')}
//               >
//                 {publicFile}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   )
// }

// export default Uploader
