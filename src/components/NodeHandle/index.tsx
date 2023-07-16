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
}

function NodeHandle({
  id,
  enabled,
  onClick,
  type,
  label,
  custom,
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
          borderRadius: custom ? 3 : 8,
        }}
      />
    </Container>
  )
}

export default NodeHandle
