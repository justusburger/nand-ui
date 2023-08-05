import { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import Context from './Context'

function HandleStateProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<Record<string, Record<string, boolean>>>(
    {}
  )
  const updateNode = useCallback(
    (nodeId: string, newState: Record<string, boolean>) => {
      setTimeout(
        () =>
          setState((prevState) => {
            const prevOutboundState = prevState[nodeId]
            if (JSON.stringify(prevOutboundState) === JSON.stringify(newState))
              return prevState
            return {
              ...prevState,
              [nodeId]: newState,
            }
          }),
        0
      )
    },
    [setState]
  )
  const value = useMemo(() => {
    return {
      nodes: state,
      updateNode,
    }
  }, [state, updateNode])
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default HandleStateProvider
