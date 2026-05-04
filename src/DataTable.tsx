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
              <TableCell key={c.key} align={c.align ?? "left"} sx={{ width: c.width }}>
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
                  <TableCell key={c.key} align={c.align ?? "left"}>
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
                  <TableCell key={c.key} align={c.align ?? "left"}>
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
