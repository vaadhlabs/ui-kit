/**
 * DashboardMock — animated product surface for marketing heroes.
 *
 * Restyled to evoke the v2 console's "Money · Explorer" editorial surface:
 * a mono eyebrow, a large blue→cyan gradient hero number that counts up on
 * scroll, a row of mono supporting stats, and an animated spend-by-service
 * bar row. Reads unmistakably as the real TensorCost console while staying
 * theme-adaptive (dark-first, light supported) via useSurfaces.
 *
 * Palette is the brand blue→cyan and is intentionally self-contained — it does
 * NOT read MUI `primary`, so it renders blue even in a differently-themed page.
 */
import { type ReactElement } from "react";
import { Box } from "@mui/material";
import { useScrollProgress } from "./_motion.js";
import { useSurfaces } from "./_surfaces.js";

const BLUE = "#3B82F6";
const CYAN = "#06B6D4";
const GOOD = "#10B981";
const BRAND_GRADIENT = `linear-gradient(135deg, ${BLUE}, ${CYAN})`;

/** Supporting stats mirroring the console's Explorer rail (actual / forecast / budget). */
const STATS: { o: string; v: string }[] = [
  { o: "ACTUAL", v: "$50.1k" },
  { o: "FORECAST EOQ", v: "$74.6k" },
  { o: "BUDGET", v: "$172.0k" },
];

const BARS = [
  { l: "Training", v: 100, c: BLUE },
  { l: "Inference", v: 72, c: CYAN },
  { l: "Fine-tune", v: 54, c: "#8B5CF6" },
  { l: "Dev", v: 33, c: GOOD },
  { l: "Idle", v: 21, c: "#F59E0B" },
];

const fmt = (n: number): string => n.toLocaleString("en-US");

function SpendBars({ p }: { p: number }): ReactElement {
  const s = useSurfaces();
  const height = 104;
  const max = Math.max(...BARS.map((b) => b.v));
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, height }}>
      {BARS.map((b) => (
        <Box key={b.l} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, height: "100%", justifyContent: "flex-end" }}>
          <Box sx={{ width: "100%", maxWidth: 44, borderRadius: "5px 5px 0 0", background: b.c, height: (b.v / max) * (height - 26) * p }} />
          <Box component="span" sx={{ fontSize: 11, color: s.ink3, whiteSpace: "nowrap", fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{b.l}</Box>
        </Box>
      ))}
    </Box>
  );
}

export interface DashboardMockProps {
  /** Window-chrome URL label. */
  url?: string;
  className?: string;
}

export function DashboardMock({ url = "console.tensorcost.com", className }: DashboardMockProps): ReactElement {
  const s = useSurfaces();
  const [ref, p] = useScrollProgress(1200);
  const spend = Math.round(50118 * p);

  return (
    <Box
      ref={ref}
      className={className}
      sx={{
        minWidth: 0,
        background: s.card,
        border: `1px solid ${s.line}`,
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: s.dark ? "0 20px 50px rgba(0,0,0,0.5)" : "0 20px 50px rgba(15,23,42,0.12), 0 6px 16px rgba(15,23,42,0.06)",
        fontFamily: "Inter, system-ui, sans-serif",
        color: s.ink,
      }}
    >
      {/* window chrome */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, px: 1.75, py: 1.25, borderBottom: `1px solid ${s.line}`, background: s.band }}>
        <Box sx={{ display: "flex", gap: 0.75 }}>
          {["#EF4444", "#F59E0B", "#10B981"].map((c) => (
            <Box key={c} sx={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.85 }} />
          ))}
        </Box>
        <Box sx={{ fontSize: 12, color: s.ink3, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{url}</Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5, fontSize: 11, color: s.ink3 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: "50%", background: GOOD }} /> live
        </Box>
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* mono eyebrow + live-data chip */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.14em", color: s.ink3, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
            MONEY · EXPLORER
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, fontSize: 9.5, fontWeight: 600, letterSpacing: "0.08em", px: 1, py: 0.4, borderRadius: "5px", color: GOOD, border: `1px solid ${GOOD}55`, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", background: GOOD }} /> DATA LIVE
          </Box>
        </Box>

        {/* gradient hero number (counts up on scroll) */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              fontFamily: "'Inter Tight', Inter, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: { xs: 40, sm: 52 },
              lineHeight: 1,
              letterSpacing: "-0.04em",
              background: BRAND_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 26px rgba(59,130,246,0.28))",
            }}
          >
            ${fmt(spend)}
          </Box>
          <Box sx={{ fontSize: 13, fontWeight: 600, color: GOOD, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>▾ 100%</Box>
        </Box>
        <Box sx={{ fontSize: 12, color: s.ink3, mb: 2 }}>30-day spend across five providers · day-over-day</Box>

        {/* supporting mono stats (actual / forecast / budget) */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1.5, mb: 2, pb: 2, borderBottom: `1px solid ${s.line}` }}>
          {STATS.map((k) => (
            <Box key={k.o}>
              <Box sx={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: s.ink3, mb: 0.5, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>{k.o}</Box>
              <Box sx={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>{k.v}</Box>
            </Box>
          ))}
        </Box>

        {/* spend by service */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.25 }}>
          <Box sx={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", color: s.ink3, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>SPEND BY SERVICE</Box>
          <Box sx={{ fontSize: 11, color: s.ink3, fontFamily: "'JetBrains Mono', ui-monospace, monospace" }}>last 30d</Box>
        </Box>
        <SpendBars p={p} />
      </Box>
    </Box>
  );
}

export default DashboardMock;
