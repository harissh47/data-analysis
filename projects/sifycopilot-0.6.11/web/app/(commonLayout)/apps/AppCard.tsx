'use client'
import { ThemeContext } from './Apps' //import { ThemeContext } from './Apps'
import { useContextSelector } from 'use-context-selector'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'  
import { useContext } from 'react';   //import { ThemeContext } from './Apps'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import s from './style.module.css'
import type { App } from '@/types/app'
import Confirm from '@/app/components/base/confirm'
import { ToastContext } from '@/app/components/base/toast'
import { copyApp, deleteApp, exportAppConfig, updateAppInfo } from '@/service/apps'
import DuplicateAppModal from '@/app/components/app/duplicate-modal'
import type { DuplicateAppModalProps } from '@/app/components/app/duplicate-modal'
import AppIcon from '@/app/components/base/app-icon'
import AppsContext, { useAppContext } from '@/context/app-context'
import type { HtmlContentProps } from '@/app/components/base/popover'
import CustomPopover from '@/app/components/base/popover'
import Divider from '@/app/components/base/divider'
import { getRedirection } from '@/utils/app-redirection'
import { useProviderContext } from '@/context/provider-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { AiText, ChatBot, CuteRobote } from '@/app/components/base/icons/src/vender/solid/communication'
import { Route } from '@/app/components/base/icons/src/vender/solid/mapsAndTravel'
import { DotsHorizontal, Edit02, Trash03 } from '@/app/components/base/icons/src/vender/line/general'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
import EditAppModal from '@/app/components/explore/create-app-modal'
import SwitchAppModal from '@/app/components/app/switch-app-modal'
import type { Tag } from '@/app/components/base/tag-management/constant'
import TagSelector from '@/app/components/base/tag-management/selector'
import Image from 'next/image'
import Chatbot from './assets/chatbot.png'
import { Edit03, Edit04 } from '@/app/components/base/icons/src/vender/solid/general'
import TooltipPlus from '@/app/components/base/tooltip-plus'

export type AppCardProps = {
  app: App
  onRefresh?: () => void
}

const AppCard = ({ app, onRefresh }: AppCardProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { onPlanInfoChanged } = useProviderContext()
  const { push } = useRouter()

  // const Chatbot = require('./assets/chatbot.png').default

  const mutateApps = useContextSelector(
    AppsContext,
    state => state.mutateApps,
  )
  const { themeStyles, toggleTheme } = useContext(ThemeContext);  // call the theme style  function


  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [isTouched, setIsTouched] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteApp(app.id)
      notify({ type: 'success', message: t('app.appDeleted') })
      if (onRefresh)
        onRefresh()
      mutateApps()
      onPlanInfoChanged()
    }
    catch (e: any) {
      notify({
        type: 'error',
        message: `${t('app.appDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}`,
      })
    }
    setShowConfirmDelete(false)
  }, [app.id])

  const onEdit: CreateAppModalProps['onConfirm'] = useCallback(async ({
    name,
    icon,
    icon_background,
    description,
  }) => {
    try {
      await updateAppInfo({
        appID: app.id,
        name,
        icon,
        icon_background,
        description,
      })
      setShowEditModal(false)
      notify({
        type: 'success',
        message: t('app.editDone'),
      })
      if (onRefresh)
        onRefresh()
      mutateApps()
    }
    catch (e) {
      notify({ type: 'error', message: t('app.editFailed') })
    }
  }, [app.id, mutateApps, notify, onRefresh, t])

  const onCopy: DuplicateAppModalProps['onConfirm'] = async ({ name, icon, icon_background }) => {
    try {
      const newApp = await copyApp({
        appID: app.id,
        name,
        icon,
        icon_background,
        mode: app.mode,
      })
      setShowDuplicateModal(false)
      notify({
        type: 'success',
        message: t('app.newApp.appCreated'),
      })
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      if (onRefresh)
        onRefresh()
      mutateApps()
      onPlanInfoChanged()
      getRedirection(isCurrentWorkspaceEditor, newApp, push)
    }
    catch (e) {
      notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
  }

  const onExport = async () => {
    try {
      const { data } = await exportAppConfig(app.id)
      const a = document.createElement('a')
      const file = new Blob([data], { type: 'application/yaml' })
      a.href = URL.createObjectURL(file)
      a.download = `${app.name}.yml`
      a.click()
    }
    catch (e) {
      notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const onSwitch = () => {
    if (onRefresh)
      onRefresh()
    mutateApps()
    setShowSwitchModal(false)
  }

  const DuplicateIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 32 32" fill="#6B7280" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g id="Icon-Set" transform="translate(-204.000000, -931.000000)" fill="#6B7280" >
            <path d="M234,951 C234,952.104 233.104,953 232,953 L216,953 C214.896,953 214,952.104 214,951 L214,935 C214,933.896 214.896,933 216,933 L232,933 C233.104,933 234,933.896 234,935 L234,951 L234,951 Z M232,931 L216,931 C213.791,931 212,932.791 212,935 L212,951 C212,953.209 213.791,955 216,955 L232,955 C234.209,955 236,953.209 236,951 L236,935 C236,932.791 234.209,931 232,931 L232,931 Z M226,959 C226,960.104 225.104,961 224,961 L208,961 C206.896,961 206,960.104 206,959 L206,943 C206,941.896 206.896,941 208,941 L210,941 L210,939 L208,939 C205.791,939 204,940.791 204,943 L204,959 C204,961.209 205.791,963 208,963 L224,963 C226.209,963 228,961.209 228,959 L228,957 L226,957 L226,959 L226,959 Z" id="duplicate"></path>
          </g>
        </g>
      </g>
    </svg>
  )

  const ExportIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
      {/* <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="#292D32" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path> */}
     <path d="M16.44 8.8999C20.04 9.2099 21.51 11.0599 21.51 15.1099V15.2399C21.51 19.7099 19.72 21.4999 15.25 21.4999H8.73998C4.26998 21.4999 2.47998 19.7099 2.47998 15.2399V15.1099C2.47998 11.0899 3.92998 9.2399 7.46998 8.9099" stroke="#6B7280" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path>
     {/* <path d="M12 15.0001V3.62012" stroke="#292D32" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path> */}
        <path d="M12 15.0001V3.62012" stroke="#6B7280" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path>
        {/* <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="#292D32" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path> */}
        <path d="M15.35 5.85L12 2.5L8.65002 5.85" stroke="#6B7280" strokeWidth="1.656" strokeLinecap="round" strokeLinejoin="round" ></path>
      </g>
    </svg>
  )

  const SwitchIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        {/* <path d="M18.7153 1.71609C18.3241 1.32351 18.3241 0.687013 18.7153 0.294434C19.1066 -0.0981448 19.7409 -0.0981448 20.1321 0.294434L22.4038 2.57397L22.417 2.58733C23.1935 3.37241 23.1917 4.64056 22.4116 5.42342L20.1371 7.70575C19.7461 8.09808 19.1122 8.09808 18.7213 7.70575C18.3303 7.31342 18.3303 6.67733 18.7213 6.285L20.0018 5L4.99998 5C4.4477 5 3.99998 5.44772 3.99998 6V13C3.99998 13.5523 3.55227 14 2.99998 14C2.4477 14 1.99998 13.5523 1.99998 13V6C1.99998 4.34315 3.34313 3 4.99998 3H19.9948L18.7153 1.71609Z" fill="#0F0F0F" /> */}
        <path d="M18.7153 1.71609C18.3241 1.32351 18.3241 0.687013 18.7153 0.294434C19.1066 -0.0981448 19.7409 -0.0981448 20.1321 0.294434L22.4038 2.57397L22.417 2.58733C23.1935 3.37241 23.1917 4.64056 22.4116 5.42342L20.1371 7.70575C19.7461 8.09808 19.1122 8.09808 18.7213 7.70575C18.3303 7.31342 18.3303 6.67733 18.7213 6.285L20.0018 5L4.99998 5C4.4477 5 3.99998 5.44772 3.99998 6V13C3.99998 13.5523 3.55227 14 2.99998 14C2.4477 14 1.99998 13.5523 1.99998 13V6C1.99998 4.34315 3.34313 3 4.99998 3H19.9948L18.7153 1.71609Z" fill="#6B7280" />

        {/* <path d="M22 11C22 10.4477 21.5523 10 21 10C20.4477 10 20 10.4477 20 11V18C20 18.5523 19.5523 19 19 19L4.00264 19L5.28213 17.7161C5.67335 17.3235 5.67335 16.687 5.28212 16.2944C4.8909 15.9019 4.2566 15.9019 3.86537 16.2944L1.59369 18.574L1.58051 18.5873C0.803938 19.3724 0.805727 20.6406 1.58588 21.4234L3.86035 23.7058C4.25133 24.0981 4.88523 24.0981 5.2762 23.7058C5.66718 23.3134 5.66718 22.6773 5.2762 22.285L3.99563 21L19 21C20.6568 21 22 19.6569 22 18L22 11Z" fill="#0F0F0F" /> */}
        <path d="M22 11C22 10.4477 21.5523 10 21 10C20.4477 10 20 10.4477 20 11V18C20 18.5523 19.5523 19 19 19L4.00264 19L5.28213 17.7161C5.67335 17.3235 5.67335 16.687 5.28212 16.2944C4.8909 15.9019 4.2566 15.9019 3.86537 16.2944L1.59369 18.574L1.58051 18.5873C0.803938 19.3724 0.805727 20.6406 1.58588 21.4234L3.86035 23.7058C4.25133 24.0981 4.88523 24.0981 5.2762 23.7058C5.66718 23.3134 5.66718 22.6773 5.2762 22.285L3.99563 21L19 21C20.6568 21 22 19.6569 22 18L22 11Z" fill="#6B7280" />

      </g>
    </svg>
  )

  const [tags, setTags] = useState<Tag[]>(app.tags)
  useEffect(() => {
    setTags(app.tags)
  }, [app.tags])

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          getRedirection(isCurrentWorkspaceEditor, app, push);
        }}
        onMouseEnter={() => setIsTouched(true)}
        onMouseLeave={() => setIsTouched(false)}
        // className='group flex flex-col bg-grey border-2 border-solid border-transparent rounded-2xl shadow-sm min-h-[200px] flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg'
        // className='group flex flex-col bg-${RandomPastelColor} border-2 border-gray-200 border-solid rounded-xl shadow-sm min-h-[200px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg'
        // className={`group flex flex-col bg-grey border-2 border-gray-200 border-solid rounded-xl shadow-sm min-h-[200px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg`}
        // className={`group flex flex-col bg-grey border-2 border-gray-200 border-solid rounded-xl shadow-sm h-[205px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg`}
        // className={`group flex flex-col bg-white border-2 border-gray-200 border-solid rounded-xl shadow-sm h-[205px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg`}
        className={`group flex flex-col bg-white border-2 border-gray-200 border-solid rounded-xl shadow-sm h-[205px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg ${themeStyles.background} dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-xl dark:shadow-sm`}
      >
        {/* Container for Icon and Name */}
        {/* <div className='flex flex-col items-start pt-4 px-6 pb-3'> */}
        <div className="flex bg-grey flex-col items-center pt-4 px-4">

          {/* Chatbot Icon */}
          {/* <div className='flex-shrink-0 mb-2'> */}
          <div className="flex bg-yellow items-center justify-center w-30 h-30 rounded-full mb-1 ">

            {/* <AppIcon
              size="large"
              icon={app.icon}
              background={app.icon_background}
            /> */}
            {/* <img
              src={'/assets/chatbot.png'}
              alt='App Icon'
              className='w-full h-full object-contain rounded-full'
            >
            </img> */}
            {/* <span className='absolute bottom-[-3px] right-[-3px] w-4 h-4 p-0.5 bg-white rounded-full border-[0.5px] border-[rgba(0,0,0,0.1)] shadow-lg'> */}
            {app.mode === 'advanced-chat' && (
              // <ChatBot className='w-10 h-10 text-[#1570EF]' />
              // <img className='w-10 h-10' src='assets/chatguy.png' alt='advanced-chat' />
              <img className='w-10 h-10' src='/assets/4.png' alt='advanced-chat' />
            )}
            {app.mode === 'agent-chat' && (
              // <CuteRobote className='w-10 h-10 text-indigo-600' />
              // <img className='w-10 h-10' src='assets/agentIcon.png' alt='agent-chat' />
              <img className='w-10 h-10' src='/assets/1.png' alt='agent-chat' />
            )}
            {app.mode === 'chat' && (
              // <ChatBot className='w-10 h-10 text-[#1570EF]' />
              // <img className='w-10 h-10' src='assets/chatguy.png' alt='chat' />
              <img className='w-10 h-10' src='/assets/4.png' alt='chat' />

            )}
            {app.mode === 'completion' && (
              // <AiText className='w-10 h-10 text-[#0E9384]' />
              // <img className='w-10 h-10' src='assets/texteditor.png' alt='chat' />
              <img className='w-10 h-10' src='/assets/2.png' alt='chat' />
            )}
            {app.mode === 'workflow' && (
              // <Route className='w-10 h-10 text-[#f79009]' />
              // <img className='w-10 h-10' src='assets/workload.png' alt='chat' />
              <img className='w-10 h-10' src='/assets/3.png' alt='chat' />
            )}
            {/* </span> */}

          </div>
          {/* Chatbot Name */}
          {/* <div className='text-sm leading-5 font-semibold text-gray-800'> */}
          {/* <div className="text-base	font-medium	text-gray-800 text-center truncate" title={app.name}> */}
          <div className={`text-base	font-medium	text-gray-800 text-center break-words max-w-full ${themeStyles.text}`} title={app.name}>
            {/* <div className='truncate' title={app.name}>{app.name}</div> */}
            <div className='break-words max-w-full' title={app.name}>{app.name}</div>
          </div>
        </div>

        {/* Description Section */}
        {/* <div
          className={cn(
            'flex-grow mb-2 px-6 text-xs leading-normal text-gray-500 pt-1',
            tags.length ? 'line-clamp-2' : 'line-clamp-4',
          )} */}

        <div
          className={cn(
            // 'flex-grow mb-2 px-6 text-xs leading-normal text-gray-500 pt-1',
            // tags.length ? 'line-clamp-2' : 'truncate'
            // className={cn(
            'flex-grow mb-2 px-6 text-xs leading-normal text-gray-500 pt-1 dark:white ',
            tags.length ? 'line-clamp-1' : 'truncate'
          )}
          // <div
          //   className={cn(
          //     'flex-grow mb-2 px-6 text-xs leading-normal text-gray-500 pt-1',
          //     'line-clamp-1', // Always limit to 2 lines
          //     'overflow-hidden', // Ensure that the overflow is hidden
          //     'whitespace-normal' // Ensure text wraps within the container
          //   )}
          title={app.description} // Tooltip for full text
        >
          {app.description}
        </div>

        {/* <Operations /> */}
        <div className="flex px-4 justify-center opacity-0 group-hover:opacity-100 ">
          <TooltipPlus popupContent='Edit'>
            <div
              className='px-2 py-1 text-black opacity-50 hover:opacity-100 '
              onClick={(e) => {
                e.stopPropagation();
                setShowEditModal(true)
              }}
            >
              <Edit02 className='bg-yellow ' />
            </div>
          </TooltipPlus>

          <TooltipPlus popupContent='Duplicate'>
            <div
              className={`px-2 py-1 opacity-50 hover:opacity-100 ${themeStyles.text} dark:white `}
              onClick={(e) => {
                e.stopPropagation();
                setShowDuplicateModal(true)
              }}
            >
              <DuplicateIcon />
            </div>
          </TooltipPlus>

          <TooltipPlus popupContent='Export DSL'>
            <div
              className={`px-2 py-1 opacity-50 hover:opacity-100 ${themeStyles.text} dark:white `}
              onClick={(e) => {
                e.stopPropagation();
                onExport();
              }}
            >
              <ExportIcon />
            </div>
          </TooltipPlus>

          {(app.mode === 'completion' || app.mode === 'chat') && (
            <>
              <TooltipPlus popupContent='Switch to Workflow'>
                <div
                  className={`px-2 py-1 opacity-50 hover:opacity-100 ${themeStyles.text} dark:white `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSwitchModal(true)
                  }}
                >
                  <SwitchIcon />
                </div>
              </TooltipPlus>
            </>
          )}

          <TooltipPlus popupContent='Delete'>
            <div
              className={`text-black px-2 py-1 opacity-50 hover:opacity-100 ${themeStyles.text} `}
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirmDelete(true)
              }}
            >
              <Trash03 />
            </div>
          </TooltipPlus>
        </div>

        {/* Tags Section */}
        <div className={cn(
          'flex items-center px-3 pb-2 pt-1',
          'flex items-center p-3',  // Reduced padding
          tags.length ? 'flex' : '!hidden group-hover:!flex',
        )}>
          <div className='grow flex items-center gap-1'>
            <div className={cn(
              'group-hover:!block',
              tags.length ? '!block' : '!hidden',
            )}>
              <TagSelector
                position='bl'
                type='app'
                targetID={app.id}
                value={tags.map(tag => tag.id)}
                selectedTags={tags}
                onCacheUpdate={setTags}
                onChange={onRefresh}
              />
            </div>
          </div>
          {/* {isCurrentWorkspaceEditor && (
            <div className='ml-2'>
              <CustomPopover
                htmlContent={<Operations />}
                position="br"
                trigger="click"
                btnElement={
                  <div className='flex items-center justify-center w-8 h-8 cursor-pointer rounded-md'>
                    <DotsHorizontal className='w-4 h-4 text-gray-700' />
                  </div>
                }
                btnClassName={open =>
                  cn(
                    open ? '!bg-black/5 !shadow-none' : '!bg-transparent',
                    'h-8 w-8 !p-2 rounded-md border-none hover:!bg-black/5',
                  )
                }
                popupClassName={
                  (app.mode === 'completion' || app.mode === 'chat')
                    ? '!w-[238px] translate-x-[-110px]'
                    : ''
                }
                className={'!w-[128px] h-fit !z-20'}
              />
            </div>
          )} */}

        </div>
      </div>


      {showEditModal && (
        <EditAppModal
          isEditModal
          appIcon={app.icon}
          appIconBackground={app.icon_background}
          appName={app.name}
          appDescription={app.description}
          show={showEditModal}
          onConfirm={onEdit}
          onHide={() => setShowEditModal(false)}
        />
      )}
      {showDuplicateModal && (
        <DuplicateAppModal
          appName={app.name}
          icon={app.icon}
          icon_background={app.icon_background}
          show={showDuplicateModal}
          onConfirm={onCopy}
          onHide={() => setShowDuplicateModal(false)}
        />
      )}
      {showSwitchModal && (
        <SwitchAppModal
          show={showSwitchModal}
          appDetail={app}
          onClose={() => setShowSwitchModal(false)}
          onSuccess={onSwitch}
        />
      )}
      {showConfirmDelete && (
        <Confirm
          title={t('app.deleteAppConfirmTitle')}
          content={t('app.deleteAppConfirmContent')}
          isShow={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={onConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  )
}

export default AppCard




// 'use client'

// import { useContext, useContextSelector } from 'use-context-selector'
// import { useRouter } from 'next/navigation'
// import { useCallback, useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import cn from 'classnames'
// import s from './style.module.css'
// import type { App } from '@/types/app'
// import Confirm from '@/app/components/base/confirm'
// import { ToastContext } from '@/app/components/base/toast'
// import { copyApp, deleteApp, exportAppConfig, updateAppInfo } from '@/service/apps'
// import DuplicateAppModal from '@/app/components/app/duplicate-modal'
// import type { DuplicateAppModalProps } from '@/app/components/app/duplicate-modal'
// import AppIcon from '@/app/components/base/app-icon'
// import AppsContext, { useAppContext } from '@/context/app-context'
// import type { HtmlContentProps } from '@/app/components/base/popover'
// import CustomPopover from '@/app/components/base/popover'
// import Divider from '@/app/components/base/divider'
// import { getRedirection } from '@/utils/app-redirection'
// import { useProviderContext } from '@/context/provider-context'
// import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
// import { AiText, ChatBot, CuteRobote } from '@/app/components/base/icons/src/vender/solid/communication'
// import { Route } from '@/app/components/base/icons/src/vender/solid/mapsAndTravel'
// import { DotsHorizontal } from '@/app/components/base/icons/src/vender/line/general'
// import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal'
// import EditAppModal from '@/app/components/explore/create-app-modal'
// import SwitchAppModal from '@/app/components/app/switch-app-modal'
// import type { Tag } from '@/app/components/base/tag-management/constant'
// import TagSelector from '@/app/components/base/tag-management/selector'

// export type AppCardProps = {
//   app: App
//   onRefresh?: () => void
// }

// const AppCard = ({ app, onRefresh }: AppCardProps) => {
//   const { t } = useTranslation()
//   const { notify } = useContext(ToastContext)
//   const { isCurrentWorkspaceEditor } = useAppContext()
//   const { onPlanInfoChanged } = useProviderContext()
//   const { push } = useRouter()

//   const mutateApps = useContextSelector(
//     AppsContext,
//     state => state.mutateApps,
//   )

//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDuplicateModal, setShowDuplicateModal] = useState(false)
//   const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false)
//   const [showConfirmDelete, setShowConfirmDelete] = useState(false)

//   const onConfirmDelete = useCallback(async () => {
//     try {
//       await deleteApp(app.id)
//       notify({ type: 'success', message: t('app.appDeleted') })
//       if (onRefresh)
//         onRefresh()
//       mutateApps()
//       onPlanInfoChanged()
//     }
//     catch (e: any) {
//       notify({
//         type: 'error',
//         message: `${t('app.appDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}`,
//       })
//     }
//     setShowConfirmDelete(false)
//   }, [app.id])

//   const onEdit: CreateAppModalProps['onConfirm'] = useCallback(async ({
//     name,
//     icon,
//     icon_background,
//     description,
//   }) => {
//     try {
//       await updateAppInfo({
//         appID: app.id,
//         name,
//         icon,
//         icon_background,
//         description,
//       })
//       setShowEditModal(false)
//       notify({
//         type: 'success',
//         message: t('app.editDone'),
//       })
//       if (onRefresh)
//         onRefresh()
//       mutateApps()
//     }
//     catch (e) {
//       notify({ type: 'error', message: t('app.editFailed') })
//     }
//   }, [app.id, mutateApps, notify, onRefresh, t])

//   const onCopy: DuplicateAppModalProps['onConfirm'] = async ({ name, icon, icon_background }) => {
//     try {
//       const newApp = await copyApp({
//         appID: app.id,
//         name,
//         icon,
//         icon_background,
//         mode: app.mode,
//       })
//       setShowDuplicateModal(false)
//       notify({
//         type: 'success',
//         message: t('app.newApp.appCreated'),
//       })
//       localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
//       if (onRefresh)
//         onRefresh()
//       mutateApps()
//       onPlanInfoChanged()
//       getRedirection(isCurrentWorkspaceEditor, newApp, push)
//     }
//     catch (e) {
//       notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
//     }
//   }

//   const onExport = async () => {
//     try {
//       const { data } = await exportAppConfig(app.id)
//       const a = document.createElement('a')
//       const file = new Blob([data], { type: 'application/yaml' })
//       a.href = URL.createObjectURL(file)
//       a.download = `${app.name}.yml`
//       a.click()
//     }
//     catch (e) {
//       notify({ type: 'error', message: t('app.exportFailed') })
//     }
//   }

//   const onSwitch = () => {
//     if (onRefresh)
//       onRefresh()
//     mutateApps()
//     setShowSwitchModal(false)
//   }

//   const Operations = (props: HtmlContentProps) => {
//     const onMouseLeave = async () => {
//       props.onClose?.()
//     }
//     const onClickSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.stopPropagation()
//       props.onClick?.()
//       e.preventDefault()
//       setShowEditModal(true)
//     }
//     const onClickDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.stopPropagation()
//       props.onClick?.()
//       e.preventDefault()
//       setShowDuplicateModal(true)
//     }
//     const onClickExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
//       e.stopPropagation()
//       props.onClick?.()
//       e.preventDefault()
//       onExport()
//     }
//     const onClickSwitch = async (e: React.MouseEvent<HTMLDivElement>) => {
//       e.stopPropagation()
//       props.onClick?.()
//       e.preventDefault()
//       setShowSwitchModal(true)
//     }
//     const onClickDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
//       e.stopPropagation()
//       props.onClick?.()
//       e.preventDefault()
//       setShowConfirmDelete(true)
//     }
//     return (
//       <div className="relative w-full py-1" onMouseLeave={onMouseLeave}>
//         <button className={s.actionItem} onClick={onClickSettings}>
//           <span className={s.actionName}>{t('app.editApp')}</span>
//         </button>
//         <Divider className="!my-1" />
//         <button className={s.actionItem} onClick={onClickDuplicate}>
//           <span className={s.actionName}>{t('app.duplicate')}</span>
//         </button>
//         <button className={s.actionItem} onClick={onClickExport}>
//           <span className={s.actionName}>{t('app.export')}</span>
//         </button>
//         {(app.mode === 'completion' || app.mode === 'chat') && (
//           <>
//             <Divider className="!my-1" />
//             <div
//               className='h-9 py-2 px-3 mx-1 flex items-center hover:bg-gray-50 rounded-lg cursor-pointer'
//               onClick={onClickSwitch}
//             >
//               <span className='text-gray-700 text-sm leading-5'>{t('app.switch')}</span>
//             </div>
//           </>
//         )}
//         <Divider className="!my-1" />
//         <div
//           className={cn(s.actionItem, s.deleteActionItem, 'group')}
//           onClick={onClickDelete}
//         >
//           <span className={cn(s.actionName, 'group-hover:text-red-500')}>
//             {t('common.operation.delete')}
//           </span>
//         </div>
//       </div>
//     )
//   }

//   const [tags, setTags] = useState<Tag[]>(app.tags)
//   useEffect(() => {
//     setTags(app.tags)
//   }, [app.tags])

//   return (
//     <>
//       {/* <div
//         onClick={(e) => {
//           e.preventDefault()
//           getRedirection(isCurrentWorkspaceEditor, app, push)
//         }}
//         className='group flex col-span-1 bg-white border-2 border-solid border-transparent rounded-xl shadow-sm min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-lg'
//       > */}
//       <div
//             onClick={(e) => {
//               e.preventDefault()
//               getRedirection(isCurrentWorkspaceEditor, app, push)
//             }}
//             // className='group flex flex-col bg-white border border-transparent rounded-3xl shadow-md min-h-[160px] transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-lg hover:scale-105'>

//                 className='group flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm min-h-[160px] transition-transform duration-300 ease-in-out cursor-pointer hover:shadow-md hover:scale-105 hover:bg-gray-50'>
//         {/* <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0 '> */}
//         <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] items-center gap-3 grow-0 shrink-0 border border-gray-300 rounded-lg shadow-md bg-gray-100 hover:bg-gray-200 transition-all '>
//           {/* <div className='relative shrink-0'> */}
//           <div className="flex flex-col items-center p-4">


//             <AppIcon
//               size="medium"
//               icon={app.icon}
//               background={app.icon_background}
//             />
//             {/* <span className='absolute bottom-[-3px] right-[-3px] w-4 h-4 p-0.5 bg-white rounded border-[0.5px] border-[rgba(0,0,0,0.02)] shadow-sm'>
//               {app.mode === 'advanced-chat' && (
//                 <ChatBot className='w-3 h-3 text-[#1570EF]' />
//               )}
//               {app.mode === 'agent-chat' && (
//                 <CuteRobote className='w-3 h-3 text-indigo-600' />
//               )}
//               {app.mode === 'chat' && (
//                 <ChatBot className='w-3 h-3 text-[#1570EF]' />
//               )}
//               {app.mode === 'completion' && (
//                 <AiText className='w-3 h-3 text-[#0E9384]' />
//               )}
//               {app.mode === 'workflow' && (
//                 <Route className='w-3 h-3 text-[#f79009]' />
//               )}
//             </span> */}
//           </div>
//           <div className='grow w-0 py-[1px]'>
//             <div className='flex items-center text-sm leading-5 font-semibold text-gray-800'>
//               <div className='truncate' title={app.name}>{app.name}</div>
//             </div>
//             <div className='flex items-center text-[10px] leading-[18px] text-gray-500 font-medium'>
//               {app.mode === 'advanced-chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
//               {app.mode === 'chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
//               {app.mode === 'agent-chat' && <div className='truncate'>{t('app.types.agent').toUpperCase()}</div>}
//               {app.mode === 'workflow' && <div className='truncate'>{t('app.types.workflow').toUpperCase()}</div>}
//               {app.mode === 'completion' && <div className='truncate'>{t('app.types.completion').toUpperCase()}</div>}
//             </div>
//           </div>
//         </div>
//         <div
//           className={cn(
//             'grow mb-2 px-[14px] max-h-[72px] text-xs leading-normal text-gray-500 group-hover:line-clamp-2 group-hover:max-h-[36px]',
//             tags.length ? 'line-clamp-2' : 'line-clamp-4',
//           )}
//           title={app.description}
//         >
//           {app.description}
//         </div>
//         <div className={cn(
//           'items-center shrink-0 mt-1 pt-1 pl-[14px] pr-[6px] pb-[6px] h-[42px]',
//           tags.length ? 'flex' : '!hidden group-hover:!flex',
//         )}>
//           <div className={cn('grow flex items-center gap-1 w-0')} onClick={(e) => {
//             e.stopPropagation()
//             e.preventDefault()
//           }}>
//             <div className={cn(
//               'group-hover:!block group-hover:!mr-0 mr-[41px] grow w-full',
//               tags.length ? '!block' : '!hidden',
//             )}>
//               <TagSelector
//                 position='bl'
//                 type='app'
//                 targetID={app.id}
//                 value={tags.map(tag => tag.id)}
//                 selectedTags={tags}
//                 onCacheUpdate={setTags}
//                 onChange={onRefresh}
//               />
//             </div>
//           </div>
//           {isCurrentWorkspaceEditor && (
//             <>
//               <div className='!hidden group-hover:!flex shrink-0 mx-1 w-[1px] h-[14px] bg-gray-200'/>
//               <div className='!hidden group-hover:!flex shrink-0'>
//                 <CustomPopover
//                   htmlContent={<Operations />}
//                   position="br"
//                   trigger="click"
//                   btnElement={
//                     <div
//                       className='flex items-center justify-center w-8 h-8 cursor-pointer rounded-md'
//                     >
//                       <DotsHorizontal className='w-4 h-4 text-gray-700' />
//                     </div>
//                   }
//                   btnClassName={open =>
//                     cn(
//                       open ? '!bg-black/5 !shadow-none' : '!bg-transparent',
//                       'h-8 w-8 !p-2 rounded-md border-none hover:!bg-black/5',
//                     )
//                   }
//                   popupClassName={
//                     (app.mode === 'completion' || app.mode === 'chat')
//                       ? '!w-[238px] translate-x-[-110px]'
//                       : ''
//                   }
//                   className={'!w-[128px] h-fit !z-20'}
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {showEditModal && (
//         <EditAppModal
//           isEditModal
//           appIcon={app.icon}
//           appIconBackground={app.icon_background}
//           appName={app.name}
//           appDescription={app.description}
//           show={showEditModal}
//           onConfirm={onEdit}
//           onHide={() => setShowEditModal(false)}
//         />
//       )}
//       {showDuplicateModal && (
//         <DuplicateAppModal
//           appName={app.name}
//           icon={app.icon}
//           icon_background={app.icon_background}
//           show={showDuplicateModal}
//           onConfirm={onCopy}
//           onHide={() => setShowDuplicateModal(false)}
//         />
//       )}
//       {showSwitchModal && (
//         <SwitchAppModal
//           show={showSwitchModal}
//           appDetail={app}
//           onClose={() => setShowSwitchModal(false)}
//           onSuccess={onSwitch}
//         />
//       )}
//       {showConfirmDelete && (
//         <Confirm
//           title={t('app.deleteAppConfirmTitle')}
//           content={t('app.deleteAppConfirmContent')}
//           isShow={showConfirmDelete}
//           onClose={() => setShowConfirmDelete(false)}
//           onConfirm={onConfirmDelete}
//           onCancel={() => setShowConfirmDelete(false)}
//         />
//       )}
//     </>
//   )
// }

// export default AppCard

