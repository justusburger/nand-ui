import { useCallback, useMemo } from 'react'
import NodeHandle from '../NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from '../NodeContainer'
import OutputHandleRegion from '../OutputHandleRegion'
import useNodeDataState from '../useNodeDataState'
import { OutboundHandleState } from '../useOutboundState'

export interface InputNodeData {
  countHandles: number
  parentNodeId?: string
  outboundHandleState: OutboundHandleState
}

function InputNode({ id, data: { parentNodeId } }: NodeProps<InputNodeData>) {
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
      if (parentNodeId) return
      const newState = {
        ...outboundHandleState,
        [handleId]: !outboundHandleState[handleId],
      }
      setOutboundHandleState(newState)
    },
    [parentNodeId, id, outboundHandleState]
  )

  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])

  return (
    <NodeContainer>
      <div
        style={{
          color: 'black',
          padding: '10px 10px 10px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18 }}>Input</div>
        <div style={{ display: 'flex' }}>
          <button
            style={{
              padding: `0px 5px 2px 5px`,
              lineHeight: 1,
              marginRight: 2,
            }}
            onClick={() => setCountHandles(countHandles - 1)}
          >
            -
          </button>
          <div style={{ fontSize: 12, padding: '0 4px 0 2px' }}>
            {countHandles}bit
          </div>
          <button
            style={{ padding: `0px 5px 2px 5px`, lineHeight: 1 }}
            onClick={() => setCountHandles(countHandles + 1)}
          >
            +
          </button>
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
