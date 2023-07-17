function DigitalNumber({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        fontFamily: 'd7',
        top: 0,
        left: '50%',
        transform: 'translate(-50%, -100%)',
      }}
      className="text-blue-300 absolute text-xl tabular-nums"
    >
      {children}
    </div>
  )
}

export default DigitalNumber
