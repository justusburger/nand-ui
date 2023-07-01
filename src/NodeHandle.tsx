import { useMemo } from 'react'
import { Handle, Position } from 'reactflow'

const handleStyle = {
  position: 'relative',
  top: 0,
  width: 15,
  height: 15,
  left: 0,
  marginTop: 3,
  marginBottom: 3,
  cursor: 'pointer',
  transform: 'none',
}

interface NodeHandleProps {
  id: string
  enabled?: boolean
  onClick?: (id: string) => void
  type: 'input' | 'output'
}

function NodeHandle({ id, enabled, onClick, type }: NodeHandleProps) {
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
        {id}
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
