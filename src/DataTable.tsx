import { type ReactNode } from "react";
import {
  Paper,
  Skeleton,
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
  /**
   * Hide this column on viewports narrower than the given MUI breakpoint.
   * Implemented via `display: { xs: "none", <breakpoint>: "table-cell" }`
   * on header + body cells, so the column collapses cleanly without
   * leaving stray padding. Use for secondary metadata that's nice-to-
   * have on desktop but not worth a horizontal scroll on phones.
   */
  hideBelow?: "sm" | "md" | "lg";
}

const HIDE_DISPLAY: Record<NonNullable<DataTableColumn<unknown>["hideBelow"]>, Record<string, string>> = {
  sm: { xs: "none", sm: "table-cell" },
  md: { xs: "none", md: "table-cell" },
  lg: { xs: "none", lg: "table-cell" },
};

function cellDisplay<Row>(c: DataTableColumn<Row>): Record<string, string> | undefined {
  return c.hideBelow ? HIDE_DISPLAY[c.hideBelow] : undefined;
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
}

/**
 * Plain MUI Table wrapper used by every MF's list pages. Kept light (no
 * @mui/x-data-grid) so the shared-bundle cost stays manageable. For heavier
 * grids (sorting, pagination, column resize) we'll graduate to x-data-grid
 * later — the DataTableColumn contract is a subset of its API.
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
}: DataTableProps<Row>): JSX.Element {
  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((c) => (
              <TableCell
                key={c.key}
                align={c.align ?? "left"}
                sx={{ width: c.width, display: cellDisplay(c) }}
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
                {columns.map((c) => (
                  <TableCell key={c.key} align={c.align ?? "left"} sx={{ display: cellDisplay(c) }}>
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
                {columns.map((c) => (
                  <TableCell key={c.key} align={c.align ?? "left"} sx={{ display: cellDisplay(c) }}>
                    {c.render ? c.render(row) : ((row as unknown as Record<string, ReactNode>)[c.key] ?? "—")}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
