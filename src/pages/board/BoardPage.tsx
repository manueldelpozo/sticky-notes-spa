import styles from './BoardPage.module.css'
import { useNotes } from '@/app'
import { useCreateNote } from '@/features/create-note'
import { TrashZone } from '@/shared/ui'
import { BoardNoteCard } from './components/BoardNoteCard'

export function BoardPage() {
  const { notes } = useNotes()
  const { handleBoardDoubleClick } = useCreateNote()

  return (
    <main
      className={styles.board}
      data-testid="board"
      onDoubleClick={handleBoardDoubleClick}
    >
      {notes.map(note => (
        <BoardNoteCard key={note.id} note={note} />
      ))}
      <TrashZone />
    </main>
  )
}
