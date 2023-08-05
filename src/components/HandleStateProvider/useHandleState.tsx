import { useCallback, useContext, useMemo } from 'react'
import Context from './Context'
import { useStore } from 'reactflow'

type HandleStateReducer = (
  inbound: Record<string, boolean>
) => Record<string, boolean>

function useHandleState(
  nodeId?: string,
  reducer?: HandleStateReducer
): {
  inboundState: Record<string, boolean>
  outboundState: Record<string, boolean>
  updateOutboundState: (newOutboundState: Record<string, boolean>) => void
} {
  const providerState = useContext(Context)
  const { edges, nodeInternals } = useStore((state) => state)
  const updateOutboundState = useCallback(
    (newOutboundState: Record<string, boolean>) => {
      if (!nodeId) return
      providerState.updateNode(nodeId, newOutboundState)
    },
    [providerState.updateNode, nodeId]
  )
  const value = useMemo(() => {
    if (!nodeId)
      return {
        inboundState: {},
        outboundState: {},
        updateOutboundState,
      }
    const inboundEdges = edges.filter((edge) => edge.target === nodeId)
    const inboundState = inboundEdges.reduce((acc, edge) => {
      if (!edge.sourceHandle || !edge.targetHandle) return acc
      const sourceNode = providerState.nodes[edge.source] || {}
      acc[edge.targetHandle] =
        acc[edge.targetHandle] || sourceNode[edge.sourceHandle]
      return acc
    }, {} as Record<string, boolean>)
    const prevOutboundState = providerState.nodes[nodeId] || {}
    let newOutboundState = prevOutboundState
    if (reducer) {
      newOutboundState = reducer(inboundState)
      updateOutboundState(newOutboundState)
    }
    return {
      inboundState,
      outboundState: newOutboundState,
      updateOutboundState,
    }
  }, [providerState, edges, nodeInternals, updateOutboundState])
  return value
}

export default useHandleState
