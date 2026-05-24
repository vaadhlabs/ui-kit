import { type ReactElement, type ReactNode } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { DataTableColumn } from "./DataTable.js";

export interface RowDetailsDialogProps<Row> {
  /** When non-null, the dialog is open and shows this row. Pass `null` to close. */
  row: Row | null;
  /** Column descriptors; their `header` and `render` are reused as label/value. */
  columns: readonly DataTableColumn<Row>[];
  onClose: () => void;
  /** Optional title; defaults to "Details". */
  title?: string;
  /**
   * Optional sub-header rendered below the title (e.g. a chip showing the
   * row's status, or a relative timestamp). Receives the open row.
   */
  subheader?: (row: Row) => ReactNode;
}

/**
 * Mobile-first row-detail viewer. Used alongside `<DataTable
 * stickyFirstColumn onRowClick={setOpenRow} />` so a phone user can tap a
 * row in a wide table and see every column as a label/value list — no
 * horizontal-scroll fiddling, no column auto-hiding. Reuses the same
 * `DataTableColumn[]` definitions the table renders, so labels and
 * formatters stay in lockstep.
 *
 * Renders nothing when `row` is null. Dialog closes on backdrop click,
 * the X button, or when the parent flips `row` back to null.
 */
export function RowDetailsDialog<Row>({
  row,
  columns,
  onClose,
  title = "Details",
  subheader,
}: RowDetailsDialogProps<Row>): ReactElement {
  return (
    <Dialog
      open={row !== null}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      // On phones we want this to feel like a sheet, not a card; MUI
      // doesn't bottom-sheet by default but full-screen below sm gives
      // the same effect with less custom CSS.
      sx={{ "& .MuiDialog-paper": { m: { xs: 0, sm: 2 }, width: { xs: "100%", sm: "auto" } } }}
    >
      <DialogTitle sx={{ pr: 6 }}>
        {title}
        {row != null && subheader && (
          <Box sx={{ mt: 0.5 }}>{subheader(row)}</Box>
        )}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {row != null && (
          <Stack spacing={2}>
            {columns.map((c) => (
              <Box key={c.key}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}
                >
                  {c.header}
                </Typography>
                <Box sx={{ mt: 0.25 }}>
                  {c.render
                    ? c.render(row)
                    : ((row as unknown as Record<string, ReactNode>)[c.key] ?? (
                        <Typography variant="body2" color="text.disabled">
                          —
                        </Typography>
                      ))}
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
