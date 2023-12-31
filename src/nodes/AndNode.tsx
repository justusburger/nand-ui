import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

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

export default AndNode
