import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageNoteRepository, STORAGE_KEY } from './LocalStorageNoteRepository'
import type { Note } from '../model/types'

describe('LocalStorageNoteRepository', () => {
  let repository: LocalStorageNoteRepository

  const sampleNote: Note = {
    id: 'note-1',
    position: { x: 50, y: 100 },
    size: { width: 200, height: 180 },
    text: 'Persistent note',
    color: 'yellow',
    zIndex: 1,
    createdAt: 123456789,
  }

  beforeEach(() => {
    window.localStorage.clear()
    repository = new LocalStorageNoteRepository()
  })

  it('loadNotes returns an empty array when storage is empty', async () => {
    const notes = await repository.loadNotes()
    expect(notes).toEqual([])
  })

  it('saveNotes saves notes to localStorage under the given key', async () => {
    await repository.saveNotes([sampleNote])

    const storedRaw = window.localStorage.getItem(STORAGE_KEY)
    expect(storedRaw).not.toBeNull()
    expect(JSON.parse(storedRaw!)).toEqual([sampleNote])
  })

  it('loadNotes loads and parses saved notes correctly', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([sampleNote]))

    const loaded = await repository.loadNotes()
    expect(loaded).toEqual([sampleNote])
  })

  it('loadNotes returns empty array when storage contains corrupted JSON', async () => {
    window.localStorage.setItem(STORAGE_KEY, '{ invalid json')

    const loaded = await repository.loadNotes()
    expect(loaded).toEqual([])
  })

  it('loadNotes filters out invalid note shapes', async () => {
    const invalidItems = [
      sampleNote,
      { id: 'bad-1', text: 123 }, // wrong types
      null,
      'just a string',
      { id: 'bad-2', text: 'incomplete', position: { x: 10 } }, // missing size, y, etc.
    ]
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invalidItems))

    const loaded = await repository.loadNotes()
    expect(loaded).toHaveLength(1)
    expect(loaded[0]).toEqual(sampleNote)
  })

  it('saveNotes handles storage exceptions gracefully without crashing', async () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError')
    })

    await expect(repository.saveNotes([sampleNote])).resolves.toBeUndefined()
  })

  it('supports custom storage keys', async () => {
    const customRepo = new LocalStorageNoteRepository('custom-sticky-notes')
    await customRepo.saveNotes([sampleNote])

    expect(window.localStorage.getItem('custom-sticky-notes')).not.toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
