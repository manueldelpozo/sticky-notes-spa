import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { NoteProvider } from '@/app'
import { BoardPage } from './BoardPage'
import type { Note } from '@/entities/note'

describe('BoardPage', () => {
  it('renders the board canvas and trash zone when empty', () => {
    render(
      <NoteProvider>
        <BoardPage />
      </NoteProvider>,
    )

    expect(screen.getByTestId('board')).toBeInTheDocument()
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument()
  })

  it('renders note cards for each note in state', () => {
    const notes: readonly Note[] = [
      {
        id: 'note-1',
        position: { x: 50, y: 80 },
        size: { width: 200, height: 180 },
        text: 'First note',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
      },
      {
        id: 'note-2',
        position: { x: 300, y: 120 },
        size: { width: 220, height: 200 },
        text: 'Second note',
        color: 'pink',
        zIndex: 2,
        createdAt: 2000,
      },
    ]

    render(
      <NoteProvider initialNotes={notes}>
        <BoardPage />
      </NoteProvider>,
    )

    expect(screen.getByDisplayValue('First note')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Second note')).toBeInTheDocument()
  })

  it('creates a new note on empty board double-click', () => {
    render(
      <NoteProvider>
        <BoardPage />
      </NoteProvider>,
    )

    const board = screen.getByTestId('board')
    expect(screen.queryByPlaceholderText('Type a note…')).not.toBeInTheDocument()

    fireEvent.doubleClick(board, { clientX: 200, clientY: 150 })

    expect(screen.getByPlaceholderText('Type a note…')).toBeInTheDocument()
  })

  it('removes a note when dragged and dropped onto the trash zone', () => {
    const notes: readonly Note[] = [
      {
        id: 'note-1',
        position: { x: 50, y: 80 },
        size: { width: 200, height: 180 },
        text: 'Doomed note',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
      },
    ]

    render(
      <NoteProvider initialNotes={notes}>
        <BoardPage />
      </NoteProvider>,
    )

    expect(screen.getByDisplayValue('Doomed note')).toBeInTheDocument()

    const trashZone = screen.getByTestId('trash-zone')
    trashZone.getBoundingClientRect = () => ({
      left: 800,
      right: 900,
      top: 600,
      bottom: 700,
      width: 100,
      height: 100,
      x: 800,
      y: 600,
      toJSON: () => {},
    })

    const noteCard = screen.getByTestId('trash-zone').parentElement?.querySelector('header')
    expect(noteCard).toBeInTheDocument()

    // 1. Pointer down on note header
    fireEvent.pointerDown(noteCard!, {
      clientX: 60,
      clientY: 90,
      pointerId: 1,
      button: 0,
    })

    // 2. Drag over threshold and onto trash zone
    fireEvent.pointerMove(window, {
      clientX: 850,
      clientY: 650,
      pointerId: 1,
    })

    // 3. Release pointer over trash zone
    fireEvent.pointerUp(window, {
      clientX: 850,
      clientY: 650,
      pointerId: 1,
    })

    // Note should now be removed from state
    expect(screen.queryByDisplayValue('Doomed note')).not.toBeInTheDocument()
  })

  it('brings a note to front when clicked, elevating its z-index', () => {
    const notes: readonly Note[] = [
      {
        id: 'note-1',
        position: { x: 50, y: 80 },
        size: { width: 200, height: 180 },
        text: 'Back note',
        color: 'yellow',
        zIndex: 1,
        createdAt: 1000,
      },
      {
        id: 'note-2',
        position: { x: 80, y: 100 },
        size: { width: 200, height: 180 },
        text: 'Front note',
        color: 'pink',
        zIndex: 10,
        createdAt: 2000,
      },
    ]

    render(
      <NoteProvider initialNotes={notes}>
        <BoardPage />
      </NoteProvider>,
    )

    const backNote = screen.getByDisplayValue('Back note').closest('article')
    const frontNote = screen.getByDisplayValue('Front note').closest('article')

    expect(backNote).toHaveStyle({ zIndex: 1 })
    expect(frontNote).toHaveStyle({ zIndex: 10 })

    // Click on the back note
    fireEvent.click(backNote!)

    // Back note is elevated above front note (10 + 1 = 11)
    expect(backNote).toHaveStyle({ zIndex: 11 })
  })
})
