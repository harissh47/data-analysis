import { AppConversationData, AppData, AppMeta, ConversationItem } from '@/models/share'
import {
    del as consoleDel, get as consoleGet, patch as consolePatch, post as consolePost,
    delPublic as del, getPublic as get, patchPublic as patch, postPublic as post, ssePost,
} from './base'
import { ChatConfig } from '@/app/components/chat/types'
import { Feedbacktype } from '@/app/components/app/chat/type'

function getAction(action: 'get' | 'post' | 'del' | 'patch', isInstalledApp: boolean) {
    switch (action) {
        case 'get':
            return isInstalledApp ? consoleGet : get
        case 'post':
            return isInstalledApp ? consolePost : post
        case 'patch':
            return isInstalledApp ? consolePatch : patch
        case 'del':
            return isInstalledApp ? consoleDel : del
    }
}
export function getUrl(url: string, isInstalledApp: boolean, installedAppId: string) {
    return isInstalledApp ? `installed-apps/${installedAppId}/${url.startsWith('/') ? url.slice(1) : url}` : url
}
export const fetchAccessToken = async (appCode: string) => {
    const headers = new Headers()
    headers.append('X-App-Code', appCode)
    console.log()
    return get('/passport', { headers }) as Promise<{ access_token: string }>
}

export const fetchSuggestedQuestions = (messageId: string, isInstalledApp: boolean, installedAppId = '') => {
    return (getAction('get', isInstalledApp))(getUrl(`/messages/${messageId}/suggested-questions`, isInstalledApp, installedAppId))
}

export const stopChatMessageResponding = async (appId: string, taskId: string, isInstalledApp: boolean, installedAppId = '') => {
    return getAction('post', isInstalledApp)(getUrl(`chat-messages/${taskId}/stop`, isInstalledApp, installedAppId))
}

export const delConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
    return getAction('del', isInstalledApp)(getUrl(`conversations/${id}`, isInstalledApp, installedAppId))
}

export const fetchAppInfo = async () => {
    return get('/site') as Promise<AppData>
}

export const fetchAppMeta = async (isInstalledApp: boolean, installedAppId = '') => {
    return (getAction('get', isInstalledApp))(getUrl('meta', isInstalledApp, installedAppId)) as Promise<AppMeta>
}

export const fetchAppParams = async (isInstalledApp: boolean, installedAppId = '') => {
    return (getAction('get', isInstalledApp))(getUrl('parameters', isInstalledApp, installedAppId)) as Promise<ChatConfig>
}

export const fetchChatList = async (conversationId: string, isInstalledApp: boolean, installedAppId = '') => {
    return getAction('get', isInstalledApp)(getUrl('messages', isInstalledApp, installedAppId), { params: { conversation_id: conversationId, limit: 20, last_id: '' } }) as any
}

export const fetchConversations = async (isInstalledApp: boolean, installedAppId = '', last_id?: string, pinned?: boolean, limit?: number) => {
    return getAction('get', isInstalledApp)(getUrl('conversations', isInstalledApp, installedAppId), { params: { ...{ limit: limit || 20 }, ...(last_id ? { last_id } : {}), ...(pinned !== undefined ? { pinned } : {}) } }) as Promise<AppConversationData>
}

export const generationConversationName = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
    return getAction('post', isInstalledApp)(getUrl(`conversations/${id}/name`, isInstalledApp, installedAppId), { body: { auto_generate: true } }) as Promise<ConversationItem>
}

export const pinConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
    return getAction('patch', isInstalledApp)(getUrl(`conversations/${id}/pin`, isInstalledApp, installedAppId))
}

export const renameConversation = async (isInstalledApp: boolean, installedAppId = '', id: string, name: string) => {
    return getAction('post', isInstalledApp)(getUrl(`conversations/${id}/name`, isInstalledApp, installedAppId), { body: { name } })
}

export const updateFeedback = async ({ url, body }: { url: string; body: Feedbacktype }, isInstalledApp: boolean, installedAppId = '') => {
    return (getAction('post', isInstalledApp))(getUrl(url, isInstalledApp, installedAppId), { body })
}

export const unpinConversation = async (isInstalledApp: boolean, installedAppId = '', id: string) => {
    return getAction('patch', isInstalledApp)(getUrl(`conversations/${id}/unpin`, isInstalledApp, installedAppId))
}