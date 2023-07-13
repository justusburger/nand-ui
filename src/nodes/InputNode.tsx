import { useCallback, useMemo } from 'react'
import NodeHandle, { NodeHandleData } from '../NodeHandle'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { OutboundHandleState } from '../useOutboundState'
import { v4 } from 'uuid'

export interface InputNodeData {
  parentNodeId?: string
  outboundHandleState: OutboundHandleState
  handles: NodeHandleData[]
}

function InputNode({ id }: NodeProps<InputNodeData>) {
  const [outboundHandleState, setOutboundHandleState] = useNodeDataState<
    InputNodeData,
    OutboundHandleState
  >(id, 'outboundHandleState', {})
  const [handles, setHandles] = useNodeDataState<
    InputNodeData,
    NodeHandleData[]
  >(id, 'handles', [{ id: v4(), label: '', isBinary: true }])

  const handleOnClick = useCallback(
    (handleId: string) => {
      const newState = {
        ...outboundHandleState,
        [handleId]: !outboundHandleState[handleId],
      }
      setOutboundHandleState(newState)
    },
    [id, outboundHandleState]
  )

  const binaryHandles = useMemo(() => {
    return handles.filter((handle) => handle.isBinary)
  }, [handles])

  const nonBinaryHandles = useMemo(() => {
    return handles.filter((handle) => !handle.isBinary)
  }, [handles])

  const decimalValue = binaryHandles.reduce((acc, handle, i) => {
    const binaryColumnValue = Math.pow(2, i)
    return acc + (outboundHandleState[handle.id] ? binaryColumnValue : 0)
  }, 0)

  const minValue = useMemo(() => {
    return 0
  }, [])
  const maxValue = useMemo(() => {
    return binaryHandles.reduce((acc, handle, i) => {
      const handleBinaryColumn = Math.pow(2, i)
      return acc + handleBinaryColumn
    }, 0)
  }, [binaryHandles])

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
    (e: any, handleId: string) => {
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
      <NodeToolbar position={Position.Top}>
        <div
          className="card-background"
          style={{
            display: 'flex',
            background: '#fff',
            color: '#000',
            padding: 3,
          }}
        >
          <button
            style={{
              padding: `0px 7px 2px 7px`,
              lineHeight: 1,
              marginRight: 2,
            }}
            onClick={handleRemoveHandle}
          >
            -
          </button>
          <div
            style={{ fontSize: 15, padding: '2px 4px 0 2px', lineHeight: 1 }}
          >
            {handles.length}bit
          </div>
          <button
            style={{ padding: `2px 6px 2px 6px`, lineHeight: 1 }}
            onClick={handleAddHandle}
          >
            +
          </button>
        </div>
      </NodeToolbar>
      <NodeToolbar position={Position.Left}>
        <div className="card-background card-content card-floating">
          <div>Handles</div>
          {nonBinaryHandles.map((handleData) => (
            <div key={handleData.id}>
              <input
                type="checkbox"
                checked={false}
                onChange={(e) => handleBinaryChange(e, handleData.id)}
              />
              <input
                type="text"
                value={handleData.label}
                onChange={(e) => handleLabelChange(e, handleData.id)}
                style={{
                  background: '#fff',
                  border: 'solid 1px #ccc',
                  color: '#000',
                }}
              />
            </div>
          ))}
          {binaryHandles.map((handleData, i) => (
            <div key={handleData.id}>
              <input
                type="checkbox"
                checked={true}
                onChange={(e) => handleBinaryChange(e, handleData.id)}
              />
              <input
                type="text"
                value={handleData.label}
                onChange={(e) => handleLabelChange(e, handleData.id)}
                style={{
                  background: '#fff',
                  border: 'solid 1px #ccc',
                  color: '#000',
                }}
              />
            </div>
          ))}
        </div>
      </NodeToolbar>
      {/* <NodeToolbar position={Position.Bottom}>
        <div className="card-background card-content">
          <div>Data</div>
          <pre style={{ fontSize: 12, lineHeight: 1.1 }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </NodeToolbar> */}
      <div
        style={{
          color: 'black',
          padding: '10px 10px 10px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18 }}>Input</div>

        <div>
          <input
            type="number"
            style={{
              background: '#fff',
              border: 'solid 1px #ccc',
              color: '#000',
              width: 40,
              borderRadius: 4,
            }}
            min={minValue}
            max={maxValue}
            value={decimalValue}
            readOnly
          />
        </div>
      </div>
      <OutputHandleRegion>
        {nonBinaryHandles.map((handleData, i) => (
          <NodeHandle
            label={handleData.label}
            id={handleData.id}
            key={handleData.id}
            enabled={outboundHandleState[handleData.id]}
            onClick={handleOnClick}
            type="output"
          />
        ))}
        {binaryHandles.map((handleData, i) => (
          <NodeHandle
            label={handleData.label || Math.pow(2, i).toString()}
            id={handleData.id}
            key={handleData.id}
            enabled={outboundHandleState[handleData.id]}
            onClick={handleOnClick}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default InputNode
