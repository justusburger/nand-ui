import { Position } from 'reactflow'
import { Container, HandleIndicator } from './styles'

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
  custom?: boolean
  toggleable?: boolean
}

function NodeHandle({
  id,
  enabled,
  onClick,
  type,
  label,
  custom,
  toggleable,
}: NodeHandleProps) {
  return (
    <Container
      style={{
        flexDirection: type === 'input' ? 'row-reverse' : 'row',
      }}
    >
      <div className="text-gray-300 text-xs px-1">{label || id}</div>
      <HandleIndicator
        type={type === 'input' ? 'target' : 'source'}
        id={id}
        position={type === 'input' ? Position.Left : Position.Right}
        onClick={() => onClick?.(id)}
        style={{
          backgroundColor: enabled ? 'red' : 'black',
          ...(custom
            ? {
                borderRadius: type === 'input' ? '0 2px 2px 0' : '2px 0 0 2px',
                width: '11px',
              }
            : {
                borderRadius:
                  type === 'input' ? '0 10px 10px 0' : '10px 0 0 10px',
              }),
          ...(toggleable
            ? {
                border: 'solid 1px #fff',
                width: '15px',
                borderRadius: custom ? '2px' : '10px',
                margin: type === 'input' ? '' : '0 -7px 0 0',
                cursor: 'pointer',
              }
            : {}),
        }}
      />
    </Container>
  )
}

export default NodeHandle
