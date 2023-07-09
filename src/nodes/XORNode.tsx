import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { NodeProps } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useMemo } from 'react'

const inputIds = ['a', 'b']
const outputHandleId = 'out'

function XORNode({ id }: NodeProps) {
  const inboundState = useInboundState(id)
  const outputEnabled =
    (inboundState['a'] && !inboundState['b']) ||
    (inboundState['b'] && !inboundState['a'])
  const outboundState = useMemo(
    () => ({ [outputHandleId]: outputEnabled }),
    [outputEnabled]
  )
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
      <div style={{ color: 'black', padding: 10 }}>XOR</div>
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

export default XORNode
