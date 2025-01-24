'use client'

import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { flatten } from 'lodash-es'
import Nav from '../nav'
import { Knowledge, KnowledgeActive } from '../../base/icons/src/public/header-nav/knowledge'
import { fetchDatasetDetail, fetchDatasets } from '@/service/datasets'
import type { DataSetListResponse } from '@/models/datasets'

const getKey = (pageIndex: number, previousPageData: DataSetListResponse) => {
  if (!pageIndex || previousPageData.has_more)
    return { url: 'datasets', params: { page: pageIndex + 1, limit: 30 } }
  return null
}

const DatasetNav = ({
  isCollapsed,
}: { isCollapsed: boolean }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { datasetId } = useParams()
  const { data: currentDataset } = useSWR(
    datasetId
      ? {
        url: 'fetchDatasetDetail',
        datasetId,
      }
      : null,
    apiParams => fetchDatasetDetail(apiParams.datasetId))
  const { data: datasetsData, setSize } = useSWRInfinite(datasetId ? getKey : () => null, fetchDatasets, { revalidateFirstPage: false, revalidateAll: true })
  const datasetItems = flatten(datasetsData?.map(datasetData => datasetData.data))

  const handleLoadmore = useCallback(() => {
    setSize(size => size + 1)
  }, [setSize])

  const DatamindIcon = () => (
    // <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-gray-800 dark:text-gray-200'>
    //   <g strokeWidth="0"></g>
    //   <g strokeLinecap="round" strokeLinejoin="round"></g>
    //   <g> <path d="M4 18V6" stroke="#currentColor" strokeWidth="2.4" strokeLinecap="round" ></path>
    //     <path d="M20 6V18" stroke="#currentColor" strokeWidth="2.4" strokeLinecap="round" ></path>
    //     <path d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z" stroke="#currentColor" strokeWidth="2.4"  ></path>
    //     <path d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12" stroke="#currentColor" strokeWidth="2.4" ></path>
    //     <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18" stroke="#currentColor" strokeWidth="2.4"  ></path>
    //   </g>
    // </svg>
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-800 dark:text-gray-200">
  <path d="M4 18V6" stroke="#79808A" strokeWidth="2.4" strokeLinecap="round"></path>
  <path d="M20 6V18" stroke="#79808A" strokeWidth="2.4" strokeLinecap="round"></path>
  <path d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z" stroke="#79808A" strokeWidth="2.4"></path>
  <path d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12" stroke="#79808A" strokeWidth="2.4"></path>
  <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18" stroke="#79808A" strokeWidth="2.4"></path>
</svg>

  )

  const DatamindActiveIcon = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" stroke="#currentColor" strokeWidth="0.00024" className='text-gray-800 dark:text-gray-200' >
      <g strokeWidth="0"></g>
      <g strokeLinecap="round" strokeLinejoin="round"></g>
      <g> <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18V13.974C4.50221 14.5906 5.21495 15.1029 6.00774 15.4992C7.58004 16.2854 9.69967 16.75 12 16.75C14.3003 16.75 16.42 16.2854 17.9923 15.4992C18.7851 15.1029 19.4978 14.5906 20 13.974V18Z" fill="#currentColor" ></path>
        <path d="M12 10.75C14.3003 10.75 16.42 10.2854 17.9923 9.49925C18.7851 9.10285 19.4978 8.59059 20 7.97397V12C20 12.5 18.2143 13.5911 17.3214 14.1576C15.9983 14.8192 14.118 15.25 12 15.25C9.88205 15.25 8.00168 14.8192 6.67856 14.1576C5.5 13.5683 4 12.5 4 12V7.97397C4.50221 8.59059 5.21495 9.10285 6.00774 9.49925C7.58004 10.2854 9.69967 10.75 12 10.75Z" fill="#currentColor" ></path>
        <path d="M17.3214 8.15761C15.9983 8.81917 14.118 9.25 12 9.25C9.88205 9.25 8.00168 8.81917 6.67856 8.15761C6.16384 7.95596 5.00637 7.31492 4.2015 6.27935C4.06454 6.10313 4.00576 5.87853 4.03988 5.65798C4.06283 5.50969 4.0948 5.35695 4.13578 5.26226C4.82815 3.40554 8.0858 2 12 2C15.9142 2 19.1718 3.40554 19.8642 5.26226C19.9052 5.35695 19.9372 5.50969 19.9601 5.65798C19.9942 5.87853 19.9355 6.10313 19.7985 6.27935C18.9936 7.31492 17.8362 7.95596 17.3214 8.15761Z" fill="#currentColor" ></path>
      </g>
    </svg>
  )

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      // setIsDarkMode(true)
    }
  }, [])

  return (
    <Nav
      // icon={<Knowledge className='w-4 h-4' />}
      icon={<DatamindIcon />}
      // activeIcon={<KnowledgeActive className='w-4 h-4' />}
      activeIcon={<DatamindActiveIcon />}
      // text={t('common.menus.datasets')}
      // text='Data Mind'
      text={!isCollapsed ? 'Data Mind' : ''}
      // activeSegment='datasets'
      activeSegment='data-mind'
      // link='/datasets'
      link='/data-mind'
      curNav={currentDataset}
      navs={datasetItems.map(dataset => ({
        id: dataset.id,
        name: dataset.name,
        // link: `/datasets/${dataset.id}/documents`,
        link: `/data-mind/${dataset.id}/documents`,
        icon: dataset.icon,
        icon_background: dataset.icon_background,
      }))}
      // createText={t('common.menus.newDataset')}
      createText={isCollapsed ? t('common.menus.newDataset') : ''}
      // onCreate={() => router.push('/datasets/create')}
      onCreate={() => router.push('/data-mind/create')}
      onLoadmore={handleLoadmore}
      collapsed={isCollapsed} 

    />
  )
}

export default DatasetNav
