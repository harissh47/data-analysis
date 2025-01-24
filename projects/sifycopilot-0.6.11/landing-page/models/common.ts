export type CommonResponse = {
  result: 'success' | 'fail'
}

export type ApiBasedExtension = {
  id?: string
  name?: string
  api_endpoint?: string
  api_key?: string
}

export type ExternalDataTool = {
  type?: string
  label?: string
  icon?: string
  icon_background?: string
  variable?: string
  enabled?: boolean
  config?: {
    api_based_extension_id?: string
  } & Partial<Record<string, any>>
}

export type UserProfileResponse = {
  id: string
  name: string
  email: string
  avatar: string
  is_password_set: boolean
  interface_language?: string
  interface_theme?: string
  timezone?: string
  last_login_at?: string
  last_active_at?: string
  last_login_ip?: string
  created_at?: string
}

export type UserProfileOriginResponse = {
  json: () => Promise<UserProfileResponse>
  bodyUsed: boolean
  headers: any
}