/**
 * v2 Table — ruled engineering BOM. Hairline ink outer border, paper3
 * inner separators, paper2 header band, optional zebra striping.
 *
 * Column config supplies key, label, optional width (defaults 1fr),
 * mono flag (renders cells in IBM Plex Mono), align, and a flag for
 * right-align on numerics. Row data is keyed by col.key; cell value
 * can be any ReactNode (Tag, Btn, plain text, mono number).
 *
 * Intentionally NOT a sortable / virtualized table — this is the
 * blueprint primitive for fixed-result-set rendering (decisions feed,
 * eval per-model table, instance grid, audit log preview). Consumers
 * wanting interaction use DataTable from the Workshop kit.
 */
import type { CSSProperties, ReactNode } from "react";
import { BLUEPRINT_FAMILIES, BLUEPRINT_LIGHT } from "@tensorcost/tokens";

export type Align = "left" | "right" | "center";

export interface TableColumn<TKey extends string = string> {
  key: TKey;
  /** Header label. */
  label: ReactNode;
  /** CSS grid track size. Defaults to "1fr". */
  w?: string;
  /** Render the cell in mono font. */
  mono?: boolean;
  /** Cell text alignment. */
  align?: Align;
}

export type TableRow = Record<string, ReactNode> & {
  /** Override background for a single row (e.g. accent-highlighted row). */
  __bg?: string;
};

export interface TableProps {
  cols: readonly TableColumn[];
  rows: readonly TableRow[];
  /** Apply alternating row backgrounds. Default true. */
  zebra?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Table({
  cols,
  rows,
  zebra = true,
  style,
  className,
}: TableProps): JSX.Element {
  const p = BLUEPRINT_LIGHT;
  const tracks = cols.map((c) => c.w ?? "1fr").join(" ");
  return (
    <div
      role="table"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: p.ink,
        ...style,
      }}
    >
      {/* Header */}
      <div
        role="row"
        style={{
          display: "grid",
          gridTemplateColumns: tracks,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: p.ink,
          background: p.paper2,
        }}
      >
        {cols.map((c, i) => {
          const last = i === cols.length - 1;
          return (
            <div
              role="columnheader"
              key={c.key}
              style={{
                padding: "8px 14px",
                borderRightWidth: last ? 0 : 1,
                borderRightStyle: "solid",
                borderRightColor: p.paper3,
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: p.ink3,
                textAlign: c.align ?? "left",
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>
      {/* Rows */}
      {rows.map((row, ri) => {
        const last = ri === rows.length - 1;
        const bg = row.__bg ?? (zebra && ri % 2 ? p.paper : "transparent");
        return (
          <div
            role="row"
            key={ri}
            style={{
              display: "grid",
              gridTemplateColumns: tracks,
              borderBottomWidth: last ? 0 : 1,
              borderBottomStyle: "solid",
              borderBottomColor: p.paper3,
              background: bg,
            }}
          >
            {cols.map((c, ci) => {
              const lastCol = ci === cols.length - 1;
              return (
                <div
                  role="cell"
                  key={c.key}
                  style={{
                    padding: "10px 14px",
                    borderRightWidth: lastCol ? 0 : 1,
                    borderRightStyle: "solid",
                    borderRightColor: p.paper3,
                    fontFamily: c.mono ? BLUEPRINT_FAMILIES.mono : BLUEPRINT_FAMILIES.body,
                    fontSize: c.mono ? 11 : 13,
                    color: p.ink,
                    textAlign: c.align ?? "left",
                    minWidth: 0,
                    overflow: "hidden",
                  }}
                >
                  {row[c.key]}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
