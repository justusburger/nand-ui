function OutputHandleRegion({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        marginRight: -9,
      }}
    >
      {children}
    </div>
  )
}

export default OutputHandleRegion
