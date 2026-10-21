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

## Files to Create/Modify (FSD Segments)

### `src/features/create-note/constants/noteDefaults.ts`
```ts
import type { Size } from '@/entities/note'

export const DEFAULT_NOTE_SIZE: Size = {
  width: 200,
  height: 180,
}
```

### `src/features/create-note/hooks/useCreateNote.ts`
```ts
interface UseCreateNoteReturn {
  handleBoardDoubleClick: (event: React.MouseEvent<HTMLElement>) => void
}

function useCreateNote(): UseCreateNoteReturn
```

Implementation:
- Gets `dispatch` from `useNotes()`
- On double-click: reads `event.clientX`, `event.clientY` relative to `event.currentTarget`
  (use `getBoundingClientRect()` to compute offset from canvas edge)
- Dispatches `{ type: 'ADD', payload: { position, size: DEFAULT_NOTE_SIZE, text: '', color: 'yellow', ... } }`
- If click target is a NoteCard (has `data-note-id` attribute) or trash zone, do NOT create

### `src/features/create-note/hooks/useCreateNote.test.tsx`
- Double-click on empty board dispatches ADD
- Double-click on a note element does NOT dispatch (event target check)
- Double-click on trash zone does NOT dispatch
- Position is computed relative to board element

### `src/features/create-note/index.ts` (slice barrel)
```ts
export { useCreateNote } from './hooks/useCreateNote'
export type { UseCreateNoteReturn } from './hooks/useCreateNote'
export { DEFAULT_NOTE_SIZE } from './constants/noteDefaults'
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
