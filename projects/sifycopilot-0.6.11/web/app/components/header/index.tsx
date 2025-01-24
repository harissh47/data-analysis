'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useBoolean } from 'ahooks'
import { usePathname, useSelectedLayoutSegment } from 'next/navigation'
import { Bars3Icon } from '@heroicons/react/20/solid'
import HeaderBillingBtn from '../billing/header-billing-btn'
import AccountDropdown from './account-dropdown'
import AppNav from './app-nav'
import DatasetNav from './dataset-nav'
import EnvNav from './env-nav'
import ExploreNav from './explore-nav'
import ToolsNav from './tools-nav'
import GithubStar from './github-star'
import { WorkspaceProvider } from '@/context/workspace-context'
import { useAppContext } from '@/context/app-context'
import LogoSite from '@/app/components/base/logo/logo-site'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useProviderContext } from '@/context/provider-context'
import { useModalContext } from '@/context/modal-context'
import { SidebarProps } from '../base/chat/chat-with-history/sidebar'
import { AlignLeft01, AlignRight01 } from '../base/icons/src/vender/line/layout'

const navClassName = `
  flex items-center relative mr-0 sm:mr-3 px-3 h-8 rounded-xl
   text-sm
  cursor-pointer
`

// const Header = () => {
const Header: React.FC<SidebarProps> = ({ toggleCollapse }) => {
  const { isCurrentWorkspaceEditor } = useAppContext()

  const selectedSegment = useSelectedLayoutSegment()
  // const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false)
  const { enableBilling, plan } = useProviderContext()
  const { setShowPricingModal, setShowAccountSettingModal } = useModalContext()
  const isFreePlan = plan.type === 'sandbox'

  const handlePlanClick = useCallback(() => {
    if (isFreePlan)
      setShowPricingModal()
    else
      setShowAccountSettingModal({ payload: 'billing' })
  }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal])

  const { AccountButtons, UserProfile } = AccountDropdown({ isMobile })


  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    if (!isMobile)
      setIsCollapsed(!isCollapsed)
    else
      // toggleCollapse()
      setIsCollapsed(prev => !prev)
  }

  // const toggleTheme = () => {
  //   const html = document.documentElement
  //   if (isDarkMode) {
  //     html.classList.remove('dark')
  //     localStorage.setItem('theme', 'light')
  //   }
  //   else {
  //     html.classList.add('dark')
  //     localStorage.setItem('theme', 'dark')
  //   }
  //   setIsDarkMode(!isDarkMode)
  // }

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme')
  //   if (savedTheme === 'dark') {
  //     document.documentElement.classList.add('dark')
  //     setIsDarkMode(true)
  //   }
  // }, [])

  useEffect(() => {
    hideNavMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSegment])

  useEffect(() => {
    if (pathname === '/apps')
      setIsCollapsed(false)
    else
      setIsCollapsed(true)
  }, [pathname])

  return (
    // <div className='flex flex-col h-full px-1 py-2'>

    // <div className={`flex flex-col h-full px-1 py-2 transition-width duration-300 ${isCollapsed ? 'w-[60px]' : 'w-[240px]'} border-r border-gray-300 `}>
    <div className={`flex flex-col h-full px-1 py-2 transition-width duration-300 dark:bg-[#202020] dark:text-whit-27 ${isCollapsed ? 'w-[60px]' : 'w-[240px]'} border-r border-gray-300 dark:border-[#3F3F3F] `}>
      {/* <div className='flex flex-col h-full px-1 py-2'> */}
      <div className={`flex items-center relative ${isCollapsed ? 'flex-col' : 'flex-row'}`}>
        {/* {isMobile && <div
          className='flex items-center justify-center h-8 w-8 cursor-pointer'
          onClick={toggle}
        >
          <Bars3Icon className="h-4 w-4 text-gray-500" />
        </div>} */}
        {!isMobile && <>
          {/* <Link href="/apps" className='flex items-center mr-4 ml-3 my-2'> */}
          <Link href="/apps" className={`flex items-center my-2 `}>
            {/* <LogoSite className='object-contain' /> */}
            {<LogoSite className={`object-contain ${isCollapsed ? 'h-10 w-32' : ''}`} />}
          </Link>
        </>}
        {/* <div className={`flex cursor-pointer z-1 ${isCollapsed ? 'items-center m-0 py-2' : 'items-right ml-auto p-2'}`} onClick={handleToggleCollapse}> */}
        <div className={`flex cursor-pointer z-1 ${isCollapsed ? 'items-center my-2 py-2 mr-2' : 'items-right ml-auto p-2'}`} onClick={handleToggleCollapse}>
          {isCollapsed ? (
            <AlignRight01 className='w-[14px] h-[14px] dark:white' />
          ) : (
            <AlignLeft01 className='w-[14px] h-[14px] dark:white' />
          )}
        </div>
      </div>
      {/* {isMobile && (
        <div className='flex'>
          <Link href="/apps" className='flex items-center mr-4'> */}
      {/* <LogoSite /> */}
      {/* <LogoSite className={`object-contain ${isCollapsed ? 'h-4 w-16' : ''}`} />
          </Link>
        </div>
      )} */}

      {isMobile && <>
        {/* <div className='flex'> */}
        <Link href="/apps" className='flex items-center my-2'>
          {/* <LogoSite /> */}
          <LogoSite className={`object-contain ${!isCollapsed ? '' : ''}`} />
        </Link>
        {/* </div> */}
      </>
      }
      {!isMobile && (
        <div className='flex flex-col items-start py-2'>
          {/* <div className={`flex flex-col items-start py-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* <ExploreNav className={navClassName} /> */}
          {/* <AppNav />
          {isCurrentWorkspaceEditor && <DatasetNav />}
          <ToolsNav className={navClassName} /> */}
          <ExploreNav className={navClassName} isCollapsed={isCollapsed} />
          <AppNav isCollapsed={isCollapsed} />
          {isCurrentWorkspaceEditor && <DatasetNav isCollapsed={isCollapsed} />}

          <ToolsNav className={navClassName} isCollapsed={isCollapsed} />
        </div>
      )}
      {/* {(isMobile && isShowNavMenu) && ( */}
      {(isMobile) && (
        <div className='flex flex-col p-2 gap-y-1'>
          {/* <ExploreNav className={navClassName} />
          <AppNav />
          {isCurrentWorkspaceEditor && <DatasetNav />}
          <ToolsNav className={navClassName} /> */}
          <ExploreNav className={navClassName} isCollapsed={isCollapsed} />
          <AppNav isCollapsed={isCollapsed} />
          {isCurrentWorkspaceEditor && <DatasetNav isCollapsed={isCollapsed} />}

          <ToolsNav className={navClassName} isCollapsed={isCollapsed} />
        </div>
      )}
      <div className='grow' />
      {/* <div className='flex flex-col pl-1 items-center'> */}
      {/* <div className={`flex flex-col pl-1 items-center transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}> */}
      {/* <div className={`flex flex-col items-start py-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <WorkspaceProvider>
          <AccountDropdown isMobile={isMobile} />
        </WorkspaceProvider>
      </div> */}
      <div className={`flex flex-col items-start py-2 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <WorkspaceProvider>
          <div className='w-full'><AccountButtons /></div>
          <div className='w-full mt-2 border-t border-gray-200 dark:border-[#3F3F3F]'><UserProfile /></div>
        </WorkspaceProvider>
      </div>
    </div>

  )
}
export default Header

// 'use client'
// import { useCallback, useEffect } from 'react'
// import Link from 'next/link'
// import { useBoolean } from 'ahooks'
// import { useSelectedLayoutSegment } from 'next/navigation'
// import { Bars3Icon } from '@heroicons/react/20/solid'
// import HeaderBillingBtn from '../billing/header-billing-btn'
// import AccountDropdown from './account-dropdown'
// import AppNav from './app-nav'
// import DatasetNav from './dataset-nav'
// import EnvNav from './env-nav'
// import ExploreNav from './explore-nav'
// import ToolsNav from './tools-nav'
// import GithubStar from './github-star'
// import { WorkspaceProvider } from '@/context/workspace-context'
// import { useAppContext } from '@/context/app-context'
// import LogoSite from '@/app/components/base/logo/logo-site'
// import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
// import { useProviderContext } from '@/context/provider-context'
// import { useModalContext } from '@/context/modal-context'

// const navClassName = `
//   flex items-center relative mr-0 sm:mr-3 px-3 h-8 rounded-xl
//   font-medium text-sm
//   cursor-pointer
// `

// const Header = () => {
//   const { isCurrentWorkspaceEditor } = useAppContext()

//   const selectedSegment = useSelectedLayoutSegment()
//   const media = useBreakpoints()
//   const isMobile = media === MediaType.mobile
//   const [isShowNavMenu, { toggle, setFalse: hideNavMenu }] = useBoolean(false)
//   const { enableBilling, plan } = useProviderContext()
//   const { setShowPricingModal, setShowAccountSettingModal } = useModalContext()
//   const isFreePlan = plan.type === 'sandbox'
//   const handlePlanClick = useCallback(() => {
//     if (isFreePlan)
//       setShowPricingModal()
//     else
//       setShowAccountSettingModal({ payload: 'billing' })
//   }, [isFreePlan, setShowAccountSettingModal, setShowPricingModal])

//   useEffect(() => {
//     hideNavMenu()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedSegment])
//   return (
//     // <div className='flex flex-1 items-center justify-between px-4'>
//     <div className='flex flex-col h-full px-1 py-2'>
//       <div className='flex items-center'>
//         {isMobile && <div
//           className='flex items-center justify-center h-8 w-8 cursor-pointer'
//           onClick={toggle}
//         >
//           <Bars3Icon className="h-4 w-4 text-gray-500" />
//         </div>}
//         {!isMobile && <>
//           <Link href="/apps" className='flex items-center mr-4'>
//             <LogoSite className='object-contain' />
//           </Link>
//           {/* <GithubStar /> */}
//         </>}
//       </div>
//       {isMobile && (
//         <div className='flex'>
//           <Link href="/apps" className='flex items-center mr-4'>
//             <LogoSite />
//           </Link>
//           {/* <GithubStar /> */}
//         </div>
//       )}
//       {!isMobile && (
//         // <div className='flex items-center'>
//         <div className='flex flex-col items-start py-2'>
//           <ExploreNav className={navClassName} />  
//           {/* <Link href='/apps'><div className="
//             flex items-center h-7 px-2.5 cursor-pointer rounded-[10px]
//             text-gray-500 font-medium
//             undefined
//           ">Workspace</div></Link> */}
//           <AppNav />
//           {isCurrentWorkspaceEditor && <DatasetNav />}
//           <ToolsNav className={navClassName} />
//         </div>
//       )}
//       {/* <div className='flex items-center flex-shrink-0'> */}
//       <div className='grow' />
//       <div className='flex flex-col items-center flex-shrink-0 self-end'>
//         {/* <EnvNav />
//         {enableBilling && (
//           <div className='mr-3 select-none'>
//             <HeaderBillingBtn onClick={handlePlanClick} />
//           </div>
//         )} */}
//         <WorkspaceProvider>
//           <AccountDropdown isMobile={isMobile} />
//         </WorkspaceProvider>
//       </div>
//       {(isMobile && isShowNavMenu) && (
//         // <div className='w-full flex flex-col p-2 gap-y-1'>
//         <div className='flex flex-col p-2 gap-y-1'>
//           <ExploreNav className={navClassName} />
//           <AppNav />
//           {isCurrentWorkspaceEditor && <DatasetNav />}
//           <ToolsNav className={navClassName} />
//         </div>
//       )}
//     </div>
//   )
// }
// export default Header
