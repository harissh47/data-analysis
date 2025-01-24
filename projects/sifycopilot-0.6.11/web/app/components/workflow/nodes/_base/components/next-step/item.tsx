import {
  memo,
  useCallback,
} from 'react'
import { useTranslation } from 'react-i18next'
import { intersection } from 'lodash-es'
import type {
  CommonNodeType,
  OnSelectBlock,
} from '@/app/components/workflow/types'
import BlockIcon from '@/app/components/workflow/block-icon'
import BlockSelector from '@/app/components/workflow/block-selector'
import {
  useAvailableBlocks,
  useNodesInteractions,
  useNodesReadOnly,
  useToolIcon,
} from '@/app/components/workflow/hooks'
import Button from '@/app/components/base/button'

type ItemProps = {
  nodeId: string
  sourceHandle: string
  branchName?: string
  data: CommonNodeType
}
const Item = ({
  nodeId,
  sourceHandle,
  branchName,
  data,
}: ItemProps) => {
  const { t } = useTranslation()
  const { handleNodeChange } = useNodesInteractions()
  const { nodesReadOnly } = useNodesReadOnly()
  const toolIcon = useToolIcon(data)
  const {
    availablePrevBlocks,
    availableNextBlocks,
  } = useAvailableBlocks(data.type, data.isInIteration)

  const handleSelect = useCallback<OnSelectBlock>((type, toolDefaultValue) => {
    handleNodeChange(nodeId, type, sourceHandle, toolDefaultValue)
  }, [nodeId, sourceHandle, handleNodeChange])
  const renderTrigger = useCallback((open: boolean) => {
    return (
      <Button
        // className={`
        //   hidden group-hover:flex px-2 py-0 h-6 bg-white text-xs text-gray-700 font-medium rounded-md
        //   ${open && '!bg-gray-100 !flex'}
        // `}
        className={`
          hidden group-hover:flex px-2 py-0 h-6 bg-white dark:bg-[#383838] text-xs text-gray-700 dark:text-white dark:border-[#5F5F5F] font-medium rounded-md dark:hover:border-[#5F5F5F] dark:hover:bg-transparent
          ${open && '!bg-gray-100 dark:!bg-zinc-800 !flex'}
        `}
      >
        {t('workflow.panel.change')}
      </Button>
    )
  }, [t])

  return (
    <div
      // className='relative group flex items-center mb-3 last-of-type:mb-0 px-2 h-9 rounded-lg border-[0.5px] border-gray-200 bg-white hover:bg-gray-50 shadow-xs text-xs text-gray-700 cursor-pointer'
      className='relative group flex items-center mb-3 last-of-type:mb-0 px-2 h-9 rounded-lg border-[0.5px] border-gray-200 dark:border-[#5F5F5F] bg-white dark:bg-[#3E3E3E] hover:bg-gray-50 dark:hover:bg-[#2E2E2E] shadow-xs text-xs text-gray-700 cursor-pointer'
    >
      {
        branchName && (
          <div
            className='absolute left-1 right-1 -top-[7.5px] flex items-center h-3 text-[10px] text-gray-500 font-semibold'
            title={branchName.toLocaleUpperCase()}
          >
            {/* <div className='inline-block px-0.5 rounded-[5px] bg-white truncate'>{branchName.toLocaleUpperCase()}</div> */}
            <div className='inline-block px-0.5 rounded-[5px] bg-white dark:bg-[#383838] truncate'>{branchName.toLocaleUpperCase()}</div>
          </div>
        )
      }
      <BlockIcon
        type={data.type}
        toolIcon={toolIcon}
        className='shrink-0 mr-1.5'
      />
      {/* <div className='grow'>{data.title}</div> */}
      <div className='grow dark:text-white'>{data.title}</div>
      {
        !nodesReadOnly && (
          <BlockSelector
            onSelect={handleSelect}
            placement='top-end'
            offset={{
              mainAxis: 6,
              crossAxis: 8,
            }}
            trigger={renderTrigger}
            popupClassName='!w-[328px]'
            availableBlocksTypes={intersection(availablePrevBlocks, availableNextBlocks).filter(item => item !== data.type)}
          />
        )
      }
    </div>
  )
}

export default memo(Item)
