import type { INote } from './types'

export interface INoteRepository {
  loadNotes(): Promise<readonly INote[]>
  saveNotes(notes: readonly INote[]): Promise<void>
}
