import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import useInboundState from '../useInboundState'
import { NodeProps, NodeToolbar, Position, useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useCallback, useMemo } from 'react'
import useNodeDataState from '../useNodeDataState'
import useOutboundState, { OutboundHandleState } from '../useOutboundState'
import { v4 } from 'uuid'
import EditHandlesPanel from '../components/EditHandlesPanel'
import getHandleBinaryValue from '../getHandleBinaryValue'

export interface RelayNodeData {
  countHandles: number
  outboundHandleState: OutboundHandleState
  handles: NodeHandleData[]
}

function RelayNode({ id }: NodeProps<RelayNodeData>) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)

  const [handles, setHandles] = useNodeDataState<
    RelayNodeData,
    NodeHandleData[]
  >(id, 'handles', [{ id: v4(), label: '', isBinary: true }])

  useOutboundState(id, inboundState)

  const binaryHandles = useMemo(() => {
    return handles.filter((handle) => handle.isBinary)
  }, [handles])

  const nonBinaryHandles = useMemo(() => {
    return handles.filter((handle) => !handle.isBinary)
  }, [handles])

  const handleLabelChange = useCallback(
    (e: any, handleId: string) => {
      setHandles(
        handles.map((handle) => {
          if (handle.id === handleId) {
            return {
              ...handle,
              label: e.target.value,
            }
          }
          return handle
        })
      )
    },
    [handles]
  )

  const handleBinaryChange = useCallback(
    (handleId: string) => {
      setHandles(
        handles.map((handle) => {
          if (handle.id === handleId) {
            return {
              ...handle,
              isBinary: !handle.isBinary,
            }
          }
          return handle
        })
      )
    },
    [handles]
  )

  const handleAddHandle = useCallback(() => {
    setHandles(
      handles.concat({
        id: v4(),
        label: '',
        isBinary: true,
      })
    )
  }, [handles])

  const handleRemoveHandle = useCallback(() => {
    const newHandles = [...handles]
    newHandles.pop()
    setHandles(newHandles)
  }, [handles])

  return (
    <NodeContainer>
      <NodeToolbar position={Position.Left}>
        <EditHandlesPanel
          handles={handles}
          handleAddHandle={handleAddHandle}
          handleBinaryChange={handleBinaryChange}
          handleLabelChange={handleLabelChange}
          handleRemoveHandle={handleRemoveHandle}
        />
      </NodeToolbar>
      <InputHandleRegion>
        {nonBinaryHandles.map((handleData) => (
          <NodeHandle
            label={handleData.label}
            id={handleData.id}
            key={handleData.id}
            enabled={inboundState[handleData.id]}
            type="input"
            custom
          />
        ))}
        {binaryHandles.map((handleData, i) => (
          <NodeHandle
            label={
              handleData.label ||
              getHandleBinaryValue(i, binaryHandles.length).toString()
            }
            id={handleData.id}
            key={handleData.id}
            enabled={inboundState[handleData.id]}
            type="input"
          />
        ))}
      </InputHandleRegion>
      <div
        style={{
          color: 'black',
          padding: '10px 10px 10px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18 }}>Relay</div>
      </div>
      <OutputHandleRegion>
        {nonBinaryHandles.map((handleData) => (
          <NodeHandle
            label={handleData.label}
            id={handleData.id}
            key={handleData.id}
            enabled={inboundState[handleData.id]}
            type="output"
            custom
          />
        ))}
        {binaryHandles.map((handleData, i) => (
          <NodeHandle
            label={
              handleData.label ||
              getHandleBinaryValue(i, binaryHandles.length).toString()
            }
            id={handleData.id}
            key={handleData.id}
            enabled={inboundState[handleData.id]}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default RelayNode
