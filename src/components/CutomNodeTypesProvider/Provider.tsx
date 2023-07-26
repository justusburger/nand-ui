import { PropsWithChildren, useMemo } from 'react'
import Context from './context'
import { CustomNodeType } from '../../nodeTypes'

interface CustomNodeTypesProviderProps {
  customNodeTypes: CustomNodeType[]
  setCustomNodeTypes: React.Dispatch<React.SetStateAction<CustomNodeType[]>>
}

function CustomNodeTypesProvider({
  children,
  customNodeTypes,
  setCustomNodeTypes,
}: PropsWithChildren<CustomNodeTypesProviderProps>) {
  const value = useMemo(
    () => ({ customNodeTypes, setCustomNodeTypes }),
    [customNodeTypes, setCustomNodeTypes]
  )
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export default CustomNodeTypesProvider
