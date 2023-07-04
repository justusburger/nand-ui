import { useCallback, useMemo } from 'react'
import { Edge, Node, useReactFlow, useNodes, useEdges } from 'reactflow'
import { v4 } from 'uuid'
import { NODE_TYPES_IDS } from './nodeTypes'
import type { InputNodeData } from './InputNode'
import type { OutputNodeData } from './OutputNode'
import CustomNode from './CustomNode'

interface NodeType {
  id: string
  name: string
  data?: any
  node: any
}

interface DrawerProps {
  nodeTypes: NodeType[]
  setNodeTypes: (newNodeTypes: NodeType[]) => void
}

function Drawer({ nodeTypes, setNodeTypes }: DrawerProps) {
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
      console.log(x, y, window.innerWidth, window.innerHeight, zoom)
      reactFlowInstance.addNodes({
        type: nodeType.id,
        id: v4(),
        position: {
          x: (window.innerWidth / 2 - x) / zoom - 50,
          y: (window.innerHeight / 2 - y) / zoom - 40,
        },
        data: nodeType.data || {},
        dragging: true,
      })
    },
    [reactFlowInstance]
  )

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

  const createTypeEnabled = useMemo(() => {
    const hasInputsSelected =
      nodes.filter(
        (node) => node.type === NODE_TYPES_IDS.INPUT && node.selected
      ).length === 1
    const hasOutputsSelected =
      nodes.filter(
        (node) => node.type === NODE_TYPES_IDS.OUTPUT && node.selected
      ).length === 1
    return hasInputsSelected && hasOutputsSelected
  }, [nodes])

  const onCreateTypeClick = useCallback(() => {
    const inputNode = selectedNodes.find(
      (node) => node.type === NODE_TYPES_IDS.INPUT
    )
    const outputNode = selectedNodes.find(
      (node) => node.type === NODE_TYPES_IDS.OUTPUT
    )

    setNodeTypes(
      nodeTypes.concat([
        {
          id: 'custom',
          name: 'Custom',
          data: {
            countInputHandles: (inputNode?.data as InputNodeData).countHandles,
            countOutputHandles: (outputNode?.data as OutputNodeData)
              .countHandles,
          },
          node: CustomNode,
        },
      ])
    )
  }, [selectedNodes, nodeTypes])

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
          onMouseDownCapture={() => onAddNode(nodeType)}
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
      <button
        style={{
          marginBottom: 5,
          fontSize: 13,
        }}
        onClick={onCreateTypeClick}
        disabled={!createTypeEnabled}
      >
        Create type
      </button>
    </div>
  )
}

export default Drawer
