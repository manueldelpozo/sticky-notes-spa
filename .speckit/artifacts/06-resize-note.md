# Task 06 — Feature: Resize Note (drag)
## Status: ⬜ TODO

---

## Objective
Allow users to resize a note by dragging its bottom-right resize handle.
Uses `useDrag` from `shared/lib`. Dispatches `RESIZE` actions.

---

## Files to Create/Modify

### `src/features/resize-note/useResizeNote.ts`
```ts
interface UseResizeNoteReturn {
  handleResizeStart: (e: React.PointerEvent) => void
  isResizing: boolean
}

function useResizeNote(noteId: string): UseResizeNoteReturn
```

Implementation:
- Gets `dispatch` from `useNotes()`
- Calls `useDrag` with:
  - `onDragMove`: dispatches `{ type: 'RESIZE', id: noteId, size: newSize }`
  - Accumulates deltas: `newWidth = currentWidth + dx`, `newHeight = currentHeight + dy`
- Enforce minimum size: `{ width: 120, height: 100 }` — clamp in the hook

### `src/features/resize-note/useResizeNote.test.ts`
- Dispatches RESIZE with correct accumulated size
- Enforces minimum width (120px) — cannot resize smaller
- Enforces minimum height (100px) — cannot resize smaller

### `src/features/resize-note/index.ts` (barrel)
```ts
export { useResizeNote } from './useResizeNote'
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
