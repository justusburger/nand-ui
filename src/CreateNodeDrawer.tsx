import { useCallback, useState } from 'react'
import { useEdges, useNodes } from 'reactflow'
import { v4 } from 'uuid'
import { CustomNodeType } from './nodeTypes'

interface CreateNodeDrawerProps {
  onClose: () => void
  onCreate: (newCustomNodeType: CustomNodeType) => void
}
function CreateNodeDrawer({ onCreate }: CreateNodeDrawerProps) {
  const [name, setName] = useState('')
  const nodes = useNodes<any>()
  const edges = useEdges<any>()
  const onCreateClick = useCallback(() => {
    const oldToNewNodeIdLookup: Record<string, string> = {}
    const newNodes = nodes
      .filter((n) => n.selected)
      .map((node) => {
        const newNodeId = v4()
        oldToNewNodeIdLookup[node.id] = newNodeId
        return { ...node, id: newNodeId }
      })

    const newEdges = edges
      .filter(
        (e) => oldToNewNodeIdLookup[e.source] && oldToNewNodeIdLookup[e.target]
      )
      .map((edge) => {
        return {
          ...edge,
          source: oldToNewNodeIdLookup[edge.source],
          target: oldToNewNodeIdLookup[edge.target],
        }
      })
    onCreate({
      id: name.toLocaleLowerCase().replace(' ', '_'),
      name,
      data: {
        nodes: newNodes,
        edges: newEdges,
        name,
      },
    })
  }, [nodes, edges, name, onCreate])
  return (
    <div className="card-background card-content" style={{ minWidth: 220 }}>
      <div className="title">Create node type</div>
      <div className="field">
        <div className="field-label">Name</div>
        <input
          className="field-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button onClick={onCreateClick}>Create</button>
    </div>
  )
}

export default CreateNodeDrawer
