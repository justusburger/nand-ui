import { useEffect } from 'react'
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

  useEffect(() => {
    if (delay) setTimeout(() => setOutboundHandleState(state), delay)
    else setOutboundHandleState(state)
  }, [JSON.stringify(state), delay])
}

export default useOutboundState
