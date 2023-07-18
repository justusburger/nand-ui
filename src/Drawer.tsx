import { CustomNodeType, NodeType } from './nodeTypes'
import NodeButton from './NodeButton'
import CreateTypeButton from './components/CreateTypeButton'

interface DrawerProps {
  nodeTypes: NodeType[]
  customNodeTypes: CustomNodeType[]
  onCreateStart: () => void
  createCustomNodeTypeEnabled: boolean
  onCreateComplete: (newCustomNodeType: CustomNodeType) => void
  creating: boolean
}

function Drawer({
  nodeTypes,
  customNodeTypes,
  onCreateStart,
  createCustomNodeTypeEnabled,
  onCreateComplete,
  creating,
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
      {/* <button
        onClick={onCreateCustomNodeTypeClick}
        disabled={!createCustomNodeTypeEnabled}
        className="bg-white rounded px-2 text-sm"
      >
        + Create type
      </button> */}
      <CreateTypeButton
        onCreateStart={onCreateStart}
        enabled={createCustomNodeTypeEnabled}
        onCreateComplete={onCreateComplete}
        creating={creating}
      />
    </div>
  )
}

export default Drawer
