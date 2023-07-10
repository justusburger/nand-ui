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

const initialNodes: Node[] = []
const initialEdges: Edge[] = []
const edgeOptions: DefaultEdgeOptions = {
  animated: true,
  style: {
    stroke: 'white',
  },
}

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isCreatingCustomNodeType, setIsCreatingCustomNodeType] =
    useState(false)
  const [customNodeTypes, setCustomNodeTypes] = useLocalStorageState<
    CustomNodeType[]
  >({ key: 'customNodeTypes', defaultValue: [] })

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds))
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
      ).length === 1
    const hasOutputsSelected =
      nodes.filter(
        (node) => node.type === NODE_TYPES_IDS.OUTPUT && node.selected
      ).length === 1
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
