import type { FC } from 'react'
import {
  memo,
  useCallback,
  useMemo,
} from 'react'
import { useNodes } from 'reactflow'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import {
  useStore,
  useWorkflowStore,
} from '../store'
import {
  BlockEnum,
  InputVarType,
} from '../types'
import type { StartNodeType } from '../nodes/start/types'
import {
  useChecklistBeforePublish,
  useNodesReadOnly,
  useNodesSyncDraft,
  useWorkflowMode,
  useWorkflowRun,
} from '../hooks'
import AppPublisher from '../../app/app-publisher'
import { ToastContext } from '../../base/toast'
import RunAndHistory from './run-and-history'
import EditingTitle from './editing-title'
import RunningTitle from './running-title'
import RestoringTitle from './restoring-title'
import ViewHistory from './view-history'
import Checklist from './checklist'
import { Grid01 } from '@/app/components/base/icons/src/vender/line/layout'
import Button from '@/app/components/base/button'
import { useStore as useAppStore } from '@/app/components/app/store'
import { publishWorkflow } from '@/service/workflow'
import { ArrowNarrowLeft } from '@/app/components/base/icons/src/vender/line/arrows'
import { useFeatures } from '@/app/components/base/features/hooks'
import AppIcon from '../../base/app-icon'
import s from './style.module.css'
import cn from 'classnames'
import router, { useRouter } from 'next/navigation'

const Header: FC = () => {
  const { t } = useTranslation()
  const workflowStore = useWorkflowStore()
  const appDetail = useAppStore(s => s.appDetail)
  const appSidebarExpand = useAppStore(s => s.appSidebarExpand)
  const appID = appDetail?.id
  const {
    nodesReadOnly,
    getNodesReadOnly,
  } = useNodesReadOnly()
  const publishedAt = useStore(s => s.publishedAt)
  const draftUpdatedAt = useStore(s => s.draftUpdatedAt)
  const toolPublished = useStore(s => s.toolPublished)
  const nodes = useNodes<StartNodeType>()
  const startNode = nodes.find(node => node.data.type === BlockEnum.Start)
  const startVariables = startNode?.data.variables
  const fileSettings = useFeatures(s => s.features.file)
  const variables = useMemo(() => {
    const data = startVariables || []
    if (fileSettings?.image?.enabled) {
      return [
        ...data,
        {
          type: InputVarType.files,
          variable: '__image',
          required: false,
          label: 'files',
        },
      ]
    }

    return data
  }, [fileSettings?.image?.enabled, startVariables])

  const {
    handleLoadBackupDraft,
    handleBackupDraft,
    handleRestoreFromPublishedWorkflow,
  } = useWorkflowRun()
  const { handleCheckBeforePublish } = useChecklistBeforePublish()
  const { handleSyncWorkflowDraft } = useNodesSyncDraft()
  const { notify } = useContext(ToastContext)
  const router = useRouter()
  const {
    normal,
    restoring,
    viewHistory,
  } = useWorkflowMode()

  const handleShowFeatures = useCallback(() => {
    const {
      showFeaturesPanel,
      isRestoring,
      setShowFeaturesPanel,
    } = workflowStore.getState()
    if (getNodesReadOnly() && !isRestoring)
      return
    setShowFeaturesPanel(!showFeaturesPanel)
  }, [workflowStore, getNodesReadOnly])

  const handleCancelRestore = useCallback(() => {
    handleLoadBackupDraft()
    workflowStore.setState({ isRestoring: false })
  }, [workflowStore, handleLoadBackupDraft])

  const handleRestore = useCallback(() => {
    workflowStore.setState({ isRestoring: false })
    workflowStore.setState({ backupDraft: undefined })
    handleSyncWorkflowDraft(true)
  }, [handleSyncWorkflowDraft, workflowStore])

  const onPublish = useCallback(async () => {
    if (handleCheckBeforePublish()) {
      const res = await publishWorkflow(`/apps/${appID}/workflows/publish`)

      if (res) {
        notify({ type: 'success', message: t('common.api.actionSuccess') })
        workflowStore.getState().setPublishedAt(res.created_at)
      }
    }
    else {
      throw new Error('Checklist failed')
    }
  }, [appID, handleCheckBeforePublish, notify, t, workflowStore])

  const onStartRestoring = useCallback(() => {
    workflowStore.setState({ isRestoring: true })
    handleBackupDraft()
    handleRestoreFromPublishedWorkflow()
  }, [handleBackupDraft, handleRestoreFromPublishedWorkflow, workflowStore])

  const onPublisherToggle = useCallback((state: boolean) => {
    if (state)
      handleSyncWorkflowDraft(true)
  }, [handleSyncWorkflowDraft])

  const handleGoBackToEdit = useCallback(() => {
    handleLoadBackupDraft()
    workflowStore.setState({ historyWorkflowData: undefined })
  }, [workflowStore, handleLoadBackupDraft])

  const handleToolConfigureUpdate = useCallback(() => {
    workflowStore.setState({ toolPublished: true })
  }, [workflowStore])
  // const appDetail = useAppStore(state => state.appDetail)
  const navBackHandle = () => {
    // router.back()
    router.push('/apps')
  }


  return (
    <div
      // className='absolute top-2 left-1 z-10 flex items-center justify-between w-full px-3 h-14'
      // className=' flex top-2 left-1 z-10 flex items-center justify-between w-full px-3 h-14'
      className=' flex top-2 left-1 z-10 flex items-center justify-between w-full px-3 h-14 dark:bg-[#202020]'

      style={{
        background: 'linear-gradient(180deg, #F9FAFB 0% dark:#202020 0%, rgba(249, 250, 251, 0.00) 100%)',
      }}
    >
      <div className='flex items-center justify-center mt-3'>
        {/* {
          appSidebarExpand === 'collapse' && (
          
            <div className='text-xs font-medium text-gray-700'>{appDetail?.name}</div>
          )
        } */}
        {/* <div onClick={navBackHandle} className={cn(s.navBack)} /> */}
        <div onClick={navBackHandle} className={cn(s.navBack, 'dark:bg-[#383838]')} />
        {
          <div className='mr-2'>
            {appDetail?.mode === 'advanced-chat' && (
              // <ChatBot className={cn('w-10 h-10 text-[#1570EF]', !expand && '!w-2.5 !h-2.5')} />
              // <img className='w-10 h-10' src='/assets/agentIcon.png' alt='advanced-chat' />
              <img className='w-10 h-10' src='/assets/4.png' alt='advanced-chat' />
            )}
            {appDetail?.mode === 'agent-chat' && (
              // <CuteRobote className={cn('w-10 h-10 text-indigo-600', !expand && '!w-2.5 !h-2.5')} />
              <img className='w-10 h-10' src='assets/agentIcon.png' alt='agent-chat' />
            )}
            {appDetail?.mode === 'chat' && (
              // <ChatBot className={cn('w-3 h-3 text-[#1570EF]', !expand && '!w-2.5 !h-2.5')} />
              <img className='w-10 h-10' src='/assets/chatguy.png' alt='chat' />
            )}
            {appDetail?.mode === 'completion' && (
              // <AiText className={cn('w-3 h-3 text-[#0E9384]', !expand && '!w-2.5 !h-2.5')} />
              <img className='w-10 h-10' src='/assets/texteditor.png' alt='chat' />
            )}
            {appDetail?.mode === 'workflow' && (
              // <Route className={cn('w-3 h-3 text-[#f79009]', !expand && '!w-2.5 !h-2.5')} />
              <img className='w-10 h-10' src='/assets/3.png' alt='chat' />
            )}
            {/* </span> */}
          </div>
        }
        <div className='flex flex-col'>
          <div className='text-xs font-medium text-gray-700 dark:text-white'>{appDetail?.name}</div>
          <div className='flex items-center w-max'>
            {
              normal && <EditingTitle />
            }
            {
              viewHistory && <RunningTitle />
            }
            {
              restoring && <RestoringTitle />
            }
          </div>
        </div>
      </div>
      {
        normal && (
          // <div className='flex items-center'>
          <div className='flex items-center '>

            <RunAndHistory />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200 '></div>
            <Button
              // className={`
              //   mr-2 px-3 py-0 h-8 bg-white text-[13px] font-medium text-gray-700
              //   border-[0.5px] border-gray-200 shadow-xs
              //   ${nodesReadOnly && 'opacity-50 !cursor-not-allowed'}
              // `}
              className={`
                mr-2 px-3 py-0 h-8 bg-white dark:bg-[#333333] text-[13px] font-medium text-gray-700 dark:text-primary-600
                border-[0.5px] border-gray-200 dark:border-[#5F5F5F] dark:hover:bg-zinc-800 shadow-xs dark:hover:shadow-[#5F5F5F]
                ${nodesReadOnly && 'opacity-50 !cursor-not-allowed'}
              `}
              onClick={handleShowFeatures}
            >
              <Grid01 className='w-4 h-4 mr-1 text-gray-500' />
              {t('workflow.common.features')}
            </Button>
            <AppPublisher
              {...{
                publishedAt,
                draftUpdatedAt,
                disabled: Boolean(getNodesReadOnly()),
                toolPublished,
                inputs: variables,
                onRefreshData: handleToolConfigureUpdate,
                onPublish,
                onRestore: onStartRestoring,
                onToggle: onPublisherToggle,
                crossAxisOffset: 53,
              }}
            />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Checklist disabled={nodesReadOnly} />
          </div>
        )
      }
      {
        viewHistory && (
          <div className='flex items-center'>
            <ViewHistory withText />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Button
              type='primary'
              // className={`
              //   mr-2 px-3 py-0 h-8 text-[13px] font-medium
              //   border-[0.5px] border-gray-200 shadow-xs 
                
              // `}
              className={`
                mr-2 px-3 py-0 h-8 text-[13px] font-medium
                border-[0.5px] border-gray-200 dark:border-[#5F5F5F] shadow-xs 
                
              `}
              onClick={handleGoBackToEdit}
            >
              <ArrowNarrowLeft className='w-4 h-4 mr-1' />
              {t('workflow.common.goBackToEdit')}
            </Button>
          </div>
        )
      }
      {
        restoring && (
          <div className='flex items-center'>
            <Button
              // className={`
              //   px-3 py-0 h-8 bg-white   text-[13px] font-medium text-gray-700
              //   border-[0.5px] border-gray-200 shadow-xs
              // `}
              className={`
                px-3 py-0 h-8 bg-white dark:bg-[#333333] text-[13px] font-medium text-gray-700 dark:text-white dark:border-[#5F5F5F] dark:border-[#5F5F5F] dark:hover:shadow-[#5F5F5F] dark:hover:bg-transparent
                border-[0.5px] border-gray-200 shadow-xs
              `}
              onClick={handleShowFeatures}
            >
              <Grid01 className='w-4 h-4 mr-1 text-gray-500' />
              {t('workflow.common.features')}
            </Button>
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Button
              // className='mr-2 px-3 py-0 h-8 bg-white  text-[13px] text-gray-700 font-medium border-[0.5px] border-gray-200 shadow-xs'
              className='mr-2 px-3 py-0 h-8 bg-white dark:bg-[#333333] text-[13px] text-gray-700 dark:text-white font-medium border-[0.5px] border-gray-200 dark:border-[#5F5F5F] dark:hover:shadow-[#5F5F5F] dark:hover:bg-transparent shadow-xs'
              onClick={handleCancelRestore}
            >
              {t('common.operation.cancel')}
            </Button>
            <Button
              className='px-3 py-0 h-8 text-[13px] font-medium shadow-xs'
              onClick={handleRestore}
              type='primary'
            >
              {t('workflow.common.restore')}
            </Button>
          </div>
        )
      }
    </div>
  )
}

export default memo(Header)
