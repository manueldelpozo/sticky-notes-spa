# Sticky Notes SPA — Agent Guidelines

All agentic pair-programming and code modifications must conform to:

1. **Constitution & Architecture Principles**: [.speckit/constitution.md](.speckit/constitution.md)
   - FSD layer hierarchy: `pages → features → entities → shared`
   - Barrel export rule: always import from layer slice `index.ts`
   - Gates before commit: `npm run typecheck && npm run test:run && npm run lint`

2. **FSD Architecture Guardian**: [.agents/rules/fsd-architecture.instructions.md](.agents/rules/fsd-architecture.instructions.md)
   - Standard slice segments: `components/` (or `ui/`), `hooks/`, `constants/`, `model/`, `lib/`.
   - Never place loose implementation files directly in the slice root; only the public barrel `index.ts` belongs at the root.
   - Forbid cross-slice imports within the same layer.
   - Consumers must import exclusively from slice root `index.ts`, never from internal segment paths.

3. **React TypeScript Component Guardian**: [.agents/rules/react-typescript.instructions.md](.agents/rules/react-typescript.instructions.md)
   - Always use `PropsWithChildren<P>` for components and wrappers accepting children.
   - Avoid `React.FC` / `React.FunctionComponent`.
   - Separate Context/Hooks from Provider components to preserve Fast Refresh HMR.
   - Strict typing for all events and domain models.
   - Direct inline type imports (`import { hook, type EventType } from 'react'`); avoid `import type React from 'react'`.
   - Name event and error parameters explicitly (`event`, `error`); never use single-letter `e` or `err`.
