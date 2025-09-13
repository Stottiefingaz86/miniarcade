import React, { useEffect, useRef, useState } from 'react'
import BottomDrawer from './BottomDrawer'
// import cherryIcon from './cherry.svg'

const StableChatHead: React.FC = () => {
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // Spring config for smooth snaps with bounce
  const SPRING = { stiffness: 500, damping: 35, dt: 1/60 } // nice bounce
  const MAGNET_PX = 18      // distance from edge to "magnet" the head
  const RAIL_LOCK_PX = 20   // if this close to an edge at pointerdown, lock to that rail during drag
  const ANCHOR_SPACING = 60 // spacing between anchor points
  
  // State (never read from computed styles)
  const stateRef = useRef({
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    baseX: 0,
    baseY: 0,
    dragging: false,
    moved: false,
    raf: 0,
    rail: null as 'left' | 'right' | null,
    edgeAtDown: null as 'left' | 'right' | null, // temp memory for potential rail
    sx: { x: 0, v: 0 },  // spring state for x
    sy: { x: 0, v: 0 },  // spring state for y
    anim: 0              // raf id for spring loop
  })

  const margin = -8 // Allow bubble to go off screen slightly

  // Measure size dynamically (no hardcoded size)
  const bubbleSize = () => {
    if (!bubbleRef.current) return 64 // fallback (16 * 4 = 64px)
    const r = bubbleRef.current.getBoundingClientRect()
    return Math.round(Math.max(r.width, r.height))
  }

  // A tiny spring integrator for one dimension (semi-implicit Euler)
  const springStep = (state: { x: number, v: number }, target: number, cfg = SPRING) => {
    const x = state.x, v = state.v, k = cfg.stiffness, c = cfg.damping, dt = cfg.dt
    const a = -k * (x - target) - c * v   // F = -kx - cv (mass = 1)
    state.v = v + a * dt
    state.x = x + state.v * dt
    return state
  }

  const setTransform = (el: HTMLElement, tx: number, ty: number) => {
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
  }

  const apply = () => {
    if (bubbleRef.current) {
      setTransform(bubbleRef.current, stateRef.current.x, stateRef.current.y)
    }
  }

  const scheduleApply = () => {
    if (!stateRef.current.raf) {
      stateRef.current.raf = requestAnimationFrame(() => {
        stateRef.current.raf = 0
        apply()
      })
    }
  }

  // Position bubble initially (bottom-right)
  const placeInitial = () => {
    const saved = localStorage.getItem('chathead-pos')
    const vw = window.innerWidth
    const vh = window.innerHeight
    const size = bubbleSize()
    
    if (saved) {
      try {
        const p = JSON.parse(saved)
        stateRef.current.x = p.x
        stateRef.current.y = p.y
      } catch {}
    } else {
      stateRef.current.x = vw - size - 20
      stateRef.current.y = vh - size - 30 // above home bar
    }
    apply()
  }

  // Helper functions for bounds, rubber-banding, and magnet
  const clampY = (val: number) => {
    const size = bubbleSize()
    const maxY = window.innerHeight - size - margin
    return Math.max(margin, Math.min(val, maxY))
  }

  const boundY = (val: number) => {
    const size = bubbleSize()
    const maxY = window.innerHeight - size - margin
    return Math.max(margin, Math.min(val, maxY))
  }

  // const nearestEdgeTargetX = (curX: number) => {
  //   const size = bubbleSize()
  //   const left = margin, right = window.innerWidth - size - margin
  //   const toLeft = Math.abs(curX - left)
  //   const toRight = Math.abs(curX - right)
  //   // Magnetic pull if within MAGNET_PX
  //   if (toLeft < MAGNET_PX) return left
  //   if (toRight < MAGNET_PX) return right
  //   return null
  // }

  // Calculate anchor points along the rail
  const getAnchorPoints = () => {
    const size = bubbleSize()
    const vh = window.innerHeight
    const anchors = []
    
    // Start from top margin and create anchors every ANCHOR_SPACING pixels
    for (let y = margin; y <= vh - size - margin; y += ANCHOR_SPACING) {
      anchors.push(y)
    }
    
    // Always include the bottom anchor
    const bottomAnchor = vh - size - margin
    if (!anchors.includes(bottomAnchor)) {
      anchors.push(bottomAnchor)
    }
    
    return anchors
  }

  // Find the nearest anchor point
  const findNearestAnchor = (targetY: number) => {
    const anchors = getAnchorPoints()
    let nearest = anchors[0]
    let minDistance = Math.abs(targetY - anchors[0])
    
    for (const anchor of anchors) {
      const distance = Math.abs(targetY - anchor)
      if (distance < minDistance) {
        minDistance = distance
        nearest = anchor
      }
    }
    
    return nearest
  }

  // Keep inside viewport
  const clampToViewport = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const size = bubbleSize()
    const maxX = vw - size - margin
    const maxY = vh - size - margin
    stateRef.current.x = Math.max(margin, Math.min(stateRef.current.x, maxX))
    stateRef.current.y = Math.max(margin, Math.min(stateRef.current.y, maxY))
  }

  // Spring-based edge snap
  // const edgeSnapSpring = () => {
  //   const size = bubbleSize()
  //   const left = margin
  //   const right = window.innerWidth - size - margin
  //   const targetX = (Math.abs(stateRef.current.x - left) < Math.abs(stateRef.current.x - right)) ? left : right
  //   stateRef.current.rail = (targetX === left) ? 'left' : 'right'
  //   animateTo({ x: targetX, y: clampY(stateRef.current.y) })
  // }

  // Spring animation loop
  const animateTo = (target: { x: number, y: number }, done?: () => void) => {
    const state = stateRef.current
    cancelAnimationFrame(state.anim)
    state.sx.x = state.x
    state.sx.v = 0
    state.sy.x = state.y
    state.sy.v = 0

    const tick = () => {
      // Rubber-band on Y if beyond bounds while animating
      // const by = boundY(state.sy.x)
      const ty = target.y
      const yTarget = ty

      springStep(state.sx, target.x)
      springStep(state.sy, yTarget)

      state.x = state.sx.x
      state.y = state.sy.x
      apply()

      const vxSmall = Math.abs(state.sx.v) < 0.02 && Math.abs(state.sy.v) < 0.02
      const xClose = Math.abs(state.x - target.x) < 0.5
      const yClose = Math.abs(state.y - yTarget) < 0.5

      if (vxSmall && xClose && yClose) {
        state.x = target.x
        state.y = yTarget
        apply()
        if (done) done()
        return
      }
      state.anim = requestAnimationFrame(tick)
    }
    state.anim = requestAnimationFrame(tick)
  }

  // Simple smooth snap to anchor point
  const snapToAnchor = (targetY: number) => {
    const state = stateRef.current
    if (!state.rail) return

    const size = bubbleSize()
    const left = margin, right = window.innerWidth - size - margin
    const railX = (state.rail === 'left') ? left : right
    
    // Find nearest anchor point
    const nearestAnchor = findNearestAnchor(targetY)
    
    // Animate to anchor point with spring
    animateTo({ x: railX, y: nearestAnchor })
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    const state = stateRef.current
    state.dragging = true
    state.moved = false
    
    if (bubbleRef.current) {
      bubbleRef.current.setPointerCapture(e.pointerId)
    }
    
    state.startX = e.clientX
    state.startY = e.clientY
    state.baseX = state.x
    state.baseY = state.y

    const size = bubbleSize()
    const left = margin, right = window.innerWidth - size - margin
    state.edgeAtDown = (Math.abs(state.x - left) <= RAIL_LOCK_PX) ? 'left'
                     : (Math.abs(state.x - right) <= RAIL_LOCK_PX) ? 'right'
                     : null

    state.rail = null // don't lock yet
    cancelAnimationFrame(state.anim) // if an animation is running, stop it for direct drag control
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const state = stateRef.current
    if (!state.dragging) return
    
    const dx = e.clientX - state.startX
    const dy = e.clientY - state.startY
    
    if (!state.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      state.moved = true
    }

    const size = bubbleSize()
    const left = margin, right = window.innerWidth - size - margin

    // Decide rail
    if (!state.rail && state.edgeAtDown) {
      // Require a small nudge toward that edge before locking (prevents "auto-stuck")
      if (state.edgeAtDown === 'left' && dx < -4) state.rail = 'left'
      if (state.edgeAtDown === 'right' && dx > 4) state.rail = 'right'
    }
    // If user pulls away horizontally, drop the rail
    if (state.rail === 'left' && dx > 10) state.rail = null
    if (state.rail === 'right' && dx < -10) state.rail = null

    if (state.rail) {
      // Simple rail movement - just follow Y with X locked
      const size = bubbleSize()
      const railX = (state.rail === 'left') ? margin : (window.innerWidth - size - margin)
      state.x = railX
      state.y = boundY(state.baseY + dy)
    } else {
      state.x = state.baseX + dx
      state.y = boundY(state.baseY + dy)

      // gentle magnet when near either edge
      const toLeft = Math.abs(state.x - left)
      const toRight = Math.abs(state.x - right)
      if (toLeft < MAGNET_PX) state.x = left
      else if (toRight < MAGNET_PX) state.x = right
    }

    scheduleApply()
  }

  const endDrag = () => {
    const state = stateRef.current
    if (!state.dragging) return
    
    state.dragging = false

    if (state.rail) {
      // Snap to nearest anchor point on rail
      snapToAnchor(state.y)
    } else {
      // Choose snap target (nearest edge)
      const size = bubbleSize()
      const left = margin, right = window.innerWidth - size - margin
      const targetX = ((state.x - left) < (right - state.x) ? left : right)

      const target = { x: targetX, y: clampY(state.y) }
      animateTo(target, () => {
        localStorage.setItem('chathead-pos', JSON.stringify(target))
      })
    }
  }

  const handlePointerUp = () => {
    endDrag()
  }

  const handlePointerCancel = () => {
    endDrag()
  }

  // Tap to open drawer (only if not dragged)
  const handleClick = () => {
    if (stateRef.current.moved) return
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
  }

  // Keep bubble within viewport on rotate/resize
  const settleInsideViewport = () => {
    const state = stateRef.current
    const size = bubbleSize()
    const left = margin, right = window.innerWidth - size - margin
    const targetX = state.rail ? (state.rail === 'left' ? left : right) : Math.min(Math.max(state.x, left), right)
    const targetY = clampY(state.y)
    animateTo({ x: targetX, y: targetY })
  }

  useEffect(() => {
    placeInitial()
    
    window.addEventListener('resize', settleInsideViewport)
    window.addEventListener('orientationchange', settleInsideViewport)

    return () => {
      window.removeEventListener('resize', settleInsideViewport)
      window.removeEventListener('orientationchange', settleInsideViewport)
    }
  }, [])

  return (
    <>
      {/* Rock-solid draggable chat head */}
      <div
        ref={bubbleRef}
        className={`fixed w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl cursor-pointer select-none ${isDrawerOpen ? 'z-30' : 'z-50'}`}
        style={{
          left: 0,
          top: 0,
          touchAction: 'none',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onClick={handleClick}
      >
        {/* Pulse ring around the bubble */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-emerald-400 opacity-75"
          style={{
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
        
        <div className="w-full h-full flex items-center justify-center relative z-10">
          <div className="text-white text-2xl font-bold">🍒</div>
        </div>
      </div>

      <BottomDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleCloseDrawer} 
      />
    </>
  )
}

export default StableChatHead
