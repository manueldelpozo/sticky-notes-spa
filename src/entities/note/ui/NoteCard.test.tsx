import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NoteCard } from './NoteCard'
import type { INote } from '../model/types'

describe('NoteCard', () => {
  const sampleNote: INote = {
    id: 'note-1',
    position: { x: 50, y: 80 },
    size: { width: 220, height: 180 },
    text: 'Hello, Sticky Note!',
    color: 'yellow',
    zIndex: 5,
    createdAt: 1000,
  }

  it('renders note content, dimensions, and position', () => {
    render(<NoteCard note={sampleNote} />)

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('data-note-id', 'note-1')
    expect(card).toHaveStyle({
      left: '50px',
      top: '80px',
      width: '220px',
      height: '180px',
      zIndex: 5,
    })

    const textarea = screen.getByPlaceholderText('Type a note…')
    expect(textarea).toHaveValue('Hello, Sticky Note!')
    expect(textarea).toHaveAttribute('tabIndex', '0')
  })

  it('calls onTextChange when typing in the textarea', () => {
    const onTextChange = vi.fn()
    render(<NoteCard note={sampleNote} onTextChange={onTextChange} />)

    const textarea = screen.getByPlaceholderText('Type a note…')
    fireEvent.change(textarea, { target: { value: 'Updated note content' } })

    expect(onTextChange).toHaveBeenCalledWith('Updated note content')
  })

  it('stops pointerdown propagation on textarea to prevent card dragging', () => {
    const onDragStart = vi.fn()
    render(<NoteCard note={sampleNote} onDragStart={onDragStart} />)

    const textarea = screen.getByPlaceholderText('Type a note…')
    fireEvent.pointerDown(textarea)

    expect(onDragStart).not.toHaveBeenCalled()
  })

  it('calls onBringToFront when card is clicked', () => {
    const onBringToFront = vi.fn()
    render(<NoteCard note={sampleNote} onBringToFront={onBringToFront} />)

    const card = screen.getByRole('article')
    fireEvent.click(card)

    expect(onBringToFront).toHaveBeenCalledTimes(1)
  })

  it('calls onColorChange when clicking a color swatch and stops propagation', () => {
    const onColorChange = vi.fn()
    const onBringToFront = vi.fn()
    render(
      <NoteCard
        note={sampleNote}
        onColorChange={onColorChange}
        onBringToFront={onBringToFront}
      />,
    )

    const pinkSwatch = screen.getByLabelText('Set note color to pink')
    fireEvent.click(pinkSwatch)

    expect(onColorChange).toHaveBeenCalledWith('pink')
    // Color swatch click stops propagation, so onBringToFront is not triggered by swatch
    expect(onBringToFront).not.toHaveBeenCalled()
  })

  it('triggers onDragStart when pointerdown on card header', () => {
    const onDragStart = vi.fn()
    render(<NoteCard note={sampleNote} onDragStart={onDragStart} />)

    const header = screen.getByRole('article').querySelector('header')
    expect(header).toBeInTheDocument()

    fireEvent.pointerDown(header!)
    expect(onDragStart).toHaveBeenCalledTimes(1)
  })

  it('triggers onResizeStart and stops propagation on resize handle pointerdown', () => {
    const onResizeStart = vi.fn()
    const onDragStart = vi.fn()
    render(
      <NoteCard
        note={sampleNote}
        onResizeStart={onResizeStart}
        onDragStart={onDragStart}
      />,
    )

    const resizeHandle = screen.getByLabelText('Resize note')
    fireEvent.pointerDown(resizeHandle)

    expect(onResizeStart).toHaveBeenCalledTimes(1)
    expect(onDragStart).not.toHaveBeenCalled()
  })
})
