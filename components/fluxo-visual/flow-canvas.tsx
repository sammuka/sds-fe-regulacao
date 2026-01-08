'use client'

import { useState, useRef, useCallback, useEffect, ReactNode } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Move, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface FlowCanvasProps {
  children: ReactNode
  className?: string
  minZoom?: number
  maxZoom?: number
  initialZoom?: number
  canvasWidth?: number
  canvasHeight?: number
  showMinimap?: boolean
}

interface CanvasState {
  zoom: number
  pan: { x: number; y: number }
  isDragging: boolean
}

export function FlowCanvas({
  children,
  className,
  minZoom = 0.3,
  maxZoom = 2,
  initialZoom = 1,
  canvasWidth = 500,
  canvasHeight = 900,
  showMinimap = true,
}: FlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CanvasState>({
    zoom: initialZoom,
    pan: { x: 30, y: 20 },
    isDragging: false,
  })
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [modalAberto, setModalAberto] = useState(false)

  const handleZoomIn = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.1, maxZoom),
    }))
  }, [maxZoom])

  const handleZoomOut = useCallback(() => {
    setState(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.1, minZoom),
    }))
  }, [minZoom])

  const handleResetView = useCallback(() => {
    setState({
      zoom: initialZoom,
      pan: { x: 30, y: 20 },
      isDragging: false,
    })
  }, [initialZoom])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const delta = e.deltaY > 0 ? -0.08 : 0.08
    setState(prev => ({
      ...prev,
      zoom: Math.max(minZoom, Math.min(maxZoom, prev.zoom + delta)),
    }))
  }, [minZoom, maxZoom])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setDragStart({ x: e.clientX - state.pan.x, y: e.clientY - state.pan.y })
      setState(prev => ({ ...prev, isDragging: true }))
    }
  }, [state.pan])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (state.isDragging && dragStart) {
      setState(prev => ({
        ...prev,
        pan: {
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        },
      }))
    }
  }, [state.isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setDragStart(null)
    setState(prev => ({ ...prev, isDragging: false }))
  }, [])

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setDragStart(null)
      setState(prev => ({ ...prev, isDragging: false }))
    }
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  const minimapScale = 0.06
  const minimapWidth = canvasWidth * minimapScale
  const minimapHeight = canvasHeight * minimapScale

  const containerWidth = containerRef.current?.clientWidth || 800
  const containerHeight = containerRef.current?.clientHeight || 400
  const viewportWidth = (containerWidth / state.zoom) * minimapScale
  const viewportHeight = (containerHeight / state.zoom) * minimapScale
  const viewportX = (-state.pan.x / state.zoom) * minimapScale
  const viewportY = (-state.pan.y / state.zoom) * minimapScale

  const canvasContent = (centered: boolean = false) => (
    <div
      className={cn(
        "relative transition-transform duration-75",
        centered && "flex items-center justify-center"
      )}
      style={{
        transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
        transformOrigin: centered ? 'center center' : '0 0',
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      {children}
    </div>
  )

  return (
    <>
      <div className={cn('relative overflow-hidden bg-[var(--cinza-50)] rounded-lg', className)}>
        {/* Controles */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-white rounded shadow-sm p-0.5 font-['Poppins']">
          <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-5 w-5" title="Zoom +">
            <ZoomIn className="h-3 w-3" />
          </Button>
          <span className="text-[8px] text-[var(--cinza-600)] font-medium w-7 text-center">
            {Math.round(state.zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-5 w-5" title="Zoom -">
            <ZoomOut className="h-3 w-3" />
          </Button>
          <div className="w-px h-3 bg-[var(--cinza-200)]" />
          <Button variant="ghost" size="icon" onClick={handleResetView} className="h-5 w-5" title="Reset">
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setModalAberto(true)} className="h-5 w-5" title="Expandir">
            <Maximize2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Indicador arrastar */}
        <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-white/90 rounded shadow-sm px-1.5 py-0.5 text-[8px] text-[var(--cinza-600)] font-['Poppins']">
          <Move className="h-2.5 w-2.5" />
          <span>Arraste</span>
        </div>

        {/* Container */}
        <div
          ref={containerRef}
          className={cn(
            'w-full h-full overflow-hidden',
            state.isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {canvasContent(false)}
        </div>

        {/* Minimap */}
        {showMinimap && (
          <div
            className="absolute bottom-2 right-2 z-20 bg-white rounded shadow border border-[var(--cinza-200)] overflow-hidden"
            style={{ width: minimapWidth + 8, height: minimapHeight + 8 }}
          >
            <div className="p-1">
              <div
                className="relative bg-[var(--cinza-100)] rounded-sm"
                style={{ width: minimapWidth, height: minimapHeight }}
              >
                <div
                  className="absolute border border-[var(--azul-principal-500)] bg-[var(--azul-principal-500)]/10 rounded-[1px]"
                  style={{
                    left: Math.max(0, Math.min(viewportX, minimapWidth - viewportWidth)),
                    top: Math.max(0, Math.min(viewportY, minimapHeight - viewportHeight)),
                    width: Math.min(viewportWidth, minimapWidth),
                    height: Math.min(viewportHeight, minimapHeight),
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal expandido */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="!max-w-[1200px] w-[1200px] h-[90vh] p-0 !rounded-2xl overflow-hidden">
          <DialogTitle className="sr-only">Fluxo Visual Expandido</DialogTitle>
          <div className="relative w-full h-full bg-[var(--cinza-50)] rounded-2xl">
            <div className="absolute top-3 left-3 z-20 flex items-center gap-0.5 bg-white rounded-lg shadow-md p-1 font-['Poppins']">
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-6 w-6">
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <span className="text-[9px] text-[var(--cinza-600)] font-medium w-8 text-center">
                {Math.round(state.zoom * 100)}%
              </span>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-6 w-6">
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <div className="w-px h-4 bg-[var(--cinza-200)]" />
              <Button variant="ghost" size="icon" onClick={handleResetView} className="h-6 w-6">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div
              className={cn(
                'w-full h-full overflow-hidden flex items-center justify-center',
                state.isDragging ? 'cursor-grabbing' : 'cursor-grab'
              )}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {canvasContent(true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
