import { type PropsWithChildren } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { NoteProvider } from './NoteProvider'
import { useNotes } from './noteContext'
import type { INote } from '@/entities/note'

describe('NoteContext', () => {
  it('throws an error if useNotes is used outside of NoteProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useNotes())
    }).toThrow('useNotes must be used within a NoteProvider')

    consoleErrorSpy.mockRestore()
  })

  it('provides empty notes array as default initial state', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteProvider>{children}</NoteProvider>
    )

    const { result } = renderHook(() => useNotes(), { wrapper })

    expect(result.current.notes).toEqual([])
    expect(typeof result.current.dispatch).toBe('function')
  })

  it('accepts initialNotes for pre-hydration', () => {
    const initialNotes: readonly INote[] = [
      {
        id: 'test-1',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 180 },
        text: 'Initial text',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
      },
    ]

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteProvider initialNotes={initialNotes}>{children}</NoteProvider>
    )

    const { result } = renderHook(() => useNotes(), { wrapper })

    expect(result.current.notes).toEqual(initialNotes)
  })

  it('updates state when dispatching an ADD action', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteProvider>{children}</NoteProvider>
    )

    const { result } = renderHook(() => useNotes(), { wrapper })

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: {
          position: { x: 100, y: 150 },
          size: { width: 200, height: 180 },
          text: 'Hello world',
          color: 'green',
        },
      })
    })

    expect(result.current.notes).toHaveLength(1)
    expect(result.current.notes[0]?.position).toEqual({ x: 100, y: 150 })
    expect(result.current.notes[0]?.text).toBe('Hello world')
    expect(result.current.notes[0]?.color).toBe('green')
  })

  it('hydrates notes from repository on mount', async () => {
    const savedNotes: readonly INote[] = [
      {
        id: 'saved-1',
        position: { x: 30, y: 40 },
        size: { width: 150, height: 120 },
        text: 'From storage',
        color: 'pink',
        zIndex: 1,
        createdAt: 500,
      },
    ]

    const mockRepo = {
      loadNotes: vi.fn().mockResolvedValue(savedNotes),
      saveNotes: vi.fn().mockResolvedValue(undefined),
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteProvider repository={mockRepo}>{children}</NoteProvider>
    )

    const { result } = renderHook(() => useNotes(), { wrapper })

    await waitFor(() => {
      expect(result.current.notes).toEqual(savedNotes)
    })
    expect(mockRepo.loadNotes).toHaveBeenCalledTimes(1)
  })

  it('auto-saves notes to repository with debounce after dispatching an action', async () => {
    const mockRepo = {
      loadNotes: vi.fn().mockResolvedValue([]),
      saveNotes: vi.fn().mockResolvedValue(undefined),
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteProvider repository={mockRepo}>{children}</NoteProvider>
    )

    const { result } = renderHook(() => useNotes(), { wrapper })

    await waitFor(() => {
      expect(mockRepo.loadNotes).toHaveBeenCalledTimes(1)
    })

    vi.useFakeTimers()

    act(() => {
      result.current.dispatch({
        type: 'ADD',
        payload: {
          position: { x: 10, y: 10 },
          size: { width: 120, height: 100 },
          text: 'Auto-saved note',
          color: 'blue',
        },
      })
    })

    expect(mockRepo.saveNotes).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockRepo.saveNotes).toHaveBeenCalledTimes(1)
    expect(mockRepo.saveNotes).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ text: 'Auto-saved note', color: 'blue' }),
      ]),
    )

    vi.useRealTimers()
  })
})

