import classNames from 'classnames'
import type { FC, ReactNode } from 'react'

type ModelBadgeProps = {
  className?: string
  children?: ReactNode
}
const ModelBadge: FC<ModelBadgeProps> = ({
  className,
  children,
}) => {
  return (
    <div className={classNames(
      'flex items-center px-1 h-[18px] rounded-[5px] border border-[#4CAF50] bg-white/[0.48] dark:bg-[#5F5F5F] text-[10px] font-medium text-[#8AB40A] dark:text-[#8AB40A] cursor-default',
      
      

      className,
    )}>
      {children}
    </div>
  )
}

export default ModelBadge
