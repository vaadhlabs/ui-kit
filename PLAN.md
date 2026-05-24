# UI Kit — Phase Plan

This document tracks the phased roadmap for the `@tensorcost/ui-kit` standalone repo.
Each phase has a scope, the files it touches, and a concrete definition of done.

---

## Phase 0 — Repo extraction and scaffold (this commit)

**Scope.** Pull the ui-kit out of the tensorcost monorepo with full git history, restructure
into a three-package pnpm workspace, wire up tooling, and get CI green.

**Files touched.**
- `packages/react/` — all source from `apps/tensorcost/packages/ui-kit/`, package.json
  updated for tsup dual output and publishConfig
- `packages/tokens/` — stub with TODO src/index.ts
- `packages/slides/` — stub with TODO src/index.ts
- `apps/storybook/` — minimal `@storybook/react-vite 8` scaffold, no stories yet
- `brand/` — logos copied from `usage-app/logos/`
- Root: `pnpm-workspace.yaml`, `tsconfig.base.json`, `tsconfig.json`,
  `eslint.config.js`, `prettier.config.cjs`, `.changeset/config.json`,
  `.github/workflows/ci.yml`

**Definition of done.** `pnpm typecheck`, `pnpm test` (201 tests), `pnpm build`, and
`pnpm storybook` all pass locally. CI workflow committed.

---

## Phase 1 — Tokens package

**Scope.** Extract the color palette, spacing scale, and typography constants from
`packages/react/src/theme.ts` and `packages/react/src/tone.ts` into
`@tensorcost/tokens`. The tokens package must have zero React or MUI dependencies so
non-React consumers (the marketing site, the slides pipeline) can import it.

Add `@tensorcost/tokens` as a dependency of `@tensorcost/ui-kit` and wire `theme.ts`
to import from tokens rather than defining values inline.

**Files touched.** `packages/tokens/src/`, `packages/react/src/theme.ts`,
`packages/react/src/tone.ts`, `packages/react/package.json`.

**Definition of done.** `pnpm --filter @tensorcost/tokens build` produces a clean dist.
`packages/react` test suite still passes. `packages/react/src/theme.ts` imports from
`@tensorcost/tokens` with no inlined duplicates.

---

## Phase 2 — MUI 7 migration

**Scope.** Bump `@mui/material` and `@mui/icons-material` peerDependencies from `^5.16`
to `^7.x`. Audit every component for the known MUI 6→7 breaking changes (Grid v2,
sx prop type narrowing, color prop changes on Typography and Button, emotion-based
styled changes). Update tests and fix TypeScript errors.

**Files touched.** `packages/react/package.json`, most files under
`packages/react/src/`.

**Definition of done.** All tests pass against MUI 7 devDependencies. No `any` casts
added to work around the bump. TypeScript strict mode clean.

---

## Phase 3 — Port component-library into ui-kit

**Scope.** The tensorcost `websites/component-library/` package contains an older set
of components that overlaps partially with `@tensorcost/ui-kit`. Audit the delta,
port the unique pieces into `packages/react/src/`, deprecate or delete duplicates, and
update any consumers.

**Files touched.** `packages/react/src/` (new components), `packages/react/src/index.ts`.

**Definition of done.** Every exported symbol from the old component-library has either
a direct counterpart in `@tensorcost/ui-kit` or a documented deprecation. Coverage
thresholds still met.

---

## Phase 4 — Storybook stories + GH Pages deploy

**Scope.** Write at least one story per exported component in `packages/react/src/`.
Configure `apps/storybook` with a MUI ThemeProvider decorator so components render with
the TensorCost theme. Add a GH Actions workflow that publishes the built Storybook to
GH Pages on every push to main.

**Files touched.** `packages/react/src/*.stories.tsx`, `apps/storybook/.storybook/preview.ts`,
`.github/workflows/pages.yml`.

**Definition of done.** `pnpm build-storybook` exits 0. Every exported component has
at least a default story. GH Pages URL is accessible.

---

## Phase 5 — Slides package

**Scope.** Implement the React-to-image pipeline in `packages/slides/`. The primary
use case is rendering TensorCost data visualisations (metric cards, charts) to PNG
frames that a Node script assembles into a PowerPoint template for the marketing team.

The implementation uses `@vercel/satori` for SVG rendering and `sharp` for PNG
conversion. The package must work in a Node 20 server environment with no browser
dependency.

**Files touched.** `packages/slides/src/`, `packages/slides/package.json`.

**Definition of done.** `pnpm --filter @tensorcost/slides build` clean. At least one
integration test renders a MetricCard-equivalent component to a PNG and asserts
pixel dimensions. Node-only — no jsdom or browser globals in the test environment.
