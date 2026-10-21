import { useState, useRef, useEffect, useCallback } from 'react'
import type React from 'react'

export interface DragDelta {
  dx: number
  dy: number
}

export interface UseDragOptions {
  onDragStart?: (e: PointerEvent) => void
  onDragMove?: (delta: DragDelta, e: PointerEvent) => void
  onDragEnd?: (e: PointerEvent) => void
  /** Minimum pixel movement before drag is recognized (default: 3) */
  threshold?: number
}

export interface UseDragReturn {
  isDragging: boolean
  handlePointerDown: (e: React.PointerEvent<HTMLElement>) => void
}

export function useDrag(options: UseDragOptions = {}): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false)

  // Keep latest callbacks in ref to avoid reattaching listeners on every render
  const optionsRef = useRef<UseDragOptions>(options)
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const threshold = options.threshold ?? 3

  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const prevPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const hasStartedRef = useRef(false)
  const activePointerIdRef = useRef<number | null>(null)
  const targetElementRef = useRef<HTMLElement | null>(null)

  const cleanupListenersRef = useRef<(() => void) | null>(null)

  const removeListeners = useCallback(() => {
    if (cleanupListenersRef.current) {
      cleanupListenersRef.current()
      cleanupListenersRef.current = null
    }
  }, [])

  // Clean up listeners on unmount
  useEffect(() => {
    return () => {
      removeListeners()
    }
  }, [removeListeners])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      // Only respond to primary button (left click / single touch)
      if (e.button !== 0) return

      e.preventDefault()

      const pointerId = e.pointerId
      const target = e.currentTarget

      activePointerIdRef.current = pointerId
      targetElementRef.current = target
      startPosRef.current = { x: e.clientX, y: e.clientY }
      prevPosRef.current = { x: e.clientX, y: e.clientY }
      hasStartedRef.current = false

      if (typeof target.setPointerCapture === 'function') {
        try {
          target.setPointerCapture(pointerId)
        } catch {
          // Fallback if pointer capture is not supported or already released
        }
      }

      const onPointerMove = (moveEvent: PointerEvent) => {
        if (moveEvent.pointerId !== activePointerIdRef.current) return

        if (!hasStartedRef.current) {
          const distance = Math.hypot(
            moveEvent.clientX - startPosRef.current.x,
            moveEvent.clientY - startPosRef.current.y,
          )

          if (distance >= threshold) {
            hasStartedRef.current = true
            setIsDragging(true)
            optionsRef.current.onDragStart?.(moveEvent)
            prevPosRef.current = { x: moveEvent.clientX, y: moveEvent.clientY }
          }
        }

        if (hasStartedRef.current) {
          const dx = moveEvent.clientX - prevPosRef.current.x
          const dy = moveEvent.clientY - prevPosRef.current.y
          prevPosRef.current = { x: moveEvent.clientX, y: moveEvent.clientY }

          optionsRef.current.onDragMove?.({ dx, dy }, moveEvent)
        }
      }

      const onPointerUp = (upEvent: PointerEvent) => {
        if (upEvent.pointerId !== activePointerIdRef.current) return

        removeListeners()

        if (targetElementRef.current && typeof targetElementRef.current.releasePointerCapture === 'function') {
          try {
            if (targetElementRef.current.hasPointerCapture(pointerId)) {
              targetElementRef.current.releasePointerCapture(pointerId)
            }
          } catch {
            // Ignore if pointer capture was already lost
          }
        }

        if (hasStartedRef.current) {
          hasStartedRef.current = false
          setIsDragging(false)
          optionsRef.current.onDragEnd?.(upEvent)
        }

        activePointerIdRef.current = null
        targetElementRef.current = null
      }

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)

      cleanupListenersRef.current = () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerUp)
      }
    },
    [threshold, removeListeners],
  )

  return {
    isDragging,
    handlePointerDown,
  }
}
