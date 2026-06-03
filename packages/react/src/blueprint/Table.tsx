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
 *
 * --- Column resizing (opt-in) ---
 *
 * Pass `resizable="<unique-key>"` to enable drag handles on header cells.
 * The user drags the right edge of any header cell to set an explicit pixel
 * width for that column; all other columns keep their `w` CSS track.
 *
 * Widths are persisted to `localStorage["tc_col_widths_<key>"]` so the
 * layout survives page reloads. Use a unique key per table so tables don't
 * stomp each other's preferences.
 *
 * Implementation:
 *   - Drag handle is an 8px overlay <div> at the right edge of each header.
 *   - Pointer capture keeps the drag live even when the pointer leaves the cell.
 *   - Minimum column width is 48px to prevent accidental collapse.
 *   - When `resizable` is absent the component is purely presentational with
 *     no extra hooks or state.
 */
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BLUEPRINT_FAMILIES } from "@tensorcost/tokens";
import { usePalette } from "./ThemeProvider.js";

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
  /**
   * Enable column-resize drag handles. Value must be a unique string per
   * table instance — it is used as the localStorage key suffix so that
   * multiple tables on the same page persist independent width preferences.
   *
   * Example: `resizable="admin-audit-log"` stores widths under
   * `localStorage["tc_col_widths_admin-audit-log"]`.
   */
  resizable?: string;
}

// ── localStorage helpers ────────────────────────────────────────────────────

const MIN_COL_PX = 48;

function lsKey(tableKey: string): string {
  return `tc_col_widths_${tableKey}`;
}

function loadWidths(tableKey: string): Record<string, number> {
  try {
    const raw = localStorage.getItem(lsKey(tableKey));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(
        ([, v]) => typeof v === "number",
      ) as [string, number][],
    );
  } catch {
    return {};
  }
}

function saveWidths(tableKey: string, widths: Record<string, number>): void {
  try {
    localStorage.setItem(lsKey(tableKey), JSON.stringify(widths));
  } catch {
    // Quota exceeded or private browsing — silently degrade.
  }
}

// ── ResizableTable ──────────────────────────────────────────────────────────

/**
 * Rendered when `resizable` prop is provided. Kept as a separate component so
 * the non-resizable path carries zero hook overhead.
 */
function ResizableTable({
  cols,
  rows,
  zebra,
  style,
  className,
  storageKey,
}: Omit<TableProps, "resizable"> & { storageKey: string }): JSX.Element {
  const p = usePalette();

  const [colWidths, setColWidths] = useState<Record<string, number>>(
    () => loadWidths(storageKey),
  );

  useEffect(() => {
    saveWidths(storageKey, colWidths);
  }, [colWidths, storageKey]);

  // Refs to header cell elements so we can read offsetWidth at drag-start
  // without needing a separate measurement pass. The array length equals
  // cols.length and does not change across renders (columns are stable).
  const headerCellRefs = useRef<Array<HTMLDivElement | null>>(
    Array.from({ length: cols.length }, () => null),
  );

  // Mutable drag state — no setState here because we don't want re-renders
  // on every pointer move. colWidths state is updated instead.
  const dragRef = useRef<{
    colKey: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, colKey: string, colIdx: number) => {
      e.preventDefault();
      // jsdom (tests) doesn't implement pointer capture — guard the call.
      const target = e.currentTarget as HTMLDivElement;
      if (typeof target.setPointerCapture === "function") {
        target.setPointerCapture(e.pointerId);
      }
      const cell = headerCellRefs.current[colIdx];
      const startWidth =
        colWidths[colKey] ??
        (cell ? cell.offsetWidth : 120);
      dragRef.current = { colKey, startX: e.clientX, startWidth };
    },
    [colWidths],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    const next = Math.max(MIN_COL_PX, dragRef.current.startWidth + delta);
    setColWidths((prev) => ({ ...prev, [dragRef.current!.colKey]: next }));
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const tracks = cols
    .map((c) => {
      const explicit = colWidths[c.key];
      return explicit !== undefined ? `${explicit}px` : (c.w ?? "1fr");
    })
    .join(" ");

  return (
    <div
      role="table"
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: p.paper3,
        borderRadius: 12,
        overflow: "hidden",
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
          borderBottomColor: p.paper3,
          background: p.paper2,
        }}
      >
        {cols.map((c, i) => {
          const last = i === cols.length - 1;
          return (
            <div
              ref={(el) => { headerCellRefs.current[i] = el; }}
              role="columnheader"
              key={c.key}
              style={{
                position: "relative",
                padding: "8px 14px",
                // Reserve right padding for the resize handle on all but the
                // last column so the label text doesn't bleed underneath it.
                paddingRight: last ? 14 : 22,
                borderRightWidth: last ? 0 : 1,
                borderRightStyle: "solid",
                borderRightColor: p.paper3,
                fontFamily: BLUEPRINT_FAMILIES.mono,
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: p.ink3,
                textAlign: c.align ?? "left",
                userSelect: "none",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              {c.label}
              {!last && (
                // Drag handle — 8px overlay on the right edge of the header cell.
                // pointer-capture keeps the drag alive even when the pointer
                // moves outside the element bounds.
                <div
                  aria-hidden="true"
                  data-testid={`col-resize-${c.key}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 8,
                    height: "100%",
                    cursor: "col-resize",
                    zIndex: 1,
                  }}
                  onPointerDown={(e) => onPointerDown(e, c.key, i)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                />
              )}
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
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
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

// ── Plain (non-resizable) Table ─────────────────────────────────────────────

export function Table({
  cols,
  rows,
  zebra = true,
  style,
  className,
  resizable,
}: TableProps): JSX.Element {
  const p = usePalette();

  if (resizable !== undefined) {
    return (
      <ResizableTable
        cols={cols}
        rows={rows}
        zebra={zebra}
        style={style}
        className={className}
        storageKey={resizable}
      />
    );
  }

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
