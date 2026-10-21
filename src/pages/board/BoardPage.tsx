import styles from './BoardPage.module.css'
import { useNotes } from '@/app'
import { useCreateNote } from '@/features/create-note'
import { useTrashZone } from '@/features/trash-note'
import { TrashZone } from '@/shared/ui'
import { BoardNoteCard } from './components/BoardNoteCard'

export function BoardPage() {
  const { notes } = useNotes()
  const { handleBoardDoubleClick } = useCreateNote()
  const { trashRef, isOver, checkOverlap, handleDrop } = useTrashZone()

  return (
    <main
      className={styles.board}
      data-testid="board"
      onDoubleClick={handleBoardDoubleClick}
    >
      {notes.map(note => (
        <BoardNoteCard
          key={note.id}
          note={note}
          onDragMove={event => checkOverlap(event.clientX, event.clientY)}
          onDragEnd={event => handleDrop(note.id, event.clientX, event.clientY)}
        />
      ))}
      <TrashZone ref={trashRef} isOver={isOver} />
    </main>
  )
}
