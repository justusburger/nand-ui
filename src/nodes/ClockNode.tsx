import { NodeProps, NodeToolbar, Position, useEdges, useNodes } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeHandle from '../components/NodeHandle'
import useOutboundState from '../useOutboundState'
import { useCallback, useEffect, useState } from 'react'
import {
  PlayCircleIcon,
  PauseCircleIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'

const HALT_HANDLE_ID = 'halt'
const CLOCK_HANDLE_ID = 'out'
const inputHandleIds = [HALT_HANDLE_ID]

function ClockNode({ id }: NodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const [on, setOn] = useState(false)
  const [delay, setDelay] = useState(800)
  const [running, setRunning] = useState(false)
  const outboundState = {
    [CLOCK_HANDLE_ID]: on,
  }

  useOutboundState(id, outboundState)

  useEffect(() => {
    if (running) {
      const intervalHandle = setInterval(() => setOn((on) => !on), delay)
      return () => clearInterval(intervalHandle)
    }
  }, [setOn, running, delay])

  useEffect(() => {
    if (inboundState[HALT_HANDLE_ID]) setRunning(false)
  }, [inboundState[HALT_HANDLE_ID], setRunning])

  const toggleRunning = useCallback(() => {
    setRunning(!running)
    if (running) setOn(false)
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

export default ClockNode
