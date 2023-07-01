import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

const inputHandleIds = ['a', 'b']
const outputEnabled = (inboundState: any) =>
  !(inboundState['a'] || inboundState['b'])

function NorNode({ id }: NodeProps) {
  const delay = parseInt(id) % 10
  return (
    <SimpleNode
      id={id}
      name="NOR"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
      outboundStateDelay={isNaN(delay) ? 0 : delay}
    />
  )
}

export default NorNode
