import { useCallback, useMemo } from 'react'
import { Edge, Node, useReactFlow, useNodes, useEdges } from 'reactflow'
import { v4 } from 'uuid'
import { CustomNodeType, NODE_TYPES_IDS, NodeType } from './nodeTypes'
import { useDrag } from 'react-dnd'
import NodeButton from './NodeButton'

interface DrawerProps {
  nodeTypes: NodeType[]
  customNodeTypes: CustomNodeType[]
  onCreateCustomNodeTypeClick: () => void
  createCustomNodeTypeEnabled: boolean
}

function Drawer({
  nodeTypes,
  customNodeTypes,
  onCreateCustomNodeTypeClick,
  createCustomNodeTypeEnabled,
}: DrawerProps) {
  const reactFlowInstance = useReactFlow()
  const nodes = useNodes<any>()
  const edges = useEdges<any>()

  const selectedNodes = useMemo(() => {
    return nodes.filter((n) => n.selected)
  }, [nodes])

  const selectedNodesMap = useMemo(() => {
    return selectedNodes.reduce((acc, node) => {
      acc[node.id] = node
      return acc
    }, {} as { [nodeId: string]: Node })
  }, [selectedNodes])

  const onDuplicateClick = useCallback(() => {
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
  }, [reactFlowInstance, nodes, edges, selectedNodes, selectedNodesMap])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 'auto',
        color: 'black',
      }}
    >
      {nodeTypes.map((nodeType) =>
        nodeType.hidden ? null : (
          <NodeButton nodeType={nodeType} key={nodeType.id} />
        )
      )}
      <div style={{ width: 10 }} />
      {customNodeTypes.map((customNodeType) => (
        <NodeButton nodeType={customNodeType} key={customNodeType.id} />
      ))}
      <button
        onClick={onCreateCustomNodeTypeClick}
        disabled={!createCustomNodeTypeEnabled}
      >
        + Create type
      </button>
      {/* <div style={{ margin: '20px 0 10px 0' }}>Tools</div>
      <button
        style={{
          marginBottom: 5,
        }}
        onClick={onDuplicateClick}
      >
        Duplicate
      </button>
      <button
        style={{
          marginBottom: 5,
        }}
        onClick={onCreateCustomNodeTypeClick}
        disabled={!createCustomNodeTypeEnabled}
      >
        Create type
      </button> */}
    </div>
  )
}

export default Drawer
