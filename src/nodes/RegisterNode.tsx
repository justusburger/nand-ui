import { NodeProps, useEdges, useNodes } from 'reactflow'
import SimpleNode from './SimpleNode'
import { useEffect } from 'react'
import useInboundState from '../useInboundState'
import useNodeDataState from '../useNodeDataState'

const dataInHandleId = 'Data in'
const readHandleId = 'Read'
const clockHandleId = 'Clock'
const inputHandleIds = [dataInHandleId, readHandleId, clockHandleId]
export interface RegisterNodeData {
  on: boolean
}
function RegisterNode({ id }: NodeProps<RegisterNodeData>) {
  const nodes = useNodes()
  const edges = useEdges()
  const inboundState = useInboundState(id, nodes, edges)
  const [on, setOn] = useNodeDataState<RegisterNodeData, boolean>(
    id,
    'on',
    false
  )
  useEffect(() => {
    if (inboundState[readHandleId] && inboundState[clockHandleId]) {
      setOn(inboundState[dataInHandleId])
    }
  }, [JSON.stringify(inboundState)])
  return (
    <SimpleNode
      id={id}
      name="Register"
      inputHandleIds={inputHandleIds}
      outputHandleId="out"
      outputEnabled={() => on}
    />
  )
}

export default RegisterNode
