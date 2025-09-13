import React, { useState, useRef, useEffect } from 'react'
import { X, ArrowLeft, Settings } from 'lucide-react'
import blackjackImage from './blackjack.png'
import blackjackCardImage from './blackjack_card.png'
import diamondsImage from './diamonds.png'
import diceImage from './dice.png'
import minesImage from './mines.png'
import plinkoImage from './plinko.png'
import wheelImage from './wheel.png'
import hiloImage from './hilo.png'
import keniImage from './keni.png'
import limboImage from './Limbo.png'
import videoPokerImage from './video poker.png'

interface BottomDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ isOpen, onClose }) => {
  const [showBlackjack, setShowBlackjack] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragCurrentY, setDragCurrentY] = useState(0)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Casino games data - All games with PNG images
  const casinoGames = [
    {
      id: 'blackjack',
      name: 'Blackjack',
      image: blackjackCardImage,
      color: 'from-emerald-500 to-teal-500',
      description: 'Beat the dealer with 21!'
    },
    {
      id: 'diamonds',
      name: 'Diamonds',
      image: diamondsImage,
      color: 'from-blue-500 to-cyan-500',
      description: 'Find the diamonds!'
    },
    {
      id: 'dice',
      name: 'Dice',
      image: diceImage,
      color: 'from-purple-500 to-pink-500',
      description: 'Roll the dice!'
    },
    {
      id: 'mines',
      name: 'Mines',
      image: minesImage,
      color: 'from-yellow-500 to-orange-500',
      description: 'Find the gems while avoiding the mines!'
    },
    {
      id: 'plinko',
      name: 'Plinko',
      image: plinkoImage,
      color: 'from-green-500 to-emerald-500',
      description: 'Drop the ball and watch it bounce to your fortune!'
    },
    {
      id: 'wheel',
      name: 'Wheel',
      image: wheelImage,
      color: 'from-red-500 to-orange-500',
      description: 'Spin the wheel and bet on your lucky number!'
    },
    {
      id: 'hilo',
      name: 'Hi-Lo',
      image: hiloImage,
      color: 'from-indigo-500 to-purple-500',
      description: 'Guess if the next card is higher or lower!'
    },
    {
      id: 'keni',
      name: 'Keni',
      image: keniImage,
      color: 'from-pink-500 to-rose-500',
      description: 'Pick your numbers and hope for the best!'
    },
    {
      id: 'limbo',
      name: 'Limbo',
      image: limboImage,
      color: 'from-cyan-500 to-blue-500',
      description: 'Set your multiplier and watch it rise!'
    },
    {
      id: 'video-poker',
      name: 'Video Poker',
      image: videoPokerImage,
      color: 'from-orange-500 to-red-500',
      description: 'Play poker against the machine!'
    }
  ]

  // Handle drag to close functionality
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    setDragStartY(e.clientY)
    setDragCurrentY(e.clientY)
    setDragStartTime(Date.now())
    if (drawerRef.current) {
      drawerRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !drawerRef.current) return
    
    const deltaY = e.clientY - dragStartY
    setDragCurrentY(e.clientY)
    
    // Only allow downward dragging
    if (deltaY > 0) {
      // Disable transitions during drag for smooth following
      drawerRef.current.style.transition = 'none'
      drawerRef.current.style.transform = `translateY(${deltaY}px)`
    }
  }

  const handlePointerUp = () => {
    if (!isDragging || !drawerRef.current) return
    
    const deltaY = dragCurrentY - dragStartY
    const velocity = Math.abs(deltaY) / (Date.now() - dragStartTime)
    setIsDragging(false)
    
    // If dragged down more than 200px OR fast downward swipe, close with animation
    if (deltaY > 200 || (deltaY > 100 && velocity > 0.8)) {
      // Smooth slide down animation before closing
      drawerRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      drawerRef.current.style.transform = `translateY(100vh)`
      
      // Close after animation completes
      setTimeout(() => {
        onClose()
      }, 300)
    } else if (deltaY > 80) {
      // Minimize to show handle bar and header
      setIsMinimized(true)
      drawerRef.current.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      drawerRef.current.style.transform = `translateY(calc(100% - 120px))`
    } else {
      // Smooth snap back to original position
      setIsMinimized(false)
      drawerRef.current.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      drawerRef.current.style.transform = 'translateY(0)'
    }
  }

  // Reset drag state when drawer opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDragging(false)
      setIsMinimized(false)
      if (drawerRef.current) {
        drawerRef.current.style.transform = 'translateY(0)'
      }
    }
  }, [isOpen])

  // Reset blackjack state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setShowBlackjack(false)
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-40 flex items-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        ref={drawerRef}
        className={`relative w-full rounded-t-3xl shadow-2xl overflow-hidden transition-transform duration-200 ${showBlackjack ? 'h-auto' : 'max-h-[85vh] bg-white'}`}
        style={{ 
          touchAction: 'none',
          backgroundColor: showBlackjack ? '#335846' : undefined
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Handle bar - always show */}
        <div 
          className="flex justify-center pt-3 pb-2"
          onClick={() => {
            if (isMinimized) {
              setIsMinimized(false)
              if (drawerRef.current) {
                drawerRef.current.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                drawerRef.current.style.transform = 'translateY(0)'
              }
            }
          }}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header - show when not in blackjack mode (including when minimized) */}
        {!showBlackjack && (
          <div className="flex items-center justify-between px-6 pb-4">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-black tracking-tight">
                MINI CASINO
              </h2>
              <div className="text-sm text-gray-600 font-medium">
                Balance: <span className="text-green-600 font-bold">$542.00</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Settings clicked!')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <Settings size={20} className="text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
        
        {/* Games Carousel - only show when not in blackjack mode and not minimized */}
        {!showBlackjack && !isMinimized && (
          <div className="pb-6">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Single row of all games */}
              {casinoGames.map((game) => {
                return (
                  <button
                    key={game.id}
                    className="relative w-28 h-32 rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group flex-shrink-0 shadow-sm hover:shadow-lg"
                    onClick={() => {
                      if (game.id === 'blackjack') {
                        setShowBlackjack(true)
                      } else {
                        alert(`${game.name} clicked! ${game.description}`)
                      }
                    }}
                  >
                    {/* Full image that fills entire rounded container */}
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                    />
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Blackjack Image Display - Full Size, No Menu */}
        {showBlackjack && (
          <div className="relative">
            {/* Back button overlay - positioned on the left */}
            <div className="absolute top-4 left-4 z-10">
              <button
                onClick={() => setShowBlackjack(false)}
                className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 backdrop-blur-md border border-white/20 shadow-lg"
              >
                <ArrowLeft size={18} className="text-white" />
              </button>
            </div>
            
            {/* Image that determines drawer size - hide when minimized */}
            {!isMinimized && (
              <img 
                src={blackjackImage} 
                alt="Blackjack Game" 
                className="w-full h-auto block"
              />
            )}
          </div>
        )}
        
        {/* Bottom padding for safe area - always show */}
        <div className="h-6" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </div>
    </div>
  )
}

export default BottomDrawer