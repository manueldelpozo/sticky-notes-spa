# Sticky Notes SPA — Agent Guidelines

All agentic pair-programming and code modifications must conform to:

1. **Constitution & Architecture Principles**: [.speckit/constitution.md](.speckit/constitution.md)
   - FSD-lite layer hierarchy: `pages → features → entities → shared`
   - Barrel export rule: always import from layer slice `index.ts`
   - Gates before commit: `npm run typecheck && npm run test:run && npm run lint`

2. **React TypeScript Component Guardian**: [.agents/rules/react-typescript.instructions.md](.agents/rules/react-typescript.instructions.md)
   - Always use `PropsWithChildren<P>` for components and wrappers accepting children.
   - Avoid `React.FC` / `React.FunctionComponent`.
   - Separate Context/Hooks from Provider components to preserve Fast Refresh HMR.
   - Strict typing for all events and domain models.
