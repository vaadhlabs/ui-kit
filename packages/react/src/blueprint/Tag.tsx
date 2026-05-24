/**
 * v2 Tag — uppercase mono pill. Six tonal variants, two sizes.
 *
 *   default · ink2 text, ink3 border, no fill. The default status chip.
 *   accent  · accent text + border, accentBg fill. "The bet" call-out.
 *   inked   · paper text, ink border + fill. Inverted state.
 *   good / warn / red · status tones, transparent fill.
 *
 * Square corners. 9px font weight 600 with wide tracking — reads as a
 * spec-sheet label, not a UI chip.
 */
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

export type TagVariant = "default" | "accent" | "inked" | "good" | "warn" | "red";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  variant?: TagVariant;
  children?: ReactNode;
}

interface TagTone {
  color: string;
  bd: string;
  bg: string;
}

function tone(variant: TagVariant): TagTone {
  const p = BLUEPRINT_LIGHT;
  switch (variant) {
    case "default":
      return { color: p.ink2, bd: p.ink3, bg: "transparent" };
    case "accent":
      return { color: p.accent, bd: p.accent, bg: p.accentBg };
    case "inked":
      return { color: p.paper, bd: p.ink, bg: p.ink };
    case "good":
      return { color: p.good, bd: p.good, bg: "transparent" };
    case "warn":
      return { color: p.warn, bd: p.warn, bg: "transparent" };
    case "red":
      return { color: p.danger, bd: p.danger, bg: "transparent" };
  }
}

export function Tag({
  variant = "default",
  style,
  children,
  ...rest
}: TagProps): JSX.Element {
  const t = tone(variant);
  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 6px",
    fontFamily: BLUEPRINT_FAMILIES.mono,
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: t.color,
    border: `1px solid ${t.bd}`,
    background: t.bg,
    ...style,
  };
  return (
    <span style={css} {...rest}>
      {children}
    </span>
  );
}
