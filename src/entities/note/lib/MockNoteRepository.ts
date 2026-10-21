import type { Note } from '../model/types'
import type { NoteRepository } from '../model/repository'

export const DEFAULT_MOCK_DELAY_MS = 300

/**
 * Simulates an asynchronous REST backend repository with configurable latency.
 * Demonstrates the Repository Pattern (Liskov Substitution & Open/Closed Principle).
 */
export class MockNoteRepository implements NoteRepository {
  private store: readonly Note[]
  private readonly delayMs: number

  constructor(initialNotes: readonly Note[] = [], delayMs = DEFAULT_MOCK_DELAY_MS) {
    this.store = [...initialNotes]
    this.delayMs = delayMs
  }

  async loadNotes(): Promise<readonly Note[]> {
    await delay(this.delayMs)
    return [...this.store]
  }

  async saveNotes(notes: readonly Note[]): Promise<void> {
    await delay(this.delayMs)
    this.store = [...notes]
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
