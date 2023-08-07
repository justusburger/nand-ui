import { useDrag } from 'react-dnd'
import { CustomNodeType, NodeType } from './nodeTypes'
import React from 'react'

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
      className="bg-white rounded px-2 py-1 text-sm mr-1 mb-1 shadow-md shadow-gray-500"
    >
      {nodeType.name}
    </button>
  )
}

export default React.memo(NodeButton)
