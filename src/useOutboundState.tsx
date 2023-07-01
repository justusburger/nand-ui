import { useContext, useEffect } from 'react'
import DataContext from './DataContext'

interface UseOutboundStateProps {
  nodeId: string
  outputId: string
  outputEnabled: boolean
}

function useOutboundState({
  nodeId,
  outputId,
  outputEnabled,
}: UseOutboundStateProps) {
  const { setValue } = useContext(DataContext)
  useEffect(() => {
    setValue((prevValue) => ({
      ...prevValue,
      [nodeId]: {
        ...(prevValue[nodeId] || {}),
        [outputId]: outputEnabled,
      },
    }))
  }, [outputEnabled, nodeId])
}

export default useOutboundState
