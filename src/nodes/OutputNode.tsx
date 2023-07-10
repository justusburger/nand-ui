import { useMemo } from 'react'
import NodeHandle from '../NodeHandle'
import { NodeProps, NodeToolbar, Position, useEdges, useNodes } from 'reactflow'
import NodeContainer from '../NodeContainer'
import InputHandleRegion from '../InputHandleRegion'
import useInboundState from '../useInboundState'
import useNodeDataState from '../useNodeDataState'

export interface OutputNodeData {
  countHandles: number
}

function OutputNode({ id }: NodeProps) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const [countHandles, setCountHandles] = useNodeDataState<
    OutputNodeData,
    number
  >(id, 'countHandles', 1)

  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])

  const decimalValue = handleIds.reduce((acc, handleId) => {
    const handleBinaryColumn = Math.pow(2, parseInt(handleId) - 1)
    return acc + (inboundState[handleId] ? handleBinaryColumn : 0)
  }, 0)
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
            value={decimalValue}
            readOnly
          />
        </div>
      </div>
    </NodeContainer>
  )
}

export default OutputNode
