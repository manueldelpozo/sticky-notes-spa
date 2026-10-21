# Task 01 — Note Entity: Types, Reducer & NoteCard
## Status: ✅ COMPLETE

---

## Objective
Define the core `Note` domain entity: its TypeScript type, the state reducer,
and a presentational `NoteCard` component.

This is the foundation that all features build upon.

---

## Files to Create

### `src/entities/note/model/types.ts`
```ts
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green'

export interface Note {
  readonly id: string
  readonly position: Position
  readonly size: Size
  readonly text: string
  readonly color: NoteColor
  readonly zIndex: number
  readonly createdAt: number
}

export type CreateNoteParams = Omit<Note, 'id' | 'createdAt' | 'zIndex'>
```

### `src/entities/note/model/noteReducer.ts`
Actions:
- `{ type: 'ADD'; payload: CreateNoteParams }` — adds note, generates id, createdAt, zIndex = max + 1
- `{ type: 'MOVE'; id: string; position: Position }` — updates position
- `{ type: 'RESIZE'; id: string; size: Size }` — updates size
- `{ type: 'REMOVE'; id: string }` — removes note
- `{ type: 'UPDATE_TEXT'; id: string; text: string }` — updates text
- `{ type: 'BRING_TO_FRONT'; id: string }` — sets zIndex = max + 1
- `{ type: 'SET_COLOR'; id: string; color: NoteColor }` — updates color

State shape: `readonly Note[]` (array, NOT a map — simpler, sufficient for this scale).

Implement `noteReducer(state: readonly Note[], action: NoteAction): readonly Note[]`.
Use `crypto.randomUUID()` for id generation.

### `src/entities/note/model/noteReducer.test.ts`
Full unit test suite:
- ADD: creates note with correct defaults, generates unique ids
- MOVE: updates only position, other fields unchanged
- RESIZE: updates only size, other fields unchanged
- REMOVE: removes correct note, others unchanged
- UPDATE_TEXT: updates only text
- BRING_TO_FRONT: sets correct zIndex
- SET_COLOR: updates only color
- All tests use immutability assertions (original array unchanged)

### `src/entities/note/ui/NoteCard.tsx`
Props interface:
```ts
interface NoteCardProps {
  note: Note
  onDragStart?: (e: React.PointerEvent) => void
  onResizeStart?: (e: React.PointerEvent) => void
  onTextChange?: (text: string) => void
  onBringToFront?: () => void
}
```

Renders:
- A `<article>` positioned `absolute` (inline style: `left`, `top`, `width`, `height`, `zIndex`)
- A drag handle area (entire card header) triggering `onDragStart`
- A resize handle (bottom-right corner) triggering `onResizeStart`
- A `<textarea>` for note text (calls `onTextChange`)
- Color applied via CSS custom property: `--note-color: var(--color-{note.color})`

### `src/entities/note/ui/NoteCard.module.css`
Styles for NoteCard. Use CSS custom properties for theming.

### `src/entities/note/index.ts` (barrel)
```ts
export type { Note, Position, Size, NoteColor, CreateNoteParams } from './model/types'
export { noteReducer } from './model/noteReducer'
export type { NoteAction } from './model/noteReducer'
export { NoteCard } from './ui/NoteCard'
```

---

## Test Gates
```bash
npm run typecheck   # must pass with zero errors
npm run test:run    # noteReducer.test.ts must pass (all cases)
npm run lint        # must pass with zero errors
```

## Commit Message
```
feat(entities/note): add Note type, noteReducer, and NoteCard component
test(entities/note): add full reducer unit test suite
```

## Notes
- `NoteCard` is purely presentational — it knows nothing about dispatch or context
- Position/size are applied via inline styles only (dynamic values from state)
- The resize handle must have `pointer-events: auto` even if the card captures pointer events
