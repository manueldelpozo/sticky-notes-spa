import styles from './BoardPage.module.css'
import { useNotes } from '@/app'
import { NoteCard } from '@/entities/note'
import { useCreateNote } from '@/features/create-note'
import { TrashZone } from '@/shared/ui'

export function BoardPage() {
  const { notes, dispatch } = useNotes()
  const { handleBoardDoubleClick } = useCreateNote()

  return (
    <main
      className={styles.board}
      data-testid="board"
      onDoubleClick={handleBoardDoubleClick}
    >
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onBringToFront={() => dispatch({ type: 'BRING_TO_FRONT', id: note.id })}
          onTextChange={text => dispatch({ type: 'UPDATE_TEXT', id: note.id, text })}
          onColorChange={color => dispatch({ type: 'SET_COLOR', id: note.id, color })}
        />
      ))}
      <TrashZone />
    </main>
  )
}
