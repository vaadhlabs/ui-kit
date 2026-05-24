import { Box, Button, Paper, Skeleton, Typography, useTheme } from "@mui/material";
import type { ReactElement } from "react";
import { formatMoney } from "./charts.js";

export interface SavingsBannerProps {
  /** Total annualized savings $ across all open recommendations (cents). */
  openSavingsAnnualizedCents: number;
  /** Number of open recommendations. */
  openCount: number;
  /** Verified savings to date (already accepted + 30-day-validated). */
  verifiedSavingsCents: number;
  /** Click handler — navigates to the recommendations page filtered to open. */
  onViewRecommendations?: () => void;
  /** Override the loading shape. */
  loading?: boolean;
  /** Hide the banner entirely (e.g. when API failed and we don't want to mislead). */
  hidden?: boolean;
  /** Density: "full" (hero-shape on summary pages) or "compact" (single-line strip on detail pages). */
  variant?: "full" | "compact";
}

/**
 * Pure formatter for the banner copy. Exported so unit tests can cover the
 * money/empty-state logic without rendering the component. Keep this in sync
 * with the copy rules below — the component delegates to this function for
 * the user-visible strings.
 *
 *  - openCount > 0:                     "$Xk/yr of savings on the table — N open recommendations"
 *  - openCount === 0, verified > 0:    "All recommendations applied — checking for new ones daily. $X verified savings YTD."
 *  - openCount === 0, verified === 0:  null (banner is opt-in; consumer renders nothing).
 *
 * Annualized savings below $1,000/yr collapse the headline number — the
 * dollar figure adds noise when it's that small. The supporting metric
 * still surfaces the open count.
 */
export interface BannerCopy {
  /** Primary line; null means the banner should not render. */
  headline: string | null;
  /** Sub-line shown to the right (full variant) or after the headline (compact). */
  detail: string | null;
  /** Tone — controls background gradient + tonal palette. */
  tone: "savings" | "applied";
}

const ANNUALIZED_FLOOR_CENTS = 100_000; // $1,000

function roundAnnualizedCentsToNearest100Dollars(cents: number): number {
  // $100 == 10_000 cents. Round to that grid.
  return Math.round(cents / 10_000) * 10_000;
}

export function formatBannerCopy(
  openSavingsAnnualizedCents: number,
  openCount: number,
  verifiedSavingsCents: number,
): BannerCopy {
  if (openCount === 0 && verifiedSavingsCents === 0) {
    return { headline: null, detail: null, tone: "savings" };
  }

  if (openCount === 0) {
    const verifiedDollars = verifiedSavingsCents / 100;
    return {
      headline: "All recommendations applied — checking for new ones daily.",
      detail: `${formatMoney(verifiedDollars)} verified savings YTD.`,
      tone: "applied",
    };
  }

  const noun = openCount === 1 ? "recommendation" : "recommendations";
  if (openSavingsAnnualizedCents < ANNUALIZED_FLOOR_CENTS) {
    return {
      headline: `${openCount} open ${noun}`,
      detail: null,
      tone: "savings",
    };
  }

  const rounded = roundAnnualizedCentsToNearest100Dollars(openSavingsAnnualizedCents);
  const headline = `${formatMoney(rounded / 100)}/yr of model-routing savings on the table`;
  return {
    headline,
    detail: `${openCount} open ${noun}`,
    tone: "savings",
  };
}

const SAVINGS_GRADIENT_LIGHT = "linear-gradient(90deg, #ECFDF5 0%, #E0F2FE 100%)";
const SAVINGS_GRADIENT_DARK = "linear-gradient(90deg, #064E3B 0%, #0C4A6E 100%)";
const APPLIED_GRADIENT_LIGHT = "linear-gradient(90deg, #ECFDF5 0%, #F0FDF4 100%)";
const APPLIED_GRADIENT_DARK = "linear-gradient(90deg, #064E3B 0%, #052E16 100%)";

/**
 * Always-visible savings surface. Hero-shape (`full`) on summary/overview
 * pages, single-line strip (`compact`) on detail pages where vertical real
 * estate is at a premium. Wave 1 / Agent 3 — drives the post-demo CFO
 * framing push: a CFO landing on any AI-spend page sees the open-savings
 * dollar figure before they have to click into a recommendations sub-page.
 */
export function SavingsBanner({
  openSavingsAnnualizedCents,
  openCount,
  verifiedSavingsCents,
  onViewRecommendations,
  loading = false,
  hidden = false,
  variant = "full",
}: SavingsBannerProps): ReactElement | null {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (hidden) return null;

  if (loading) {
    return (
      <Paper
        data-testid="savings-banner-loading"
        elevation={0}
        sx={{
          p: variant === "full" ? 2 : 1,
          mb: 2,
          minHeight: variant === "full" ? 80 : 40,
          background: isDark ? SAVINGS_GRADIENT_DARK : SAVINGS_GRADIENT_LIGHT,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Skeleton variant="text" width="60%" height={variant === "full" ? 32 : 20} />
        {variant === "full" && <Skeleton variant="text" width="40%" height={20} />}
      </Paper>
    );
  }

  const copy = formatBannerCopy(openSavingsAnnualizedCents, openCount, verifiedSavingsCents);
  if (copy.headline === null) return null;

  const gradient =
    copy.tone === "applied"
      ? isDark
        ? APPLIED_GRADIENT_DARK
        : APPLIED_GRADIENT_LIGHT
      : isDark
        ? SAVINGS_GRADIENT_DARK
        : SAVINGS_GRADIENT_LIGHT;

  const ctaLabel = copy.tone === "applied" ? "View ledger" : "View recommendations";

  if (variant === "compact") {
    return (
      <Paper
        data-testid="savings-banner"
        data-variant="compact"
        data-tone={copy.tone}
        elevation={0}
        sx={{
          px: 2,
          py: 1,
          mb: 2,
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          background: gradient,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {copy.headline}
          {copy.detail ? ` — ${copy.detail}` : ""}
        </Typography>
        {onViewRecommendations && (
          <Button size="small" variant="text" onClick={onViewRecommendations}>
            {ctaLabel}
          </Button>
        )}
      </Paper>
    );
  }

  // full variant
  return (
    <Paper
      data-testid="savings-banner"
      data-variant="full"
      data-tone={copy.tone}
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 3,
        background: gradient,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.625rem",
          }}
        >
          {copy.tone === "applied" ? "All clear" : "Open savings"}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}>
          {copy.headline}
        </Typography>
        {copy.detail && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {copy.detail}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
        {copy.tone !== "applied" && verifiedSavingsCents > 0 && (
          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              sx={{
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 600,
                color: "text.secondary",
                fontSize: "0.625rem",
              }}
            >
              Verified YTD
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {formatMoney(verifiedSavingsCents / 100)}
            </Typography>
          </Box>
        )}
        {onViewRecommendations && (
          <Button variant="contained" size="small" onClick={onViewRecommendations} color="primary">
            {ctaLabel}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
