import type { Fetcher } from 'swr'
import { get, post } from './base'
import type { Model, ModelProvider, ModelLoadBalancingConfig } from '@/app/components/header/account-setting/model-provider-page/declaration'
import type { RETRIEVE_METHOD } from '@/types/app'
import type { CommonResponse, UserProfileOriginResponse } from '@/models/common'

export const fetchModelList: Fetcher<{ data: Model[] }, string> = (url) => {
  return get<{ data: Model[] }>(url)
}

export const fetchModelProviders: Fetcher<{ data: ModelProvider[] }, string> = (url) => {
  return get<{ data: ModelProvider[] }>(url)
}

type RetrievalMethodsRes = {
  'retrieval_method': RETRIEVE_METHOD[]
}


export const fetchSupportRetrievalMethods: Fetcher<RetrievalMethodsRes, string> = (url) => {
  return get<RetrievalMethodsRes>(url)
}

export const setModelProvider: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<CommonResponse>(url, { body })
}

export const fetchModelLoadBalancingConfig: Fetcher<{
  credentials?: Record<string, string | undefined | boolean>
  load_balancing: ModelLoadBalancingConfig
}, string> = (url) => {
  return get<{
    credentials?: Record<string, string | undefined | boolean>
    load_balancing: ModelLoadBalancingConfig
  }>(url)
}

export const fetchUserProfile: Fetcher<UserProfileOriginResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<UserProfileOriginResponse>(url, params, { needAllResponseContent: true })
}