import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import Button from '../../base/button'
import Tag from '../../base/tag'
import Tooltip from '../../base/tooltip'
import { getIcon } from '../common/retrieval-method-info'
import s from './style.module.css'
import DatasetDetailContext from '@/context/dataset-detail'
import type { HitTestingResponse } from '@/models/datasets'
import { hitTesting } from '@/service/datasets'
import { asyncRunSafe } from '@/utils'
import { RETRIEVE_METHOD, type RetrievalConfig } from '@/types/app'

type TextAreaWithButtonIProps = {
  datasetId: string
  onUpdateList: () => void
  setHitResult: (res: HitTestingResponse) => void
  loading: boolean
  setLoading: (v: boolean) => void
  text: string
  setText: (v: string) => void
  onClickRetrievalMethod: () => void
  retrievalConfig: RetrievalConfig
  isEconomy: boolean
  onSubmit?: () => void
}

const TextAreaWithButton = ({
  datasetId,
  onUpdateList,
  setHitResult,
  setLoading,
  loading,
  text,
  setText,
  onClickRetrievalMethod,
  retrievalConfig,
  isEconomy,
  onSubmit: _onSubmit,
}: TextAreaWithButtonIProps) => {
  const { t } = useTranslation()
  const { indexingTechnique } = useContext(DatasetDetailContext)

  function handleTextChange(event: any) {
    setText(event.target.value)
  }

  const onSubmit = async () => {
    setLoading(true)
    const [e, res] = await asyncRunSafe<HitTestingResponse>(
      hitTesting({
        datasetId,
        queryText: text,
        retrieval_model: {
          ...retrievalConfig,
          search_method: isEconomy ? RETRIEVE_METHOD.keywordSearch : retrievalConfig.search_method,
        },
      }) as Promise<HitTestingResponse>,
    )
    if (!e) {
      setHitResult(res)
      onUpdateList?.()
    }
    setLoading(false)
    _onSubmit && _onSubmit()
  }

  const retrievalMethod = isEconomy ? RETRIEVE_METHOD.invertedIndex : retrievalConfig.search_method
  const Icon = getIcon(retrievalMethod)
  return (
    <>
      {/* <div className={s.wrapper}> */}
      <div className="relative border border-primary-600 rounded-xl dark:overflow-hidden ">

        {/* <div className='pt-2 rounded-tl-xl rounded-tr-xl bg-[#EEF4FF]'> */}
        <div className='pt-2 rounded-tl-xl rounded-tr-xl bg-[#EEF4FF] dark:bg-[#333333]'>
          <div className="px-4 pb-2 flex justify-between h-8 items-center ">
            {/* <span className="text-gray-800 font-semibold text-sm"> */}
            <span className="text-gray-800 dark:text-white font-semibold text-sm">
              {t('datasetHitTesting.input.title')}
            </span>
            <Tooltip
              selector={'change-retrieval-method'}
              htmlContent={t('dataset.retrieval.changeRetrievalMethod')}
            >
              <div
                onClick={onClickRetrievalMethod}
                className='flex px-2 h-7 items-center space-x-1 bg-white dark:bg-[#3f3f3f] hover:bg-[#ECE9FE] rounded-md shadow-sm cursor-pointer text-[#6927DA]'
              >
                <Icon className='w-3.5 h-3.5 dark:text-white'></Icon>
                <div className='text-xs font-medium dark:text-white'>{t(`dataset.retrieval.${retrievalMethod}.title`)}</div>
              </div>
            </Tooltip>
          </div>
          <div className='h-2 rounded-tl-xl rounded-tr-xl bg-white dark:bg-[#3f3f3f]'></div>
        </div>
        <div className='px-4 pb-11 dark:bg-[#3f3f3f] '>
          {/* <textarea
            value={text}
            onChange={handleTextChange}
            placeholder={t('datasetHitTesting.input.placeholder') as string}
            className={s.textarea}
          /> */}
          <textarea
  value={text}
  onChange={handleTextChange}
  placeholder={t('datasetHitTesting.input.placeholder') as string}
  className="border-none resize-none font-normal caret-primary-600 text-gray-700 dark:text-white text-sm w-full focus-visible:outline-none placeholder:text-gray-300 placeholder:text-sm placeholder:font-normal dark:bg-[#3f3f3f]"
  style={{ height: '220px' }}
/>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between mx-4 mt-2 mb-2   ">
            {text?.length > 200
              ? (
                <Tooltip
                  content={t('datasetHitTesting.input.countWarning') as string}
                  selector="hit-testing-warning"
                >
                  <div>
                    <Tag color="red" className="!text-red-600">
                      {text?.length}
                      <span className="text-red-300 mx-0.5">/</span>
                      200
                    </Tag>
                  </div>
                </Tooltip>
              )
              : (
                <Tag
                  color="gray"
                  className={cn('!text-gray-500 dark:!text-white', text?.length ? '' : 'opacity-50')}
                >
                  {text?.length}
                  {/* <span className="text-gray-300 mx-0.5">/</span> */}
                  <span className="text-gray-300 mx-0.5">/</span>

                  200
                </Tag>
              )}

            <div>
              <Button
                onClick={onSubmit}
                type="primary"
                loading={loading}
                disabled={(!text?.length || text?.length > 200)}
              >
                {t('datasetHitTesting.input.testing')}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default TextAreaWithButton
