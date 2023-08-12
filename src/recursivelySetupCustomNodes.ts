import cloneNodesAndEdges from './cloneNodesAndEdges'
import { NODE_TYPES_IDS } from './nodeTypes'
import { Node } from 'reactflow'

function recursivelySetupCustomNodes(nodes: Node[], customNodeTypeLookup: any) {
  return nodes.map((node) => {
    if (node.type === NODE_TYPES_IDS.CUSTOM) {
      const { customNodeTypeId } = node.data
      const nodeType = customNodeTypeLookup[customNodeTypeId]
      if (!nodeType) throw new Error('Could not find customNodeType')
      let [initialNodes, initialEdges] = cloneNodesAndEdges(
        nodeType.data.nodes.map((node: any) => ({
          ...node,
          selected: false,
          selectable: false,
          deletable: false,
        })),
        nodeType.data.edges.map((edge: any) => ({
          ...edge,
          selected: false,
          deletable: false,
          focusable: false,
          updatable: false,
        }))
      )
      initialNodes = recursivelySetupCustomNodes(
        initialNodes,
        customNodeTypeLookup
      )
      node.data = {
        ...node.data,
        ...nodeType.data,
        initialNodes,
        initialEdges,
      }
    }
    return node
  })
}

export default recursivelySetupCustomNodes
