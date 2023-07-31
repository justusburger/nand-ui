import { useEffect, useMemo, useState } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import { useReactFlow, NodeProps, Node, useNodes, useEdges } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import { CustomNodeTypeData, NODE_TYPES_IDS } from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'
import { useCustomNodeTypes } from '../components/CutomNodeTypesProvider'
import { v4 } from 'uuid'

function CustomNode({ id, data }: NodeProps<CustomNodeTypeData>) {
  const { customNodeTypes } = useCustomNodeTypes()
  const nodeType = useMemo(
    () => customNodeTypes.find((c) => c.id === data.customNodeTypeId),
    [customNodeTypes, data.customNodeTypeId]
  )
  const [nodesAdded, setNodesAdded] = useState(false)
  const reactFlowInstance = useReactFlow()
  const [inputHandles, setInputHandles] = useState<NodeHandleData[]>([])
  const [outputHandles, setOutputHandles] = useState<NodeHandleData[]>([])
  const [outputNode, setOutputNode] = useState<Node>()
  useEffect(() => {
    if (!nodeType || !nodeType.data || nodesAdded) return
    setNodesAdded(true)
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
          x: node.position.x - minX + 250,
          y: node.position.y - minY,
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
    reactFlowInstance.addNodes(newNodes)
    reactFlowInstance.addEdges(newEdges)

    const inputNodes = newNodes.filter((n) => n.type === NODE_TYPES_IDS.INPUT)
    const inputHandles = inputNodes.reduce((acc, node) => {
      return acc.concat((node.data as InputNodeData).handles)
    }, [] as NodeHandleData[])
    setInputHandles(inputHandles)
    const outputNode = newNodes.find((n) => n.type === NODE_TYPES_IDS.OUTPUT)
    setOutputNode(outputNode)
    const outputHandles = (outputNode?.data as OutputNodeData).handles
    setOutputHandles(outputHandles)
  }, [nodeType, nodesAdded, reactFlowInstance, id])

  const nodes = useNodes()
  const edges = useEdges()
  const inboundState: { [key: string]: boolean } = useInboundState(
    id,
    nodes,
    edges
  )
  const outboundState: { [key: string]: boolean } = useInboundState(
    outputNode?.id,
    nodes,
    edges
  )

  useEffect(() => {
    if (!nodesAdded) return
    reactFlowInstance.setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              outboundHandleState: outboundState,
            },
          }
        }
        return node
      })
    )
  }, [outboundState, reactFlowInstance, nodesAdded])

  return (
    <NodeContainer>
      {/* <NodeToolbar position={Position.Top}>
        <button
          className="bg-white text-black text-sm rounded px-2 py-1 active:opacity-50"
          onClick={onUnpackClick}
        >
          Unpack
        </button>
      </NodeToolbar> */}
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
