/**
 * v2 Callout — numbered chip used as the head of a leader line. Carries the
 * brand blue→cyan gradient (the "bet" marker), matching the marketing site's
 * hero numbers and the rail active-edge.
 *
 * Pairs with LeaderCallout (in the W2 data-primitives wave) which
 * supplies the title + body next to the chip.
 */
import type { CSSProperties, HTMLAttributes } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";

/** Brand sweep — kept in sync with Num's gradient and the rail marker. */
const BRAND_GRADIENT = "linear-gradient(135deg, #3b82f6, #06b6d4)";

export interface CalloutProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** The number that goes inside the circle. */
  n: number | string;
  /** Diameter in px. Default 18. */
  size?: number;
}

export function Callout({ n, size = 18, style, className, ...rest }: CalloutProps): JSX.Element {
  const css: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: size,
    height: size,
    borderRadius: "50%",
    background: BRAND_GRADIENT,
    color: "#fff",
    fontFamily: BLUEPRINT_FAMILIES.mono,
    fontSize: size * 0.55,
    fontWeight: 700,
    lineHeight: 1,
    ...style,
  };
  return (
    <span className={className} style={css} {...rest}>
      {n}
    </span>
  );
}
