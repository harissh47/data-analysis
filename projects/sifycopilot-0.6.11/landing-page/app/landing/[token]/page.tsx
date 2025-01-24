'use client'
import type { FC } from 'react'
import React from 'react'

// import type { IMainProps } from '@/app/components/share/chat'
import type { InstalledApp } from '@/models/explore'
import ChatWithHistoryWrap from '@/app/components/chat/chat-with-history'

export type IMainProps = {
  isInstalledApp?: boolean
  installedAppInfo?: InstalledApp
  isSupportPlugin?: boolean
}

const Chat: FC<IMainProps> = () => {
  return (
    <ChatWithHistoryWrap />
  )
}

export default React.memo(Chat)
