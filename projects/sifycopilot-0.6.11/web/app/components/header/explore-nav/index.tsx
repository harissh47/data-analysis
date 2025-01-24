'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from 'classnames'
import { Explore, ExploreActive } from '../../base/icons/src/public/header-nav/explore'
type ExploreNavProps = {
  className?: string
  isCollapsed?: boolean
}

const ExploreNav = ({
  className,
  isCollapsed,
}: ExploreNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const actived = selectedSegment === 'explore'
  // const actived = selectedSegment === 'Workspace'

  const WorkspaceIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className='mr-2 text-gray-800 dark:text-gray-200 fill-current'>
      <g id="SVGRepo_bgCarrier" strokeWidth="60%"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>{".a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;}"}</style>
        </defs>
        <path className="a" d="M35.5977,41.1513a15.3451,15.3451,0,0,0-11.6354-5.0854h-.0461a15.1449,15.1449,0,0,0-11.5,5.0693,3.936,3.936,0,0,1-5.9595-5.1431,23.0056,23.0056,0,0,1,17.4388-7.7985h.0669a24.4557,24.4557,0,0,1,4.6689.4475"></path>
        <path className="a" d="M6.8486,35.5977a15.3509,15.3509,0,0,0,5.0855-11.6815,15.1447,15.1447,0,0,0-5.0693-11.5,3.936,3.936,0,0,1,5.1431-5.96,23.0059,23.0059,0,0,1,7.7984,17.4389,24.4494,24.4494,0,0,1-.4475,4.7362"></path>
        <path className="a" d="M12.4023,6.8486A15.3448,15.3448,0,0,0,24.0377,11.934h.0461a15.1445,15.1445,0,0,0,11.5-5.0693,3.936,3.936,0,0,1,5.9595,5.1431,23.0056,23.0056,0,0,1-17.4388,7.7985h-.0669a24.4537,24.4537,0,0,1-4.6694-.4476"></path>
        <path className="a" d="M41.1514,12.4022a15.3509,15.3509,0,0,0-5.0855,11.6816,15.1449,15.1449,0,0,0,5.0693,11.5,3.936,3.936,0,1,1-5.1431,5.9595,23.0058,23.0058,0,0,1-7.7984-17.4389,24.4491,24.4491,0,0,1,.4475-4.7361"></path>
      </g>
    </svg>
  )
  const WorkspaceActiveIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className='text-gray-800 dark:text-gray-200 fill-current'>
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <defs>
          <style>{".a{fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;}"}</style>
        </defs>
        <path className="a" d="M35.5977,41.1513a15.3451,15.3451,0,0,0-11.6354-5.0854h-.0461a15.1449,15.1449,0,0,0-11.5,5.0693,3.936,3.936,0,0,1-5.9595-5.1431,23.0056,23.0056,0,0,1,17.4388-7.7985h.0669a24.4557,24.4557,0,0,1,4.6689.4475"></path>
        <path className="a" d="M6.8486,35.5977a15.3509,15.3509,0,0,0,5.0855-11.6815,15.1447,15.1447,0,0,0-5.0693-11.5,3.936,3.936,0,0,1,5.1431-5.96,23.0059,23.0059,0,0,1,7.7984,17.4389,24.4494,24.4494,0,0,1-.4475,4.7362"></path>
        <path className="a" d="M12.4023,6.8486A15.3448,15.3448,0,0,0,24.0377,11.934h.0461a15.1445,15.1445,0,0,0,11.5-5.0693,3.936,3.936,0,0,1,5.9595,5.1431,23.0056,23.0056,0,0,1-17.4388,7.7985h-.0669a24.4537,24.4537,0,0,1-4.6694-.4476"></path>
        <path className="a" d="M41.1514,12.4022a15.3509,15.3509,0,0,0-5.0855,11.6816,15.1449,15.1449,0,0,0,5.0693,11.5,3.936,3.936,0,1,1-5.1431,5.9595,23.0058,23.0058,0,0,1-7.7984-17.4389,24.4491,24.4491,0,0,1,.4475-4.7361"></path>
      </g>
    </svg>
  )

  return (
    // <Link href="/explore/apps" className={classNames(
    <Link href="/apps" className={classNames(
      // className, 'group',
      // className, 'flex items-center w-full h-9 px-3.5 cursor-pointer rounded-[10px] dark:hover:bg-gray-800 cursor-pointer dark:text-white ',
      className, 'flex items-center w-full h-9 px-3.5 cursor-pointer rounded-[10px] dark:hover:bg-zinc-800 cursor-pointer dark:text-white ',
      // actived && 'bg-white shadow-md',
      // actived ? 'text-primary-600' : 'text-gray-500 hover:bg-gray-200',
      actived && 'bg-gray-50 cursor-pointer',
      actived ? 'rounded-lg font-normal mb-2' : 'text-gray-500 hover:bg-gray-50 cursor-pointer mb-1',
      isCollapsed && 'justify-center px-2',
    )}>
      {
        actived
          // ? <ExploreActive className='mr-2 w-4 h-4' />
          ? <WorkspaceActiveIcon />
          // : <Explore className='mr-2 w-4 h-4' />
          : <WorkspaceIcon />
      }
      {/* {t('common.menus.explore')} */}
      {/* Workspace */}
      {!isCollapsed && <span> Workspace </span>}
    </Link>
  )
}

export default ExploreNav
