import { useCallback, useEffect, useState } from 'react'
import { useReactFlow } from 'reactflow'
import useNodeById from './useNodeById'

function useNodeDataState<TData, T>(
  nodeId: string,
  key: keyof TData,
  defaultValue: T
): [T, (newValue: T | ((oldValue: T) => T)) => void] {
  const reactFlowInstance = useReactFlow()
  const node = useNodeById(nodeId)
  const setValue = useCallback(
    (newValue: T | ((oldValue: T) => T)) => {
      if (!nodeId) return
      reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = {
              ...node.data,
              [key]:
                typeof newValue === 'function'
                  ? (newValue as (oldValue: T) => T)(node.data[key])
                  : newValue,
            }
          }
          return node
        })
      )
    },
    [reactFlowInstance, nodeId, key]
  )
  const currentValue = ((node?.data || {}) as TData)[key] as T
  const [initialised, setInitialised] = useState(false)
  useEffect(() => {
    if (initialised || !nodeId) return
    setInitialised(true)
    if (!currentValue) setValue(defaultValue)
  }, [initialised, currentValue, defaultValue, nodeId])
  return [currentValue || defaultValue, setValue]
}

export default useNodeDataState
