import { useCallback, type MouseEvent as ReactMouseEvent } from 'react'
import { useNotes } from '@/app'
import { DEFAULT_NOTE_SIZE } from '../constants/noteDefaults'

export interface IUseCreateNoteReturn {
  handleBoardDoubleClick: (event: ReactMouseEvent<HTMLElement>) => void
}

export function useCreateNote(): IUseCreateNoteReturn {
  const { dispatch } = useNotes()

  const handleBoardDoubleClick = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement | null

      // Ignore double-clicks on notes or interactive controls
      if (target?.closest?.('[data-note-id]') || target?.closest?.('[data-testid="trash-zone"]')) {
        return
      }

      const rect = event.currentTarget.getBoundingClientRect()
      const position = {
        x: Math.round(event.clientX - rect.left),
        y: Math.round(event.clientY - rect.top),
      }

      dispatch({
        type: 'ADD',
        payload: {
          position,
          size: DEFAULT_NOTE_SIZE,
          text: '',
          color: 'yellow',
        },
      })
    },
    [dispatch],
  )

  return {
    handleBoardDoubleClick,
  }
}
