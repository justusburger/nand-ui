import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'
import React from 'react'

const inputHandleIds = ['a', 'b']
const outputEnabled = (inboundState: any) =>
  inboundState['a'] && inboundState['b']

function AndNode({ id }: NodeProps) {
  return (
    <SimpleNode
      id={id}
      name="AND"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
    />
  )
}

export default React.memo(AndNode)
