import { useCallback, useMemo } from 'react'
import NodeHandle from '../NodeHandle'
import { NodeProps, NodeToolbar, Position } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { OutboundHandleState } from '../useOutboundState'

export interface InputNodeData {
  countHandles: number
  parentNodeId?: string
  outboundHandleState: OutboundHandleState
}

function InputNode({ id }: NodeProps<InputNodeData>) {
  const [countHandles, setCountHandles] = useNodeDataState<
    InputNodeData,
    number
  >(id, 'countHandles', 1)

  const [outboundHandleState, setOutboundHandleState] = useNodeDataState<
    InputNodeData,
    OutboundHandleState
  >(id, 'outboundHandleState', {})

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

  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])

  const decimalValue = handleIds.reduce((acc, handleId) => {
    const handleBinaryColumn = Math.pow(2, parseInt(handleId) - 1)
    return acc + (outboundHandleState[handleId] ? handleBinaryColumn : 0)
  }, 0)

  const minValue = useMemo(() => {
    return 0
  }, [])

  const maxValue = useMemo(() => {
    return handleIds.reduce((acc, handleId) => {
      const handleBinaryColumn = Math.pow(2, parseInt(handleId) - 1)
      return acc + handleBinaryColumn
    }, 0)
  }, [handleIds])

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
            onClick={() => setCountHandles(countHandles - 1)}
          >
            -
          </button>
          <div
            style={{ fontSize: 15, padding: '2px 4px 0 2px', lineHeight: 1 }}
          >
            {countHandles}bit
          </div>
          <button
            style={{ padding: `2px 6px 2px 6px`, lineHeight: 1 }}
            onClick={() => setCountHandles(countHandles + 1)}
          >
            +
          </button>
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
        {handleIds.map((handleId) => (
          <NodeHandle
            id={`${handleId}`}
            key={handleId}
            enabled={outboundHandleState[handleId]}
            onClick={handleOnClick}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default InputNode
