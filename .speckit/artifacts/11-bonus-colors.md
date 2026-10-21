# Task 11 (Bonus IV) — Note Colors
## Status: ⬜ TODO

---

## Objective
Allow users to change a note's color. The color picker is rendered in the note header.

---

## Design
Colors: `yellow | pink | blue | green`

The color swatch is a row of 4 small colored circles in the note header.
Clicking a circle dispatches `SET_COLOR`.

---

## Files to Create/Modify

### `src/entities/note/ui/NoteCard.tsx`
- Add `onColorChange?: (color: NoteColor) => void` to `NoteCardProps`
- Render color swatches in the header area
- Each swatch: `<button>` with `aria-label="Set note color to {color}"`
- Currently active color: highlighted swatch

### `src/entities/note/ui/NoteCard.module.css`
Add styles:
```css
/* Color design tokens (in :root or here) */
--color-yellow: #fef08a;
--color-pink: #fda4af;
--color-blue: #93c5fd;
--color-green: #86efac;

.colorSwatch { width: 14px; height: 14px; border-radius: 50%; cursor: pointer; }
.colorSwatch.active { outline: 2px solid currentColor; }
```

### Modify `src/pages/board/BoardPage.tsx`
- Pass `onColorChange={(color) => dispatch({ type: 'SET_COLOR', id: note.id, color })}` to each NoteCard

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Commit Message
```
feat(bonus/colors): add note color picker with SET_COLOR action
```
