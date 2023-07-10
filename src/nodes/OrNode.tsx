import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

const inputHandleIds = ['a', 'b']
const outputEnabled = (inboundState: any) =>
  inboundState['a'] || inboundState['b']

function OrNode({ id }: NodeProps) {
  return (
    <SimpleNode
      id={id}
      name="OR"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
    />
  )
}

export default OrNode
