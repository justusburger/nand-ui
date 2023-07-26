import { useEffect, useMemo, useState } from 'react'
import { Edge, Node } from 'reactflow'

function useInboundState(
  nodeId: string | undefined,
  nodes: Node[],
  edges: Edge[]
) {
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

  const [values, setValues] = useState({})

  useEffect(() => {
    if (!nodeId) return
    const newValues = inboundEdgesWithNodes.reduce((acc, edge) => {
      const { outboundHandleState = {} } = edge.sourceNode?.data || {}
      acc[edge.targetHandle!] =
        acc[edge.targetHandle!] || outboundHandleState[edge.sourceHandle!]
      return acc
    }, {} as { [key: string]: boolean })
    if (JSON.stringify(newValues) !== JSON.stringify(values))
      setValues(newValues)
  }, [inboundEdgesWithNodes, nodeId, values])

  return values
}

export default useInboundState
