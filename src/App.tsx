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
} from 'reactflow'
import Drawer from './Drawer'
import CreateNodeDrawer from './CreateNodeDrawer'
import {
  CustomNodeType,
  NODE_TYPES_IDS,
  defaultNodeTypes,
  defaultNodeTypeMap,
} from './nodeTypes'
import 'reactflow/dist/style.css'
import { CustomNodeData } from './nodes/CustomNode'
import useLocalStorageState from './useLocalStorageState'

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

  const selectedNodes = nodes.filter((node) => node.selected)
  if (selectedNodes.length > 0)
    console.log(selectedNodes[0].data?.outboundHandleState)

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const customNodeTarget = nodes.find(
        (node) =>
          node.id === connection.target && node.type === NODE_TYPES_IDS.CUSTOM
      )
      if (customNodeTarget) {
        const { customNodeType } = customNodeTarget.data as CustomNodeData
        const customNodeTargetInputRelay = customNodeType.nodes.find(
          (node) => node.type === NODE_TYPES_IDS.INPUT_RELAY
        )
        if (customNodeTargetInputRelay)
          setEdges((eds) =>
            addEdge(
              {
                ...connection,
                target: customNodeTargetInputRelay.id,
                // hidden: true,
              },
              eds
            )
          )
      }

      const customNodeSource = nodes.find(
        (node) =>
          node.id === connection.source && node.type === NODE_TYPES_IDS.CUSTOM
      )
      if (customNodeSource) {
        const { customNodeType } = customNodeSource.data as CustomNodeData
        const customNodeTargetOutputRelay = customNodeType.nodes.find(
          (node) => node.type === NODE_TYPES_IDS.OUTPUT_RELAY
        )
        if (customNodeTargetOutputRelay)
          setEdges((eds) =>
            addEdge(
              {
                ...connection,
                source: customNodeTargetOutputRelay.id,
                // hidden: true,
              },
              eds
            )
          )
      }

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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
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
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-left">
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
