import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { NodeProps, useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'

const inputIds = ['a', 'b']
const outputHandleId = 'out'

function NorNode({ id }: NodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const outboundState = {
    [outputHandleId]: !(inboundState['a'] || inboundState['b']),
  }
  useOutboundState(id, outboundState)

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputIds.map((id) => (
          <NodeHandle
            id={id}
            enabled={inboundState[id]}
            key={id}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div style={{ color: 'black', padding: 10 }}>NOR</div>
      <OutputHandleRegion>
        <NodeHandle
          id={outputHandleId}
          type="output"
          enabled={outboundState[outputHandleId]}
          key={id}
        />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default NorNode
