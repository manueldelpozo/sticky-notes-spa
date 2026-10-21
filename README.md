# Sticky Notes SPA

A responsive, accessible, zero-dependency Sticky Notes Single Page Application built with **React 18**, **TypeScript 5 (Strict)**, **Vite 5**, and **CSS Modules**.

Developed following **Feature-Sliced Design (FSD-lite)** principles and a rigorous **Spec-Driven Development** workflow.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- **Node.js**: `v18.0.0` or higher (recommended: `v20+` or `v22`)
- **Package Manager**: `npm` (v9+)

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/manueldelpozo/sticky-notes-spa.git
   cd sticky-notes-spa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 🛠 Available Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR at `http://localhost:5173` |
| `npm run build` | Typechecks and compiles production bundle into `dist/` |
| `npm run preview` | Locally serves the production build from `dist/` |
| `npm run typecheck` | Runs `tsc --noEmit` across strict TypeScript configs |
| `npm run test:run` | Runs all 76 unit and integration tests via Vitest (single pass) |
| `npm test` | Runs Vitest in interactive watch mode |
| `npm run lint` | Lints codebase with ESLint 9 (0 errors, 0 warnings) |

### Verification Gate (All Checks at Once)
Run the project's inviolable pre-commit gate:
```bash
npm run build && npm run typecheck && npm run test:run && npm run lint
```

---

## ✨ Features

### Core Requirements
- **Create Notes**: Double-click on any empty area of the canvas board to create a new sticky note with auto-generated coordinates and unique ID.
- **Move Notes**: Drag the top header of any note to reposition it anywhere on the canvas. Uses native `PointerEvent` with threshold detection (prevents accidental displacement on click).
- **Resize Notes**: Drag the bottom-right corner handle to resize notes with real-time feedback and minimum dimension clamping (`120px × 100px`).
- **Drag-to-Delete (Trash Zone)**: Drop zone in the bottom-right corner. Automatically highlights when a note is dragged over it; releasing the note over the trash zone deletes it.

### Bonus Features
- **Bonus I: Text Editing**: Click directly into the note textarea to write and edit note content. Event isolation prevents accidental dragging while highlighting or typing.
- **Bonus II: Bring to Front (Z-Index)**: Clicking or dragging any note dynamically elevates its `zIndex` above all other notes on the board.
- **Bonus III: LocalStorage Persistence**: Notes automatically persist to `localStorage` via a debounced auto-save mechanism (`300ms`) and rehydrate on page load.
- **Bonus IV: Note Color Palette**: Each note features a 4-color palette swatch in the header (`yellow`, `pink`, `blue`, `green`). Switching colors immediately updates the note's CSS custom property theme.
- **Bonus V: Async REST Mock**: Demonstrates the Repository Pattern. Includes `MockNoteRepository` with configurable latency simulating an asynchronous REST backend API (`loadNotes`, `saveNotes`).

---

## 🏗 Architecture & Design Patterns

The codebase strictly follows **Feature-Sliced Design (FSD-lite)** hierarchy and clean separation of concerns:

```
src/
├── app/                  # Application composition root, Providers & Context
│   ├── NoteProvider.tsx  # State provider (useReducer + hydration + auto-save)
│   └── noteContext.ts    # React Context definition & useNotes consumer hook
├── pages/                # Composite page layer
│   └── board/            # BoardPage canvas layout, grid & note composition
│       └── components/   # Page-specific components (e.g., BoardNoteCard)
├── features/             # User interaction slices (independently testable)
│   ├── create-note/      # Canvas double-click note creation logic
│   ├── move-note/        # Drag-to-reposition engine integration
│   ├── resize-note/      # Drag handle resize logic with size constraints
│   └── trash-note/       # Trash zone hover detection & drop-to-delete
├── entities/             # Business domain entities
│   └── note/             # Note model, reducer, types, NoteCard UI & Repositories
│       ├── model/        # Types, immutable noteReducer, NoteRepository interface
│       ├── ui/           # Pure presentational NoteCard & CSS Modules
│       └── lib/          # LocalStorageNoteRepository & MockNoteRepository
└── shared/               # Reusable infrastructure (no business logic)
    ├── lib/              # Native PointerEvent useDrag engine hook
    └── ui/               # Presentational TrashZone component
```

### Key Architectural Decisions

1. **Strict Layer Hierarchy**:
   - `pages → features → entities → shared`
   - Upward imports are strictly forbidden.
   - Cross-slice imports within the same layer (e.g. `features/move-note` importing from `features/trash-note`) are forbidden; composition is handled cleanly in `pages/board`.
   - Every slice exports its public API exclusively via its root `index.ts` barrel.

2. **Native PointerEvent Drag Engine (`useDrag`)**:
   - Zero external drag-and-drop libraries (`dnd-kit`, `react-beautiful-dnd`, etc.).
   - Utilizes native `PointerEvent` and `setPointerCapture` / `releasePointerCapture` for unified mouse, touch, and stylus support across desktop and mobile.
   - Threshold detection (default `3px`) distinguishes deliberate drags from simple clicks.

3. **Repository Pattern (Storage Abstraction)**:
   - `NoteRepository` provides an asynchronous interface: `loadNotes(): Promise<readonly Note[]>` and `saveNotes(notes): Promise<void>`.
   - `LocalStorageNoteRepository`: Validates note schemas and protects against corrupt JSON.
   - `MockNoteRepository`: Demonstrates the Open/Closed and Liskov Substitution principles by allowing the app to switch from local storage to a simulated remote API backend without touching components.

4. **Fast Refresh & React Component Guardian**:
   - Context definitions are separated from Provider components (`noteContext.ts` vs `NoteProvider.tsx`) to guarantee Vite Fast Refresh (HMR) never drops component state.
   - All wrapper components use `PropsWithChildren<P>`.
   - Explicit parameter naming conventions (`event`, `error`) and direct inline type imports.

---

## 🧪 Testing Suite

Tests are implemented with **Vitest** and **React Testing Library**:

- **Total Test Suites**: 12 files
- **Total Tests**: 76 tests (100% passing)
- **Coverage**:
  - `noteReducer.test.ts`: 20 unit tests covering every action and immutability.
  - `useDrag.test.ts`: 8 tests covering threshold, delta accumulation, pointer capture, and cleanup.
  - `LocalStorageNoteRepository.test.ts`: 7 tests covering persistence, corrupted data recovery, and schema validation.
  - `MockNoteRepository.test.ts`: 3 tests verifying async delays with fake timers.
  - `NoteCard.test.tsx`: 7 tests verifying text editing, swatches, drag isolation, and resize handle.
  - `useCreateNote.test.tsx`, `useMoveNote.test.tsx`, `useResizeNote.test.tsx`, `useTrashZone.test.tsx`: Isolated feature hook tests.
  - `BoardPage.test.tsx`: Integration tests verifying board double-click creation, drag-to-delete, note elevation, and swatch clicks.

To run tests:
```bash
npm run test:run
```

---

## 📄 License

MIT © [Manuel del Pozo](https://github.com/manueldelpozo)
