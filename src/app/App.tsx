import { useMemo } from 'react'
import { NoteProvider } from './NoteProvider'
import { LocalStorageNoteRepository } from '@/entities/note'
import { BoardPage } from '@/pages'

export function App() {
  // To demonstrate the Open/Closed Principle and Repository Pattern:
  // Swap with `new MockNoteRepository()` to simulate an asynchronous REST API backend.
  const repository = useMemo(() => new LocalStorageNoteRepository(), [])

  return (
    <NoteProvider repository={repository}>
      <BoardPage />
    </NoteProvider>
  )
}

export default App
