import type { Fetcher } from 'swr'
import { get } from './base'
import type { AppListResponse } from '@/models/app'

export const fetchAppList: Fetcher<AppListResponse, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<AppListResponse>(url, { params })
}