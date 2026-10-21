import { useNotes } from '@/app'
import { NoteCard, type Note } from '@/entities/note'
import { useMoveNote } from '@/features/move-note'
import { useResizeNote } from '@/features/resize-note'

export interface BoardNoteCardProps {
  note: Note
  onDragMove?: (event: PointerEvent) => void
  onDragEnd?: (event: PointerEvent) => void
}

export function BoardNoteCard({
  note,
  onDragMove,
  onDragEnd,
}: BoardNoteCardProps) {
  const { dispatch } = useNotes()
  const { handleDragStart } = useMoveNote(note.id, {
    onDragMove: (_delta, event) => onDragMove?.(event),
    onDragEnd,
  })
  const { handleResizeStart } = useResizeNote(note.id)

  return (
    <NoteCard
      note={note}
      onDragStart={handleDragStart}
      onResizeStart={handleResizeStart}
      onBringToFront={() => dispatch({ type: 'BRING_TO_FRONT', id: note.id })}
      onTextChange={text => dispatch({ type: 'UPDATE_TEXT', id: note.id, text })}
      onColorChange={color => dispatch({ type: 'SET_COLOR', id: note.id, color })}
    />
  )
}
