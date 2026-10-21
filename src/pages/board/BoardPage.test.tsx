import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
