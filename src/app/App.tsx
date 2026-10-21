import { NoteProvider } from './NoteProvider'
import { BoardPage } from '@/pages'

export function App() {
  return (
    <NoteProvider>
      <BoardPage />
    </NoteProvider>
  )
}

export default App
