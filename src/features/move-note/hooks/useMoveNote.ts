import { useRef, useEffect, type PointerEvent as ReactPointerEvent } from 'react'
import { useNotes } from '@/app'
import { useDrag, type IDragDelta } from '@/shared/lib'
import type { IPosition } from '@/entities/note'

export interface IUseMoveNoteOptions {
  onDragMove?: ((delta: IDragDelta, event: PointerEvent) => void) | undefined
  onDragEnd?: ((event: PointerEvent) => void) | undefined
}

export interface IUseMoveNoteReturn {
  handleDragStart: (event: ReactPointerEvent<HTMLElement>) => void
  isDragging: boolean
}

export function useMoveNote(
  noteId: string,
  options?: IUseMoveNoteOptions,
): IUseMoveNoteReturn {
  const { notes, dispatch } = useNotes()
  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  }, [options])

  const note = notes.find(targetNote => targetNote.id === noteId)
  const currentPosRef = useRef<IPosition>(note?.position ?? { x: 0, y: 0 })

  useEffect(() => {
    if (note) {
      currentPosRef.current = note.position
    }
  }, [note])

  const { isDragging, handlePointerDown: handleDragStart } = useDrag({
    onDragStart: () => {
      dispatch({ type: 'BRING_TO_FRONT', id: noteId })
    },
    onDragMove: (delta: IDragDelta, event: PointerEvent) => {
      const nextPosition: IPosition = {
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
