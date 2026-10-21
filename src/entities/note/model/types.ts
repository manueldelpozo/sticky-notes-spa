import type { TNoteColor } from '../constants'

export interface IPosition {
  x: number
  y: number
}

export interface ISize {
  width: number
  height: number
}

export type { TNoteColor }

export interface INote {
  readonly id: string
  readonly position: IPosition
  readonly size: ISize
  readonly text: string
  readonly color: TNoteColor
  readonly zIndex: number
  readonly createdAt: number
}

export type TCreateNoteParams = Omit<INote, 'id' | 'createdAt' | 'zIndex'>
