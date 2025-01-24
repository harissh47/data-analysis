'use client'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import FilePreview from '../file-preview'
import FileUploader from '../file-uploader'
import NotionPagePreview from '../notion-page-preview'
import EmptyDatasetCreationModal from '../empty-dataset-creation-modal'
import Website from '../website'
import WebsitePreview from '../website/preview'
import s from './index.module.css'
import type { CrawlOptions, CrawlResultItem, FileItem } from '@/models/datasets'
import type { NotionPage } from '@/models/common'
import { DataSourceType } from '@/models/datasets'
import Button from '@/app/components/base/button'
import { NotionPageSelector } from '@/app/components/base/notion-page-selector'
import { useDatasetDetailContext } from '@/context/dataset-detail'
import { useProviderContext } from '@/context/provider-context'
import VectorSpaceFull from '@/app/components/billing/vector-space-full'

type IStepOneProps = {
  datasetId?: string
  dataSourceType?: DataSourceType
  dataSourceTypeDisable: Boolean
  hasConnection: boolean
  onSetting: () => void
  files: FileItem[]
  updateFileList: (files: FileItem[]) => void
  updateFile: (fileItem: FileItem, progress: number, list: FileItem[]) => void
  notionPages?: NotionPage[]
  updateNotionPages: (value: NotionPage[]) => void
  onStepChange: () => void
  changeType: (type: DataSourceType) => void
  websitePages?: CrawlResultItem[]
  updateWebsitePages: (value: CrawlResultItem[]) => void
  onFireCrawlJobIdChange: (jobId: string) => void
  crawlOptions: CrawlOptions
  onCrawlOptionsChange: (payload: CrawlOptions) => void
}

type NotionConnectorProps = {
  onSetting: () => void
}
export const NotionConnector = ({ onSetting }: NotionConnectorProps) => {
  const { t } = useTranslation()

  return (
    // <div className={s.notionConnectionTip}>
    <div className="
        flex flex-col items-start p-6 max-w-[640px] bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-[16px]">
      <span className={s.notionIcon} />
      {/* <div className={s.title}>{t('datasetCreation.stepOne.notionSyncTitle')}</div>
      <div className={s.tip}>{t('datasetCreation.stepOne.notionSyncTip')}</div> */}
      <div className="relative my-6 font-semibold text-lg leading-6 text-[#9bd489] dark:text-primary-600">
      {t('datasetCreation.stepOne.notionSyncTitle')}
      </div>
      <div className="mb-5 text-sm leading-[18px] text-gray-600 dark:text-white">
      {t('datasetCreation.stepOne.notionSyncTip')}
      </div>
      <Button className='h-8' type='primary' onClick={onSetting}>{t('datasetCreation.stepOne.connect')}</Button>
    </div>
  )
}

const StepOne = ({
  datasetId,
  dataSourceType: inCreatePageDataSourceType,
  dataSourceTypeDisable,
  changeType,
  hasConnection,
  onSetting,
  onStepChange,
  files,
  updateFileList,
  updateFile,
  notionPages = [],
  updateNotionPages,
  websitePages = [],
  updateWebsitePages,
  onFireCrawlJobIdChange,
  crawlOptions,
  onCrawlOptionsChange,
}: IStepOneProps) => {
  const { dataset } = useDatasetDetailContext()
  const [showModal, setShowModal] = useState(false)
  const [currentFile, setCurrentFile] = useState<File | undefined>()
  const [currentNotionPage, setCurrentNotionPage] = useState<NotionPage | undefined>()
  const [currentWebsite, setCurrentWebsite] = useState<CrawlResultItem | undefined>()
  const { t } = useTranslation()

  const modalShowHandle = () => setShowModal(true)
  const modalCloseHandle = () => setShowModal(false)

  const updateCurrentFile = (file: File) => {
    setCurrentFile(file)
  }
  const hideFilePreview = () => {
    setCurrentFile(undefined)
  }

  const updateCurrentPage = (page: NotionPage) => {
    setCurrentNotionPage(page)
  }

  const hideNotionPagePreview = () => {
    setCurrentNotionPage(undefined)
  }

  const hideWebsitePreview = () => {
    setCurrentWebsite(undefined)
  }

  const shouldShowDataSourceTypeList = !datasetId || (datasetId && !dataset?.data_source_type)
  const isInCreatePage = shouldShowDataSourceTypeList
  const dataSourceType = isInCreatePage ? inCreatePageDataSourceType : dataset?.data_source_type
  const { plan, enableBilling } = useProviderContext()
  const allFileLoaded = (files.length > 0 && files.every(file => file.file.id))
  const hasNotin = notionPages.length > 0
  const isVectorSpaceFull = plan.usage.vectorSpace >= plan.total.vectorSpace
  const isShowVectorSpaceFull = (allFileLoaded || hasNotin) && isVectorSpaceFull && enableBilling
  const notSupportBatchUpload = enableBilling && plan.type === 'sandbox'
  const nextDisabled = useMemo(() => {
    if (!files.length)
      return true
    if (files.some(file => !file.file.id))
      return true
    if (isShowVectorSpaceFull)
      return true

    return false
  }, [files])
  return (
    <div className='flex w-full h-full dark:bg-[#202020]'>
      <div className='grow overflow-y-auto relative'>
        {
          shouldShowDataSourceTypeList && (
            // <div className={s.stepHeader}>{t('datasetCreation.steps.one')}</div>
            <div className="sticky top-0 left-0 font-semibold text-[18px] leading-[28px] text-[#101828] dark:text-white p-[42px_64px_12px]">
              {t('datasetCreation.steps.one')}
            </div>
          )
        }
        {/* <div className={s.form}> */}
        <div className="relative p-[12px] px-[64px] bg-white dark:bg-[#202020]">

          {
            shouldShowDataSourceTypeList && (
              // <div className='flex items-center mb-8 flex-wrap gap-y-4 '>
              <div className='flex items-center mb-8 flex-wrap gap-y-4'>

                 <div
                  // className={cn(
                  //   s.dataSourceItem,
                  //   dataSourceType === DataSourceType.FILE && s.active,
                  //   dataSourceTypeDisable && dataSourceType !== DataSourceType.FILE && s.disabled,
                  // )} 
                  className={`box-border relative shrink-0 flex items-center mr-3 p-3 h-14 bg-white dark:bg-[#3F3F3F] rounded-xl font-medium text-[14px] leading-[20px] text-[#101828] dark:text-white cursor-pointer border-[0.5px] border-[#EAECF0]  shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
                  ${dataSourceType === DataSourceType.FILE ? 'bg-[#f5f8ff] border-[1.5px] border-[#c4E037] shadow-[0px_1px_3px_rgba(16,24,40,0.1)]' : 'dark:border-[#5f5f5f]'}
                  ${dataSourceTypeDisable && dataSourceType !== DataSourceType.FILE ? 'bg-[#f9fafb] border-[#EAECF0] dark:border-[#5f5f5f] cursor-default' : ''}`}
                  onClick={() => {
                    if (dataSourceTypeDisable)
                      return
                    changeType(DataSourceType.FILE)
                    hideFilePreview()
                    hideNotionPagePreview()
                  }}
                >
                  <span className={cn(s.datasetIcon)} />
                  {t('datasetCreation.stepOne.dataSourceType.file')}
                </div>
                <div
                  // className={cn(
                  //   s.dataSourceItem,
                  //   dataSourceType === DataSourceType.NOTION && s.active,
                  //   dataSourceTypeDisable && dataSourceType !== DataSourceType.NOTION && s.disabled,
                  // )}

                  className={`box-border relative shrink-0 flex items-center mr-3 p-3 h-14 bg-white dark:bg-[#3F3F3F] rounded-xl font-medium text-[14px] leading-[20px] text-[#101828] dark:text-white cursor-pointer border-[0.5px] border-[#EAECF0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
                  ${dataSourceType === DataSourceType.NOTION ? 'bg-[#f5f8ff] border-[1.5px] border-[#c4E037] shadow-[0px_1px_3px_rgba(16,24,40,0.1)]' : 'dark:border-[#5f5f5f]'}
                  ${dataSourceTypeDisable && dataSourceType !== DataSourceType.NOTION ? 'bg-[#f9fafb] border-[#EAECF0] dark:border-[#5f5f5f] cursor-default' : ''}`}
                  
                  onClick={() => {
                    if (dataSourceTypeDisable)
                      return
                    changeType(DataSourceType.NOTION)
                    hideFilePreview()
                    hideNotionPagePreview()
                  }}
                >
                  <span className={cn(s.datasetIcon, s.notion)} />
                  {t('datasetCreation.stepOne.dataSourceType.notion')}
                </div>
                <div
                  // className={cn(
                  //   s.dataSourceItem,
                  //   dataSourceType === DataSourceType.WEB && s.active,
                  //   dataSourceTypeDisable && dataSourceType !== DataSourceType.WEB && s.disabled,
                  // )}
                  className={`box-border relative shrink-0 flex items-center mr-3 p-3 h-14 bg-white dark:bg-[#3F3F3F] rounded-xl font-medium text-[14px] leading-[20px] text-[#101828] dark:text-white cursor-pointer border-[0.5px] border-[#EAECF0] shadow-[0px_1px_2px_rgba(16,24,40,0.05)]
                  ${dataSourceType === DataSourceType.WEB ? 'bg-[#f5f8ff] border-[1.5px] border-[#c4E037] shadow-[0px_1px_3px_rgba(16,24,40,0.1)]' : 'dark:border-[#5f5f5f]'}
                  ${dataSourceTypeDisable && dataSourceType !== DataSourceType.WEB ? 'bg-[#f9fafb] border-[#EAECF0] dark:border-[#5f5f5f] cursor-default' : ''}`}

                  onClick={() => changeType(DataSourceType.WEB)}
                >
                  <span className={cn(s.datasetIcon, s.web)} />
                  {t('datasetCreation.stepOne.dataSourceType.web')}
                </div>
              </div>
            )
          }
          {dataSourceType === DataSourceType.FILE && (
            <>
              <FileUploader
                fileList={files}
                titleClassName={!shouldShowDataSourceTypeList ? 'mt-[30px] !mb-[44px] !text-lg !font-semibold !text-gray-900' : undefined}
                prepareFileList={updateFileList}
                onFileListUpdate={updateFileList}
                onFileUpdate={updateFile}
                onPreview={updateCurrentFile}
                notSupportBatchUpload={notSupportBatchUpload}
              />
              {isShowVectorSpaceFull && (
                <div className='max-w-[640px] mb-4'>
                  <VectorSpaceFull />
                </div>
              )}
              <Button disabled={nextDisabled} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
            </>
          )}
          {dataSourceType === DataSourceType.NOTION && (
            <>
              {!hasConnection && <NotionConnector onSetting={onSetting} />}
              {hasConnection && (
                <>
                  <div className='mb-8 w-[640px]'>
                    <NotionPageSelector
                      value={notionPages.map(page => page.page_id)}
                      onSelect={updateNotionPages}
                      onPreview={updateCurrentPage}
                    />
                  </div>
                  {isShowVectorSpaceFull && (
                    <div className='max-w-[640px] mb-4'>
                      <VectorSpaceFull />
                    </div>
                  )}
                  <Button disabled={isShowVectorSpaceFull || !notionPages.length} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
                </>
              )}
            </>
          )}
          {dataSourceType === DataSourceType.WEB && (
            <>
              <div className={cn('mb-8 w-[640px]', !shouldShowDataSourceTypeList && 'mt-12')}>
                <Website
                  onPreview={setCurrentWebsite}
                  checkedCrawlResult={websitePages}
                  onCheckedCrawlResultChange={updateWebsitePages}
                  onJobIdChange={onFireCrawlJobIdChange}
                  crawlOptions={crawlOptions}
                  onCrawlOptionsChange={onCrawlOptionsChange}
                />
              </div>
              {isShowVectorSpaceFull && (
                <div className='max-w-[640px] mb-4'>
                  <VectorSpaceFull />
                </div>
              )}
              <Button disabled={isShowVectorSpaceFull || !websitePages.length} className={s.submitButton} type='primary' onClick={onStepChange}>{t('datasetCreation.stepOne.button')}</Button>
            </>
          )}
          {!datasetId && (
            <>
              <div className={s.dividerLine} />
              <div onClick={modalShowHandle} className={s.OtherCreationOption}>{t('datasetCreation.stepOne.emptyDatasetCreation')}</div>
              {/* <div onClick={modalShowHandle} className="flex items-center cursor-pointer font-medium text-[13px] leading-[18px] text-[#000] dark:text-white">
                {t('datasetCreation.stepOne.emptyDatasetCreation')}
              </div> */}

            </>
          )}
        </div>
        <EmptyDatasetCreationModal show={showModal} onHide={modalCloseHandle} />
      </div>
      {currentFile && <FilePreview file={currentFile} hidePreview={hideFilePreview} />}
      {currentNotionPage && <NotionPagePreview currentPage={currentNotionPage} hidePreview={hideNotionPagePreview} />}
      {currentWebsite && <WebsitePreview payload={currentWebsite} hidePreview={hideWebsitePreview} />}
    </div>
  )
}

export default StepOne
