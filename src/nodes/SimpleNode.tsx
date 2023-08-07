import NodeHandle from '../components/NodeHandle'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'

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
  const { inboundState, outboundState } = useHandleState(id, (inboundState) => {
    return {
      [outputHandleId]: outputEnabled(inboundState),
    }
  })

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

export default React.memo(SimpleNode)
