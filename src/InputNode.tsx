import { useCallback, useContext, useMemo } from 'react'
import DataContext from './DataContext'
import NodeHandle from './NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from './NodeContainer'
import OutputHandleRegion from './OutputHandleRegion'
import useNodeDataState from './useNodeDataState'

export interface InputNodeData {
  countHandles: number
}

function InputNode({ id }: NodeProps<InputNodeData>) {
  const { value, setValue } = useContext(DataContext)
  const handleOnClick = useCallback((handleId: string) => {
    setValue((value) => ({
      ...value,
      [id]: {
        ...value[id],
        [handleId]: !(value[id] || {})[handleId],
      },
    }))
  }, [])

  const [countHandles, setCountHandles] = useNodeDataState<InputNodeData>(
    id,
    'countHandles',
    2
  )

  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => Math.pow(2, index))
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
            enabled={(value[id] || {})[handleId]}
            onClick={handleOnClick}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default InputNode
