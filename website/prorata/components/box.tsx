import React from 'react'

export const Box: React.FC = ({ children, ...props }) => {
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
