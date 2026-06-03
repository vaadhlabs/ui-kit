/**
 * v2 Ring — compact circular progress gauge. The track is paper3; the arc is
 * the brand blue→cyan gradient in the healthy range, stepping to the semantic
 * warn / danger colour as the value climbs (so an over-budget ring still reads
 * red at a glance). Pairs with the budget / utilisation heroes.
 */
import { useId } from "react";
import { usePalette } from "./ThemeProvider.js";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";

export interface RingProps {
  /** 0–100. Values above 100 clamp the arc but still show the real label. */
  value: number;
  size?: number;
  stroke?: number;
  /** Hide the centered %-label (e.g. when paired with an external number). */
  hideLabel?: boolean;
}

export function Ring({ value, size = 72, stroke = 8, hideLabel = false }: RingProps): JSX.Element {
  const p = usePalette();
  const gid = useId();
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(value, 100));
  const offset = circ * (1 - pct / 100);
  const semantic = value > 100 ? p.danger : value >= 80 ? p.warn : null;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${Math.round(value)} percent`}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.paper3} strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={semantic ?? `url(#${gid})`}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {!hideLabel && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={BLUEPRINT_FAMILIES.display}
          fontSize={size * 0.26}
          fontWeight={700}
          fill={p.ink}
        >
          {Math.round(value)}%
        </text>
      )}
    </svg>
  );
}
