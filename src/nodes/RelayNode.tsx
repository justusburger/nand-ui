import NodeHandle from '../NodeHandle'
import useInboundState from '../useInboundState'
import { NodeProps, useEdges } from 'reactflow'
import InputHandleRegion from '../InputHandleRegion'
import OutputHandleRegion from '../OutputHandleRegion'
import NodeContainer from '../NodeContainer'
import { useContext, useEffect, useMemo } from 'react'
import DataContext from '../DataContext'
import useNodeDataState from '../useNodeDataState'

export interface RelayNodeData {
  countHandles: number
}

function RelayNode({ id }: NodeProps<RelayNodeData>) {
  const inboundState = useInboundState({ nodeId: id })
  const [countHandles, setCountHandles] = useNodeDataState<
    RelayNodeData,
    number
  >(id, 'countHandles', 1)
  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => `${index + 1}`)
  }, [countHandles])

  const { value, setValue } = useContext(DataContext)
  const edges = useEdges()
  useEffect(() => {
    setValue((prevValue) => ({
      ...prevValue,
      [id]: {
        ...(prevValue[id] || {}),
        ...handleIds.reduce((acc, handleId) => {
          acc[handleId] = inboundState[handleId]
          return acc
        }, {} as any),
      },
    }))
  }, [handleIds, id, edges, JSON.stringify(inboundState)])

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
