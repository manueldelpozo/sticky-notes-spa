# Task 05 — Feature: Move Note (drag)
## Status: ✅ COMPLETE

---

## Objective
Allow users to move a note by dragging its header/body area.
Uses `useDrag` from `shared/lib`. Dispatches `MOVE` actions to update position.

---

## Files to Create/Modify (FSD Segments)

### `src/features/move-note/hooks/useMoveNote.ts`
```ts
interface UseMoveNoteReturn {
  handleDragStart: (event: React.PointerEvent<HTMLElement>) => void
  isDragging: boolean
}

function useMoveNote(noteId: string): UseMoveNoteReturn
```

Implementation:
- Gets `dispatch` from `useNotes()`
- Calls `useDrag` with:
  - `onDragMove`: dispatches `{ type: 'MOVE', id: noteId, position: currentPos + delta }`
  - `onDragStart`: dispatches `BRING_TO_FRONT` for the note
- Must track the **current position** of the note to accumulate deltas correctly
  - Read current position from `useNotes()` state by `noteId`
  - On each `onDragMove`, add `dx`/`dy` to the last known position

### `src/features/move-note/hooks/useMoveNote.test.ts`
- Dispatches BRING_TO_FRONT on drag start
- Dispatches MOVE with correct accumulated position
- Multiple consecutive moves accumulate deltas correctly

### `src/features/move-note/index.ts` (slice barrel)
```ts
export { useMoveNote } from './hooks/useMoveNote'
export type { UseMoveNoteReturn } from './hooks/useMoveNote'
```

### Modify `src/entities/note/ui/NoteCard.tsx`
- The `onDragStart` prop is connected to the card's drag handle area
- The drag handle should be the card header (NOT the resize handle or textarea)
- Add `data-note-id={note.id}` attribute on the root element (for create-note check)
- Apply `cursor: grab` on header, `cursor: grabbing` while dragging

### Modify `src/pages/board/BoardPage.tsx`
- Import `useMoveNote` via the feature barrel
- For each note rendered, use `useMoveNote(note.id)` and pass `handleDragStart` to `NoteCard`

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Visual Check (manual)
- Drag note by header → note moves with cursor
- Release → note stays in new position
- Drag does NOT move the resize handle area

## Commit Message
```
feat(features/move-note): implement note drag-to-move with useDrag
test(features/move-note): add useMoveNote hook tests
```

## Notes
- Position clamping (keeping within board) is a nice-to-have, not required
- `BRING_TO_FRONT` on drag start ensures the dragged note is always on top
