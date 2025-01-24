'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import { flatten } from 'lodash-es'
import produce from 'immer'
import Nav from '../nav'
import { type NavItem } from '../nav/nav-selector'
import { Robot, RobotActive } from '../../base/icons/src/public/header-nav/studio'
import { fetchAppList } from '@/service/apps'
import CreateAppTemplateDialog from '@/app/components/app/create-app-dialog'
import CreateAppModal from '@/app/components/app/create-app-modal'
import CreateFromDSLModal from '@/app/components/app/create-from-dsl-modal'
import type { AppListResponse } from '@/models/app'
import { useAppContext } from '@/context/app-context'
import { useStore as useAppStore } from '@/app/components/app/store'

const getKey = (
  pageIndex: number,
  previousPageData: AppListResponse,
  activeTab: string,
  keywords: string,
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: any = { url: 'apps', params: { page: pageIndex + 1, limit: 30, name: keywords } }

    if (activeTab !== 'all')
      params.params.mode = activeTab
    else
      delete params.params.mode

    return params
  }
  return null
}

const AppNav = ({
  isCollapsed,
}: { isCollapsed: boolean }) => {
  const { t } = useTranslation()
  const { appId } = useParams()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const appDetail = useAppStore(state => state.appDetail)
  const [showNewAppDialog, setShowNewAppDialog] = useState(false)
  const [showNewAppTemplateDialog, setShowNewAppTemplateDialog] = useState(false)
  const [showCreateFromDSLModal, setShowCreateFromDSLModal] = useState(false)
  const [navItems, setNavItems] = useState<NavItem[]>([])

  const { data: appsData, setSize, mutate } = useSWRInfinite(
    appId
      ? (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData, 'all', '')
      : () => null,
    fetchAppList,
    { revalidateFirstPage: false },
  )

  const handleLoadmore = useCallback(() => {
    setSize(size => size + 1)
  }, [setSize])

  const openModal = (state: string) => {
    if (state === 'blank')
      setShowNewAppDialog(true)
    if (state === 'template')
      setShowNewAppTemplateDialog(true)
    if (state === 'dsl')
      setShowCreateFromDSLModal(true)
  }

  useEffect(() => {
    if (appsData) {
      const appItems = flatten(appsData?.map(appData => appData.data))
      const navItems = appItems.map((app) => {
        const link = ((isCurrentWorkspaceEditor, app) => {
          if (!isCurrentWorkspaceEditor) {
            return `/app/${app.id}/overview`
          }
          else {
            if (app.mode === 'workflow' || app.mode === 'advanced-chat')
              return `/app/${app.id}/workflow`
            else
              return `/app/${app.id}/configuration`
          }
        })(isCurrentWorkspaceEditor, app)
        return {
          id: app.id,
          icon: app.icon,
          icon_background: app.icon_background,
          name: app.name,
          mode: app.mode,
          link,
        }
      })
      setNavItems(navItems)
    }
  }, [appsData, isCurrentWorkspaceEditor, setNavItems])

  // update current app name
  useEffect(() => {
    if (appDetail) {
      const newNavItems = produce(navItems, (draft: NavItem[]) => {
        navItems.forEach((app, index) => {
          if (app.id === appDetail.id)
            draft[index].name = appDetail.name
        })
      })
      setNavItems(newNavItems)
    }
  }, [appDetail, navItems])

  const StudioIcon = () => (
    <svg fill="#currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" className="text-gray-800 dark:text-gray-200 fill-current">
      <g strokeWidth="2"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g> <path d="M300 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 1 0 120 0 60 60 0 1 0-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></g>
    </svg>
  )
  const StudioActiveIcon = () => (
    <svg fill="#currentColor" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" className='text-gray-800 dark:text-gray-200 fill-current'>
      <g strokeWidth="2"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g><path d="M852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zM300 328c0-33.1 26.9-60 60-60s60 26.9 60 60-26.9 60-60 60-60-26.9-60-60z m372 248c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-60c0-4.4 3.6-8 8-8h304c4.4 0 8 3.6 8 8v60z m-8-188c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60zM799 864H225c-13.8 0-25 14.3-25 32v56c0 4.4 2.8 8 6.2 8h611.5c3.4 0 6.2-3.6 6.2-8v-56c0.1-17.7-11.1-32-24.9-32z" /></g>
    </svg>


  )

  return (
    <>
    <Nav
       isApp
        icon={<StudioIcon />}
        activeIcon={<StudioActiveIcon />}
        text={!isCollapsed ? 'Lab' : ''}
        activeSegment={['apps', 'app']}
        link="/apps"
        curNav={appDetail}
        navs={navItems}
        createText={!isCollapsed ? t('common.menus.newApp') : ''}
        onCreate={openModal}
        onLoadmore={handleLoadmore}
        // collapsed={isCollapsed} 
        collapsed={isCollapsed} 


      />
      <CreateAppModal
        show={showNewAppDialog}
        onClose={() => setShowNewAppDialog(false)}
        onSuccess={() => mutate()}
      />
      <CreateAppTemplateDialog
        show={showNewAppTemplateDialog}
        onClose={() => setShowNewAppTemplateDialog(false)}
        onSuccess={() => mutate()}
      />
      <CreateFromDSLModal
        show={showCreateFromDSLModal}
        onClose={() => setShowCreateFromDSLModal(false)}
        onSuccess={() => mutate()}
      />
    </>
  )
}

export default AppNav
