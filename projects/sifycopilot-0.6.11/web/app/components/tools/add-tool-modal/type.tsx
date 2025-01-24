'use client'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import { Exchange02, FileCode } from '@/app/components/base/icons/src/vender/line/others'

type Props = {
  value: string
  onSelect: (type: string) => void
}

const Types = ({
  value,
  onSelect,
}: Props) => {
  const { t } = useTranslation()

  return (
    <div className='mb-3'>
      <div className={cn('mb-0.5 p-1 pl-3 flex items-center cursor-pointer text-sm leading-5 rounded-lg hover:bg-white  dark:hover:bg-zinc-600', value === 'builtin' && '!bg-white dark:!bg-zinc-800 font-medium')} onClick={() => onSelect('builtin')}>
        {/* <div className="shrink-0 w-4 h-4 mr-2 bg-cover bg-no-repeat bg-[url('~@/app/components/tools/add-tool-modal/D.png')]" /> */}
        <div className="shrink-0 w-4 h-4 mr-2 mt-2 bg-contain bg-no-repeat bg-[url(/logo/logo-site.png)]" />
        <span className={cn('text-gray-700 dark:text-white', value === 'builtin' && '!text-primary-600')}>{t('tools.type.builtIn')}</span>
      </div>
      <div className={cn('mb-0.5 p-1 pl-3 flex items-center cursor-pointer text-gray-700 dark:text-white text-sm leading-5 rounded-lg hover:bg-white  dark:hover:bg-zinc-600', value === 'api' && '!bg-white dark:!bg-zinc-800 !text-primary-600 font-medium')} onClick={() => onSelect('api')}>
        <FileCode className='shrink-0 w-4 h-4 mr-2' />
        {t('tools.type.custom')}
      </div>
      <div className={cn('mb-0.5 p-1 pl-3 flex items-center cursor-pointer text-gray-700 dark:text-white text-sm leading-5 rounded-lg hover:bg-white  dark:hover:bg-zinc-600', value === 'workflow' && '!bg-white dark:!bg-zinc-800 !text-primary-600 font-medium')} onClick={() => onSelect('workflow')}>
        <Exchange02 className='shrink-0 w-4 h-4 mr-2' />
        {t('tools.type.workflow')}
      </div>
    </div>
  )
}
export default Types
