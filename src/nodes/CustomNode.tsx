import { useEffect, useMemo, useRef, useState } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import {
  useReactFlow,
  NodeProps,
  Node,
  useNodes,
  useEdges,
  Position,
  NodeToolbar,
  useUpdateNodeInternals,
} from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import { CustomNodeTypeData, NODE_TYPES_IDS } from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'
import { useCustomNodeTypes } from '../components/CutomNodeTypesProvider'
import { v4 } from 'uuid'

function CustomNode({ id, data, xPos, yPos }: NodeProps<CustomNodeTypeData>) {
  const updateNodeInternals = useUpdateNodeInternals()
  const { customNodeTypes } = useCustomNodeTypes()
  const nodeType = useMemo(
    () => customNodeTypes.find((c) => c.id === data.customNodeTypeId),
    [customNodeTypes, data.customNodeTypeId]
  )
  const reactFlowInstance = useReactFlow()
  const [inputHandles, setInputHandles] = useState<NodeHandleData[]>([])
  const [outputHandles, setOutputHandles] = useState<NodeHandleData[]>([])
  const [outputNode, setOutputNode] = useState<Node>()
  const initRef = useRef(false)
  useEffect(() => {
    if (!nodeType || !nodeType.data || initRef.current) {
      return
    }
    initRef.current = true
    const oldToNewNodeIdsMap: { [oldNodeId: string]: string } = {}
    const minX = Math.min(
      ...nodeType.data.nodes.map((node: Node) => node.position.x)
    )
    const minY = Math.min(
      ...nodeType.data.nodes.map((node: Node) => node.position.y)
    )
    const newNodes = nodeType.data.nodes.map((node) => {
      const newNodeId = v4()
      oldToNewNodeIdsMap[node.id] = newNodeId
      return {
        ...node,
        id: newNodeId,
        position: {
          x: node.position.x - minX + xPos,
          y: node.position.y - minY + yPos,
        },
        data: {
          ...node.data,
          parentNodeId: id,
        },
        focusable: false,
        selectable: false,
        style: { display: 'none' },
      }
    })
    const newEdges = nodeType.data.edges.map((edge) => {
      return {
        ...edge,
        id: v4(),
        source: oldToNewNodeIdsMap[edge.source],
        target: oldToNewNodeIdsMap[edge.target],
        style: { display: 'none' },
      }
    })
    setTimeout(() => {
      console.log('init', id, nodeType.id)
      reactFlowInstance.addNodes(newNodes)
      reactFlowInstance.addEdges(newEdges)
      updateNodeInternals([id, ...newNodes.map((n) => n.id)])
      const inputNodes = newNodes.filter((n) => n.type === NODE_TYPES_IDS.INPUT)
      const inputHandles = inputNodes.reduce((acc, node) => {
        return acc.concat((node.data as InputNodeData).handles)
      }, [] as NodeHandleData[])
      setInputHandles(inputHandles)
      const outputNode = newNodes.find((n) => n.type === NODE_TYPES_IDS.OUTPUT)
      setOutputNode(outputNode)
      const outputHandles = (outputNode?.data as OutputNodeData).handles
      setOutputHandles(outputHandles)
    }, 0)
  }, [nodeType, reactFlowInstance, id, initRef, updateNodeInternals])

  const nodes = useNodes()
  const edges = useEdges()
  const inboundState: { [key: string]: boolean } = useInboundState(
    id,
    nodes,
    edges
  )
  // console.log(outputNode?.id)
  const outboundState: { [key: string]: boolean } = useInboundState(
    outputNode?.id,
    nodes,
    edges
  )

  // useEffect(() => {
  //   if (!nodesAdded) return
  //   reactFlowInstance.setNodes((nodes) =>
  //     nodes.map((node) => {
  //       if (node.id === id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             outboundHandleState: outboundState,
  //           },
  //         }
  //       }
  //       return node
  //     })
  //   )
  // }, [outboundState, reactFlowInstance, nodesAdded])

  return (
    <NodeContainer>
      {/* <NodeToolbar position={Position.Bottom}> */}
      {/* <div className="bg-white rounded p-3">
          <pre className="text-xs text-black"> */}
      {/* {JSON.stringify(outputNode, null, 2)} */}
      {/* </pre>
        </div> */}
      {/* <button
          className="bg-white text-black text-sm rounded px-2 py-1 active:opacity-50"
          onClick={onUnpackClick}
        >
          Unpack
        </button> */}
      {/* </NodeToolbar> */}
      <InputHandleRegion>
        {inputHandles.map((handle, i) => (
          <NodeHandle
            label={handle.label}
            id={handle.id}
            key={handle.id}
            enabled={inboundState[handle.id]}
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
        <div style={{ fontSize: 18 }}>{nodeType?.data?.name}</div>
      </div>
      <OutputHandleRegion>
        {outputHandles.map((handle) => (
          <NodeHandle
            label={handle.label}
            id={handle.id}
            key={handle.id}
            enabled={outboundState[handle.id]}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default CustomNode
