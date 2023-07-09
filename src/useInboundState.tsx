import { useMemo } from 'react'
import { Node, useEdges, useNodes } from 'reactflow'

function useInboundState(nodeId: string) {
  const edges = useEdges()
  const nodes = useNodes()
  const nodesLookup = useMemo(
    () =>
      nodes.reduce((acc, node) => {
        acc[node.id] = node
        return acc
      }, {} as { [key: string]: Node }),
    [nodes]
  )
  const inboundEdgesWithNodes = useMemo(
    () =>
      edges
        .filter((e) => e.target === nodeId)
        .map((edge) => {
          edge.sourceNode = nodesLookup[edge.source]
          return edge
        }),
    [edges, nodesLookup]
  )

  console.log(inboundEdgesWithNodes)

  const values = useMemo(() => {
    if (!nodeId) return {}
    return inboundEdgesWithNodes.reduce((acc, edge) => {
      const { outboundHandleState = {} } = edge.sourceNode!.data
      acc[edge.targetHandle!] =
        acc[edge.targetHandle!] || outboundHandleState[edge.sourceHandle!]
      return acc
    }, {} as { [key: string]: boolean })
  }, [inboundEdgesWithNodes, nodeId])

  return values
}

export default useInboundState
