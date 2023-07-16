import { CustomNodeType, NodeType } from './nodeTypes'
import NodeButton from './NodeButton'

interface DrawerProps {
  nodeTypes: NodeType[]
  customNodeTypes: CustomNodeType[]
  onCreateCustomNodeTypeClick: () => void
  createCustomNodeTypeEnabled: boolean
}

function Drawer({
  nodeTypes,
  customNodeTypes,
  onCreateCustomNodeTypeClick,
  createCustomNodeTypeEnabled,
}: DrawerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 'auto',
        color: 'black',
      }}
    >
      {nodeTypes.map((nodeType) =>
        nodeType.hidden ? null : (
          <NodeButton nodeType={nodeType} key={nodeType.id} />
        )
      )}
      <div style={{ width: 10 }} />
      {customNodeTypes.map((customNodeType) => (
        <NodeButton nodeType={customNodeType} key={customNodeType.id} />
      ))}
      <button
        onClick={onCreateCustomNodeTypeClick}
        disabled={!createCustomNodeTypeEnabled}
        className="bg-white rounded px-2 text-sm"
      >
        + Create type
      </button>
    </div>
  )
}

export default Drawer
