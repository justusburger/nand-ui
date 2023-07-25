import { ReactElement } from 'react'
import { Node, Edge, NodeProps } from 'reactflow'
import AndNode from './nodes/AndNode'
import NandNode from './nodes/NandNode'
import OrNode from './nodes/OrNode'
import XORNode from './nodes/XORNode'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'
import CustomNode from './nodes/CustomNode'
import RelayNode from './nodes/RelayNode'
import NotNode from './nodes/NotNode'
import NorNode from './nodes/NorNode'
import RegisterNode from './nodes/RegisterNode'
import Memory256Node from './nodes/Memory256Node'
import TextNode from './nodes/TextNode'
import JKFFNode from './nodes/JKFFNode'
import CounterNode from './nodes/CounterNode'
import ClockNode from './nodes/ClockNode'

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
  NOR: 'nor',
  REGISTER: 'register',
  MEMORY_256: 'memory_256',
  TEXT: 'text',
  JKFF: 'jkff',
  COUNTER: 'counter',
  CLOCK: 'clock',
} as const

export type NodeType<TData = any> = {
  id: string
  name: string
  node?: (props: NodeProps<any>) => ReactElement
  data?: TData
  hidden?: boolean
}
export interface CustomNodeTypeData {
  nodes: Node[]
  edges: Edge[]
  name: string
}
export type CustomNodeType = NodeType<CustomNodeTypeData>

export const defaultNodeTypes: NodeType[] = [
  {
    id: NODE_TYPES_IDS.TEXT,
    name: 'Text',
    node: TextNode,
  },
  {
    id: NODE_TYPES_IDS.INPUT,
    name: 'IN',
    node: InputNode,
  },
  {
    id: NODE_TYPES_IDS.OUTPUT,
    name: 'OUT',
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
    id: NODE_TYPES_IDS.NOT,
    name: 'NOT',
    node: NotNode,
  },
  {
    id: NODE_TYPES_IDS.NOR,
    name: 'NOR',
    node: NorNode,
  },
  {
    id: NODE_TYPES_IDS.CUSTOM,
    name: 'Custom',
    node: CustomNode,
    hidden: true,
  },
  {
    id: NODE_TYPES_IDS.RELAY,
    name: 'RELAY',
    node: RelayNode,
  },
  {
    id: NODE_TYPES_IDS.REGISTER,
    name: 'REGISTER',
    node: RegisterNode,
  },
  {
    id: NODE_TYPES_IDS.MEMORY_256,
    name: 'Memory 256',
    node: Memory256Node,
  },
  {
    id: NODE_TYPES_IDS.JKFF,
    name: 'JKFF',
    node: JKFFNode,
  },
  {
    id: NODE_TYPES_IDS.COUNTER,
    name: 'Counter',
    node: CounterNode,
  },
  {
    id: NODE_TYPES_IDS.CLOCK,
    name: 'Clock',
    node: ClockNode,
  },
]

export const defaultNodeTypeMap = defaultNodeTypes
  .filter((nodeType) => nodeType.node)
  .reduce((acc, nodeType) => {
    acc[nodeType.id] = nodeType.node!
    return acc
  }, {} as { [id: string]: (props: NodeProps<any>) => ReactElement })
