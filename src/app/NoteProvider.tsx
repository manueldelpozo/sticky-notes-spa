import { useReducer, useEffect, useRef, type PropsWithChildren } from 'react'
import { noteReducer, type INote, type INoteRepository } from '@/entities/note'
import { NoteContext } from './noteContext'

export type TNoteProviderProps = PropsWithChildren<{
  initialNotes?: readonly INote[]
  repository?: INoteRepository
}>

export function NoteProvider({
  children,
  initialNotes = [],
  repository,
}: TNoteProviderProps) {
  const [notes, dispatch] = useReducer(noteReducer, initialNotes)
  const isHydratedRef = useRef(false)
  const isHydratingActionRef = useRef(false)

  // 1. Hydrate notes from repository on mount
  useEffect(() => {
    let cancelled = false

    if (repository) {
      repository
        .loadNotes()
        .then(loadedNotes => {
          if (!cancelled) {
            if (loadedNotes.length > 0) {
              isHydratingActionRef.current = true
              dispatch({ type: 'SET_ALL', notes: loadedNotes })
            }
            isHydratedRef.current = true
          }
        })
        .catch(() => {
          if (!cancelled) isHydratedRef.current = true
        })
    } else {
      isHydratedRef.current = true
    }

    return () => {
      cancelled = true
    }
  }, [repository])

  // 2. Debounced auto-save (300ms) after hydration
  useEffect(() => {
    if (!repository || !isHydratedRef.current) return

    if (isHydratingActionRef.current) {
      isHydratingActionRef.current = false
      return
    }

    const timer = setTimeout(() => {
      repository.saveNotes(notes).catch(() => {})
    }, 300)

    return () => clearTimeout(timer)
  }, [notes, repository])

  return (
    <NoteContext.Provider value={{ notes, dispatch }}>
      {children}
    </NoteContext.Provider>
  )
}
