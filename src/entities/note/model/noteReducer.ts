import type { INote, TNoteColor, TCreateNoteParams, IPosition, ISize } from './types'

export type TNoteAction =
  | { type: 'ADD'; payload: TCreateNoteParams }
  | { type: 'MOVE'; id: string; position: IPosition }
  | { type: 'RESIZE'; id: string; size: ISize }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_TEXT'; id: string; text: string }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SET_COLOR'; id: string; color: TNoteColor }
  | { type: 'SET_ALL'; notes: readonly INote[] }

function maxZIndex(notes: readonly INote[]): number {
  return notes.reduce((max, n) => Math.max(max, n.zIndex), 0)
}

export function noteReducer(
  state: readonly INote[],
  action: TNoteAction,
): readonly INote[] {
  switch (action.type) {
    case 'ADD': {
      const note: INote = {
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
