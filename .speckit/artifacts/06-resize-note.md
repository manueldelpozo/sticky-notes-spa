# Task 06 — Feature: Resize Note (drag)
## Status: ⬜ TODO

---

## Objective
Allow users to resize a note by dragging its bottom-right resize handle.
Uses `useDrag` from `shared/lib`. Dispatches `RESIZE` actions.

---

## Files to Create/Modify (FSD Segments)

### `src/features/resize-note/constants/resizeLimits.ts`
```ts
import type { Size } from '@/entities/note'

export const MIN_NOTE_SIZE: Size = {
  width: 120,
  height: 100,
}
```

### `src/features/resize-note/hooks/useResizeNote.ts`
```ts
interface UseResizeNoteReturn {
  handleResizeStart: (event: React.PointerEvent<HTMLElement>) => void
  isResizing: boolean
}

function useResizeNote(noteId: string): UseResizeNoteReturn
```

Implementation:
- Gets `dispatch` from `useNotes()`
- Calls `useDrag` with:
  - `onDragMove`: dispatches `{ type: 'RESIZE', id: noteId, size: newSize }`
  - Accumulates deltas: `newWidth = currentWidth + dx`, `newHeight = currentHeight + dy`
- Enforce minimum size: `{ width: 120, height: 100 }` from `constants/resizeLimits.ts`

### `src/features/resize-note/hooks/useResizeNote.test.ts`
- Dispatches RESIZE with correct accumulated size
- Enforces minimum width (120px) — cannot resize smaller
- Enforces minimum height (100px) — cannot resize smaller

### `src/features/resize-note/index.ts` (slice barrel)
```ts
export { useResizeNote } from './hooks/useResizeNote'
export type { UseResizeNoteReturn } from './hooks/useResizeNote'
export { MIN_NOTE_SIZE } from './constants/resizeLimits'
```

### Modify `src/entities/note/ui/NoteCard.tsx`
- The resize handle (`.resizeHandle`) is in the bottom-right corner
- It must call `e.stopPropagation()` on `onPointerDown` to prevent triggering card drag
- Cursor: `nwse-resize`
- The handle should be visually subtle (e.g., `▼` icon or just a grab corner)

### Modify `src/pages/board/BoardPage.tsx`
- Import `useResizeNote`
- For each note: `useResizeNote(note.id)` → pass `handleResizeStart` to `NoteCard`

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Visual Check (manual)
- Drag resize handle → note resizes
- Note cannot be smaller than 120×100px
- Resize handle drag does NOT move the note

## Commit Message
```
feat(features/resize-note): implement note resize via drag handle
test(features/resize-note): add useResizeNote with min-size clamping tests
```
