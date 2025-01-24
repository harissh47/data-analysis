import { AppContextProvider } from '@/context/app-context'
import React from 'react'
import type { ReactNode } from 'react'
import AccountSetting from '.'
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { ProviderContextProvider } from '@/context/provider-context'
import { ModalContextProvider } from '@/context/modal-context'
const SettingsPage = () => {
    return (
        <>
            <AppContextProvider>
                <EventEmitterContextProvider>
                    <ProviderContextProvider>
                        <ModalContextProvider>
                            <AccountSetting />
                        </ModalContextProvider>
                    </ProviderContextProvider>
                </EventEmitterContextProvider>
            </AppContextProvider>
        </>
    )
}

export default SettingsPage