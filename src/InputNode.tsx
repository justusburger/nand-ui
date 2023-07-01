import { useCallback, useContext, useMemo, useState } from 'react'
import DataContext from './DataContext'
import NodeHandle from './NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from './NodeContainer'
import OutputHandleRegion from './OutputHandleRegion'

function InputNode({ id }: NodeProps) {
  const [countHandles, setCountHandles] = useState(4)
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
  const handleIds = useMemo(() => {
    return new Array(countHandles)
      .fill(true)
      .map((v: any, index) => Math.pow(2, index))
  }, [countHandles])
  console.log(countHandles)
  return (
    <NodeContainer>
      <div style={{ color: 'black', padding: 10 }}>
        <div>{countHandles}bit Input</div>
        <div>
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
