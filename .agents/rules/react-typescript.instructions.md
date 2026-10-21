# React TypeScript Component Guardian & Instructions
# File: .agents/rules/react-typescript.instructions.md

These instructions are mandatory for all React + TypeScript components and hooks across the project.

---

## 1. Component Typing & Props

### 1.1 Use `PropsWithChildren<P>`
When a component accepts `children`, do NOT manually declare `children: ReactNode` or `children?: ReactNode`.
Always use React's built-in `PropsWithChildren<P>` utility type:

```tsx
// ✅ Correct
import type { PropsWithChildren } from 'react'

type NoteProviderProps = PropsWithChildren<{
  initialNotes?: readonly Note[]
}>

export function NoteProvider({ children, initialNotes = [] }: NoteProviderProps) { ... }

// ❌ Incorrect
interface NoteProviderProps {
  children: ReactNode
  initialNotes?: readonly Note[]
}
```

### 1.2 Do NOT use `React.FC` or `React.FunctionComponent`
Declare components as standard exported named functions with explicit prop types:

```tsx
// ✅ Correct
export function NoteCard({ note, onDragStart }: NoteCardProps) { ... }

// ❌ Incorrect
export const NoteCard: React.FC<NoteCardProps> = ({ note, onDragStart }) => { ... }
```

### 1.3 Strict Event Types
Always use precise native/synthetic event types:
- `ReactPointerEvent<HTMLElement>` for pointer drag/resize interactions.
- `ReactMouseEvent<HTMLElement>` for click/double-click interactions.
- `ChangeEvent<HTMLTextAreaElement>` or `HTMLInputElement` for form inputs.
- Never use generic `Event` or `any`.

### 1.4 Direct Type Imports & Inline Type Syntax
- Import specific React types directly instead of importing the entire namespace `import type React from 'react'`.
- Prefer combining runtime imports and type imports in the same `import` statement using inline type specifiers (`import { useState, type PointerEvent as ReactPointerEvent } from 'react'`) rather than separate import lines.

```tsx
// ✅ Correct
import { useState, useRef, useEffect, useCallback, type PointerEvent as ReactPointerEvent } from 'react'

export interface UseDragReturn {
  isDragging: boolean
  handlePointerDown: (e: ReactPointerEvent<HTMLElement>) => void
}

// ❌ Incorrect: do NOT import whole namespace or use separate import lines for types
import type React from 'react'
import { useState } from 'react'
```

### 1.5 Parameter & Variable Naming: `event` and `error`
- Name event parameters and handler variables explicitly as `event` instead of single-letter `e`.
- Name error objects in `catch` blocks or callbacks as `error` instead of `e` or `err`.

```tsx
// ✅ Correct
onPointerDown={(event) => event.stopPropagation()}
onDragStart?: (event: ReactPointerEvent) => void
try {
  target.setPointerCapture(pointerId)
} catch (error) {
  // handled
}

// ❌ Incorrect
onPointerDown={(e) => e.stopPropagation()}
onDragStart?: (e: ReactPointerEvent) => void
try { ... } catch (e) { ... }
```

---

## 2. Fast Refresh & File Structure

### 2.1 One Component Type per File
To ensure React Fast Refresh (HMR) operates without warnings:
- Component files (`*.tsx`) must only export React components.
- React Context objects (`createContext`) and custom hooks (`useNotes()`) must live in dedicated files (e.g. `noteContext.ts`), separate from the provider component (`NoteProvider.tsx`).
- Re-export everything cleanly via the slice's `index.ts` barrel.

---

## 3. Immutability & Readonly Types

### 3.1 Immutable Props and State
- Use `readonly` arrays: `readonly Note[]`, `Readonly<Note>`
- Never mutate state in reducers or component callbacks; return fresh copies using spread or functional helpers.
- Use discriminated union actions for reducers:
  ```ts
  export type NoteAction =
    | { type: 'ADD'; payload: CreateNoteParams }
    | { type: 'MOVE'; id: string; position: Position }
    | { type: 'REMOVE'; id: string }
  ```

---

## 4. Testing React Components & Hooks

### 4.1 Use `PropsWithChildren` in Test Wrappers
When defining test wrappers for `renderHook` or `render`:
```tsx
// ✅ Correct
const wrapper = ({ children }: PropsWithChildren) => (
  <NoteProvider>{children}</NoteProvider>
)
```

### 4.2 Query by User-Visible Roles / Attributes
- Prefer `screen.getByRole`, `screen.getByTestId`, or `screen.getByDisplayValue`.
- Avoid asserting on internal React state or private methods.
