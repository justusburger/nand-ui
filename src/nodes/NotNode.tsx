import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'

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

export default NotNode
