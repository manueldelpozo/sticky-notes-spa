# Feature Specification: Sticky Notes SPA

> **Specification Document (`spec.md`)**  
> Project: `sticky-notes-spa` (Recruitment Assessment for tempo.io)  
> Status: In Progress (Phase 1 Core)

---

## 1. Overview & Problem Statement

Build an interactive, responsive single-page sticky notes board application in React and TypeScript.
The application allows users to create, organize, reposition, resize, and remove digital sticky notes on a canvas without external UI libraries.

---

## 2. User Stories & Acceptance Criteria

### Phase 1 — Core Requirements (Mandatory)

#### US-1: Create Note
- **As a user**, I want to create a new sticky note anywhere on the board by double-clicking on an empty area of the canvas.
- **Acceptance Criteria**:
  - Double-clicking on empty canvas creates a new note positioned exactly at the click coordinates relative to the board.
  - Default size: width `200px`, height `180px`.
  - Default color: `'yellow'`.
  - Double-clicking on existing note cards or interactive controls (e.g. trash zone) MUST NOT create a new note.

#### US-2: Move Note (Drag to Reposition)
- **As a user**, I want to drag a note by its header across the canvas to reposition it.
- **Acceptance Criteria**:
  - Dragging the header of a note moves the card smoothly across the board following the pointer.
  - While dragging begins, the dragged note is brought to the top (highest `zIndex`).
  - Text selection is disabled during drag.
  - Releasing pointer drops the note in its new coordinates.

#### US-3: Resize Note (Corner Drag Handle)
- **As a user**, I want to resize a note by dragging its bottom-right handle.
- **Acceptance Criteria**:
  - Bottom-right corner provides a visible diagonal resize handle with `nwse-resize` cursor.
  - Dragging the handle expands or shrinks the note dynamically.
  - Enforces minimum dimensions: width `120px`, height `100px`.
  - Resizing does not trigger moving or dragging of the card position.

#### US-4: Trash Zone (Drag to Delete)
- **As a user**, I want to delete a note by dragging it over a designated trash zone.
- **Acceptance Criteria**:
  - Trash zone is positioned in the bottom-right corner of the viewport.
  - When a note is dragged over the trash zone, the zone visually highlights (e.g., active red border and accent glow).
  - Releasing pointer over the trash zone deletes the note from state.
  - Releasing pointer outside the trash zone retains the note.

---

### Phase 2 — Bonus Capabilities (Enhancements)

#### US-5: Inline Text Editing (Bonus I)
- **As a user**, I want to click inside a note's body and type notes into a textarea.
- **Acceptance Criteria**: Text input is isolated from drag events and updates note state via `UPDATE_TEXT`.

#### US-6: Bring to Front (Bonus II)
- **As a user**, I want clicking a note to bring it in front of overlapping notes.
- **Acceptance Criteria**: Clicking or initiating drag sets note `zIndex = max(zIndex) + 1`.

#### US-7: LocalStorage Persistence (Bonus III)
- **As a user**, I want notes to persist across browser reloads.
- **Acceptance Criteria**: Hydrates initial state from `localStorage` on load; debounces or syncs state updates to storage.

#### US-8: Note Color Palette (Bonus IV)
- **As a user**, I want to change the color of a note.
- **Acceptance Criteria**: Note header displays color swatches (`yellow`, `pink`, `blue`, `green`). Clicking a swatch updates note color immediately.

#### US-9: Async Mock API (Bonus V)
- **As an evaluator**, I want to see an asynchronous REST mock repository with realistic latency and error handling.
- **Acceptance Criteria**: Abstract repository interface (`NoteRepository`) implemented with artificial delay.

---

## 3. Non-Functional Requirements

- **Zero External UI Kits**: Built with native HTML5, CSS Modules, and React primitives (no MUI, Tailwind, Bootstrap, etc.).
- **Strict TypeScript**: TypeScript 5.6+ in strict mode (`noImplicitReturns`, `noUnusedLocals`, `exactOptionalPropertyTypes`). Zero type errors.
- **Touch & Pointer Parity**: Drag interactions implemented exclusively with native `PointerEvent` API (`setPointerCapture`) for mouse, pen, and touch support.
- **Design & Aesthetics**: Premium dark-mode board canvas with subtle dot grid, vibrant note palettes, fluid micro-transitions, and 60fps drag performance.
