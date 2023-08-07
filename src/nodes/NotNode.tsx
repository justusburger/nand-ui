import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'
import React from 'react'

const inputHandleIds = ['a']
const outputEnabled = (inboundState: any) => !inboundState['a']

function NotNode({ id }: NodeProps) {
  return (
    <SimpleNode
      id={id}
      name="NOT"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
    />
  )
}

export default React.memo(NotNode)
