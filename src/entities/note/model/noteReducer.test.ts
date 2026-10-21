import { describe, it, expect, vi, beforeEach } from 'vitest'
import { noteReducer } from './noteReducer'
import type { Note, CreateNoteParams } from './types'

// Stable UUID for deterministic tests
const MOCK_UUID = 'test-uuid-1234'

beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: vi.fn(() => MOCK_UUID) })
})

const baseParams: CreateNoteParams = {
  position: { x: 100, y: 200 },
  size: { width: 200, height: 180 },
  text: '',
  color: 'yellow',
}

const existingNote: Note = {
  id: 'note-1',
  position: { x: 50, y: 60 },
  size: { width: 150, height: 120 },
  text: 'Hello',
  color: 'pink',
  zIndex: 1,
  createdAt: 1000,
}

describe('noteReducer', () => {
  describe('ADD action', () => {
    it('adds a note with the given position and size', () => {
      const state = noteReducer([], { type: 'ADD', payload: baseParams })
      expect(state).toHaveLength(1)
      expect(state[0]?.position).toEqual({ x: 100, y: 200 })
      expect(state[0]?.size).toEqual({ width: 200, height: 180 })
      expect(state[0]?.color).toBe('yellow')
      expect(state[0]?.text).toBe('')
    })

    it('assigns id from crypto.randomUUID()', () => {
      const state = noteReducer([], { type: 'ADD', payload: baseParams })
      expect(state[0]?.id).toBe(MOCK_UUID)
    })

    it('sets zIndex to max + 1 when notes already exist', () => {
      const state = noteReducer([existingNote], { type: 'ADD', payload: baseParams })
      expect(state[1]?.zIndex).toBe(2)
    })

    it('sets zIndex to 1 for the first note', () => {
      const state = noteReducer([], { type: 'ADD', payload: baseParams })
      expect(state[0]?.zIndex).toBe(1)
    })

    it('does not mutate the original state array', () => {
      const original: readonly Note[] = []
      noteReducer(original, { type: 'ADD', payload: baseParams })
      expect(original).toHaveLength(0)
    })
  })

  describe('MOVE action', () => {
    it('updates position of the target note', () => {
      const state = noteReducer([existingNote], {
        type: 'MOVE',
        id: 'note-1',
        position: { x: 300, y: 400 },
      })
      expect(state[0]?.position).toEqual({ x: 300, y: 400 })
    })

    it('leaves all other fields unchanged', () => {
      const state = noteReducer([existingNote], {
        type: 'MOVE',
        id: 'note-1',
        position: { x: 300, y: 400 },
      })
      const { position: _, ...rest } = state[0]!
      const { position: __, ...original } = existingNote
      expect(rest).toEqual(original)
    })

    it('does not affect other notes', () => {
      const other: Note = { ...existingNote, id: 'note-2', zIndex: 2 }
      const state = noteReducer([existingNote, other], {
        type: 'MOVE',
        id: 'note-1',
        position: { x: 999, y: 999 },
      })
      expect(state[1]).toEqual(other)
    })
  })

  describe('RESIZE action', () => {
    it('updates size of the target note', () => {
      const state = noteReducer([existingNote], {
        type: 'RESIZE',
        id: 'note-1',
        size: { width: 300, height: 250 },
      })
      expect(state[0]?.size).toEqual({ width: 300, height: 250 })
    })

    it('leaves all other fields unchanged', () => {
      const state = noteReducer([existingNote], {
        type: 'RESIZE',
        id: 'note-1',
        size: { width: 300, height: 250 },
      })
      const { size: _, ...rest } = state[0]!
      const { size: __, ...original } = existingNote
      expect(rest).toEqual(original)
    })
  })

  describe('REMOVE action', () => {
    it('removes the note with the given id', () => {
      const state = noteReducer([existingNote], { type: 'REMOVE', id: 'note-1' })
      expect(state).toHaveLength(0)
    })

    it('leaves other notes untouched', () => {
      const other: Note = { ...existingNote, id: 'note-2' }
      const state = noteReducer([existingNote, other], {
        type: 'REMOVE',
        id: 'note-1',
      })
      expect(state).toHaveLength(1)
      expect(state[0]).toEqual(other)
    })

    it('returns same-length array when id does not exist', () => {
      const state = noteReducer([existingNote], {
        type: 'REMOVE',
        id: 'nonexistent',
      })
      expect(state).toHaveLength(1)
    })
  })

  describe('UPDATE_TEXT action', () => {
    it('updates only the text field', () => {
      const state = noteReducer([existingNote], {
        type: 'UPDATE_TEXT',
        id: 'note-1',
        text: 'New text',
      })
      expect(state[0]?.text).toBe('New text')
    })

    it('leaves other fields unchanged', () => {
      const state = noteReducer([existingNote], {
        type: 'UPDATE_TEXT',
        id: 'note-1',
        text: 'New text',
      })
      const { text: _, ...rest } = state[0]!
      const { text: __, ...original } = existingNote
      expect(rest).toEqual(original)
    })
  })

  describe('BRING_TO_FRONT action', () => {
    it('sets zIndex to max + 1', () => {
      const other: Note = { ...existingNote, id: 'note-2', zIndex: 5 }
      const state = noteReducer([existingNote, other], {
        type: 'BRING_TO_FRONT',
        id: 'note-1',
      })
      expect(state[0]?.zIndex).toBe(6)
    })

    it('leaves other notes zIndex unchanged', () => {
      const other: Note = { ...existingNote, id: 'note-2', zIndex: 5 }
      const state = noteReducer([existingNote, other], {
        type: 'BRING_TO_FRONT',
        id: 'note-1',
      })
      expect(state[1]?.zIndex).toBe(5)
    })
  })

  describe('SET_COLOR action', () => {
    it('updates the note color', () => {
      const state = noteReducer([existingNote], {
        type: 'SET_COLOR',
        id: 'note-1',
        color: 'blue',
      })
      expect(state[0]?.color).toBe('blue')
    })

    it('leaves other fields unchanged', () => {
      const state = noteReducer([existingNote], {
        type: 'SET_COLOR',
        id: 'note-1',
        color: 'blue',
      })
      const { color: _, ...rest } = state[0]!
      const { color: __, ...original } = existingNote
      expect(rest).toEqual(original)
    })
  })

  describe('SET_ALL action', () => {
    it('replaces entire state with provided notes', () => {
      const newNotes: readonly Note[] = [
        { ...existingNote, id: 'hydrated-1' },
        { ...existingNote, id: 'hydrated-2' },
      ]
      const state = noteReducer([existingNote], { type: 'SET_ALL', notes: newNotes })
      expect(state).toEqual(newNotes)
    })
  })
})
