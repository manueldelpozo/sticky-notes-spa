# Task 02 — App State: Context + Provider + Board Page
## Status: ✅ COMPLETE

---

## Objective
Wire the global note state via React Context + `useReducer`, and create the
Board page — a full-viewport canvas that renders all notes.

---

## Files to Create

### `src/app/NoteContext.tsx`
```ts
interface NoteContextValue {
  notes: readonly Note[]
  dispatch: React.Dispatch<NoteAction>
}
```
- `createContext` with `undefined` as default (force consumers to be wrapped)
- `NoteProvider` component: uses `useReducer(noteReducer, [])`, provides context
- `useNotes()` hook: throws if used outside provider (safety guard)

### `src/app/NoteContext.test.tsx`
- Test `useNotes` throws if outside `NoteProvider`
- Test `NoteProvider` provides correct initial state (empty array)
- Test dispatching `ADD` through context updates state

### `src/app/index.ts` (barrel)
```ts
export { NoteProvider, useNotes } from './NoteContext'
```

### `src/pages/board/BoardPage.tsx`
- Full-viewport `<main>` with `position: relative`, `overflow: hidden`
- Renders all `Note` objects from `useNotes()` as `<NoteCard>` components
- Passes correct drag/resize callbacks to each NoteCard
- Renders `<TrashZone>` component (from `shared/ui` — stub for now)

### `src/pages/board/BoardPage.module.css`
Full-viewport canvas styles.

### `src/pages/index.ts` (barrel)
```ts
export { BoardPage } from './board/BoardPage'
```

### `src/app/App.tsx` (replace default Vite content)
```tsx
import { NoteProvider } from '@/app'
import { BoardPage } from '@/pages'

export function App() {
  return (
    <NoteProvider>
      <BoardPage />
    </NoteProvider>
  )
}
```

### `src/shared/ui/TrashZone.tsx` (STUB)
Placeholder `<div>` with a trash icon. Full implementation in Task 07.
```tsx
export function TrashZone() {
  return <div className={styles.trashZone}>🗑</div>
}
```

### `src/shared/ui/index.ts` (barrel)
```ts
export { TrashZone } from './TrashZone'
```

---

## Test Gates
```bash
npm run typecheck
npm run test:run      # NoteContext tests pass
npm run lint
```

## Visual Check (manual)
- `npm run dev` → browser shows empty black/dark canvas
- No console errors

## Commit Message
```
feat(app): add NoteContext with useReducer and NoteProvider
feat(pages/board): add BoardPage canvas shell
feat(shared/ui): add TrashZone stub
test(app): add NoteContext unit tests
```
