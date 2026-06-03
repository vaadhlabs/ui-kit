/**
 * v2 blueprint primitives barrel.
 *
 * Two waves ship in W1-2 of the v2 migration:
 *  • MVP (W1) — text + chrome: Eyebrow/Eye, H1/H2/H3, Body/B, Mono, Num,
 *    Box, Tag, Btn, Callout.
 *  • Layout + data (W2) — Surface, Frame, RailV2, TopBar, SubTabs,
 *    StatLine, Table, Plot, LeaderCallout, Dim, SectionHeader.
 *
 * Everything in `blueprint/` consumes the v2 token vocabulary from
 * `@tensorcost/tokens`. None of these import `@mui/material` — the
 * hairline-ink visual language is intentionally outside MUI's defaults.
 */

// Text
export { Eyebrow, Eye, H1, H2, H3, Body, B, Mono, Num, defaultInkForRole } from "./Text.js";
export type { EyebrowProps, HeadingProps, BodyProps, MonoProps, NumProps } from "./Text.js";

// Chrome
export { Box } from "./Box.js";
export type { BoxProps, BoxVariant } from "./Box.js";

export { Tag } from "./Tag.js";
export type { TagProps, TagVariant } from "./Tag.js";

export { Btn } from "./Btn.js";
export type { BtnProps, BtnVariant, BtnSize } from "./Btn.js";

export { Callout } from "./Callout.js";
export type { CalloutProps } from "./Callout.js";

// Layout — Frame, RailV2, TopBar, SubTabs, Surface
export { Frame } from "./Frame.js";
export type { FrameProps } from "./Frame.js";

export { RailV2, DEFAULT_RAIL_ITEMS } from "./RailV2.js";
export type { RailV2Props, RailItem, SurfaceId } from "./RailV2.js";

export { TopBar } from "./TopBar.js";
export type { TopBarProps } from "./TopBar.js";

export { SubTabs } from "./SubTabs.js";
export type { SubTab, SubTabsProps } from "./SubTabs.js";

export { Surface, SurfaceFramed } from "./Surface.js";
export type { SurfaceProps, SurfaceFramedProps } from "./Surface.js";

// Data — StatLine, Table, Plot, LeaderCallout, Dim, SectionDivider
export { StatLine } from "./StatLine.js";
export type { StatLineProps, StatItem, DeltaKind } from "./StatLine.js";

export { Table } from "./Table.js";
export type { TableProps, TableColumn, TableRow, Align } from "./Table.js";

export { Plot } from "./Plot.js";
export type { PlotProps, PlotKind } from "./Plot.js";

export { LeaderCallout } from "./LeaderCallout.js";
export type { LeaderCalloutProps } from "./LeaderCallout.js";

export { Dim } from "./Dim.js";
export type { DimProps } from "./Dim.js";

export { Ring } from "./Ring.js";
export type { RingProps } from "./Ring.js";

export { Sparkline } from "./Sparkline.js";
export type { SparklineProps } from "./Sparkline.js";

// Renamed from the design's `SectionHeader` to avoid colliding with the
// existing kit's `SectionHeader` (Workshop's page-header component).
export { SectionDivider } from "./SectionDivider.js";
export type { SectionDividerProps } from "./SectionDivider.js";

// Theming — provider + hooks for light/dark palette switching
export {
  BlueprintThemeProvider,
  usePalette,
  useBlueprintTheme,
} from "./ThemeProvider.js";
export type {
  BlueprintMode,
  BlueprintThemeContextValue,
  BlueprintThemeProviderProps,
} from "./ThemeProvider.js";
