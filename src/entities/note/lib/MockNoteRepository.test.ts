import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MockNoteRepository } from './MockNoteRepository'
import type { Note } from '../model/types'

describe('MockNoteRepository', () => {
  const sampleNote: Note = {
    id: 'mock-1',
    position: { x: 100, y: 120 },
    size: { width: 200, height: 180 },
    text: 'Mock note',
    color: 'yellow',
    zIndex: 1,
    createdAt: 1000,
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('loadNotes resolves after simulated latency with initial notes', async () => {
    const repository = new MockNoteRepository([sampleNote], 300)

    let resolved = false
    const loadPromise = repository.loadNotes().then(notes => {
      resolved = true
      return notes
    })

    // Advance before delay: should not be resolved yet
    vi.advanceTimersByTime(200)
    expect(resolved).toBe(false)

    // Advance remaining delay
    vi.advanceTimersByTime(100)
    const notes = await loadPromise
    expect(resolved).toBe(true)
    expect(notes).toEqual([sampleNote])
  })

  it('saveNotes updates the store and subsequent loadNotes returns updated notes', async () => {
    const repository = new MockNoteRepository([], 150)

    const updatedNotes: readonly Note[] = [
      sampleNote,
      {
        ...sampleNote,
        id: 'mock-2',
        text: 'Second mock note',
        color: 'pink',
      },
    ]

    const savePromise = repository.saveNotes(updatedNotes)
    vi.advanceTimersByTime(150)
    await savePromise

    const loadPromise = repository.loadNotes()
    vi.advanceTimersByTime(150)
    const loaded = await loadPromise

    expect(loaded).toEqual(updatedNotes)
  })

  it('defaults to empty notes and 300ms delay', async () => {
    const repository = new MockNoteRepository()

    const loadPromise = repository.loadNotes()
    vi.advanceTimersByTime(300)
    const notes = await loadPromise

    expect(notes).toEqual([])
  })
})
