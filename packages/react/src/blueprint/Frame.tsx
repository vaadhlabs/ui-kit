/**
 * v2 Frame — a hairline drawn-screen window. Used for standalone
 * storyboards, public status pages, and the embed/widget chrome. The
 * authenticated shell does NOT use Frame — it owns the chrome itself.
 *
 * The title-bar `mono` label reads as an architectural-drawing path
 * ("/router · live") and the three small squares in the top-right are a
 * visual nod to a screen capture, no functional purpose.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

export interface FrameProps {
  /** Path-style title in the top-bar — "/router · live". */
  title?: string;
  /** Optional secondary line next to the title. */
  sub?: string;
  /** Explicit width. Default desktop = 1280, mobile = 380. */
  w?: number | string;
  h?: number | string;
  mobile?: boolean;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

export function Frame({
  title,
  sub,
  w,
  h,
  mobile = false,
  style,
  className,
  children,
}: FrameProps): JSX.Element {
  const p = usePalette();
  const outer: CSSProperties = {
    width: w ?? (mobile ? 380 : 1280),
    height: h,
    background: p.paper,
    border: `1px solid ${p.ink}`,
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    overflow: "hidden",
    ...style,
  };
  return (
    <div className={className} style={outer}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          padding: "10px 16px",
          borderBottom: `1px solid ${p.ink}`,
        }}
      >
        {title && (
          <span
            style={{
              fontFamily: BLUEPRINT_FAMILIES.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: p.ink3,
            }}
          >
            {title}
          </span>
        )}
        {sub && (
          <span style={{ fontFamily: BLUEPRINT_FAMILIES.body, fontSize: 12, color: p.ink3 }}>
            {sub}
          </span>
        )}
        <span style={{ marginLeft: "auto", display: "flex", gap: 4 }} aria-hidden>
          <span style={{ width: 12, height: 12, border: `1px solid ${p.ink3}` }} />
          <span style={{ width: 12, height: 12, border: `1px solid ${p.ink3}` }} />
          <span style={{ width: 12, height: 12, border: `1px solid ${p.ink3}` }} />
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>{children}</div>
    </div>
  );
}
