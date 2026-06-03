/**
 * PricingTable — presentational pricing grid with a monthly/yearly toggle.
 *
 * Ported from @tensorcost/component-library PricingTable (Phase 3a). This is
 * the VIEW only: it receives already-grouped `plans` and renders cards + the
 * billing toggle. The Stripe fetch + tier-grouping that the legacy component
 * baked in lives in the app now (website `useStripePrices`), keeping ui-kit
 * free of any CMS/Stripe coupling.
 *
 * Colors come from the MUI theme (`primary.main`, `text.*`, `divider`,
 * `success.main`) so the toggle, highlighted card, and badge follow the theme.
 */
import { useState, type ReactElement } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSurfaces } from "./_surfaces.js";

export interface PricingFeature {
  text: string;
  included?: boolean;
}

export interface PricingPlan {
  id?: string | number;
  name?: string;
  description?: string;
  /** Numeric dollars (grouped Stripe shape). */
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
  /** Flat string price (e.g. "Contact us", "Free"). */
  price?: string;
  period?: string;
  currency?: string;
  features?: Array<string | PricingFeature>;
  cta?: { text?: string; label?: string; link?: string; href?: string; style?: string; variant?: string };
  highlighted?: boolean;
  badge?: string;
  sortOrder?: number;
}

export interface PricingTableProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  showToggle?: boolean;
  monthlyLabel?: string;
  yearlyLabel?: string;
  backgroundColor?: string;
  className?: string;
}

const CheckIcon = ({ color }: { color: string }): ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = ({ color }: { color: string }): ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

function PricingCard({ plan, billingPeriod }: { plan: PricingPlan; billingPeriod: "monthly" | "yearly" }): ReactElement {
  const { name, description, monthlyPrice, yearlyPrice, price, period, currency = "$", features = [], cta, highlighted, badge } = plan;

  let displayPrice = "";
  let displayPeriod = "";
  if (price !== undefined) {
    displayPrice = price;
    displayPeriod = period || "";
  } else if (monthlyPrice != null || yearlyPrice != null) {
    const wantYearly = billingPeriod === "yearly";
    const usingYearly = wantYearly ? yearlyPrice != null : yearlyPrice != null && monthlyPrice == null;
    const num = usingYearly ? yearlyPrice : monthlyPrice ?? yearlyPrice;
    displayPrice = num === 0 ? `${currency}0` : num != null ? `${currency}${num.toLocaleString("en-US", { maximumFractionDigits: 2 })}` : "";
    displayPeriod = num != null ? `/ ${usingYearly ? "year" : "month"}` : "";
  }

  let savingsHint: string | null = null;
  if (billingPeriod === "yearly" && typeof monthlyPrice === "number" && typeof yearlyPrice === "number" && monthlyPrice > 0 && yearlyPrice > 0 && yearlyPrice < monthlyPrice * 12) {
    const pct = Math.round((1 - yearlyPrice / (monthlyPrice * 12)) * 100);
    if (pct >= 1) savingsHint = `Save ${pct}%`;
  }

  const normFeatures = features.map((f) => (typeof f === "string" ? { text: f, included: true } : f));
  const ctaText = cta?.text || cta?.label;
  const ctaLink = cta?.link || cta?.href;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: "2rem",
        borderRadius: "16px",
        background: "background.paper",
        border: "2px solid",
        borderColor: highlighted ? "primary.main" : "divider",
        transform: highlighted ? { md: "scale(1.04)" } : "none",
        boxShadow: highlighted ? "0 20px 40px rgba(15,23,42,0.12)" : "0 1px 3px rgba(15,23,42,0.05)",
      }}
    >
      {badge && (
        <Box
          sx={{
            position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
            bgcolor: "primary.main", color: "primary.contrastText",
            px: "1rem", py: "0.25rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap",
          }}
        >
          {badge}
        </Box>
      )}
      <Box sx={{ textAlign: "center", mb: "1.5rem" }}>
        <Typography component="h3" sx={{ fontSize: "1.5rem", fontWeight: 600, mb: "0.5rem", color: "text.primary" }}>{name}</Typography>
        {description && <Typography sx={{ fontSize: "0.9rem", color: "text.secondary" }}>{description}</Typography>}
      </Box>
      <Box sx={{ textAlign: "center", mb: "2rem" }}>
        <Box component="span" sx={{ fontSize: "3rem", fontWeight: 700, color: "text.primary" }}>{displayPrice}</Box>
        {displayPeriod && <Box component="span" sx={{ color: "text.secondary", ml: 0.5 }}>{displayPeriod}</Box>}
        {savingsHint && <Box sx={{ mt: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: "success.main" }}>{savingsHint}</Box>}
      </Box>
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: "2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {normFeatures.map((f, i) => (
          <Box component="li" key={i} sx={{ display: "flex", alignItems: "center", gap: "0.75rem", opacity: f.included === false ? 0.5 : 1 }}>
            {f.included === false ? <XIcon color="#b91c1c" /> : <CheckIcon color="#0a7a2f" />}
            <Typography component="span" sx={{ color: "text.primary", fontSize: "0.95rem" }}>{f.text}</Typography>
          </Box>
        ))}
      </Box>
      {ctaText && (
        <Button
          {...(ctaLink ? { href: ctaLink } : {})}
          variant={highlighted ? "contained" : "outlined"}
          fullWidth
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {ctaText}
        </Button>
      )}
    </Box>
  );
}

export function PricingTable({
  title,
  subtitle,
  plans = [],
  showToggle = true,
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  backgroundColor,
  className,
}: PricingTableProps): ReactElement {
  const s = useSurfaces();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const hasBothIntervals = plans.some((p) => p.monthlyPrice != null && p.yearlyPrice != null);
  const shouldShowToggle = showToggle && hasBothIntervals;
  const cols = Math.min(plans.length || 1, 4);

  return (
    <Box component="section" className={className} sx={{ background: backgroundColor || s.band, py: "4rem", px: "2rem" }}>
      {(title || subtitle) && (
        <Box sx={{ textAlign: "center", mb: "2rem" }}>
          {title && <Typography component="h2" sx={{ fontSize: "2.5rem", fontWeight: 700, mb: "0.5rem", color: "text.primary" }}>{title}</Typography>}
          {subtitle && <Typography sx={{ fontSize: "1.2rem", color: "text.secondary" }}>{subtitle}</Typography>}
        </Box>
      )}

      {shouldShowToggle && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", mb: "3rem" }}>
          <Box component="span" sx={{ fontWeight: billingPeriod === "monthly" ? 600 : 400, color: billingPeriod === "monthly" ? "text.primary" : "text.disabled" }}>
            {monthlyLabel}
          </Box>
          <Box
            component="button"
            onClick={() => setBillingPeriod((p) => (p === "monthly" ? "yearly" : "monthly"))}
            aria-label="Toggle billing period"
            sx={{ width: 56, height: 28, borderRadius: "14px", bgcolor: "primary.main", border: "none", cursor: "pointer", position: "relative", p: 0 }}
          >
            <Box sx={{ position: "absolute", top: 2, left: billingPeriod === "yearly" ? 30 : 2, width: 24, height: 24, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
          </Box>
          <Box component="span" sx={{ fontWeight: billingPeriod === "yearly" ? 600 : 400, color: billingPeriod === "yearly" ? "text.primary" : "text.disabled" }}>
            {yearlyLabel}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: `repeat(${cols}, 1fr)` },
          gap: "2rem",
          maxWidth: 1200,
          mx: "auto",
          alignItems: "stretch",
        }}
      >
        {plans.map((plan, i) => (
          <PricingCard key={plan.id ?? i} plan={plan} billingPeriod={billingPeriod} />
        ))}
      </Box>
    </Box>
  );
}

export default PricingTable;
