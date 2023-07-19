import { useEffect, useRef, useState } from 'react'
import useNodeDataState from './useNodeDataState'

export type OutboundHandleState = { [handleId: string]: boolean }
export interface NodeWithOutboundStateData {
  outboundHandleState: OutboundHandleState
}

function useOutboundState(
  nodeId: string,
  state: { [handleId: string]: boolean },
  delay?: number
) {
  const [, setOutboundHandleState] = useNodeDataState<
    NodeWithOutboundStateData,
    OutboundHandleState
  >(nodeId, 'outboundHandleState', {})
  const timeoutRef = useRef<number>()

  useEffect(() => {
    if (delay) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(
        () => setOutboundHandleState(state),
        delay
      )
    } else setOutboundHandleState(state)
  }, [JSON.stringify(state), delay, timeoutRef])
}

export default useOutboundState
