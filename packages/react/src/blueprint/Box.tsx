/**
 * v2 Box — the hairline container. Five variants, one component.
 *
 *   solid  · paper bg, 1px ink border. Default chrome.
 *   soft   · paper bg, 1px paper3 border. In-card / nested.
 *   accent · accentBg fill, 1px accent border. "The bet" highlight.
 *   inked  · ink bg, paper foreground. Inverted blocks (code samples).
 *   ghost  · transparent, 1px dashed faint. Placeholders / drop zones.
 *
 * No rounded corners (v2 visual language). Sizing via `w` / `h` props,
 * padding via `p` (default 16). Passes through any HTMLDivElement attrs.
 */
import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { BlueprintPalette } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

export type BoxVariant = "solid" | "soft" | "accent" | "inked" | "ghost";

export interface BoxProps extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  variant?: BoxVariant;
  /** Width — number → px, string → passed through. */
  w?: number | string;
  /** Height — number → px, string → passed through. */
  h?: number | string;
  /** Padding — number → px, string → passed through. Defaults to 16. */
  p?: number | string;
  children?: ReactNode;
}

// Variants resolved against the active palette so paper/ink swap on
// dark mode. The function used to capture BLUEPRINT_LIGHT directly,
// which meant every Box rendered the light palette regardless of
// theme — the "solid" Box variant on a Money/Policy/etc. page kept
// painting a vellum-white card in the middle of a dark page.
function variantStyle(variant: BoxVariant, p: BlueprintPalette): CSSProperties {
  switch (variant) {
    case "solid":
      return { background: p.paper, border: `1px solid ${p.ink}` };
    case "soft":
      return { background: p.paper, border: `1px solid ${p.paper3}` };
    case "accent":
      return { background: p.accentBg, border: `1px solid ${p.accent}` };
    case "inked":
      return { background: p.ink, border: `1px solid ${p.ink}`, color: p.paper };
    case "ghost":
      return { background: "transparent", border: `1px dashed ${p.faint}` };
  }
}

const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { variant = "solid", w, h, p = 16, style, children, ...rest },
  ref,
) {
  const palette = usePalette();
  return (
    <div
      ref={ref}
      style={{
        ...variantStyle(variant, palette),
        width: w,
        height: h,
        padding: p,
        boxSizing: "border-box",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

export { Box };
