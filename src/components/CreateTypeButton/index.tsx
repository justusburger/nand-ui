import { useCallback, useState } from 'react'
import { CustomNodeType } from '../../nodeTypes'
import { useEdges, useNodes } from 'reactflow'
import cloneNodesAndEdges from '../../cloneNodesAndEdges'

interface CreateTypeButtonProps {
  enabled: boolean
  onCreateStart: () => void
  creating: boolean
  onCreateComplete: (newCustomNodeType: CustomNodeType) => void
}

function CreateTypeButton({
  enabled,
  onCreateStart,
  creating,
  onCreateComplete,
}: CreateTypeButtonProps) {
  const [name, setName] = useState('')
  const nodes = useNodes<any>()
  const edges = useEdges<any>()
  const onCreateClick = useCallback(() => {
    const selectedNodesIdLookup: Record<string, boolean> = {}
    const selectedNodes = nodes
      .filter((n) => n.selected)
      .map((node) => {
        selectedNodesIdLookup[node.id] = true
        return node
      })
    const selectedEdges = edges.filter(
      (e) => selectedNodesIdLookup[e.source] && selectedNodesIdLookup[e.target]
    )
    const [newNodes, newEdges] = cloneNodesAndEdges(
      selectedNodes,
      selectedEdges
    )

    onCreateComplete({
      id: name.toLocaleLowerCase().replace(' ', '_'),
      name,
      data: {
        nodes: newNodes,
        edges: newEdges,
        name,
      } as any,
    })
    setName('')
  }, [nodes, edges, name, onCreateComplete])
  return (
    <div className="relative">
      <div
        style={{ transform: 'translate(-50%, -100%)', top: -10, left: '50%' }}
        className={'absolute ' + (creating ? '' : 'hidden')}
      >
        <div className="bg-white rounded-md text-black p-3 shadow-md shadow-gray-700 relative">
          <div className="mb-2 text-md font-bold">Create node type</div>
          <div className="mb-3">
            <div className="text-sm">Name</div>
            <input
              className="bg-gray-200 rounded px-2 py-1 text-black"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
            onClick={onCreateClick}
          >
            Create
          </button>
          <div
            className="bg-white w-3 h-3 absolute"
            style={{
              transform: 'rotate(45deg) translate(-50%, 100%)',
              left: '50%',
              bottom: 0,
            }}
          />
        </div>
      </div>
      <button
        disabled={!enabled}
        className="bg-white rounded shadow-md shadow-gray-500 px-2 py-1 text-sm active:opacity-50 disabled:opacity-50"
        onClick={() => onCreateStart()}
      >
        + Create type
      </button>
    </div>
  )
}

export default CreateTypeButton
