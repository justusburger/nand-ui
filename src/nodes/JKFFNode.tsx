import { NodeProps } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import useNodeDataState from '../useNodeDataState'
import { useEffect, useState } from 'react'
import { useHandleState } from '../components/HandleStateProvider'

const J_HANDLE_ID = 'J'
const ENABLE_HANDLE_ID = 'Enabled'
const K_HANDLE_ID = 'K'
const inputHandleIds = [J_HANDLE_ID, ENABLE_HANDLE_ID, K_HANDLE_ID]
const Q_HANDLE_ID = 'Q'
const NOT_Q_HANDLE_ID = '!Q'
const outputHandleIds = [Q_HANDLE_ID, NOT_Q_HANDLE_ID]

interface JKFFData {
  on: boolean
}

function JKFFNode({ id }: NodeProps) {
  const { inboundState, outboundState, updateOutboundState } =
    useHandleState(id)
  const [previousInboundState, setPreviousInboundState] = useState<any>({})
  const [on, setOn] = useNodeDataState<JKFFData, boolean>(id, 'on', false)
  useEffect(() => {
    const newOutboundState: { [key: string]: boolean } = {
      [Q_HANDLE_ID]: on,
      [NOT_Q_HANDLE_ID]: !on,
    }
    updateOutboundState(newOutboundState)
  }, [on, updateOutboundState])

  useEffect(() => {
    if (
      inboundState[ENABLE_HANDLE_ID] &&
      !previousInboundState[ENABLE_HANDLE_ID]
    ) {
      if (inboundState[J_HANDLE_ID] && inboundState[K_HANDLE_ID]) {
        setOn(!on)
      } else if (inboundState[J_HANDLE_ID]) {
        setOn(true)
      } else if (inboundState[K_HANDLE_ID]) {
        setOn(false)
      }
    }
    setPreviousInboundState(inboundState)
  }, [JSON.stringify(inboundState), previousInboundState])

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
      <div style={{ color: 'black', padding: 10 }}>JKFF</div>
      <OutputHandleRegion>
        {outputHandleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            label={handleId}
            type="output"
            enabled={outboundState[handleId]}
            key={handleId}
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default JKFFNode
