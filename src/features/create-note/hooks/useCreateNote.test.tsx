import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type PropsWithChildren, type MouseEvent as ReactMouseEvent } from 'react'
import { NoteContext, type NoteContextValue } from '@/app'
import { useCreateNote } from './useCreateNote'
import { DEFAULT_NOTE_SIZE } from '../constants/noteDefaults'

describe('useCreateNote', () => {
  const createMockDoubleClick = (
    clientX: number,
    clientY: number,
    target: HTMLElement,
    currentTarget: HTMLElement,
  ): ReactMouseEvent<HTMLElement> =>
    ({
      clientX,
      clientY,
      target,
      currentTarget,
    }) as unknown as ReactMouseEvent<HTMLElement>

  it('dispatches ADD with relative position on empty canvas double click', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useCreateNote(), { wrapper })

    const boardElement = document.createElement('main')
    boardElement.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 50,
      top: 100,
      width: 1000,
      height: 800,
    })

    act(() => {
      const event = createMockDoubleClick(250, 300, boardElement, boardElement)
      result.current.handleBoardDoubleClick(event)
    })

    expect(dispatch).toHaveBeenCalledTimes(1)
    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD',
      payload: {
        position: { x: 200, y: 200 },
        size: DEFAULT_NOTE_SIZE,
        text: '',
        color: 'yellow',
      },
    })
  })

  it('does NOT dispatch ADD when double-clicking on a note', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useCreateNote(), { wrapper })

    const boardElement = document.createElement('main')
    const noteCard = document.createElement('article')
    noteCard.setAttribute('data-note-id', 'note-123')
    const noteHeader = document.createElement('header')
    noteCard.appendChild(noteHeader)
    boardElement.appendChild(noteCard)

    act(() => {
      const event = createMockDoubleClick(200, 200, noteHeader, boardElement)
      result.current.handleBoardDoubleClick(event)
    })

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('does NOT dispatch ADD when double-clicking on the trash zone', () => {
    const dispatch = vi.fn()
    const contextValue: NoteContextValue = {
      notes: [],
      dispatch,
    }

    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useCreateNote(), { wrapper })

    const boardElement = document.createElement('main')
    const trashZone = document.createElement('div')
    trashZone.setAttribute('data-testid', 'trash-zone')
    boardElement.appendChild(trashZone)

    act(() => {
      const event = createMockDoubleClick(900, 700, trashZone, boardElement)
      result.current.handleBoardDoubleClick(event)
    })

    expect(dispatch).not.toHaveBeenCalled()
  })
})
