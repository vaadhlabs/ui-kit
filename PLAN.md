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

## Phase 1 — Tokens package ✓ done 2026-05-24

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

**What landed.**

`packages/tokens/src/` now owns: `brand.ts` (`BrandTokens`, `BRAND_TOKENS_LIGHT`,
`BRAND_TOKENS_DARK`), `tone.ts` (`ToneKind`, `ToneTokens`, `TONE_LIGHT`, `TONE_DARK`),
`typography.ts` (`TYPOGRAPHY_TOKENS`), `css-vars.ts` (`buildCssVars`), `brand.json`
(JSON snapshot for non-TS consumers), and a full `index.ts`. Radius and motion tokens
stay inlined in `brand.ts` — both are <5 entries consumed only via the brand object,
and a separate file would add noise without benefit.

`packages/react/src/theme.ts` and `tone.ts` now import from `@tensorcost/tokens`; all
inline definitions are gone. Type names (`BrandTokens`, `ToneKind`, `ToneTokens`) are
re-exported from the React package so existing import sites don't need updating. The
`LIGHT`/`DARK` tone constants were renamed to `TONE_LIGHT`/`TONE_DARK` in the tokens
package to avoid collisions when tree-shaking multiple modules.

Two items intentionally left in `packages/react/` for later phases: the chart
allocation palette (`ALLOC_LIGHT`/`ALLOC_DARK`) and the workshop section tokens
(`SECTION_TOKENS_LIGHT`/`SECTION_TOKENS_DARK`). Both are MUI-adjacent or
workshop-specific and weren't in Phase 1 scope.

Test results: `@tensorcost/tokens` 51 passed; `@tensorcost/ui-kit` 201 passed (no
regressions). `pnpm typecheck` and `pnpm build` clean across the workspace.

---

## Phase 2 — MUI 7 migration ✓ done 2026-05-24

**Scope.** Bump `@mui/material` and `@mui/icons-material` peerDependencies from `^5.16`
to `^7.x`. Audit every component for the known MUI 6→7 breaking changes (Grid v2,
sx prop type narrowing, color prop changes on Typography and Button, emotion-based
styled changes). Update tests and fix TypeScript errors.

**Files touched.** `packages/react/package.json`, most files under
`packages/react/src/`.

**Definition of done.** All tests pass against MUI 7 devDependencies. No `any` casts
added to work around the bump. TypeScript strict mode clean.

**What landed.**

peerDep bumps: `@mui/material ^5.16.0 → ^7.0.0`, `@mui/icons-material ^5.16.0 → ^7.0.0`,
`@emotion/react ^11.13.0 → ^11.14.0`, `@emotion/styled ^11.13.0 → ^11.14.0`. Both
peerDependencies and devDependencies updated in `packages/react/package.json`. Storybook
app aligned to `@mui/material ^7` and `@emotion/* ^11.14`. MUI 7 ships React 19 type
definitions; runtime works fine with React 18 — no React version bump required.

JSX.Element sweep: 19 sites across 15 files replaced with `ReactElement` from "react".
`import type { ReactElement } from "react"` added where not already present. Option B
chosen over Option A (JSX namespace import) — MetricCard.tsx already used ReactElement,
so this is consistent with existing codebase convention.

Two sites missed by the audit: `theme.shape.borderRadius * 1.5` in `WorkflowCard.tsx`
and `theme.shape.borderRadius * 1.25` in `WorkshopCard.tsx` — MUI 7 widened
`shape.borderRadius` to `number | string`, making arithmetic a TS error. Fixed with
`Number(theme.shape.borderRadius)` wrappers. No `any` casts used.

`useMediaQuery { noSsr: true }` removed from `ThemeShellProvider.tsx`. The consuming
apps are CSR-only; the default behavior is fine.

`"@import"` key removed from `MuiCssBaseline.styleOverrides` in `theme.ts`. MUI 7
silently drops that undocumented key — the font stops loading in production with no
build error. Replaced with a comment block directing consumers to load JetBrains Mono
themselves. Documented in the README "Consumer setup" section (new subsection) and
wired up in `apps/storybook/.storybook/preview-head.html` so stories render the font.

Palette augmentations in `theme.ts` (brand) and `workshop-theme.ts` (workshop) verified
clean against v7 types — both are open-interface additions on field names MUI 7 doesn't
use natively. No changes required.

Test results: 252 passed (51 tokens + 201 react), all green, no regressions.
`pnpm build` exits 0. `pnpm build-storybook` exits 0. Storybook smoke-boot confirmed on
port 6007 ("Storybook 8.6.18 for react-vite started").

Deviations from brief:
- Two additional `theme.shape.borderRadius` arithmetic sites fixed (not in audit).
- Effort: ~1.5h actual vs 4–6h estimated.

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

### Phase 3a — Parallel port (two batches, 2026-05-24)

Classification audit completed (see `docs/PORTING-COMPONENT-LIBRARY.md`).
Components split across two agents working simultaneously on disjoint file sets.

**Batch 1** — MarkdownRichText (MarkdownBody), ContentBlock (MarketingContentBlock),
TabsSection, Hero (MarketingHero), CTABanner (MarketingCTABanner), Testimonials,
FAQAccordion, Timeline, Proof (ProofSection). See `marketing/` dir.

**Batch 2 — done 2026-05-24** — FeatureGrid, LogosStrip, StatsStrip, StatsCounter,
ImageGallery, VideoEmbed, Comparison (ComparisonTable), PilotFindings, Guarantee.
All 9 components ported to `packages/react/src/marketing/`. 48 new spec assertions
pass, typecheck clean, build clean.

Key decisions made in Batch 2:

- framer-motion confirmed unused in all source components (zero imports found);
  not added as a dependency.
- StatsCounter animation: kept the IntersectionObserver + JS setInterval count-up
  from the source (pure JS, 2 s / 60 steps). No framer-motion. Guard added for
  jsdom environments (`typeof IntersectionObserver === 'undefined'` check).
- ImageGallery lightbox replaced custom fixed-position overlay with MUI `<Dialog>`
  for proper keyboard focus trap and a11y.
- ComparisonTable replaced injected `<style>` block with MUI sx props — eliminates
  global CSS leakage in micro-frontend contexts.
- Icon substitutions: all lucide icons replaced with `@mui/icons-material`. Two
  non-1:1 mappings: `BrainCircuit → PsychologyIcon`, `GitBranch → AccountTreeIcon`.
  lucide-react is NOT added as a dependency.

**Barrel wiring** (`marketing/index.ts`, `index.ts`) pending orchestrator commit.

---

## Phase 4 — Storybook stories + GH Pages deploy (partial — 2026-05-24)

**Scope.** Write at least one story per exported component in `packages/react/src/`.
Configure `apps/storybook` with a MUI ThemeProvider decorator so components render with
the TensorCost theme. Add a GH Actions workflow that publishes the built Storybook to
GH Pages on every push to main.

**Files touched.** `packages/react/src/*.stories.tsx`, `apps/storybook/.storybook/preview.ts`,
`.github/workflows/pages.yml`.

**Definition of done.** `pnpm build-storybook` exits 0. Every exported component has
at least a default story. GH Pages URL is accessible.

**What landed (partial — stories + decorator; GH Pages workflow pending).**

Theme decorator: `apps/storybook/.storybook/preview.ts` now wraps every story in
`<ThemeProvider theme={createTensorTheme(mode)}>` + `<CssBaseline>`. A `globalTypes`
entry exposes the light/dark toggle in the Storybook toolbar.

Stories: 30 stories across 6 files, 38 total entries in the static index (including
autodocs pages).

- `packages/tokens/src/tokens.stories.tsx` — `Foundation/Brand / Overview`: color
  swatches for BRAND_TOKENS_LIGHT/DARK, tone chips for all 5 ToneKind values,
  typography specimen, radius scale, motion token table.
- `packages/react/src/MetricCard.stories.tsx` — 6 stories: Default, WithDelta ×2,
  Warning, Mini, CustomHexColor.
- `packages/react/src/WorkflowCard.stories.tsx` — 7 stories: Default, WithStatus ×4,
  WithFocusRing, WithAnchor.
- `packages/react/src/StatusBadge.stories.tsx` — 7 stories: Default, AllTones,
  AllTonesLabeled, Ok/Warn/Danger/Info.
- `packages/react/src/DataTable.stories.tsx` — 5 stories: WithRows, Empty, Loading,
  WithError, ClickableRows.
- `packages/react/src/RailSidebar.stories.tsx` — 6 stories: Default (collapsed),
  PinnedOpen, WithAlertsBadge, WithItemBadge, WithEnvClick, ActiveHome.

Supporting fixes: `packages/react/tsconfig.json` and `vitest.config.ts` exclude
`*.stories.*` from typecheck and coverage (same pattern as existing test-file
exclusions). `packages/tokens/tsconfig.json` same. `apps/storybook/package.json`
adds `@emotion/react`, `@emotion/styled`, `@mui/material`, `@tensorcost/tokens` as
direct dependencies. `apps/storybook/.storybook/main.ts` path corrected from
`../../packages` to `../../../packages` (Storybook 8 resolves globs relative to the
`.storybook/` config dir, not the app root).

Build output: `pnpm build-storybook` exits 0, 38 story entries, static export 6.6 MB.
`pnpm typecheck` clean. 252 tests pass (51 tokens + 201 react), coverage thresholds met.

**Remaining for Phase 4 completion:** GH Actions `pages.yml` workflow (`.github/workflows/`).
Stories for remaining exported components not covered in this partial pass.

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
