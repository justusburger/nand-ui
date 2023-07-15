import { useDrag } from 'react-dnd'
import { CustomNodeType, NodeType } from './nodeTypes'

interface NodeButtonProps {
  nodeType: NodeType | CustomNodeType
}

function NodeButton({ nodeType }: NodeButtonProps) {
  const [, dragRef] = useDrag(
    () => ({
      type: 'node',
      item: nodeType,
    }),
    []
  )
  return (
    <button
      ref={dragRef}
      key={nodeType.id}
      style={{ marginRight: 3 }}
      className="bg-white rounded px-2 text-sm"
    >
      {nodeType.name}
    </button>
  )
}

export default NodeButton
