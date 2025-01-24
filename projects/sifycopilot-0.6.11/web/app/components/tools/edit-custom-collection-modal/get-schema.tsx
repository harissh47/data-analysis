'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useClickAway } from 'ahooks'
import Toast from '../../base/toast'
import { Plus } from '../../base/icons/src/vender/line/general'
import { ChevronDown } from '../../base/icons/src/vender/line/arrows'
import examples from './examples'
import Button from '@/app/components/base/button'
import { importSchemaFromURL } from '@/service/tools'

type Props = {
  onChange: (value: string) => void
}

const GetSchema: FC<Props> = ({
  onChange,
}) => {
  const { t } = useTranslation()
  const [showImportFromUrl, setShowImportFromUrl] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const handleImportFromUrl = async () => {
    if (!importUrl.startsWith('http://') && !importUrl.startsWith('https://')) {
      Toast.notify({
        type: 'error',
        message: t('tools.createTool.urlError'),
      })
      return
    }
    setIsParsing(true)
    try {
      const { schema } = await importSchemaFromURL(importUrl) as any
      setImportUrl('')
      onChange(schema)
    }
    finally {
      setIsParsing(false)
      setShowImportFromUrl(false)
    }
  }

  const importURLRef = React.useRef(null)
  useClickAway(() => {
    setShowImportFromUrl(false)
  }, importURLRef)

  const [showExamples, setShowExamples] = useState(false)
  const showExamplesRef = React.useRef(null)
  useClickAway(() => {
    setShowExamples(false)
  }, showExamplesRef)

  return (
    <div className='flex space-x-1 justify-end relative w-[224px]'>
      <div ref={importURLRef}>
        <Button
          // className='flex items-center !h-6 !px-2 space-x-1 '
          className='flex items-center !h-6 !px-2 space-x-1 dark:border-0 dark:bg-[#3f3f3f] dark:hover:bg-zinc-800 dark:border-[#5F5F5F]'

          onClick={() => { setShowImportFromUrl(!showImportFromUrl) }}
        >
          <Plus className='w-3 h-3' />
          {/* <div className='text-xs font-medium text-gray-700'>{t('tools.createTool.importFromUrl')}</div> */}
          <div className='text-xs font-medium text-gray-700 dark:text-white'>{t('tools.createTool.importFromUrl')}</div>

        </Button>
        {showImportFromUrl && (
          // <div className=' absolute left-[-35px] top-[26px] p-2 rounded-lg border border-gray-200 bg-white shadow-lg'>
          <div className=' absolute left-[-35px] top-[26px] p-2 rounded-lg border border-gray-200 dark:border-[#5f5f5f] bg-white dark:bg-[#3f3f3f] shadow-lg'>

           <div className='relative'>
              <input
                type='text'
                // className='w-[244px] h-8 pl-1.5 pr-[44px] overflow-x-auto border border-gray-200 rounded-lg text-[13px]'
                className='w-[244px] h-8 pl-1.5 pr-[44px] overflow-x-auto border border-gray-200 dark:border-[#5f5f5f] rounded-lg text-[13px] dark:bg-[#3f3f3f] dark:text-[#FCFCFC] dark:focus:outline-none focus:border-2 dark:focus:border-[#5f5f5f]'

                placeholder={t('tools.createTool.importFromUrlPlaceHolder')!}
                value={importUrl}
                onChange={e => setImportUrl(e.target.value)}
              />
              <Button
                className='absolute top-1 right-1 !h-6 !px-2 text-xs font-medium 
'
                type='primary'
                disabled={!importUrl}
                onClick={handleImportFromUrl}
                loading={isParsing}
              >
                {isParsing ? '' : t('common.operation.ok')}
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className='relative' ref={showExamplesRef}>
        <Button
          // className='flex items-center !h-6 !px-2 space-x-1'
          className='flex items-center !h-6 !px-2 space-x-1 dark:border-0 dark:bg-[#3f3f3f] dark:hover:bg-zinc-800 dark:border-[#5F5F5F]'

          onClick={() => { setShowExamples(!showExamples) }}
        >
          {/* <div className='text-xs font-medium text-gray-700'>{t('tools.createTool.examples')}</div> */}
          <div className='text-xs font-medium text-gray-700 dark:text-white'>{t('tools.createTool.examples')}</div>

          <ChevronDown className='w-3 h-3' />
        </Button>
        {showExamples && (
          // <div className='absolute top-7 right-0 p-1 rounded-lg bg-white shadow-sm'>
          <div className='absolute top-7 right-0 p-1 rounded-lg bg-white dark:bg-[#333333] shadow-sm'>

            {examples.map(item => (
              <div
                key={item.key}
                onClick={() => {
                  onChange(item.content)
                  setShowExamples(false)
                }}
                // className='px-3 py-1.5 rounded-lg hover:bg-gray-50 leading-5 text-sm font-normal text-gray-700 cursor-pointer whitespace-nowrap'
                className='px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 leading-5 text-sm font-normal text-gray-700 dark:text-[#fcfcfc] cursor-pointer whitespace-nowrap'

              >
                {t(`tools.createTool.exampleOptions.${item.key}`)}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
export default React.memo(GetSchema)
