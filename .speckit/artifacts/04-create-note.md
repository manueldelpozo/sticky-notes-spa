# Task 04 — Feature: Create Note
## Status: ✅ COMPLETE

---

## Objective
Allow users to create a new sticky note by double-clicking on the board canvas.
The note is created at the click position with a default size.

---

## UX Design Decision
**Double-click on empty canvas area** → create note at that position.

Why: Single-click is reserved for bring-to-front. Double-click is a well-known
"create here" pattern that avoids accidental creation.

Default note size: `{ width: 200, height: 180 }`.
Default color: `'yellow'`.

---

## Files to Create/Modify

### `src/features/create-note/useCreateNote.ts`
```ts
interface UseCreateNoteReturn {
  handleBoardDoubleClick: (e: React.MouseEvent<HTMLElement>) => void
}

function useCreateNote(): UseCreateNoteReturn
```

Implementation:
- Gets `dispatch` from `useNotes()`
- On double-click: reads `e.clientX`, `e.clientY` relative to `e.currentTarget`
  (use `getBoundingClientRect()` to compute offset from canvas edge)
- Dispatches `{ type: 'ADD', payload: { position, size, text: '', color: 'yellow', ... } }`
- If click target is a NoteCard (has `data-note-id` attribute), do NOT create (check `e.target`)

### `src/features/create-note/useCreateNote.test.ts`
- Double-click on empty board dispatches ADD
- Double-click on a note element does NOT dispatch (event target check)
- Position is computed relative to board element

### `src/features/create-note/index.ts` (barrel)
```ts
export { useCreateNote } from './useCreateNote'
```

### Modify `src/pages/board/BoardPage.tsx`
- Import `useCreateNote`
- Attach `onDoubleClick={handleBoardDoubleClick}` to the board `<main>` element
- Add `data-testid="board"` to the board element for testing

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Visual Check (manual)
- Double-click empty board → yellow sticky note appears at cursor
- Double-click existing note → no new note created

## Commit Message
```
feat(features/create-note): create note on board double-click
test(features/create-note): add useCreateNote hook tests
```
