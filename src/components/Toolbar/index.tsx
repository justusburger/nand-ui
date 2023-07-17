import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useCallback, useMemo } from 'react'
import { Edge, useEdges, useNodes, useReactFlow, Node } from 'reactflow'
import { v4 } from 'uuid'
import { NodeHandleData } from '../NodeHandle'

function Toolbar() {
  const reactFlowInstance = useReactFlow()
  const nodes = useNodes<any>()
  const edges = useEdges<any>()

  const selectedNodes = useMemo(() => nodes.filter((n) => n.selected), [nodes])
  const selectedNodesMap = useMemo(() => {
    return selectedNodes.reduce((acc, node) => {
      acc[node.id] = node
      return acc
    }, {} as { [nodeId: string]: any })
  }, [selectedNodes])

  const onDuplicateClick = useCallback(() => {
    const selectedToNewNodeLookup = {} as { [selectedNodeId: string]: string }
    const handleLookup = {} as { [oldHandleId: string]: string }
    const newNodes = selectedNodes.map((node) => {
      const newId = v4()
      selectedToNewNodeLookup[node.id] = newId
      return {
        id: newId,
        type: node.type,
        position: { x: node.position.x + 30, y: node.position.y + 30 },
        data: {
          ...node.data,
          handles: node.data.handles?.map((handleData: NodeHandleData) => {
            const newHandleId = v4()
            handleLookup[handleData.id] = newHandleId
            return {
              ...handleData,
              id: newHandleId,
            }
          }),
        },
        selected: true,
      } as Node
    })

    const newEdges: Edge[] = []
    edges.forEach((edge) => {
      if (selectedNodesMap[edge.source] && selectedNodesMap[edge.target]) {
        newEdges.push({
          id: v4(),
          source: selectedToNewNodeLookup[edge.source],
          sourceHandle: edge.sourceHandle
            ? handleLookup[edge.sourceHandle]
            : null,
          target: selectedToNewNodeLookup[edge.target],
          targetHandle: edge.targetHandle
            ? handleLookup[edge.targetHandle]
            : null,
          selected: true,
        } as Edge)
      }
    })

    reactFlowInstance.setNodes((nodes) =>
      nodes
        .map((node) => {
          if (node.selected)
            return {
              ...node,
              selected: false,
            }
          return node
        })
        .concat(newNodes)
    )

    reactFlowInstance.setEdges((edges) =>
      edges
        .map((edge) => {
          if (edge.selected)
            return {
              ...edge,
              selected: false,
            }
          return edge
        })
        .concat(newEdges)
    )
  }, [reactFlowInstance, nodes, edges, selectedNodes, selectedNodesMap])

  return (
    <div className="flex pb-10">
      <button
        className="bg-white rounded-full p-2 text-sm text-black inline-flex active:opacity-50"
        onClick={onDuplicateClick}
      >
        <DocumentDuplicateIcon className="w-6 h-6" title="Duplicate" />
      </button>
    </div>
  )
}

export default Toolbar
