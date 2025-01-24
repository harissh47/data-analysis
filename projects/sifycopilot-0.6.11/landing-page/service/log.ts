import { AgentLogDetailRequest, AgentLogDetailResponse } from "@/models/log";
import { get } from "./base";

export const fetchAgentLogDetail = ({ appID, params }: { appID: string; params: AgentLogDetailRequest }) => {
    return get<AgentLogDetailResponse>(`/apps/${appID}/agent/logs`, { params })
}