import React from 'react'

type DataContextValue = { [nodeId: string]: { [handleId: string]: boolean } }

type DataContext = {
  value: DataContextValue
  setValue: (setter: (value: DataContextValue) => DataContextValue) => void
}

const DataContext = React.createContext<DataContext>({
  value: {},
  setValue: (setter = (value) => value) => {},
})

export default DataContext
