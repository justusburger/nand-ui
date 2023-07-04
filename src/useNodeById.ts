import { useMemo } from 'react'
import { useNodes } from 'reactflow'

function useNodeById(id: string) {
  const nodes = useNodes()
  return useMemo(() => nodes.find((node) => node.id === id), [nodes, id])
}

export default useNodeById
