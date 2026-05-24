# @tensorcost/tokens

Design tokens for the TensorCost design system — brand colors, tone palette, typography, radius, motion. Framework-agnostic. No React, no MUI, no peer deps.

This package is the source of truth. `@tensorcost/ui-kit` re-imports from here; the marketing site re-imports from here; the slide pipeline re-imports from here. Change a hex here, every downstream consumer picks it up on next install.

## Install

```
npm install @tensorcost/tokens
```

## Usage

```ts
import {
  BRAND_TOKENS_LIGHT,
  BRAND_TOKENS_DARK,
  TONE_LIGHT,
  TONE_DARK,
  TYPOGRAPHY_TOKENS,
  buildCssVars,
} from '@tensorcost/tokens'
```

Per-entry exports for tree-shake control:

- `@tensorcost/tokens/brand` — brand tokens (paper, ink, semantic colors, radius, motion)
- `@tensorcost/tokens/tone` — tone palette (good / bad / warn / info / neutral) for chips and callouts
- `@tensorcost/tokens/typography` — type scale (fontFamily, h4–h6, overline, button)
- `@tensorcost/tokens/css-vars` — `buildCssVars()` helper for non-MUI consumers
- `@tensorcost/tokens/brand.json` — raw JSON snapshot for Python / Figma / non-TS consumers

## Consuming from Python or Figma

`brand.json` is the same data as the TS export, shaped `{ light: {...}, dark: {...} }`. Useful for a python-pptx slide generator, a Figma plugin that mirrors the system, or any tooling that can't run TypeScript.

```py
import json
tokens = json.load(open("node_modules/@tensorcost/tokens/src/brand.json"))
primary = tokens["light"]["blue"]   # "#3B82F6"
```
