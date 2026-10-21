# Technical Architecture Plan: Sticky Notes SPA

> **Plan Document (`plan.md`)**  
> Architecture: Feature-Sliced Design (FSD)  
> Stack: Vite 5 + React 18 + TypeScript 5 (Strict) + Vitest 2 + CSS Modules

---

## 1. Architecture: Feature-Sliced Design (FSD)

### 1.1 Layer Hierarchy
Strict unidirectional dependency order:
```
app        → (Bootstrap, NoteProvider, global styles)
pages      → (BoardPage composition root)
features   → (create-note, move-note, resize-note, trash-note)
entities   → (note model & NoteCard component)
shared     → (useDrag engine, UI primitives, tokens)
```

**Inviolable Rules**:
1. Lower layers cannot import from upper layers (`shared` never imports from `features`).
2. Cross-slice imports within the same layer are strictly forbidden.
3. Every slice exposes a single public barrel `index.ts`. All external imports must target the slice barrel.

### 1.2 Slice Segment Structure (FSD Segments)
Every slice is structured into standard functional segments:
```
src/
├── app/
│   ├── NoteProvider.tsx       # State provider
│   ├── noteContext.ts         # React Context and useNotes guard
│   ├── App.tsx                # App root
│   └── index.ts               # Barrel
├── pages/
│   └── board/
│       ├── BoardPage.tsx      # Canvas layout
│       ├── BoardPage.module.css
│       ├── BoardPage.test.tsx
│       └── index.ts
├── features/
│   ├── create-note/
│   │   ├── hooks/             # useCreateNote.ts & tests
│   │   ├── constants/         # noteDefaults.ts
│   │   └── index.ts           # Barrel
│   ├── move-note/
│   │   ├── hooks/             # useMoveNote.ts & tests
│   │   └── index.ts           # Barrel
│   ├── resize-note/
│   │   ├── hooks/             # useResizeNote.ts & tests
│   │   ├── constants/         # resizeLimits.ts
│   │   └── index.ts           # Barrel
│   └── trash-note/
│       ├── hooks/             # useTrashZone.ts & tests
│       └── index.ts           # Barrel
├── entities/
│   └── note/
│       ├── model/             # types.ts, noteReducer.ts & tests
│       ├── ui/                # NoteCard.tsx & NoteCard.module.css
│       └── index.ts           # Barrel
└── shared/
    ├── lib/                   # useDrag.ts & tests, repositories
    ├── ui/                    # TrashZone.tsx & styles
    └── index.ts
```

---

## 2. React TypeScript Component Guardian Standard

- **`PropsWithChildren<P>`**: Mandatory for all components and test wrappers accepting children (`type ProviderProps = PropsWithChildren<{ ... }>`).
- **No `React.FC`**: All components written as standard exported named function components.
- **Fast Refresh (HMR) Separation**: Context definitions and hooks (`noteContext.ts`) are separated from component providers (`NoteProvider.tsx`).
- **Inline Type Imports**: Combine values and types on single import statements:
  `import { useState, type PointerEvent as ReactPointerEvent } from 'react'`.
- **Explicit Parameter Naming**: Event handlers use `event` and catch blocks use `error` (never single-letter `e` or `err`).

---

## 3. Data Contracts & State Architecture

### 3.1 Domain Models (`src/entities/note/model/types.ts`)
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

### 3.2 Reducer Actions (Discriminated Union)
```ts
export type NoteAction =
  | { type: 'ADD'; payload: CreateNoteParams }
  | { type: 'MOVE'; id: string; position: Position }
  | { type: 'RESIZE'; id: string; size: Size }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_TEXT'; id: string; text: string }
  | { type: 'BRING_TO_FRONT'; id: string }
  | { type: 'SET_COLOR'; id: string; color: NoteColor }
  | { type: 'SET_ALL'; notes: readonly Note[] }
```

---

## 4. Drag Engine (`src/shared/lib/useDrag.ts`)

- Centralized Pointer Math: The only place pointer calculations live.
- Uses `setPointerCapture` / `releasePointerCapture` on native `PointerEvent`.
- Threshold detection (default: 3px movement) before activating `onDragStart`.
- Emits incremental deltas `{ dx, dy }` to `onDragMove` for composable accumulation.
- Full event cleanup on unmount or drag completion.

---

## 5. Test Gates & Verification

Before committing any task, all three gates must succeed:
```bash
npm run typecheck    # tsc --noEmit — 0 errors
npm run test:run     # vitest run — 100% test pass
npm run lint         # eslint — 0 errors, 0 warnings
```
