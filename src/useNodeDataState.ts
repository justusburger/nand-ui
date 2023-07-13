import { useCallback, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import useNodeById from './useNodeById'

function useNodeDataState<TData, T>(
  nodeId: string,
  key: keyof TData,
  defaultValue: T
): [T, (newValue: T) => void] {
  const reactFlowInstance = useReactFlow()
  const node = useNodeById(nodeId)
  if (!node) throw new Error('Node not found')
  const currentValue = (node.data as TData)[key] as T
  const setValue = useCallback(
    (newValue: T) => {
      reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = {
              ...node.data,
              [key]: newValue,
            }
          }
          return node
        })
      )
    },
    [reactFlowInstance, nodeId, key]
  )
  const [initialised, setInitialised] = useState(false)
  useEffect(() => {
    if (initialised) return
    setInitialised(true)
    if (!currentValue) setValue(defaultValue)
  }, [initialised, currentValue, defaultValue])
  return [currentValue || defaultValue, setValue]
}

export default useNodeDataState
