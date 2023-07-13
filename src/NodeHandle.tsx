import { useMemo } from 'react'
import { Handle, Position } from 'reactflow'

const handleStyle = {
  position: 'relative',
  top: 0,
  width: 15,
  height: 15,
  left: 0,
  cursor: 'pointer',
  transform: 'none',
}

export interface NodeHandleData {
  id: string
  label: string
  isBinary: boolean
}

interface NodeHandleProps {
  id: string
  enabled?: boolean
  onClick?: (id: string) => void
  type: 'input' | 'output'
  label: string
}

function NodeHandle({ id, enabled, onClick, type, label }: NodeHandleProps) {
  const style: any = useMemo(() => {
    return {
      ...handleStyle,
      backgroundColor: enabled ? 'red' : 'black',
    }
  }, [enabled])
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: type === 'input' ? 'row-reverse' : 'row',
      }}
    >
      <div
        style={{ color: '#999', fontSize: 12, paddingLeft: 5, paddingRight: 5 }}
      >
        {label || id}
      </div>
      <Handle
        type={type === 'input' ? 'target' : 'source'}
        id={id}
        position={type === 'input' ? Position.Left : Position.Right}
        style={style}
        onClick={() => onClick?.(id)}
      />
    </div>
  )
}

export default NodeHandle
