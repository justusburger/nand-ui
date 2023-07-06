import AndNode from './nodes/AndNode'
import OrNode from './nodes/OrNode'
import XORNode from './nodes/XORNode'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'
import CustomNode from './nodes/CustomNode'
import RelayNode from './nodes/RelayNode'
import { Node, Edge, NodeProps } from 'reactflow'
import { ReactElement } from 'react'

export const NODE_TYPES_IDS = {
  INPUT: 'in',
  OUTPUT: 'out',
  AND: 'and',
  OR: 'or',
  XOR: 'xor',
  CUSTOM: 'custom',
  RELAY: 'relay',
  INPUT_RELAY: 'input-relay',
  OUTPUT_RELAY: 'output-relay',
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
    id: NODE_TYPES_IDS.INPUT_RELAY,
    name: 'Relay',
    node: RelayNode,
    hidden: true,
  },
  {
    id: NODE_TYPES_IDS.OUTPUT_RELAY,
    name: 'Relay',
    node: RelayNode,
    hidden: true,
  },
]
