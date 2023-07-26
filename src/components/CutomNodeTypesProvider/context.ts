import React from 'react'
import { CustomNodeType } from '../../nodeTypes'

export interface CustomNodeTypesContext {
  customNodeTypes: CustomNodeType[]
  setCustomNodeTypes: React.Dispatch<React.SetStateAction<CustomNodeType[]>>
}

export default React.createContext<CustomNodeTypesContext>({
  customNodeTypes: [],
} as any)
