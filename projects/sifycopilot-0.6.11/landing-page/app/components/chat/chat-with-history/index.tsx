import type { FC } from 'react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useAsyncEffect } from 'ahooks'
import {
  ChatWithHistoryContext,
  useChatWithHistoryContext,
} from './context'
import { useChatWithHistory } from './hooks'
import Sidebar from './sidebar'
import HeaderInMobile from './header-in-mobile'
import ConfigPanel from './config-panel'
import ChatWrapper from './chat-wrapper'
import type { InstalledApp } from '@/models/explore'
import Loading from '@/app/components/base/loading'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { checkOrSetAccessToken } from '@/app/components/share/utils'
import AppUnavailable from '@/app/components/base/app-unavailable'
import { Settings01 } from '../../base/icons/src/vender/line/general'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'

type ChatWithHistoryProps = {
  className?: string
}
const ChatWithHistory: FC<ChatWithHistoryProps> = ({
  className,
}) => {
  const {
    appInfoError,
    appData,
    appInfoLoading,
    appPrevChatList,
    showConfigPanelBeforeChat,
    appChatListDataLoading,
    chatShouldReloadKey,
    isMobile,
    currentConversationId,
  } = useChatWithHistoryContext()

  console.log("ule varudhaa")


  const chatReady = (!showConfigPanelBeforeChat || !!appPrevChatList.length)
  const customConfig = appData?.custom_config
  const site = appData?.site

  useEffect(() => {
    if (site) {
      if (customConfig)
        document.title = `${site.title}`
      else
        // document.title = `${site.title} - Powered by Dify`
        document.title = `${site.title}`
    }
  }, [site, customConfig])

  console.log("title varudhaa")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const handleToggleModal = () => {
    console.log("Settings button is clicked")
    setIsModalOpen(!isModalOpen)
  }

  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    const html = document.documentElement
    if (isDarkMode) {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    else {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
    }
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  console.log("ule varudhaa over")

  if (appInfoLoading) {
    return (
      <Loading type='app' />
    )
  }

  console.log("ule varudhaa over over")

  if (appInfoError) {
    return (
      <AppUnavailable />
    )
  }

  console.log("ule varudhaa over over over")
  
  // if(isDarkMode === true){
  //   const dark ='bg-[#202020]'


  // }


  return (
    // <div className={`h-full flex bg-white ${className} ${isMobile && 'flex-col'}`}>
    // <div className={`h-full flex ${className} ${isMobile && 'flex-col'}`} style={{ backgroundColor: '#2c2c2c' }}>
    <div className={`relative h-full flex bg-white ${className} ${isMobile && 'flex-col'}`}>
      {
        !isMobile && (
          <>
            <Sidebar />
            <div className="absolute top-4 right-4">
              <button
                className="p-2 text-gray-700"
                // onClick={handleToggleModal}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleModal();
                }}
              >
                <Settings01 />
              </button>
              {isModalOpen && (
                <div ref={modalRef} className='absolute top-full mt-2 right-0 z-50 bg-white border-[0.5px] border-gray-100 shadow-lg rounded-lg px-2 w-36'>
                  <div className='flex justify-between items-center'>
                    <div className='text-gray-900 text-base'>Theme</div>
                    <button onClick={toggleTheme} className='p-2 rounded-full' aria-label='Toggle Theme'>
                      {isDarkMode ? (
                        <SunIcon className='h-6 w-6 text-yellow-500' />
                      ) : (
                        <MoonIcon className='h-6 w-6 text-gray-500' />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      }
      {
        isMobile && (
          <HeaderInMobile />
        )
      }
      <div className={`grow overflow-hidden ${showConfigPanelBeforeChat && !appPrevChatList.length && 'flex items-center justify-center'}`}>
        {
          showConfigPanelBeforeChat && !appChatListDataLoading && !appPrevChatList.length && (
            <div className={`flex w-full items-center justify-center h-full ${isMobile && 'px-4'}`}>
              <ConfigPanel />
            </div>
          )
        }
        {
          appChatListDataLoading && chatReady && (
            <Loading type='app' />
          )
        }
        {
          chatReady && !appChatListDataLoading && (
            <ChatWrapper key={chatShouldReloadKey} />
          )
        }
      </div>
    </div>
  )
}

export type ChatWithHistoryWrapProps = {
  installedAppInfo?: InstalledApp
  className?: string
}
const ChatWithHistoryWrap: FC<ChatWithHistoryWrapProps> = ({
  installedAppInfo,
  className,
}) => {
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  const {
    appInfoError,
    appInfoLoading,
    appData,
    appParams,
    appMeta,
    appChatListDataLoading,
    currentConversationId,
    currentConversationItem,
    appPrevChatList,
    pinnedConversationList,
    conversationList,
    showConfigPanelBeforeChat,
    newConversationInputs,
    handleNewConversationInputsChange,
    inputsForms,
    handleNewConversation,
    handleStartChat,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    handleDeleteConversation,
    conversationRenaming,
    handleRenameConversation,
    handleNewConversationCompleted,
    chatShouldReloadKey,
    isInstalledApp,
    appId,
    handleFeedback,
    currentChatInstanceRef,
  } = useChatWithHistory(installedAppInfo)

  return (
    <ChatWithHistoryContext.Provider value={{
      appInfoError,
      appInfoLoading,
      appData,
      appParams,
      appMeta,
      appChatListDataLoading,
      currentConversationId,
      currentConversationItem,
      appPrevChatList,
      pinnedConversationList,
      conversationList,
      showConfigPanelBeforeChat,
      newConversationInputs,
      handleNewConversationInputsChange,
      inputsForms,
      handleNewConversation,
      handleStartChat,
      handleChangeConversation,
      handlePinConversation,
      handleUnpinConversation,
      handleDeleteConversation,
      conversationRenaming,
      handleRenameConversation,
      handleNewConversationCompleted,
      chatShouldReloadKey,
      isMobile,
      isInstalledApp,
      appId,
      handleFeedback,
      currentChatInstanceRef,
    }}>
      <ChatWithHistory className={className} />
    </ChatWithHistoryContext.Provider>
  )
}

const ChatWithHistoryWrapWithCheckToken: FC<ChatWithHistoryWrapProps> = ({
  installedAppInfo,
  className,
}) => {
  const [initialized, setInitialized] = useState(false)
  console.log(installedAppInfo)
  const [appUnavailable, setAppUnavailable] = useState<boolean>(false)
  const [isUnknownReason, setIsUnknownReason] = useState<boolean>(false)

  useAsyncEffect(async () => {
    if (!initialized) {
      if (!installedAppInfo) {
        try {
          await checkOrSetAccessToken()
        }
        catch (e: any) {
          if (e.status === 404) {
            setAppUnavailable(true)
          }
          else {
            setIsUnknownReason(true)
            setAppUnavailable(true)
          }
        }
      }
      setInitialized(true)
    }
  }, [])

  if (!initialized)
    return null

  if (appUnavailable)
    return <AppUnavailable isUnknownReason={isUnknownReason} />

  return (
    <ChatWithHistoryWrap
      installedAppInfo={installedAppInfo}
      className={className}
    />
  )
}

export default ChatWithHistoryWrapWithCheckToken
