import React from 'react'

const ButtonWidget = ({ text, onClick }) => {
  return (
    <button className='bg-primary w-[400px] h-[48px] text-white px-6 py-1.5 text-[16px] 
    max-md:w-80 max-md:mx-auto max-md:mt-2 max-md:mb-6 max-md:text-[14px] mt-6 mb-3
        flex items-center justify-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
        transition rounded-full font-medium hover:text-white cursor-pointer' onClick={onClick}>{text}</button>
  )
}

export default ButtonWidget;