import { Box, Paper, Typography, useTheme } from "@mui/material";
import type { ReactElement, ReactNode } from "react";

/** Shared chart colour tokens. Kept in sync with theme.ts palette. */
export const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#06B6D4",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
} as const;

export const CHART_PALETTE: readonly string[] = [
  "#3B82F6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
];

export function useAxisStyle(): { tick: object; axisLine: object; tickLine: false } {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return {
    tick: { fontSize: 11, fill: isDark ? "#94A3B8" : "#64748B" },
    axisLine: { stroke: isDark ? "#334155" : "#E2E8F0" },
    tickLine: false,
  };
}

export function useGridStyle(): { stroke: string; strokeDasharray: string } {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return { stroke: isDark ? "#334155" : "#E2E8F0", strokeDasharray: "3 3" };
}

interface ChartTooltipPayload {
  name?: string;
  value?: number | string;
  color?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: ReactNode;
  formatter?: (v: number | string | undefined) => ReactNode;
}

export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps): ReactElement | null {
  const theme = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <Paper
      sx={{
        p: 1.5,
        borderRadius: 2,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        minWidth: 120,
      }}
    >
      <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500 }}>
        {label}
      </Typography>
      {payload.map((entry, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: entry.color, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, fontSize: "0.8125rem" }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}

/** USD formatter used across cost dashboards. */
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
export function formatMoney(value: number | string | undefined): string {
  if (value == null) return "—";
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  return usd.format(n);
}
