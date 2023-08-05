import { useMemo } from 'react'
import { EdgeProps, BaseEdge, getSmoothStepPath } from 'reactflow'
import { useHandleState } from './components/HandleStateProvider'

function NodeEdge({
  source,
  sourceHandleId,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  selected,
}: EdgeProps) {
  const { outboundState } = useHandleState(source)
  const enabled = outboundState[sourceHandleId!]
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const style = useMemo(() => {
    if (enabled)
      return {
        stroke: 'red',
        strokeWidth: selected ? 3 : 1,
      }
    return {
      stroke: selected ? '#5c60b0' : '#fff',
      opacity: selected ? 1 : 0.3,
      strokeWidth: selected ? 3 : 1,
    }
  }, [enabled, selected])

  return <BaseEdge path={edgePath} style={style} />
}

export default NodeEdge
