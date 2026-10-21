# Task 07 — Feature: Trash Zone (drag-to-remove)
## Status: ⬜ TODO

---

## Objective
Implement a "trash zone" — a visible drop target in the board corner.
When a note is dragged over it, the note is removed.

---

## UX Design
- Trash zone is always visible (bottom-right corner of board)
- During ANY note drag, the trash zone highlights (ready state)
- When the note is released over the trash zone, it is removed
- The note visually "fly into" the trash zone (CSS transition) — optional but impressive

---

## Files to Create/Modify

### `src/features/trash-note/useTrashZone.ts`
```ts
interface UseTrashZoneReturn {
  isOver: boolean
  trashRef: React.RefObject<HTMLElement>
}

function useTrashZone(): UseTrashZoneReturn
```

Implementation:
- `trashRef` is attached to the trash zone DOM element
- `isOver` is true when a dragged note's pointer is within the trash zone bounds
- The trash zone does NOT use `onDragOver` (HTML5 DnD). Instead, it checks
  pointer coordinates during the `useDrag` flow:
  - `shared/lib/useDrag` exposes the current pointer position in `onDragMove`
  - Features call `useTrashZone().checkOverlap(x, y)` during move
  - OR: the trash zone listens to a shared `isDraggingOver` signal

**Recommended approach**: Use a Context-based "drag session":
```ts
// src/shared/lib/DragSessionContext.tsx
interface DragSession {
  isDragging: boolean
  pointerX: number
  pointerY: number
  startDrag: (noteId: string) => void
  updatePointer: (x: number, y: number) => void
  endDrag: () => void
  activeNoteId: string | null
}
```
- `useMoveNote` calls `startDrag/updatePointer/endDrag` during the drag lifecycle
- `TrashZone` reads `pointerX/Y` and checks if they're within its own `getBoundingClientRect()`
- When `endDrag` is called and pointer is within trash bounds → dispatch `REMOVE`

### `src/features/trash-note/useTrashNote.ts`
Alternative simpler approach (if no DragSession context): 
- `useMoveNote` calls `onDragEnd` with pointer coordinates
- `BoardPage` checks if pointer is within trash zone bounds and dispatches `REMOVE`

### `src/shared/ui/TrashZone.tsx` (REPLACE stub from Task 02)
```ts
interface TrashZoneProps {
  isOver: boolean
}
```
- Fixed position: bottom-right corner of the board
- Visible at all times (icon + label "Drop to delete")
- `isOver` → highlighted state (red glow, scale up)
- Add `data-testid="trash-zone"`

### `src/features/trash-note/index.ts` (barrel)

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Visual Check (manual)
- Trash zone visible at bottom-right
- Drag any note → trash zone highlights
- Release over trash zone → note disappears
- Release outside trash zone → note stays

## Commit Message
```
feat(features/trash-note): implement drag-to-trash with hover detection
feat(shared/ui): complete TrashZone component with hover state
test(features/trash-note): add trash zone overlap detection tests
```

## Notes
- If DragSession context adds too much complexity, use a simpler `ref`-based
  approach: pass `trashZoneRef` down from `BoardPage` to `useMoveNote`
- Document your approach choice in a brief inline comment
