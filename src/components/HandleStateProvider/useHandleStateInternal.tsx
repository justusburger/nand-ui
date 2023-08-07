import { useContext } from 'react'
import Context from './Context'

function useHandleStateInternal() {
  return useContext(Context)
}

export default useHandleStateInternal
