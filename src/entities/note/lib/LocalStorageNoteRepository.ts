import type { Note } from '../model/types'
import type { NoteRepository } from '../model/repository'

export const STORAGE_KEY = 'sticky-notes'

export class LocalStorageNoteRepository implements NoteRepository {
  private readonly storageKey: string

  constructor(storageKey = STORAGE_KEY) {
    this.storageKey = storageKey
  }

  private getStorage(): Storage | undefined {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage
    }
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      return globalThis.localStorage
    }
    return undefined
  }

  async loadNotes(): Promise<readonly Note[]> {
    try {
      const storage = this.getStorage()
      if (!storage) return []

      const raw = storage.getItem(this.storageKey)
      if (!raw) return []

      const parsed: unknown = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []

      return parsed.filter(isValidNote)
    } catch {
      return []
    }
  }

  async saveNotes(notes: readonly Note[]): Promise<void> {
    try {
      const storage = this.getStorage()
      if (!storage) return

      storage.setItem(this.storageKey, JSON.stringify(notes))
    } catch {
      // Gracefully handle storage quota or access restriction errors
    }
  }
}

function isValidNote(item: unknown): item is Note {
  if (!item || typeof item !== 'object') return false
  const candidate = item as Record<string, unknown>
  const position = candidate.position as Record<string, unknown> | undefined
  const size = candidate.size as Record<string, unknown> | undefined

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.text === 'string' &&
    typeof candidate.zIndex === 'number' &&
    typeof candidate.createdAt === 'number' &&
    typeof candidate.color === 'string' &&
    typeof position === 'object' &&
    position !== null &&
    typeof position.x === 'number' &&
    typeof position.y === 'number' &&
    typeof size === 'object' &&
    size !== null &&
    typeof size.width === 'number' &&
    typeof size.height === 'number'
  )
}
