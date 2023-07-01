import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

const inputHandleIds = ['a', 'b']
const outputEnabled = (inboundState: any) =>
  !(inboundState['a'] && inboundState['b'])

function NandNode({ id }: NodeProps) {
  return (
    <SimpleNode
      id={id}
      name="NAND"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={outputEnabled}
    />
  )
}

export default NandNode
