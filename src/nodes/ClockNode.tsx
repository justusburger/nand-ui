import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import InputHandleRegion from '../InputHandleRegion'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'

const HALT_HANDLE_ID = 'halt'
const CLOCK_HANDLE_ID = 'out'
const inputHandleIds = [HALT_HANDLE_ID]

function ClockNode({ id }: NodeProps) {
  const [delay, setDelay] = useState(200)
  const [running, setRunning] = useState(false)
  const { inboundState, outboundState, updateOutboundState } =
    useHandleState(id)
  const onRef = useRef(false)
  useEffect(() => {
    if (running) {
      const intervalHandle = setInterval(() => {
        onRef.current = !onRef.current
        updateOutboundState({
          [CLOCK_HANDLE_ID]: onRef.current,
        })
      }, delay)
      return () => clearInterval(intervalHandle)
    }
  }, [running, delay])

  useEffect(() => {
    if (inboundState[HALT_HANDLE_ID]) setRunning(false)
  }, [inboundState[HALT_HANDLE_ID], setRunning])

  const toggleRunning = useCallback(() => {
    setRunning(!running)
  }, [setRunning, running])

  const reduceDelay = useCallback(() => {
    setDelay((delay) => delay - 50)
  }, [])
  const increaseDelay = useCallback(() => {
    setDelay((delay) => delay + 50)
  }, [])

  return (
    <NodeContainer>
      <NodeToolbar position={Position.Top}>
        <div className="flex items-center bg-white rounded p-1 text-black">
          {running ? (
            <button className="active:opacity-50" onClick={toggleRunning}>
              <PauseCircleIcon className="w-6 h-6" />
            </button>
          ) : (
            <button className="active:opacity-50" onClick={toggleRunning}>
              <PlayCircleIcon className="w-6 h-6" />
            </button>
          )}
          <button className="active:opacity-50 ml-2" onClick={reduceDelay}>
            <MinusCircleIcon className="w-6 h-6" />
          </button>
          <div className="text-xs">{delay}</div>
          <button className="active:opacity-50" onClick={increaseDelay}>
            <PlusCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </NodeToolbar>
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
      <div style={{ color: 'black', padding: 10 }}>
        <div>Clock</div>
      </div>
      <OutputHandleRegion>
        <NodeHandle
          id={CLOCK_HANDLE_ID}
          label={CLOCK_HANDLE_ID}
          type="output"
          enabled={outboundState[CLOCK_HANDLE_ID]}
          key={id}
        />
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default React.memo(ClockNode)
