import { useMemo } from 'react'
import { NoteProvider } from './NoteProvider'
import { LocalStorageNoteRepository } from '@/entities/note'
import { BoardPage } from '@/pages'

export function App() {
  const repository = useMemo(() => new LocalStorageNoteRepository(), [])

  return (
    <NoteProvider repository={repository}>
      <BoardPage />
    </NoteProvider>
  )
}

export default App
