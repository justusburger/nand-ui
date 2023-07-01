import { useCallback, useMemo, useState } from 'react'
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
} from 'reactflow'
import AndNode from './AndNode'
import OrNode from './OrNode'
import XORNode from './XORNode'
import InputNode from './InputNode'
import OutputNode from './OutputNode'
import DataContext from './DataContext'
import Drawer from './Drawer'

import 'reactflow/dist/style.css'

const initialNodes: Node[] = [
  // { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  // { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
  // {
  //   id: 'input-1',
  //   type: 'input8',
  //   position: { x: 0, y: 0, width: 10 },
  //   width: 10,
  //   data: {},
  // },
  // {
  //   id: 'input-2',
  //   type: 'input8',
  //   position: { x: 0, y: 300, width: 10 },
  //   width: 10,
  //   data: {},
  // },
  // {
  //   id: 'node-1',
  //   type: 'and',
  //   position: { x: 300, y: 0 },
  //   data: {},
  // },
  // {
  //   id: 'node-2',
  //   type: 'and',
  //   position: { x: 300, y: 150 },
  //   data: {},
  // },
  // {
  //   id: 'node-3',
  //   type: 'and',
  //   position: { x: 300, y: 300 },
  //   data: {},
  // },
  // {
  //   id: 'node-4',
  //   type: 'or',
  //   position: { x: 300, y: 450 },
  //   data: {},
  // },
  // {
  //   id: 'node-5',
  //   type: 'or',
  //   position: { x: 300, y: 600 },
  //   data: {},
  // },
  // {
  //   id: 'node-6',
  //   type: 'xor',
  //   position: { x: 300, y: 750 },
  //   data: {},
  // },
  // {
  //   id: 'node-7',
  //   type: 'xor',
  //   position: { x: 300, y: 900 },
  //   data: {},
  // },
]
const initialEdges: Edge[] = []
const edgeOptions = {
  animated: true,
  style: {
    stroke: 'white',
  },
}

const nodeTypes = [
  {
    id: 'in',
    name: 'Input',
    node: InputNode,
  },
  {
    id: 'out',
    name: 'Output',
    node: OutputNode,
  },
  {
    id: 'and',
    name: 'AND',
    node: AndNode,
  },
  {
    id: 'or',
    name: 'OR',
    node: OrNode,
  },
  {
    id: 'xor',
    name: 'XOR',
    node: XORNode,
  },
]

const nodeTypeMap = nodeTypes.reduce((acc, nodeType) => {
  acc[nodeType.id] = nodeType.node
  return acc
}, {} as { [id: string]: any })

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [data, setData] = useState({})

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const dataContextValue = useMemo(
    () => ({ value: data, setValue: setData }),
    [data]
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DataContext.Provider value={dataContextValue}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypeMap}
          defaultEdgeOptions={edgeOptions}
          connectionLineStyle={{ stroke: 'white' }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left">
            <Drawer nodeTypes={nodeTypes} />
          </Panel>
        </ReactFlow>
      </DataContext.Provider>
    </div>
  )
}
