import { useMemo } from 'react'
import { EdgeProps, BaseEdge, useNodes, getSmoothStepPath } from 'reactflow'

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
  const nodes = useNodes()
  const enabled = useMemo(() => {
    const sourceNode = nodes.find((node) => node.id === source)
    if (!sourceNode || !sourceHandleId) return false
    const { outboundHandleState = {} } = sourceNode.data || ({} as any)
    return outboundHandleState[sourceHandleId]
  }, [nodes])
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
        strokeWidth: 2,
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
