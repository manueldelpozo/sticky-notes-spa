import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type PropsWithChildren, type PointerEvent as ReactPointerEvent } from 'react'
import { NoteContext, type NoteContextValue } from '@/app'
import { useResizeNote } from './useResizeNote'
import { MIN_NOTE_SIZE } from '../constants/resizeLimits'
import type { Note } from '@/entities/note'

describe('useResizeNote', () => {
  let mockElement: HTMLElement

  beforeEach(() => {
    mockElement = document.createElement('div')
    mockElement.setPointerCapture = vi.fn()
    mockElement.releasePointerCapture = vi.fn()
    mockElement.hasPointerCapture = vi.fn().mockReturnValue(true)
  })

  const createMockPointerDown = (
    clientX = 100,
    clientY = 100,
    pointerId = 1,
    button = 0,
  ): ReactPointerEvent<HTMLElement> =>
    ({
      button,
      pointerId,
      clientX,
      clientY,
      currentTarget: mockElement,
      preventDefault: vi.fn(),
    }) as unknown as ReactPointerEvent<HTMLElement>

  const existingNote: Note = {
    id: 'note-1',
    position: { x: 50, y: 80 },
    size: { width: 200, height: 180 },
    text: 'Test note',
    color: 'yellow',
    zIndex: 1,
    createdAt: 1000,
  }

  it('dispatches BRING_TO_FRONT on resize start', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useResizeNote('note-1'), { wrapper })

    act(() => {
      result.current.handleResizeStart(createMockPointerDown(100, 100))
    })

    // Move past default threshold (3px)
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 105, clientY: 100, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'BRING_TO_FRONT',
      id: 'note-1',
    })
  })

  it('dispatches RESIZE with correct accumulated size on drag move', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useResizeNote('note-1'), { wrapper })

    act(() => {
      result.current.handleResizeStart(createMockPointerDown(100, 100))
    })

    // Exceed threshold (move from 100, 100 -> 110, 120) => dx = 10, dy = 20
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 110, clientY: 120, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESIZE',
      id: 'note-1',
      size: { width: 210, height: 200 }, // 200+10, 180+20
    })
  })

  it('enforces minimum width (120px) and minimum height (100px) when resized smaller', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useResizeNote('note-1'), { wrapper })

    act(() => {
      result.current.handleResizeStart(createMockPointerDown(100, 100))
    })

    // Large negative movement: dx = -150, dy = -150
    // Attempted size: width = 200 - 150 = 50 (< 120), height = 180 - 150 = 30 (< 100)
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: -50, clientY: -50, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'RESIZE',
      id: 'note-1',
      size: MIN_NOTE_SIZE, // { width: 120, height: 100 }
    })
  })

  it('accumulates multiple consecutive drag moves correctly with size clamping', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useResizeNote('note-1'), { wrapper })

    act(() => {
      result.current.handleResizeStart(createMockPointerDown(100, 100))
    })

    // First move: dx = 30, dy = 10 => width = 230, height = 190
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 130, clientY: 110, pointerId: 1 }),
      )
    })

    // Second move: dx = -10, dy = 15 => width = 220, height = 205
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 120, clientY: 125, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'RESIZE',
      id: 'note-1',
      size: { width: 220, height: 205 },
    })
  })
})
