'use client'
import classNames from 'classnames'
import { usePathname } from 'next/navigation'
import s from './index.module.css'

type HeaderWrapperProps = {
  children: React.ReactNode
}

const HeaderWrapper = ({
  children,
}: HeaderWrapperProps) => {
  const pathname = usePathname()
  // const isBordered = ['/apps', '/datasets', '/datasets/create', '/tools'].includes(pathname)
  const isBordered = ['/apps', '/data-mind', '/data-mind/create', '/app-fusion'].includes(pathname)

  return (
    // <div className={classNames(
    //   'sticky top-0 left-0 right-0 z-30 flex flex-col bg-gray-100 grow-0 shrink-0 basis-auto min-h-[56px]',
    //   s.header,
    //   isBordered ? 'border-b border-gray-200' : '',
    // )}
    <div className={classNames(
      // 'fixed top-0 left-0 flex flex-col h-full w-20rem bg-black z-30',
      // 'top-0 left-0 flex flex-col h-screen grow-0 shrink-0 basis-auto overflow-y-hidden w-56 bg-gray-100',
      'top-0 left-0 flex flex-col h-screen grow-0 shrink-0 basis-auto overflow-hidden w-50 bg-gray-100',
      s.header,
      // isBordered ? 'border-r border-gray-300' : '',
      isBordered ? '' : '',
    )}
    >
      {children}
    </div>
  )
}
export default HeaderWrapper
