import { Box, Typography, type BoxProps } from "@mui/material";
import { type ReactNode } from "react";

export interface DataListPageProps extends Omit<BoxProps, "title"> {
  title: string;
  subtitle?: string;
  /** Right-aligned toolbar content (buttons, filters, search). */
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Standard list-page layout: H4 title + subtitle on the left, actions slot on
 * the right, body below. Every MF "list" page uses this so headers and
 * spacing stay in lockstep across the app.
 */
export function DataListPage({
  title,
  subtitle,
  actions,
  children,
  sx,
  ...rest
}: DataListPageProps): JSX.Element {
  return (
    <Box {...rest} sx={sx}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Box>
      {children}
    </Box>
  );
}
