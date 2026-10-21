# Task 12 (Bonus V) — Async REST API Mock
## Status: ⬜ TODO

---

## Objective
Implement `MockNoteRepository` that simulates REST API calls with realistic
async delays. This demonstrates the repository abstraction in action.

---

## Architecture
The `NoteRepository` interface (from Task 10) makes this a drop-in swap.
No changes to `NoteContext` or components are required.

---

## Files to Create

### `src/shared/lib/MockNoteRepository.ts`
```ts
const API_DELAY_MS = 300

export class MockNoteRepository implements NoteRepository {
  private store: readonly Note[] = []

  async loadNotes(): Promise<readonly Note[]> {
    await delay(API_DELAY_MS)
    // Simulate GET /api/notes
    const raw = localStorage.getItem('sticky-notes-mock')
    return raw ? (JSON.parse(raw) as Note[]) : []
  }

  async saveNotes(notes: readonly Note[]): Promise<void> {
    await delay(API_DELAY_MS)
    // Simulate PUT /api/notes (batch update)
    localStorage.setItem('sticky-notes-mock', JSON.stringify(notes))
    this.store = notes
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### `src/shared/lib/MockNoteRepository.test.ts`
- `loadNotes()` returns notes after async delay
- `saveNotes()` persists notes and subsequent `loadNotes()` returns them
- Test with `vi.useFakeTimers()` for fast async testing

### `src/app/App.tsx`
- Instantiate `LocalStorageNoteRepository` (or toggle to `MockNoteRepository`)
- Pass as `repository` prop to `NoteProvider`

### `src/shared/lib/index.ts` (update barrel)
```ts
export { LocalStorageNoteRepository } from './LocalStorageNoteRepository'
export { MockNoteRepository } from './MockNoteRepository'
export type { NoteRepository } from './NoteRepository'
```

---

## Test Gates
```bash
npm run typecheck
npm run test:run    # MockNoteRepository tests use vi.useFakeTimers()
npm run lint
```

## Commit Message
```
feat(bonus/api-mock): add MockNoteRepository with simulated async REST delays
test(shared/lib): add MockNoteRepository tests with fake timers
```

## Notes
- The comment in `App.tsx` should explain how to swap implementations
- This demonstrates the Open/Closed principle — the repository contract is stable
