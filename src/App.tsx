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
  ConnectionLineType,
} from 'reactflow'
import DataContext from './DataContext'
import Drawer from './Drawer'
import CreateNodeDrawer from './CreateNodeDrawer'
import { CustomNodeType, NODE_TYPES_IDS, defaultNodeTypes } from './nodeTypes'
import 'reactflow/dist/style.css'
import { CustomNodeData } from './nodes/CustomNode'
import useLocalStorageState from './useLocalStorageState'

const initialNodes: Node[] = []
const initialEdges: Edge[] = []
const edgeOptions: DefaultEdgeOptions = {
  animated: true,
  type: 'step',
  style: {
    stroke: 'white',
  },
}

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [data, setData] = useState({})
  const [nodeTypes, setNodeTypes] = useState(defaultNodeTypes)
  const [isCreatingCustomNodeType, setIsCreatingCustomNodeType] =
    useState(false)
  const [customNodeTypes, setCustomNodeTypes] = useLocalStorageState<
    CustomNodeType[]
  >('customNodeTypes', [])

  const nodeTypeMap = useMemo(
    () =>
      nodeTypes.reduce((acc, nodeType) => {
        acc[nodeType.id] = nodeType.node
        return acc
      }, {} as { [id: string]: any }),
    [nodeTypes]
  )

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
                hidden: true,
              },
              eds
            )
          )
      }

      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges, nodes]
  )

  const dataContextValue = useMemo(
    () => ({ value: data, setValue: setData }),
    [data]
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
      setCustomNodeTypes((prevValue) => prevValue.concat([newCustomNode]))
      setIsCreatingCustomNodeType(false)
    },
    [setCustomNodeTypes, setIsCreatingCustomNodeType]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DataContext.Provider value={dataContextValue}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={(a) => onEdgesChange(a)}
          onConnect={onConnect}
          nodeTypes={nodeTypeMap}
          defaultEdgeOptions={edgeOptions}
          connectionLineStyle={{ stroke: 'white' }}
          connectionLineType={ConnectionLineType.Step}
          snapToGrid={true}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left">
            <Drawer
              nodeTypes={nodeTypes}
              customNodeTypes={customNodeTypes}
              setNodeTypes={setNodeTypes}
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
      </DataContext.Provider>
    </div>
  )
}
