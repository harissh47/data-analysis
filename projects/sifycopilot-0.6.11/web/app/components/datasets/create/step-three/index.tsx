'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import EmbeddingProcess from '../embedding-process'

import s from './index.module.css'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import type { FullDocumentDetail, createDocumentResponse } from '@/models/datasets'

type StepThreeProps = {
  datasetId?: string
  datasetName?: string
  indexingType?: string
  creationCache?: createDocumentResponse
}

const StepThree = ({ datasetId, datasetName, indexingType, creationCache }: StepThreeProps) => {
  const { t } = useTranslation()

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  return (
    <div className='flex w-full h-full dark:bg-[#202020]'>
      <div className={'h-full w-full overflow-y-scroll px-6 sm:px-16'}>
        <div className='max-w-[636px]'>
          {!datasetId && (
            <>
              <div className={s.creationInfo}>
                {/* <div className={s.title}>{t('datasetCreation.stepThree.creationTitle')}</div>
                <div className={s.content}>{t('datasetCreation.stepThree.creationContent')}</div>
                <div className={s.label}>{t('datasetCreation.stepThree.label')}</div>
                <div className={s.datasetName}>{datasetName || creationCache?.dataset?.name}</div> */}
                <div className="mb-2 font-medium text-[20px] leading-[30px] text-[#101828] dark:text-white">
                {t('datasetCreation.stepThree.creationTitle')}
                </div>
                <div className="mb-[44px] font-normal text-[14px] leading-[20px] text-[#667085] dark:text-[#FCFCFC]">
                {t('datasetCreation.stepThree.creationContent')}
                </div>
                <div className="mb-2 font-medium text-[14px] leading-[20px] text-[#101828] dark:text-white">
                {t('datasetCreation.stepThree.label')}
                </div>
                <div className="p-2 bg-[#F9FAFB] dark:bg-[#3F3F3F] rounded-lg font-normal text-[14px] leading-[20px] text-[#101828] dark:text-[#FCFCFC] break-all">
                {datasetName || creationCache?.dataset?.name}
               </div>

              </div>
              <div className={s.dividerLine}/>
            </>
          )}
          {datasetId && (
            <div className={s.creationInfo}>
              <div className={s.title}>{t('datasetCreation.stepThree.additionTitle')}</div>
              <div className={s.content}>{`${t('datasetCreation.stepThree.additionP1')} ${datasetName || creationCache?.dataset?.name} ${t('datasetCreation.stepThree.additionP2')}`}</div>
            </div>
          )}
          <EmbeddingProcess
            datasetId={datasetId || creationCache?.dataset?.id || ''}
            batchId={creationCache?.batch || ''}
            documents={creationCache?.documents as FullDocumentDetail[]}
            indexingType={indexingType || creationCache?.dataset?.indexing_technique}
          />
        </div>
      </div>
      {!isMobile && <div className={cn(s.sideTip)}>
        {/* <div className={s.tipCard}> */}
        <div className="flex flex-col items-start p-6 w-[320px] bg-[#F9FAFB] dark:bg-[#3F3F3F] shadow-sm rounded-xl">
          <span className={s.icon}/>
          {/* <div className={s.title}>{t('datasetCreation.stepThree.sideTipTitle')}</div>
          <div className={s.content}>{t('datasetCreation.stepThree.sideTipContent')}</div> */}
          <div className="my-3 font-medium text-[16px] leading-[24px] text-[#344054] dark:text-white">
          {t('datasetCreation.stepThree.sideTipTitle')}
          </div>
          <div className="font-normal text-[14px] leading-[20px] text-[#344054] dark:text-[#FCFCFC]">
          {t('datasetCreation.stepThree.sideTipContent')}
          </div>
        </div>
      </div>}
    </div>
  )
}

export default StepThree
