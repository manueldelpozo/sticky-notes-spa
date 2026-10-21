import { createContext, useContext } from 'react'
import type { Note, NoteAction } from '@/entities/note'

export interface NoteContextValue {
  notes: readonly Note[]
  dispatch: React.Dispatch<NoteAction>
}

export const NoteContext = createContext<NoteContextValue | undefined>(undefined)

export function useNotes(): NoteContextValue {
  const context = useContext(NoteContext)
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider')
  }
  return context
}
