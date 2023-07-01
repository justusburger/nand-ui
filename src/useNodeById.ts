import { useMemo } from 'react'
import { useNodes } from 'reactflow'

function useNodeById(id: string | undefined) {
  const nodes = useNodes()
  return useMemo(() => {
    if (!id) return null
    return nodes.find((node) => node.id === id)
  }, [nodes, id])
}

export default useNodeById
