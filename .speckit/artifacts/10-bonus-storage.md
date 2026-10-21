# Task 10 (Bonus III) — localStorage Persistence
## Status: ✅ COMPLETE

---

## Objective
Persist notes to `localStorage`. On page load, restore saved notes.
Implemented through a `NoteRepository` abstraction (async interface).

---

## Architecture: Repository Pattern
```ts
// src/shared/lib/NoteRepository.ts
interface NoteRepository {
  loadNotes(): Promise<readonly Note[]>
  saveNotes(notes: readonly Note[]): Promise<void>
}
```

Two implementations:
1. `LocalStorageNoteRepository` — production default
2. `MockNoteRepository` — for REST API bonus (Task 12)

### `src/shared/lib/LocalStorageNoteRepository.ts`
- `loadNotes()`: `JSON.parse(localStorage.getItem('sticky-notes') ?? '[]')`
  — validate/transform data shape before returning (never trust raw storage)
- `saveNotes()`: `localStorage.setItem('sticky-notes', JSON.stringify(notes))`
- Both methods return `Promise.resolve()` (async-compatible sync ops)

### `src/shared/lib/LocalStorageNoteRepository.test.ts`
- `loadNotes()` returns empty array when storage is empty
- `loadNotes()` returns parsed notes when storage has valid data
- `saveNotes()` writes correct JSON to storage
- `loadNotes()` handles corrupt JSON gracefully (returns empty array)

### Modify `src/app/NoteContext.tsx`
- Accept optional `repository: NoteRepository` prop on `NoteProvider`
- On mount: `repository.loadNotes()` → dispatch `SET_ALL` action or set initial state
- On state change: `repository.saveNotes(notes)` (debounced — 300ms)

### Add `SET_ALL` action to `noteReducer.ts`
```ts
| { type: 'SET_ALL'; notes: readonly Note[] }
```
Replaces entire state (used for hydration from storage).

---

## Test Gates
```bash
npm run typecheck
npm run test:run
npm run lint
```

## Commit Message
```
feat(bonus/storage): add NoteRepository abstraction + LocalStorageNoteRepository
feat(app): hydrate and persist notes via NoteRepository
test(shared/lib): add LocalStorageNoteRepository tests
```
