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
      <header className={styles.shortcutHint} aria-label="Quick instructions">
        <span>✨ <strong>Double-click</strong> anywhere to create a note</span>
      </header>

      {notes.length === 0 && (
        <div className={styles.emptyState} data-testid="empty-board-hint">
          <div className={styles.emptyIcon} role="img" aria-hidden="true">📝</div>
          <div className={styles.emptyTitle}>Your board is empty</div>
          <div className={styles.emptySubtitle}>
            Double-click anywhere on the canvas to create your first sticky note
          </div>
        </div>
      )}

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
