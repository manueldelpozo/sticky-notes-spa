import type { Note } from './types'

export interface NoteRepository {
  loadNotes(): Promise<readonly Note[]>
  saveNotes(notes: readonly Note[]): Promise<void>
}
