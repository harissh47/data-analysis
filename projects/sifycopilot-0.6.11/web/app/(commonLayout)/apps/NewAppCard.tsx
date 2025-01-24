'use client'

import { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CreateAppTemplateDialog from '@/app/components/app/create-app-dialog'
import CreateAppModal from '@/app/components/app/create-app-modal'
import CreateFromDSLModal from '@/app/components/app/create-from-dsl-modal'
import { useProviderContext } from '@/context/provider-context'
import { FileArrow01, FilePlus01, FilePlus02 } from '@/app/components/base/icons/src/vender/line/files'

export type CreateAppCardProps = {
  onSuccess?: () => void
}

// eslint-disable-next-line react/display-name
const CreateAppCard = forwardRef<HTMLAnchorElement, CreateAppCardProps>(({ onSuccess }, ref) => {
  const { t } = useTranslation()
  const { onPlanInfoChanged } = useProviderContext()

  const [showNewAppTemplateDialog, setShowNewAppTemplateDialog] = useState(false)
  const [showNewAppModal, setShowNewAppModal] = useState(false)
  const [showCreateFromDSLModal, setShowCreateFromDSLModal] = useState(false)
  const CreateIcon = () => (
    // <svg fill="#000000" height="14" width="14" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502 502" xmlSpace="preserve" stroke="#000000" stroke-width="10.04" className='mr-2'>
    //   <g>
    //     <g>
    //       <path d="M405.889,348.576V105.273c0-2.652-1.054-5.196-2.929-7.071L307.688,2.929C305.812,1.054,303.269,0,300.617,0H70.783 c-5.523,0-10,4.477-10,10v445.916c0,5.523,4.477,10,10,10h216.442C303.083,488.611,328.615,502,356.57,502 c46.674,0,84.646-37.972,84.646-84.646C441.217,389.827,428.102,364.485,405.889,348.576z M80.783,20h215.691l76.158,76.158 h-51.151c-5.522,0-10,4.477-10,10s4.478,10,10,10h64.408v221.789c-9.334-3.451-19.247-5.241-29.319-5.241 c-46.675,0-84.647,37.973-84.647,84.647c0,9.793,1.692,19.45,4.955,28.562H80.783V20z M356.57,482 c-22.766,0-43.43-11.629-55.277-31.107c-6.13-10.077-9.37-21.675-9.37-33.539c0-35.646,29.001-64.647,64.647-64.647 c11.785,0,23.28,3.21,33.334,9.278c0.474,0.355,0.979,0.67,1.513,0.938c18.668,11.975,29.799,32.278,29.799,54.431 C421.217,453,392.217,482,356.57,482z"></path>
    //       <path d="M394.345,407.354h-27.776v-27.776c0-5.523-4.478-10-10-10s-10,4.477-10,10v27.776h-27.776c-5.522,0-10,4.477-10,10 s4.478,10,10,10h27.776v27.776c0,5.523,4.478,10,10,10s10-4.477,10-10v-27.776h27.776c5.522,0,10-4.477,10-10 S399.868,407.354,394.345,407.354z"></path>
    //       <path d="M292.56,106.158c0-5.523-4.478-10-10-10h-11.447c-5.522,0-10,4.477-10,10s4.478,10,10,10h11.447 C288.083,116.158,292.56,111.681,292.56,106.158z"></path>
    //     </g>
    //   </g>
    // </svg>
    <svg width="1rem" height="1rem" viewBox="0 0 21 21" fill="#6B7280" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g fill="none" fillRule="evenodd" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" transform="translate(3 3)">
          <path d="m7 1.5h-4.5c-1.1045695 0-2 .8954305-2 2v9.0003682c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5003682"></path>
          <path d="m14.5.46667982c.5549155.5734054.5474396 1.48588056-.0167966 2.05011677l-6.9832034 6.98320341-3 1 1-3 6.9874295-7.04563515c.5136195-.5178979 1.3296676-.55351813 1.8848509-.1045243z"></path>
          <path d="m12.5 2.5.953 1"></path>
        </g>
      </g>
    </svg>
  )

  const ImportIcon = () => (
    // <svg
    //   width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
    //   <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    //   <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    //   <g id="SVGRepo_iconCarrier">
    //     <path d="M14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V4C11.25 3.58579 11.5858 3.25 12 3.25C12.4142 3.25 12.75 3.58579 12.75 4V12.1893L14.4697 10.4697Z" fill="#1C274C"></path>
    //     <path d="M20.75 12C20.75 11.5858 20.4142 11.25 20 11.25C19.5858 11.25 19.25 11.5858 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99593 19.25 4.75 16.0041 4.75 12C4.75 11.5858 4.41421 11.25 4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 16.8325 7.16751 20.75 12 20.75C16.8325 20.75 20.75 16.8325 20.75 12Z" fill="#1C274C"></path>
    //   </g>
    // </svg>
    <svg
    width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier">
      <path d="M14.4697 10.4697C14.7626 10.1768 15.2374 10.1768 15.5303 10.4697C15.8232 10.7626 15.8232 11.2374 15.5303 11.5303L12.5303 14.5303C12.2374 14.8232 11.7626 14.8232 11.4697 14.5303L8.46967 11.5303C8.17678 11.2374 8.17678 10.7626 8.46967 10.4697C8.76256 10.1768 9.23744 10.1768 9.53033 10.4697L11.25 12.1893V4C11.25 3.58579 11.5858 3.25 12 3.25C12.4142 3.25 12.75 3.58579 12.75 4V12.1893L14.4697 10.4697Z" fill="#6B7280"></path>
      <path d="M20.75 12C20.75 11.5858 20.4142 11.25 20 11.25C19.5858 11.25 19.25 11.5858 19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99593 19.25 4.75 16.0041 4.75 12C4.75 11.5858 4.41421 11.25 4 11.25C3.58579 11.25 3.25 11.5858 3.25 12C3.25 16.8325 7.16751 20.75 12 20.75C16.8325 20.75 20.75 16.8325 20.75 12Z" fill="#6B7280"></path>
    </g>
  </svg>
  )
  return (
    <a
      ref={ref}
      // className='relative col-span-1 flex flex-col justify-between min-h-[160px] bg-gray-200 rounded-xl border-[0.5px] border-black/5'
      className='flex gap-2 '
    >
      {/* <div className='grow p-2 rounded-t-xl'>
        <div className='px-6 pt-2 pb-1 text-xs font-medium leading-[18px] text-gray-500'>{t('app.createApp')}</div>
        <div className='flex items-center mb-1 px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-white' onClick={() => setShowNewAppModal(true)}>
          <FilePlus01 className='shrink-0 mr-2 w-4 h-4' />
          {t('app.newApp.startFromBlank')}
        </div>
        <div className='flex items-center px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-white' onClick={() => setShowNewAppTemplateDialog(true)}>
          <FilePlus02 className='shrink-0 mr-2 w-4 h-4' />
          {t('app.newApp.startFromTemplate')}
        </div>
      </div>
      <div
        className='p-2 border-t-[0.5px] border-black/5 rounded-b-xl' 
        onClick={() => setShowCreateFromDSLModal(true)}
      >
        <div className='flex items-center px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 hover:bg-white'>
          <FileArrow01 className='shrink-0 mr-2 w-4 h-4' />
          {t('app.importDSL')}
        </div>
      </div> */}
      {/* <div className='flex items-center px-6 py-[7px] rounded-lg text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:text-primary-600 ' */}
      {/* <div className='flex items-center px-4 py-2 rounded-lg border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white shadow-xs transition-all duration-200' */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white shadow-xs transition-all duration-200' */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 dark:text-[#E1E1E1] cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[1A1A1A] shadow-xs transition-all duration-200'
        onClick={() => setShowNewAppModal(true)}> */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 dark:text-[#E1E1E1] cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#1A1A1A] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-tl-full dark:rounded-br-full dark:shadow-sm' */}
        {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#1A1A1A] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-tl-full dark:rounded-br-full dark:shadow-sm' */}
        <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#333333] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 '

        onClick={() => setShowNewAppModal(true)}>
        {/* <FilePlus01 className='shrink-0 mr-2 w-4 h-4' /> */}
        <CreateIcon />
        {t('app.newApp.startFromBlank')}
      </div>

      {/* <div className='flex items-center px-4 py-2 rounded-lg border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white shadow-xs transition-all duration-200' */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white shadow-xs transition-all duration-200' */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 dark:text-[#E1E1E1] cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white shadow-xs transition-all duration-200'
        onClick={() => setShowCreateFromDSLModal(true)}> */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 dark:text-[#E1E1E1] cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#1A1A1A] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-tl-full dark:rounded-br-full dark:shadow-sm' */}
      {/* <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full border-[0.5px] border-transparent text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#1A1A1A] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-tl-full dark:rounded-br-full dark:shadow-sm' */}
      <div className='flex items-center px-6 py-2 rounded-tl-full rounded-br-full text-[13px] font-medium leading-[18px] text-gray-600 cursor-pointer hover:bg-gray-300 hover:text-primary-600 bg-white  dark:bg-[#333333] shadow-xs transition-all duration-200  bg-white border-gray-200 dark:hover:bg-zinc-800  text-primary-600 hover:bg-white dark:text-whit-27 '

        onClick={() => setShowCreateFromDSLModal(true)}>
        {/* <FileArrow01 className='shrink-0 mr-2 w-4 h-4' /> */}
        <ImportIcon />
        {/* {t('app.importDSL')} */}
        Create From Template
      </div>
      <CreateAppModal
        show={showNewAppModal}
        onClose={() => setShowNewAppModal(false)}
        onSuccess={() => {
          onPlanInfoChanged()
          if (onSuccess)
            onSuccess()
        }}
      />
      <CreateAppTemplateDialog
        show={showNewAppTemplateDialog}
        onClose={() => setShowNewAppTemplateDialog(false)}
        onSuccess={() => {
          onPlanInfoChanged()
          if (onSuccess)
            onSuccess()
        }}
      />
      <CreateFromDSLModal
        show={showCreateFromDSLModal}
        onClose={() => setShowCreateFromDSLModal(false)}
        onSuccess={() => {
          onPlanInfoChanged()
          if (onSuccess)
            onSuccess()
        }}
      />
    </a>
  )
})

export default CreateAppCard
