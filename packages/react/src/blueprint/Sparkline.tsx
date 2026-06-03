/**
 * v2 Sparkline — a real data-driven trend line (unlike Plot, which is a
 * decorative sketch). Pass a numeric series; it draws a compact line with an
 * optional area fill in the brand blue→cyan gradient and a dot on the latest
 * point. Use for stat tiles / hero figures where a true series is available.
 */
import { useId } from "react";
import { usePalette } from "./ThemeProvider.js";

export interface SparklineProps {
  /** The series, oldest → newest. Needs at least 2 points to render. */
  data: number[];
  w?: number;
  h?: number;
  /** Draw the line in the brand gradient (default) vs a solid `color`. */
  gradient?: boolean;
  /** Solid stroke colour when `gradient` is false. Defaults to palette accent. */
  color?: string;
  /** Soft area fill under the line. Default true. */
  fill?: boolean;
}

export function Sparkline({ data, w = 132, h = 34, gradient = true, color, fill = true }: SparklineProps): JSX.Element {
  const p = usePalette();
  const gid = useId().replace(/:/g, "");
  const n = data.length;
  if (n < 2) return <svg width={w} height={h} aria-hidden />;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 3;
  const x = (i: number): number => (w * i) / (n - 1);
  const y = (v: number): number => h - pad - (h - pad * 2) * ((v - min) / range);

  const pts = data.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const line = `M${pts.join(" L")}`;
  const area = `${line} L${w.toFixed(1)},${h} L0,${h} Z`;
  const lastY = y(data[n - 1] ?? min);
  const stroke = gradient ? `url(#${gid}-s)` : color ?? p.accent;
  const dot = color ?? "#06b6d4";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label="trend">
      <defs>
        <linearGradient id={`${gid}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id={`${gid}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" stopOpacity="0.22" />
          <stop offset="1" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gid}-f)`} />}
      <path d={line} fill="none" stroke={stroke} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(n - 1)} cy={lastY} r={2.4} fill={dot} />
    </svg>
  );
}
