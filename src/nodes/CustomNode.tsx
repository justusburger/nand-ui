import { useContext, useMemo } from 'react'
import DataContext from '../DataContext'
import NodeHandle from '../NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import { CustomNodeType, NODE_TYPES_IDS } from '../nodeTypes'
import { InputNodeData } from './InputNode'
import { OutputNodeData } from './OutputNode'

export interface CustomNodeData {
  customNodeType: CustomNodeType
}

function CustomNode({
  id,
  data: { customNodeType },
}: NodeProps<CustomNodeData>) {
  const { value } = useContext(DataContext)
  const inboundState = useInboundState({ nodeId: id })

  const inputNode = useMemo(
    () =>
      customNodeType.nodes.find(
        (node) => node.type === NODE_TYPES_IDS.INPUT_RELAY
      ),
    [customNodeType]
  )

  const inputNodeData = useMemo(
    () => inputNode?.data as InputNodeData,
    [inputNode]
  )

  const outputNode = useMemo(
    () =>
      customNodeType.nodes.find(
        (node) => node.type === NODE_TYPES_IDS.OUTPUT_RELAY
      ),
    [customNodeType]
  )
  const outputNodeData = useMemo(
    () => outputNode?.data as OutputNodeData,
    [outputNode]
  )

  const inputHandleIds = useMemo(() => {
    return new Array(inputNodeData.countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [inputNodeData])

  const outputHandleIds = useMemo(() => {
    return new Array(outputNodeData.countHandles)
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
            enabled={(value[outputNode!.id] || {})[handleId]}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default CustomNode
