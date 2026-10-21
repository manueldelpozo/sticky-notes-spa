# Task 03 — Drag Engine: `useDrag` Hook
## Status: ✅ COMPLETE

---

## Objective
Implement the shared, reusable `useDrag` hook using the native `PointerEvent` API.
This hook is the ONLY place pointer math lives — all drag features consume it.

---

## Why PointerEvent over MouseEvent?
- Unifies mouse, pen, and touch (future-proof)
- `setPointerCapture` keeps tracking even if cursor leaves the element
- Better cross-browser behavior for drag interactions

---

## Files to Create

### `src/shared/lib/useDrag.ts`

#### Interface:
```ts
interface DragState {
  isDragging: boolean
  deltaX: number
  deltaY: number
}

interface UseDragOptions {
  onDragStart?: (e: PointerEvent) => void
  onDragMove?: (delta: { dx: number; dy: number }, e: PointerEvent) => void
  onDragEnd?: (e: PointerEvent) => void
  /** Minimum pixel movement before drag is recognized (default: 3) */
  threshold?: number
}

interface UseDragReturn {
  isDragging: boolean
  handlePointerDown: (e: React.PointerEvent) => void
}

function useDrag(options: UseDragOptions): UseDragReturn
```

#### Implementation requirements:
1. On `pointerdown`:
   - Record `startX`, `startY`
   - Add `pointermove` and `pointerup` listeners to `window` (NOT the element)
   - Call `e.currentTarget.setPointerCapture(e.pointerId)` to capture pointer

2. On `pointermove`:
   - If not past threshold yet, check distance; if past, call `onDragStart`
   - Compute `dx = current.clientX - prev.clientX` (DELTA, not absolute position)
   - Call `onDragMove({ dx, dy })`

3. On `pointerup` / `pointercancel`:
   - Call `onDragEnd`
   - Remove listeners
   - Set `isDragging = false`

4. Cleanup: remove listeners on component unmount (useEffect cleanup)

5. `handlePointerDown` must call `e.preventDefault()` to prevent text selection

#### IMPORTANT: Delta vs Absolute
The hook reports **incremental deltas** (`dx`, `dy`) per move event, NOT absolute
positions. Consumers accumulate deltas into state. This is more composable.

### `src/shared/lib/useDrag.test.ts`
Test with `renderHook` + `@testing-library/user-event` or manual pointer events:
- Returns `isDragging: false` initially
- `handlePointerDown` triggers drag start after threshold
- `onDragMove` receives correct deltas
- Cleanup removes window listeners (mock `window.addEventListener`)

### `src/shared/lib/index.ts` (barrel)
```ts
export { useDrag } from './useDrag'
export type { UseDragOptions } from './useDrag'
```

---

## Test Gates
```bash
npm run typecheck
npm run test:run      # useDrag tests pass
npm run lint
```

## Commit Message
```
feat(shared/lib): implement useDrag hook with PointerEvent API
test(shared/lib): add useDrag unit tests
```

## Notes
- Do NOT use `onMouseDown`/`onMouseMove` — use `PointerEvent` throughout
- The hook must be completely stateless from the consumer's perspective
- Test the hook in isolation; features will be tested in their own specs
