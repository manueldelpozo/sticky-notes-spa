import { useNotes } from '@/app'
import { NoteCard, type Note } from '@/entities/note'
import { useMoveNote } from '@/features/move-note'
import { useResizeNote } from '@/features/resize-note'

interface BoardNoteCardProps {
  note: Note
}

export function BoardNoteCard({ note }: BoardNoteCardProps) {
  const { dispatch } = useNotes()
  const { handleDragStart } = useMoveNote(note.id)
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
