import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import { NodeProps, useEdges, useNodes } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useMemo } from 'react'
import useNodeDataState from '../useNodeDataState'
import useOutboundState from '../useOutboundState'

export interface RelayNodeData {
  countHandles: number
}

function RelayNode({ id }: NodeProps<RelayNodeData>) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const [countHandles, setCountHandles] = useNodeDataState<
    RelayNodeData,
    number
  >(id, 'countHandles', 1)
  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])
  useOutboundState(id, inboundState)

  return (
    <NodeContainer>
      <InputHandleRegion>
        {handleIds.map((handleId) => (
          <NodeHandle
            id={handleId}
            enabled={inboundState[handleId]}
            key={handleId}
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
        <div style={{ fontSize: 18 }}>Relay</div>
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
            id={handleId}
            enabled={inboundState[handleId]}
            key={handleId}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default RelayNode
