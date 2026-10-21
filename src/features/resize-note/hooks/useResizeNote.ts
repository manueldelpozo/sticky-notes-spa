import { useRef, useEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { useNotes } from '@/app'
import { useDrag, type DragDelta } from '@/shared/lib'
import type { Size } from '@/entities/note'
import { MIN_NOTE_SIZE } from '../constants/resizeLimits'

export interface UseResizeNoteReturn {
  handleResizeStart: (event: ReactPointerEvent<HTMLElement>) => void
  isResizing: boolean
}

export function useResizeNote(noteId: string): UseResizeNoteReturn {
  const { notes, dispatch } = useNotes()

  const note = notes.find(targetNote => targetNote.id === noteId)
  const currentSizeRef = useRef<Size>(note?.size ?? MIN_NOTE_SIZE)

  useEffect(() => {
    if (note) {
      currentSizeRef.current = note.size
    }
  }, [note])

  const { isDragging: isResizing, handlePointerDown: handleResizeStart } = useDrag({
    onDragStart: () => {
      dispatch({ type: 'BRING_TO_FRONT', id: noteId })
    },
    onDragMove: (delta: DragDelta) => {
      const nextSize: Size = {
        width: Math.max(MIN_NOTE_SIZE.width, currentSizeRef.current.width + delta.dx),
        height: Math.max(MIN_NOTE_SIZE.height, currentSizeRef.current.height + delta.dy),
      }
      currentSizeRef.current = nextSize

      dispatch({
        type: 'RESIZE',
        id: noteId,
        size: nextSize,
      })
    },
  })

  return {
    handleResizeStart,
    isResizing,
  }
}
