import AndNode from './nodes/AndNode'
import NandNode from './nodes/NandNode'
import OrNode from './nodes/OrNode'
import XORNode from './nodes/XORNode'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'
import CustomNode from './nodes/CustomNode'
import RelayNode from './nodes/RelayNode'
import NotNode from './nodes/NotNode'
import { Node, Edge, NodeProps } from 'reactflow'
import { ReactElement } from 'react'

export const NODE_TYPES_IDS = {
  INPUT: 'in',
  OUTPUT: 'out',
  AND: 'and',
  NAND: 'nand',
  OR: 'or',
  XOR: 'xor',
  CUSTOM: 'custom',
  RELAY: 'relay',
  NOT: 'not',
} as const

export type NodeType = {
  id: string
  name: string
  node: (props: NodeProps<any>) => ReactElement
  data?: {}
  hidden?: boolean
}

export interface CustomNodeType {
  id: string
  name: string
  nodes: Node[]
  edges: Edge[]
}

export const defaultNodeTypes: NodeType[] = [
  {
    id: NODE_TYPES_IDS.INPUT,
    name: 'Input',
    node: InputNode,
  },
  {
    id: NODE_TYPES_IDS.OUTPUT,
    name: 'Output',
    node: OutputNode,
  },
  {
    id: NODE_TYPES_IDS.AND,
    name: 'AND',
    node: AndNode,
  },
  {
    id: NODE_TYPES_IDS.NAND,
    name: 'NAND',
    node: NandNode,
  },
  {
    id: NODE_TYPES_IDS.OR,
    name: 'OR',
    node: OrNode,
  },
  {
    id: NODE_TYPES_IDS.XOR,
    name: 'XOR',
    node: XORNode,
  },
  {
    id: NODE_TYPES_IDS.CUSTOM,
    name: 'Custom',
    node: CustomNode,
    hidden: true,
  },
  {
    id: NODE_TYPES_IDS.RELAY,
    name: 'Relay',
    node: RelayNode,
  },
  {
    id: NODE_TYPES_IDS.NOT,
    name: 'Not',
    node: NotNode,
  },
]

export const defaultNodeTypeMap = defaultNodeTypes.reduce((acc, nodeType) => {
  acc[nodeType.id] = nodeType.node
  return acc
}, {} as { [id: string]: NodeType['node'] })
