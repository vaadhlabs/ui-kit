# MUI 5→7 break-list

Audit done 2026-05-24, against `packages/react/src/` as of commit `fe1d4e30bb13191ffee35325737730940fb42576`. Read-only — no code changes in this commit.

## TL;DR

24 source files inventoried; 6 files carry breaking-change call sites across 4 distinct categories. The dominant issue is **`JSX.Element` return-type annotations** — 19 function signatures across 15 files will fail to compile against MUI 7's re-exported React 19 types, which no longer expose `JSX.Element` in the global namespace. The second cluster is **`useMediaQuery`'s `{ noSsr }` option removal** (1 site) and a **`@import` key in `MuiCssBaseline.styleOverrides`** that MUI 7 stops accepting as a shorthand (1 site in `theme.ts`). Two `declare module "@mui/material/styles"` augmentations in `theme.ts` and `workshop-theme.ts` need spot-checking against v7's changed `Palette`/`PaletteOptions` shape. No `Grid`/`Hidden`/`makeStyles`/`@mui/styles`/`@mui/lab` call sites were found — the codebase never used those patterns. Total migration effort is roughly **4–6 hours** of focused work: most of the `JSX.Element` changes are mechanical find-replace; only the theme augmentation verification and the `@import` fix need careful reading.

---

## peerDependencies

| Package | Current | Target (MUI 7) | Notes |
|---|---|---|---|
| `@mui/material` | `^5.16.0` | `^7.0.0` | Major version jump; spans two breaking releases (5→6→7). Migration guide covers both steps. |
| `@mui/icons-material` | `^5.16.0` | `^7.0.0` | Must match `@mui/material` major. No removed icon paths detected in the codebase; bump is safe. |
| `@emotion/react` | `^11.13.0` | `^11.14.0` | No major bump needed. MUI 7 tightens the minimum to `>=11.14`; the `^11.13.0` range will miss it by one patch. Change to `^11.14.0`. |
| `@emotion/styled` | `^11.13.0` | `^11.14.0` | Same constraint — bump to match. |
| `react` | `^18.3.0` | `^18.3.0` or `^19.0.0` | MUI 7 supports both. No change forced; bump to `^19` only if the consuming apps move first. |
| `react-dom` | `^18.3.0` | same as `react` | Mirror. |
| `recharts` | `^2.13.0` | `^2.13.0` | Not an MUI dependency. No change needed. |

`devDependencies` carries `@mui/material` and `@mui/icons-material` pins too — those need the same bump as their peer counterparts.

---

## Breaking changes found

### `JSX.Element` return-type annotations

**19 call sites across 15 files.** MUI 7 ships with React 19 type definitions in which the global `JSX` namespace is no longer ambient. `JSX.Element` in component return types will produce a TS compiler error: `Cannot find namespace 'JSX'`. The fix is to change `JSX.Element` to `React.ReactElement` (or simply `ReactElement` with the import) and `JSX.Element | null` to `ReactElement | null`. This is a pure type-level change with no runtime impact.

- `packages/react/src/DataListPage.tsx:24` — `): JSX.Element {`
- `packages/react/src/ThemeShellProvider.tsx:66` — `): JSX.Element {`
- `packages/react/src/RowDetailsDialog.tsx:46` — `): JSX.Element {`
- `packages/react/src/RailSidebar.tsx:150` — `): JSX.Element {`
- `packages/react/src/RequireRole.tsx:50` — `): JSX.Element {`
- `packages/react/src/charts.tsx:54` — `): JSX.Element | null {`
- `packages/react/src/SectionHeader.tsx:44` — `): JSX.Element {`
- `packages/react/src/section.tsx:34` — `): JSX.Element {`
- `packages/react/src/WorkflowPage.tsx:55` — `): JSX.Element {`
- `packages/react/src/WorkshopCard.tsx:37` — `): JSX.Element {`
- `packages/react/src/MetricCard.tsx:26` — `): JSX.Element {`
- `packages/react/src/DataTable.tsx:103` — `): JSX.Element {`
- `packages/react/src/SavingsBanner.tsx:107` — `): JSX.Element | null {`
- `packages/react/src/MetricCardWorkshop.tsx:42` — `): JSX.Element {`
- `packages/react/src/WorkflowCard.tsx:61` — `): JSX.Element {`
- `packages/react/src/RowPreviewDrawer.tsx:35` — `): JSX.Element {`
- `packages/react/src/StatusBadge.tsx:44` — `): JSX.Element {`
- `packages/react/src/MobileDrawer.tsx:81` — `): JSX.Element {`
- `packages/react/src/MobileTopBar.tsx:44` — `): JSX.Element {`

Mechanical fix: `sed -i '' 's/): JSX\.Element {/): ReactElement {/g'` across the package, then add `import type { ReactElement } from "react"` where missing. Already present in `MetricCard.tsx` (it imports `ReactElement` for the `icon` prop), so that one is 2-token change; the rest need the import added.

---

### `useMediaQuery` — `{ noSsr }` option removed

**1 call site in 1 file.**

In MUI 6, `useMediaQuery` received a `defaultMatches` option that covers the SSR hydration case more explicitly. The `noSsr` shorthand was formally deprecated in v6 and removed in v7. Passing `{ noSsr: true }` in v7 will produce a TypeScript error and the option will silently have no effect.

- `packages/react/src/ThemeShellProvider.tsx:67` — `const prefersDark = useMediaQuery("(prefers-color-scheme: dark)", { noSsr: true });`

The migration is: remove `{ noSsr: true }` (or replace with `{ defaultMatches: false }` if SSR rendering is a concern — the consuming apps are CSR-only from what the workspace shows, so removing the option entirely is the right call).

---

### `MuiCssBaseline` `styleOverrides` — `"@import"` key removed

**1 call site in 1 file.**

MUI 5 allowed injecting CSS `@import` rules by putting an `"@import"` key inside `MuiCssBaseline.styleOverrides`. MUI 6 deprecated that undocumented shorthand; MUI 7 removes it. The key is simply dropped from the generated stylesheet — the JetBrains Mono web font stops loading for all consumers of `createTensorTheme`.

- `packages/react/src/theme.ts:236–238` — the `"@import"` key inside `MuiCssBaseline.styleOverrides`.

The fix is to move the font import to a `@font-face` block inside the `globalStyles` string (MUI 7 `MuiCssBaseline.styleOverrides` supports a raw CSS string or a `GlobalStyles` value — the recommended approach is to render `<GlobalStyles styles={{ "@import": "..." }} />` once in `ThemeShellProvider` alongside `<CssBaseline />`).

---

### `declare module "@mui/material/styles"` palette augmentations — type-shape risk

**2 augmentation blocks across 2 files; 0 confirmed hard breaks but both need verification.**

MUI 7 restructured the `Palette`/`PaletteOptions` generics to support CSS variables mode (`CssVarsTheme`). Custom fields added via `declare module` can collide with the new type machinery if they shadow a field that v7 added natively (e.g. `colorSchemes`, `vars`). Neither augmentation here adds a field with those names, but both need a compile check against the actual v7 types.

- `packages/react/src/theme.ts:43–50` — adds `brand: BrandTokens` to `Palette` and `brand?: Partial<BrandTokens>` to `PaletteOptions`. Field name `brand` is not used by MUI v7 itself; likely safe.
- `packages/react/src/workshop-theme.ts:54–72` — adds `workshop: { section, pageBg, surfaceAlt }` to `Palette` and an optional counterpart to `PaletteOptions`. Field name `workshop` is not used by MUI v7 itself; likely safe.

The verification step is to `pnpm add -D @mui/material@^7` in a throwaway branch, run `pnpm typecheck`, and see whether either augmentation produces an incompatibility error. If MUI 7 tightened the constraint on `Palette` to be a `Pick<...>` rather than an open interface, the custom fields would produce errors. Historical precedent from v6 migration reports suggests open interfaces survived, but confirm rather than assume.

---

## Files with no breaking-change usages

These 9 files import from `@mui/material` or `@mui/material/styles` but carry no patterns that are broken in v7 — they use only stable APIs (`Box`, `Typography`, `Card`, `Button`, `Paper`, `Stack`, `Dialog`, `useTheme`, `alpha`, icon imports). A peer-dep bump alone is sufficient to bring them to v7.

- `packages/react/src/DataTable.tsx` — `useMediaQuery(theme.breakpoints.down(...))` without options; clean.
- `packages/react/src/charts.tsx` — `useTheme()`, `Box`, `Paper`, `Typography`; no breaking patterns.
- `packages/react/src/MetricCard.tsx` — `cloneElement` from React (not MUI); `Card`, `CardContent`, `useTheme`; clean. The `cloneElement` cast (`icon as ReactElement<{ sx?: object }>`) is not an MUI issue.
- `packages/react/src/MetricCardWorkshop.tsx` — `Card`, `CardContent`, `useTheme`; clean.
- `packages/react/src/WorkshopCard.tsx` — `Card`, `useTheme`; clean.
- `packages/react/src/SavingsBanner.tsx` — `Paper`, `Skeleton`, `Button`, `Typography`, `useTheme`; clean.
- `packages/react/src/SectionHeader.tsx` — `Box`, `Typography`; clean.
- `packages/react/src/StatusBadge.tsx` — `Box`, `useTheme`; clean.
- `packages/react/src/WorkflowCard.tsx` — `Box`, `alpha`, `useTheme`; `alpha` is unchanged in v7.
- `packages/react/src/WorkflowPage.tsx` — `Box`, `ButtonBase`, `useTheme`; clean.
- `packages/react/src/RailSidebar.tsx` — `Box`, `ButtonBase`, `IconButton`, `Tooltip`, icon imports; clean.
- `packages/react/src/MobileDrawer.tsx` — same; icon imports (`UnfoldMore`, `Search`, `Settings`); clean.
- `packages/react/src/MobileTopBar.tsx` — `Box`, `IconButton`, `Badge`; icon imports; clean.
- `packages/react/src/RowDetailsDialog.tsx` — `Dialog`, `DialogContent`, `DialogTitle`, `IconButton`, `Stack`, `Typography`; clean.
- `packages/react/src/RowPreviewDrawer.tsx` — `Box`, `ButtonBase`, `IconButton`, `Button`; clean.
- `packages/react/src/RequireRole.tsx` — `Box`, `Paper`, `Typography`, icon import; clean.
- `packages/react/src/DataListPage.tsx` — `Box`, `Typography`; clean.
- `packages/react/src/section.tsx` — `createContext`, `useTheme`; clean.
- `packages/react/src/tone.ts` — `useTheme`; clean.
- `packages/react/src/useSavingsBanner.ts` — no MUI imports; clean.
- `packages/react/src/index.ts` — re-exports only; clean.
- `packages/react/src/test-setup.ts` — test bootstrap; not in build.

---

## Recommended migration order

1. **Bump peer-deps** in `packages/react/package.json`: `@mui/material`, `@mui/icons-material` to `^7.0.0`, `@emotion/react` and `@emotion/styled` to `^11.14.0`. Also bump the mirror entries under `devDependencies`. Run `pnpm install`. Expected: type errors from steps 2–4 surface immediately.

2. **Fix `JSX.Element` annotations** — mechanical. `sed` sweep across all 15 files (`JSX.Element` → `ReactElement`, `JSX.Element | null` → `ReactElement | null`), add `import type { ReactElement } from "react"` wherever the import is absent. Run `pnpm typecheck` after.

3. **Fix `noSsr` removal** in `ThemeShellProvider.tsx:67` — remove `{ noSsr: true }` from the `useMediaQuery` call. The consuming apps are CSR; the default `{ defaultMatches: false }` SSR behaviour is a no-op in their runtime.

4. **Fix `@import` in `MuiCssBaseline` styleOverrides** in `theme.ts:236–238` — move the Google Fonts import to a `<GlobalStyles>` element rendered by `ThemeShellProvider` alongside `<CssBaseline />`. Keeps the font loading behaviour identical.

5. **Verify palette augmentations** — run `pnpm typecheck` after step 1 and check whether `theme.palette.brand` or `theme.palette.workshop` produce errors. If not, nothing to do. If yes, review MUI 7's `Palette` type shape and adjust the `declare module` blocks accordingly.

6. **Update downstream apps** — the ui-kit peerDep bump forces consuming `apps/` to align their own `@mui/material` dev-deps. That's a separate ticket; the library changes here can ship first under a minor version bump (the JSX type changes are not observable at runtime).

---

## Open questions / risks

- **`theme.ts` `MuiCssBaseline` `@import` array** — it is unclear whether MUI 7 silently drops the key or throws at build/runtime. Test the `@import` removal fix in a dev environment before shipping; an untested silent-drop would mean the JetBrains Mono font stops loading in production without any error surfacing.

- **`useMediaQuery` `{ noSsr }` runtime behavior in v7** — TypeScript will flag it as an unknown option; whether the option is also stripped from the type definitions in a way that causes a hard type error (vs. a `strict` `exactOptionalPropertyTypes` issue) depends on v7's generated types. Safe to just delete the option.

- **Palette augmentation `Palette` vs `CssVarsPalette`** — MUI 7 introduces a parallel `CssVarsTheme` type that flows through `extendTheme()`. `createTensorTheme` and `createWorkshopTheme` both use `createTheme()` (not `extendTheme()`), so they do not land in the CSS-vars code path. The augmentation pattern should still work. But if a future Phase 3 migration moves to `extendTheme` for CSS variables support, the augmentations will need to be applied to `CssVarsThemeOptions` / `CssVarsPalette` instead.

- **`cloneElement` in `MetricCard.tsx:83`** — `cloneElement(icon as ReactElement<{ sx?: object }>, ...)` is a React API, not MUI. It is not a breaking change in the MUI 5→7 window. It is, however, a `cloneElement` anti-pattern that React 19 deprecates warnings for when the element type is a function component (as icon components are). Not a blocker for the MUI 7 bump; worth a note for the React 19 migration whenever that happens.

- **`color-mix()` in `WorkflowPage.tsx:423`** — not an MUI issue, but `color-mix(in srgb, ...)` requires a modern browser baseline (Chrome 111+, Safari 16.2+, Firefox 113+). No breaking change from the MUI bump, but worth flagging if the supported-browser matrix is broader.
