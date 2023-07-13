function InputHandleRegion({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: -7,
      }}
    >
      {children}
    </div>
  )
}

export default InputHandleRegion
