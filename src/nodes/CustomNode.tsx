import { useCallback, useEffect, useMemo } from 'react'
import NodeHandle from '../components/NodeHandle'
import {
  useReactFlow,
  NodeProps,
  Node,
  Controls,
  useNodesState,
  useEdgesState,
  EdgeTypes,
  NodeToolbar,
  Position,
} from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import {
  CustomNodeTypeData,
  NODE_TYPES_IDS,
  defaultNodeTypeMap,
} from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'
import { ReactFlowProvider, ReactFlow } from 'reactflow'
import NodeEdge from '../NodeEdge'
import { useHandleState } from '../components/HandleStateProvider'

const edgeTypes: EdgeTypes = {
  nodeEdge: NodeEdge,
}

function CustomNode({ id, data }: NodeProps<CustomNodeTypeData>) {
  const [childNodes, , onChildNodesChange] = useNodesState(data.initialNodes)
  const [childEdges, , onChildEdgesChange] = useEdgesState(data.initialEdges)
  const parentHandleState = useHandleState(id)
  const reactFlowInstance = useReactFlow()

  const inputNode: Node<InputNodeData> = useMemo(
    () => childNodes.find((node) => node.type === NODE_TYPES_IDS.INPUT)!,
    [childNodes]
  )

  const outputNode: Node<OutputNodeData> = useMemo(
    () => childNodes.find((node) => node.type === NODE_TYPES_IDS.OUTPUT)!,
    [childNodes]
  )

  const childInputHandleState = useHandleState(outputNode?.id)
  const childOutputHandleState = useHandleState(outputNode?.id)
  useEffect(() => {
    childInputHandleState.updateOutboundState(parentHandleState.inboundState)
    parentHandleState.updateOutboundState(childOutputHandleState.inboundState)
  }, [parentHandleState, childInputHandleState, childOutputHandleState])

  const onUnpackClick = useCallback(() => {
    reactFlowInstance.setNodes((nodes) =>
      nodes
        .map((node) => {
          node.selected = false
          return node
        })
        .concat(
          data.nodes.map((node) => {
            node.selectable = true
            node.selected = true
            node.deletable = true
            return node
          })
        )
    )
    reactFlowInstance.setEdges((edges) =>
      edges
        .map((edge) => {
          edge.selected = false
          return edge
        })
        .concat(
          data.edges.map((edge) => {
            edge.selected = true
            edge.deletable = true
            edge.focusable = true
            edge.updatable = true
            return edge
          })
        )
    )
  }, [reactFlowInstance, data.nodes])

  return (
    <NodeContainer>
      <NodeToolbar position={Position.Top}>
        <button
          className="bg-white text-black text-sm rounded px-2 py-1 active:opacity-50"
          onClick={onUnpackClick}
        >
          Unpack
        </button>
      </NodeToolbar>
      <InputHandleRegion>
        {inputNode.data.handles.map((handleData, i) => (
          <NodeHandle
            label={handleData.label || Math.pow(2, i).toString()}
            id={handleData.id}
            key={handleData.id}
            enabled={parentHandleState.inboundState[handleData.id]}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div
        style={{
          color: 'black',
          padding: '10px 10px 10px 10px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18 }}>{data.name}</div>
      </div>
      <OutputHandleRegion>
        {outputNode.data.handles.map((handleData) => (
          <NodeHandle
            label={handleData.label}
            id={handleData.id}
            key={handleData.id}
            enabled={parentHandleState.outboundState[handleData.id]}
            type="output"
          />
        ))}
      </OutputHandleRegion>
      <ReactFlowProvider>
        <div style={{ background: '#000', width: 0, height: 0 }}>
          <ReactFlow
            nodes={childNodes}
            edges={childEdges}
            onNodesChange={onChildNodesChange}
            onEdgesChange={onChildEdgesChange}
            nodeTypes={defaultNodeTypeMap}
            edgeTypes={edgeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </NodeContainer>
  )
}

export default CustomNode
