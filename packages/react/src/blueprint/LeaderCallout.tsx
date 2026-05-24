/**
 * v2 LeaderCallout — numbered callout + title + body, points left or right.
 *
 * Pairs with the Callout chip. Used for the "leader line" annotations
 * on hero pages: 1️⃣ The frontier is the product · 2️⃣ Quality is
 * continuous · etc. Title renders in eyebrow style + accent color;
 * body renders as small Body.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";
import { Callout } from "./Callout.js";
import { Eyebrow } from "./Text.js";

export interface LeaderCalloutProps {
  /** Number shown in the orange chip. */
  n: number | string;
  /** Title — small accent uppercase kicker. */
  title: ReactNode;
  /** Body prose under the title. */
  body: ReactNode;
  /** Which side the chip sits on. Default "left". */
  direction?: "left" | "right";
  /** Container width. Number → px. */
  w?: number | string;
  style?: CSSProperties;
  className?: string;
}

export function LeaderCallout({
  n,
  title,
  body,
  direction = "left",
  w = 220,
  style,
  className,
}: LeaderCalloutProps): JSX.Element {
  const p = BLUEPRINT_LIGHT;
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: direction === "left" ? "row" : "row-reverse",
        alignItems: "flex-start",
        gap: 10,
        width: w,
        ...style,
      }}
    >
      <Callout n={n} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Eyebrow color={p.accent} size={9}>
          {title}
        </Eyebrow>
        <div
          style={{
            fontFamily: BLUEPRINT_FAMILIES.body,
            fontSize: 12,
            lineHeight: 1.4,
            color: p.ink2,
            marginTop: 3,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
}
