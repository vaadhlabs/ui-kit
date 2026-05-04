import { type ReactNode } from "react";
import {
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export interface DataTableColumn<Row> {
  key: string;
  header: string;
  width?: number | string;
  align?: "left" | "right" | "center";
  render?: (row: Row) => ReactNode;
}

export interface DataTableProps<Row> {
  rows: Row[];
  columns: readonly DataTableColumn<Row>[];
  getRowKey: (row: Row) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (row: Row) => void;
  /** Number of skeleton rows to render while loading. Default 5. */
  skeletonRows?: number;
  /**
   * When set, viewports below the `mobileBreakpoint` (default `sm`) render
   * each row as a card via this function instead of as a table row. The
   * page author decides what's primary on the mobile card — DataTable does
   * not auto-hide columns. Above the breakpoint, the regular table renders.
   *
   * Use for tables with up to ~5 columns where the row identifier and
   * primary metric fit naturally on a card. For dense transactional
   * tables prefer `stickyFirstColumn` + `onRowClick` + `RowDetailsDialog`.
   */
  mobileCard?: (row: Row) => ReactNode;
  /**
   * MUI breakpoint at which the table view kicks in. Defaults to "sm"
   * (600px). Below this width the `mobileCard` renderer is used (when
   * provided); at and above, the table is used.
   */
  mobileBreakpoint?: "sm" | "md";
  /**
   * Pin the first column to the left edge of the scroll container so it
   * stays visible as the user scrolls horizontally on mobile. Use for
   * dense tables where the first column is the row identifier (id, name,
   * timestamp). Requires the table to be wrapped in a TableContainer that
   * actually scrolls — DataTable provides one by default.
   */
  stickyFirstColumn?: boolean;
}

const STICKY_HEAD_SX = {
  position: "sticky" as const,
  left: 0,
  zIndex: 3,
  bgcolor: "background.paper",
  // Subtle right-shadow indicates more content scrolls behind it.
  boxShadow: "2px 0 4px -2px rgba(0,0,0,0.08)",
};
const STICKY_BODY_SX = {
  position: "sticky" as const,
  left: 0,
  zIndex: 1,
  bgcolor: "background.paper",
  boxShadow: "2px 0 4px -2px rgba(0,0,0,0.08)",
};

/**
 * Plain MUI Table wrapper used by every MF's list pages. Kept light (no
 * @mui/x-data-grid) so the shared-bundle cost stays manageable. For heavier
 * grids (sorting, pagination, column resize) we'll graduate to x-data-grid
 * later — the DataTableColumn contract is a subset of its API.
 *
 * Mobile responsiveness — page author opts in to one of two patterns:
 *   1. `mobileCard={(row) => …}` — below the breakpoint render rows as cards.
 *   2. `stickyFirstColumn` + `onRowClick` (open a RowDetailsDialog) — keep the
 *      table but pin the row identifier and surface full record on tap.
 * No automatic column hiding; the page chooses what's primary.
 */
export function DataTable<Row>({
  rows,
  columns,
  getRowKey,
  loading,
  error,
  emptyMessage = "No rows to display.",
  onRowClick,
  skeletonRows = 5,
  mobileCard,
  mobileBreakpoint = "sm",
  stickyFirstColumn,
}: DataTableProps<Row>): JSX.Element {
  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  // ── Mobile card view ──────────────────────────────────────────────────
  // Below `mobileBreakpoint`, render rows as a stack of cards. The table
  // view is hidden via `display`. Rendered conditionally so the cards
  // don't pay layout cost on desktop and vice versa.
  const cardOnlyAtXs = { xs: "block", [mobileBreakpoint]: "none" };
  const tableOnlyAtBp = { xs: "none", [mobileBreakpoint]: "block" };

  const headSx = (idx: number): Record<string, unknown> | undefined =>
    stickyFirstColumn && idx === 0 ? STICKY_HEAD_SX : undefined;
  const bodySx = (idx: number): Record<string, unknown> | undefined =>
    stickyFirstColumn && idx === 0 ? STICKY_BODY_SX : undefined;

  return (
    <>
      {mobileCard && (
        <Box sx={{ display: cardOnlyAtXs }}>
          {loading ? (
            <Stack spacing={1.5}>
              {Array.from({ length: skeletonRows }).map((_, i) => (
                <Paper key={`sk-${i}`} sx={{ p: 2 }}>
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
                </Paper>
              ))}
            </Stack>
          ) : rows.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {emptyMessage}
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={1.5}>
              {rows.map((row) => {
                const key = getRowKey(row);
                const card = mobileCard(row);
                return onRowClick ? (
                  <Box
                    key={key}
                    onClick={() => onRowClick(row)}
                    sx={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0}
                  >
                    {card}
                  </Box>
                ) : (
                  <Box key={key}>{card}</Box>
                );
              })}
            </Stack>
          )}
        </Box>
      )}

      <Box sx={mobileCard ? { display: tableOnlyAtBp } : undefined}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((c, idx) => (
                  <TableCell
                    key={c.key}
                    align={c.align ?? "left"}
                    sx={{ width: c.width, ...headSx(idx) }}
                  >
                    {c.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    {columns.map((c, idx) => (
                      <TableCell key={c.key} align={c.align ?? "left"} sx={bodySx(idx)}>
                        <Skeleton width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={getRowKey(row)}
                    hover={Boolean(onRowClick)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    sx={{ cursor: onRowClick ? "pointer" : "default" }}
                  >
                    {columns.map((c, idx) => (
                      <TableCell key={c.key} align={c.align ?? "left"} sx={bodySx(idx)}>
                        {c.render ? c.render(row) : ((row as unknown as Record<string, ReactNode>)[c.key] ?? "—")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
