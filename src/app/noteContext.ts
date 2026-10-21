import { createContext, useContext, type Dispatch } from 'react'
import type { INote, TNoteAction } from '@/entities/note'

export interface INoteContextValue {
  notes: readonly INote[]
  dispatch: Dispatch<TNoteAction>
}

export const NoteContext = createContext<INoteContextValue | undefined>(undefined)

export function useNotes(): INoteContextValue {
  const context = useContext(NoteContext)
  if (!context) {
    throw new Error('useNotes must be used within a NoteProvider')
  }
  return context
}
