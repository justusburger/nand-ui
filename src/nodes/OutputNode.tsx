import { useMemo } from 'react'
import NodeHandle from '../NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from '../NodeContainer'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import useNodeDataState from '../useNodeDataState'

export interface OutputNodeData {
  countHandles: number
}

function OutputNode({ id }: NodeProps) {
  const inboundState = useInboundState({ nodeId: id })
  const [countHandles, setCountHandles] = useNodeDataState<
    OutputNodeData,
    number
  >(id, 'countHandles', 1)

  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])
  return (
    <NodeContainer>
      <InputHandleRegion>
        {handleIds.map((handleId) => (
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
          padding: '10px 20px 10px 10px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 18 }}>Output</div>
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
    </NodeContainer>
  )
}

export default OutputNode
