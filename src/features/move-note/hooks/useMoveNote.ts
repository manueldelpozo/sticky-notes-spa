import { useRef, useEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { useNotes } from '@/app'
import { useDrag, type DragDelta } from '@/shared/lib'
import type { Position } from '@/entities/note'

export interface UseMoveNoteOptions {
  onDragMove?: ((delta: DragDelta, event: PointerEvent) => void) | undefined
  onDragEnd?: ((event: PointerEvent) => void) | undefined
}

export interface UseMoveNoteReturn {
  handleDragStart: (event: ReactPointerEvent<HTMLElement>) => void
  isDragging: boolean
}

export function useMoveNote(
  noteId: string,
  options?: UseMoveNoteOptions,
): UseMoveNoteReturn {
  const { notes, dispatch } = useNotes()
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const note = notes.find(targetNote => targetNote.id === noteId)
  const currentPosRef = useRef<Position>(note?.position ?? { x: 0, y: 0 })

  useEffect(() => {
    if (note) {
      currentPosRef.current = note.position
    }
  }, [note])

  const { isDragging, handlePointerDown: handleDragStart } = useDrag({
    onDragStart: () => {
      dispatch({ type: 'BRING_TO_FRONT', id: noteId })
    },
    onDragMove: (delta: DragDelta, event: PointerEvent) => {
      const nextPosition: Position = {
        x: currentPosRef.current.x + delta.dx,
        y: currentPosRef.current.y + delta.dy,
      }
      currentPosRef.current = nextPosition

      dispatch({
        type: 'MOVE',
        id: noteId,
        position: nextPosition,
      })

      optionsRef.current?.onDragMove?.(delta, event)
    },
    onDragEnd: (event: PointerEvent) => {
      optionsRef.current?.onDragEnd?.(event)
    },
  })

  return {
    handleDragStart,
    isDragging,
  }
}
