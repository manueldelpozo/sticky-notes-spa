import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type PropsWithChildren } from 'react'
import { NoteContext, type INoteContextValue } from '@/app'
import { useTrashZone } from './useTrashZone'

describe('useTrashZone', () => {
  const setupMockTrashElement = (
    bounds = { left: 800, right: 900, top: 600, bottom: 700 },
  ): HTMLDivElement => {
    const element = document.createElement('div')
    element.getBoundingClientRect = vi.fn().mockReturnValue({
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      bottom: bounds.bottom,
      width: bounds.right - bounds.left,
      height: bounds.bottom - bounds.top,
      x: bounds.left,
      y: bounds.top,
      toJSON: () => {},
    })
    return element
  }

  it('initializes with isOver false', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    expect(result.current.isOver).toBe(false)
    expect(result.current.trashRef.current).toBeNull()
  })

  it('detects overlap when pointer is inside trash zone bounds', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    const mockElement = setupMockTrashElement()
    // Manually assign mock ref target
    ;(result.current.trashRef as { current: HTMLDivElement | null }).current = mockElement

    act(() => {
      const isOverlap = result.current.checkOverlap(850, 650)
      expect(isOverlap).toBe(true)
    })

    expect(result.current.isOver).toBe(true)
  })

  it('sets isOver false when pointer is outside trash zone bounds', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    const mockElement = setupMockTrashElement()
    ;(result.current.trashRef as { current: HTMLDivElement | null }).current = mockElement

    act(() => {
      const isOverlap = result.current.checkOverlap(100, 100)
      expect(isOverlap).toBe(false)
    })

    expect(result.current.isOver).toBe(false)
  })

  it('dispatches REMOVE action when note is dropped inside trash zone', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    const mockElement = setupMockTrashElement()
    ;(result.current.trashRef as { current: HTMLDivElement | null }).current = mockElement

    act(() => {
      const dropped = result.current.handleDrop('note-123', 850, 650)
      expect(dropped).toBe(true)
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'REMOVE',
      id: 'note-123',
    })
    expect(result.current.isOver).toBe(false)
  })

  it('does not dispatch REMOVE when note is dropped outside trash zone', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    const mockElement = setupMockTrashElement()
    ;(result.current.trashRef as { current: HTMLDivElement | null }).current = mockElement

    act(() => {
      const dropped = result.current.handleDrop('note-123', 300, 200)
      expect(dropped).toBe(false)
    })

    expect(dispatch).not.toHaveBeenCalled()
    expect(result.current.isOver).toBe(false)
  })

  it('resets isOver to false when resetTrash is called', () => {
    const dispatch = vi.fn()
    const contextValue: INoteContextValue = { notes: [], dispatch }
    const wrapper = ({ children }: PropsWithChildren) => (
      <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
    )

    const { result } = renderHook(() => useTrashZone(), { wrapper })

    const mockElement = setupMockTrashElement()
    ;(result.current.trashRef as { current: HTMLDivElement | null }).current = mockElement

    act(() => {
      result.current.checkOverlap(850, 650)
    })
    expect(result.current.isOver).toBe(true)

    act(() => {
      result.current.resetTrash()
    })
    expect(result.current.isOver).toBe(false)
  })
})
