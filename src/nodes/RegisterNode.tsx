import { NodeProps } from 'reactflow'
import { useEffect, useState } from 'react'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'

const dataInHandleId = 'Data in'
const readHandleId = 'Read'
const clockHandleId = 'Clock'
const outHandleId = 'out'
const inputHandleIds = [dataInHandleId, readHandleId, clockHandleId]

function RegisterNode({ id }: NodeProps) {
  const { inboundState, outboundState, updateOutboundState } =
    useHandleState(id)
  const [prevClockOn, setPrevClockOn] = useState<boolean>(false)
  useEffect(() => {
    if (
      inboundState[readHandleId] &&
      inboundState[clockHandleId] &&
      !prevClockOn
    ) {
      updateOutboundState({ [outHandleId]: inboundState[dataInHandleId] })
    }
    setPrevClockOn(inboundState[clockHandleId])
  }, [inboundState, prevClockOn])

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
      <div style={{ color: 'black', padding: 10 }}>Register</div>
      <OutputHandleRegion>
        <NodeHandle
          id={outHandleId}
          label={outHandleId}
          type="output"
          enabled={outboundState[outHandleId]}
          key={id}
        />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default React.memo(RegisterNode)
