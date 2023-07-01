import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

const inputHandleIds = ['a', 'b']
const outputEnabled = (inboundState: any) =>
  (inboundState['a'] && !inboundState['b']) ||
  (inboundState['b'] && !inboundState['a'])

function XORNode({ id }: NodeProps) {
  return (
    <SimpleNode
      id={id}
      name="XOR"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
    />
  )
}

export default XORNode
