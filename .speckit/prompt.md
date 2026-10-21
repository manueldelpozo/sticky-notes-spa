# SpecKit Task Runner — Temporal Prompt
## sticky-notes-spa Assessment

> This file is a **temporal prompt**: read it aloud to the AI at the start of
> each work session to load the full context. Update the `[ ]` checkboxes as
> tasks complete.

---

## Context Loader (read this to the AI each session)

```
I'm building the sticky-notes-spa recruitment assessment for tempo.io.

Project location: ~/Projects/sticky-notes-spa
Architecture: FSD-lite (app / entities / features / shared / pages)
Stack: Vite 5 + React 18 + TypeScript 5 (strict) + Vitest 2 + CSS Modules

Spec-driven workflow:
- All specs are in .speckit/artifacts/
- Constitution (inviolable rules) is in .speckit/constitution.md
- Each task: READ spec → IMPLEMENT → GATE (typecheck + test:run + lint) → I REVIEW → COMMIT → PUSH

Current task: Task 02 — App state: NoteContext + BoardPage canvas
Spec file: .speckit/artifacts/02-board-canvas.md

Please:
1. Read the spec file fully before writing any code
2. Implement exactly what the spec describes
3. Run the test gates after implementation
4. Present me the diff for review before committing
5. Do NOT push until I approve
```

---

## Task Checklist

### Phase 1 — Core (mandatory)
- [x] **Task 00** — Project setup & config *(done by guide)*
- [x] **Task 01** — Note entity: types, reducer, NoteCard
  - Spec: `.speckit/artifacts/01-entities-note.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(entities/note): add Note type, noteReducer, and NoteCard component`
- [x] **Task 02** — App state: NoteContext + BoardPage canvas
  - Spec: `.speckit/artifacts/02-board-canvas.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(app): add NoteContext + BoardPage shell`
- [ ] **Task 03** — Drag engine: `useDrag` hook (PointerEvent)
  - Spec: `.speckit/artifacts/03-drag-engine.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(shared/lib): implement useDrag hook`
- [ ] **Task 04** — Feature: Create note (double-click)
  - Spec: `.speckit/artifacts/04-create-note.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(features/create-note): create note on double-click`
- [ ] **Task 05** — Feature: Move note (drag)
  - Spec: `.speckit/artifacts/05-move-note.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(features/move-note): implement note drag-to-move`
- [ ] **Task 06** — Feature: Resize note (drag handle)
  - Spec: `.speckit/artifacts/06-resize-note.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(features/resize-note): implement note resize`
- [ ] **Task 07** — Feature: Trash zone (drag-to-remove)
  - Spec: `.speckit/artifacts/07-trash-zone.md`
  - Gates: `npm run typecheck && npm run test:run && npm run lint`
  - Commit: `feat(features/trash-note): implement drag-to-trash`

### Phase 2 — Bonus (optional, ordered by value/effort)
- [ ] **Bonus III** — localStorage persistence
  - Spec: `.speckit/artifacts/10-bonus-storage.md`
- [ ] **Bonus I** — Text editing
  - Spec: `.speckit/artifacts/08-bonus-text.md`
- [ ] **Bonus II** — Bring to front (z-index)
  - Spec: `.speckit/artifacts/09-bonus-zindex.md`
- [ ] **Bonus IV** — Note colors
  - Spec: `.speckit/artifacts/11-bonus-colors.md`
- [ ] **Bonus V** — Async REST mock
  - Spec: `.speckit/artifacts/12-bonus-api-mock.md`

---

## Gate Commands (copy-paste ready)
```bash
# Run all gates at once:
npm run typecheck && npm run test:run && npm run lint

# Individual gates:
npm run typecheck        # tsc --noEmit
npm run test:run         # vitest run (no watch)
npm run lint             # eslint

# Dev server:
npm run dev
```

---

## Git Workflow
```bash
# After human review of diff:
git add -p                    # stage selectively
git commit -m "feat(...): ..." 
git push origin main

# Check status:
git log --oneline -5
```

---

## Architecture Reference (quick mental model)

```
src/
├── app/              NoteContext (useReducer + Context)
├── entities/note/    Note type + noteReducer + NoteCard
├── features/
│   ├── create-note/  useCreateNote (double-click → ADD)
│   ├── move-note/    useMoveNote (useDrag → MOVE)
│   ├── resize-note/  useResizeNote (useDrag → RESIZE)
│   └── trash-note/   useTrashZone (pointer-overlap → REMOVE)
├── shared/
│   ├── lib/          useDrag, NoteRepository, LocalStorageNoteRepository
│   └── ui/           TrashZone
└── pages/board/      BoardPage (composition root)
```

**Layer rule**: `pages → features → entities → shared` (no upward imports)
**Barrel rule**: always import from `index.ts`, never from internal paths

---

## Notes for Review Session
- [ ] Architecture description written (2-3 paragraphs, in English)
- [ ] README updated with build instructions
- [ ] All test gates pass on clean checkout
- [ ] Manual browser test: Chrome, Firefox, Edge
