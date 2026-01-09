import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  const hoverStyles = hover
    ? 'cursor-pointer hover:bg-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10'
    : ''

  return (
    <div
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
