import { useReducer, type ReactNode } from 'react'
import { noteReducer, type Note } from '@/entities/note'
import { NoteContext } from './noteContext'

interface NoteProviderProps {
  children: ReactNode
  initialNotes?: readonly Note[]
}

export function NoteProvider({ children, initialNotes = [] }: NoteProviderProps) {
  const [notes, dispatch] = useReducer(noteReducer, initialNotes)

  return (
    <NoteContext.Provider value={{ notes, dispatch }}>
      {children}
    </NoteContext.Provider>
  )
}
