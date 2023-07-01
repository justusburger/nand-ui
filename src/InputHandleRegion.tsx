function InputHandleRegion({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: -9,
      }}
    >
      {children}
    </div>
  )
}

export default InputHandleRegion
