import React, { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import BottomDrawer from './BottomDrawer'

const ChatHead: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const dragStartTime = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const getSnapPoints = () => {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const chatHeadSize = 80
    const margin = 20
    
    return [
      // Left side snap points only
      { x: margin, y: margin }, // Top-left
      { x: margin, y: windowHeight / 2 - chatHeadSize / 2 }, // Left-center
      { x: margin, y: windowHeight - chatHeadSize - margin }, // Bottom-left
      
      // Right side snap points only
      { x: windowWidth - chatHeadSize - margin, y: margin }, // Top-right
      { x: windowWidth - chatHeadSize - margin, y: windowHeight / 2 - chatHeadSize / 2 }, // Right-center
      { x: windowWidth - chatHeadSize - margin, y: windowHeight - chatHeadSize - margin }, // Bottom-right
    ]
  }
  
  const snapToNearestPoint = (currentX: number, currentY: number) => {
    const snapPoints = getSnapPoints()
    let nearestPoint = snapPoints[0]
    let minDistance = Infinity
    
    console.log(`Current position: (${currentX}, ${currentY})`)
    console.log('Available snap points:', snapPoints)
    
    snapPoints.forEach((point, index) => {
      const distance = Math.sqrt(
        Math.pow(currentX - point.x, 2) + Math.pow(currentY - point.y, 2)
      )
      console.log(`Point ${index}: (${point.x}, ${point.y}) - distance: ${distance}`)
      if (distance < minDistance) {
        minDistance = distance
        nearestPoint = point
      }
    })
    
    console.log(`Snapping to: (${nearestPoint.x}, ${nearestPoint.y}) with distance: ${minDistance}`)
    return nearestPoint
  }
  
  const handleDragStart = () => {
    setIsDragging(true)
    setHasMoved(false)
    dragStartTime.current = Date.now()
  }
  
  const handleDrag = (_event: any, info: PanInfo) => {
    const distance = Math.sqrt(info.delta.x ** 2 + info.delta.y ** 2)
    if (distance > 5) {
      setHasMoved(true)
    }
    
    // Don't update position during drag - let Framer Motion handle it
    // We'll only update position on drag end for snapping
  }
  
  const handleDragEnd = (_event: any, info: PanInfo) => {
    setIsDragging(false)
    
    const dragDuration = Date.now() - dragStartTime.current
    const dragDistance = Math.sqrt(
      (info.offset.x) ** 2 + 
      (info.offset.y) ** 2
    )
    
    // If it was a quick tap with minimal movement, open drawer
    if (dragDuration < 200 && dragDistance < 10 && !hasMoved) {
      setIsDrawerOpen(true)
      return
    }
    
    // Get the final position from the drag info
    const finalX = position.x + info.offset.x
    const finalY = position.y + info.offset.y
    
    console.log(`Drag ended - position: (${position.x}, ${position.y}), offset: (${info.offset.x}, ${info.offset.y})`)
    console.log(`Final position: (${finalX}, ${finalY})`)
    
    // Snap to nearest snap point with smooth animation
    const snapPosition = snapToNearestPoint(finalX, finalY)
    
    // Snap to nearest snap point
    console.log(`Snapping to: (${snapPosition.x}, ${snapPosition.y})`)
    
    // Update position state - this will trigger the animate prop
    setPosition(snapPosition)
  }
  
  
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }
  
  // Initialize position to a snap point
  useEffect(() => {
    const updatePosition = () => {
      const snapPoints = getSnapPoints()
      // Start at the right-center snap point (index 4)
      const initialPosition = snapPoints[4] // Right-center
      setPosition(initialPosition)
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    
    return () => window.removeEventListener('resize', updatePosition)
  }, [])
  
  return (
    <>
      {/* Facebook-style draggable chat head with smooth physics */}
      <motion.div
        ref={containerRef}
        className="fixed z-50 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl cursor-pointer"
        drag
        dragMomentum={false}
        dragElastic={0}
        dragSnapToOrigin={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{
          x: position.x,
          y: position.y,
          scale: isDragging ? 1.2 : [1, 1.05, 1],
          boxShadow: isDragging 
            ? "0 30px 60px rgba(59, 130, 246, 0.6)" 
            : "0 10px 30px rgba(0, 0, 0, 0.2)"
        }}
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
        }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
        }}
        transition={{
          scale: {
            duration: isDragging ? 0.1 : 2,
            repeat: isDragging ? 0 : Infinity,
            ease: "easeInOut"
          },
          boxShadow: {
            duration: 0.3,
            ease: "easeOut"
          }
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <MessageCircle 
            size={32} 
            className="text-white" 
          />
        </div>
        
        {!isDragging && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
      
      <BottomDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
      />
    </>
  )
}

export default ChatHead