import { useCallback } from 'react'
import { useReactFlow } from 'reactflow'
import useNodeById from './useNodeById'

function useNodeDataState<TData>(
  nodeId: string,
  key: keyof TData,
  defaultValue: TData[typeof key]
): [TData[typeof key], (newValue: TData[typeof key]) => void] {
  const reactFlowInstance = useReactFlow()
  const node = useNodeById(nodeId)
  if (!node) throw new Error('Node not found')
  const currentValue = (node.data as TData)[key]
  const setValue = useCallback(
    (newValue: TData[typeof key]) => {
      reactFlowInstance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                [key]: newValue,
              },
            }
          }
          return node
        })
      )
    },
    [reactFlowInstance, nodeId, key]
  )
  return [currentValue || defaultValue, setValue]
}

export default useNodeDataState
