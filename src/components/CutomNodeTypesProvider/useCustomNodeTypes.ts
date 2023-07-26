import Context from './context'
import { useContext } from 'react'

function useCustomNodeTypes() {
  return useContext(Context)
}

export default useCustomNodeTypes
