import { useEffect } from 'react'
import useNodeDataState from './useNodeDataState'

export type OutboundHandleState = { [handleId: string]: boolean }
export interface NodeWithOutboundStateData {
  outboundHandleState: OutboundHandleState
}

function useOutboundState(
  nodeId: string,
  state: { [handleId: string]: boolean }
) {
  const [, setOutboundHandleState] = useNodeDataState<
    NodeWithOutboundStateData,
    OutboundHandleState
  >(nodeId, 'outboundHandleState', {})

  useEffect(() => {
    setOutboundHandleState(state)
  }, [JSON.stringify(state)])
}

export default useOutboundState
