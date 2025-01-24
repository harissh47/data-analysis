import { AppMode, AppModes } from "@/types/app"

export type AppBasicInfo = {
    id: string
    // mode: AppMode
    mode: AppMode
    icon: string
    icon_background: string
    name: string
    description: string
}

export type InstalledApp = {
    app: AppBasicInfo
    id: string
    uninstallable: boolean
    is_pinned: boolean
}