import { useCallback, useMemo } from 'react'
import NodeHandle, { NodeHandleData } from '../components/NodeHandle'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { OutboundHandleState } from '../useOutboundState'
import { v4 } from 'uuid'
import {
  PlusCircleIcon,
  MinusCircleIcon,
  StopCircleIcon,
} from '@heroicons/react/24/outline'

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

  // const minValue = useMemo(() => {
  //   return 0
  // }, [])
  // const maxValue = useMemo(() => {
  //   return binaryHandles.reduce((acc, handle, i) => {
  //     const handleBinaryColumn = Math.pow(2, i)
  //     return acc + handleBinaryColumn
  //   }, 0)
  // }, [binaryHandles])

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
      <div
        style={{
          fontFamily: 'd7',
          top: 0,
          left: '50%',
          transform: 'translate(-50%, -100%)',
        }}
        className="text-blue-300  absolute text-xl"
      >
        {decimalValue}
      </div>
      <NodeContainer>
        <NodeToolbar position={Position.Left}>
          <div className="bg-white rounded text-black p-3">
            <div className="mb-2 text-lg flex">
              <div className="mr-auto font-bold">Handles</div>
              <div className="flex justify-center items-center">
                <button
                  className="disabled:opacity-20 text-gray-300  hover:text-gray-500"
                  onClick={handleRemoveHandle}
                  disabled={handles.length < 2}
                >
                  <MinusCircleIcon className="w-6 h-6" />
                </button>
                <div className="px-1 text-sm">{handles.length}bit</div>
                <button
                  onClick={handleAddHandle}
                  className="text-gray-300 hover:text-gray-500"
                >
                  <PlusCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <table>
              <thead>
                <tr className="text-xs text-left font-normal">
                  <th className="font-normal text-left"></th>
                  <th className="font-normal text-right">Label</th>
                </tr>
              </thead>
              <tbody>
                {handles.map((handleData) => (
                  <tr key={handleData.id}>
                    <td className="">
                      <div
                        className={
                          'cursor-pointer pr-1 hover:text-gray-500 ' +
                          (handleData.isBinary
                            ? 'text-gray-300'
                            : 'text-gray-700')
                        }
                        onClick={() => handleBinaryChange(handleData.id)}
                      >
                        <StopCircleIcon className="w-6 h-6 " />
                      </div>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="bg-gray-100 rounded py-1 px-2 text-sm"
                        value={handleData.label}
                        onChange={(e) => handleLabelChange(e, handleData.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          {nonBinaryHandles.map((handleData, i) => (
            <NodeHandle
              label={handleData.label}
              id={handleData.id}
              key={handleData.id}
              enabled={outboundHandleState[handleData.id]}
              onClick={handleOnClick}
              type="output"
              custom
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
    </div>
  )
}

export default InputNode
