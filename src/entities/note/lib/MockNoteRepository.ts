import type { INote } from '../model/types'
import type { INoteRepository } from '../model/repository'

export const DEFAULT_MOCK_DELAY_MS = 300

/**
 * Simulates an asynchronous REST backend repository with configurable latency.
 * Demonstrates the Repository Pattern (Liskov Substitution & Open/Closed Principle).
 */
export class MockNoteRepository implements INoteRepository {
  private store: readonly INote[]
  private readonly delayMs: number

  constructor(initialNotes: readonly INote[] = [], delayMs = DEFAULT_MOCK_DELAY_MS) {
    this.store = [...initialNotes]
    this.delayMs = delayMs
  }

  async loadNotes(): Promise<readonly INote[]> {
    await delay(this.delayMs)
    return [...this.store]
  }

  async saveNotes(notes: readonly INote[]): Promise<void> {
    await delay(this.delayMs)
    this.store = [...notes]
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
