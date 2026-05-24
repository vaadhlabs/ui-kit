# TensorCost UI Kit

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

The design system for TensorCost — three packages, one canonical source of truth for tokens and components consumed across the product app, the marketing site, and the slide pipeline.

| Package | Name | What it is |
|---------|------|------------|
| `packages/tokens` | `@tensorcost/tokens` | Brand tokens, tone palette, typography. Framework-agnostic. No React, no MUI. |
| `packages/react` | `@tensorcost/ui-kit` | React components on MUI 7 + tokens — app chrome (MetricCard, DataTable, RailSidebar) + marketing primitives (Hero, FeatureGrid, Testimonials, …) |
| `packages/slides` | `@tensorcost/slides` | React-to-image pipeline for PPT generation via `@vercel/satori`. WIP (Phase 5). |

Storybook lives under `apps/storybook/`. Local: `pnpm storybook` → `http://localhost:6006`.

## Who this is for

Anyone building a React app with a need for a coherent component set. The kit is opinionated — MUI 7 + Emotion is the runtime, tokens are the source of truth, components are typed. Most useful if you're starting fresh; portable enough to drop into an existing MUI 5/6 app once the version bump is done.

The kit is open source under Apache 2.0. Contributions, issues, and forks welcome.

## Prerequisites

Node 20, pnpm 9. If you're using nvm: `nvm use`.

## Dev commands

```sh
pnpm install          # install all workspace deps

pnpm typecheck        # tsc --noEmit across packages/react, packages/tokens, packages/slides
pnpm test             # vitest run across all packages (coverage on packages/react)
pnpm build            # tsup builds all three packages to dist/

pnpm storybook        # start Storybook at http://localhost:6006
pnpm build-storybook  # static Storybook build (CI gate + GH Pages deploy)

pnpm changeset        # open the changeset prompt to describe a change
pnpm version-packages # bump versions based on pending changesets
```

## Consumer setup

`@tensorcost/ui-kit` requires `@mui/material ^7`, `@emotion/react ^11.14`, and
`@emotion/styled ^11.14` as peer dependencies. Install them alongside the package.

### Font loading

The kit uses JetBrains Mono for monospace slots (the `BrandTokens.mono` token, nav
rail hints, badge counts, kbd shortcuts). The kit does not inject the font itself —
doing so via `MuiCssBaseline` was a MUI 5 hack that MUI 7 removed, and a library
injecting a Google Fonts URL into every app's global stylesheet is presumptuous anyway.

Load the font in your app's HTML `<head>` or global CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
  rel="stylesheet"
/>
```

Alternatively, bundle the font via a local `@font-face` declaration — the
`BrandTokens.mono` value is `"'JetBrains Mono', ui-monospace, monospace"`, so the
browser will fall back to the system monospace if the custom font is absent.

---

## Adding a component

Drop a new `.tsx` file into `packages/react/src/` (or `packages/react/src/marketing/` if it's a marketing primitive), re-export it from the corresponding `index.ts`, and write a spec alongside it (or under `__tests__/`). The vitest config picks up both `*.spec.tsx` and `__tests__/*.test.tsx`.

Storybook stories go in the same directory as the component, named `ComponentName.stories.tsx`. The `apps/storybook` main config globs `../../../packages/*/src/**/*.stories.@(ts|tsx|mdx)`, so no manual registration needed.

## npm scope

All published packages use the `@tensorcost` scope, published as **public** packages. Manual publish flow:

```sh
npm login                  # authenticate to the @tensorcost npm org
pnpm changeset             # author a changeset describing the change
pnpm changeset version     # bump versions + generate CHANGELOG entries
pnpm build                 # rebuild dist/ for the new version
pnpm changeset publish     # publish to npm
git push --follow-tags     # push the version commit + tag
```

The `.github/workflows/release.yml` automates this flow on tag push once the `NPM_TOKEN` secret is configured at the repo.

## Brand assets

Static logo files live in `brand/` at the repo root: SVG, PNG, and JPG variants of the TensorCost mark, lockup, and mono mark, plus Vaadh Labs icon and wordmark.

## License

Apache 2.0 — see [LICENSE](LICENSE). Copyright 2026 Vaadh Labs (TensorCost).
