/**
 * v2 Btn — hairline button. Four variants, two sizes.
 *
 *   default · paper bg, ink text + border. The default action.
 *   inked   · ink bg, paper text. Primary commit.
 *   accent  · accent bg, white text. "The bet" CTA.
 *   ghost   · transparent, ink2 text, paper3 border. Tertiary / row-action.
 *
 * Renders as a real <button type="button"> for accessibility — the
 * design's wireframe used <span>, but production needs keyboard
 * activation and focus rings. Forwarded ref + standard button props
 * passthrough (onClick, disabled, aria-*, etc.).
 */
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";
import type { BlueprintPalette } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

export type BtnVariant = "default" | "inked" | "accent" | "ghost";
export type BtnSize = "sm" | "md";

export interface BtnProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: BtnVariant;
  size?: BtnSize;
  children?: ReactNode;
}

interface BtnTone {
  bg: string;
  fg: string;
  bd: string;
}

function tone(variant: BtnVariant, p: BlueprintPalette): BtnTone {
  switch (variant) {
    case "default":
      return { bg: p.paper, fg: p.ink, bd: p.ink };
    case "inked":
      return { bg: p.ink, fg: p.paper, bd: p.ink };
    case "accent":
      return { bg: p.accent, fg: "#fff", bd: p.accent };
    case "ghost":
      return { bg: "transparent", fg: p.ink2, bd: p.paper3 };
  }
}

const Btn = forwardRef<HTMLButtonElement, BtnProps>(function Btn(
  { variant = "default", size = "md", style, children, type = "button", ...rest },
  ref,
) {
  const palette = usePalette();
  const t = tone(variant, palette);
  const sz = size === "sm" ? { padding: "4px 10px", fontSize: 11 } : { padding: "7px 14px", fontSize: 12 };
  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: BLUEPRINT_FAMILIES.body,
    fontWeight: 500,
    background: t.bg,
    color: t.fg,
    border: `1px solid ${t.bd}`,
    borderRadius: 8,
    cursor: rest.disabled ? "not-allowed" : "pointer",
    opacity: rest.disabled ? 0.55 : 1,
    ...sz,
    ...style,
  };
  return (
    <button ref={ref} type={type} style={css} {...rest}>
      {children}
    </button>
  );
});

export { Btn };
