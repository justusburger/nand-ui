import { useEffect, useMemo } from 'react'
import NodeHandle from '../NodeHandle'
import {
  useReactFlow,
  NodeProps,
  Node,
  Controls,
  useNodesState,
  useEdgesState,
  useNodes,
  useEdges,
} from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import {
  CustomNodeType,
  NODE_TYPES_IDS,
  defaultNodeTypeMap,
} from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'
import { ReactFlowProvider, ReactFlow } from 'reactflow'
import useOutboundState from '../useOutboundState'

export interface CustomNodeData {
  customNodeType: CustomNodeType
}

function CustomNode({
  id,
  data: { customNodeType },
}: NodeProps<CustomNodeData>) {
  const [childNodes, setChildNodes, onChildNodesChange] = useNodesState(
    customNodeType.nodes.map((node) => {
      node.selectable = false
      node.selected = false
      node.deletable = false
      return node
    })
  )
  const [childEdges, , onChildEdgesChange] = useEdgesState(
    customNodeType.edges.map((edge) => {
      edge.selected = false
      edge.deletable = false
      edge.focusable = false
      edge.updatable = false
      return edge
    })
  )
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const reactFlowInstance = useReactFlow()

  const inputNode = useMemo(
    () => childNodes.find((node) => node.type === NODE_TYPES_IDS.INPUT),
    [childNodes]
  )
  const inputNodeData = useMemo(
    () => inputNode?.data as InputNodeData,
    [inputNode]
  )

  const outputNode = useMemo(
    () => childNodes.find((node) => node.type === NODE_TYPES_IDS.OUTPUT),
    [childNodes]
  )
  const outputNodeData = useMemo(
    () => outputNode?.data as OutputNodeData,
    [outputNode]
  )

  const outboundState = useInboundState(outputNode?.id, childNodes, childEdges)
  useOutboundState(id, outboundState)

  const inputHandleIds = useMemo(() => {
    return new Array(inputNodeData?.countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [inputNodeData])

  useEffect(() => {
    setChildNodes((nodes) =>
      nodes.map((childNode: Node) => {
        if (childNode.type === NODE_TYPES_IDS.INPUT) {
          childNode.data = {
            ...childNode.data,
            outboundHandleState: { ...inboundState },
          }
          return childNode
        }
        return childNode
      })
    )
  }, [JSON.stringify(inboundState), inputNode, reactFlowInstance, id])

  const outputHandleIds = useMemo(() => {
    return new Array(outputNodeData?.countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [outputNodeData])

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputHandleIds.map((handleId) => (
          <NodeHandle
            id={`${handleId}`}
            key={handleId}
            enabled={inboundState[handleId]}
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
        <div style={{ fontSize: 18 }}>{customNodeType.name}</div>
      </div>
      <OutputHandleRegion>
        {outputHandleIds.map((handleId) => (
          <NodeHandle
            id={`${handleId}`}
            key={handleId}
            enabled={outboundState[handleId]}
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
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </NodeContainer>
  )
}

export default CustomNode
