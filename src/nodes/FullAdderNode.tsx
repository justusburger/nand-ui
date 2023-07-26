import { NodeProps, useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import useInboundState from '../useInboundState'
import useOutboundState from '../useOutboundState'
import { useMemo } from 'react'

const A_HANDLE_ID = 'a'
const B_HANDLE_ID = 'b'
const CARRY_IN_HANDLE_ID = 'carry in'
const inputHandleIds = [A_HANDLE_ID, B_HANDLE_ID, CARRY_IN_HANDLE_ID]
const SUM_HANDLE_ID = 'sum'
const CARRY_OUT_HANDLE_ID = 'carry out'
const outputHandleIds = [SUM_HANDLE_ID, CARRY_OUT_HANDLE_ID]

function FullAdderNode({ id }: NodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const outboundState: any = useMemo(() => {
    let sum = 0
    if (inboundState[A_HANDLE_ID]) sum += 1
    if (inboundState[B_HANDLE_ID]) sum += 1
    if (inboundState[CARRY_IN_HANDLE_ID]) sum += 1

    return {
      [SUM_HANDLE_ID]: sum === 1 || sum === 3,
      [CARRY_OUT_HANDLE_ID]: sum === 2 || sum === 3,
    }
  }, [inboundState])
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
      <div style={{ color: 'black', padding: 10 }}>Full Adder</div>
      <OutputHandleRegion>
        {outputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            label={handleId}
            enabled={outboundState[handleId]}
            key={handleId}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default FullAdderNode
