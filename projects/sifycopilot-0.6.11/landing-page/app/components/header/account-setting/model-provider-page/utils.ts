import { ModelTypeEnum, ConfigurationMethodEnum, ModelLoadBalancingConfig } from "./declaration"
import type { FormValue } from "./declaration"
import { setModelProvider } from "@/service/common"

export const sizeFormat = (size: number) => {
  const remainder = Math.floor(size / 1000)
  if (remainder < 1)
    return `${size}`
  else
    return `${remainder}K`
}

export const modelTypeFormat = (modelType: ModelTypeEnum) => {
  if (modelType === ModelTypeEnum.textEmbedding)
    return 'TEXT EMBEDDING'

  return modelType.toLocaleUpperCase()
}

export const savePredefinedLoadBalancingConfig = async (provider: string, v: FormValue, loadBalancing?: ModelLoadBalancingConfig) => {
  const { __model_name, __model_type, ...credentials } = v
  const body = {
    config_from: ConfigurationMethodEnum.predefinedModel,
    model: __model_name,
    model_type: __model_type,
    credentials,
    load_balancing: loadBalancing,
  }
  const url = `/workspaces/current/model-providers/${provider}/models`

  return setModelProvider({ url, body })
}