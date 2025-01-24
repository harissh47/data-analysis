'use client'

import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import { useTranslation } from 'react-i18next'
import { useDebounceFn } from 'ahooks'
import AppCard from './AppCard'
import NewAppCard from './NewAppCard'
import useAppsQueryState from './hooks/useAppsQueryState'
import type { AppListResponse } from '@/models/app'
import { fetchAppList } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { CheckModal } from '@/hooks/use-pay'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import SearchInput from '@/app/components/base/search-input'
import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
import TagManagementModal from '@/app/components/base/tag-management'
import TagFilter from '@/app/components/base/tag-management/filter'
import cn from 'classnames'
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid'

type ThemeStyles = {
  background: string;
  text: string;
  icon: string;
  card: string;
};

export type ThemeContextType = {
  themeStyles: ThemeStyles;
  toggleTheme: () => void;
  isDarkMode: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const getKey = (
  pageIndex: number,
  previousPageData: AppListResponse,
  activeTab: string,
  tags: string[],
  keywords: string,
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: any = { url: 'apps', params: { page: pageIndex + 1, limit: 30, name: keywords } }

    if (activeTab !== 'all')
      params.params.mode = activeTab
    else
      delete params.params.mode

    if (tags.length)
      params.params.tag_ids = tags

    return params
  }
  return null
}

function AppsContent() {
  const { t } = useTranslation()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
  const [activeTab, setActiveTab] = useTabSearchParams({ defaultTab: 'all' })
  const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
  const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
  const [searchKeywords, setSearchKeywords] = useState(keywords)
  const { themeStyles, toggleTheme, isDarkMode } = useContext(ThemeContext)
  
  const setKeywords = useCallback((keywords: string) => {
    setQuery(prev => ({ ...prev, keywords }))
  }, [setQuery])
  
  const setTagIDs = useCallback((tagIDs: string[]) => {
    setQuery(prev => ({ ...prev, tagIDs }))
  }, [setQuery])

  const { data, isLoading, setSize, mutate } = useSWRInfinite(
    (pageIndex: number, previousPageData: AppListResponse) => 
      getKey(pageIndex, previousPageData, activeTab, tagIDs, searchKeywords),
    fetchAppList,
    { revalidateFirstPage: true },
  )

  const RoboIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
      <path d="M1 3a2 2 0 012-2h6.5a2 2 0 012 2v6.5a2 2 0 01-2 2H7v4.063C7 16.355 7.644 17 8.438 17H12.5v-2.5a2 2 0 012-2H21a2 2 0 012 2V21a2 2 0 01-2 2h-6.5a2 2 0 01-2-2v-2.5H8.437A2.938 2.938 0 015.5 15.562V11.5H3a2 2 0 01-2-2V3zm2-.5a.5.5 0 00-.5.5v6.5a.5.5 0 00.5.5h6.5a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H3zM14.5 14a.5.5 0 00-.5.5V21a.5.5 0 00.5.5H21a.5.5 0 00.5-.5v-6.5a.5.5 0 00-.5-.5h-6.5z" />
    </svg>
  )

  const AgentIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
      <path d="M24 21.987c-4.962 0-9-4.934-9-11 0-.236.01-.463.021-.688a.988.988 0 011.048-.95 1 1 0 01.95 1.047c-.01.195-.019.388-.019.591 0 4.963 3.14 9 7 9s7-4.037 7-9c0-.2-.009-.4-.019-.591a1 1 0 012-.1c.011.225.021.452.021.688C33 17.053 28.962 21.987 24 21.987zM43 47.987H5a1 1 0 01-1-1v-3a20 20 0 0140 0v3a1 1 0 01-1 1zm-37-2H42v-2a18 18 0 10-36 0v2z" />
      <path d="M24 11.987a46.835 46.835 0 01-8.159-.655C11.912 10.639 10 9.544 10 7.987 10 6.61 11.5 5.6 14.566 4.9A8.259 8.259 0 0116.115 2.36 7.226 7.226 0 0121.42-.013h5.15a7.433 7.433 0 016.849 4.9C36.5 5.6 38 6.617 38 7.987c0 1.557-1.912 2.652-5.846 3.345A46.734 46.734 0 0124 11.987zm-11.936-4c.308.291 1.407.895 4.13 1.376A44.894 44.894 0 0024 9.987a44.792 44.792 0 007.8-.624c2.725-.48 3.824-1.084 4.134-1.376a8.17 8.17 0 00-3.477-1.26 1 1 0 01-.753-.683A5.5 5.5 0 0026.57 1.987H21.42a5.234 5.234 0 00-3.83 1.724 6.17 6.17 0 00-1.3 2.333 1 1 0 01-.76.694A8.018 8.018 0 0012.064 7.987zm23.956.1h0zM21 15.987H20a2 2 0 010-4h1a2 2 0 010 4zm0-2h0zM28 15.987H27a2 2 0 010-4h1a2 2 0 010 4zm0-2h0zM5.71 39.987a1.017 1.017 0 01-1.02-1 .983.983 0 01.98-1A6.306 6.306 0 0012 31.7V28.508a1 1 0 112 0V31.7A8.3 8.3 0 015.71 39.987zM42.33 39.987A8.308 8.308 0 0134 31.7V28.508a1 1 0 112 0V31.7a6.3 6.3 0 006.29 6.29 1.018 1.018 0 011.02 1 .983.983 0 01-.98 1zM24 35.987a8.009 8.009 0 01-8-8v-1.66a1 1 0 112 0v1.66a6 6 0 1012 0v-1.66a1 1 0 112 0v1.66a8 8 0 01-8 8z" />
    </svg>
  )

  const WorkflowIcon = () => (
    <svg width="14px" height="14px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
      <path fillRule="evenodd" d="M1 3a2 2 0 012-2h6.5a2 2 0 012 2v6.5a2 2 0 01-2 2H7v4.063C7 16.355 7.644 17 8.438 17H12.5v-2.5a2 2 0 012-2H21a2 2 0 012 2V21a2 2 0 01-2 2h-6.5a2 2 0 01-2-2v-2.5H8.437A2.938 2.938 0 015.5 15.562V11.5H3a2 2 0 01-2-2V3zm2-.5a.5.5 0 00-.5.5v6.5a.5.5 0 00.5.5h6.5a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H3zM14.5 14a.5.5 0 00-.5.5V21a.5.5 0 00.5.5H21a.5.5 0 00.5-.5v-6.5a.5.5 0 00-.5-.5h-6.5z" />
    </svg>
  )

  const AllIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg" className='mr-2'>
      <path d="M34.5,27.568c0,3.828-3.104,6.932-6.932,6.932H10.432c-3.828,0-6.932-3.104-6.932-6.932V10.432C3.5,6.604,6.604,3.5,10.432,3.5h17.137c3.828,0,6.932,3.104,6.932,6.932V27.568z M30.5,10.432c0-1.619-1.313-2.932-2.932-2.932H10.432C8.813,7.5,7.5,8.813,7.5,10.432v17.137c0,1.619,1.313,2.932,2.932,2.932h17.137c1.619,0,2.932-1.313,2.932-2.932V10.432z" />
      <path d="M11.5,19.5c-0.553,0-1-0.447-1-1v-1.802c0-2.77,1.848-5.198,4.389-5.198h6.23c0.552,0,1,0.447,1,1s-0.448,1-1,1h-6.23c-1.56,0-2.389,1.72-2.389,3.198V18.5C12.5,19.053,12.052,19.5,11.5,19.5z" />
      <path d="M11.119,22.93c-0.261,0-0.521-0.11-0.71-0.29c-0.181-0.189-0.29-0.45-0.29-0.71s0.109-0.52,0.29-0.71c0.38-0.37,1.039-0.37,1.42,0c0.18,0.19,0.29,0.45,0.29,0.71s-0.11,0.521-0.29,0.7C11.639,22.819,11.379,22.93,11.119,22.93z" />
      <path d="M68.5,27.568c0,3.828-3.104,6.932-6.932,6.932H44.432c-3.828,0-6.932-3.104-6.932-6.932V10.432c0-3.828,3.104-6.932,6.932-6.932h17.137c3.828,0,6.932,3.104,6.932,6.932V27.568z M64.5,10.432c0-1.619-1.313-2.932-2.932-2.932H44.432c-1.619,0-2.932,1.313-2.932,2.932v17.137c0,1.619,1.313,2.932,2.932,2.932h17.137c1.619,0,2.932-1.313,2.932-2.932V10.432z" />
      <path d="M34.5,61.568c0,3.828-3.104,6.932-6.932,6.932H10.432c-3.828,0-6.932-3.104-6.932-6.932V44.432c0-3.828,3.104-6.932,6.932-6.932h17.137c3.828,0,6.932,3.104,6.932,6.932V61.568z M30.5,44.432c0-1.619-1.313-2.932-2.932-2.932H10.432c-1.619,0-2.932,1.313-2.932,2.932v17.137c0,1.619,1.313,2.932,2.932,2.932h17.137c1.619,0,2.932-1.313,2.932-2.932V44.432z" />
      <path d="M68.5,61.568c0,3.828-3.104,6.932-6.932,6.932H44.432c-3.828,0-6.932-3.104-6.932-6.932V44.432c0-3.828,3.104-6.932,6.932-6.932h17.137c3.828,0,6.932,3.104,6.932,6.932V61.568z M64.5,44.432c0-1.619-1.313-2.932-2.932-2.932H44.432c-1.619,0-2.932,1.313-2.932,2.932v17.137c0,1.619,1.313,2.932,2.932,2.932h17.137c1.619,0,2.932-1.313,2.932-2.932V44.432z" />
    </svg>
  )

  const options = [
    { value: 'chat', text: t('app.types.chatbot'), icon: <RoboIcon /> },
    { value: 'agent-chat', text: t('app.types.agent'), icon: <AgentIcon /> },
    { value: 'workflow', text: t('app.types.workflow'), icon: <WorkflowIcon /> },
    { value: 'all', text: 'All', icon: <AllIcon /> }
  ]

  const anchorRef = useRef<HTMLDivElement>(null)
  const hasMore = data?.at(-1)?.has_more ?? true

  useEffect(() => {
    document.title = `${t('common.menus.apps')}`
    if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
      localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
      mutate()
    }
  }, [mutate, t])

  useEffect(() => {
    let observer: IntersectionObserver | undefined
    if (anchorRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore)
          setSize((size: number) => size + 1)
      }, { rootMargin: '100px' })
      observer.observe(anchorRef.current)
    }
    return () => observer?.disconnect()
  }, [isLoading, setSize, hasMore])

  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })

  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }

  const { run: handleTagsUpdate } = useDebounceFn(() => {
    setTagIDs(tagFilterValue)
  }, { wait: 500 })

  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    handleTagsUpdate()
  }

  const handleTabSelect = (value: string) => {
    setActiveTab(activeTab === value ? '' : value)
  }

  return (
    <>
      <div className={`sticky top-0 flex justify-between items-center pt-4 px-2 sm:px-12 pb-2 leading-[56px] z-10 flex-wrap gap-y-2 ${themeStyles.background}`}>
        <div className="flex items-center gap-2">
          <NewAppCard onSuccess={mutate} />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <button onClick={toggleTheme} className="p-2 rounded-full">
              {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-gray-500" />}
            </button>
          </div>
          <div className="transition-colors duration-100 hover:bg-white-200 p-1 rounded">
            <TagFilter
              type="app"
              value={tagFilterValue}
              onChange={handleTagsChange}
            />
          </div>
          <div className="transition-colors duration-100 hover:none p-1 rounded">
            <SearchInput
              className="w-[200px]"
              value={keywords}
              onChange={handleKeywordsChange}
            />
          </div>
        </div>
      </div>

      <div className={`${themeStyles.background} ${themeStyles.text}`}>
        {options.map((option) => (
          <div key={option.value}>
            <div className="flex px-12 py-1 items-center">
              {activeTab !== option.value && (
                <svg viewBox="64 64 896 896" className="cursor-pointer w-[0.75em] h-[0.75em]" onClick={() => handleTabSelect(option.value)}>
                  <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
                </svg>
              )}
              {activeTab === option.value && (
                <svg className="rotate-90 cursor-pointer w-[0.75em] h-[0.75em]" viewBox="64 64 896 896" onClick={() => handleTabSelect(option.value)}>
                  <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" />
                </svg>
              )}
              <div className={cn(
                'flex ml-2 items-center px-2.5 py-2 rounded-lg border-[0.5px] border-transparent text-[13px] leading-[18px] cursor-pointer hover:bg-gray-200',
                activeTab === option.value && 'bg-white border-gray-200 shadow-xs text-primary-600 hover:bg-white',
                themeStyles.icon
              )} onClick={() => handleTabSelect(option.value)}>
                {option.icon}
                <span>{option.text}</span>
              </div>
            </div>
            {activeTab === option.value && (
              <nav className="grid content-start grid-cols-1 gap-4 mb-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0">
                {isLoading ? (
                  <div className="col-span-full flex justify-center items-center p-4">Loading...</div>
                ) : data?.flatMap(({ data: apps }: any) => apps).length === 0 ? (
                  <div className="col-span-full flex justify-center items-center p-4">No apps available</div>
                ) : (
                  data?.flatMap(({ data: apps }: any) => apps).map((app: any) => (
                    <AppCard key={app.id} app={app} onRefresh={mutate} />
                  ))
                )}
                <CheckModal />
              </nav>
            )}
          </div>
        ))}
      </div>

      <div ref={anchorRef} className="h-0"></div>
      {showTagManagementModal && <TagManagementModal type="app" show={showTagManagementModal} />}
    </>
  )
}

export default function Apps() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [themeStyles, setThemeStyles] = useState<ThemeStyles>({
    background: 'bg-gray-100',
    text: 'text-[#000000]',
    icon: 'text-[#333333]',
    card: 'bg-white',
  })

  const toggleTheme = () => {
    const html = document.documentElement
    const newIsDarkMode = !isDarkMode
    setIsDarkMode(newIsDarkMode)
    
    if (newIsDarkMode) {
      html.classList.add('dark')
      setThemeStyles({
        background: 'bg-[#2196f3]', //change the color here alone 
        text: 'text-[#00FF00]',
        icon: 'text-[#FFFFFF]',
        card: 'bg-[#202020]',
      })
    } else {
      html.classList.remove('dark')
      setThemeStyles({
        background: 'bg-gray-100',
        text: 'text-[#000000]',
        icon: 'text-[#333333]',
        card: 'bg-white',
      })
    }
    // localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light')
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
      setThemeStyles({
        background: 'bg-[#8F00FF]',
        text: 'text-[#FF0000]',
        icon: 'text-[#FFFFFF]',
        card: 'bg-[#202020]',
      })
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ themeStyles, toggleTheme, isDarkMode }}>
      <AppsContent />
    </ThemeContext.Provider>
  )
}
































// 'use client'

// import { useCallback, useEffect, useRef, useState } from 'react'
// import useSWRInfinite from 'swr/infinite'
// import { useTranslation } from 'react-i18next'
// import { useDebounceFn } from 'ahooks'
// import AppCard from './AppCard'
// import NewAppCard from './NewAppCard'
// import useAppsQueryState from './hooks/useAppsQueryState'
// import type { AppListResponse } from '@/models/app'
// import { fetchAppList } from '@/service/apps'
// import { useAppContext } from '@/context/app-context'
// import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
// import { CheckModal } from '@/hooks/use-pay'
// import TabSliderNew from '@/app/components/base/tab-slider-new'
// import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
// import { DotsGrid } from '@/app/components/base/icons/src/vender/line/general'
// import {
//   ChatBot,
//   CuteRobot,
// } from '@/app/components/base/icons/src/vender/line/communication'
// import { Route } from '@/app/components/base/icons/src/vender/line/mapsAndTravel'
// import SearchInput from '@/app/components/base/search-input'
// import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
// import TagManagementModal from '@/app/components/base/tag-management'
// import TagFilter from '@/app/components/base/tag-management/filter'
// import cn from 'classnames'

// const getKey = (
//   pageIndex: number,
//   previousPageData: AppListResponse,
//   activeTab: string,
//   tags: string[],
//   keywords: string,
// ) => {
//   if (!pageIndex || previousPageData.has_more) {
//     const params: any = { url: 'apps', params: { page: pageIndex + 1, limit: 30, name: keywords } }

//     if (activeTab !== 'all')
//       params.params.mode = activeTab
//     else
//       delete params.params.mode

//     if (tags.length)
//       params.params.tag_ids = tags

//     return params
//   }
//   return null
// }

// const Apps = () => {
//   const { t } = useTranslation()
//   const { isCurrentWorkspaceEditor } = useAppContext()
//   const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
//   // const [activeTab, setActiveTab] = useTabSearchParams({
//   //   defaultTab: 'all',
//   // })
//   const [activeTab, setActiveTab] = useTabSearchParams({
//     defaultTab: 'chat',
//   })
//   const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
//   const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
//   const [searchKeywords, setSearchKeywords] = useState(keywords)
//   const setKeywords = useCallback((keywords: string) => {
//     setQuery(prev => ({ ...prev, keywords }))
//   }, [setQuery])
//   const setTagIDs = useCallback((tagIDs: string[]) => {
//     setQuery(prev => ({ ...prev, tagIDs }))
//   }, [setQuery])

//   const { data, isLoading, setSize, mutate } = useSWRInfinite(
//     (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData, activeTab, tagIDs, searchKeywords),
//     fetchAppList,
//     { revalidateFirstPage: true },
//   )

//   const anchorRef = useRef<HTMLDivElement>(null)
//   const options = [
//     // { value: 'all', text: t('app.types.all'), icon: <DotsGrid className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'chat', text: t('app.types.chatbot'), icon: <ChatBot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'agent-chat', text: t('app.types.agent'), icon: <CuteRobot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'workflow', text: t('app.types.workflow'), icon: <Route className='w-[14px] h-[14px] mr-1' /> },
//   ]

//   useEffect(() => {
//     console.log(data)
//     // document.title = `${t('common.menus.apps')} -  Dify`
//     document.title = `${t('common.menus.apps')}`
//     if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
//       localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
//       mutate()
//     }
//   }, [])

//   const hasMore = data?.at(-1)?.has_more ?? true
//   useEffect(() => {
//     let observer: IntersectionObserver | undefined
//     if (anchorRef.current) {
//       observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && !isLoading && hasMore)
//           setSize((size: number) => size + 1)
//       }, { rootMargin: '100px' })
//       observer.observe(anchorRef.current)
//     }
//     return () => observer?.disconnect()
//   }, [isLoading, setSize, anchorRef, mutate, hasMore])

//   const { run: handleSearch } = useDebounceFn(() => {
//     setSearchKeywords(keywords)
//   }, { wait: 500 })
//   const handleKeywordsChange = (value: string) => {
//     setKeywords(value)
//     handleSearch()
//   }

//   const { run: handleTagsUpdate } = useDebounceFn(() => {
//     setTagIDs(tagFilterValue)
//   }, { wait: 500 })
//   const handleTagsChange = (value: string[]) => {
//     setTagFilterValue(value)
//     handleTagsUpdate()
//   }

//   const handleTabSelect = (value: string) => {
//     if (activeTab === value) {
//       setActiveTab('')
//     } else {
//       setActiveTab(value)
//     }
//   }

//   return (
//     <>
//       <div className='sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-10 flex-wrap gap-y-2'>
//         {/* <TabSliderNew
//           value={activeTab}
//           onChange={setActiveTab}
//           options={options}
//         /> */}
//         <div className='flex items-center gap-2'>
//           <NewAppCard onSuccess={mutate} />
//         </div>
//         <div className='flex items-center gap-2'>
//           <TagFilter type='app' value={tagFilterValue} onChange={handleTagsChange} />
//           <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange} />
//         </div>
//       </div>

//       <div>
//         {options.map((option: any) =>
//         (<div>
//           <div className='flex px-12 py-1 items-center cursor-pointer' onClick={() => {
//             handleTabSelect(option.value)
//           }}>
//             {activeTab !== option.value && <svg viewBox="64 64 896 896" focusable="false" data-icon="right" width="0.75em" height="0.75em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg>}
//             {activeTab === option.value && <svg className='rotate-90' viewBox="64 64 896 896" focusable="false" data-icon="right" width="0.75em" height="0.75em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path></svg>}
//             <div className={cn(
//               'flex ml-2 items-center px-2.5 py-1.5 rounded-lg border-[0.5px] border-transparent text-gray-700 text-[13px] font-medium leading-[18px] cursor-pointer hover:bg-gray-200',
//               activeTab === option.value && 'bg-white border-gray-200 shadow-xs text-primary-600 hover:bg-white',
//             )}>
//               {option.icon}
//               <span>{option.text}</span>
//             </div>
//           </div>
//           {activeTab === option.value && <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
//             {data?.map(({ data: apps }: any) => apps.map((app: any) => (
//               <AppCard key={app.id} app={app} onRefresh={mutate} />
//             )))}
//             <CheckModal />
//           </nav>}
//         </div>)
//         )}
//       </div>

//       {/* <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
//         {isCurrentWorkspaceEditor
//           && <NewAppCard onSuccess={mutate} />}
//         {data?.map(({ data: apps }: any) => apps.map((app: any) => (
//           <AppCard key={app.id} app={app} onRefresh={mutate} />
//         )))}
//         <CheckModal />
//       </nav> */}
//       <div ref={anchorRef} className='h-0'> </div>
//       {showTagManagementModal && (
//         <TagManagementModal type='app' show={showTagManagementModal} />
//       )}
//     </>
//   )
// }

// export default Apps


// 'use client'

// import { useCallback, useEffect, useRef, useState } from 'react'
// import useSWRInfinite from 'swr/infinite'
// import { useTranslation } from 'react-i18next'
// import { useDebounceFn } from 'ahooks'
// import AppCard from './AppCard'
// import NewAppCard from './NewAppCard'
// import useAppsQueryState from './hooks/useAppsQueryState'
// import type { AppListResponse } from '@/models/app'
// import { fetchAppList } from '@/service/apps'
// import { useAppContext } from '@/context/app-context'
// import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
// import { CheckModal } from '@/hooks/use-pay'
// import TabSliderNew from '@/app/components/base/tab-slider-new'
// import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
// import { DotsGrid } from '@/app/components/base/icons/src/vender/line/general'
// import {
//   ChatBot,
//   CuteRobot,
// } from '@/app/components/base/icons/src/vender/line/communication'
// import { Route } from '@/app/components/base/icons/src/vender/line/mapsAndTravel'
// import SearchInput from '@/app/components/base/search-input'
// import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
// import TagManagementModal from '@/app/components/base/tag-management'
// import TagFilter from '@/app/components/base/tag-management/filter'

// const getKey = (
//   pageIndex: number,
//   previousPageData: AppListResponse,
//   activeTab: string[],
//   tags: string[],
//   keywords: string,
// ) => {
//   if (!pageIndex || previousPageData.has_more) {
//     const params: any = { url: 'apps', params: { page: pageIndex + 1, limit: 30, name: keywords } }

//     // if (activeTab !== 'all')
//     //   params.params.mode = activeTab
//     if (activeTab.length > 0)
//       params.params.mode = activeTab
//     else
//       delete params.params.mode

//     if (tags.length)
//       params.params.tag_ids = tags

//     return params
//   }
//   return null
// }

// const Apps = () => {
//   const { t } = useTranslation()
//   const { isCurrentWorkspaceEditor } = useAppContext()
//   const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
//   // const [activeTab, setActiveTab] = useTabSearchParams({
//   //   defaultTab: 'all',
//   // })
//   const [activeTab, setActiveTab] = useState<string[]>(['chat', 'agent-chat', 'workflow'])
//   const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
//   const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
//   const [searchKeywords, setSearchKeywords] = useState(keywords)
//   const setKeywords = useCallback((keywords: string) => {
//     setQuery(prev => ({ ...prev, keywords }))
//   }, [setQuery])
//   const setTagIDs = useCallback((tagIDs: string[]) => {
//     setQuery(prev => ({ ...prev, tagIDs }))
//   }, [setQuery])

//   const { data, isLoading, setSize, mutate } = useSWRInfinite(
//     // (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData, activeTab, tagIDs, searchKeywords),
//     (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData, activeTab, tagIDs, searchKeywords),
//     fetchAppList,
//     { revalidateFirstPage: true },
//   )
//   useEffect(() => {
//     console.log('Fetched data:', data) // Log fetched data
//   }, [data])

//   const anchorRef = useRef<HTMLDivElement>(null)
//   const options = [
//     // { value: 'all', text: t('app.types.all'), icon: <DotsGrid className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'chat', text: t('app.types.chatbot'), icon: <ChatBot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'agent-chat', text: t('app.types.agent'), icon: <CuteRobot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'workflow', text: t('app.types.workflow'), icon: <Route className='w-[14px] h-[14px] mr-1' /> },
//   ]

//   useEffect(() => {
//     // document.title = `${t('common.menus.apps')} -  Dify`
//     document.title = `${t('common.menus.apps')}`
//     if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
//       localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
//       mutate()
//     }
//   }, [])

//   const hasMore = data?.at(-1)?.has_more ?? true
//   useEffect(() => {
//     let observer: IntersectionObserver | undefined
//     if (anchorRef.current) {
//       observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && !isLoading && hasMore)
//           setSize((size: number) => size + 1)
//       }, { rootMargin: '100px' })
//       observer.observe(anchorRef.current)
//     }
//     return () => observer?.disconnect()
//   }, [isLoading, setSize, anchorRef, mutate, hasMore])

//   const { run: handleSearch } = useDebounceFn(() => {
//     setSearchKeywords(keywords)
//   }, { wait: 500 })
//   const handleKeywordsChange = (value: string) => {
//     setKeywords(value)
//     handleSearch()
//   }

//   const { run: handleTagsUpdate } = useDebounceFn(() => {
//     setTagIDs(tagFilterValue)
//   }, { wait: 500 })
//   const handleTagsChange = (value: string[]) => {
//     setTagFilterValue(value)
//     handleTagsUpdate()
//   }

//   const toggleTab = (tab: string) => {
//     setActiveTab(prev => {
//       const newTabs = prev.includes(tab) ? prev.filter(t => t !== tab) : [...prev, tab]
//       console.log('Active tabs after toggle:', newTabs) // Log active tabs after toggle
//       return newTabs
//     })
//   }


//   return (
//     <>
//       <div className='sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-10 flex-wrap gap-y-2'>
//         {/* <TabSliderNew
//           value={activeTab}
//           onChange={setActiveTab}
//           options={options}
//         /> */}
//         <div className='flex items-center gap-2'>
//           <TagFilter type='app' value={tagFilterValue} onChange={handleTagsChange} />
//           <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange} />
//         </div>
//       </div>
//       <div className='px-12'>
//         {options.map(option => (
//           <div key={option.value}>
//             <div className='flex items-center justify-between cursor-pointer'
//               onClick={() => toggleTab(option.value)}>
//               <div className='flex items-center'>
//                 {option.icon}
//                 <span className='ml-2 text-lg font-medium'>{option.text}</span>
//               </div>
//               <div>
//                 {activeTab.includes(option.value) ? '▲' : '▼'}
//               </div>
//             </div>
//             {activeTab.includes(option.value) && (
//               <div className='grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
//                 {data?.map(({ data: apps }: any) => {
//                   const filteredApps = apps.filter((app: any) => activeTab.includes(app.mode))
//                   console.log(`Filtered apps for tab "${option.value}":`, filteredApps) // Log filtered apps
//                   return filteredApps.map((app: any) => (
//                     <AppCard key={app.id} app={app} onRefresh={mutate} />
//                   ))
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//         {isCurrentWorkspaceEditor && <NewAppCard onSuccess={mutate} />}
//         <CheckModal />
//       </div>
//       {/* <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
//         {isCurrentWorkspaceEditor
//           && <NewAppCard onSuccess={mutate} />}
//         {data?.map(({ data: apps }: any) => apps.map((app: any) => (
//           <AppCard key={app.id} app={app} onRefresh={mutate} />
//         )))}
//         <CheckModal />
//       </nav> */}
//       <div ref={anchorRef} className='h-0'> </div>
//       {showTagManagementModal && (
//         <TagManagementModal type='app' show={showTagManagementModal} />
//       )}
//     </>
//   )
// }

// export default Apps


// 'use client'

// import { useCallback, useEffect, useRef, useState } from 'react'
// import useSWRInfinite from 'swr/infinite'
// import { useTranslation } from 'react-i18next'
// import { useDebounceFn } from 'ahooks'
// import AppCard from './AppCard'
// import NewAppCard from './NewAppCard'
// import useAppsQueryState from './hooks/useAppsQueryState'
// import type { AppListResponse } from '@/models/app'
// import { fetchAppList } from '@/service/apps'
// import { useAppContext } from '@/context/app-context'
// import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
// import { CheckModal } from '@/hooks/use-pay'
// import TabSliderNew from '@/app/components/base/tab-slider-new'
// import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
// import { DotsGrid } from '@/app/components/base/icons/src/vender/line/general'
// import {
//   ChatBot,
//   CuteRobot,
// } from '@/app/components/base/icons/src/vender/line/communication'
// import { Route } from '@/app/components/base/icons/src/vender/line/mapsAndTravel'
// import SearchInput from '@/app/components/base/search-input'
// import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
// import TagManagementModal from '@/app/components/base/tag-management'
// import TagFilter from '@/app/components/base/tag-management/filter'

// const getKey = (
//   pageIndex: number,
//   previousPageData: AppListResponse,
//   activeTab: string,
//   tags: string[],
//   keywords: string,
// ) => {
//   if (!pageIndex || previousPageData.has_more) {
//     const params: any = { url: 'apps', params: { page: pageIndex + 1, limit: 30, name: keywords } }

//     if (activeTab !== 'all')
//       params.params.mode = activeTab
//     else
//       delete params.params.mode

//     if (tags.length)
//       params.params.tag_ids = tags

//     return params
//   }
//   return null
// }

// const Apps = () => {
//   const { t } = useTranslation()
//   const { isCurrentWorkspaceEditor } = useAppContext()
//   const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
//   const [activeTab, setActiveTab] = useTabSearchParams({
//     defaultTab: 'all',
//   })
//   const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
//   const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
//   const [searchKeywords, setSearchKeywords] = useState(keywords)
//   const setKeywords = useCallback((keywords: string) => {
//     setQuery(prev => ({ ...prev, keywords }))
//   }, [setQuery])
//   const setTagIDs = useCallback((tagIDs: string[]) => {
//     setQuery(prev => ({ ...prev, tagIDs }))
//   }, [setQuery])

//   const { data, isLoading, setSize, mutate } = useSWRInfinite(
//     (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData, activeTab, tagIDs, searchKeywords),
//     fetchAppList,
//     { revalidateFirstPage: true },
//   )

//   const anchorRef = useRef<HTMLDivElement>(null)
//   const options = [
//     { value: 'all', text: t('app.types.all'), icon: <DotsGrid className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'chat', text: t('app.types.chatbot'), icon: <ChatBot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'agent-chat', text: t('app.types.agent'), icon: <CuteRobot className='w-[14px] h-[14px] mr-1' /> },
//     { value: 'workflow', text: t('app.types.workflow'), icon: <Route className='w-[14px] h-[14px] mr-1' /> },
//   ]

//   useEffect(() => {
//     // document.title = `${t('common.menus.apps')} -  Dify`
//     document.title = `${t('common.menus.apps')}`
//     if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
//       localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
//       mutate()
//     }
//   }, [])

//   const hasMore = data?.at(-1)?.has_more ?? true
//   useEffect(() => {
//     let observer: IntersectionObserver | undefined
//     if (anchorRef.current) {
//       observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && !isLoading && hasMore)
//           setSize((size: number) => size + 1)
//       }, { rootMargin: '100px' })
//       observer.observe(anchorRef.current)
//     }
//     return () => observer?.disconnect()
//   }, [isLoading, setSize, anchorRef, mutate, hasMore])

//   const { run: handleSearch } = useDebounceFn(() => {
//     setSearchKeywords(keywords)
//   }, { wait: 500 })
//   const handleKeywordsChange = (value: string) => {
//     setKeywords(value)
//     handleSearch()
//   }

//   const { run: handleTagsUpdate } = useDebounceFn(() => {
//     setTagIDs(tagFilterValue)
//   }, { wait: 500 })
//   const handleTagsChange = (value: string[]) => {
//     setTagFilterValue(value)
//     handleTagsUpdate()
//   }

//   return (
//     <>
//       <div className='sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-10 flex-wrap gap-y-2'>
//         <TabSliderNew
//           value={activeTab}
//           onChange={setActiveTab}
//           options={options}
//         />
//         <div className='flex items-center gap-2'>
//           <TagFilter type='app' value={tagFilterValue} onChange={handleTagsChange} />
//           <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange} />
//         </div>
//       </div>
//       <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
//         {isCurrentWorkspaceEditor
//           && <NewAppCard onSuccess={mutate} />}
//         {data?.map(({ data: apps }: any) => apps.map((app: any) => (
//           <AppCard key={app.id} app={app} onRefresh={mutate} />
//         )))}
//         <CheckModal />
//       </nav>
//       <div ref={anchorRef} className='h-0'> </div>
//       {showTagManagementModal && (
//         <TagManagementModal type='app' show={showTagManagementModal} />
//       )}
//     </>
//   )
// }

// export default Apps
