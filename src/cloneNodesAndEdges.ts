import { v4 } from 'uuid'
import { Node, Edge } from 'reactflow'

function cloneNodesAndEdges(nodes: Node[], edges: Edge[]): [Node[], Edge[]] {
  const newNodeIdLookup: Record<string, string> = {}
  const newNodes = nodes.map((node) => {
    const newNodeId = v4()
    newNodeIdLookup[node.id] = newNodeId
    return {
      ...node,
      data: {
        ...node.data,
      },
      id: newNodeId,
    }
  })
  const newEdges = edges.map((edge) => ({
    ...edge,
    id: v4(),
    source: newNodeIdLookup[edge.source],
    target: newNodeIdLookup[edge.target],
  }))
  return [newNodes, newEdges]
}

export default cloneNodesAndEdges
