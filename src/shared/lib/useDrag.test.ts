import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { type PointerEvent as ReactPointerEvent } from 'react'
import { useDrag } from './useDrag'

describe('useDrag', () => {
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

  it('returns isDragging false initially', () => {
    const { result } = renderHook(() => useDrag())
    expect(result.current.isDragging).toBe(false)
  })

  it('does not start drag if movement is below threshold', () => {
    const onDragStart = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragStart, threshold: 5 }))

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100))
    })

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 102, clientY: 102, pointerId: 1 }),
      )
    })

    expect(onDragStart).not.toHaveBeenCalled()
    expect(result.current.isDragging).toBe(false)
  })

  it('triggers onDragStart and sets isDragging to true once threshold is reached', () => {
    const onDragStart = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragStart, threshold: 5 }))

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100))
    })

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 106, clientY: 100, pointerId: 1 }),
      )
    })

    expect(onDragStart).toHaveBeenCalledTimes(1)
    expect(result.current.isDragging).toBe(true)
  })

  it('passes incremental deltas (dx, dy) to onDragMove', () => {
    const onDragMove = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragMove, threshold: 3 }))

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100))
    })

    // Exceed threshold (move from 100 -> 105)
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 105, clientY: 100, pointerId: 1 }),
      )
    })

    // Next move from 105, 100 -> 115, 110 (dx = 10, dy = 10)
    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 115, clientY: 110, pointerId: 1 }),
      )
    })

    expect(onDragMove).toHaveBeenCalledWith(
      { dx: 10, dy: 10 },
      expect.any(PointerEvent),
    )
  })

  it('triggers onDragEnd and resets isDragging on pointerup', () => {
    const onDragEnd = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragEnd, threshold: 3 }))

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100))
    })

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 110, clientY: 100, pointerId: 1 }),
      )
    })

    expect(result.current.isDragging).toBe(true)

    act(() => {
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 1 }))
    })

    expect(onDragEnd).toHaveBeenCalledTimes(1)
    expect(result.current.isDragging).toBe(false)
  })

  it('ignores pointer events from a different pointerId', () => {
    const onDragMove = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragMove, threshold: 3 }))

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100, 1))
    })

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 120, clientY: 120, pointerId: 99 }),
      )
    })

    expect(onDragMove).not.toHaveBeenCalled()
  })

  it('ignores non-primary button presses', () => {
    const onDragStart = vi.fn()
    const { result } = renderHook(() => useDrag({ onDragStart }))

    act(() => {
      // button = 2 (right click)
      result.current.handlePointerDown(createMockPointerDown(100, 100, 1, 2))
    })

    act(() => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { clientX: 150, clientY: 150, pointerId: 1 }),
      )
    })

    expect(onDragStart).not.toHaveBeenCalled()
    expect(result.current.isDragging).toBe(false)
  })

  it('removes window listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { result, unmount } = renderHook(() => useDrag())

    act(() => {
      result.current.handlePointerDown(createMockPointerDown(100, 100))
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})
