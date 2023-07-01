import { useCallback } from 'react'
import { Edge, Node, useReactFlow } from 'reactflow'
import { v4 } from 'uuid'

interface NodeType {
  id: string
  name: string
}

interface DrawerProps {
  nodeTypes: NodeType[]
}

function Drawer({ nodeTypes }: DrawerProps) {
  const reactFlowInstance = useReactFlow()

  const onAddNode = useCallback(
    (type: string) => {
      reactFlowInstance.addNodes({
        type,
        id: `${reactFlowInstance.getNodes().length + 1}`,
        position: { x: 0, y: 0 },
        data: {},
      })
    },
    [reactFlowInstance]
  )

  const onDuplicateClick = useCallback(() => {
    const nodes = reactFlowInstance.getNodes()
    const edges = reactFlowInstance.getEdges()

    const selectedNodes = nodes.filter((n) => n.selected)
    const selectedNodesMap = selectedNodes.reduce((acc, node) => {
      acc[node.id] = node
      return acc
    }, {} as { [nodeId: string]: Node })
    const selectedToNewNodeLookup = {} as { [selectedNodeId: string]: string }
    const newNodes = selectedNodes.map((node) => {
      const newId = v4()
      selectedToNewNodeLookup[node.id] = newId
      return {
        id: newId,
        type: node.type,
        position: { x: node.position.x + 30, y: node.position.y + 30 },
        data: { ...node.data },
        selected: true,
      } as Node
    })

    const newEdges: Edge[] = []
    edges.forEach((edge) => {
      if (selectedNodesMap[edge.source] && selectedNodesMap[edge.target]) {
        newEdges.push({
          id: v4(),
          source: selectedToNewNodeLookup[edge.source],
          sourceHandle: edge.sourceHandle,
          target: selectedToNewNodeLookup[edge.target],
          targetHandle: edge.targetHandle,
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
  }, [reactFlowInstance])

  return (
    <div
      style={{
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        justifyContent: 'flex-start',
        width: 'auto',
        color: 'black',
        padding: 10,
      }}
    >
      <div style={{ marginBottom: 10 }}>Node types</div>
      {nodeTypes.map((nodeType) => (
        <button
          key={nodeType.id}
          style={{
            marginBottom: 5,
            fontSize: 13,
          }}
          onClick={() => onAddNode(nodeType.id)}
        >
          {nodeType.name}
        </button>
      ))}
      <div style={{ margin: '20px 0 10px 0' }}>Tools</div>
      <button
        style={{
          marginBottom: 5,
          fontSize: 13,
        }}
        onClick={onDuplicateClick}
      >
        Duplicate
      </button>
    </div>
  )
}

export default Drawer
