# SpecKit Constitution — sticky-notes-spa

> These rules are INVIOLABLE. Every task artifact must conform to them.
> If a task would violate a rule, escalate before implementing.

---

## 1. Architecture Principles

### 1.1 Layer Hierarchy (FSD-lite)
Layers in strict dependency order (lower layers cannot import from upper layers):

```
pages → features → entities → shared
app   → (may import from all)
```

**Permitted imports:**
- `pages/*` → `features/*`, `entities/*`, `shared/*`
- `features/*` → `entities/*`, `shared/*`
- `entities/*` → `shared/*`
- `shared/*` → (only external libraries or other `shared/*`)

**Forbidden imports** (enforced by code review, future ESLint rule):
- `shared` must NEVER import from `features`, `entities`, or `pages`
- `entities` must NEVER import from `features` or `pages`
- Cross-slice imports within the same layer are FORBIDDEN

### 1.2 Public API Barrel Rule
Every layer slice MUST expose a single `index.ts` as its public API.
Consumers MUST import from the barrel, never from internal paths.

```ts
// ✅ correct
import { Note } from '@/entities/note'

// ❌ forbidden
import { Note } from '@/entities/note/model/types'
```

### 1.3 Component Purity
- React components are pure presentational or smart-container; never mixed.
- No component fetches data directly or owns reducer logic.
- Business logic lives in `model/` subdirectories or `shared/lib/`.

### 1.4 Slice Segment Structure (FSD Segments)
Every slice inside `features/*`, `entities/*`, `pages/*`, and `shared/*` must organize internal files into designated segments:
- `components/` (or `ui/`): Presentational and container UI elements.
- `hooks/`: Custom React hooks embodying user interactions.
- `constants/`: Configuration values, default sizes, thresholds.
- `model/`: State reducers, action unions, domain interfaces.
- `lib/`: Pure calculation and utility helpers.
Loose implementation files directly in the slice root are FORBIDDEN; only the public barrel `index.ts` lives at the slice root.
Enforced by the FSD Architecture Guardian: [.agents/rules/fsd-architecture.instructions.md](../.agents/rules/fsd-architecture.instructions.md).

---

## 2. TypeScript Rules

### 2.1 Strict Mode
`tsconfig.app.json` has `"strict": true` plus:
- `noImplicitReturns`
- `noUnusedLocals`, `noUnusedParameters`
- `exactOptionalPropertyTypes`

These settings MUST remain enabled. Never downgrade them.

### 2.2 No `any`
Using `any` is forbidden. Use `unknown` with type guards, or precise types.
Exception: third-party library stubs only, with an explanatory comment.

### 2.3 Discriminated Unions for Actions
Reducer actions MUST use discriminated unions:
```ts
type NoteAction =
  | { type: 'ADD'; payload: CreateNoteParams }
  | { type: 'MOVE'; id: string; position: Position }
  | { type: 'REMOVE'; id: string }
```

### 2.4 Read-only State
State objects MUST be typed as `Readonly<T>` or use `as const`.
Reducers must return new objects, never mutate.

---

## 3. Testing Rules

### 3.1 Test Gates (REQUIRED before every commit)
Each task artifact defines a set of test gates. ALL gates must pass:

```
npm run typecheck    # tsc --noEmit — zero errors
npm run test:run     # vitest run — zero failures
npm run lint         # eslint — zero errors
```

### 3.2 Unit Test Coverage Requirements
- **Pure functions** (reducers, lib utilities): 100% branch coverage
- **Hooks**: test with `renderHook` from `@testing-library/react`
- **Components**: test user-visible behavior, not implementation details
- Test files co-located: `model/noteReducer.test.ts` next to `model/noteReducer.ts`

### 3.3 Test Naming Convention
```ts
describe('noteReducer', () => {
  describe('ADD action', () => {
    it('adds a note with the given position and size', () => { ... })
    it('generates a unique id for each note', () => { ... })
  })
})
```

### 3.4 No Implementation Details
Tests MUST NOT:
- Assert on internal state shape directly
- Test private functions
- Import internal paths (use barrel exports)

---

## 4. Code Style

### 4.1 Comments
Leave ONLY comments that add considerable reading value.
Self-documenting code is preferred over explanatory comments.
Comments MUST be in English.

### 4.2 File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Types/interfaces: `PascalCase` (in `types.ts` or inline)
- Reducers: `camelCaseReducer.ts`
- Test files: `*.test.ts` or `*.test.tsx`

### 4.3 CSS Modules
All component styles use CSS Modules (`Component.module.css`).
CSS custom properties defined in `:root` for design tokens.
No inline styles except for dynamic values (position, size from state).

### 4.4 No External UI Libraries
Assessment requirement: no readymade component libraries.
Only allowed external packages: React, Vite, Vitest, TypeScript, ESLint.

### 4.5 React TypeScript Component Guardian
Components accepting children MUST use `PropsWithChildren<P>`.
Do NOT declare `children: ReactNode` or use `React.FC`.
Detailed guidelines in [.agents/rules/react-typescript.instructions.md](../.agents/rules/react-typescript.instructions.md).

---

## 5. Feature Requirements

### 5.1 Mandatory Features (implement ≥3 of 4)
1. **Create** — new note at specified position with specified size
2. **Resize** — change note size by dragging
3. **Move** — move note by dragging
4. **Trash** — remove note by dragging it over a trash zone

### 5.2 Drag System
All drag interactions use the native `PointerEvent` API (not mouse events).
A single `useDrag` hook in `shared/lib/` handles pointer capture and delta computation.
Features consume `useDrag` and dispatch domain actions — they do NOT compute their own pointer math.

### 5.3 Browser Compatibility
Chrome (Win + Mac), Firefox, Edge — latest versions.
Minimum resolution: 1024×768.
No mobile/touch-specific code needed.

---

## 6. Git Workflow

### 6.1 Commit Convention
```
<type>(<scope>): <short description>

feat(entities/note): add NoteCard component with drag handle
test(entities/note): add reducer unit tests for ADD and REMOVE
refactor(shared/lib): extract useDrag hook
```

Types: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`

### 6.2 One Task = One Commit
Each speckit artifact corresponds to one Git commit.
Human review happens BEFORE `git push`.

---

## 7. SpecKit Task Lifecycle

```
1. READ   → Read the artifact spec fully before touching code
2. PLAN   → Identify all files to create/modify
3. BUILD  → Implement incrementally
4. GATE   → Run: typecheck + test:run + lint
5. REVIEW → Human reviews diff locally
6. COMMIT → git commit -m "feat(...): ..."
7. PUSH   → git push origin main
```

**DO NOT push before human review.**
**DO NOT skip gates.**
