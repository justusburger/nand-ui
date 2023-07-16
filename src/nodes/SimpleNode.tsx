import NodeHandle from '../components/NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'

export interface SimpleNodeProps {
  id: string
  name: string
  inputHandleIds: string[]
  outputHandleId: string
  outputEnabled: (inboundState: { [key: string]: boolean }) => boolean
}

function SimpleNode({
  id,
  name,
  inputHandleIds,
  outputHandleId,
  outputEnabled,
}: SimpleNodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const outboundState = {
    [outputHandleId]: outputEnabled(inboundState),
  }

  useOutboundState(id, outboundState)

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            label={handleId}
            enabled={inboundState[handleId]}
            key={handleId}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div style={{ color: 'black', padding: 10 }}>{name}</div>
      <OutputHandleRegion>
        <NodeHandle
          id={outputHandleId}
          label={outputHandleId}
          type="output"
          enabled={outboundState[outputHandleId]}
          key={id}
        />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default SimpleNode
