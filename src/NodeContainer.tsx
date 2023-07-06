function NodeContainer({ children }: React.PropsWithChildren) {
  return (
    <div
      className="card-background"
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
