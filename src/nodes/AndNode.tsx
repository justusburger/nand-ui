import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { NodeProps, useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useMemo } from 'react'

const inputHandleIds = ['a', 'b']
const outputHandleId = 'out'

function AndNode({ id }: NodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const outputEnabled = useMemo(
    () =>
      inputHandleIds.reduce(
        (acc, handleId) => acc && inboundState[handleId],
        true
      ),
    [inboundState]
  )
  const outboundState = useMemo(
    () => ({ [outputHandleId]: outputEnabled }),
    [outputEnabled]
  )

  useOutboundState(id, outboundState)

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            enabled={inboundState[handleId]}
            key={handleId}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div style={{ color: 'black', padding: 10 }}>AND</div>
      <OutputHandleRegion>
        <NodeHandle
          id={outputHandleId}
          type="output"
          enabled={outputEnabled}
          key={id}
        />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default AndNode
