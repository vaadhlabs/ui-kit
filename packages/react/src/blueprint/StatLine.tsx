/**
 * v2 StatLine — a bordered horizontal strip of stat cells.
 *
 * Each cell shows label (eyebrow) + value (Num) + optional unit + delta.
 * Cells share width via flex; cell separators are 1px paper3, the
 * strip itself is bracketed by 1px ink top + bottom.
 *
 * Used on Router · Live, Money · Explorer, Trust · Controls — anywhere
 * a hero number wants 3–6 sibling stats at the same density.
 */
import type { CSSProperties, ReactNode } from "react";
import type { BlueprintPalette } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";
import { Eyebrow, Mono, Num } from "./Text.js";

export type DeltaKind = "good" | "warn" | "red" | "neutral";

export interface StatItem {
  label: ReactNode;
  /** Primary value — renders inside Num (mono, tabular-nums). */
  value: ReactNode;
  /** Optional unit suffix — "/yr", "ms", "decisions". */
  unit?: ReactNode;
  /** Optional small delta below — "+31%", "−0.4 pp". */
  delta?: ReactNode;
  /** Color the delta. Default "neutral" → ink3. */
  deltaKind?: DeltaKind;
  /** Optional override for the value font size. */
  valueSize?: number;
}

export interface StatLineProps {
  items: readonly StatItem[];
  style?: CSSProperties;
  className?: string;
}

// Palette passed in by the caller — usePalette is a hook and can't
// be called inside this plain helper without breaking rules-of-hooks.
function deltaColor(kind: DeltaKind | undefined, p: BlueprintPalette): string {
  switch (kind) {
    case "good":
      return p.good;
    case "warn":
      return p.warn;
    case "red":
      return p.danger;
    default:
      return p.ink3;
  }
}

export function StatLine({ items, style, className }: StatLineProps): JSX.Element {
  const p = usePalette();
  return (
    <div
      className={className}
      style={{
        display: "flex",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderStyle: "solid",
        borderColor: p.ink,
        ...style,
      }}
    >
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRightWidth: last ? 0 : 1,
              borderRightStyle: "solid",
              borderRightColor: p.paper3,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              minWidth: 0,
            }}
          >
            <Eyebrow size={9}>{it.label}</Eyebrow>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <Num size={it.valueSize ?? 26}>{it.value}</Num>
              {it.unit && <Mono size={11} color={p.ink3}>{it.unit}</Mono>}
            </div>
            {it.delta && (
              <Mono size={10} color={deltaColor(it.deltaKind, p)}>
                {it.delta}
              </Mono>
            )}
          </div>
        );
      })}
    </div>
  );
}
