export const Box = ({ children, ...props }): JSX.Element => {
  return (
    <div className="box" {...props}>
      {children}
      <style jsx>{`
        .box {
        }
      `}</style>
    </div>
  )
}
