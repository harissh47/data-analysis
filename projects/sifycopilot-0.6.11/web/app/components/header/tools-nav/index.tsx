'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from 'classnames'
import { Tools, ToolsActive } from '../../base/icons/src/public/header-nav/tools'
type ToolsNavProps = {
  className?: string
  isCollapsed?: boolean
}

const ToolsNav = ({
  className,
  isCollapsed,
}: ToolsNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  // const actived = selectedSegment === 'tools'
  const actived = selectedSegment === 'app-fusion'

  const AppfusionIcon = () => (
    <svg fill="#667085" width="1rem" height="1rem" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#667085" strokeWidth="0.736" className='mr-2'>
      <path d="M29.532 25.76l-5.655-5.655 0.754-0.754-0.754-0.754-2.261 2.261-3.771-3.77 4.53-4.532c0.603 0.215 1.234 0.324 1.882 0.324 1.493 0 2.897-0.582 3.954-1.637 1.63-1.631 2.092-4.054 1.178-6.174l-0.311-0.722-2.43 2.43-1.956 0.027 0.026-1.866 2.477-2.477-0.72-0.312c-0.706-0.306-1.457-0.461-2.229-0.461-1.494 0-2.897 0.582-3.952 1.637-1.546 1.545-2.043 3.802-1.311 5.84l-4.529 4.529-6.409-6.408 0.754-0.754-4.145-4.146-2.264 2.261 4.147 4.147 0.753-0.754 6.409 6.408-4.529 4.529c-0.605-0.217-1.239-0.326-1.888-0.326-1.493 0-2.897 0.582-3.953 1.637-1.633 1.632-2.095 4.059-1.176 6.181l0.312 0.72 2.477-2.477 1.865-0.025-0.027 1.956-2.43 2.43 0.722 0.311c0.704 0.303 1.452 0.458 2.221 0.458 1.494 0 2.897-0.581 3.952-1.636 1.544-1.544 2.041-3.799 1.314-5.833l4.532-4.532 3.771 3.769-2.263 2.263 0.754 0.754 0.754-0.754 5.654 5.654c0.503 0.504 1.174 0.781 1.885 0.781s1.381-0.277 1.885-0.781c1.039-1.039 1.039-2.73-0-3.769zM3.899 4.648l0.754-0.753 2.638 2.638-0.754 0.754-2.639-2.639zM11.448 22.456c0.739 1.716 0.364 3.679-0.955 4.999-0.854 0.854-1.989 1.324-3.198 1.324-0.347 0-0.689-0.039-1.021-0.116l1.569-1.569 0.047-3.485-3.394 0.046-1.619 1.619c-0.356-1.51 0.081-3.103 1.208-4.229 0.854-0.854 1.99-1.325 3.199-1.325 0.626 0 1.233 0.125 1.806 0.373l0.333 0.144 10.819-10.819-0.144-0.333c-0.744-1.719-0.37-3.682 0.952-5.004 0.854-0.854 1.99-1.325 3.198-1.325 0.35 0 0.695 0.040 1.030 0.117l-1.618 1.618-0.047 3.394 3.485-0.047 1.57-1.57c0.352 1.507-0.086 3.097-1.209 4.221-0.855 0.854-1.991 1.325-3.2 1.325-0.624 0-1.23-0.125-1.801-0.371l-0.332-0.143-10.821 10.823 0.143 0.332zM28.779 28.775c-0.302 0.302-0.704 0.469-1.131 0.469s-0.829-0.167-1.131-0.469l-5.654-5.654 2.262-2.262 5.655 5.655c0.624 0.624 0.624 1.638 0.001 2.261z" />
    </svg>

  )
  const AppfusionActiveIcon = () => (
    <svg fill="#667085" width="1rem" height="1rem" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#667085" strokeWidth="0.288" className='mr-2'>
      <title>tools</title>
      <path d="M27.783 7.936c0.959 2.313 0.502 5.074-1.379 6.955-2.071 2.071-5.201 2.395-7.634 1.022l-1.759 1.921 1.255 1.26 0.75-0.75c0.383-0.384 1.005-0.384 1.388 0l6.082 6.144c0.384 0.383 0.384 1.005 0 1.388l-2.776 2.776c-0.383 0.384-1.005 0.384-1.388 0l-6.082-6.144c-0.384-0.383-0.384-1.005 0-1.388l0.685-0.685-1.196-1.199-8.411 9.189c-0.767 0.767-2.010 0.767-2.776 0l-0.694-0.694c-0.767-0.767-0.767-2.010 0-2.776l9.582-8.025-6.364-6.381-2.010-0.001-2.326-3.74 1.872-1.875 3.825 2.341 0.025 1.968 6.438 6.463 1.873-1.568c-1.831-2.496-1.64-6.012 0.616-8.268 1.872-1.872 4.618-2.337 6.925-1.396l-4.124 4.067 3.471 3.471 4.132-4.075zM6.15 25.934c-0.383-0.383-1.004-0.383-1.388 0-0.384 0.384-0.384 1.005 0 1.389 0.384 0.383 1.005 0.383 1.388 0 0.384-0.385 0.384-1.006 0-1.389z"></path>
    </svg>

  )

  return (
    // <Link href="/tools" className={classNames(
    <Link href="/app-fusion" className={classNames(
      // className, 'group',
      // className, 'flex items-center w-full h-9 px-3.5 cursor-pointer rounded-[10px] dark:hover:bg-gray-800 cursor-pointer dark:text-white ',
      className, 'flex items-center w-full h-9 px-3.5 cursor-pointer rounded-[10px] dark:hover:bg-gray-800 cursor-pointer  dark:hover:bg-zinc-800 cursor-pointer dark:text-white ',
      // actived && 'bg-white',
      actived && 'bg-gray-50 cursor-pointer dark:bg-zinc-600 ',
      // actived ? 'rounded-lg text-primary-600' : 'text-gray-500 hover:bg-gray-50 cursor-pointer mb-1',
      actived ? 'rounded-lg font-normal mb-2' : 'text-gray-500 hover:bg-gray-50 cursor-pointer mb-1',
      isCollapsed && 'justify-center px-2',
      // actived ? 'text-primary-600' : 'text-gray-500 hover:bg-gray-200',
    )}>


      {
        actived
          // ? <ToolsActive className='mr-2 w-4 h-4' />
          ? <AppfusionActiveIcon />
          // : <Tools className='mr-2 w-4 h-4' />
          : <AppfusionIcon />
      }
      {/* {t('common.menus.tools')} */}
      {/* App Fusion */}
      {!isCollapsed && <span> App Fusion </span>}
    </Link>
  )
}

export default ToolsNav

