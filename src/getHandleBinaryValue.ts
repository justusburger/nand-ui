function getHandleBinaryValue(handleIndex: number, numberOfHandles: number) {
  const value = Math.pow(2, handleIndex)
  if (handleIndex > 0 && handleIndex === numberOfHandles - 1) return -value
  return value
}

export default getHandleBinaryValue
