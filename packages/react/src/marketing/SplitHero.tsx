/**
 * SplitHero — the "Claude design" split hero (Phase 5): headline + lead + CTAs
 * and (optional) animated stats on the left, an animated DashboardMock on the
 * right, with a soft brand-gradient glow behind it.
 *
 * Blue→cyan brand look, self-contained (does not depend on MUI `primary`), so
 * it renders the signature gradient regardless of the surrounding theme.
 */
import { type ReactElement, type ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DashboardMock } from "./DashboardMock.js";
import { SavingsLine, MiniDonut, MiniBars, UtilHeatmap } from "./MarketingCharts.js";
import { ROICalculatorCard } from "./ROICalculator.js";
import { useScrollProgress } from "./_motion.js";
import { useSurfaces, type Surfaces } from "./_surfaces.js";

const GRADIENT = "linear-gradient(135deg, #3B82F6, #06B6D4)";
const BLUE = "#3B82F6";

export interface SplitHeroCta {
  text?: string;
  label?: string;
  link?: string;
  href?: string;
}

export interface SplitHeroStat {
  /** Number (count-up) or string. Numeric strings like "40" count up too;
   *  non-numeric values (e.g. "75/25") render static. Matches the Strapi
   *  shared.stat shape so hero stats can be CMS-driven. */
  value: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  /** Render this stat's number in the brand gradient. */
  accent?: boolean;
}

export interface SplitHeroProps {
  eyebrow?: string;
  title?: string;
  /** Substring of `title` to render in the brand gradient (the signature keyword). */
  gradientText?: string;
  subtitle?: string;
  trustLine?: string;
  cta?: SplitHeroCta;
  secondaryCta?: SplitHeroCta;
  stats?: SplitHeroStat[];
  /** Which graphic fills the right column. "none" renders a centered hero. */
  visual?: "dashboard" | "savings" | "roi" | "viz" | "none";
  backgroundColor?: string;
  className?: string;
}

const panelSx = (s: Surfaces) => ({
  background: s.card,
  border: `1px solid ${s.line}`,
  borderRadius: "20px",
  p: { xs: 2.5, md: 3 },
  boxShadow: s.dark ? "none" : "0 18px 50px -28px rgba(15,23,42,0.35)",
});

/** Right-column graphic, framed in a card for the chart variants. */
function HeroVisual({ visual, s }: { visual: SplitHeroProps["visual"]; s: Surfaces }): ReactElement {
  if (visual === "roi") return <ROICalculatorCard />;
  if (visual === "savings") {
    return (
      <Box sx={panelSx(s)}>
        <Box sx={{ fontSize: 13, fontWeight: 600, color: s.ink2, mb: 1.5 }}>Projected vs. controlled spend</Box>
        <SavingsLine height={280} />
      </Box>
    );
  }
  if (visual === "viz") {
    return (
      <Box sx={panelSx(s)}>
        <Box sx={{ fontSize: 13, fontWeight: 600, color: s.ink2, mb: 2 }}>What the platform surfaces</Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5, alignItems: "center" }}>
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <MiniDonut value={32} label="recoverable" color="#EF4444" size={118} />
          </Box>
          <Box><MiniBars height={120} /></Box>
        </Box>
        <Box sx={{ mt: 2 }}><UtilHeatmap rows={4} cols={12} /></Box>
        <Box sx={{ display: "flex", gap: 2.5, mt: 1.5, fontSize: 12, color: s.ink3, flexWrap: "wrap" }}>
          <span>Idle / recoverable spend</span>
          <span>Spend by service</span>
          <span>Live utilization</span>
        </Box>
      </Box>
    );
  }
  return <DashboardMock />;
}

const gradientSx = {
  background: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
} as const;

function renderTitle(title?: string, gradientText?: string): ReactNode {
  if (!title) return null;
  if (gradientText && title.includes(gradientText)) {
    const [before, after] = title.split(gradientText);
    return (
      <>
        {before}
        <Box component="span" sx={gradientSx}>{gradientText}</Box>
        {after}
      </>
    );
  }
  return title;
}

function StatItem({ stat, accent }: { stat: SplitHeroStat; accent: boolean }): ReactElement {
  const s = useSurfaces();
  const [ref, p] = useScrollProgress(1400);
  const str = String(stat.value);
  const m = str.match(/^([\d,]+(?:\.\d+)?)$/);
  let shown: string = str;
  if (m) {
    const num = parseFloat((m[1] ?? "0").replace(/,/g, ""));
    shown = num % 1 !== 0 ? (num * p).toFixed(1) : Math.round(num * p).toLocaleString("en-US");
  }
  return (
    <Box ref={ref}>
      <Box sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, ...(accent ? gradientSx : { color: s.ink }) }}>
        {stat.prefix || ""}{shown}{stat.suffix || ""}
      </Box>
      <Box sx={{ fontSize: 13, color: s.ink3, mt: 0.75, fontWeight: 500 }}>{stat.label}</Box>
    </Box>
  );
}

export function SplitHero({
  eyebrow,
  title,
  gradientText,
  subtitle,
  trustLine,
  cta,
  secondaryCta,
  stats,
  visual = "dashboard",
  backgroundColor,
  className,
}: SplitHeroProps): ReactElement {
  const sf = useSurfaces();
  const ctaText = cta?.text || cta?.label;
  const ctaLink = cta?.link || cta?.href;
  const secText = secondaryCta?.text || secondaryCta?.label;
  const secLink = secondaryCta?.link || secondaryCta?.href;
  // "none" → centered single-column hero (clean modern look, no repeated card).
  const centered = visual === "none";

  return (
    <Box component="section" className={className} sx={{ background: backgroundColor || sf.page, py: { xs: 6, md: centered ? 11 : 9 }, px: "2rem", overflow: "hidden" }}>
      <Box
        sx={{
          maxWidth: centered ? 820 : 1180,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: centered ? "1fr" : { xs: "1fr", md: "1.05fr 1fr" },
          gap: { xs: 5, md: 7 },
          alignItems: "center",
        }}
      >
        {/* Left column */}
        <Box sx={centered ? { textAlign: "center" } : undefined}>
          {eyebrow && (
            <Box
              sx={{
                display: "inline-flex", alignItems: "center", gap: 1,
                border: `1px solid ${sf.line}`, borderRadius: "999px",
                px: 1.5, py: 0.75, fontSize: "0.85rem", fontWeight: 600, color: sf.ink2, mb: 2.5,
              }}
            >
              <Box sx={{ width: 18, height: 18, borderRadius: "50%", background: GRADIENT }} />
              {eyebrow}
            </Box>
          )}
          <Typography
            component="h1"
            sx={{ fontFamily: "'Inter Tight', Inter, sans-serif", fontSize: { xs: "2.4rem", md: "3.4rem" }, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: sf.ink }}
          >
            {renderTitle(title, gradientText)}
          </Typography>
          {subtitle && (
            <Typography sx={{ fontSize: "1.15rem", color: sf.ink2, lineHeight: 1.5, mt: 2.5, maxWidth: 520, ...(centered ? { mx: "auto" } : {}) }}>{subtitle}</Typography>
          )}
          <Box sx={{ display: "flex", gap: 1.5, mt: 3.5, flexWrap: "wrap", ...(centered ? { justifyContent: "center" } : {}) }}>
            {ctaText && (
              <Button {...(ctaLink ? { href: ctaLink } : {})} variant="contained" size="large" sx={{ textTransform: "none", fontWeight: 600, px: 3, py: 1.25, background: BLUE, "&:hover": { background: "#2563EB" } }}>
                {ctaText} →
              </Button>
            )}
            {secText && (
              <Button {...(secLink ? { href: secLink } : {})} variant="outlined" size="large" sx={{ textTransform: "none", fontWeight: 600, px: 3, py: 1.25, color: sf.ink, borderColor: sf.line }}>
                {secText}
              </Button>
            )}
          </Box>
          {trustLine && (
            <Typography sx={{ mt: 2.5, fontSize: 13, color: sf.ink3, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{trustLine}</Typography>
          )}
          {stats && stats.length > 0 && (
            <Box sx={{ display: "flex", gap: 4.5, mt: 4.5, flexWrap: "wrap", ...(centered ? { justifyContent: "center" } : {}) }}>
              {stats.map((s, i) => <StatItem key={i} stat={s} accent={s.accent ?? i === 0} />)}
            </Box>
          )}
        </Box>

        {/* Right column — graphic with gradient glow (omitted when centered) */}
        {!centered && (
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", inset: "-10% -8% -10% 6%", background: GRADIENT, filter: "blur(60px)", opacity: 0.16, borderRadius: "40px", zIndex: 0 }} />
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <HeroVisual visual={visual} s={sf} />
          </Box>
        </Box>
        )}
      </Box>
    </Box>
  );
}

export default SplitHero;
