import { useState } from 'react'

function useLocalStorageState<T>({
  key,
  defaultValue,
}: {
  key: string
  defaultValue: T
}): [T, (newValue: T) => void] {
  const [value, setValueInternal] = useState<T>(() => {
    const valueFromStorage = localStorage.getItem(key)
    if (valueFromStorage) return JSON.parse(valueFromStorage)
    return defaultValue
  })

  function setValue(newValue: T) {
    setValueInternal(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setValue]
}

export default useLocalStorageState
