import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'

interface NodeType {
  id: string
  name: string
}

interface DrawerProps {
  nodeTypes: NodeType[]
}

function Drawer({ nodeTypes }: DrawerProps) {
  const reactFlowInstance = useReactFlow()

  const onAddNode = useCallback(
    (type: string) => {
      reactFlowInstance.addNodes({
        type,
        id: `${reactFlowInstance.getNodes().length + 1}`,
        position: { x: 0, y: 0 },
        data: {},
      })
    },
    [reactFlowInstance]
  )
  return (
    <div
      style={{
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        justifyContent: 'flex-start',
        width: 'auto',
        color: 'black',
        padding: 10,
      }}
    >
      <div style={{ marginBottom: 10 }}>Node types</div>
      {nodeTypes.map((nodeType) => (
        <button
          key={nodeType.id}
          style={{
            marginBottom: 5,
            fontSize: 13,
          }}
          onClick={() => onAddNode(nodeType.id)}
        >
          {nodeType.name}
        </button>
      ))}
    </div>
  )
}

export default Drawer
