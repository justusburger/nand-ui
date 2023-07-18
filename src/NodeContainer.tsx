function NodeContainer({ children }: React.PropsWithChildren) {
  return (
    <div
      className=" bg-white rounded"
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: 'auto',
      }}
    >
      {children}
    </div>
  )
}

export default NodeContainer
