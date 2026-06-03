/**
 * ROICalculator — interactive "drag your spend → see your savings" widget
 * (from the Pricing design). A slider over annual AI spend drives an animated
 * savings readout that reflects TensorCost's real 75/25 model: the customer
 * keeps 75% of verified savings, TensorCost takes 25%.
 *
 * Two surfaces:
 *   ROICalculatorCard — the standalone interactive card (reused as a SplitHero
 *                       right-side visual).
 *   ROICalculator     — the full CMS section (eyebrow/title/body + the card),
 *                       a real `layout.roi-calculator` type.
 *
 * Brand blue→cyan, dark-mode aware via useSurfaces. Self-contained — does not
 * read MUI `primary`, so the brand accent renders regardless of theme.
 */
import { useState, type ReactElement } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { useSurfaces, type Surfaces } from "./_surfaces.js";

const BLUE = "#3B82F6";
const CYAN = "#06B6D4";
const GREEN = "#10B981";
const GRADIENT = "linear-gradient(135deg, #3B82F6, #06B6D4)";

const cardSx = (s: Surfaces) => ({
  background: s.card,
  border: `1px solid ${s.line}`,
  borderRadius: "20px",
  p: { xs: 3, md: 3.5 },
  boxShadow: s.dark ? "none" : "0 18px 50px -28px rgba(15,23,42,0.35)",
});

const fmt = (n: number): string =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M` : `$${Math.round(n / 1000)}K`;
const fmtFull = (n: number): string => `$${Math.round(n).toLocaleString("en-US")}`;

export interface ROICalculatorCardProps {
  /** Slider bounds + start, in absolute dollars/year. */
  minSpend?: number;
  maxSpend?: number;
  defaultSpend?: number;
  step?: number;
  /** Gross savings rate (0–1) applied to spend. Default 0.38 (the 38% headline). */
  savingsRate?: number;
  /** Customer's share of verified savings (0–1). Default 0.75 (the 75/25 split). */
  customerShare?: number;
}

export function ROICalculatorCard(props: ROICalculatorCardProps): ReactElement {
  // Coerce null/undefined/NaN (Strapi sends null for unset numeric fields) to
  // sane defaults — default params only catch `undefined`, not `null`.
  const num = (v: unknown, d: number): number =>
    typeof v === "number" && Number.isFinite(v) ? v : d;
  const minSpend = num(props.minSpend, 250_000);
  const maxSpend = num(props.maxSpend, 20_000_000);
  const defaultSpend = Math.min(Math.max(num(props.defaultSpend, 3_000_000), minSpend), maxSpend);
  const step = num(props.step, 250_000);
  const savingsRate = num(props.savingsRate, 0.38);
  const customerShare = num(props.customerShare, 0.75);
  const s = useSurfaces();
  const [spend, setSpend] = useState(defaultSpend);

  const gross = spend * savingsRate;
  const net = gross * customerShare;
  const fee = gross * (1 - customerShare);

  return (
    <Box sx={cardSx(s)}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: s.ink2, mb: 0.5 }}>
        Your annual AI spend
      </Typography>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
        <Box sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", color: s.ink }}>
          {fmt(spend)}
        </Box>
        <Typography sx={{ fontSize: 13, color: s.ink3 }}>/year</Typography>
      </Box>
      <Slider
        value={spend}
        min={minSpend}
        max={maxSpend}
        step={step}
        onChange={(_, v) => setSpend(Array.isArray(v) ? (v[0] ?? defaultSpend) : v)}
        aria-label="Annual AI spend"
        sx={{
          mt: 1,
          color: BLUE,
          height: 6,
          "& .MuiSlider-rail": { background: s.line, opacity: 1 },
          "& .MuiSlider-track": { background: GRADIENT, border: "none" },
          "& .MuiSlider-thumb": {
            background: "#FFFFFF",
            border: `2px solid ${BLUE}`,
            width: 20,
            height: 20,
            "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 8px ${BLUE}22` },
          },
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: s.ink3, mt: -0.5 }}>
        <span>{fmt(minSpend)}</span>
        <span>{fmt(maxSpend)}</span>
      </Box>

      <Box sx={{ mt: 2.5, p: 2.5, borderRadius: "14px", background: s.dark ? "rgba(59,130,246,0.10)" : "rgba(59,130,246,0.06)", border: `1px solid ${s.dark ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.15)"}` }}>
        <Typography sx={{ textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, fontWeight: 600, color: s.ink3, mb: 0.5 }}>
          Your net savings / year
        </Typography>
        <Box sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: { xs: "2.4rem", md: "2.9rem" }, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, background: GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {fmtFull(net)}
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, mt: 2 }}>
        <Box>
          <Box sx={{ fontSize: "1.05rem", fontWeight: 700, color: s.ink }}>{fmtFull(gross)}</Box>
          <Typography sx={{ fontSize: 12, color: s.ink3 }}>Verified savings ({Math.round(savingsRate * 100)}%)</Typography>
        </Box>
        <Box>
          <Box sx={{ fontSize: "1.05rem", fontWeight: 700, color: s.ink2 }}>{fmtFull(fee)}</Box>
          <Typography sx={{ fontSize: 12, color: s.ink3 }}>TensorCost fee ({Math.round((1 - customerShare) * 100)}%)</Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 2 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: GREEN }} />
        <Typography sx={{ fontSize: 12, color: s.ink3 }}>
          You keep {Math.round(customerShare * 100)}% of every dollar we verify. Illustrative — actuals depend on your stack.
        </Typography>
      </Box>
    </Box>
  );
}

export interface ROICalculatorProps extends ROICalculatorCardProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  backgroundColor?: string;
}

export function ROICalculator({
  eyebrow = "ROI calculator",
  title = "See what TensorCost pays back.",
  body = "Drag to your annual AI spend. We show verified savings at a conservative rate and the slice you keep — annual contracts, quarterly true-ups, no surprise bills.",
  backgroundColor,
  ...cardProps
}: ROICalculatorProps): ReactElement {
  const s = useSurfaces();
  return (
    <Box component="section" sx={{ background: backgroundColor || s.band, py: { xs: 6, md: 9 }, px: "2rem" }}>
      <Box sx={{ maxWidth: 1180, mx: "auto", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1.05fr" }, gap: { xs: 4, md: 7 }, alignItems: "center" }}>
        <Box>
          {eyebrow && <Typography sx={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.75rem", fontWeight: 600, color: s.ink3, mb: 1.75 }}>{eyebrow}</Typography>}
          {title && <Typography component="h2" sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: { xs: "1.7rem", md: "2rem" }, fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.01em", color: s.ink }}>{title}</Typography>}
          {body && <Typography sx={{ mt: 2.25, fontSize: "1.1rem", lineHeight: 1.55, color: s.ink2 }}>{body}</Typography>}
        </Box>
        <ROICalculatorCard {...cardProps} />
      </Box>
    </Box>
  );
}

export default ROICalculator;
