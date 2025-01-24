import { useTranslation } from 'react-i18next'
import { Webhooks } from '@/app/components/base/icons/src/vender/line/development'
import { BookOpen01 } from '@/app/components/base/icons/src/vender/line/education'
// import { AlertTriangle } from '@/app/components/base/icons/src/vender/solid/alertsAndFeedback'
//restrictions
const Empty = () => {
  const { t } = useTranslation()

  return (
    // <div className='mb-2 p-6 rounded-2xl bg-gray-50'>
       <div className='mb-2 p-6 rounded-2xl bg-gray-50 dark:bg-[#1A1A1A] dark:border-2 dark:border-[#3F3F3F] dark:border-solid dark:rounded-xl dark:shadow-sm dark:hover:bg-zinc-800 cursor-pointer dark:text-white '>
      {/* <div className='flex items-center justify-center mb-3 w-12 h-12 rounded-[10px] border border-[#EAECF5]'> */}
      <div className='flex items-center justify-center mb-3 w-12 h-12 rounded-[10px] border border-[#EAECF5] dark:border-[#3f3f3f] dark:bg-[#1A1A1A]'>
        <Webhooks className='w-6 h-6 text-gray-500' />
      </div>
      {/* <div className='mb-2 text-sm text-gray-600'>{t('common.apiBasedExtension.title')}</div> */}
      {/* <div className='mb-2 text-sm text-gray-600'>API extensions provide centralized API management, simplifying configuration for easy use across applications.</div> */}
      <div className='mb-2 text-sm text-gray-600 dark:text-white'>API extensions provide centralized API management, simplifying configuration for easy use across applications.</div>
      {/* <a
        className='flex items-center mb-2 h-[18px] text-xs text-primary-600'
        href={t('common.apiBasedExtension.linkUrl') || '/'}
        target='_blank' rel='noopener noreferrer'
      >
        <BookOpen01 className='mr-1 w-3 h-3' />
        {t('common.apiBasedExtension.link')}
      </a> */}
      {/* <div className='flex items-center text-xs font-medium text-gray-700'>
                <AlertTriangle className='mr-1 w-3 h-3 text-[#F79009]' />
                {t('common.modelProvider.notConfigured')}
              </div> */}
    </div>
  )
}

export default Empty
