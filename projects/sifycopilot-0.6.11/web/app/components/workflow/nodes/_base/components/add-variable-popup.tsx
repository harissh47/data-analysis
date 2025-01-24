import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import VarReferenceVars from '@/app/components/workflow/nodes/_base/components/variable/var-reference-vars'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/app/components/workflow/types'

export type AddVariablePopupProps = {
  availableVars: NodeOutPutVar[]
  onSelect: (value: ValueSelector, item: Var) => void
}
export const AddVariablePopup = ({
  availableVars,
  onSelect,
}: AddVariablePopupProps) => {
  const { t } = useTranslation()

  return (
    // <div className='w-[240px] bg-white border-[0.5px] border-gray-200 rounded-lg shadow-lg'>
    <div className='w-[240px] bg-white border-[0.5px] border-gray-200 dark:bg-[#3F3F3F] dark:border-[#5F5F5F] rounded-lg shadow-lg'>
      {/* <div className='flex items-center px-4 h-[34px] text-[13px] font-semibold text-gray-700 border-b-[0.5px] border-b-gray-200'> */}
      <div className='flex items-center px-4 h-[34px] text-[13px] font-semibold text-gray-700 dark:text-[#FCFCFC] border-b-[0.5px] border-b-gray-200 dark:border-b-[#5F5F5F]'>
        {t('workflow.nodes.variableAssigner.setAssignVariable')}
      </div>
      <div className='p-1'>
        <VarReferenceVars
          hideSearch
          vars={availableVars}
          onChange={onSelect}
        />
      </div>
    </div>
  )
}

export default memo(AddVariablePopup)
