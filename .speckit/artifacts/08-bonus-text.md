# Task 08 (Bonus I) — Text Editing
## Status: ✅ COMPLETE

---

## Objective
Allow users to click into a note and type/edit its text.
The text is persisted in the note state via `UPDATE_TEXT` action.

---

## Files to Create/Modify

### Modify `src/entities/note/ui/NoteCard.tsx`
- `<textarea>` already exists from Task 01 (rendered but uncontrolled)
- Connect `onChange` to `onTextChange` prop
- `onFocus`/`onBlur` on textarea: call `e.stopPropagation()` to prevent drag
- Set `tabIndex={0}` on the textarea for keyboard accessibility
- `onPointerDown` on textarea: `e.stopPropagation()` (prevent card drag on text click)

### Modify `src/pages/board/BoardPage.tsx`
- For each note: `dispatch({ type: 'UPDATE_TEXT', id: note.id, text })`
  passed as `onTextChange` callback to `NoteCard`

### `src/entities/note/ui/NoteCard.test.tsx` (add test cases)
- Typing in textarea calls `onTextChange` with new text value
- Clicking on textarea does NOT trigger drag

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Commit Message
```
feat(bonus/text): enable note text editing with UPDATE_TEXT action
test(entities/note): add NoteCard text editing tests
```
