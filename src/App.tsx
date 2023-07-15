import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Edge,
  Node,
  BackgroundVariant,
  OnConnect,
  DefaultEdgeOptions,
  useReactFlow,
  EdgeTypes,
} from 'reactflow'
import Drawer from './Drawer'
import CreateNodeDrawer from './CreateNodeDrawer'
import {
  CustomNodeType,
  NODE_TYPES_IDS,
  defaultNodeTypes,
  defaultNodeTypeMap,
  NodeType,
} from './nodeTypes'
import 'reactflow/dist/style.css'
import useLocalStorageState from './useLocalStorageState'
import { useDrop } from 'react-dnd'
import { v4 } from 'uuid'
import NodeEdge from './NodeEdge'

const initialNodes: Node[] = JSON.parse(localStorage.getItem('nodes') || '[]')
const initialEdges: Edge[] = JSON.parse(localStorage.getItem('edges') || '[]')
const edgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: {
    stroke: 'white',
  },
}

const edgeTypes: EdgeTypes = {
  nodeEdge: NodeEdge,
}

interface AppProps {
  initialNodes: Node[]
  saveNodes: (nodes: Node[]) => Promise<void>
  initialEdges: Edge[]
  saveEdges: (edges: Edge[]) => Promise<void>
  initialCustomNodeTypes: CustomNodeType[]
  saveCustomNodeTypes: (customNodeTypes: CustomNodeType[]) => Promise<void>
}

export default function App({
  initialNodes,
  saveNodes,
  initialEdges,
  saveEdges,
  initialCustomNodeTypes,
  saveCustomNodeTypes,
}: AppProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  useEffect(() => {
    saveNodes(nodes)
  }, [nodes])
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  useEffect(() => {
    saveEdges(edges)
  }, [edges])
  const [customNodeTypes, setCustomNodeTypes] = useState<CustomNodeType[]>(
    initialCustomNodeTypes
  )
  useEffect(() => {
    saveCustomNodeTypes(customNodeTypes)
  }, [customNodeTypes])
  // useEffect(() => {
  //   localStorage.setItem('nodes', JSON.stringify(nodes))
  // }, [nodes])
  // useEffect(() => {
  //   localStorage.setItem('edges', JSON.stringify(edges))
  // }, [edges])
  const [isCreatingCustomNodeType, setIsCreatingCustomNodeType] =
    useState(false)

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'nodeEdge' }, eds))
    },
    [setEdges, nodes]
  )

  const onCreateCustomNodeTypeClick = useCallback(() => {
    setIsCreatingCustomNodeType(true)
  }, [setIsCreatingCustomNodeType])

  const onCreateCustomNodeTypeClose = useCallback(() => {
    setIsCreatingCustomNodeType(false)
  }, [setIsCreatingCustomNodeType])

  const createCustomNodeTypeEnabled = useMemo(() => {
    const hasInputsSelected =
      nodes.filter(
        (node) => node.type === NODE_TYPES_IDS.INPUT && node.selected
      ).length > 0
    const hasOutputsSelected =
      nodes.filter(
        (node) => node.type === NODE_TYPES_IDS.OUTPUT && node.selected
      ).length > 0
    return hasInputsSelected && hasOutputsSelected
  }, [nodes])

  useEffect(() => {
    if (isCreatingCustomNodeType && !createCustomNodeTypeEnabled)
      setIsCreatingCustomNodeType(false)
  }, [isCreatingCustomNodeType, createCustomNodeTypeEnabled])

  const onCreateTypeComplete = useCallback(
    (newCustomNode: CustomNodeType) => {
      setCustomNodeTypes(customNodeTypes.concat([newCustomNode]))
      setIsCreatingCustomNodeType(false)
    },
    [setCustomNodeTypes, setIsCreatingCustomNodeType, customNodeTypes]
  )

  const reactFlowInstance = useReactFlow()
  const [, drop] = useDrop(
    () => ({
      accept: 'node',
      drop: (nodeType: NodeType, manager) => {
        const { x, y, zoom } = reactFlowInstance.getViewport()
        const dropPosition = manager.getClientOffset()
        if (!dropPosition) throw new Error('No drop location')
        const customNode = !defaultNodeTypeMap[nodeType.id]
        reactFlowInstance.addNodes({
          type: customNode ? NODE_TYPES_IDS.CUSTOM : nodeType.id,
          id: v4(),
          position: {
            x: (dropPosition.x - x) / zoom,
            y: (dropPosition.y - y) / zoom,
          },
          data: nodeType.data || {},
        })
      },
    }),
    [reactFlowInstance]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={drop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={defaultNodeTypeMap}
        defaultEdgeOptions={edgeOptions}
        connectionLineStyle={{ stroke: 'white' }}
        snapToGrid={true}
        edgeTypes={edgeTypes}
      >
        <Controls position="bottom-right" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="bottom-left">
          <Drawer
            nodeTypes={defaultNodeTypes}
            customNodeTypes={customNodeTypes}
            onCreateCustomNodeTypeClick={onCreateCustomNodeTypeClick}
            createCustomNodeTypeEnabled={createCustomNodeTypeEnabled}
          />
        </Panel>
        <Panel position="top-right">
          {createCustomNodeTypeEnabled && isCreatingCustomNodeType && (
            <CreateNodeDrawer
              onClose={onCreateCustomNodeTypeClose}
              onCreate={onCreateTypeComplete}
            />
          )}
        </Panel>
      </ReactFlow>
    </div>
  )
}
