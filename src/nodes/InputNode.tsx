import { useCallback, useMemo } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { v4 } from 'uuid'
import EditHandlesPanel from '../components/EditHandlesPanel'
import DigitalNumber from '../components/DigitalNumber'
import getHandleBinaryValue from '../getHandleBinaryValue'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'

export interface InputNodeData {
  parentNodeId?: string
  handles: NodeHandleData[]
}

function InputNode({ id }: NodeProps<InputNodeData>) {
  const { outboundState, updateOutboundState } = useHandleState(id)
  const [handles, setHandles] = useNodeDataState<
    InputNodeData,
    NodeHandleData[]
  >(id, 'handles', [{ id: v4(), label: '', isBinary: true }])

  const handleOnClick = useCallback(
    (handleId: string) => {
      const newState = {
        ...outboundState,
        [handleId]: !outboundState[handleId],
      }
      updateOutboundState(newState)
    },
    [id, outboundState]
  )

  const binaryHandles = useMemo(() => {
    return handles.filter((handle) => handle.isBinary)
  }, [handles])

  const nonBinaryHandles = useMemo(() => {
    return handles.filter((handle) => !handle.isBinary)
  }, [handles])

  const decimalValue = binaryHandles.reduce((acc, handle, i) => {
    const binaryColumnValue = getHandleBinaryValue(i, binaryHandles.length)
    return acc + (outboundState[handle.id] ? binaryColumnValue : 0)
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
    <div className="relative">
      <DigitalNumber>{decimalValue}</DigitalNumber>
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
        <div
          style={{
            color: 'black',
            padding: '10px 10px 10px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 18 }}>Input</div>
        </div>
        <OutputHandleRegion>
          {nonBinaryHandles.map((handleData) => (
            <NodeHandle
              label={handleData.label}
              id={handleData.id}
              key={handleData.id}
              enabled={outboundState[handleData.id]}
              onClick={handleOnClick}
              type="output"
              custom
              toggleable
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
              enabled={outboundState[handleData.id]}
              onClick={handleOnClick}
              type="output"
              toggleable
            />
          ))}
        </OutputHandleRegion>
      </NodeContainer>
    </div>
  )
}

export default React.memo(InputNode)
