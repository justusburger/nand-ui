import { NodeProps } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import { useHandleState } from '../components/HandleStateProvider'
import useNodeDataState from '../useNodeDataState'
import { useEffect, useState } from 'react'
import React from 'react'

const INCREMENT = 'Increment'
const CLOCK = 'Clock'
const CLEAR = 'Clear'
const READ = 'Read'
const numberOfDataHandles = 4
const maxValue = Math.pow(2, numberOfDataHandles) - 1
const dataHandleIds = new Array(numberOfDataHandles)
  .fill(true)
  .map((_, i) => `d${i + 1}`)
const inputHandleIds = [INCREMENT, CLOCK, CLEAR, READ, ...dataHandleIds]

const outputHandleIds = [...dataHandleIds]

interface CounterData {
  count: number
}

function CounterNode({ id }: NodeProps) {
  const { inboundState, outboundState, updateOutboundState } =
    useHandleState(id)
  const [previousInboundState, setPreviousInboundState] = useState<any>({})
  const [count, setCount] = useNodeDataState<CounterData, number>(
    id,
    'count',
    0
  )
  useEffect(() => {
    const binary = count.toString(2).padStart(numberOfDataHandles, '0')
    const newOutboundState: any = {}
    for (let i = 0; i < numberOfDataHandles; i++) {
      newOutboundState[`d${i + 1}`] =
        binary[numberOfDataHandles - 1 - i] === '1'
    }
    updateOutboundState(newOutboundState)
  }, [count, updateOutboundState])

  useEffect(() => {
    if (inboundState[CLEAR]) {
      setCount(0)
    } else if (inboundState[CLOCK] && !previousInboundState[CLOCK]) {
      if (inboundState[READ]) {
        let value = 0
        for (let i = 0; i < numberOfDataHandles; i++) {
          const handleId = `d${i + 1}`
          const handleOn = inboundState[handleId]
          const columnValue = Math.pow(2, i)
          value += handleOn ? columnValue : 0
        }
        setCount(value)
      } else if (inboundState[INCREMENT]) {
        setCount((c) => {
          if (c === maxValue) return 0
          return c + 1
        })
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
      <div style={{ color: 'black', padding: 10 }}>Counter</div>
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

export default React.memo(CounterNode)
