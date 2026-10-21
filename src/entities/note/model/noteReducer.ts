import type { Note, NoteColor, CreateNoteParams, Position, Size } from './types'

export type NoteAction =
  | { type: 'ADD'; payload: CreateNoteParams }
  | { type: 'MOVE'; id: string; position: Position }
  | { type: 'RESIZE'; id: string; size: Size }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_TEXT'; id: string; text: string }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SET_COLOR'; id: string; color: NoteColor }
  | { type: 'SET_ALL'; notes: readonly Note[] }

function maxZIndex(notes: readonly Note[]): number {
  return notes.reduce((max, n) => Math.max(max, n.zIndex), 0)
}

export function noteReducer(
  state: readonly Note[],
  action: NoteAction,
): readonly Note[] {
  switch (action.type) {
    case 'ADD': {
      const note: Note = {
        ...action.payload,
        id: crypto.randomUUID(),
        zIndex: maxZIndex(state) + 1,
        createdAt: Date.now(),
      }
      return [...state, note]
    }

    case 'MOVE':
      return state.map(n =>
        n.id === action.id ? { ...n, position: action.position } : n,
      )

    case 'RESIZE':
      return state.map(n =>
        n.id === action.id ? { ...n, size: action.size } : n,
      )

    case 'REMOVE':
      return state.filter(n => n.id !== action.id)

    case 'UPDATE_TEXT':
      return state.map(n =>
        n.id === action.id ? { ...n, text: action.text } : n,
      )

    case 'BRING_TO_FRONT':
      return state.map(n =>
        n.id === action.id ? { ...n, zIndex: maxZIndex(state) + 1 } : n,
      )

    case 'SET_COLOR':
      return state.map(n =>
        n.id === action.id ? { ...n, color: action.color } : n,
      )

    case 'SET_ALL':
      return action.notes
  }
}
