import React from 'react'

export interface HandleStateContext {
  nodes: Record<string, Record<string, boolean>>
  updateNode: (nodeId: string, newState: Record<string, boolean>) => void
}

export default React.createContext<HandleStateContext>({
  nodes: {},
  updateNode: () => undefined,
})
