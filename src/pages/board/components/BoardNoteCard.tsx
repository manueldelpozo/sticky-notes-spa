import { useNotes } from '@/app'
import { NoteCard, type Note } from '@/entities/note'
import { useMoveNote } from '@/features/move-note'

interface BoardNoteCardProps {
  note: Note
}

export function BoardNoteCard({ note }: BoardNoteCardProps) {
  const { dispatch } = useNotes()
  const { handleDragStart } = useMoveNote(note.id)

  return (
    <NoteCard
      note={note}
      onDragStart={handleDragStart}
      onBringToFront={() => dispatch({ type: 'BRING_TO_FRONT', id: note.id })}
      onTextChange={text => dispatch({ type: 'UPDATE_TEXT', id: note.id, text })}
      onColorChange={color => dispatch({ type: 'SET_COLOR', id: note.id, color })}
    />
  )
}
