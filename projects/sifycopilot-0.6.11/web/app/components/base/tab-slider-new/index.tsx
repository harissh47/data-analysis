import type { FC } from 'react'
import cn from 'classnames'

type Option = {
  value: string
  text: string
  icon?: React.ReactNode
}
type TabSliderProps = {
  className?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}
const TabSliderNew: FC<TabSliderProps> = ({
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={cn(className, 'relative flex')}>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] font-medium leading-[18px] cursor-pointer hover:bg-gray-200',
          //   value === option.value && 'bg-white border-gray-200 shadow-xs text-primary-600 hover:bg-white',
          // )
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer hover:bg-gray-200',
          //   value === option.value && 'bg-white border-gray-200  text-primary-600 hover:bg-white',
          // )}
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer hover:bg-gray-200 dark:text-whit-27',
          //   value === option.value && 'bg-white border-gray-200  text-primary-600 hover:bg-white dark:text-whit-27',
          // )}
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer hover:bg-gray-200 dark:text-whit-27 dark: bg-zinc-600 dark:text-white dark:hover:bg-zinc-800 ',
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer hover:bg-gray-200 dark:text-whit-27 dark: bg-zinc-600 dark:text-white dark:hover:bg-zinc-800',
          //   // value === option.value && 'bg-white border-gray-200  text-primary-600 hover:bg-white dark:text-whit-27',
          //   value === option.value && 'bg-white border-gray-200  text-primary-600 hover:bg-white dark:text-whit-27',
          // )}
          // className={cn(
          //   'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer',
          //   'bg-white hover:bg-gray-200 dark:bg-[#3f3f3f] dark:hover:bg-zinc-800 dark:text-white',
          //   value === option.value && 'border-gray-200 text-primary-600'
          // )}
          className={cn(
            'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] leading-[18px] cursor-pointer',
            'bg-[#F2F4F7] hover:bg-gray-200 dark:bg-[#202020] dark:hover:bg-zinc-800 dark:text-white',
            value === option.value && 'border-gray-200 text-primary-600 bg-white dark:bg-[#3f3f3f] '
          )}
          
        >
          {option.icon}
          {option.text}
        </div>
      ))}
    </div>
  )
}

export default TabSliderNew
