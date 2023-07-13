import { useMemo } from 'react'
import { EdgeProps, getBezierPath, BaseEdge, useNodes } from 'reactflow'

function NodeEdge({
  source,
  sourceHandleId,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
}: EdgeProps) {
  const nodes = useNodes()
  const enabled = useMemo(() => {
    const sourceNode = nodes.find((node) => node.id === source)
    if (!sourceNode || !sourceHandleId) return false
    const { outboundHandleState = {} } = sourceNode.data || ({} as any)
    return outboundHandleState[sourceHandleId]
  }, [nodes])
  const [edgePath] = getBezierPath({
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
        strokeLinecap: 'round',
      }
    return {
      stroke: '#fff',
      opacity: 0.3,
    }
  }, [enabled])

  return <BaseEdge path={edgePath} style={style} />
}

export default NodeEdge
