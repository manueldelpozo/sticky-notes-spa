import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type PropsWithChildren, type PointerEvent as ReactPointerEvent } from 'react'
import { NoteContext, type INoteContextValue } from '@/app'
import { useMoveNote } from './useMoveNote'
import type { INote } from '@/entities/note'

describe('useMoveNote', () => {
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

  const existingNote: INote = {
    id: 'note-1',
    position: { x: 50, y: 80 },
    size: { width: 200, height: 180 },
    text: 'Test note',
    color: 'yellow',
    zIndex: 1,
    createdAt: 1000,
  }

  it('dispatches BRING_TO_FRONT on drag start', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useMoveNote('note-1'), { wrapper })

    act(() => {
      result.current.handleDragStart(createMockPointerDown(100, 100))
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

  it('dispatches MOVE with accumulated position on drag move', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useMoveNote('note-1'), { wrapper })

    act(() => {
      result.current.handleDragStart(createMockPointerDown(100, 100))
    })

    // Exceed threshold (move from 100, 100 -> 105, 100) => dx = 5, dy = 0
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 105, clientY: 100, pointerId: 1 }),
      )
    })

    // Move again: from 105, 100 -> 125, 120 => dx = 20, dy = 20
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 125, clientY: 120, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'MOVE',
      id: 'note-1',
      position: { x: 75, y: 100 }, // initial 50+25, 80+20
    })
  })

  it('accumulates multiple consecutive drag moves correctly', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = {
      notes: [existingNote],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useMoveNote('note-1'), { wrapper })

    act(() => {
      result.current.handleDragStart(createMockPointerDown(100, 100))
    })

    // Step 1: exceed threshold (100 -> 110, dx = 10)
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 110, clientY: 100, pointerId: 1 }),
      )
    })

    // Step 2: move dx = -5, dy = 15
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 105, clientY: 115, pointerId: 1 }),
      )
    })

    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'MOVE',
      id: 'note-1',
      position: { x: 55, y: 95 }, // initial (50, 80) + delta (+5, +15)
    })
  })
})
