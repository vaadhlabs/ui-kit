---
"@tensorcost/tokens": major
"@tensorcost/ui-kit": major
---

v2 blueprint — architectural-drawing vocabulary

Ships the v2 design system for TensorCost's 5-surface IA migration
(`docs/strategy/2026-05-24-v2-migration-before-GA.md` in the consuming
monorepo). Additive in 1.0.0; the existing Workshop primitives remain
exported alongside the blueprint and will sunset in 2.0.0 once the
in-app MFs complete their per-surface rewrites.

— tokens —

New module `@tensorcost/tokens/blueprint` exports the v2 vocabulary
extracted from the design's `kit.jsx` (440 LOC source):

- `BLUEPRINT_LIGHT` / `BLUEPRINT_DARK` palettes — warm vellum paper
  (`#fbfaf6`), near-black ink (`#0a0a0a`), single signal accent
  (`#FF4814`). The four ink steps, three paper steps, faint ghost, and
  amber / green / red status. Dark is a post-GA stub.
- `BLUEPRINT_FAMILIES` — Inter Tight (display), Inter (body), IBM Plex
  Mono (numbers + labels).
- `BLUEPRINT_TYPE` — type ramp: h1 56px / h2 32px / h3 20px / body 13px /
  mono 11px / num 32px / eyebrow 10px uppercase.
- `BLUEPRINT_SPACING` — 8-px grid; named scale (xxs..5xl) plus indexed
  `n[]` for sx-prop consumers.
- `strokeFor(palette)` — hairline / hairline-soft / ghost stroke styles
  derived from the active palette.
- `BLUEPRINT_TOKENS_LIGHT` / `BLUEPRINT_TOKENS_DARK` — one-shot bundle
  for callers that want everything in a single object.

Existing exports (`BRAND_TOKENS_*`, `TONE_*`, `TYPOGRAPHY_TOKENS`,
`buildCssVars`) unchanged.

— react —

New module `@tensorcost/ui-kit` (re-exports under top-level + via
`blueprint/index.ts` barrel) ships 18 production primitives:

Text · `Eyebrow` / `Eye`, `H1`, `H2`, `H3`, `Body` / `B`, `Mono`, `Num`,
`Callout`.

Chrome · `Box` (5 variants), `Tag` (6 variants), `Btn` (4 variants ×
2 sizes, forwarded ref, real `<button type="button">`).

Layout · `Frame`, `RailV2` (5-surface nav + tenant chip), `TopBar`,
`SubTabs` (≤4 cap, dev warning above), `Surface`, `SurfaceFramed`.

Data · `StatLine`, `Table` (ruled, role=table/row/cell, zebra), `Plot`
(line / area / bars / spark / step SVG sketches), `LeaderCallout`,
`Dim` (engineering dimension line), `SectionDivider` (renamed from the
design's `SectionHeader` to avoid colliding with the existing kit
export).

All blueprint primitives are bare React + inline styles — no
`@mui/material` dependency. The hairline-ink visual language is
intentionally outside MUI's defaults so the v2 surfaces don't fight
rounded corners, paper shadows, or divider grey.

— testing —

77 new assertions added across three spec files
(`blueprint.spec.ts` × 37, `blueprint.spec.tsx` × 32, `layout.spec.tsx`
× 23, `data.spec.tsx` × 22). 88 token tests + 392 react tests pass on
the bumped version; build emits 73 KB of types.

— stories —

17 new Storybook stories (`blueprint/*.stories.tsx`) + foundation
overview (`tokens/blueprint.stories.tsx`) — palette grids, type ramp,
spacing scale, stroke styles, and per-primitive variants. `pnpm
build-storybook` clean.

— not in this release —

The v2 visual language is the destination, but pages outside the 5
hero surfaces continue to render in the Workshop vocabulary through
GA. Workshop primitives stay exported for consumer compatibility and
gain `@deprecated` JSDoc; removal lands in 2.0.0 after the in-app MF
migration completes per the strategy doc's W11-14 schedule.

Dark theme ships as a stub — the design has not produced a dark
variant yet; consumers should treat `BLUEPRINT_DARK` as a preview.
