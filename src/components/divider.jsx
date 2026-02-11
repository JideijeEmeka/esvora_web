import React from 'react'

const Divider = ({width = 'full', className = ''}) => {
  return (
    <div className={`${className} w-${width} bg-gray-200 h-0.5`}></div>
  )
}

export default Divider