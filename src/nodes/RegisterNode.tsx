import { NodeProps } from 'reactflow'
import SimpleNode from './SimpleNode'
import { useEffect, useState } from 'react'
import { useHandleState } from '../components/HandleStateProvider'
import React from 'react'

const dataInHandleId = 'Data in'
const readHandleId = 'Read'
const clockHandleId = 'Clock'
const inputHandleIds = [dataInHandleId, readHandleId, clockHandleId]

function RegisterNode({ id }: NodeProps) {
  const { inboundState } = useHandleState(id)
  const [on, setOn] = useState<boolean>(false)
  const [previousInboundState, setPreviousInboundState] = useState<any>({})
  useEffect(() => {
    if (
      inboundState[readHandleId] &&
      inboundState[clockHandleId] &&
      !previousInboundState[clockHandleId]
    ) {
      setOn(inboundState[dataInHandleId])
    }
    setPreviousInboundState(inboundState)
  }, [
    inboundState[readHandleId],
    inboundState[clockHandleId],
    previousInboundState[clockHandleId],
  ])
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

export default React.memo(RegisterNode)
