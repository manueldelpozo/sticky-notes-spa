import { useState, useRef, useCallback } from 'react'
import { useNotes } from '@/app'

export interface UseTrashZoneReturn {
  trashRef: React.RefObject<HTMLDivElement>
  isOver: boolean
  checkOverlap: (clientX: number, clientY: number) => boolean
  handleDrop: (noteId: string, clientX: number, clientY: number) => boolean
  resetTrash: () => void
}

/**
 * Hook to manage trash zone bounding box detection, hover state, and drop-to-delete.
 * Uses a ref-based approach for bounding client rect intersection to avoid external drag context overhead.
 */
export function useTrashZone(): UseTrashZoneReturn {
  const { dispatch } = useNotes()
  const [isOver, setIsOver] = useState(false)
  const trashRef = useRef<HTMLDivElement>(null)

  const checkOverlap = useCallback((clientX: number, clientY: number): boolean => {
    const element = trashRef.current
    if (!element) return false

    const rect = element.getBoundingClientRect()
    const isInside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom

    setIsOver(isInside)
    return isInside
  }, [])

  const handleDrop = useCallback(
    (noteId: string, clientX: number, clientY: number): boolean => {
      const isInside = checkOverlap(clientX, clientY)
      setIsOver(false)

      if (isInside) {
        dispatch({ type: 'REMOVE', id: noteId })
        return true
      }
      return false
    },
    [checkOverlap, dispatch],
  )

  const resetTrash = useCallback(() => {
    setIsOver(false)
  }, [])

  return {
    trashRef,
    isOver,
    checkOverlap,
    handleDrop,
    resetTrash,
  }
}
