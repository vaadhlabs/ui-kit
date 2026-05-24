# TensorCost UI Kit

The design system for [TensorCost](https://tensorcost.com). Three packages under one roof:

| Package | Name | What it is |
|---------|------|------------|
| `packages/react` | `@tensorcost/ui-kit` | MUI 5-based React components — layout shells, data tables, metric cards, charts |
| `packages/tokens` | `@tensorcost/tokens` | Design tokens (colors, spacing, type scale) without any React/MUI dependency |
| `packages/slides` | `@tensorcost/slides` | React-to-image pipeline for PPT/marketing via `@vercel/satori` |

Storybook lives under `apps/storybook/`.

## Who consumes this

- **tensorcost MF apps** — the micro-frontend shell and all feature MFs import `@tensorcost/ui-kit` and `@tensorcost/ui-kit/theme` via workspace symlink today; they'll switch to the published npm package once Phase 0 is proven stable.
- **websites/website** — the marketing site will pull `@tensorcost/tokens` for consistent brand colors.
- **Marketing PPT pipeline** — `@tensorcost/slides` will render React components to PNG frames that drop into PowerPoint templates.

## Prerequisites

Node 20, pnpm 9. If you're using nvm: `nvm use`.

## Dev commands

```sh
pnpm install          # install all workspace deps

pnpm typecheck        # tsc --noEmit across packages/react, packages/tokens, packages/slides
pnpm test             # vitest run across all packages (coverage on packages/react)
pnpm build            # tsup builds all three packages to dist/

pnpm storybook        # start Storybook at http://localhost:6006
pnpm build-storybook  # static Storybook build (CI gate + GH Pages in Phase 4)

pnpm changeset        # open the changeset prompt to describe a change
pnpm version-packages # bump versions based on pending changesets
```

## Adding a component

Drop a new `.tsx` file into `packages/react/src/`, re-export it from `packages/react/src/index.ts`, and write a spec alongside it (or under `src/__tests__/`). The vitest config picks up both `*.spec.tsx` and `__tests__/*.test.tsx`.

Storybook stories go in the same `src/` directory as the component, named `ComponentName.stories.tsx`. The `apps/storybook` main config globs `../../packages/*/src/**/*.stories.@(ts|tsx|mdx)`, so no manual registration needed.

## npm scope

All published packages use the `@tensorcost` scope. Access is restricted — the registry token lives in CI secrets; local `npm login` to the `@tensorcost` scope is required for manual publishes.

## Brand assets

Static logo files live in `brand/` at the repo root: SVG, PNG, and JPG variants of the TensorCost mark, lockup, and mono mark, plus Vaadh Labs icon and wordmark.
