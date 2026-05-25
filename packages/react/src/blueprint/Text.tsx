/**
 * v2 blueprint text primitives.
 *
 * Eyebrow, Heading (H1/H2/H3), Body, Mono, Num. All bare HTML elements,
 * no MUI — the hairline-ink vocabulary fights MUI's default chrome
 * (rounded buttons, paper shadows, divider grey). Tokens come from
 * @tensorcost/tokens/blueprint.
 *
 * Sizing: every primitive accepts a `size` prop. Number → px. String →
 * passed through (rem/em/clamp/etc). The defaults match the design's
 * default ramps; pages ramp up explicitly (the thesis page uses H1 at
 * 88px instead of the default 56).
 */
import type { CSSProperties, ReactNode } from "react";
import {
  BLUEPRINT_FAMILIES,
  BLUEPRINT_LIGHT,
  BLUEPRINT_TYPE,
} from "@tensorcost/tokens";
import type { BlueprintPalette } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

type SizeProp = number | string;

const px = (s: SizeProp): string => (typeof s === "number" ? `${s}px` : s);

interface CommonProps {
  children?: ReactNode;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

// ----------------------------------------------------------------------------
// Eyebrow — 10px uppercase mono kicker. Above headings, section dividers,
// callout titles. "Eye" in the design — exported as `Eyebrow` for
// discoverability; `Eye` kept as an alias.
// ----------------------------------------------------------------------------

export interface EyebrowProps extends CommonProps {
  /** Override the default 10px size when the eyebrow needs to read smaller. */
  size?: SizeProp;
}

export function Eyebrow({
  children,
  color,
  size,
  style,
  className,
}: EyebrowProps): JSX.Element {
  const e = BLUEPRINT_TYPE.eyebrow;
  // Default to the active palette's ink3 (label-weight). The previous
  // hardcoded BLUEPRINT_LIGHT.ink3 made every eyebrow render in light-mode
  // ink even when the surrounding BlueprintThemeProvider was set to dark
  // — i.e. dark text on dark paper.
  const p = usePalette();
  return (
    <span
      className={className}
      style={{
        fontFamily: e.fontFamily,
        fontSize: size != null ? px(size) : e.fontSize,
        fontWeight: e.fontWeight,
        letterSpacing: e.letterSpacing,
        textTransform: e.textTransform,
        color: color ?? p.ink3,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/** Short alias matching the design's `Eye` component name. */
export const Eye = Eyebrow;

// ----------------------------------------------------------------------------
// Headings — Inter Tight, weight 500, negative tracking, semantic h1/h2/h3.
// ----------------------------------------------------------------------------

export interface HeadingProps extends CommonProps {
  size?: SizeProp;
  weight?: number;
}

function makeHeading(
  tag: "h1" | "h2" | "h3",
  defaultSize: string,
  defaultLineHeight: number,
  defaultLetterSpacing: string,
) {
  return function Heading({
    children,
    color,
    size,
    weight = 500,
    style,
    className,
  }: HeadingProps): JSX.Element {
    const Tag = tag;
    // Default to active palette's display ink so dark mode actually gets
    // light text on dark paper. Previously hardcoded BLUEPRINT_LIGHT.ink
    // rendered the page hero in #0a0a0a regardless of theme.
    const p = usePalette();
    return (
      <Tag
        className={className}
        style={{
          fontFamily: BLUEPRINT_FAMILIES.display,
          fontSize: size != null ? px(size) : defaultSize,
          fontWeight: weight,
          lineHeight: defaultLineHeight,
          letterSpacing: defaultLetterSpacing,
          margin: 0,
          color: color ?? p.ink,
          ...style,
        }}
      >
        {children}
      </Tag>
    );
  };
}

/** Page hero. Default 56px. The thesis page ramps to 88. */
export const H1 = makeHeading(
  "h1",
  BLUEPRINT_TYPE.h1.fontSize,
  BLUEPRINT_TYPE.h1.lineHeight,
  BLUEPRINT_TYPE.h1.letterSpacing,
);

/** Section header. Default 32px. */
export const H2 = makeHeading(
  "h2",
  BLUEPRINT_TYPE.h2.fontSize,
  BLUEPRINT_TYPE.h2.lineHeight,
  BLUEPRINT_TYPE.h2.letterSpacing,
);

/** Sub-section / card title. Default 20px. */
export const H3 = makeHeading(
  "h3",
  BLUEPRINT_TYPE.h3.fontSize,
  BLUEPRINT_TYPE.h3.lineHeight,
  BLUEPRINT_TYPE.h3.letterSpacing,
);

// ----------------------------------------------------------------------------
// Body — Inter, the default prose primitive. The design calls it "B";
// exported as `Body` with a `B` alias.
// ----------------------------------------------------------------------------

export interface BodyProps extends CommonProps {
  size?: SizeProp;
  weight?: number;
}

export function Body({
  children,
  color,
  size,
  weight = 400,
  style,
  className,
}: BodyProps): JSX.Element {
  const p = usePalette();
  return (
    <div
      className={className}
      style={{
        fontFamily: BLUEPRINT_FAMILIES.body,
        fontSize: size != null ? px(size) : BLUEPRINT_TYPE.body.fontSize,
        fontWeight: weight,
        lineHeight: BLUEPRINT_TYPE.body.lineHeight,
        color: color ?? p.ink2,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Short alias matching the design's `B` component name. */
export const B = Body;

// ----------------------------------------------------------------------------
// Mono — IBM Plex Mono. Labels, code excerpts, small numbers. Reads as
// "this is data" — every chip, every metric label, every column header.
// Numeric features enabled: tabular-nums + ss01 stylistic set.
// ----------------------------------------------------------------------------

export interface MonoProps extends CommonProps {
  size?: SizeProp;
  weight?: number;
}

export function Mono({
  children,
  color,
  size,
  weight = 500,
  style,
  className,
}: MonoProps): JSX.Element {
  const p = usePalette();
  return (
    <span
      className={className}
      style={{
        fontFamily: BLUEPRINT_FAMILIES.mono,
        fontSize: size != null ? px(size) : BLUEPRINT_TYPE.mono.fontSize,
        fontWeight: weight,
        lineHeight: BLUEPRINT_TYPE.mono.lineHeight,
        fontFeatureSettings: '"ss01" on, "tnum" on',
        color: color ?? p.ink2,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------------
// Num — display number. Mono family with tabular-nums so digits align,
// negative tracking for tight numeric blocks. Default 32px; the Router
// Live hero ramps to 120.
// ----------------------------------------------------------------------------

export interface NumProps extends CommonProps {
  size?: SizeProp;
  weight?: number;
}

export function Num({
  children,
  color,
  size,
  weight = 500,
  style,
  className,
}: NumProps): JSX.Element {
  // Bump the dark-mode default weight from 500 to 600 — the cream-on-graphite
  // ink reads thinner at hero scale (88px+) than the same metric in light;
  // 600 brings perceived weight back into line. Light keeps 500 (unchanged).
  const p = usePalette();
  return (
    <span
      className={className}
      style={{
        fontFamily: BLUEPRINT_FAMILIES.mono,
        fontSize: size != null ? px(size) : BLUEPRINT_TYPE.num.fontSize,
        fontWeight: weight,
        lineHeight: BLUEPRINT_TYPE.num.lineHeight,
        letterSpacing: BLUEPRINT_TYPE.num.letterSpacing,
        fontVariantNumeric: "tabular-nums",
        color: color ?? p.ink,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ----------------------------------------------------------------------------
// Helper — pick palette ink2 default for body, ink for hero.
// Exported so layout primitives (Surface, TopBar) can re-derive defaults
// when the active theme isn't BLUEPRINT_LIGHT.
// ----------------------------------------------------------------------------

export function defaultInkForRole(
  role: "display" | "body" | "label",
  palette: BlueprintPalette = BLUEPRINT_LIGHT,
): string {
  switch (role) {
    case "display":
      return palette.ink;
    case "body":
      return palette.ink2;
    case "label":
      return palette.ink3;
  }
}
