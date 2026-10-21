# Implementation Tasks: Sticky Notes SPA

> **Tasks Document (`tasks.md`)**  
> Spec-Driven Workflow: Each task proceeds via:  
> **READ spec → IMPLEMENT → GATE (typecheck + test + lint) → HUMAN REVIEW → COMMIT → PUSH**

---

## Phase 1 — Core (Mandatory Assessment Requirements)

- [x] **Task 00: Project Setup & Tooling Configuration**
  - **Branch**: `main`
  - **Deliverables**: Vite 5 + React 18 + TS strict + Vitest 2 + ESLint configs, `src/test/setup.ts`, path aliases (`@/*`).
  - **Gates**: `npm run typecheck && npm run test:run && npm run lint`
  - **Commit**: `chore: initial scaffold with Vite+React+TS, Vitest config, and speckit specs`

- [x] **Task 01: Note Entity (Model, Reducer & NoteCard UI)**
  - **Branch**: `main`
  - **Deliverables**:
    - `src/entities/note/model/types.ts` (`Note`, `Position`, `Size`, `NoteColor`)
    - `src/entities/note/model/noteReducer.ts` (immutability, 8 actions)
    - `src/entities/note/model/noteReducer.test.ts` (20 unit tests)
    - `src/entities/note/ui/NoteCard.tsx` & `NoteCard.module.css` (presentational component, drag/resize handles)
    - `src/entities/note/index.ts` (public barrel export)
  - **Gates**: Passed (20 unit tests)
  - **Commit**: `feat(entities/note): add Note type, noteReducer, and NoteCard component`

- [x] **Task 02: App State & Board Canvas**
  - **Branch**: `feature/02-board-canvas` (merged via PR #1)
  - **Deliverables**:
    - `src/app/NoteProvider.tsx` (`PropsWithChildren`, `useReducer`)
    - `src/app/noteContext.ts` (React Context + `useNotes` guard, separated for Fast Refresh)
    - `src/app/NoteContext.test.tsx` (provider and guard tests)
    - `src/app/App.tsx` (app composition root)
    - `src/pages/board/BoardPage.tsx` & `BoardPage.module.css` (canvas layout & grid)
    - `src/pages/board/BoardPage.test.tsx` (canvas render tests)
    - `src/shared/ui/TrashZone.tsx` (stub component)
  - **Gates**: Passed (26 tests total)
  - **Commit**: `feat(app): add NoteContext + BoardPage shell`

- [x] **Task 03: Drag Engine (`useDrag` Hook)**
  - **Branch**: `feature/03-drag-engine` (merged via PR #2)
  - **Deliverables**:
    - `src/shared/lib/useDrag.ts` (native `PointerEvent`, `setPointerCapture`, threshold, deltas)
    - `src/shared/lib/useDrag.test.ts` (8 comprehensive tests)
    - `src/shared/lib/index.ts` (barrel export)
  - **Gates**: Passed (34 tests total)
  - **Commit**: `feat(shared/lib): implement useDrag hook`

- [x] **Task 04: Feature: Create Note (Double-Click Canvas)**
  - **Branch**: `feature/04-create-note`
  - **Deliverables**:
    - `src/features/create-note/constants/noteDefaults.ts` (`DEFAULT_NOTE_SIZE`)
    - `src/features/create-note/hooks/useCreateNote.ts` (relative position calculation, card/trash zone guard)
    - `src/features/create-note/hooks/useCreateNote.test.tsx` (relative offset and guard tests)
    - `src/features/create-note/index.ts` (barrel export)
    - `src/pages/board/BoardPage.tsx` (wired `onDoubleClick`)
    - `src/pages/board/BoardPage.test.tsx` (integration test)
  - **Gates**: Passed (38 tests total)
  - **Commit**: `feat(features/create-note): create note on double-click`

- [x] **Task 05: Feature: Move Note (Drag-to-Reposition)**
  - **Branch**: `feature/05-move-note`
  - **Deliverables**:
    - `src/features/move-note/hooks/useMoveNote.ts` (uses `useDrag`, accumulates deltas, dispatches `MOVE` & `BRING_TO_FRONT`)
    - `src/features/move-note/hooks/useMoveNote.test.tsx` (unit tests for move accumulation)
    - `src/features/move-note/index.ts` (barrel export)
    - `src/pages/board/components/BoardNoteCard.tsx` (connect `handleDragStart` to note cards)
    - `src/pages/board/BoardPage.tsx`
  - **Gates**: Passed (41 tests total)
  - **Commit**: `feat(features/move-note): implement note drag-to-move`

- [x] **Task 06: Feature: Resize Note (Corner Handle)**
  - **Branch**: `feature/06-resize-note`
  - **Deliverables**:
    - `src/features/resize-note/constants/resizeLimits.ts` (`MIN_NOTE_SIZE = { width: 120, height: 100 }`)
    - `src/features/resize-note/hooks/useResizeNote.ts` (uses `useDrag`, size clamping)
    - `src/features/resize-note/hooks/useResizeNote.test.tsx` (unit tests with minimum size clamping)
    - `src/features/resize-note/index.ts` (barrel export)
    - `src/pages/board/components/BoardNoteCard.tsx` (connect `handleResizeStart` to note cards)
  - **Gates**: Passed (45 tests total)
  - **Commit**: `feat(features/resize-note): implement note resize via drag handle`

- [x] **Task 07: Feature: Trash Zone (Drag-to-Delete)**
  - **Branch**: `feature/07-trash-zone`
  - **Deliverables**:
    - `src/features/trash-note/hooks/useTrashZone.ts` (hover detection during active drag session, drop removal)
    - `src/features/trash-note/hooks/useTrashZone.test.tsx` (6 unit tests for bounds overlap, drop, reset)
    - `src/features/trash-note/index.ts` (barrel export)
    - `src/shared/ui/TrashZone.tsx` (ref forwarding, active hover state, delete icon)
    - `src/shared/ui/TrashZone.test.tsx` (3 unit tests)
    - `src/pages/board/BoardPage.tsx` (wire delete action on release)
    - `src/pages/board/components/BoardNoteCard.tsx` (forward drag events)
  - **Gates**: Passed (55 tests total)
  - **Commit**: `feat(features/trash-note): implement drag-to-trash with hover detection`

---

## Phase 2 — Bonus Features (Ordered by Priority)

- [x] **Bonus I: Text Editing**
  - **Branch**: `feature/08-bonus-text`
  - **Deliverables**: Wire `UPDATE_TEXT` on textarea change, isolated pointer events, keyboard accessibility (`tabIndex={0}`), comprehensive `NoteCard.test.tsx`.
  - **Gates**: Passed (71 tests total)
  - **Commit**: `feat(bonus/text): enable note text editing with UPDATE_TEXT action`
- [x] **Bonus II: Bring to Front (Z-Index)**
  - **Branch**: `feature/09-bonus-zindex`
  - **Deliverables**: Wire `BRING_TO_FRONT` on card click, drag start, and resize start; test z-index elevation in `BoardPage.test.tsx`.
  - **Gates**: Passed (72 tests total)
  - **Commit**: `feat(bonus/zindex): click note brings it to front via BRING_TO_FRONT action`
- [x] **Bonus III: LocalStorage Persistence**
  - **Branch**: `feature/10-bonus-storage`
  - **Deliverables**: `NoteRepository` abstraction, `LocalStorageNoteRepository` with schema validation/error recovery, `NoteProvider` hydration and debounced auto-save.
  - **Gates**: Passed (64 tests total)
  - **Commit**: `feat(bonus/storage): add NoteRepository abstraction + LocalStorageNoteRepository`
- [x] **Bonus IV: Note Color Palette**
  - **Branch**: `feature/11-bonus-colors`
  - **Deliverables**: Connect color swatches in header to dispatch `SET_COLOR`, verify color updating via `BoardPage.test.tsx`.
  - **Gates**: Passed (73 tests total)
  - **Commit**: `feat(bonus/colors): add note color picker with SET_COLOR action`
- [x] **Bonus V: Async REST Mock**
  - **Branch**: `feature/12-bonus-api-mock`
  - **Deliverables**: `MockNoteRepository` simulating network latency with fake timer tests; interchangeable with `LocalStorageNoteRepository`.
  - **Gates**: Passed (76 tests total)
  - **Commit**: `feat(bonus/api-mock): add MockNoteRepository with simulated async REST delays`

---

## Pre-Submission Review Checklist

- [ ] All test gates pass on a fresh checkout (`npm run typecheck && npm run test:run && npm run lint`)
- [ ] Production build succeeds cleanly (`npm run build`)
- [ ] Architecture description written (2-3 paragraphs in README.md)
- [ ] Manual cross-browser test in Chrome, Firefox, Safari/Edge
