# Task 00 — Project Setup & Configuration
## Status: ✅ COMPLETE (scaffolded by guide)

---

## Objective
Bootstrap the project with all configuration files, directory structure, and CI-ready tooling.

## Deliverables

### Files to create/modify:
- [x] `vite.config.ts` — path aliases, vitest inline config
- [x] `tsconfig.app.json` — strict mode + path aliases
- [x] `package.json` — scripts: `test`, `test:run`, `test:ui`, `typecheck`
- [x] `src/test/setup.ts` — jest-dom import
- [x] `.speckit/constitution.md`
- [x] `.speckit/prompt.md`
- [x] `.speckit/artifacts/` — all task specs

### Directory structure:
```
src/
├── app/
├── entities/note/{ui,model}/
├── features/{create-note,move-note,resize-note,trash-note}/
├── shared/{lib,types,ui}/
├── pages/board/
└── test/
```

## Gate Results
- [x] `npm run typecheck` — passes
- [x] `npm run test:run` — passes (no tests yet)
- [x] `npm run lint` — passes

## Notes
- Vite 5 used (pinned for Vitest 2 compatibility)
- React 18, TypeScript 5 strict
- `@/` alias resolves to `src/`
