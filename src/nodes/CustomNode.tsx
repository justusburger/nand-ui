import { useEffect, useMemo } from 'react'
import NodeHandle from '../components/NodeHandle'
import {
  useReactFlow,
  NodeProps,
  Node,
  Controls,
  useNodesState,
  useEdgesState,
  useNodes,
  useEdges,
  EdgeTypes,
} from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import {
  CustomNodeTypeData,
  NODE_TYPES_IDS,
  defaultNodeTypeMap,
} from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'
import { ReactFlowProvider, ReactFlow } from 'reactflow'
import useOutboundState from '../useOutboundState'
import NodeEdge from '../NodeEdge'
import getHandleBinaryValue from '../getHandleBinaryValue'

const edgeTypes: EdgeTypes = {
  nodeEdge: NodeEdge,
}

function CustomNode({ id, data }: NodeProps<CustomNodeTypeData>) {
  const [childNodes, setChildNodes, onChildNodesChange] = useNodesState(
    data.nodes.map((node) => {
      node.selectable = false
      node.selected = false
      node.deletable = false
      return node
    })
  )
  const [childEdges, , onChildEdgesChange] = useEdgesState(
    data.edges.map((edge) => {
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

  const inputNodes: Node<InputNodeData>[] = useMemo(
    () => childNodes.filter((node) => node.type === NODE_TYPES_IDS.INPUT),
    [childNodes]
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
  useOutboundState(id, outboundState, 1)

  const binaryOutputHandles = useMemo(() => {
    return outputNodeData?.handles.filter((handle) => handle.isBinary)
  }, [outputNodeData])
  const nonBinaryOutputHandles = useMemo(() => {
    return outputNodeData?.handles.filter((handle) => !handle.isBinary)
  }, [outputNodeData])

  useEffect(() => {
    setChildNodes((nodes) =>
      nodes?.map((childNode: Node) => {
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
  }, [JSON.stringify(inboundState), reactFlowInstance, id])

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputNodes.map((inputNode) => (
          <div
            key={inputNode.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            {inputNode.data.handles
              .filter((handleData) => handleData.isBinary)
              .map((handleData, i) => (
                <NodeHandle
                  label={handleData.label || Math.pow(2, i).toString()}
                  id={handleData.id}
                  key={handleData.id}
                  enabled={inboundState[handleData.id]}
                  type="input"
                />
              ))}
            {inputNode.data.handles
              .filter((handleData) => !handleData.isBinary)
              .map((handleData) => (
                <NodeHandle
                  label={handleData.label}
                  id={handleData.id}
                  key={handleData.id}
                  enabled={inboundState[handleData.id]}
                  type="input"
                />
              ))}
          </div>
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
        {nonBinaryOutputHandles.map((handleData) => (
          <NodeHandle
            label={handleData.label}
            id={handleData.id}
            key={handleData.id}
            enabled={outboundState[handleData.id]}
            type="output"
          />
        ))}
        {binaryOutputHandles.map((handleData, i) => (
          <NodeHandle
            label={
              handleData.label ||
              getHandleBinaryValue(i, outputNodeData?.handles.length).toString()
            }
            id={handleData.id}
            key={handleData.id}
            enabled={outboundState[handleData.id]}
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
