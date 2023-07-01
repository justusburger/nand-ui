function NodeContainer({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        background: '#fff',
        display: 'flex',
        borderRadius: 4,
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
