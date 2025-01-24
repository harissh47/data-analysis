import type { FC } from 'react'
import React from 'react'
import type { NodeProps } from 'reactflow'
import InfoPanel from '../_base/components/info-panel'
import type { ActionsNodeType } from './types'

const Node: FC<NodeProps<ActionsNodeType>> = (props) => {
  const { data } = props
  const actionType = data.action_type

  return (
    <div className='px-3 py-1'>
      {
        !!actionType && (
          <InfoPanel
            title={''}
            content={actionType}
          />
        )
      }
    </div>
  )
}

export default React.memo(Node)
