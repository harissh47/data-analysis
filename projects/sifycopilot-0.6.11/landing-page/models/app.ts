import type { App } from "@/types/app"

export type AppListResponse = {
  data: App[]
  has_more: boolean
  limit: number
  page: number
  total: number
}