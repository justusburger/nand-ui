import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect } from 'react'
import { useEdges, useNodes, useReactFlow, Node } from 'reactflow'
import cloneNodesAndEdges from '../../cloneNodesAndEdges'
import { NODE_TYPES_IDS } from '../../nodeTypes'

function Toolbar() {
  const reactFlowInstance = useReactFlow()
  const nodes = useNodes<any>()
  const edges = useEdges<any>()

  const onDuplicateClick = useCallback(() => {
    const selectedNodes: Node[] = []
    const selectedNodesMap: Record<string, Node> = {}
    nodes.forEach((node) => {
      if (!node.selected) return
      selectedNodes.push(node)
      selectedNodesMap[node.id] = node
    })
    const selectedEdges = edges.filter(
      (edge) => selectedNodesMap[edge.source] && selectedNodesMap[edge.target]
    )
    let [newNodes, newEdges] = cloneNodesAndEdges(selectedNodes, selectedEdges)

    newNodes.forEach((node) => {
      node.position = { x: node.position.x + 30, y: node.position.y + 30 }
      if (node.type === NODE_TYPES_IDS.CUSTOM) {
        const [initialNodes, initialEdges] = cloneNodesAndEdges(
          node.data.nodes.map((node: any) => ({
            ...node,
            selected: false,
            selectable: false,
            deletable: false,
          })),
          node.data.edges.map((edge: any) => ({
            ...edge,
            selected: false,
            deletable: false,
            focusable: false,
            updatable: false,
          }))
        )
        node.data = {
          ...node.data,
          initialNodes,
          initialEdges,
        }
      }
      return node
    })

    // const selectedToNewNodeLookup = {} as { [selectedNodeId: string]: string }
    // const handleLookup = {} as { [oldHandleId: string]: string }
    // const newNodes = selectedNodes.map((node) => {
    //   const newId = v4()
    //   selectedToNewNodeLookup[node.id] = newId
    //   return {
    //     id: newId,
    //     type: node.type,
    //     position: { x: node.position.x + 30, y: node.position.y + 30 },
    //     data: {
    //       ...node.data,
    //       handles: node.data.handles?.map((handleData: NodeHandleData) => {
    //         const newHandleId = v4()
    //         handleLookup[handleData.id] = newHandleId
    //         return {
    //           ...handleData,
    //           id: newHandleId,
    //         }
    //       }),
    //     },
    //     selected: true,
    //   } as Node
    // })
    // const newEdges: Edge[] = []
    // edges.forEach((edge) => {
    //   if (selectedNodesMap[edge.source] && selectedNodesMap[edge.target]) {
    //     newEdges.push({
    //       id: v4(),
    //       source: selectedToNewNodeLookup[edge.source],
    //       sourceHandle: edge.sourceHandle
    //         ? handleLookup[edge.sourceHandle]
    //         : null,
    //       target: selectedToNewNodeLookup[edge.target],
    //       targetHandle: edge.targetHandle
    //         ? handleLookup[edge.targetHandle]
    //         : null,
    //       selected: true,
    //     } as Edge)
    //   }
    // })
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
  }, [reactFlowInstance, nodes, edges])

  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      if (e.key === 'd' && e.metaKey) {
        onDuplicateClick()
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKeyPress)
    return () => document.removeEventListener('keydown', onKeyPress)
  }, [onDuplicateClick])

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
