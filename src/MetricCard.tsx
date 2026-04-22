import { cloneElement, type ReactElement } from "react";
import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

const COLOR_MAP: Record<string, string> = {
  primary: "#3B82F6",
  secondary: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
};

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactElement;
  color?: keyof typeof COLOR_MAP | string;
  subtitle?: string;
}

/**
 * KPI card — ported from apps/gpu-dashboard-frontend/src/components/MetricCard.jsx.
 * Title (overline) / big value / optional subtitle, with a coloured icon badge.
 */
export function MetricCard({ title, value, icon, color = "primary", subtitle }: MetricCardProps): JSX.Element {
  const theme = useTheme();
  const colorValue = color.startsWith("#") ? color : COLOR_MAP[color] ?? COLOR_MAP.primary;
  const isDark = theme.palette.mode === "dark";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1, p: 2, "&:last-child": { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                color: "text.disabled",
                fontSize: "0.625rem",
                lineHeight: 1,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                lineHeight: 1.2,
                mt: 0.75,
                fontSize: { xs: "1.25rem", sm: "1.375rem" },
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ mt: 0.5, color: "text.disabled", fontSize: "0.6875rem" }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${colorValue}${isDark ? "25" : "12"}`,
              borderRadius: 2.5,
              p: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              ml: 1,
            }}
          >
            {cloneElement(icon as ReactElement<{ sx?: object }>, { sx: { fontSize: 20, color: colorValue } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
