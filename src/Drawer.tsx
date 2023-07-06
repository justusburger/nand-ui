import { useCallback, useMemo } from 'react'
import { Edge, Node, useReactFlow, useNodes, useEdges } from 'reactflow'
import { v4 } from 'uuid'
import { CustomNodeType, NODE_TYPES_IDS, NodeType } from './nodeTypes'

interface DrawerProps {
  nodeTypes: NodeType[]
  customNodeTypes: CustomNodeType[]
  setNodeTypes: (newNodeTypes: NodeType[]) => void
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

  const onAddNode = useCallback(
    (nodeType: NodeType) => {
      const { x, y, zoom } = reactFlowInstance.getViewport()
      reactFlowInstance.addNodes({
        type: nodeType.id,
        id: v4(),
        position: {
          x: (window.innerWidth / 2 - x) / zoom - 50,
          y: (window.innerHeight / 2 - y) / zoom - 40,
        },
        data: nodeType.data || {},
      })
    },
    [reactFlowInstance]
  )

  const onAddCustomNode = useCallback((customNodeType: CustomNodeType) => {
    const { x, y, zoom } = reactFlowInstance.getViewport()
    const parentNodeId = v4()
    const oldToNewNodeIdLookup: Record<string, string> = {}
    const newNodes = customNodeType.nodes.map((node) => {
      const newNodeId = v4()
      oldToNewNodeIdLookup[node.id] = newNodeId
      let newType = node.type
      if (newType === NODE_TYPES_IDS.INPUT) newType = NODE_TYPES_IDS.INPUT_RELAY
      if (newType === NODE_TYPES_IDS.OUTPUT)
        newType = NODE_TYPES_IDS.OUTPUT_RELAY

      return {
        ...node,
        type: newType,
        id: newNodeId,
        data: {
          ...node.data,
          parentNodeId,
        },
        parentNode: parentNodeId,
        // style: { display: 'none' },
      }
    })
    const newEdges = customNodeType.edges.map((edge) => {
      return {
        ...edge,
        source: oldToNewNodeIdLookup[edge.source],
        target: oldToNewNodeIdLookup[edge.target],
        id: v4(),
        // hidden: true,
      }
    })
    reactFlowInstance.addNodes(newNodes)
    reactFlowInstance.addEdges(newEdges)
    reactFlowInstance.addNodes({
      type: NODE_TYPES_IDS.CUSTOM,
      id: parentNodeId,
      position: {
        x: (window.innerWidth / 2 - x) / zoom - 50,
        y: (window.innerHeight / 2 - y) / zoom - 40,
      },
      data: {
        customNodeType: {
          ...customNodeType,
          nodes: newNodes,
          edges: newEdges,
        },
      },
    })
  }, [])

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
      className="card-background"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 'auto',
        color: 'black',
        padding: 10,
      }}
    >
      <div style={{ marginBottom: 10 }}>Node types</div>
      {nodeTypes.map((nodeType) =>
        nodeType.hidden ? null : (
          <button
            key={nodeType.id}
            style={{
              marginBottom: 5,
            }}
            onClick={() => onAddNode(nodeType)}
          >
            {nodeType.name}
          </button>
        )
      )}
      {customNodeTypes.map((customNodeType) => (
        <button
          key={customNodeType.id}
          style={{
            marginBottom: 5,
          }}
          onClick={() => onAddCustomNode(customNodeType)}
        >
          {customNodeType.name}
        </button>
      ))}
      <div style={{ margin: '20px 0 10px 0' }}>Tools</div>
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
      </button>
    </div>
  )
}

export default Drawer
