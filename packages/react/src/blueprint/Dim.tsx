/**
 * v2 Dim — engineering dimension line. ◾━━ label ━━◾
 *
 * The architectural-drawing nod that says "this is N px wide" / "this
 * column is 240px". Used in design-system stories and onboarding
 * tutorials that explain layout primitives. Pure decoration.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

export interface DimProps {
  /** Total width. Default 200. */
  w?: number | string;
  /** Mono label rendered in the middle. */
  label: ReactNode;
  /** Stroke + label color. Defaults to palette accent. */
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Dim({
  w = 200,
  label,
  color,
  style,
  className,
}: DimProps): JSX.Element {
  const c = color ?? BLUEPRINT_LIGHT.accent;
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", width: w, ...style }}
      aria-hidden
    >
      <span style={{ width: 1, height: 10, background: c }} />
      <span style={{ flex: 1, height: 1, background: c }} />
      <span
        style={{
          padding: "0 6px",
          fontFamily: BLUEPRINT_FAMILIES.mono,
          fontSize: 9,
          color: c,
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: c }} />
      <span style={{ width: 1, height: 10, background: c }} />
    </div>
  );
}
