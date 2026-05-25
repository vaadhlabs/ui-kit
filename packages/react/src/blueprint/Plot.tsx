/**
 * v2 Plot — small inline SVG chart, blueprint visual vocabulary.
 *
 * Five sketches: line / area / bars / spark / step. The shapes are
 * fixed (the design source uses canned paths for visual rhythm); the
 * primitive is for hero placeholders, empty-state illustrations, and
 * Storybook composition. Real data-driven charts use `charts.tsx`
 * (recharts) from the existing kit.
 *
 * Hairline paper3 border on the chart frame. Solid + dashed line pair
 * on the line kind reads as "actual vs forecast". Bars dim the last
 * column in accent to signal "today / latest".
 */
import type { CSSProperties, ReactNode } from "react";
import { Eyebrow, Mono } from "./Text.js";
import { usePalette } from "./ThemeProvider.js";

export type PlotKind = "line" | "area" | "bars" | "spark" | "step";

export interface PlotProps {
  kind?: PlotKind;
  /** SVG width (CSS). Numbers → px. Default 200. */
  w?: number | string;
  /** SVG height (CSS). Numbers → px. Default 80. */
  h?: number | string;
  /** Primary stroke color. Defaults to palette ink. */
  color?: string;
  /** Accent stroke / fill color. Defaults to palette accent. */
  accent?: string;
  /** Optional eyebrow label rendered above. */
  label?: ReactNode;
  /** Optional sub-label, mono. */
  sub?: ReactNode;
  /** Show the chart-frame border. Default true. */
  bordered?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Plot({
  kind = "line",
  w = 200,
  h = 80,
  color,
  accent,
  label,
  sub,
  bordered = true,
  style,
  className,
}: PlotProps): JSX.Element {
  // Use the active palette so dark mode draws cream lines on graphite
  // paper instead of black lines (which would be invisible). The bar
  // and line strokes default to ink2 rather than ink so the chart reads
  // as supporting data, not screaming foreground — the user feedback
  // 2026-05-25 was that ink-on-paper bars looked "too white on dark".
  const p = usePalette();
  const ink = color ?? p.ink2;
  const acc = accent ?? p.accent;
  const svgStyle: CSSProperties = {
    display: "block",
    border: bordered ? `1px solid ${p.paper3}` : "none",
  };

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <Eyebrow>{label}</Eyebrow>}
      {sub && (
        <Mono size={10} color={p.faint}>
          {sub}
        </Mono>
      )}
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        style={svgStyle}
        role="img"
        aria-label={typeof label === "string" ? label : "chart"}
      >
        {/* Gridlines — three faint horizontals */}
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" x2="200" y1={y} y2={y} stroke={p.paper3} strokeWidth="1" />
        ))}
        {kind === "line" && (
          <>
            <path
              d="M0,60 C 22,52 38,46 52,38 C 70,28 92,40 110,30 C 130,18 152,24 172,12 L 200,8"
              stroke={ink}
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0,66 C 22,62 38,56 52,52 C 70,42 92,50 110,42 C 130,32 152,38 172,28 L 200,22"
              stroke={acc}
              strokeWidth="1.5"
              fill="none"
              strokeDasharray="3 2"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
        {kind === "area" && (
          <>
            <path
              d="M0,60 C 22,52 38,46 52,38 C 70,28 92,40 110,30 C 130,18 152,24 172,12 L 200,8 L 200,80 L 0,80 Z"
              fill={acc}
              opacity="0.16"
            />
            <path
              d="M0,60 C 22,52 38,46 52,38 C 70,28 92,40 110,30 C 130,18 152,24 172,12 L 200,8"
              stroke={acc}
              strokeWidth="1.5"
              fill="none"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}
        {kind === "bars" &&
          [60, 52, 64, 48, 36, 28, 24, 30, 26, 22, 18, 14].map((v, i) => (
            <rect key={i} x={5 + i * 16} y={75 - v} width="11" height={v} fill={i === 11 ? acc : ink} />
          ))}
        {kind === "spark" && (
          <polyline
            points="0,40 20,32 40,38 60,24 80,28 100,18 120,22 140,12 160,16 180,8 200,12"
            stroke={acc}
            strokeWidth="1.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {kind === "step" && (
          <polyline
            points="0,60 20,60 20,52 50,52 50,44 80,44 80,38 110,38 110,30 140,30 140,28 170,28 170,18 200,18"
            stroke={ink}
            strokeWidth="1.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
    </div>
  );
}
