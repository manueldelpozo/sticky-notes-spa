# Feature-Sliced Design (FSD) Architecture Guardian & Instructions
# File: .agents/rules/fsd-architecture.instructions.md

These instructions are mandatory for all architectural decisions, directory structures, and imports in this project.

---

## 1. Layer Hierarchy (Strict Top-Down Dependency Rule)

The project follows the standard Feature-Sliced Design (FSD) hierarchy:

```
app        → (composition root, global providers, routing)
pages      → (full page views composed of features, entities, shared)
widgets    → (optional composite blocks)
features   → (user interactions and business capabilities)
entities   → (domain models, domain UI, entity state)
shared     → (agnostic reusable components, utilities, design tokens)
```

### 1.1 Permitted Layer Dependencies
- `app` may import from `pages`, `features`, `entities`, `shared`
- `pages` may import from `features`, `entities`, `shared`
- `features` may import from `entities`, `shared`
- `entities` may import only from `shared`
- `shared` may never import from upper layers

### 1.2 Forbidden Cross-Imports
- Slices in the **same layer** must NEVER import directly from each other (e.g., `features/create-note` must NOT import from `features/move-note`).
- If features need to collaborate, pass state or callbacks down from the `page` or elevate shared contracts to an `entity` or `shared`.

---

## 2. Slice Segment Structure

Every slice inside `features/*`, `entities/*`, `pages/*`, and `shared/*` must be organized into standardized **segments** by technical role:

```
src/features/<feature-name>/
├── components/    # (or ui/) React presentational & container components
├── hooks/         # Custom React hooks containing the feature interaction logic
├── constants/     # Configuration values, default dimensions, thresholds
├── model/         # State, types, reducers, or actions specific to this slice
├── lib/           # Pure utility and calculation functions
└── index.ts       # Mandatory slice public API barrel
```

### Segment Rules:
1. **Never place loose implementation files directly in the slice root**:
   - ❌ `src/features/create-note/useCreateNote.ts`
   - ✅ `src/features/create-note/hooks/useCreateNote.ts`
2. **Co-locate tests with the segment item they test**:
   - `hooks/useCreateNote.test.tsx` next to `hooks/useCreateNote.ts`
   - `model/noteReducer.test.ts` next to `model/noteReducer.ts`
3. **Constants in dedicated segment**:
   - Default dimensions, limits, colors, and configuration live in `constants/` (e.g. `constants/noteDefaults.ts`).

---

## 3. Public API Barrel Rule (`index.ts`)

1. **One Barrel per Slice**: Every slice directory MUST have a single root `index.ts` file that acts as the public boundary for that slice.
2. **Never import internal segment paths from outside the slice**:
   - ✅ `import { useCreateNote, DEFAULT_NOTE_SIZE } from '@/features/create-note'`
   - ❌ `import { useCreateNote } from '@/features/create-note/hooks/useCreateNote'`
   - ❌ `import { DEFAULT_NOTE_SIZE } from '@/features/create-note/constants/noteDefaults'`
3. **No Internal Barrels**: Do NOT create nested `index.ts` files inside segments (e.g. `hooks/index.ts` is forbidden). Keep the barrel only at the slice root.
4. **Use Explicit Type Exports**:
   ```ts
   export { useCreateNote } from './hooks/useCreateNote'
   export type { UseCreateNoteReturn } from './hooks/useCreateNote'
   export { DEFAULT_NOTE_SIZE } from './constants/noteDefaults'
   ```

---

## 4. Architectural Verification Checklist

Before completing any task, the FSD Architecture Guardian verifies:
- [ ] No upward imports (e.g. `shared` importing from `features`).
- [ ] No cross-slice imports within the same layer.
- [ ] All files inside the slice reside inside a designated segment (`components/`, `hooks/`, `constants/`, `model/`, `ui/`, `lib/`).
- [ ] Slice root only contains segment directories and the single public API `index.ts`.
- [ ] All external consumers import exclusively from the slice root barrel `index.ts`.
