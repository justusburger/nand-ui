import { useCallback, useEffect, useMemo } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
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
import {
  useHandleState,
  useHandleStateInternal,
} from '../components/HandleStateProvider'
import React from 'react'
import cloneNodesAndEdges from '../cloneNodesAndEdges'

const edgeTypes: EdgeTypes = {
  nodeEdge: NodeEdge,
}

function CustomNode({ id, data }: NodeProps<CustomNodeTypeData>) {
  const [childNodes, , onChildNodesChange] = useNodesState(data.initialNodes)
  const [childEdges, , onChildEdgesChange] = useEdgesState(data.initialEdges)
  const parentHandleState = useHandleState(id)
  const reactFlowInstance = useReactFlow()

  const inputNodes: Node<InputNodeData>[] = useMemo(
    () => childNodes.filter((node) => node.type === NODE_TYPES_IDS.INPUT),
    childNodes
  )
  const outputNodes: Node<OutputNodeData>[] = useMemo(
    () => childNodes.filter((node) => node.type === NODE_TYPES_IDS.OUTPUT),
    childNodes
  )

  const handleStateInternal = useHandleStateInternal()
  useEffect(() => {
    inputNodes.forEach((node) => {
      const inboundState = node.data.handles.reduce((acc, handleData) => {
        acc[handleData.id] = parentHandleState.inboundState[handleData.id]
        return acc
      }, {} as Record<string, boolean>)
      handleStateInternal.updateNode(node.id, inboundState)
    })
    const newParentOutboundState = outputNodes.reduce((acc, node) => {
      const outputInboundState = handleStateInternal.nodes[node.id]
      return { ...acc, ...outputInboundState }
    }, {} as Record<string, boolean>)
    parentHandleState.updateOutboundState(newParentOutboundState)
  }, [handleStateInternal, parentHandleState, inputNodes, outputNodes])

  const onUnpackClick = useCallback(() => {
    const [newNodes, newEdges] = cloneNodesAndEdges(
      data.nodes.map((node) => ({
        ...node,
        selectable: true,
        selected: true,
        deletable: true,
      })),
      data.edges.map((edge) => ({
        ...edge,
        selected: true,
        deletable: true,
        focusable: true,
        updatable: true,
      }))
    )
    reactFlowInstance.setNodes((nodes) =>
      nodes
        .map((node) => {
          node.selected = false
          return node
        })
        .concat(newNodes)
    )
    reactFlowInstance.setEdges((edges) =>
      edges
        .map((edge) => {
          edge.selected = false
          return edge
        })
        .concat(newEdges)
    )
    setTimeout(
      () => reactFlowInstance.fitView({ nodes: newNodes, duration: 500 }),
      100
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
        {inputNodes.map((node) => (
          <div
            key={node.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}
          >
            {node.data.handles.map((handleData: NodeHandleData, i: number) => (
              <NodeHandle
                label={handleData.label || Math.pow(2, i).toString()}
                id={handleData.id}
                key={handleData.id}
                enabled={parentHandleState.inboundState[handleData.id]}
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
        {outputNodes.map((node) => (
          <div
            key={node.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'end',
            }}
          >
            {node.data.handles.map((handleData: NodeHandleData, i: number) => (
              <NodeHandle
                label={handleData.label || Math.pow(2, i).toString()}
                id={handleData.id}
                key={handleData.id}
                enabled={parentHandleState.outboundState[handleData.id]}
                type="output"
              />
            ))}
          </div>
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

export default React.memo(CustomNode)
