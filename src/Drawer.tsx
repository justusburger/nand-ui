import { CustomNodeType, NodeType } from './nodeTypes'
import NodeButton from './NodeButton'
import CreateTypeButton from './components/CreateTypeButton'
import CustomNodeButton from './components/CustomNodeButton'

interface DrawerProps {
  nodeTypes: NodeType[]
  customNodeTypes: CustomNodeType[]
  onCreateStart: () => void
  createCustomNodeTypeEnabled: boolean
  onCreateComplete: (newCustomNodeType: CustomNodeType) => void
  creating: boolean
  onCustomNodeTypeDelete: (nodeType: CustomNodeType) => void
}

function Drawer({
  nodeTypes,
  customNodeTypes,
  onCreateStart,
  createCustomNodeTypeEnabled,
  onCreateComplete,
  creating,
  onCustomNodeTypeDelete,
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
      <div className="flex flex-wrap">
        {nodeTypes.map((nodeType) =>
          nodeType.hidden ? null : (
            <NodeButton nodeType={nodeType} key={nodeType.id} />
          )
        )}
      </div>
      <div style={{ width: 10 }} />
      <div className="flex flex-wrap">
        {customNodeTypes.map((customNodeType) => (
          <CustomNodeButton
            key={customNodeType.id}
            nodeType={customNodeType}
            onDelete={onCustomNodeTypeDelete}
          />
        ))}
        <CreateTypeButton
          onCreateStart={onCreateStart}
          enabled={createCustomNodeTypeEnabled}
          onCreateComplete={onCreateComplete}
          creating={creating}
        />
      </div>
    </div>
  )
}

export default Drawer
