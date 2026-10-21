import React, { useReducer } from 'react'
import { noteReducer, type Note } from '@/entities/note'
import { NoteContext } from './noteContext'

interface NoteProviderProps {
  children: React.ReactNode
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
