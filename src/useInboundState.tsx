import { useContext, useMemo } from 'react'
import { useEdges } from 'reactflow'
import DataContext from './DataContext'

interface UseInboundStateProps {
  nodeId?: string
}

function useInboundState({ nodeId }: UseInboundStateProps) {
  const { value } = useContext(DataContext)
  const edges = useEdges()
  const values = useMemo(() => {
    if (!nodeId) return {}
    return edges
      .filter((e) => e.target === nodeId)
      .reduce((acc, edge) => {
        acc[edge.targetHandle!] =
          acc[edge.targetHandle!] ||
          (value[edge.source] || {})[edge.sourceHandle!]
        return acc
      }, {} as { [key: string]: boolean })
  }, [edges, nodeId, value])
  return values
}

export default useInboundState
