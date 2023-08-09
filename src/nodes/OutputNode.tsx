import { useCallback, useMemo } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import InputHandleRegion from '../InputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { v4 } from 'uuid'
import EditHandlesPanel from '../components/EditHandlesPanel'
import DigitalNumber from '../components/DigitalNumber'
import getHandleBinaryValue from '../getHandleBinaryValue'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'

export interface OutputNodeData {
  handles: NodeHandleData[]
}

function OutputNode({ id }: NodeProps) {
  const { inboundState } = useHandleState(id, (inboundState) => inboundState)
  const [handles, setHandles] = useNodeDataState<
    OutputNodeData,
    NodeHandleData[]
  >(id, 'handles', [{ id: v4(), label: '', isBinary: true }])
  const binaryHandles = useMemo(() => {
    return handles.filter((handle) => handle.isBinary)
  }, [handles])

  const nonBinaryHandles = useMemo(() => {
    return handles.filter((handle) => !handle.isBinary)
  }, [handles])

  const decimalValue = binaryHandles.reduce((acc, handle, i) => {
    const binaryColumnValue = getHandleBinaryValue(i, binaryHandles.length)
    return acc + (inboundState[handle.id] ? binaryColumnValue : 0)
  }, 0)

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
    <div>
      <DigitalNumber>{decimalValue}</DigitalNumber>
      <NodeContainer>
        <NodeToolbar position={Position.Right}>
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
            padding: '10px 20px 10px 10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18 }}>Output</div>
        </div>
      </NodeContainer>
    </div>
  )
}

export default React.memo(OutputNode)
