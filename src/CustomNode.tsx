import { useCallback, useContext, useMemo } from 'react'
import DataContext from './DataContext'
import NodeHandle from './NodeHandle'
import { NodeProps } from 'reactflow'
import NodeContainer from './NodeContainer'
import OutputHandleRegion from './OutputHandleRegion'
import InputHandleRegion from './InputHandleRegion'
import useNodeDataState from './useNodeDataState'

export interface CustomNodeData {
  countInputHandles: number
  countOutputHandles: number
}

function CustomNode({ id }: NodeProps<CustomNodeData>) {
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

  const [countInputHandles] = useNodeDataState<CustomNodeData>(
    id,
    'countInputHandles',
    2
  )

  const inputHandleIds = useMemo(() => {
    return new Array(countInputHandles)
      .fill(true)
      .map((v: any, index) => Math.pow(2, index))
  }, [countInputHandles])

  const [countOutputHandles] = useNodeDataState<CustomNodeData>(
    id,
    'countOutputHandles',
    2
  )

  const outputHandleIds = useMemo(() => {
    return new Array(countOutputHandles)
      .fill(true)
      .map((v: any, index) => Math.pow(2, index))
  }, [countOutputHandles])

  return (
    <NodeContainer>
      <InputHandleRegion>
        {inputHandleIds.map((handleId) => (
          <NodeHandle
            id={`${handleId}`}
            key={handleId}
            enabled={(value[id] || {})[handleId]}
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
        <div style={{ fontSize: 18 }}>Custom</div>
      </div>
      <OutputHandleRegion>
        {outputHandleIds.map((handleId) => (
          <NodeHandle
            id={`${handleId}`}
            key={handleId}
            enabled={(value[id] || {})[handleId]}
            type="output"
          />
        ))}
      </OutputHandleRegion>
    </NodeContainer>
  )
}

export default CustomNode
