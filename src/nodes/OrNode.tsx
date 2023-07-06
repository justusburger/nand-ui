import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { NodeProps } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'

const inputIds = ['a', 'b']
const outputId = 'out'

function OrNode({ id }: NodeProps) {
  const inboundState = useInboundState({ nodeId: id })
  const outputEnabled = inputIds.reduce(
    (acc, handleId) => acc || inboundState[handleId],
    false
  )
  useOutboundState({ nodeId: id, outputId, outputEnabled })

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
      <div style={{ color: 'black', padding: 10 }}>OR</div>
      <OutputHandleRegion>
        <NodeHandle id="out" type="output" enabled={outputEnabled} key={id} />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default OrNode
