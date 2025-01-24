import type {
  FC,
  ReactNode,
} from 'react'
import {
  memo,
  useCallback,
  // useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
// import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash-es'
import classNames from 'classnames'
import { useShallow } from 'zustand/react/shallow'
import produce from 'immer'
// import { formatRevalidate } from 'next/dist/server/lib/revalidate'
import type {
  ChatConfig,
  ChatItem,
  Feedback,
  OnSend,
} from '../types'
// import Modal from '../../modal'
import Modal from '../../base/modal'
import s from './style.module.css'
import Question from './question'
import Answer from './answer'
import ChatInput from './chat-input'
import TryToAsk from './try-to-ask'
import { ChatContextProvider } from './context'
import Action from './actions'
import type { Emoji } from '@/app/components/tools/types'
import Button from '@/app/components/base/button'
import { StopCircle } from '@/app/components/base/icons/src/vender/solid/mediaAndDevices'
import AgentLogModal from '@/app/components/base/agent-log-modal'
import PromptLogModal from '@/app/components/base/prompt-log-modal'
import { useStore as useAppStore } from '@/app/components/app/store'
import type { ActionItem, FormValues } from '@/app/components/app/chat/type'
import Carousel from '../chat-with-history/carousel/carousel'
import { useChatWithHistoryContext } from '../chat-with-history/context'
// import { updateFormMemory } from '@/service/share'
// import Toast from '../../toast'
import Toast from '../../base/toast'
import OpeningContainer from '../chat-with-history/container/container'

export type ChatProps = {
  chatList: ChatItem[]
  config?: ChatConfig
  isResponding?: boolean
  noStopResponding?: boolean
  onStopResponding?: () => void
  noChatInput?: boolean
  onSend?: OnSend
  chatContainerClassName?: string
  chatContainerInnerClassName?: string
  chatFooterClassName?: string
  chatFooterInnerClassName?: string
  suggestedQuestions?: string[]
  showPromptLog?: boolean
  questionIcon?: ReactNode
  answerIcon?: ReactNode
  allToolIcons?: Record<string, string | Emoji>
  onAnnotationEdited?: (question: string, answer: string, index: number) => void
  onAnnotationAdded?: (annotationId: string, authorName: string, question: string, answer: string, index: number) => void
  onAnnotationRemoved?: (index: number) => void
  chatNode?: ReactNode
  onFeedback?: (messageId: string, feedback: Feedback) => void
  chatAnswerContainerInner?: string
  hideProcessDetail?: boolean
  handleActionFormInput: (item: ActionItem) => void
}
const Chat: FC<ChatProps> = ({
  config,
  onSend,
  chatList,
  isResponding,
  noStopResponding,
  onStopResponding,
  noChatInput,
  chatContainerClassName,
  chatContainerInnerClassName,
  chatFooterClassName,
  chatFooterInnerClassName,
  suggestedQuestions,
  showPromptLog,
  questionIcon,
  answerIcon,
  allToolIcons,
  onAnnotationAdded,
  onAnnotationEdited,
  onAnnotationRemoved,
  chatNode,
  onFeedback,
  chatAnswerContainerInner,
  hideProcessDetail,
  handleActionFormInput,
}) => {
  // const { t } = useTranslation()
  const { currentLogItem, setCurrentLogItem, showPromptLogModal, setShowPromptLogModal, showAgentLogModal, setShowAgentLogModal } = useAppStore(useShallow(state => ({
    currentLogItem: state.currentLogItem,
    setCurrentLogItem: state.setCurrentLogItem,
    showPromptLogModal: state.showPromptLogModal,
    setShowPromptLogModal: state.setShowPromptLogModal,
    showAgentLogModal: state.showAgentLogModal,
    setShowAgentLogModal: state.setShowAgentLogModal,
  })))

  const [modalVisible, setModalVisible] = useState(false)
  const [modalOpened, setModalOpened] = useState<string[]>([])
  // const [currentAction, setCurrentAction] = useState<ActionItem | null>(null)

  const [width, setWidth] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatContainerInnerRef = useRef<HTMLDivElement>(null)
  const chatFooterRef = useRef<HTMLDivElement>(null)
  const chatFooterInnerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  // const [showCarousel, setShowCarousel] = useState(true)

  const {
    appData,
    currentConversationId,
  } = useChatWithHistoryContext()

  const handleScrolltoBottom = useCallback(() => {
    if (chatContainerRef.current && !userScrolledRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }, [])

  const handleWindowResize = useCallback(() => {
    if (chatContainerRef.current)
      setWidth(document.body.clientWidth - (chatContainerRef.current?.clientWidth + 16) - 8)

    if (chatContainerRef.current && chatFooterRef.current)
      chatFooterRef.current.style.width = `${chatContainerRef.current.clientWidth}px`

    if (chatContainerInnerRef.current && chatFooterInnerRef.current)
      chatFooterInnerRef.current.style.width = `${chatContainerInnerRef.current.clientWidth}px`
  }, [])

  useEffect(() => {
    handleScrolltoBottom()
    handleWindowResize()
  }, [handleScrolltoBottom, handleWindowResize])

  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        handleScrolltoBottom()
        handleWindowResize()
      })
    }
  })

  useEffect(() => {
    window.addEventListener('resize', debounce(handleWindowResize))
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  useEffect(() => {
    if (chatFooterRef.current && chatContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { blockSize } = entry.borderBoxSize[0]

          chatContainerRef.current!.style.paddingBottom = `${blockSize}px`
          handleScrolltoBottom()
        }
      })

      resizeObserver.observe(chatFooterRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [handleScrolltoBottom])

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      const setUserScrolled = () => {
        if (chatContainer)
          userScrolledRef.current = chatContainer.scrollHeight - chatContainer.scrollTop >= chatContainer.clientHeight + 300
      }
      chatContainer.addEventListener('scroll', setUserScrolled)
      return () => chatContainer.removeEventListener('scroll', setUserScrolled)
    }
  }, [])

  const hasTryToAsk = config?.suggested_questions_after_answer?.enabled && !!suggestedQuestions?.length && onSend

  const handleActionInputChange = useCallback((list: ActionItem, val: FormValues[]) => {
    const newActionList = produce(list, (draft) => {
      draft.form_values = val
    })
    handleActionFormInput(newActionList)
  }, [handleActionFormInput])

  useEffect(() => {
    if (chatList[chatList.length - 1]?.isAction || false) {
      const actionId = chatList[chatList.length - 1].id

      if ((chatList[chatList.length - 1].actions?.action_mandatory) && !modalOpened.includes(actionId))
        setModalVisible(true)
    }
  }, [chatList, modalVisible, modalOpened])

  console.log("chat page varudhaa over")

  const handleModalClose = useCallback((actionId: string) => {
    setModalVisible(false)
    if (!modalOpened.includes(actionId))
      setModalOpened(prevState => [...prevState, actionId])
  }, [modalOpened])

  console.log("chat page varudhaa over over")


  const handleUpdateMemory = useCallback(async (formValue: any, app_id: string, conversation_id: string) => {
    const formMemoryItem = {
      app_id: app_id,
      conversation_id: conversation_id,
      form_value: formValue,
    }

    // try {
    //   await updateFormMemory(false, '', formMemoryItem)
    // } catch (e: any) {
    //   Toast.notify({
    //     type: 'error',
    //     message: e.toString(),
    //   })
    // }
  }, [chatList])

  const handleCarouselClick = (question: string) => {
    // setShowCarousel(false)
    // onSend?.(question)
    if (onSend) {
      onSend(question)
    }
  }

  console.log("carousel click varudhaa over")


  return (
    <ChatContextProvider
      config={config}
      chatList={chatList}
      isResponding={isResponding}
      showPromptLog={showPromptLog}
      questionIcon={questionIcon}
      answerIcon={answerIcon}
      allToolIcons={allToolIcons}
      onSend={onSend}
      onAnnotationAdded={onAnnotationAdded}
      onAnnotationEdited={onAnnotationEdited}
      onAnnotationRemoved={onAnnotationRemoved}
      onFeedback={onFeedback}
    >
      {/* <div className='relative h-full'> */}
      <div className='relative h-full flex'>
        <div className={classNames(`${s.chatOverlay} relative h-full flex-grow`)}>
          <div
            ref={chatContainerRef}
            className={classNames('relative h-full overflow-y-auto', chatContainerClassName)}
          // className={classNames('relative h-full overflow-y-auto ${themeStyles.background}', chatContainerClassName)}
          >
            {chatNode}
            {(config?.show_carousel === true && chatList.length === 1 && chatList[0].isOpeningStatement! === true)
              ? (<Carousel
                onCardClick={handleCarouselClick}
                carouselImages={config.carousel_images}
              />)
              : (config?.show_openingcontainer === true && chatList.length === 1 && chatList[0].isOpeningStatement! === true)
                ? <OpeningContainer onQuestionClick={handleCarouselClick}
                  // containerQues={config.carousel_images}
                  containerQues={config.suggested_questions}
                />
                :
                <div
                  ref={chatContainerInnerRef}
                  className={`${chatContainerInnerClassName}`}
                >
                  {
                    chatList.map((item, index) => {
                      if (item.isAnswer) {
                        const isLast = item.id === chatList[chatList.length - 1]?.id
                        return (
                          <Answer
                            key={item.id}
                            item={item}
                            question={chatList[index - 1]?.content}
                            index={index}
                            config={config}
                            answerIcon={answerIcon}
                            responding={isLast && isResponding}
                            allToolIcons={allToolIcons}
                            showPromptLog={showPromptLog}
                            chatAnswerContainerInner={chatAnswerContainerInner}
                            hideProcessDetail={hideProcessDetail}
                          />
                        )
                      }
                      else if (item.isAction && item.actions?.action_mandatory) {
                        return (
                          <Modal
                            key={item.id}
                            isShow={modalVisible}
                            onClose={() => handleModalClose(item.id)}
                            closable
                          >
                            <Action
                              key={item.id}
                              onChange={formValues => handleActionInputChange(item.actions!, formValues)}
                              actionItem={item.actions!}
                              // onSend={onSend}
                              onSubmit={message => onSend!(message)}
                              onModalClose={() => handleModalClose(item.id)}
                              onUpdateMemory={item.actions.memory ? () => {
                                let form_value: any = {}
                                for (let i = 0; i < item.actions!.form_values.length; i++) {
                                  const element = item.actions!.form_values[i];
                                  form_value[element.name] = element.value
                                }
                                handleUpdateMemory(form_value, appData?.app_id || '', currentConversationId)
                              } : () => { }}
                            />
                          </Modal>
                        )
                      }
                      else if (item.isAction && !item.actions?.action_mandatory) {
                        return (
                          <Action
                            key={item.id}
                            onChange={formValues => handleActionInputChange(item.actions!, formValues)}
                            actionItem={item.actions!}
                            // onSend={onSend}
                            onSubmit={message => onSend!(message)}
                            onUpdateMemory={item.actions?.memory ? () => {
                              let form_value: any = {}
                              for (let i = 0; i < item.actions!.form_values.length; i++) {
                                const element = item.actions!.form_values[i];
                                form_value[element.name] = element.value
                              }
                              handleUpdateMemory(form_value, appData?.app_id || '', currentConversationId)
                            } : () => { }}
                          />
                        )
                      }
                      return (
                        <Question
                          key={item.id}
                          item={item}
                          questionIcon={questionIcon}
                        />
                      )
                    })
                  }
                </div>}
            {/* {showCarousel && (chatList.length === 1 && chatList[0].isOpeningStatement! === true) 
              && (<Carousel
                    onCardClick={handleCarouselClick} 
                  />)} */}
          </div>
          <div
            className={`absolute bottom-0 ${(hasTryToAsk || !noChatInput || !noStopResponding) && chatFooterClassName}`}
            ref={chatFooterRef}
            // style={{ zIndex: 10, width: '100%' }}
            // style={{
            //   background: 'linear-gradient(0deg, #000 20%, rgba(255, 255, 255, 0.00) 100%)',
            // }}
            style={{
              background: 'linear-gradient(0deg, #F9FAFB 40%, rgba(255, 255, 255, 0.00) 100%)', zIndex: 10, width: '100%',
            }}
          >
            <div
              ref={chatFooterInnerRef}
              className={`${chatFooterInnerClassName}`}
            >
              {
                !noStopResponding && isResponding && (
                  <div className='flex justify-center mb-2'>
                    <Button className='py-0 px-3 h-7 bg-white shadow-xs' onClick={onStopResponding}>
                      <StopCircle className='mr-[5px] w-3.5 h-3.5 text-gray-500' />
                      <span className='text-xs text-gray-500 font-normal'>{'Stop responding'}</span>
                    </Button>
                  </div>
                )
              }
              {
                hasTryToAsk && (
                  <TryToAsk
                    suggestedQuestions={suggestedQuestions}
                    onSend={onSend}
                  />
                )
              }
              {
                !noChatInput && (
                  <ChatInput
                    visionConfig={config?.file_upload?.image}
                    speechToTextConfig={config?.speech_to_text}
                    onSend={onSend}
                  />
                )
              }
            </div>
          </div>

          {showPromptLogModal && (
            <PromptLogModal
              width={width}
              currentLogItem={currentLogItem}
              onCancel={() => {
                setCurrentLogItem()
                setShowPromptLogModal(false)
              }}
            />
          )}
          {showAgentLogModal && (
            <AgentLogModal
              width={width}
              currentLogItem={currentLogItem}
              onCancel={() => {
                setCurrentLogItem()
                setShowAgentLogModal(false)
              }}
            />
          )}
        </div>
      </div>
    </ChatContextProvider>
  )
}

export default memo(Chat)
