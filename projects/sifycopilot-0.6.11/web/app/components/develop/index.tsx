'use client'
import { useTranslation } from 'react-i18next'
import s from './secret-key/style.module.css'
import Doc from '@/app/components/develop/doc'
import Loading from '@/app/components/base/loading'
import InputCopy from '@/app/components/develop/secret-key/input-copy'
import SecretKeyButton from '@/app/components/develop/secret-key/secret-key-button'
import { useStore as useAppStore } from '@/app/components/app/store'

type IDevelopMainProps = {
  appId: string
}

const DevelopMain = ({ appId }: IDevelopMainProps) => {
  const appDetail = useAppStore(state => state.appDetail)
  const { t } = useTranslation()

  if (!appDetail) {
    return (
      <div className='flex h-full items-center justify-center bg-white'>
        <Loading />
      </div>
    )
  }

  return (
    <div className='relative flex flex-col h-full overflow-hidden'>
      {/* <div className='flex items-center justify-between flex-shrink-0 px-6 border-b border-solid py-2 border-b-gray-100'> */}
      <div className='flex items-center justify-between flex-shrink-0 px-6 border-b border-solid py-2 border-b-gray-100 dark:border-b-[#3f3f3f] dark:border-solid'>
        <div className='text-lg font-medium text-gray-900'></div>
        <div className='flex items-center flex-wrap gap-y-1'>
          <InputCopy className='flex-shrink-0 mr-1 w-52 sm:w-80' value={appDetail.api_base_url}>
            {/* <div className={`ml-2 border border-gray-200 border-solid flex-shrink-0 px-2 py-0.5 rounded-[6px] text-gray-500 text-[0.625rem] ${s.customApi}`}>
              {t('appApi.apiServer')} */}
            {/* <div className={`dark:text-white ml-2 border border-gray-200 border-solid flex-shrink-0 px-2 py-0.5 rounded-[6px] text-gray-500 text-[0.625rem] ${s.customApi}`}> */}
            <div className={`dark:text-white ml-2 border border-gray-200 dark:border-[#5F5F5F] dark:hover:bg-transparent dark:hover:shadow-[#5F5F5F] border-solid flex-shrink-0 px-2 py-0.5 rounded-[6px] text-gray-500 text-[0.625rem] ${s.customApi}`}>
              {t('appApi.apiServer')}
            </div>
          </InputCopy>
          {/* <div className={`flex items-center h-9 px-3 rounded-lg 
                        text-[13px] font-normal  mr-2 ${appDetail.enable_api ? 'text-green-500 bg-green-50' : 'text-yellow-500 bg-yellow-50'}`}> */}
          <div className={`flex items-center h-9 px-3 rounded-lg 
                text-[13px] font-normal mr-2 
                ${appDetail.enable_api ? 'text-green-500 bg-green-50 dark:text-green-500 dark:bg-[#3F3F3F]' : 'text-yellow-500 bg-yellow-50 dark:text-yellow-500 dark:bg-[#3F3F3F]'} 
                `}>
            <div className='mr-1'>{t('appApi.status')}</div>
            <div className='font-semibold'>{appDetail.enable_api ? `${t('appApi.ok')}` : `${t('appApi.disabled')}`}</div>
          </div>
          <SecretKeyButton className='flex-shrink-0 dark:border-[#5F5F5F] dark:hover:bg-transparent dark:hover:shadow-[#5F5F5F]' appId={appId} />
        </div>
      </div>
      <div className='px-4 sm:px-10 py-4 overflow-auto grow '>
        <Doc appDetail={appDetail} />
      </div>
    </div>
  )
}

export default DevelopMain
