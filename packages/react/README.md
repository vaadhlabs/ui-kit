# @tensorcost/ui-kit

TensorCost design system — React components, MUI 7 theme, semantic tone palette, charts, marketing primitives.

The canonical UI kit for TensorCost apps, the marketing site, and slide pipelines.

## Install

```
npm install @tensorcost/ui-kit
```

Requires MUI 7, Emotion, and React 18 as peer deps:

```
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom recharts
```

## Usage

```tsx
import { ThemeShellProvider, MetricCard, RailSidebar } from '@tensorcost/ui-kit'

function App() {
  return (
    <ThemeShellProvider mode="light">
      <MetricCard label="Spend" value="$12,450" delta={-0.08} />
    </ThemeShellProvider>
  )
}
```

## Consumer setup — font loading

This package does NOT load fonts on consumers' behalf. The `mono` brand token references `'JetBrains Mono'`; consumers that render with the mono token (`palette.brand.mono` or the `--mono` CSS variable) must load the font themselves. Either inline a `<link>` in your HTML head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

…or bundle the font via your build pipeline. The kit doesn't care which path you pick.

The default UI font (`Inter`) is loaded similarly via your app's HTML or build.

## What's in the box

**Theme** — `createTensorTheme(mode)` returns a fully-configured MUI 7 theme with TensorCost brand palette, tone augmentation, and CSS custom property emission for non-MUI consumers.

**App-chrome components** — MetricCard, DataTable, DataListPage, WorkflowCard, WorkshopCard, SectionHeader, SavingsBanner, RailSidebar, MobileTopBar, MobileDrawer, RowPreviewDrawer, RowDetailsDialog, StatusBadge, RequireRole.

**Marketing primitives** — Hero, FeatureGrid, CTABanner, Testimonials, FAQAccordion, Timeline, LogosStrip, StatsCounter, StatsStrip, ImageGallery, VideoEmbed, Comparison, Proof, PilotFindings, Guarantee, ContentBlock, TabsSection, MarkdownRichText.

**Charts** — opinionated Recharts wrappers themed against tokens.

## Storybook

Live component reference: built locally with `pnpm storybook` from the kit's repo. Public Storybook deploy is a follow-up.

## License

UNLICENSED — internal TensorCost use. Not for public distribution.
