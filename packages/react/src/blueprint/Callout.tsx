/**
 * v2 Callout — numbered chip used as the head of a leader line. Always
 * orange (the bet color); only takes a number.
 *
 * Pairs with LeaderCallout (in the W2 data-primitives wave) which
 * supplies the title + body next to the chip.
 */
import type { CSSProperties } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

export interface CalloutProps {
  /** The number that goes inside the circle. */
  n: number | string;
  /** Diameter in px. Default 18. */
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function Callout({ n, size = 18, style, className }: CalloutProps): JSX.Element {
  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "50%",
    background: BLUEPRINT_LIGHT.accent,
    color: "#fff",
    fontFamily: BLUEPRINT_FAMILIES.mono,
    fontSize: size * 0.55,
    fontWeight: 700,
    lineHeight: 1,
    ...style,
  };
  return (
    <span className={className} style={css}>
      {n}
    </span>
  );
}
