# Task 09 (Bonus II) — Bring Note to Front
## Status: ⬜ TODO

---

## Objective
When a note is clicked (single-click), bring it to the front of the stack
by giving it the highest `zIndex`.

---

## Files to Create/Modify

### `src/entities/note/model/noteReducer.ts`
- `BRING_TO_FRONT` action already defined in Task 01
- Ensure `maxZIndex + 1` logic is correct

### Modify `src/pages/board/BoardPage.tsx`
- For each note: `dispatch({ type: 'BRING_TO_FRONT', id: note.id })`
  passed as `onBringToFront` callback to `NoteCard`

### Modify `src/entities/note/ui/NoteCard.tsx`
- Root element gets `onClick={onBringToFront}` (already a prop)
- This fires on single click — also fires during drag end (acceptable)

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Commit Message
```
feat(bonus/zindex): click note brings it to front via BRING_TO_FRONT action
```
