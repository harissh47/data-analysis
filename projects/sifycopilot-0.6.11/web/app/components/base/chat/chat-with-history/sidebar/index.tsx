
import React, {
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useChatWithHistoryContext } from '../context'
import List from './list'
// import AppIcon from '@/app/components/base/app-icon'
import Button from '@/app/components/base/button'
import { Edit05 } from '@/app/components/base/icons/src/vender/line/general'
import type { ConversationItem } from '@/models/share'
import Confirm from '@/app/components/base/confirm'
import RenameModal from '@/app/components/share/chat/sidebar/rename-modal'

const ChevronLeftSVG = () => (
  <svg width="23" height="23" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 19l-1.42 1.42L6.58 13.92 14.08 6.5 15.5 7.92 9.34 14l6.16 5z"></path>
  </svg>
)

const ChevronRightSVG = () => (
  <svg width="23" height="23" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.5 5L7.08 6.42l6.16 5.5-6.16 5.5L8.5 19l7.92-7.92L8.5 5z"></path>
  </svg>
)

export type SidebarProps = {
  toggleCollapse: () => void
}

// const Sidebar = () => {
const Sidebar: React.FC<SidebarProps> = ({ toggleCollapse }) => {
  const { t } = useTranslation()
  const {
    appData,
    pinnedConversationList,
    conversationList,
    handleNewConversation,
    currentConversationId,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    conversationRenaming,
    handleRenameConversation,
    handleDeleteConversation,
    isMobile,
  } = useChatWithHistoryContext()
  const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null)
  const [showRename, setShowRename] = useState<ConversationItem | null>(null)
  // const [isCollapsed, setIsCollapsed] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)


  const handleOperate = useCallback((type: string, item: ConversationItem) => {
    if (type === 'pin')
      handlePinConversation(item.id)

    if (type === 'unpin')
      handleUnpinConversation(item.id)

    if (type === 'delete')
      setShowConfirm(item)

    if (type === 'rename')
      setShowRename(item)
  }, [handlePinConversation, handleUnpinConversation])
  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(null)
  }, [])
  const handleDelete = useCallback(() => {
    if (showConfirm)
      handleDeleteConversation(showConfirm.id, { onSuccess: handleCancelConfirm })
  }, [showConfirm, handleDeleteConversation, handleCancelConfirm])
  const handleCancelRename = useCallback(() => {
    setShowRename(null)
  }, [])
  const handleRename = useCallback((newName: string) => {
    if (showRename)
      handleRenameConversation(showRename.id, newName, { onSuccess: handleCancelRename })
  }, [showRename, handleRenameConversation, handleCancelRename])

  const handleToggleCollapse = () => {
    if (!isMobile)
      setIsCollapsed(!isCollapsed)
    else
      toggleCollapse()
  }

  return (
    // <div className='shrink-0 h-full flex flex-col w-[240px] border-r border-r-gray-100'>
    // <div className='shrink-0 h-full flex flex-col w-[240px]'>
    // <div className={`shrink-0 bg-[#F8FBEA] h-full flex flex-col ${isCollapsed ? 'w-[60px]' : 'w-[240px]'} border-r border-r-gray-100 transition-width duration-300`}>
    <div className={`shrink-0 h-full flex flex-col ${isCollapsed ? 'w-[60px]' : 'w-[240px]'} border-r border-r-gray-100 transition-width duration-300`}>
      <div className='shrink-0 flex items-center p-4'>
        {!isCollapsed && !isMobile && (
          <div className='py-1 text-base font-semibold text-gray-800'>
            {appData?.site.title}
          </div>
        )
        }
        <button onClick={handleToggleCollapse} className='ml-auto text-gray-800 hover:text-gray-600 focus:outline-none'>
          {isCollapsed ? <ChevronRightSVG /> : <ChevronLeftSVG />}
        </button>
      </div>
      {isCollapsed ? (
        <div className='flex flex-col items-center'>
          <Button
            // className='justify-center px-3 py-0 w-full h-9 text-sm font-bold text-[#bed730]'
            className='justify-center px-3 py-0 w-full h-9 text-sm font-bold text-[#bed730] bg-white'
            onClick={handleNewConversation}
          >
            <Edit05 className='w-4 h-4' />
          </Button>
        </div>
      )
        :
        (
          <>
            <div className='shrink-0 p-4'>
              <Button
                // className='justify-start px-3 py-0 w-full h-9 text-sm font-medium text-primary-600'
                // className='justify-start px-3 py-0 w-full h-9 text-sm font-medium text-white hover:text-black'
                // className='justify-start px-3 py-0 w-full h-9 text-sm font-bold text-[#bed730]'
                className='justify-start px-3 py-0 w-full h-9 text-sm font-bold text-[#bed730] bg-white'
                onClick={handleNewConversation}
              >
                <Edit05 className='mr-2 w-4 h-4' />
                {t('share.chat.newChat')}
              </Button>
            </div>
            <div className='grow px-4 py-2 overflow-y-auto'>
              {
                !!pinnedConversationList.length && (
                  <div className='mb-4'>
                    <List
                      isPin
                      title={t('share.chat.pinnedTitle') || ''}
                      list={pinnedConversationList}
                      onChangeConversation={handleChangeConversation}
                      onOperate={handleOperate}
                      currentConversationId={currentConversationId}
                    />
                  </div>
                )
              }
              {
                !!conversationList.length && (
                  <List
                    title={(pinnedConversationList.length && t('share.chat.unpinnedTitle')) || ''}
                    list={conversationList}
                    onChangeConversation={handleChangeConversation}
                    onOperate={handleOperate}
                    currentConversationId={currentConversationId}
                  />
                )
              }
            </div>
            {/* <div className='px-4 pb-4 text-xs text-gray-400'>
              © {appData?.site.copyright || appData?.site.title} {(new Date()).getFullYear()}
            </div> */}

          </>
        )}
      {!!showConfirm && (
        <Confirm
          title={t('share.chat.deleteConversation.title')}
          content={t('share.chat.deleteConversation.content') || ''}
          isShow
          onClose={handleCancelConfirm}
          onCancel={handleCancelConfirm}
          onConfirm={handleDelete}
        />
      )}
      {showRename && (
        <RenameModal
          isShow
          onClose={handleCancelRename}
          saveLoading={conversationRenaming}
          name={showRename?.name || ''}
          onSave={handleRename}
        />
      )}
    </div>
  )
}

export default Sidebar


// import {
//   useCallback,
//   useState,
// } from 'react'
// import { useTranslation } from 'react-i18next'
// import { useChatWithHistoryContext } from '../context'
// import List from './list'
// // import AppIcon from '@/app/components/base/app-icon'
// import Button from '@/app/components/base/button'
// import { Edit05 } from '@/app/components/base/icons/src/vender/line/general'
// import type { ConversationItem } from '@/models/share'
// import Confirm from '@/app/components/base/confirm'
// import RenameModal from '@/app/components/share/chat/sidebar/rename-modal'

// const Sidebar = () => {
//   const { t } = useTranslation()
//   const {
//     appData,
//     pinnedConversationList,
//     conversationList,
//     handleNewConversation,
//     currentConversationId,
//     handleChangeConversation,
//     handlePinConversation,
//     handleUnpinConversation,
//     conversationRenaming,
//     handleRenameConversation,
//     handleDeleteConversation,
//     isMobile,
//   } = useChatWithHistoryContext()
//   const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null)
//   const [showRename, setShowRename] = useState<ConversationItem | null>(null)

//   const handleOperate = useCallback((type: string, item: ConversationItem) => {
//     if (type === 'pin')
//       handlePinConversation(item.id)

//     if (type === 'unpin')
//       handleUnpinConversation(item.id)

//     if (type === 'delete')
//       setShowConfirm(item)

//     if (type === 'rename')
//       setShowRename(item)
//   }, [handlePinConversation, handleUnpinConversation])
//   const handleCancelConfirm = useCallback(() => {
//     setShowConfirm(null)
//   }, [])
//   const handleDelete = useCallback(() => {
//     if (showConfirm)
//       handleDeleteConversation(showConfirm.id, { onSuccess: handleCancelConfirm })
//   }, [showConfirm, handleDeleteConversation, handleCancelConfirm])
//   const handleCancelRename = useCallback(() => {
//     setShowRename(null)
//   }, [])
//   const handleRename = useCallback((newName: string) => {
//     if (showRename)
//       handleRenameConversation(showRename.id, newName, { onSuccess: handleCancelRename })
//   }, [showRename, handleRenameConversation, handleCancelRename])

//   return (
//     // <div className='shrink-0 h-full flex flex-col w-[240px] border-r border-r-gray-100'>
//     // <div className='shrink-0 h-full flex flex-col w-[240px]'>
//     <div className='shrink-0 h-full flex flex-col w-[240px] border-r border-r-gray-100'>
//       {
//         !isMobile && (
//           <div className='shrink-0 flex p-4'>
//             {/* <AppIcon
//               className='mr-3'
//               size='small'
//               icon={appData?.site.icon}
//               background={appData?.site.icon_background}
//             /> */}
//             {/* <div className='py-1 text-base font-semibold text-gray-800'> */}
//             {/* <div className='py-1 text-base font-semibold text-white'> */}
//             <div className='py-1 text-base font-semibold text-gray-800'>
//               {appData?.site.title}
//             </div>
//           </div>
//         )
//       }
//       <div className='shrink-0 p-4'>
//         <Button
//           // className='justify-start px-3 py-0 w-full h-9 text-sm font-medium text-primary-600'
//           // className='justify-start px-3 py-0 w-full h-9 text-sm font-medium text-white hover:text-black'
//           className='justify-start px-3 py-0 w-full h-9 text-sm font-bold text-[#bed730]'
//           onClick={handleNewConversation}
//         >
//           <Edit05 className='mr-2 w-4 h-4' />
//           {t('share.chat.newChat')}
//         </Button>
//       </div>
//       <div className='grow px-4 py-2 overflow-y-auto'>
//         {
//           !!pinnedConversationList.length && (
//             <div className='mb-4'>
//               <List
//                 isPin
//                 title={t('share.chat.pinnedTitle') || ''}
//                 list={pinnedConversationList}
//                 onChangeConversation={handleChangeConversation}
//                 onOperate={handleOperate}
//                 currentConversationId={currentConversationId}
//               />
//             </div>
//           )
//         }
//         {
//           !!conversationList.length && (
//             <List
//               title={(pinnedConversationList.length && t('share.chat.unpinnedTitle')) || ''}
//               list={conversationList}
//               onChangeConversation={handleChangeConversation}
//               onOperate={handleOperate}
//               currentConversationId={currentConversationId}
//             />
//           )
//         }
//       </div>
//       <div className='px-4 pb-4 text-xs text-gray-400'>
//         © {appData?.site.copyright || appData?.site.title} {(new Date()).getFullYear()}
//       </div>
//       {!!showConfirm && (
//         <Confirm
//           title={t('share.chat.deleteConversation.title')}
//           content={t('share.chat.deleteConversation.content') || ''}
//           isShow
//           onClose={handleCancelConfirm}
//           onCancel={handleCancelConfirm}
//           onConfirm={handleDelete}
//         />
//       )}
//       {showRename && (
//         <RenameModal
//           isShow
//           onClose={handleCancelRename}
//           saveLoading={conversationRenaming}
//           name={showRename?.name || ''}
//           onSave={handleRename}
//         />
//       )}
//     </div>
//   )
// }

// export default Sidebar
