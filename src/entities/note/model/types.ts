import type { NoteColor } from '../constants'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type { NoteColor }

export interface Note {
  readonly id: string
  readonly position: Position
  readonly size: Size
  readonly text: string
  readonly color: NoteColor
  readonly zIndex: number
  readonly createdAt: number
}

export type CreateNoteParams = Omit<Note, 'id' | 'createdAt' | 'zIndex'>
