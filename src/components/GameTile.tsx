import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Game {
  id: string
  name: string
  icon: LucideIcon
  color: string
  description: string
}

interface GameTileProps {
  game: Game
  onClick: () => void
}

const GameTile: React.FC<GameTileProps> = ({ game, onClick }) => {
  const IconComponent = game.icon
  
  return (
    <motion.button
      className="relative bg-white rounded-2xl p-4 shadow-lg border border-gray-100 game-tile-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-5 rounded-2xl`} />
      
      {/* Icon container */}
      <div className={`relative w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center shadow-lg`}>
        <IconComponent size={24} className="text-white" />
      </div>
      
      {/* Game name */}
      <h3 className="text-sm font-semibold text-gray-800 text-center leading-tight">
        {game.name}
      </h3>
      
      {/* Hover effect overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

export default GameTile


